import type { Score, StemType } from "@/types/quiz";

export const STEM_TYPES: readonly StemType[] = ["S", "T", "E", "M"] as const;

export interface CareerLike {
  id: string;
  category: StemType;
  growth: boolean;
}

export function isStemType(value: unknown): value is StemType {
  return value === "S" || value === "T" || value === "E" || value === "M";
}

/**
 * Normaliza y valida un mapa de respuestas (claves de pregunta → tipo STEM).
 * Devuelve `null` si el valor no es un objeto válido o contiene tipos inválidos.
 */
export function normalizeAnswers(
  value: unknown
): Record<string, StemType> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const normalized: Record<string, StemType> = {};
  for (const [key, type] of Object.entries(value as Record<string, unknown>)) {
    if (!isStemType(type)) return null;
    normalized[key] = type;
  }

  return Object.keys(normalized).length > 0 ? normalized : null;
}

/** Cuenta cuántas respuestas hay de cada tipo STEM y obtiene el tipo dominante. */
export function scoreAnswers(answers: Record<string | number, StemType>): {
  topType: StemType;
  score: Score;
} {
  const score: Score = { S: 0, T: 0, E: 0, M: 0 };

  for (const type of Object.values(answers)) {
    if (score[type] !== undefined) score[type]++;
  }

  const topType = (Object.entries(score) as [StemType, number][]).sort(
    (a, b) => b[1] - a[1]
  )[0][0];

  return { topType, score };
}

/**
 * Elige la carrera recomendada de forma determinista, igual que en el cliente.
 * `careers` se pasa como parámetro para mantener el módulo puro.
 */
export function pickCareer<T extends CareerLike>(
  answers: Record<string | number, StemType>,
  careers: T[]
): { career: T; score: Score; topType: StemType } {
  const { topType, score } = scoreAnswers(answers);

  const categoryCareers = careers.filter((c) => c.category === topType);
  const growthCareers = categoryCareers.filter((c) => c.growth);
  const pool = growthCareers.length > 0 ? growthCareers : categoryCareers;

  if (pool.length === 0) {
    // Fallback: cualquier carrera disponible (evita división por cero).
    const fallback = careers[0];
    return { career: fallback, score, topType };
  }

  const hash = Object.values(answers).reduce(
    (acc, type) => acc + type.charCodeAt(0),
    0
  );
  const picked = pool[hash % pool.length];

  return { career: picked, score, topType };
}
