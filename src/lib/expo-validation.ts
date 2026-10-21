// Validación de datos demográficos para el modo expo (sin tocar la BD).

export const EXPO_AGE_MIN = 5;
export const EXPO_AGE_MAX = 99;
export const EXPO_SCHOOL_MAX = 100;

// Clave de sessionStorage donde se guardan los demográficos entre /expo y /quiz.
export const EXPO_STORAGE_KEY = "expo-demographics";

export const EXPO_GENDERS = [
  "Femenino",
  "Masculino",
  "No binario",
  "Otro",
  "Prefiero no decir",
] as const;
export type ExpoGender = (typeof EXPO_GENDERS)[number];

export const EXPO_NIVELES = [
  "Primaria",
  "Secundaria",
  "Preparatoria",
  "Universidad",
  "Posgrado",
] as const;
export type ExpoNivel = (typeof EXPO_NIVELES)[number];

export const EXPO_MUNICIPIOS = [
  "Ensenada",
  "Mexicali",
  "Tecate",
  "Tijuana",
  "Playas de Rosarito",
  "San Quintín",
  "San Felipe",
  "Otro",
] as const;
export type ExpoMunicipio = (typeof EXPO_MUNICIPIOS)[number];

export const EXPO_GRADOS: Record<ExpoNivel, string[]> = {
  Primaria: ["1°", "2°", "3°", "4°", "5°", "6°"],
  Secundaria: ["1°", "2°", "3°"],
  Preparatoria: ["1°", "2°", "3°"],
  Universidad: ["1°", "2°", "3°", "4°", "5°", "6°", "7°", "8°", "9°", "10°"],
  Posgrado: ["Maestría", "Doctorado", "Especialidad"],
};

export type ExpoError =
  | "estudiante_required"
  | "estudiante_invalid"
  | "edad_required"
  | "edad_invalid"
  | "edad_range"
  | "escuela_required"
  | "escuela_too_long"
  | "nivel_invalid"
  | "grado_invalid"
  | "municipio_invalid"
  | "genero_invalid";

export const EXPO_ERROR_MESSAGES: Record<ExpoError, string> = {
  estudiante_required: "Indica si eres estudiante",
  estudiante_invalid: "El valor de estudiante no es válido",
  edad_required: "La edad es obligatoria",
  edad_invalid: "La edad debe ser un número entero",
  edad_range: `La edad debe estar entre ${EXPO_AGE_MIN} y ${EXPO_AGE_MAX} años`,
  escuela_required: "La escuela es obligatoria",
  escuela_too_long: `La escuela no puede superar los ${EXPO_SCHOOL_MAX} caracteres`,
  nivel_invalid: "El nivel educativo no es válido",
  grado_invalid: "El grado no es válido para el nivel seleccionado",
  municipio_invalid: "El municipio no es válido",
  genero_invalid: "El género no es válido",
};

export interface ExpoDemographicsInput {
  estudiante?: unknown;
  edad?: unknown;
  escuela?: unknown;
  nivel?: unknown;
  grado?: unknown;
  municipio?: unknown;
  genero?: unknown;
}

export interface ExpoDemographics {
  estudiante: boolean;
  edad: number;
  escuela: string;
  nivel: ExpoNivel | null;
  grado: string;
  municipio: ExpoMunicipio;
  genero: ExpoGender | null;
}

export type ExpoValidationResult =
  | { ok: true; data: ExpoDemographics }
  | { ok: false; error: ExpoError; message: string };

function fail(error: ExpoError): ExpoValidationResult {
  return { ok: false, error, message: EXPO_ERROR_MESSAGES[error] };
}

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function isValidGrade(nivel: ExpoNivel, grado: string): boolean {
  return EXPO_GRADOS[nivel]?.includes(grado) ?? false;
}

function parseStudentFlag(
  value: unknown
): boolean | "missing" | "invalid" {
  if (value === undefined || value === null || value === "") return "missing";
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["si", "sí", "true", "yes"].includes(normalized)) return true;
    if (["no", "false"].includes(normalized)) return false;
  }
  return "invalid";
}

export function validateExpoDemographics(
  input: ExpoDemographicsInput
): ExpoValidationResult {
  const studentFlag = parseStudentFlag(input.estudiante);
  if (studentFlag === "missing") return fail("estudiante_required");
  if (studentFlag === "invalid") return fail("estudiante_invalid");
  const estudiante = studentFlag;

  if (
    input.edad === undefined ||
    input.edad === null ||
    input.edad === ""
  ) {
    return fail("edad_required");
  }
  const edad = Number(input.edad);
  if (!Number.isInteger(edad)) return fail("edad_invalid");
  if (edad < EXPO_AGE_MIN || edad > EXPO_AGE_MAX) return fail("edad_range");

  let escuela = "";
  let nivel: ExpoNivel | null = null;
  let grado = "";

  if (estudiante) {
    escuela = asTrimmedString(input.escuela);
    if (!escuela) return fail("escuela_required");
    if (escuela.length > EXPO_SCHOOL_MAX) return fail("escuela_too_long");

    if (
      typeof input.nivel !== "string" ||
      !(EXPO_NIVELES as readonly string[]).includes(input.nivel)
    ) {
      return fail("nivel_invalid");
    }
    nivel = input.nivel as ExpoNivel;

    grado = asTrimmedString(input.grado);
    if (!isValidGrade(nivel, grado)) return fail("grado_invalid");
  }

  const municipio = input.municipio;
  if (
    typeof municipio !== "string" ||
    !(EXPO_MUNICIPIOS as readonly string[]).includes(municipio)
  ) {
    return fail("municipio_invalid");
  }

  let genero: ExpoGender | null = null;
  if (
    input.genero !== undefined &&
    input.genero !== null &&
    input.genero !== ""
  ) {
    if (
      typeof input.genero !== "string" ||
      !(EXPO_GENDERS as readonly string[]).includes(input.genero)
    ) {
      return fail("genero_invalid");
    }
    genero = input.genero as ExpoGender;
  }

  return {
    ok: true,
    data: {
      estudiante,
      edad,
      escuela,
      nivel,
      grado,
      municipio: municipio as ExpoMunicipio,
      genero,
    },
  };
}
