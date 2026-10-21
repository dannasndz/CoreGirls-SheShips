import { describe, it, expect } from "vitest";
import {
  normalizeAnswers,
  pickCareer,
  scoreAnswers,
  type CareerLike,
} from "@/lib/quiz-scoring";

const careers: CareerLike[] = [
  { id: "bio", category: "S", growth: false },
  { id: "astro", category: "S", growth: true },
  { id: "dev", category: "T", growth: true },
  { id: "civil", category: "E", growth: false },
  { id: "math", category: "M", growth: true },
];

describe("scoreAnswers", () => {
  it("cuenta cada tipo y devuelve el dominante", () => {
    const { score, topType } = scoreAnswers({ 0: "S", 1: "S", 2: "T" });
    expect(score).toEqual({ S: 2, T: 1, E: 0, M: 0 });
    expect(topType).toBe("S");
  });

  it("resuelve empates manteniendo el orden S,T,E,M", () => {
    const { topType } = scoreAnswers({ 0: "T", 1: "S" });
    expect(topType).toBe("S");
  });
});

describe("pickCareer", () => {
  it("elige una carrera de la categoría dominante", () => {
    const result = pickCareer({ 0: "T", 1: "T", 2: "S" }, careers);
    expect(result.topType).toBe("T");
    expect(result.career.category).toBe("T");
    expect(result.career.id).toBe("dev");
  });

  it("prefiere carreras con crecimiento cuando existen", () => {
    const result = pickCareer({ 0: "S", 1: "S" }, careers);
    expect(result.career.id).toBe("astro");
  });

  it("es determinista para las mismas respuestas", () => {
    const answers = { 0: "E", 1: "M", 2: "E" } as const;
    const a = pickCareer(answers, careers);
    const b = pickCareer(answers, careers);
    expect(a.career.id).toBe(b.career.id);
  });
});

describe("normalizeAnswers", () => {
  it("acepta solo mapas con tipos STEM válidos", () => {
    expect(normalizeAnswers({ 0: "S", 1: "T" })).toEqual({ 0: "S", 1: "T" });
  });

  it("rechaza valores inválidos, vacíos y no-objetos", () => {
    expect(normalizeAnswers({ 0: "X" })).toBeNull();
    expect(normalizeAnswers({})).toBeNull();
    expect(normalizeAnswers([])).toBeNull();
    expect(normalizeAnswers(null)).toBeNull();
    expect(normalizeAnswers("S")).toBeNull();
  });
});
