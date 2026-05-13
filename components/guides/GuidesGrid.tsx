"use client";

import { useState } from "react";
import { GuideCard } from "./GuideCard";
import { cn } from "@/lib/utils";
import type { Guide } from "@/types";

interface GuidesGridProps {
  guides: Guide[];
}

const yearLevels = [
  { label: "All Years", value: null },
  { label: "1st Year", value: 1 },
  { label: "2nd Year", value: 2 },
  { label: "3rd Year", value: 3 },
  { label: "4th+ Year", value: 4 },
];

const difficulties = [
  { label: "All Levels", value: null },
  { label: "1st Year", value: "easy" },
  { label: "2nd–3rd Year", value: "medium" },
  { label: "Advanced", value: "hard" },
];

export function GuidesGrid({ guides }: GuidesGridProps) {
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);

  const filtered = guides.filter((g) => {
    if (yearFilter && g.year_level !== yearFilter) return false;
    if (difficultyFilter && g.difficulty !== difficultyFilter) return false;
    return true;
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <FilterGroup
          label="Year Level"
          options={yearLevels}
          value={yearFilter}
          onChange={setYearFilter}
        />
        <FilterGroup
          label="Difficulty"
          options={difficulties}
          value={difficultyFilter}
          onChange={setDifficultyFilter}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[var(--color-border)]">
          <p className="font-display text-2xl text-[var(--color-text)] mb-2">
            No guides found
          </p>
          <p className="text-sm text-[var(--color-muted)]">
            Try adjusting your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterGroup<T extends string | number | null>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mr-1">
        {label}:
      </span>
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
            value === opt.value
              ? "bg-[var(--color-primary)] text-white"
              : "bg-white border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)]/40"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
