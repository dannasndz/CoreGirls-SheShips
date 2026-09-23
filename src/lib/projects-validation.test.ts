import { describe, it, expect } from "vitest";
import {
  canCreateProject,
  canExpressInterest,
  canManageProject,
  canRequestJoin,
  getJoinBlockReason,
  isProjectEstado,
  isProjectModalidad,
  isSolicitudEstado,
  normalizeEncargadaIds,
  validateProjectInput,
  PROJECT_ESTADOS,
  PROJECT_MODALIDADES,
  NOMBRE_MAX,
  DESCRIPCION_MAX,
  IMAGENES_MAX,
} from "@/lib/projects-validation";

const validInput = {
  nombre: "Mentoría en Robótica",
  descripcion: "Programa de mentoría para alumnas interesadas en robótica.",
  perfilInteresadas: "Alumnas de ingeniería",
  estado: "abierto",
  lugar: "Facultad de Ingeniería, UABC",
  modalidad: "presencial",
  cupoMaximo: 20,
  areasSTEM: ["INGENIERIA"],
};

describe("roles", () => {
  it("permite crear a Maestra/Académica y Egresada", () => {
    expect(canCreateProject("ACADEMICA")).toBe(true);
    expect(canCreateProject("EGRESADA")).toBe(true);
    expect(canCreateProject("ALUMNA")).toBe(false);
    expect(canCreateProject(null)).toBe(false);
  });

  it("solo las Alumnas pueden expresar interés", () => {
    expect(canExpressInterest("ALUMNA")).toBe(true);
    expect(canExpressInterest("ACADEMICA")).toBe(false);
  });

  it("las encargadas pueden gestionar el proyecto", () => {
    expect(canManageProject("u1", ["u1", "u2"])).toBe(true);
    expect(canManageProject("u3", ["u1", "u2"])).toBe(false);
    expect(canManageProject(null, ["u1"])).toBe(false);
  });

  it("las encargadas no pueden solicitar entrar a su propio proyecto", () => {
    expect(canRequestJoin("u1", ["u1", "u2"])).toBe(false);
    expect(canRequestJoin("u3", ["u1", "u2"])).toBe(true);
    expect(canRequestJoin(null, ["u1"])).toBe(false);
  });
});

describe("catálogos", () => {
  it("el estado incluye abierto, en progreso y cerrado", () => {
    expect([...PROJECT_ESTADOS]).toEqual(["abierto", "en_progreso", "cerrado"]);
  });

  it("la modalidad incluye presencial, virtual e híbrido", () => {
    expect([...PROJECT_MODALIDADES]).toEqual([
      "presencial",
      "virtual",
      "hibrido",
    ]);
  });

  it("isProjectEstado valida solo valores permitidos", () => {
    expect(isProjectEstado("abierto")).toBe(true);
    expect(isProjectEstado("concluido")).toBe(false);
    expect(isProjectEstado(42)).toBe(false);
  });

  it("isProjectModalidad valida solo valores permitidos", () => {
    expect(isProjectModalidad("virtual")).toBe(true);
    expect(isProjectModalidad("online")).toBe(false);
  });

  it("isSolicitudEstado valida solo valores permitidos", () => {
    expect(isSolicitudEstado("pendiente")).toBe(true);
    expect(isSolicitudEstado("aceptada")).toBe(true);
    expect(isSolicitudEstado("rechazada")).toBe(true);
    expect(isSolicitudEstado("cancelada")).toBe(false);
  });
});

describe("normalizeEncargadaIds", () => {
  it("incluye siempre a quien crea el proyecto y quita duplicados", () => {
    expect(normalizeEncargadaIds(["u2", "u1", "u2"], "u1")).toEqual([
      "u1",
      "u2",
    ]);
  });

  it("funciona con un único id y con valores vacíos", () => {
    expect(normalizeEncargadaIds("u2", "u1")).toEqual(["u1", "u2"]);
    expect(normalizeEncargadaIds(null, "u1")).toEqual(["u1"]);
    expect(normalizeEncargadaIds(["", "  "], "u1")).toEqual(["u1"]);
  });
});

describe("getJoinBlockReason", () => {
  const base = {
    isEncargada: false,
    estado: "abierto",
    cupoMaximo: 5,
    acceptedCount: 0,
    fechaFin: null,
    existingEstado: null,
    now: new Date("2026-06-01T12:00:00Z"),
  };

  it("permite solicitar cuando no hay bloqueos", () => {
    expect(getJoinBlockReason(base)).toBeNull();
  });

  it("bloquea a las encargadas", () => {
    expect(getJoinBlockReason({ ...base, isEncargada: true })).toBe("encargada");
  });

  it("bloquea si el proyecto está concluido/cerrado", () => {
    expect(getJoinBlockReason({ ...base, estado: "cerrado" })).toBe("cerrado");
  });

  it("bloquea si el cupo está lleno", () => {
    expect(
      getJoinBlockReason({ ...base, cupoMaximo: 3, acceptedCount: 3 })
    ).toBe("lleno");
    expect(
      getJoinBlockReason({ ...base, cupoMaximo: null, acceptedCount: 99 })
    ).toBeNull();
  });

  it("bloquea después de la fecha de fin", () => {
    expect(
      getJoinBlockReason({ ...base, fechaFin: new Date("2026-05-01") })
    ).toBe("fecha_fin");
    expect(
      getJoinBlockReason({ ...base, fechaFin: new Date("2026-07-01") })
    ).toBeNull();
  });

  it("bloquea solicitudes pendientes o membresías existentes", () => {
    expect(getJoinBlockReason({ ...base, existingEstado: "pendiente" })).toBe(
      "pendiente"
    );
    expect(getJoinBlockReason({ ...base, existingEstado: "aceptada" })).toBe(
      "miembro"
    );
  });

  it("prioriza encargada sobre cerrado/lleno", () => {
    expect(
      getJoinBlockReason({
        ...base,
        isEncargada: true,
        estado: "cerrado",
        acceptedCount: 5,
      })
    ).toBe("encargada");
  });
});

describe("validateProjectInput", () => {
  it("acepta un proyecto válido y normaliza los campos", () => {
    const result = validateProjectInput({
      ...validInput,
      nombre: "  Mentoría  ",
      descripcion: "  Descripción  ",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.nombre).toBe("Mentoría");
    expect(result.data.descripcion).toBe("Descripción");
    expect(result.data.estado).toBe("abierto");
    expect(result.data.modalidad).toBe("presencial");
    expect(result.data.cupoMaximo).toBe(20);
    expect(result.data.areasSTEM).toEqual(["INGENIERIA"]);
    expect(result.data.fechaInicio).toBeNull();
    expect(result.data.fechaFin).toBeNull();
    expect(result.data.imagenes).toEqual([]);
  });

  it("acepta fechas de inicio y fin válidas", () => {
    const result = validateProjectInput({
      ...validInput,
      fechaInicio: "2026-10-01",
      fechaFin: "2026-12-01",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.fechaInicio).toBeInstanceOf(Date);
    expect(result.data.fechaFin).toBeInstanceOf(Date);
  });

  it("rechaza fecha de fin anterior a la de inicio", () => {
    const result = validateProjectInput({
      ...validInput,
      fechaInicio: "2026-12-01",
      fechaFin: "2026-10-01",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toBe("fecha_fin_before_inicio");
  });

  it("rechaza fechas inválidas", () => {
    const a = validateProjectInput({ ...validInput, fechaInicio: "no-fecha" });
    expect(a.ok).toBe(false);
    if (!a.ok) expect(a.error).toBe("fecha_inicio_invalid");

    const b = validateProjectInput({ ...validInput, fechaFin: "no-fecha" });
    expect(b.ok).toBe(false);
    if (!b.ok) expect(b.error).toBe("fecha_fin_invalid");
  });

  it("acepta varias áreas STEM y elimina duplicados", () => {
    const result = validateProjectInput({
      ...validInput,
      areasSTEM: ["CIENCIA", "TECNOLOGIA", "CIENCIA"],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.areasSTEM).toEqual(["CIENCIA", "TECNOLOGIA"]);
  });

  it("acepta imágenes válidas y descarta las vacías", () => {
    const result = validateProjectInput({
      ...validInput,
      imagenes: ["https://example.com/a.png", "", "http://x.io/b.jpg"],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.imagenes).toEqual([
      "https://example.com/a.png",
      "http://x.io/b.jpg",
    ]);
  });

  it("rechaza imágenes no válidas o demasiadas", () => {
    const bad = validateProjectInput({
      ...validInput,
      imagenes: ["not-a-url"],
    });
    expect(bad.ok).toBe(false);
    if (!bad.ok) expect(bad.error).toBe("imagenes_invalid");

    const tooMany = validateProjectInput({
      ...validInput,
      imagenes: Array.from(
        { length: IMAGENES_MAX + 1 },
        (_, i) => `https://example.com/${i}.png`
      ),
    });
    expect(tooMany.ok).toBe(false);
    if (!tooMany.ok) expect(tooMany.error).toBe("imagenes_invalid");

    const notArray = validateProjectInput({ ...validInput, imagenes: "x" });
    expect(notArray.ok).toBe(false);
  });

  it("cupo y áreas son opcionales", () => {
    const result = validateProjectInput({
      ...validInput,
      cupoMaximo: null,
      areasSTEM: null,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.cupoMaximo).toBeNull();
    expect(result.data.areasSTEM).toEqual([]);
  });

  it.each([
    ["nombre_required", { ...validInput, nombre: "   " }],
    ["descripcion_required", { ...validInput, descripcion: "" }],
    ["perfil_required", { ...validInput, perfilInteresadas: "" }],
    ["estado_invalid", { ...validInput, estado: "concluido" }],
    ["lugar_required", { ...validInput, lugar: "" }],
    ["modalidad_invalid", { ...validInput, modalidad: "online" }],
    ["cupo_invalid", { ...validInput, cupoMaximo: 0 }],
    ["cupo_invalid", { ...validInput, cupoMaximo: -3 }],
    ["cupo_invalid", { ...validInput, cupoMaximo: 2.5 }],
    ["cupo_invalid", { ...validInput, cupoMaximo: "abc" }],
    ["area_invalid", { ...validInput, areasSTEM: ["ARTES"] }],
    ["area_invalid", { ...validInput, areasSTEM: ["CIENCIA", "ARTES"] }],
  ])("rechaza %s", (error, input) => {
    const result = validateProjectInput(input);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toBe(error);
  });

  it("rechaza un nombre demasiado largo", () => {
    const result = validateProjectInput({
      ...validInput,
      nombre: "a".repeat(NOMBRE_MAX + 1),
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toBe("nombre_too_long");
  });

  it("rechaza una descripción demasiado larga", () => {
    const result = validateProjectInput({
      ...validInput,
      descripcion: "a".repeat(DESCRIPCION_MAX + 1),
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toBe("descripcion_too_long");
  });
});
