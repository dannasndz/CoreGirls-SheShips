// Filtrado de eventos (RF de filtros). Módulo puro y testeable.

export const EVENT_MODALITY_FILTERS = [
  "in-person",
  "remote",
  "hybrid",
] as const;
export type EventModalityFilter = (typeof EVENT_MODALITY_FILTERS)[number];

export const EVENT_STATUS_FILTERS = [
  "upcoming",
  "past",
  "cancelled",
] as const;
export type EventStatusFilter = (typeof EVENT_STATUS_FILTERS)[number];

export interface FilterableEvent {
  id: string;
  date: string;
  modality: string;
  estado: string;
}

export interface EventFilters {
  modality?: string | string[] | null;
  status?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
}

function toDay(value: string): Date | null {
  if (!value) return null;
  const parts = value.slice(0, 10).split("-").map(Number);
  const [y, m, d] = parts;
  if (!y || !m || !d) {
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  return new Date(y, m - 1, d);
}

export function isCancelled(event: FilterableEvent): boolean {
  return event.estado === "CANCELADO";
}

export function isPast(event: FilterableEvent, now: Date = new Date()): boolean {
  const day = toDay(event.date);
  if (!day) return false;
  // Considera "pasado" solo después de que termina el día del evento.
  const endOfDay = new Date(day);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay.getTime() < now.getTime();
}

export function matchesEventFilters(
  event: FilterableEvent,
  filters: EventFilters,
  now: Date = new Date()
): boolean {
  const { modality, status, dateFrom, dateTo } = filters;

  // La modalidad admite selección múltiple (arreglo) o un solo valor.
  const modalityList = Array.isArray(modality)
    ? modality
    : modality
      ? [modality]
      : [];
  if (modalityList.length > 0 && !modalityList.includes(event.modality)) {
    return false;
  }

  if (status) {
    const cancelled = isCancelled(event);
    const past = isPast(event, now);
    if (status === "cancelled" && !cancelled) return false;
    if (status === "past" && (cancelled || !past)) return false;
    if (status === "upcoming" && (cancelled || past)) return false;
  }

  const day = toDay(event.date);
  if (day) {
    if (dateFrom) {
      const from = toDay(dateFrom);
      if (from && day.getTime() < from.getTime()) return false;
    }
    if (dateTo) {
      const to = toDay(dateTo);
      if (to) {
        to.setHours(23, 59, 59, 999);
        if (day.getTime() > to.getTime()) return false;
      }
    }
  }

  return true;
}

export function filterEvents<T extends FilterableEvent>(
  events: T[],
  filters: EventFilters,
  now: Date = new Date()
): T[] {
  return events.filter((event) => matchesEventFilters(event, filters, now));
}

export function countActiveFilters(filters: EventFilters): number {
  const modalityCount = Array.isArray(filters.modality)
    ? filters.modality.length > 0
      ? 1
      : 0
    : filters.modality
      ? 1
      : 0;
  return (
    modalityCount +
    (filters.status ? 1 : 0) +
    (filters.dateFrom || filters.dateTo ? 1 : 0)
  );
}
