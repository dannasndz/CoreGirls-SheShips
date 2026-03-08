"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { careers, categoryLabels, Career } from "@/data/careers";
import CareerCard from "./_components/CareerCard";
import CareerModal from "./_components/CareerModal";
import { Search, Flame, Filter, ChevronDown } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const ITEMS_PER_PAGE = 18; // 3 rows × 6 cols

const stemFilters = [
  { label: "Science", value: "S" },
  { label: "Technology", value: "T" },
  { label: "Engineering", value: "E" },
  { label: "Mathematics", value: "M" },
];

function ExploreCareersContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(
    initialCategory && ["S", "T", "E", "M"].includes(initialCategory) ? initialCategory : null
  );
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...careers].sort((a, b) => a.name.localeCompare(b.name));

    if (activeFilter === "growth") {
      result = result.filter((c) => c.growth);
    } else if (activeFilter) {
      result = result.filter((c) => c.category === activeFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.studyPaths.some((p) => p.toLowerCase().includes(q))
      );
    }

    return result;
  }, [search, activeFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedCareers = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filters/search change
  const handleFilterChange = (value: string) => {
    setActiveFilter(activeFilter === value ? null : value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-cream pb-20">
      {/* Header */}
      <div className="text-center pt-12 pb-8 px-6">
        <h1
          className="text-6xl md:text-7xl font-extrabold text-dark-purple"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          Who could that be?
        </h1>
      </div>

      {/* Search + Filters */}
      <div className="max-w-4xl mx-auto px-6 mb-6 flex flex-col sm:flex-row items-stretch gap-3">
        {/* Search bar */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-girly-purple" size={18} />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search careers, skills, or fields..."
            className="w-full pl-12 pr-4 py-2.5 rounded-full border-2 border-girly-purple/30 bg-white text-dark-purple placeholder:text-dark-purple/40 focus:border-girly-purple focus:outline-none transition-colors text-base"
            style={{ fontFamily: "var(--font-baloo)" }}
          />
        </div>

        {/* Filters - always in one row */}
        <div className="flex flex-row items-center gap-3 justify-center sm:justify-start">
          {/* TOP Growth button */}
          <button
            onClick={() => handleFilterChange("growth")}
            className={`inline-flex items-center cursor-pointer gap-2 px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all duration-300 ${
              activeFilter === "growth"
                ? "bg-linear-to-br from-cute-orange to-hot-pink text-white shadow-lg scale-105"
                : "bg-linear-to-r from-cute-orange/15 to-hot-pink/15 text-cute-orange hover:from-cute-orange/25 hover:to-hot-pink/25 border border-cute-orange/30"
            }`}
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            <Flame size={16} />
            TOP Growth 2026
          </button>

          {/* STEM Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`inline-flex items-center cursor-pointer gap-2 px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all duration-300 ${
                  activeFilter && ["S", "T", "E", "M"].includes(activeFilter)
                    ? "bg-girly-purple text-white shadow-lg"
                    : "bg-girly-purple/15 text-girly-purple hover:bg-girly-purple/25"
                }`}
                style={{ fontFamily: "var(--font-fredoka)" }}
              >
                <Filter size={16} />
                {activeFilter && ["S", "T", "E", "M"].includes(activeFilter)
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
              {activeFilter && ["S", "T", "E", "M"].includes(activeFilter) && (
                <>
                  <div className="border-t border-girly-purple/10 my-1" />
                  <DropdownMenuItem
                    onClick={() => handleFilterChange(activeFilter)}
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

      {/* Disclaimer for TOP filter */}
      {activeFilter === "growth" && (
        <div className="max-w-6xl mx-auto px-6 mb-6">
          <p
            className="text-center text-sm text-dark-purple/40 italic"
            style={{ fontFamily: "var(--font-baloo)" }}
          >
            * Listed alphabetically, not in order of relevance.
          </p>
        </div>
      )}

      {/* Career grid */}
      <div className="max-w-8xl mx-auto px-8 sm:px-8 lg:px-60">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {paginatedCareers.map((career) => (
              <CareerCard
                key={career.id}
                career={career}
                onClick={setSelectedCareer}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p
              className="text-2xl text-dark-purple/50 font-semibold"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              No careers found
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="max-w-6xl mx-auto px-6 mt-10">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={page === currentPage}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page);
                    }}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Modal */}
      {selectedCareer && (
        <CareerModal
          career={selectedCareer}
          onClose={() => setSelectedCareer(null)}
        />
      )}
    </div>
  );
}

export default function ExploreCareersPage() {
  return (
    <Suspense>
      <ExploreCareersContent />
    </Suspense>
  );
}
