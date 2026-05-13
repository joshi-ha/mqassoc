import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { createClient } from "@/lib/supabase/server";
import { Link2 } from "lucide-react";
import type { CabinetMember } from "@/types";

export const metadata: Metadata = {
  title: "Meet the Cabinet",
  description: "Meet the ASSOC executive cabinet — the student leaders running your society.",
};

const PLACEHOLDER_CABINET: CabinetMember[] = [
  { id: "1", name: "Alexandra Smith", role: "President", bio: "Final year actuarial student passionate about connecting students with the profession.", linkedin_url: "#", image_url: null!, display_order: 0, year: 2025 },
  { id: "2", name: "James Chen", role: "Vice President", bio: "Third year student focused on academic support and community building.", linkedin_url: "#", image_url: null!, display_order: 1, year: 2025 },
  { id: "3", name: "Sarah Liu", role: "Treasurer", bio: "Managing ASSOC's finances and sponsor relationships.", linkedin_url: "#", image_url: null!, display_order: 2, year: 2025 },
  { id: "4", name: "Michael Torres", role: "Events Director", bio: "Organising ASSOC's calendar of networking nights, workshops, and socials.", linkedin_url: "#", image_url: null!, display_order: 3, year: 2025 },
  { id: "5", name: "Emily Wang", role: "Academic Director", bio: "Overseeing ASSOC's unit survival guides and academic resources.", linkedin_url: "#", image_url: null!, display_order: 4, year: 2025 },
  { id: "6", name: "David Park", role: "Marketing Director", bio: "Managing ASSOC's social media presence and brand communications.", linkedin_url: "#", image_url: null!, display_order: 5, year: 2025 },
];

async function getCabinet(): Promise<CabinetMember[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("cabinet")
      .select("*")
      .order("display_order");
    if (error) {
      console.error("Supabase cabinet error:", error);
      return PLACEHOLDER_CABINET;
    }
    return data?.length ? data : PLACEHOLDER_CABINET;
  } catch {
    return PLACEHOLDER_CABINET;
  }
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2);
}

export default async function CabinetPage() {
  const members = await getCabinet();

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-primary py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <SectionHeading
                eyebrow="Leadership"
                title="Meet the Cabinet"
                subtitle="The student leaders who make ASSOC possible — dedicated, passionate, and here to help."
                light
              />
            </AnimatedSection>
          </div>
        </section>

        {/* Cabinet grid */}
        <section className="py-20 bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((member, i) => (
                <AnimatedSection key={member.id} delay={i * 0.07}>
                  <div className="group bg-white rounded-2xl border border-border p-8 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 text-center">
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-full mx-auto mb-5 overflow-hidden bg-primary/10 flex items-center justify-center">
                      {member.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={member.image_url}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-display text-2xl text-primary">
                          {initials(member.name)}
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-xl text-text">
                      {member.name}
                    </h3>
                    <p className="text-sm font-semibold text-primary mt-0.5 mb-3">
                      {member.role}
                    </p>
                    {member.bio && (
                      <p className="text-sm text-muted leading-relaxed mb-5">
                        {member.bio}
                      </p>
                    )}
                    {member.linkedin_url && (
                      <a
                        href={member.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-primary transition-colors"
                      >
                        <Link2 size={14} /> LinkedIn
                      </a>
                    )}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Join CTA */}
        <section className="py-16 bg-white border-t border-border">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="font-display text-3xl text-text mb-3">
              Interested in Joining the Cabinet?
            </h2>
            <p className="text-muted mb-6">
              Cabinet positions open each year. Follow our socials to be
              notified when applications open.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
