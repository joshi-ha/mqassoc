"use client";

import { useState } from "react";
import { EventCard } from "./EventCard";
import { isUpcoming } from "@/lib/utils";
import type { Event } from "@/types";
import { cn } from "@/lib/utils";

interface EventsGridProps {
  events: Event[];
}

export function EventsGrid({ events }: EventsGridProps) {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  const filtered = events.filter((e) =>
    tab === "upcoming" ? isUpcoming(e.event_date) : !isUpcoming(e.event_date)
  );

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-10">
        {(["upcoming", "past"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-medium capitalize transition-all",
              tab === t
                ? "bg-[var(--color-primary)] text-white shadow-sm"
                : "bg-white border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)]/40 hover:text-[var(--color-text)]"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[var(--color-border)]">
          <p className="font-display text-2xl text-[var(--color-text)] mb-2">
            {tab === "upcoming" ? "No upcoming events" : "No past events"}
          </p>
          <p className="text-sm text-[var(--color-muted)]">
            {tab === "upcoming"
              ? "Check back soon — we're always planning something."
              : "Events will appear here once they've passed."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
