import Link from "next/link"
import { Suspense } from "react"
import { MapPin } from "lucide-react"
import { getHomePageEvents } from "@/lib/events"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { Button } from "@/components/ui/Button"
import { formatShortDate } from "@/lib/utils"
import { cn } from "@/lib/utils"
import type { Event } from "@/types"

function EventPreviewCard({ event }: { event: Event }) {
  const { day, month } = formatShortDate(event.event_date)
  const isFree = !event.price || event.price.toLowerCase() === "free"

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex flex-col bg-cream rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/30 transition-all duration-300 relative"
    >
      {/* Gold left border accent on hover */}
      <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center rounded-full" />

      {/* Date badge */}
      <div className="bg-primary px-5 py-3.5 flex items-center gap-3">
        <div className="text-center min-w-10">
          <p className="font-display text-2xl text-white leading-none">{day}</p>
          <p className="font-sans text-[10px] text-white/80 font-semibold uppercase tracking-wider mt-0.5">
            {month}
          </p>
        </div>
        {event.is_featured && (
          <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider bg-white/20 text-white px-2.5 py-1 rounded-full">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-display text-lg text-text mb-3 group-hover:text-primary transition-colors leading-snug">
          {event.title}
        </h3>

        {event.location && (
          <div className="flex items-start gap-1.5 text-xs text-muted mb-3">
            <MapPin size={12} className="mt-0.5 shrink-0" />
            <span>{event.location}</span>
          </div>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between border-t border-border">
          <span
            className={cn(
              "text-xs font-semibold px-2.5 py-1 rounded-full",
              isFree
                ? "bg-primary/10 text-primary"
                : "bg-cream-dark text-muted border border-border"
            )}
          >
            {event.price ?? "Free"}
          </span>
          <span className="text-xs font-medium text-primary group-hover:underline">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  )
}

function PlaceholderCard() {
  return (
    <div className="flex flex-col bg-cream rounded-2xl border border-dashed border-border overflow-hidden opacity-60">
      <div className="bg-muted/20 px-5 py-3.5 flex items-center gap-3">
        <div className="text-center min-w-10">
          <div className="h-7 w-7 bg-muted/30 rounded mx-auto" />
          <div className="h-2 w-8 bg-muted/20 rounded mt-1 mx-auto" />
        </div>
      </div>
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="h-5 bg-muted/20 rounded w-3/4" />
        <div className="h-4 bg-muted/15 rounded w-1/2" />
        <div className="mt-auto pt-3 border-t border-border">
          <div className="h-3 bg-muted/15 rounded w-1/3" />
        </div>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="flex flex-col bg-cream rounded-2xl border border-border overflow-hidden animate-pulse">
      <div className="bg-primary/20 h-15" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-muted/20 rounded w-4/5" />
        <div className="h-3 bg-muted/15 rounded w-1/2" />
        <div className="h-3 bg-muted/10 rounded w-2/3 mt-4" />
      </div>
    </div>
  )
}

async function EventsPreviewInner() {
  const events = await getHomePageEvents()
  const placeholderCount = Math.max(0, 3 - events.length)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventPreviewCard key={event.id} event={event} />
      ))}
      {Array.from({ length: placeholderCount }).map((_, i) => (
        <PlaceholderCard key={`placeholder-${i}`} />
      ))}
    </div>
  )
}

export function EventsPreview() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
          <SectionHeading
            eyebrow="What's On"
            title="Our Events"
            subtitle="From networking nights to workshops — there's always something on."
            align="left"
          />
          <Button asChild variant="outline" size="sm" className="shrink-0">
            <Link href="/events">View All Events →</Link>
          </Button>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          }
        >
          <EventsPreviewInner />
        </Suspense>
      </div>
    </section>
  )
}
