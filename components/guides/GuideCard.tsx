import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Guide } from "@/types";

const DIFFICULTY_STYLES = {
  easy: { badge: "bg-emerald-100 text-emerald-700", label: "Easy" },
  medium: { badge: "bg-amber-100   text-amber-700", label: "Medium" },
  hard: { badge: "bg-rose-100    text-rose-700", label: "Hard" },
};

export function GuideCard({ guide }: { guide: Guide }) {
  const diff = guide.difficulty ? DIFFICULTY_STYLES[guide.difficulty] : null;
  const preview = guide.intro
    ? guide.intro.length > 120
      ? guide.intro.slice(0, 120).trimEnd() + "…"
      : guide.intro
    : null;

  const href = guide.slug ? `/guides/${guide.slug}` : `/guides/${guide.id}`;

  return (
    <Link
      href={href}
      className="group flex flex-col bg-white rounded-2xl border border-border p-6 hover:shadow-lg hover:border-[var(--color-primary)]/40 transition-all duration-300"
    >
      {/* Top row: unit code pill + difficulty badge */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="inline-block text-xs font-bold font-mono tracking-wider px-2.5 py-1 rounded-full bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] text-[var(--color-primary)]">
          {guide.unit_code}
        </span>
        {diff && (
          <span
            className={cn(
              "text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0",
              diff.badge,
            )}
          >
            {diff.label}
          </span>
        )}
      </div>

      {/* Unit name */}
      <p className="text-xs text-[var(--color-muted)] mb-1">
        {guide.unit_name}
      </p>

      {/* Title */}
      <h3 className="font-display text-lg text-[var(--color-text)] leading-snug mb-2 group-hover:text-[var(--color-primary)] transition-colors">
        {guide.title}
      </h3>

      {/* Author */}
      {guide.author && (
        <p className="text-xs italic text-[var(--color-muted)] mb-3">
          By {guide.author}
        </p>
      )}

      {/* Intro preview */}
      {preview && (
        <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-4 flex-1">
          {preview}
        </p>
      )}

      {/* Bottom row */}
      <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          {guide.year_level && (
            <span className="text-xs font-medium text-[var(--color-muted)] bg-[var(--color-cream-dark)] px-2 py-0.5 rounded-full">
              Year {guide.year_level}
            </span>
          )}
          {guide.read_time_minutes && (
            <span className="flex items-center gap-1 text-xs text-[var(--color-muted)]">
              <Clock size={11} />~{guide.read_time_minutes} min
            </span>
          )}
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)] group-hover:gap-2 transition-all">
          Read Guide <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}
