// Reglas de negocio para proyectos (RF-14).
// Este módulo es puro (sin dependencias de Prisma/Next) para poder probarlo
// de forma aislada.

export const PROJECT_ESTADOS = ["abierto", "en_progreso", "cerrado"] as const;
export type ProjectEstado = (typeof PROJECT_ESTADOS)[number];

export const PROJECT_MODALIDADES = ["presencial", "virtual", "hibrido"] as const;
export type ProjectModalidad = (typeof PROJECT_MODALIDADES)[number];

export const PROJECT_AREAS = [
  "CIENCIA",
  "TECNOLOGIA",
  "INGENIERIA",
  "MATEMATICAS",
] as const;
export type ProjectArea = (typeof PROJECT_AREAS)[number];

export const PROJECT_SOLICITUD_ESTADOS = [
  "pendiente",
  "aceptada",
  "rechazada",
] as const;
export type ProjectSolicitudEstado = (typeof PROJECT_SOLICITUD_ESTADOS)[number];

// Solo Maestra/Académica y Egresada pueden crear proyectos. Las Alumnas
// únicamente pueden visualizarlos y expresar interés.
export const PROJECT_CREATOR_TYPES = ["ACADEMICA", "EGRESADA"] as const;

export const NOMBRE_MAX = 120;
export const DESCRIPCION_MAX = 2000;
export const IMAGENES_MAX = 8;

export type ProjectError =
  | "nombre_required"
  | "nombre_too_long"
  | "descripcion_required"
  | "descripcion_too_long"
  | "perfil_required"
  | "fecha_inicio_invalid"
  | "fecha_fin_invalid"
  | "fecha_fin_before_inicio"
  | "estado_invalid"
  | "lugar_required"
  | "modalidad_invalid"
  | "cupo_invalid"
  | "area_invalid"
  | "imagenes_invalid";

export const PROJECT_ERROR_MESSAGES: Record<ProjectError, string> = {
  nombre_required: "El nombre del proyecto es obligatorio",
  nombre_too_long: `El nombre no puede superar los ${NOMBRE_MAX} caracteres`,
  descripcion_required: "La descripción es obligatoria",
  descripcion_too_long: `La descripción no puede superar los ${DESCRIPCION_MAX} caracteres`,
  perfil_required: "El tipo de perfil de interesadas es obligatorio",
  fecha_inicio_invalid: "La fecha de inicio no es válida",
  fecha_fin_invalid: "La fecha de fin no es válida",
  fecha_fin_before_inicio:
    "La fecha de fin no puede ser anterior a la fecha de inicio",
  estado_invalid: "El estado no es válido",
  lugar_required: "El lugar es obligatorio",
  modalidad_invalid: "La modalidad no es válida",
  cupo_invalid: "El cupo máximo debe ser un número entero mayor a 0",
  area_invalid: "El área STEM no es válida",
  imagenes_invalid: `Puedes subir hasta ${IMAGENES_MAX} imágenes válidas`,
};

export interface ProjectInput {
  nombre?: unknown;
  descripcion?: unknown;
  perfilInteresadas?: unknown;
  fechaInicio?: unknown;
  fechaFin?: unknown;
  estado?: unknown;
  lugar?: unknown;
  modalidad?: unknown;
  cupoMaximo?: unknown;
  areasSTEM?: unknown;
  imagenes?: unknown;
}

export interface NormalizedProject {
  nombre: string;
  descripcion: string;
  perfilInteresadas: string;
  fechaInicio: Date | null;
  fechaFin: Date | null;
  estado: ProjectEstado;
  lugar: string;
  modalidad: ProjectModalidad;
  cupoMaximo: number | null;
  areasSTEM: ProjectArea[];
  imagenes: string[];
}

export type ProjectValidationResult =
  | { ok: true; data: NormalizedProject }
  | { ok: false; error: ProjectError; message: string };

function fail(error: ProjectError): ProjectValidationResult {
  return { ok: false, error, message: PROJECT_ERROR_MESSAGES[error] };
}

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function canCreateProject(userType?: string | null): boolean {
  return userType === "ACADEMICA" || userType === "EGRESADA";
}

// Solo las Alumnas pueden expresar interés en un proyecto.
export function canExpressInterest(userType?: string | null): boolean {
  return userType === "ALUMNA";
}

// Cualquier usuaria autenticada que no sea encargada puede solicitar entrar.
export function canRequestJoin(
  userId: string | null | undefined,
  encargadaIds: string[]
): boolean {
  if (!userId) return false;
  return !encargadaIds.includes(userId);
}

// Las encargadas son quienes pueden editar el proyecto y decidir solicitudes.
export function canManageProject(
  userId: string | null | undefined,
  encargadaIds: string[]
): boolean {
  if (!userId) return false;
  return encargadaIds.includes(userId);
}

export function isProjectEstado(value: unknown): value is ProjectEstado {
  return (
    typeof value === "string" &&
    (PROJECT_ESTADOS as readonly string[]).includes(value)
  );
}

export function isProjectModalidad(value: unknown): value is ProjectModalidad {
  return (
    typeof value === "string" &&
    (PROJECT_MODALIDADES as readonly string[]).includes(value)
  );
}

export function isSolicitudEstado(
  value: unknown
): value is ProjectSolicitudEstado {
  return (
    typeof value === "string" &&
    (PROJECT_SOLICITUD_ESTADOS as readonly string[]).includes(value)
  );
}

export type JoinBlockReason =
  | "encargada"
  | "cerrado"
  | "fecha_fin"
  | "lleno"
  | "pendiente"
  | "miembro";

export const JOIN_BLOCK_MESSAGES: Record<JoinBlockReason, string> = {
  encargada: "Las encargadas no pueden solicitar unirse a su propio proyecto",
  cerrado: "El proyecto está cerrado y ya no acepta solicitudes",
  fecha_fin: "La fecha de fin del proyecto ya pasó",
  lleno: "El proyecto está lleno",
  pendiente: "Ya tienes una solicitud pendiente",
  miembro: "Ya eres miembro de este proyecto",
};

/**
 * Determina si una usuaria puede solicitar entrar a un proyecto y, si no,
 * la razón del bloqueo. Reglas:
 * - Las encargadas no pueden solicitar.
 * - No se puede solicitar si el proyecto está concluido/cerrado.
 * - No se puede solicitar después de la fecha de fin.
 * - No se puede solicitar si el cupo ya está lleno.
 */
export function getJoinBlockReason(params: {
  isEncargada: boolean;
  estado: string;
  cupoMaximo: number | null;
  acceptedCount: number;
  fechaFin: Date | null;
  existingEstado?: ProjectSolicitudEstado | null;
  now?: Date;
}): JoinBlockReason | null {
  const {
    isEncargada,
    estado,
    cupoMaximo,
    acceptedCount,
    fechaFin,
    existingEstado,
    now = new Date(),
  } = params;

  if (isEncargada) return "encargada";
  if (estado === "cerrado") return "cerrado";
  if (fechaFin && now.getTime() > fechaFin.getTime()) return "fecha_fin";
  if (cupoMaximo != null && acceptedCount >= cupoMaximo) return "lleno";
  if (existingEstado === "pendiente") return "pendiente";
  if (existingEstado === "aceptada") return "miembro";
  return null;
}

/**
 * Normaliza los ids de encargadas: siempre incluye a quien crea el proyecto,
 * elimina duplicados y valores vacíos.
 */
export function normalizeEncargadaIds(
  value: unknown,
  creatorId: string
): string[] {
  const ids = new Set<string>();
  if (typeof creatorId === "string" && creatorId.trim()) {
    ids.add(creatorId.trim());
  }
  const raw = Array.isArray(value) ? value : value ? [value] : [];
  for (const item of raw) {
    if (typeof item === "string" && item.trim()) ids.add(item.trim());
  }
  return [...ids];
}

function parseOptionalDate(value: unknown): Date | null | "invalid" {
  if (value === undefined || value === null || value === "") return null;
  const date = value instanceof Date ? value : new Date(value as string);
  return isNaN(date.getTime()) ? "invalid" : date;
}

function parseImagenes(value: unknown): string[] | "invalid" {
  if (value === undefined || value === null || value === "") return [];
  if (!Array.isArray(value)) return "invalid";
  if (value.length > IMAGENES_MAX) return "invalid";

  const urls: string[] = [];
  for (const item of value) {
    if (typeof item !== "string") return "invalid";
    const url = item.trim();
    if (!url) continue;
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return "invalid";
      }
    } catch {
      return "invalid";
    }
    urls.push(url);
  }
  return urls;
}

/**
 * Valida y normaliza los datos de entrada para crear/editar un proyecto.
 * Devuelve `{ ok: true, data }` o `{ ok: false, error, message }`.
 */
export function validateProjectInput(
  input: ProjectInput
): ProjectValidationResult {
  const nombre = asTrimmedString(input.nombre);
  if (!nombre) return fail("nombre_required");
  if (nombre.length > NOMBRE_MAX) return fail("nombre_too_long");

  const descripcion = asTrimmedString(input.descripcion);
  if (!descripcion) return fail("descripcion_required");
  if (descripcion.length > DESCRIPCION_MAX) return fail("descripcion_too_long");

  const perfilInteresadas = asTrimmedString(input.perfilInteresadas);
  if (!perfilInteresadas) return fail("perfil_required");

  if (!isProjectEstado(input.estado)) return fail("estado_invalid");

  const lugar = asTrimmedString(input.lugar);
  if (!lugar) return fail("lugar_required");

  if (!isProjectModalidad(input.modalidad)) return fail("modalidad_invalid");

  const fechaInicio = parseOptionalDate(input.fechaInicio);
  if (fechaInicio === "invalid") return fail("fecha_inicio_invalid");

  const fechaFin = parseOptionalDate(input.fechaFin);
  if (fechaFin === "invalid") return fail("fecha_fin_invalid");

  if (fechaInicio && fechaFin && fechaFin.getTime() < fechaInicio.getTime()) {
    return fail("fecha_fin_before_inicio");
  }

  let cupoMaximo: number | null = null;
  if (
    input.cupoMaximo !== undefined &&
    input.cupoMaximo !== null &&
    input.cupoMaximo !== ""
  ) {
    const parsed = Number(input.cupoMaximo);
    if (!Number.isInteger(parsed) || parsed <= 0) return fail("cupo_invalid");
    cupoMaximo = parsed;
  }

  let areasSTEM: ProjectArea[] = [];
  if (
    input.areasSTEM !== undefined &&
    input.areasSTEM !== null &&
    input.areasSTEM !== ""
  ) {
    const raw = Array.isArray(input.areasSTEM)
      ? input.areasSTEM
      : [input.areasSTEM];
    const unique = new Set<ProjectArea>();
    for (const value of raw) {
      if (
        typeof value !== "string" ||
        !(PROJECT_AREAS as readonly string[]).includes(value)
      ) {
        return fail("area_invalid");
      }
      unique.add(value as ProjectArea);
    }
    areasSTEM = [...unique];
  }

  const imagenes = parseImagenes(input.imagenes);
  if (imagenes === "invalid") return fail("imagenes_invalid");

  return {
    ok: true,
    data: {
      nombre,
      descripcion,
      perfilInteresadas,
      fechaInicio,
      fechaFin,
      estado: input.estado,
      lugar,
      modalidad: input.modalidad,
      cupoMaximo,
      areasSTEM,
      imagenes,
    },
  };
}
