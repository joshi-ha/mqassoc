import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EventsGrid } from "@/components/events/EventsGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { createClient } from "@/lib/supabase/server";
import type { Event } from "@/types";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming and past ASSOC events — networking nights, workshops, socials and more.",
};

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

async function getEvents(): Promise<Event[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: false });
    if (error) {
      console.error("Supabase events error:", error);
      return PLACEHOLDER_EVENTS;
    }
    return data?.length ? data : PLACEHOLDER_EVENTS;
  } catch {
    return PLACEHOLDER_EVENTS;
  }
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-[var(--color-primary)] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="What's On"
              title="ASSOC Events"
              subtitle="Networking nights, workshops, socials, and everything in between. There's always something on."
              light
            />
          </div>
        </section>

        {/* Grid */}
        <section className="py-16 bg-[var(--color-cream)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <EventsGrid events={events} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
