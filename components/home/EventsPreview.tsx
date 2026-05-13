import Link from "next/link";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { formatShortDate } from "@/lib/utils";
import type { Event } from "@/types";

const PLACEHOLDER_EVENTS: Event[] = [
  {
    id: "1",
    title: "Industry Networking Night 2025",
    description:
      "Connect with actuarial professionals from top firms including Deloitte, PwC, and Finity. Bring your resume and come ready to network.",
    event_date: new Date(Date.now() + 14 * 86400000).toISOString(),
    location: "Macquarie University, Building X",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "ASSOC Trivia Night",
    description:
      "Put your actuarial knowledge — and general trivia skills — to the test. Teams of 4–6, prizes for the top three teams.",
    event_date: new Date(Date.now() + 28 * 86400000).toISOString(),
    location: "The Noodle House, Macquarie Centre",
    is_featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Resume Workshop",
    description:
      "Get personalised feedback on your actuarial resume from senior students and industry professionals before graduate applications open.",
    event_date: new Date(Date.now() + 42 * 86400000).toISOString(),
    location: "Online (Zoom)",
    is_featured: false,
    created_at: new Date().toISOString(),
  },
];

async function getUpcomingEvents(): Promise<Event[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .gte("event_date", new Date().toISOString())
      .order("event_date", { ascending: true })
      .limit(3);

    if (error) {
      console.error("Supabase events error:", error);
      return PLACEHOLDER_EVENTS;
    }
    return data?.length ? data : PLACEHOLDER_EVENTS;
  } catch {
    return PLACEHOLDER_EVENTS;
  }
}

export async function EventsPreview() {
  const events = await getUpcomingEvents();

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
            <Link href="/events">View All Events</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event) => {
            const { day, month } = formatShortDate(event.event_date);
            return (
              <div
                key={event.id}
                className="group bg-[var(--color-cream)] rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-lg hover:border-[var(--color-primary)]/30 transition-all duration-300"
              >
                {/* Date badge header */}
                <div className="bg-[var(--color-primary)] px-6 py-4 flex items-center gap-4">
                  <div className="text-center">
                    <p className="font-display text-3xl text-white leading-none">
                      {day}
                    </p>
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
                  <h3 className="font-display text-lg text-[var(--color-text)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                    {event.title}
                  </h3>
                  {event.description && (
                    <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-4 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                  {event.location && (
                    <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
                      <MapPin size={12} />
                      {event.location}
                    </div>
                  )}
                  {event.registration_link && (
                    <a
                      href={event.registration_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] hover:gap-2 transition-all"
                    >
                      Register <ArrowRight size={14} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
