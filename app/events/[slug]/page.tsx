import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  ExternalLink,
  Tag,
  ArrowLeft,
  Navigation,
} from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { EventCard } from "@/components/events/EventCard"
import { getEventBySlug, getAllEventSlugs, getUpcomingEvents } from "@/lib/events"
import { formatEventDate, isEventPast } from "@/lib/utils"
import { cn } from "@/lib/utils"

export const revalidate = 60

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllEventSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) return { title: "Event Not Found" }
  return {
    title: event.title,
    description: event.description ?? `${event.title} — ASSOC Event`,
  }
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params
  const [event, moreEvents] = await Promise.all([
    getEventBySlug(slug),
    getUpcomingEvents(4),
  ])

  if (!event) notFound()

  const past = event.is_past ?? isEventPast(event.event_date)
  const relatedEvents = moreEvents.filter((e) => e.slug !== slug).slice(0, 3)

  const googleMapsUrl = event.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`
    : event.location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`
    : null

  const descriptionParagraphs = (event.long_description ?? event.description ?? "")
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <>
      <Navbar />
      <main>
        {/* Back link */}
        <div className="bg-cream border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors"
            >
              <ArrowLeft size={14} />
              Back to Events
            </Link>
          </div>
        </div>

        {/* Hero image */}
        {event.image_url ? (
          <div className="relative w-full h-64 sm:h-80 lg:h-[420px] bg-primary/10">
            <Image
              src={event.image_url}
              alt={event.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        ) : (
          <div className="relative w-full h-48 sm:h-64 bg-primary flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="text-center text-white relative z-10">
              <p className="font-display text-4xl sm:text-5xl mb-1">ASSOC</p>
              <p className="text-white/70 text-sm font-medium uppercase tracking-widest">
                Macquarie University Actuarial Students&apos; Society
              </p>
            </div>
          </div>
        )}

        {/* Main content */}
        <section className="bg-cream py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* LEFT — description */}
              <div className="lg:col-span-2">
                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full"
                      >
                        <Tag size={10} />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Status badge */}
                {past && (
                  <span className="inline-block text-xs font-semibold uppercase tracking-wider bg-muted/15 text-muted px-3 py-1 rounded-full mb-4">
                    Past Event
                  </span>
                )}

                <h1 className="font-display text-3xl sm:text-4xl text-text mb-6 leading-tight">
                  {event.title}
                </h1>

                {descriptionParagraphs.length > 0 ? (
                  <div className="prose prose-sm sm:prose-base max-w-none text-muted leading-relaxed space-y-4">
                    {descriptionParagraphs.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted italic text-sm">No description provided.</p>
                )}
              </div>

              {/* RIGHT — info sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 bg-white rounded-2xl border-l-4 border-primary shadow-sm p-6 space-y-5">
                  {/* Date & time */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Calendar size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-0.5">
                        Date & Time
                      </p>
                      <p className="text-sm text-text font-medium leading-snug">
                        {formatEventDate(event.event_date)}
                      </p>
                      {event.end_date && (
                        <p className="text-xs text-muted mt-1 flex items-center gap-1">
                          <Clock size={11} />
                          Ends {formatEventDate(event.end_date, true)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  {(event.location || event.address) && (
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-0.5">
                          Location
                        </p>
                        {event.location && (
                          <p className="text-sm text-text font-medium">{event.location}</p>
                        )}
                        {event.address && (
                          <p className="text-xs text-muted mt-0.5">{event.address}</p>
                        )}
                        {googleMapsUrl && (
                          <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1.5 font-medium"
                          >
                            <Navigation size={11} />
                            Open in Maps
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-primary font-bold text-sm">$</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-0.5">
                        Price
                      </p>
                      <p className="text-sm text-text font-medium">{event.price ?? "Free"}</p>
                    </div>
                  </div>

                  {/* Capacity */}
                  {event.capacity && (
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Users size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-0.5">
                          Capacity
                        </p>
                        <p className="text-sm text-text font-medium">{event.capacity} spots</p>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-border">
                    {event.registration_url ? (
                      <a
                        href={event.registration_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "flex items-center justify-center gap-2 w-full rounded-full py-3 text-sm font-semibold transition-all",
                          past
                            ? "bg-muted/20 text-muted cursor-not-allowed"
                            : "bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-md"
                        )}
                        aria-disabled={past}
                        onClick={past ? (e) => e.preventDefault() : undefined}
                      >
                        {event.registration_label ?? "Register Now"}
                        {!past && <ExternalLink size={14} />}
                      </a>
                    ) : (
                      <a
                        href="mailto:assoc@mq.edu.au"
                        className="flex items-center justify-center gap-2 w-full rounded-full py-3 text-sm font-semibold border border-primary text-primary hover:bg-primary hover:text-white transition-all"
                      >
                        Contact us to register
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* More events */}
        {relatedEvents.length > 0 && (
          <section className="py-16 bg-white border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-10">
                <h2 className="font-display text-2xl text-text">More Events</h2>
                <Link
                  href="/events"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View all →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedEvents.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
