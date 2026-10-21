import type { Score, StemType } from "@/types/quiz";
import type { ExpoDemographics } from "./expo-validation";

// Orden de columnas de la hoja de cálculo.
export const EXPO_SHEET_HEADERS = [
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
  "ocupacion",
  "carreraEstudiante",
  "satisfaccion",
] as const;

export interface ExpoRow {
  timestamp: string;
  submissionId: string;
  edad: number;
  escuela: string;
  grado: string;
  municipio: string;
  genero: string;
  estudiante: string;
  idioma: string;
  S: number;
  T: number;
  E: number;
  M: number;
  tipoTop: StemType;
  carrera: string;
  ocupacion: string;
  carreraEstudiante: string;
  satisfaccion: string;
}

/**
 * Construye la fila (objeto) que se envía a Google Sheets.
 * Función pura para poder probarla sin red.
 */
export function buildExpoRow(params: {
  submissionId: string;
  demographics: ExpoDemographics;
  score: Score;
  topType: StemType;
  careerId: string;
  locale: string;
  timestamp?: Date;
}): ExpoRow {
  const {
    submissionId,
    demographics,
    score,
    topType,
    careerId,
    locale,
    timestamp = new Date(),
  } = params;

  const grado =
    demographics.estudiante && demographics.nivel
      ? `${demographics.nivel} ${demographics.grado}`
      : "";

  return {
    timestamp: timestamp.toISOString(),
    submissionId: submissionId.trim(),
    edad: demographics.edad,
    escuela: demographics.escuela,
    grado,
    municipio: demographics.municipio,
    genero: demographics.genero ?? "",
    estudiante: demographics.estudiante ? "Sí" : "No",
    idioma: locale,
    S: score.S,
    T: score.T,
    E: score.E,
    M: score.M,
    tipoTop: topType,
    carrera: careerId,
    ocupacion: demographics.ocupacion,
    carreraEstudiante: demographics.carreraEstudiante,
    // Se llena después con /api/expo/feedback.
    satisfaccion: "",
  };
}
