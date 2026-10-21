import { describe, it, expect } from "vitest";
import {
  isValidSatisfaccion,
  parseSatisfaccion,
  EXPO_SATISFACCION_MAX,
  EXPO_SATISFACCION_MIN,
} from "@/lib/expo-feedback";

describe("parseSatisfaccion", () => {
  it("acepta enteros del 1 al 5", () => {
    for (let value = EXPO_SATISFACCION_MIN; value <= EXPO_SATISFACCION_MAX; value++) {
      expect(parseSatisfaccion(value)).toBe(value);
      expect(parseSatisfaccion(String(value))).toBe(value);
    }
  });

  it("rechaza valores fuera de rango o no enteros", () => {
    expect(parseSatisfaccion(0)).toBeNull();
    expect(parseSatisfaccion(6)).toBeNull();
    expect(parseSatisfaccion(-1)).toBeNull();
    expect(parseSatisfaccion(2.5)).toBeNull();
    expect(parseSatisfaccion("abc")).toBeNull();
    expect(parseSatisfaccion("")).toBeNull();
    expect(parseSatisfaccion(null)).toBeNull();
    expect(parseSatisfaccion(undefined)).toBeNull();
  });
});

describe("isValidSatisfaccion", () => {
  it("valida el rango permitido", () => {
    expect(isValidSatisfaccion(1)).toBe(true);
    expect(isValidSatisfaccion(5)).toBe(true);
    expect(isValidSatisfaccion(0)).toBe(false);
    expect(isValidSatisfaccion(6)).toBe(false);
  });
});
