"use client";

import { useState, useMemo } from "react";
import { roleModels, categoryLabels } from "@/data/roleModels";
import RoleModelCard from "./_components/RoleModelCard";
import { Search, Filter, ChevronDown, History } from "lucide-react";
import SplitText from "@/components/SplitText";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const stemFilters = [
  { label: "Science", value: "S" },
  { label: "Technology", value: "T" },
  { label: "Engineering", value: "E" },
  { label: "Mathematics", value: "M" },
];

export default function ReferencesPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showHistorical, setShowHistorical] = useState<boolean | null>(null);

  const filtered = useMemo(() => {
    let result = [...roleModels].sort((a, b) => a.name.localeCompare(b.name));

    if (activeFilter) {
      result = result.filter((r) => r.category === activeFilter);
    }

    if (showHistorical === true) {
      result = result.filter((r) => r.historical);
    } else if (showHistorical === false) {
      result = result.filter((r) => !r.historical);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.field.toLowerCase().includes(q) ||
          r.country.toLowerCase().includes(q) ||
          r.summary.toLowerCase().includes(q)
      );
    }

    return result;
  }, [search, activeFilter, showHistorical]);

  const handleFilterChange = (value: string) => {
    setActiveFilter(activeFilter === value ? null : value);
  };

  return (
    <div className="min-h-screen bg-cream pb-20">
      {/* Header */}
      <div className="text-center pt-8 sm:pt-12 pb-4 sm:pb-6 px-4 sm:px-6">
        <SplitText
          text="They Did It. So Can You."
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-dark-purple"
          delay={40}
          duration={1}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-50px"
          textAlign="center"
          tag="h1"
          onLetterAnimationComplete={() => {}}
        />
        <p
          className="text-lg sm:text-xl text-dark-purple/60 mt-2 max-w-2xl mx-auto"
          style={{ fontFamily: "var(--font-baloo)" }}
        >
          Latina women who have shaped STEM across the world.
          Get inspired by their stories, they prove there&apos;s a place for you too.
        </p>
      </div>

      {/* Search + Filter */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-8 flex flex-col sm:flex-row items-stretch gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-girly-purple" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, field, or country..."
            className="w-full pl-11 pr-4 py-2.5 rounded-full border-2 border-girly-purple/30 bg-white text-dark-purple placeholder:text-dark-purple/40 focus:border-girly-purple focus:outline-none transition-colors text-sm sm:text-base"
            style={{ fontFamily: "var(--font-baloo)" }}
          />
        </div>

        {/* Filters row */}
        <div className="flex flex-row items-center gap-2 sm:gap-3 justify-center sm:justify-start">
          {/* Historical toggle */}
          <button
            onClick={() =>
              setShowHistorical(
                showHistorical === true ? null : showHistorical === false ? true : true
              )
            }
            className={`inline-flex items-center cursor-pointer gap-1.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-300 ${
              showHistorical === true
                ? "bg-cute-orange text-white shadow-lg"
                : "bg-cute-orange/15 text-cute-orange hover:bg-cute-orange/25 border border-cute-orange/30"
            }`}
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            <History size={14} />
            Pioneers
          </button>

          {/* Current toggle */}
          <button
            onClick={() =>
              setShowHistorical(
                showHistorical === false ? null : false
              )
            }
            className={`inline-flex items-center cursor-pointer gap-1.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-300 ${
              showHistorical === false
                ? "bg-hot-pink text-white shadow-lg"
                : "bg-hot-pink/15 text-hot-pink hover:bg-hot-pink/25 border border-hot-pink/30"
            }`}
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            Current Leaders
          </button>

          {/* STEM Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={`inline-flex items-center cursor-pointer gap-2 px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all duration-300 ${
                activeFilter
                  ? "bg-girly-purple text-white shadow-lg"
                  : "bg-girly-purple/15 text-girly-purple hover:bg-girly-purple/25"
              }`}
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              <Filter size={16} />
              {activeFilter
                ? stemFilters.find((f) => f.value === activeFilter)?.label
                : "STEM Field"}
              <ChevronDown size={14} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-2xl p-2">
            {stemFilters.map((f) => (
              <DropdownMenuItem
                key={f.value}
                onClick={() => handleFilterChange(f.value)}
                className={`rounded-xl cursor-pointer font-semibold text-sm ${
                  activeFilter === f.value
                    ? "bg-girly-purple/10 text-girly-purple"
                    : "text-dark-purple"
                }`}
                style={{ fontFamily: "var(--font-fredoka)" }}
              >
                {f.label}
              </DropdownMenuItem>
            ))}
            {activeFilter && (
              <>
                <div className="border-t border-girly-purple/10 my-1" />
                <DropdownMenuItem
                  onClick={() => setActiveFilter(null)}
                  className="rounded-xl cursor-pointer font-semibold text-sm text-dark-purple/50"
                  style={{ fontFamily: "var(--font-fredoka)" }}
                >
                  Clear filter
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </div>

      {/* Results count */}
      <div className="w-full px-4 sm:px-6 md:px-8 mb-4">
        <p
          className="text-sm text-dark-purple/40"
          style={{ fontFamily: "var(--font-baloo)" }}
        >
          {filtered.length} role model{filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Grid */}
      <div className="w-full px-4 sm:px-6 md:px-8">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {filtered.map((roleModel) => (
              <RoleModelCard key={roleModel.id} roleModel={roleModel} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p
              className="text-2xl text-dark-purple/50 font-semibold"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              No role models found
            </p>
            <p
              className="text-lg text-dark-purple/40 mt-2"
              style={{ fontFamily: "var(--font-baloo)" }}
            >
              Try a different search or filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
