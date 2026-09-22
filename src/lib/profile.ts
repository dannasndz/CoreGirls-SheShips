import { Campus, AreaSTEM } from "@/generated/prisma/client";

export const VALID_CAMPUSES = Object.values(Campus);
export const VALID_AREAS = Object.values(AreaSTEM);

function sanitizeString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function sanitizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
}

function sanitizeInt(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

function sanitizeDate(value: unknown): Date | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Construye el objeto de actualización del perfil permitiendo únicamente
 * los campos correspondientes al tipo de usuario (RF-10).
 */
export function buildProfileUpdate(
  userType: string,
  body: Record<string, unknown>
): Record<string, unknown> {
  const data: Record<string, unknown> = {};

  // --- Campos comunes (RF-09, RF-10) ---
  if ("avatarUrl" in body) data.avatarUrl = sanitizeString(body.avatarUrl);
  if ("description" in body) data.description = sanitizeString(body.description);
  if ("interests" in body) data.interests = sanitizeStringArray(body.interests);
  if ("fullName" in body) {
    const fullName = sanitizeString(body.fullName);
    if (fullName) data.fullName = fullName;
  }
  if ("campus" in body && VALID_CAMPUSES.includes(body.campus as Campus)) {
    data.campus = body.campus;
  }

  // --- Campos específicos por tipo ---
  if (userType === "ALUMNA") {
    if ("carrera" in body) data.carrera = sanitizeString(body.carrera);
    if ("semestre" in body) data.semestre = sanitizeInt(body.semestre);
    if ("clubs" in body) data.clubs = sanitizeStringArray(body.clubs);
    if ("fechaIngresoAlumna" in body)
      data.fechaIngresoAlumna = sanitizeDate(body.fechaIngresoAlumna);
  } else if (userType === "ACADEMICA") {
    if ("sector" in body) data.sector = sanitizeString(body.sector);
    if ("areaSTEM" in body && VALID_AREAS.includes(body.areaSTEM as AreaSTEM)) {
      data.areaSTEM = body.areaSTEM;
    }
    if ("materias" in body) data.materias = sanitizeStringArray(body.materias);
    if ("fechaInicioLabor" in body)
      data.fechaInicioLabor = sanitizeDate(body.fechaInicioLabor);
  } else if (userType === "EGRESADA") {
    if ("carrera" in body) data.carrera = sanitizeString(body.carrera);
    if ("ocupacion" in body) data.ocupacion = sanitizeString(body.ocupacion);
    if ("ubicacion" in body) data.ubicacion = sanitizeString(body.ubicacion);
    if ("fechaIngreso" in body) data.fechaIngreso = sanitizeDate(body.fechaIngreso);
    if ("fechaEgreso" in body) data.fechaEgreso = sanitizeDate(body.fechaEgreso);
  }

  return data;
}

export function toJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) return value as string[];
  return [];
}
