import Link from "next/link";
import { MapPin, ExternalLink } from "lucide-react";
import { formatShortDate, formatDate } from "@/lib/utils";
import type { Event } from "@/types";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const { day, month } = formatShortDate(event.event_date);
  const fullDate = formatDate(event.event_date);

  return (
    <div className="group bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-lg hover:border-[var(--color-primary)]/30 transition-all duration-300">
      <div className="bg-[var(--color-primary)] px-6 py-4 flex items-center gap-4">
        <div>
          <p className="font-display text-3xl text-white leading-none">{day}</p>
          <p className="font-sans text-xs text-white/75 font-semibold uppercase tracking-wider mt-0.5">
            {month}
          </p>
        </div>
        {event.is_featured && (
          <span className="ml-auto text-xs font-medium bg-white/20 text-white px-2.5 py-1 rounded-full">
            Featured
          </span>
        )}
      </div>

      <div className="p-6">
        <p className="text-xs text-[var(--color-muted)] mb-2">{fullDate}</p>
        <h3 className="font-display text-xl text-[var(--color-text)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">
          {event.title}
        </h3>
        {event.description && (
          <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-4">
            {event.description}
          </p>
        )}
        {event.location && (
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted)] mb-4">
            <MapPin size={12} />
            {event.location}
          </div>
        )}
        {event.registration_link && (
          <a
            href={event.registration_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-[var(--color-primary)] rounded-full px-4 py-2 hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            Register <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
}
