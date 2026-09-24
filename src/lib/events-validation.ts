// Reglas de negocio para eventos (RF-20 a RF-24).
// Módulo puro (sin dependencias de Prisma/Next) para poder probarlo aislado.

export const EVENT_TITLE_MAX = 120;
export const EVENT_DESCRIPTION_MAX = 2000;

// Modalidades canónicas (presencial/virtual/híbrido).
export const EVENT_MODALIDADES = ["presencial", "virtual", "hibrido"] as const;
export type EventModalidad = (typeof EVENT_MODALIDADES)[number];

// Estados de creación/edición: borrador o publicado.
export const EVENT_ESTADOS = ["borrador", "publicado"] as const;
export type EventEstado = (typeof EVENT_ESTADOS)[number];

// Mapeo entre las claves canónicas y los valores almacenados en la BD.
const MODALIDAD_TO_DB: Record<EventModalidad, string> = {
  presencial: "in-person",
  virtual: "remote",
  hibrido: "hybrid",
};

const MODALIDAD_FROM_DB: Record<string, EventModalidad> = {
  "in-person": "presencial",
  remote: "virtual",
  hybrid: "hibrido",
};

// Normaliza valores antiguos ("in-person") y nuevos ("presencial").
const MODALIDAD_ALIASES: Record<string, EventModalidad> = {
  presencial: "presencial",
  virtual: "virtual",
  hibrido: "hibrido",
  "in-person": "presencial",
  remote: "virtual",
  hybrid: "hibrido",
};

const ESTADO_TO_DB: Record<EventEstado, "BORRADOR" | "PUBLICADO"> = {
  borrador: "BORRADOR",
  publicado: "PUBLICADO",
};

const ESTADO_FROM_DB: Record<string, EventEstado> = {
  BORRADOR: "borrador",
  PUBLICADO: "publicado",
};

// Alias aceptados en la entrada: valores canónicos y valores de BD.
const ESTADO_ALIASES: Record<string, EventEstado> = {
  borrador: "borrador",
  publicado: "publicado",
  BORRADOR: "borrador",
  PUBLICADO: "publicado",
};

export function modalidadToDb(value: EventModalidad): string {
  return MODALIDAD_TO_DB[value];
}

export function modalidadFromDb(value: string | null | undefined): EventModalidad {
  if (!value) return "presencial";
  return MODALIDAD_FROM_DB[value] ?? (MODALIDAD_ALIASES[value] ?? "presencial");
}

export function estadoToDb(value: EventEstado): "BORRADOR" | "PUBLICADO" {
  return ESTADO_TO_DB[value];
}

export function estadoFromDb(value: string | null | undefined): EventEstado {
  if (!value) return "borrador";
  return ESTADO_FROM_DB[value] ?? "borrador";
}

// Todas las usuarias autenticadas pueden crear eventos (Maestra/Académica,
// Egresada y Alumna). La verificación de cuenta no se toma en cuenta por ahora.
export function canCreateEvent(params: {
  userType?: string | null;
  accountStatus?: string | null;
  isAdmin?: boolean;
}): boolean {
  const { userType } = params;
  return (
    userType === "ALUMNA" ||
    userType === "ACADEMICA" ||
    userType === "EGRESADA"
  );
}

export function isEventModalidad(value: unknown): value is EventModalidad {
  return typeof value === "string" && value in MODALIDAD_ALIASES;
}

export function isEventEstado(value: unknown): value is EventEstado {
  return typeof value === "string" && value in ESTADO_ALIASES;
}

export type EventError =
  | "titulo_required"
  | "titulo_too_long"
  | "descripcion_required"
  | "descripcion_too_long"
  | "fecha_required"
  | "fecha_invalid"
  | "fecha_pasada"
  | "lugar_required"
  | "modalidad_invalid"
  | "cupo_invalid"
  | "estado_invalid"
  | "imagen_invalid"
  | "vacio";

export const EVENT_ERROR_MESSAGES: Record<EventError, string> = {
  titulo_required: "El nombre del evento es obligatorio",
  titulo_too_long: `El nombre no puede superar los ${EVENT_TITLE_MAX} caracteres`,
  descripcion_required: "La descripción es obligatoria",
  descripcion_too_long: `La descripción no puede superar los ${EVENT_DESCRIPTION_MAX} caracteres`,
  fecha_required: "La fecha es obligatoria",
  fecha_invalid: "La fecha no es válida",
  fecha_pasada: "La fecha y hora del evento no pueden estar en el pasado",
  lugar_required: "El lugar es obligatorio",
  modalidad_invalid: "La modalidad no es válida",
  cupo_invalid: "El cupo máximo debe ser un número entero mayor a 0",
  estado_invalid: "El estado no es válido",
  imagen_invalid: "La foto debe ser una URL válida",
  vacio: "Agrega al menos un dato para guardar el borrador",
};

export interface EventInput {
  nombre?: unknown;
  title?: unknown;
  descripcion?: unknown;
  description?: unknown;
  fecha?: unknown;
  date?: unknown;
  hora?: unknown;
  hour?: unknown;
  lugar?: unknown;
  location?: unknown;
  modalidad?: unknown;
  modality?: unknown;
  cupoMaximo?: unknown;
  participantsLimit?: unknown;
  estado?: unknown;
  foto?: unknown;
  imageUrl?: unknown;
  meetingLink?: unknown;
  externalLink?: unknown;
  organizerName?: unknown;
}

export interface NormalizedEvent {
  title: string;
  description: string;
  modalityDb: string;
  location: string | null;
  meetingLink: string | null;
  externalLink: string | null;
  date: Date;
  hour: string;
  participantsLimit: number;
  imageUrl: string | null;
  estadoDb: "BORRADOR" | "PUBLICADO";
}

export type EventValidationResult =
  | { ok: true; data: NormalizedEvent }
  | { ok: false; error: EventError; message: string };

function fail(error: EventError): EventValidationResult {
  return { ok: false, error, message: EVENT_ERROR_MESSAGES[error] };
}

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function pick(input: EventInput, keys: (keyof EventInput)[]): unknown {
  for (const key of keys) {
    if (input[key] !== undefined) return input[key];
  }
  return undefined;
}

function parsePositiveInt(value: unknown): number | null | "invalid" {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) return "invalid";
  return parsed;
}

function parseOptionalUrl(value: unknown): string | null | "invalid" {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") return "invalid";
  const url = value.trim();
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "invalid";
    }
  } catch {
    return "invalid";
  }
  return url;
}

/**
 * Valida y normaliza los datos para crear/editar un evento.
 *
 * - Estado `publicado`: nombre, descripción, fecha, lugar, modalidad, cupo y
 *   estado son obligatorios (el lugar es obligatorio en todas las modalidades).
 * - Estado `borrador`: basta con que haya al menos un campo con datos; el resto
 *   se guarda con valores por defecto.
 */
export function validateEventInput(input: EventInput): EventValidationResult {
  const estadoRaw = pick(input, ["estado"]);
  if (!isEventEstado(estadoRaw)) return fail("estado_invalid");
  const estado = ESTADO_ALIASES[estadoRaw as string];

  const title = asTrimmedString(pick(input, ["nombre", "title"]));
  if (title.length > EVENT_TITLE_MAX) return fail("titulo_too_long");

  const description = asTrimmedString(pick(input, ["descripcion", "description"]));
  if (description.length > EVENT_DESCRIPTION_MAX)
    return fail("descripcion_too_long");

  const modalityRaw = pick(input, ["modalidad", "modality"]);
  // La modalidad por defecto solo se usa en borradores.
  const modality =
    modalityRaw === undefined || modalityRaw === null || modalityRaw === ""
      ? null
      : isEventModalidad(modalityRaw)
        ? MODALIDAD_ALIASES[modalityRaw as string]
        : "invalid";
  if (modality === "invalid") return fail("modalidad_invalid");

  const dateRaw = pick(input, ["fecha", "date"]);
  let date: Date | null = null;
  if (dateRaw !== undefined && dateRaw !== null && dateRaw !== "") {
    date = dateRaw instanceof Date ? dateRaw : new Date(dateRaw as string);
    if (isNaN(date.getTime())) return fail("fecha_invalid");
  }

  const location = asTrimmedString(pick(input, ["lugar", "location"]));

  const cupoRaw = pick(input, ["cupoMaximo", "participantsLimit"]);
  const participantsLimit = parsePositiveInt(cupoRaw);
  if (participantsLimit === "invalid") return fail("cupo_invalid");

  const fotoRaw = pick(input, ["foto", "imageUrl"]);
  const imageUrl = parseOptionalUrl(fotoRaw);
  if (imageUrl === "invalid") return fail("imagen_invalid");

  const meetingLink = parseOptionalUrl(pick(input, ["meetingLink"]));
  if (meetingLink === "invalid") return fail("imagen_invalid");

  const externalLink = parseOptionalUrl(pick(input, ["externalLink"]));
  if (externalLink === "invalid") return fail("imagen_invalid");

  const hour = asTrimmedString(pick(input, ["hora", "hour"])) || "00:00";

  if (estado === "borrador") {
    const hasAnyData =
      Boolean(title) ||
      Boolean(description) ||
      Boolean(location) ||
      Boolean(modality) ||
      Boolean(date) ||
      Boolean(participantsLimit) ||
      Boolean(imageUrl) ||
      Boolean(meetingLink) ||
      Boolean(externalLink);
    if (!hasAnyData) return fail("vacio");
  }

  if (estado === "publicado") {
    if (!title) return fail("titulo_required");
    if (!description) return fail("descripcion_required");
    if (!date) return fail("fecha_required");
    // El lugar solo es obligatorio si el evento no es virtual.
    if (modality !== "virtual" && !location) return fail("lugar_required");
    if (!modality) return fail("modalidad_invalid");
    if (participantsLimit === null) return fail("cupo_invalid");

    // No se puede publicar un evento con fecha/hora en el pasado.
    const dateStr = date.toISOString().slice(0, 10);
    const start = new Date(`${dateStr}T${hour || "00:00"}:00`);
    if (!isNaN(start.getTime()) && start.getTime() < Date.now()) {
      return fail("fecha_pasada");
    }
  }

  return {
    ok: true,
    data: {
      title: title || asTrimmedString(pick(input, ["organizerName"])) || "Borrador",
      description,
      modalityDb: modalidadToDb(modality ?? "presencial"),
      location: location || null,
      meetingLink,
      externalLink,
      date: date ?? new Date(),
      hour,
      participantsLimit: participantsLimit ?? 1,
      imageUrl,
      estadoDb: estadoToDb(estado),
    },
  };
}
