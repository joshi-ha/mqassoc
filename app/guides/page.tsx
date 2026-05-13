import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { GuideCard } from "@/components/guides/GuideCard"
import { getPublishedGuides, getGuidesByYear } from "@/lib/guides"
import { BookOpen } from "lucide-react"

export const metadata: Metadata = {
  title: "Unit Survival Guides | ASSOC",
  description: "Student-written survival guides for every actuarial unit at Macquarie University. Real advice from students who've been there.",
}

const YEAR_FILTERS = [
  { label: "All",    value: null },
  { label: "Year 1", value: 1 },
  { label: "Year 2", value: 2 },
  { label: "Year 3", value: 3 },
  { label: "Year 4", value: 4 },
]

type Props = { searchParams: Promise<{ year?: string }> }

export default async function GuidesPage({ searchParams }: Props) {
  const { year: yearParam } = await searchParams
  const yearLevel = yearParam ? parseInt(yearParam) : null

  const guides = yearLevel
    ? await getGuidesByYear(yearLevel)
    : await getPublishedGuides()

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-[var(--color-primary)] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60 mb-4">
              Student Resources
            </p>
            <h1 className="font-display text-4xl sm:text-5xl text-white mb-4">
              Unit Survival Guides
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Real advice from students who&apos;ve been there.
            </p>
          </div>
        </section>

        {/* Filter bar */}
        <div className="bg-white border-b border-[var(--color-border)] sticky top-16 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-none">
              {YEAR_FILTERS.map(({ label, value }) => {
                const active = yearLevel === value
                const href = value ? `/guides?year=${value}` : "/guides"
                return (
                  <Link
                    key={label}
                    href={href}
                    className={
                      active
                        ? "shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold bg-[var(--color-primary)] text-white"
                        : "shrink-0 px-4 py-1.5 rounded-full text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-cream-dark)] transition-colors"
                    }
                  >
                    {label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Guides grid */}
        <section className="py-14 bg-[var(--color-cream)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {guides.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen size={40} className="text-[var(--color-muted)] mx-auto mb-4" />
                <p className="font-display text-2xl text-[var(--color-text)] mb-2">
                  No guides published yet{yearLevel ? ` for Year ${yearLevel}` : ""}
                </p>
                <p className="text-[var(--color-muted)]">Check back soon!</p>
                {yearLevel && (
                  <Link
                    href="/guides"
                    className="inline-block mt-6 text-sm font-semibold text-[var(--color-primary)] hover:underline"
                  >
                    View all guides →
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {guides.map((guide) => (
                  <GuideCard key={guide.id} guide={guide} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
