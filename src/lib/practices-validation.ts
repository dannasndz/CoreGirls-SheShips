export type PracticeDateError =
  | "future_start"
  | "future_end"
  | "end_before_start";

export const PRACTICE_DATE_ERROR_MESSAGES: Record<PracticeDateError, string> = {
  future_start: "Start date cannot be in the future",
  future_end: "End date cannot be in the future",
  end_before_start: "End date cannot be before the start date",
};

/**
 * Valida las fechas de una experiencia profesional.
 * - La fecha de inicio no puede ser futura.
 * - La fecha de fin es opcional; si existe, no puede ser futura ni anterior a la de inicio.
 */
export function validatePracticeDates(
  startDate: Date,
  endDate?: Date | null
): PracticeDateError | null {
  const today = new Date().toISOString().slice(0, 10);
  const start = startDate.toISOString().slice(0, 10);

  if (start > today) return "future_start";

  if (endDate) {
    const end = endDate.toISOString().slice(0, 10);
    if (end > today) return "future_end";
    if (end < start) return "end_before_start";
  }

  return null;
}
