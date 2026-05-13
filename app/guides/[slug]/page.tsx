import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GuideTOC } from "@/components/guides/GuideTOC";
import { GuideCard } from "@/components/guides/GuideCard";
import { getGuideBySlug, getPublishedGuides } from "@/lib/guides";
import { cn } from "@/lib/utils";

// ─── Static generation ────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const guides = await getPublishedGuides();
  return guides.filter((g) => !!g.slug).map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) return { title: "Guide Not Found" };
  return {
    title: `${guide.unit_code}: ${guide.title} | ASSOC`,
    description:
      guide.intro ??
      `Unit survival guide for ${guide.unit_name} at Macquarie University.`,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DIFFICULTY_STYLES = {
  easy: { badge: "bg-emerald-100 text-emerald-700", label: "Easy" },
  medium: { badge: "bg-amber-100   text-amber-700", label: "Medium" },
  hard: { badge: "bg-rose-100    text-rose-700", label: "Hard" },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) notFound();

  // Other guides for "More Guides" section
  const allGuides = await getPublishedGuides();
  const moreGuides = allGuides.filter((g) => g.id !== guide.id).slice(0, 3);

  const diff = guide.difficulty ? DIFFICULTY_STYLES[guide.difficulty] : null;
  const sections = guide.sections ?? [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream">
        {/* ── Header ── */}
        <div className="bg-primary py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Guides
            </Link>

            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="text-xs font-bold font-mono tracking-widest text-white/70 bg-white/10 px-3 py-1 rounded-full">
                {guide.unit_code}
              </span>
              {diff && (
                <span
                  className={cn(
                    "text-xs font-semibold px-2.5 py-0.5 rounded-full",
                    diff.badge,
                  )}
                >
                  {diff.label}
                </span>
              )}
              {guide.year_level && (
                <span className="text-xs font-medium text-white/60">
                  Year {guide.year_level}
                </span>
              )}
              {guide.read_time_minutes && (
                <span className="text-xs text-white/50">
                  ~{guide.read_time_minutes} min read
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-3">
              {guide.title}
            </h1>

            {guide.author && (
              <p className="text-white/60 italic text-sm">By {guide.author}</p>
            )}

            {/* Tags */}
            {guide.tags && guide.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                {guide.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-white/50 bg-white/10 rounded-full px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 items-start">
            {/* Main content */}
            <article className="min-w-0">
              {/* Intro pull-quote */}
              {guide.intro && (
                <div className="border-l-4 border-primary pl-6 mb-10">
                  <p className="text-lg text-text italic leading-relaxed">
                    {guide.intro}
                  </p>
                </div>
              )}

              {/* Q&A sections */}
              {sections.length > 0 && (
                <div className="space-y-10">
                  {sections.map((section, i) => (
                    <div key={section.id} id={`section-${section.id}`}>
                      <h2 className="font-display text-2xl text-text mb-1 pb-2 border-b-2 border-primary/20">
                        {section.question}
                      </h2>
                      <div className="space-y-3 mt-4">
                        {section.answer
                          .split("\n")
                          .filter(Boolean)
                          .map((para, j) => (
                            <p key={j} className="text-muted leading-relaxed">
                              {para}
                            </p>
                          ))}
                      </div>
                      {i < sections.length - 1 && (
                        <hr className="mt-10 border-border" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Final notes */}
              {guide.final_notes && (
                <div className="mt-12 pt-8 border-t border-border">
                  <h3 className="font-display text-xl text-text mb-4 flex items-center gap-2">
                    <span className="text-primary">λ</span> A Final Note
                  </h3>
                  <div className="pl-4 italic">
                    {guide.final_notes
                      .split("\n")
                      .filter(Boolean)
                      .map((para, i) => (
                        <p key={i} className="text-muted leading-relaxed mb-2">
                          {para}
                        </p>
                      ))}
                  </div>
                </div>
              )}

              {/* Fallback if no structured content */}
              {sections.length === 0 && !guide.intro && guide.content && (
                <div className="bg-white rounded-2xl border border-border p-8">
                  <p className="text-muted whitespace-pre-line leading-relaxed">
                    {guide.content}
                  </p>
                </div>
              )}
            </article>

            {/* Sidebar — sticky TOC */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-8">
                <GuideTOC sections={sections} />

                {/* Metadata card */}
                <div className="bg-white rounded-2xl border border-border p-5 space-y-3 text-sm">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">
                    Guide Info
                  </p>
                  <div className="flex justify-between">
                    <span className="text-muted">Unit</span>
                    <span className="font-mono font-bold text-primary text-xs">
                      {guide.unit_code}
                    </span>
                  </div>
                  {guide.author && (
                    <div className="flex justify-between">
                      <span className="text-muted">Author</span>
                      <span className="text-text">{guide.author}</span>
                    </div>
                  )}
                  {guide.year_level && (
                    <div className="flex justify-between">
                      <span className="text-muted">Year Level</span>
                      <span className="text-text">Year {guide.year_level}</span>
                    </div>
                  )}
                  {diff && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Difficulty</span>
                      <span
                        className={cn(
                          "text-[11px] font-semibold px-2.5 py-0.5 rounded-full",
                          diff.badge,
                        )}
                      >
                        {diff.label}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* ── More Guides ── */}
        {moreGuides.length > 0 && (
          <section className="border-t border-border py-14">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-2xl text-text">More Guides</h2>
                <Link
                  href="/guides"
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {moreGuides.map((g) => (
                  <GuideCard key={g.id} guide={g} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
