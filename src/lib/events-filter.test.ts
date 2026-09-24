import { describe, it, expect } from "vitest";
import {
  countActiveFilters,
  filterEvents,
  isCancelled,
  isPast,
  matchesEventFilters,
  type FilterableEvent,
} from "@/lib/events-filter";

const now = new Date("2026-06-15T12:00:00");

const events: FilterableEvent[] = [
  { id: "1", date: "2026-07-01", modality: "in-person", estado: "PUBLICADO" },
  { id: "2", date: "2026-06-20", modality: "remote", estado: "PUBLICADO" },
  { id: "3", date: "2026-06-01", modality: "hybrid", estado: "PUBLICADO" },
  { id: "4", date: "2026-08-10", modality: "remote", estado: "CANCELADO" },
  { id: "5", date: "2026-06-15", modality: "in-person", estado: "PUBLICADO" },
];

describe("isCancelled / isPast", () => {
  it("detecta cancelados", () => {
    expect(isCancelled(events[3])).toBe(true);
    expect(isCancelled(events[0])).toBe(false);
  });

  it("considera pasado solo después de terminar el día del evento", () => {
    expect(isPast({ id: "x", date: "2026-06-14", modality: "", estado: "" }, now)).toBe(true);
    expect(isPast({ id: "x", date: "2026-06-15", modality: "", estado: "" }, now)).toBe(false);
    expect(isPast({ id: "x", date: "2026-06-16", modality: "", estado: "" }, now)).toBe(false);
  });
});

describe("matchesEventFilters", () => {
  it("sin filtros acepta todo", () => {
    for (const e of events) {
      expect(matchesEventFilters(e, {}, now)).toBe(true);
    }
  });

  it("filtra por modalidad", () => {
    const remote = filterEvents(events, { modality: "remote" }, now);
    expect(remote.map((e) => e.id)).toEqual(["2", "4"]);
  });

  it("filtra por varias modalidades a la vez", () => {
    const result = filterEvents(
      events,
      { modality: ["remote", "in-person"] },
      now
    );
    expect(result.map((e) => e.id)).toEqual(["1", "2", "4", "5"]);
  });

  it("un arreglo de modalidades vacío no filtra", () => {
    expect(filterEvents(events, { modality: [] }, now)).toHaveLength(
      events.length
    );
  });

  it("filtra por estado próximo/pasado/cancelado", () => {
    expect(filterEvents(events, { status: "upcoming" }, now).map((e) => e.id)).toEqual([
      "1",
      "2",
      "5",
    ]);
    expect(filterEvents(events, { status: "past" }, now).map((e) => e.id)).toEqual(["3"]);
    expect(
      filterEvents(events, { status: "cancelled" }, now).map((e) => e.id)
    ).toEqual(["4"]);
  });

  it("filtra por rango de fechas", () => {
    const result = filterEvents(
      events,
      { dateFrom: "2026-06-15", dateTo: "2026-07-01" },
      now
    );
    expect(result.map((e) => e.id)).toEqual(["1", "2", "5"]);
  });

  it("combina todos los filtros activos", () => {
    const result = filterEvents(
      events,
      {
        modality: "remote",
        status: "upcoming",
        dateFrom: "2026-06-01",
        dateTo: "2026-07-31",
      },
      now
    );
    expect(result.map((e) => e.id)).toEqual(["2"]);
  });

  it("permite quitar un filtro y recalcular", () => {
    const withModality = filterEvents(
      events,
      { modality: "remote", status: "upcoming" },
      now
    );
    expect(withModality.map((e) => e.id)).toEqual(["2"]);

    const withoutModality = filterEvents(events, { status: "upcoming" }, now);
    expect(withoutModality.map((e) => e.id)).toEqual(["1", "2", "5"]);
  });
});

describe("countActiveFilters", () => {
  it("cuenta modalidad, estado y rango de fechas", () => {
    expect(countActiveFilters({})).toBe(0);
    expect(countActiveFilters({ modality: "remote" })).toBe(1);
    expect(
      countActiveFilters({ modality: "remote", status: "upcoming" })
    ).toBe(2);
    expect(
      countActiveFilters({
        modality: "remote",
        status: "upcoming",
        dateFrom: "2026-06-01",
      })
    ).toBe(3);
    expect(countActiveFilters({ dateFrom: "2026-06-01" })).toBe(1);
    expect(countActiveFilters({ modality: ["remote", "hybrid"] })).toBe(1);
    expect(countActiveFilters({ modality: [] })).toBe(0);
  });
});
