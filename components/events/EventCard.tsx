import Link from "next/link"
import { MapPin } from "lucide-react"
import { formatShortDate, formatEventDateShort, isEventPast } from "@/lib/utils"
import { cn } from "@/lib/utils"
import type { Event } from "@/types"

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const { day, month } = formatShortDate(event.event_date)
  const fullDateShort = formatEventDateShort(event.event_date)
  const past = isEventPast(event.event_date)

  return (
    <Link
      href={`/events/${event.slug}`}
      className={cn(
        "group flex flex-col bg-white rounded-xl border overflow-hidden transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-0.5",
        past
          ? "border-border opacity-80"
          : "border-border hover:border-primary/40"
      )}
    >
      {/* Date badge header */}
      <div
        className={cn(
          "px-5 py-3.5 flex items-center gap-3",
          past ? "bg-muted" : "bg-primary"
        )}
      >
        <div className="text-center min-w-10">
          <p className="font-display text-2xl text-white leading-none">{day}</p>
          <p className="font-sans text-[10px] text-white/80 font-semibold uppercase tracking-wider mt-0.5">
            {month}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          {past && (
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-full">
              Past
            </span>
          )}
          {event.is_featured && !past && (
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-full">
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <p className="text-xs text-muted mb-2 font-medium">{fullDateShort}</p>

        <h3
          className={cn(
            "font-display text-lg mb-3 transition-colors leading-snug",
            past
              ? "text-muted"
              : "text-text group-hover:text-primary"
          )}
        >
          {event.title}
        </h3>

        {event.location && (
          <div className="flex items-start gap-1.5 text-xs text-muted mb-3">
            <MapPin size={12} className="mt-0.5 shrink-0" />
            <span>{event.location}</span>
          </div>
        )}

        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {event.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[10px] font-medium bg-cream text-muted px-2 py-0.5 rounded-full border border-border"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          <span
            className={cn(
              "text-xs font-semibold px-2.5 py-1 rounded-full",
              !event.price || event.price.toLowerCase() === "free"
                ? "bg-primary/10 text-primary"
                : "bg-cream text-muted border border-border"
            )}
          >
            {event.price ?? "Free"}
          </span>

          <span
            className={cn(
              "text-xs font-semibold border rounded-full px-3 py-1.5 transition-all",
              past
                ? "border-border text-muted group-hover:border-muted group-hover:text-text"
                : "border-primary text-primary group-hover:bg-primary group-hover:text-white"
            )}
          >
            View Details
          </span>
        </div>
      </div>
    </Link>
  )
}
