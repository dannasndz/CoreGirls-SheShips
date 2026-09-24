import { describe, it, expect } from "vitest";
import {
  canCreateEvent,
  validateEventInput,
  isEventModalidad,
  isEventEstado,
  modalidadToDb,
  modalidadFromDb,
  estadoToDb,
  estadoFromDb,
  EVENT_TITLE_MAX,
  EVENT_DESCRIPTION_MAX,
} from "@/lib/events-validation";

const validInput = {
  nombre: "Taller de Mujeres en IA",
  descripcion: "Un taller práctico sobre inteligencia artificial.",
  fecha: "2026-11-20",
  lugar: "Facultad de Ingeniería, UABC",
  modalidad: "presencial",
  cupoMaximo: 30,
  estado: "publicado",
};

describe("canCreateEvent", () => {
  it("permite a Académica y Egresada", () => {
    expect(canCreateEvent({ userType: "ACADEMICA" })).toBe(true);
    expect(canCreateEvent({ userType: "EGRESADA" })).toBe(true);
  });

  it("permite a Alumna (la verificación no se toma en cuenta por ahora)", () => {
    expect(canCreateEvent({ userType: "ALUMNA" })).toBe(true);
    expect(
      canCreateEvent({ userType: "ALUMNA", accountStatus: "PENDING" })
    ).toBe(true);
    expect(
      canCreateEvent({ userType: "ALUMNA", accountStatus: "VERIFIED" })
    ).toBe(true);
  });

  it("niega usuarios sin tipo de cuenta", () => {
    expect(canCreateEvent({ userType: null })).toBe(false);
    expect(canCreateEvent({})).toBe(false);
  });
});

describe("modalidad y estado", () => {
  it("mapea modalidad canónica a valor de BD y viceversa", () => {
    expect(modalidadToDb("presencial")).toBe("in-person");
    expect(modalidadToDb("virtual")).toBe("remote");
    expect(modalidadToDb("hibrido")).toBe("hybrid");
    expect(modalidadFromDb("in-person")).toBe("presencial");
    expect(modalidadFromDb("remote")).toBe("virtual");
    expect(modalidadFromDb("hybrid")).toBe("hibrido");
  });

  it("acepta alias antiguos y nuevos de modalidad", () => {
    expect(isEventModalidad("presencial")).toBe(true);
    expect(isEventModalidad("in-person")).toBe(true);
    expect(isEventModalidad("online")).toBe(false);
  });

  it("mapea estado canónico a valor de BD y viceversa", () => {
    expect(estadoToDb("borrador")).toBe("BORRADOR");
    expect(estadoToDb("publicado")).toBe("PUBLICADO");
    expect(estadoFromDb("BORRADOR")).toBe("borrador");
    expect(estadoFromDb("PUBLICADO")).toBe("publicado");
  });

  it("isEventEstado valida borrador/publicado en ambos formatos", () => {
    expect(isEventEstado("borrador")).toBe(true);
    expect(isEventEstado("publicado")).toBe(true);
    expect(isEventEstado("BORRADOR")).toBe(true);
    expect(isEventEstado("PUBLICADO")).toBe(true);
    expect(isEventEstado("cancelado")).toBe(false);
  });
});

describe("validateEventInput", () => {
  it("acepta un evento publicado válido y normaliza el estado y la modalidad", () => {
    const result = validateEventInput(validInput);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.title).toBe("Taller de Mujeres en IA");
    expect(result.data.modalityDb).toBe("in-person");
    expect(result.data.estadoDb).toBe("PUBLICADO");
    expect(result.data.participantsLimit).toBe(30);
    expect(result.data.date).toBeInstanceOf(Date);
    expect(result.data.imageUrl).toBeNull();
  });

  it("acepta una foto opcional", () => {
    const result = validateEventInput({
      ...validInput,
      foto: "https://example.com/foto.png",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.imageUrl).toBe("https://example.com/foto.png");
  });

  it("un borrador con un solo campo es válido", () => {
    const result = validateEventInput({ estado: "borrador", nombre: "Idea" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.title).toBe("Idea");
    expect(result.data.estadoDb).toBe("BORRADOR");
  });

  it("un borrador vacío es rechazado", () => {
    const result = validateEventInput({ estado: "borrador" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toBe("vacio");
  });

  it("un borrador no exige fecha, lugar, cupo ni modalidad", () => {
    const result = validateEventInput({
      estado: "borrador",
      descripcion: "Solo descripción",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.estadoDb).toBe("BORRADOR");
    expect(result.data.location).toBeNull();
  });

  it("rechaza publicar un evento con fecha/hora en el pasado", () => {
    const result = validateEventInput({
      ...validInput,
      fecha: "2020-01-01",
      hora: "10:00",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toBe("fecha_pasada");
  });

  it("permite guardar como borrador una fecha pasada", () => {
    const result = validateEventInput({
      estado: "borrador",
      nombre: "Idea vieja",
      fecha: "2020-01-01",
      hora: "10:00",
    });
    expect(result.ok).toBe(true);
  });

  it("publicar un evento virtual no exige lugar", () => {
    const result = validateEventInput({
      nombre: "Charla online",
      descripcion: "Charla virtual",
      fecha: "2026-11-20",
      modalidad: "virtual",
      cupoMaximo: 100,
      estado: "publicado",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.modalityDb).toBe("remote");
    expect(result.data.location).toBeNull();
  });

  it("acepta los alias en inglés del formulario", () => {
    const result = validateEventInput({
      title: "AI Workshop",
      description: "Desc",
      date: "2026-11-20",
      location: "Online",
      modality: "remote",
      participantsLimit: 10,
      estado: "borrador",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.modalityDb).toBe("remote");
    expect(result.data.estadoDb).toBe("BORRADOR");
  });

  it.each([
    ["titulo_required", { ...validInput, nombre: "  " }],
    ["descripcion_required", { ...validInput, descripcion: "" }],
    ["fecha_required", { ...validInput, fecha: "" }],
    ["fecha_invalid", { ...validInput, fecha: "no-fecha" }],
    ["lugar_required", { ...validInput, lugar: "   " }],
    ["modalidad_invalid", { ...validInput, modalidad: "online" }],
    ["cupo_invalid", { ...validInput, cupoMaximo: 0 }],
    ["cupo_invalid", { ...validInput, cupoMaximo: -2 }],
    ["cupo_invalid", { ...validInput, cupoMaximo: 1.5 }],
    ["cupo_invalid", { ...validInput, cupoMaximo: "x" }],
    ["estado_invalid", { ...validInput, estado: "cancelado" }],
    ["imagen_invalid", { ...validInput, foto: "no-url" }],
  ])("rechaza al publicar: %s", (error, input) => {
    const result = validateEventInput(input);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toBe(error);
  });

  it("rechaza nombre y descripción demasiado largos", () => {
    const longTitle = validateEventInput({
      ...validInput,
      nombre: "a".repeat(EVENT_TITLE_MAX + 1),
    });
    expect(longTitle.ok).toBe(false);
    if (!longTitle.ok) expect(longTitle.error).toBe("titulo_too_long");

    const longDesc = validateEventInput({
      ...validInput,
      descripcion: "a".repeat(EVENT_DESCRIPTION_MAX + 1),
    });
    expect(longDesc.ok).toBe(false);
    if (!longDesc.ok) expect(longDesc.error).toBe("descripcion_too_long");
  });
});
