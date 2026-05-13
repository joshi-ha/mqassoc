import type { Metadata } from "next"
import Link from "next/link"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { EventCard } from "@/components/events/EventCard"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { getPaginatedEvents } from "@/lib/events"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Events",
  description:
    "Upcoming and past ASSOC events — networking nights, workshops, socials and more.",
}

const PAGE_SIZE = 9

type Filter = "all" | "upcoming" | "past"

interface PageProps {
  searchParams: Promise<{ filter?: string; page?: string }>
}

function isValidFilter(value: string | undefined): value is Filter {
  return value === "all" || value === "upcoming" || value === "past"
}

export default async function EventsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const filter: Filter = isValidFilter(params.filter) ? params.filter : "upcoming"
  const page = Math.max(1, parseInt(params.page ?? "1", 10))

  const { data: events, count } = await getPaginatedEvents({
    page,
    pageSize: PAGE_SIZE,
    filter,
  })

  const totalPages = Math.ceil(count / PAGE_SIZE)
  const start = (page - 1) * PAGE_SIZE + 1
  const end = Math.min(page * PAGE_SIZE, count)

  const filters: { value: Filter; label: string }[] = [
    { value: "upcoming", label: "Upcoming" },
    { value: "past", label: "Past" },
    { value: "all", label: "All Events" },
  ]

  function pageUrl(p: number) {
    return `/events?filter=${filter}&page=${p}`
  }

  function filterUrl(f: Filter) {
    return `/events?filter=${f}&page=1`
  }

  const pageNumbers = getPageNumbers(page, totalPages)

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-primary py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="What's On"
              title="Our Events"
              subtitle="Networking nights, workshops, socials, and everything in between. There's always something on."
              light
            />
          </div>
        </section>

        {/* Filter tabs */}
        <div className="border-b border-border bg-white sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1 py-3 overflow-x-auto">
              {filters.map((f) => (
                <Link
                  key={f.value}
                  href={filterUrl(f.value)}
                  className={cn(
                    "px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                    filter === f.value
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted hover:text-text hover:bg-cream border border-transparent hover:border-border"
                  )}
                >
                  {f.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Events grid */}
        <section className="py-14 bg-cream min-h-[50vh]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {events.length === 0 ? (
              <EmptyState filter={filter} />
            ) : (
              <>
                {/* Count */}
                <p className="text-sm text-muted mb-8">
                  Showing <span className="font-semibold text-text">{start}–{end}</span> of{" "}
                  <span className="font-semibold text-text">{count}</span> event{count !== 1 ? "s" : ""}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1 mt-14">
                    <Link
                      href={pageUrl(page - 1)}
                      aria-disabled={page <= 1}
                      className={cn(
                        "p-2 rounded-lg border transition-all",
                        page <= 1
                          ? "border-border text-muted pointer-events-none opacity-40"
                          : "border-border text-text hover:border-primary hover:text-primary"
                      )}
                    >
                      <ChevronLeft size={16} />
                    </Link>

                    {pageNumbers.map((n, i) =>
                      n === "…" ? (
                        <span key={`ellipsis-${i}`} className="px-2 text-muted text-sm">
                          …
                        </span>
                      ) : (
                        <Link
                          key={n}
                          href={pageUrl(n as number)}
                          className={cn(
                            "w-9 h-9 flex items-center justify-center rounded-lg border text-sm font-medium transition-all",
                            page === n
                              ? "bg-primary text-white border-primary"
                              : "border-border text-text hover:border-primary hover:text-primary"
                          )}
                        >
                          {n}
                        </Link>
                      )
                    )}

                    <Link
                      href={pageUrl(page + 1)}
                      aria-disabled={page >= totalPages}
                      className={cn(
                        "p-2 rounded-lg border transition-all",
                        page >= totalPages
                          ? "border-border text-muted pointer-events-none opacity-40"
                          : "border-border text-text hover:border-primary hover:text-primary"
                      )}
                    >
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function EmptyState({ filter }: { filter: Filter }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <Calendar size={28} className="text-primary" />
      </div>
      <h2 className="font-display text-2xl text-text mb-2">
        {filter === "upcoming" ? "No upcoming events" : filter === "past" ? "No past events yet" : "No events yet"}
      </h2>
      <p className="text-sm text-muted max-w-xs">
        {filter === "upcoming"
          ? "No upcoming events right now. Check back soon!"
          : filter === "past"
          ? "No past events to show yet."
          : "Events will appear here once they're added."}
      </p>
    </div>
  )
}

function getPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | "…")[] = []
  pages.push(1)
  if (current > 3) pages.push("…")
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i)
  }
  if (current < total - 2) pages.push("…")
  pages.push(total)
  return pages
}
