import Link from "next/link";
import { BookOpen, User, Tag } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { Guide } from "@/types";

interface GuideCardProps {
  guide: Guide;
}

export function GuideCard({ guide }: GuideCardProps) {
  const difficultyVariant =
    guide.difficulty === "easy"
      ? "easy"
      : guide.difficulty === "medium"
      ? "medium"
      : guide.difficulty === "hard"
      ? "hard"
      : "cream";

  return (
    <Link
      href={`/guides/${guide.id}`}
      className="group block bg-white rounded-2xl border border-[var(--color-border)] p-6 hover:shadow-lg hover:border-[var(--color-primary)]/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="w-10 h-10 rounded-lg bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)] flex items-center justify-center shrink-0">
          <BookOpen size={18} className="text-[var(--color-primary)]" />
        </div>
        {guide.difficulty && (
          <Badge variant={difficultyVariant as "easy" | "medium" | "hard"}>
            {guide.difficulty === "easy"
              ? "1st Year"
              : guide.difficulty === "medium"
              ? "2nd–3rd Year"
              : "Advanced"}
          </Badge>
        )}
      </div>

      <p className="font-sans text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-1">
        {guide.unit_code}
      </p>
      <h3 className="font-display text-lg text-[var(--color-text)] mb-1 group-hover:text-[var(--color-primary)] transition-colors leading-snug">
        {guide.title}
      </h3>
      <p className="text-sm text-[var(--color-muted)] mb-4">{guide.unit_name}</p>

      {guide.author && (
        <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted)] mb-3">
          <User size={12} />
          {guide.author}
        </div>
      )}

      {guide.tags && guide.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {guide.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-xs text-[var(--color-muted)] bg-[var(--color-cream-dark)] rounded-full px-2.5 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
