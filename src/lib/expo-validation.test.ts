import { describe, it, expect } from "vitest";
import {
  validateExpoDemographics,
  isValidGrade,
  EXPO_AGE_MIN,
  EXPO_AGE_MAX,
} from "@/lib/expo-validation";

const valid = {
  edad: 15,
  escuela: "Prepa Federal",
  nivel: "Preparatoria",
  grado: "2°",
  municipio: "Tijuana",
  genero: "Prefiero no decir",
};

describe("validateExpoDemographics", () => {
  it("acepta datos válidos y normaliza la escuela", () => {
    const result = validateExpoDemographics({ ...valid, escuela: "  Prepa  " });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.edad).toBe(15);
    expect(result.data.escuela).toBe("Prepa");
    expect(result.data.genero).toBe("Prefiero no decir");
  });

  it("acepta los límites de edad", () => {
    expect(validateExpoDemographics({ ...valid, edad: EXPO_AGE_MIN }).ok).toBe(
      true
    );
    expect(validateExpoDemographics({ ...valid, edad: EXPO_AGE_MAX }).ok).toBe(
      true
    );
  });

  it("rechaza edades fuera de rango o no enteras", () => {
    const below = validateExpoDemographics({ ...valid, edad: EXPO_AGE_MIN - 1 });
    expect(!below.ok && below.error).toBe("edad_range");
    const above = validateExpoDemographics({ ...valid, edad: EXPO_AGE_MAX + 1 });
    expect(!above.ok && above.error).toBe("edad_range");
    const decimal = validateExpoDemographics({ ...valid, edad: 15.5 });
    expect(!decimal.ok && decimal.error).toBe("edad_invalid");
    const nan = validateExpoDemographics({ ...valid, edad: "abc" });
    expect(!nan.ok && nan.error).toBe("edad_invalid");
    const empty = validateExpoDemographics({ ...valid, edad: "" });
    expect(!empty.ok && empty.error).toBe("edad_required");
  });

  it("exige escuela y limita su longitud", () => {
    const empty = validateExpoDemographics({ ...valid, escuela: "  " });
    expect(!empty.ok && empty.error).toBe("escuela_required");
    const long = validateExpoDemographics({
      ...valid,
      escuela: "a".repeat(101),
    });
    expect(!long.ok && long.error).toBe("escuela_too_long");
  });

  it("valida nivel, grado y municipio", () => {
    const badNivel = validateExpoDemographics({ ...valid, nivel: "Doctorado" });
    expect(!badNivel.ok && badNivel.error).toBe("nivel_invalid");

    const badGrado = validateExpoDemographics({
      ...valid,
      nivel: "Primaria",
      grado: "7°",
    });
    expect(!badGrado.ok && badGrado.error).toBe("grado_invalid");

    const badMunicipio = validateExpoDemographics({
      ...valid,
      municipio: "Guadalajara",
    });
    expect(!badMunicipio.ok && badMunicipio.error).toBe("municipio_invalid");
  });

  it("el género es opcional pero debe ser válido", () => {
    const none = validateExpoDemographics({ ...valid, genero: "" });
    expect(none.ok).toBe(true);
    if (none.ok) expect(none.data.genero).toBeNull();

    const bad = validateExpoDemographics({ ...valid, genero: "Otro valor" });
    expect(!bad.ok && bad.error).toBe("genero_invalid");
  });

  it("acepta Universidad con semestres 1° a 10°", () => {
    const result = validateExpoDemographics({
      ...valid,
      nivel: "Universidad",
      grado: "10°",
    });
    expect(result.ok).toBe(true);
  });
});

describe("isValidGrade", () => {
  it("valida grados por nivel", () => {
    expect(isValidGrade("Primaria", "6°")).toBe(true);
    expect(isValidGrade("Primaria", "7°")).toBe(false);
    expect(isValidGrade("Secundaria", "3°")).toBe(true);
    expect(isValidGrade("Preparatoria", "4°")).toBe(false);
    expect(isValidGrade("Universidad", "10°")).toBe(true);
    expect(isValidGrade("Universidad", "11°")).toBe(false);
  });
});
