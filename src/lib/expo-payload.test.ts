import { describe, it, expect } from "vitest";
import { buildExpoRow, EXPO_SHEET_HEADERS } from "@/lib/expo-payload";
import type { ExpoDemographics } from "@/lib/expo-validation";

const demographics: ExpoDemographics = {
  estudiante: true,
  edad: 15,
  escuela: "Prepa Federal",
  nivel: "Preparatoria",
  grado: "2°",
  municipio: "Tijuana",
  genero: "No binario",
};

describe("buildExpoRow", () => {
  it("arma la fila con todos los campos", () => {
    const row = buildExpoRow({
      submissionId: "abc-123",
      demographics,
      score: { S: 5, T: 4, E: 3, M: 3 },
      topType: "S",
      careerId: "biologist",
      locale: "es",
      timestamp: new Date("2026-06-15T12:00:00.000Z"),
    });

    expect(row).toEqual({
      timestamp: "2026-06-15T12:00:00.000Z",
      submissionId: "abc-123",
      edad: 15,
      escuela: "Prepa Federal",
      grado: "Preparatoria 2°",
      municipio: "Tijuana",
      genero: "No binario",
      estudiante: "Sí",
      idioma: "es",
      S: 5,
      T: 4,
      E: 3,
      M: 3,
      tipoTop: "S",
      carrera: "biologist",
    });
  });

  it("usa cadena vacía cuando el género es nulo", () => {
    const row = buildExpoRow({
      submissionId: "x",
      demographics: { ...demographics, genero: null },
      score: { S: 0, T: 0, E: 1, M: 0 },
      topType: "E",
      careerId: "civil",
      locale: "en",
    });
    expect(row.genero).toBe("");
    expect(row.idioma).toBe("en");
  });

  it("para no estudiantes deja grado vacío y marca No", () => {
    const row = buildExpoRow({
      submissionId: "y",
      demographics: {
        estudiante: false,
        edad: 30,
        escuela: "",
        nivel: null,
        grado: "",
        municipio: "Mexicali",
        genero: null,
      },
      score: { S: 1, T: 0, E: 0, M: 0 },
      topType: "S",
      careerId: "biologist",
      locale: "es",
    });
    expect(row.estudiante).toBe("No");
    expect(row.escuela).toBe("");
    expect(row.grado).toBe("");
  });

  it("arma el grado de Posgrado", () => {
    const row = buildExpoRow({
      submissionId: "z",
      demographics: {
        ...demographics,
        nivel: "Posgrado",
        grado: "Doctorado",
      },
      score: { S: 1, T: 0, E: 0, M: 0 },
      topType: "S",
      careerId: "biologist",
      locale: "es",
    });
    expect(row.grado).toBe("Posgrado Doctorado");
  });

  it("mantiene el orden de columnas esperado", () => {
    expect(EXPO_SHEET_HEADERS).toEqual([
      "timestamp",
      "submissionId",
      "edad",
      "escuela",
      "grado",
      "municipio",
      "genero",
      "estudiante",
      "idioma",
      "S",
      "T",
      "E",
      "M",
      "tipoTop",
      "carrera",
    ]);
  });
});
