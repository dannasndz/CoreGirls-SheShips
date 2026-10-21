// Validación de la calificación de satisfacción (modo expo).

export const EXPO_SATISFACCION_MIN = 1;
export const EXPO_SATISFACCION_MAX = 5;

export function parseSatisfaccion(value: unknown): number | null {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) return null;
  if (parsed < EXPO_SATISFACCION_MIN || parsed > EXPO_SATISFACCION_MAX) {
    return null;
  }
  return parsed;
}

export function isValidSatisfaccion(value: unknown): boolean {
  return parseSatisfaccion(value) !== null;
}
