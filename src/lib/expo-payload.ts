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
  "idioma",
  "S",
  "T",
  "E",
  "M",
  "tipoTop",
  "carrera",
] as const;

export interface ExpoRow {
  timestamp: string;
  submissionId: string;
  edad: number;
  escuela: string;
  grado: string;
  municipio: string;
  genero: string;
  idioma: string;
  S: number;
  T: number;
  E: number;
  M: number;
  tipoTop: StemType;
  carrera: string;
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

  return {
    timestamp: timestamp.toISOString(),
    submissionId: submissionId.trim(),
    edad: demographics.edad,
    escuela: demographics.escuela,
    grado: `${demographics.nivel} ${demographics.grado}`,
    municipio: demographics.municipio,
    genero: demographics.genero ?? "",
    idioma: locale,
    S: score.S,
    T: score.T,
    E: score.E,
    M: score.M,
    tipoTop: topType,
    carrera: careerId,
  };
}
