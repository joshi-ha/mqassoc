import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SponsorTierSection } from "@/components/sponsors/SponsorTierSection";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import type { Sponsor } from "@/types";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Sponsors",
  description: "Meet the industry partners who support ASSOC and invest in the next generation of actuaries.",
};

const PLACEHOLDER_SPONSORS: Sponsor[] = [
  { id: "1", name: "Deloitte", tier: "platinum", display_order: 0, active: true },
  { id: "2", name: "PwC", tier: "gold", display_order: 0, active: true },
  { id: "3", name: "Finity", tier: "silver", display_order: 0, active: true },
];

async function getSponsors(): Promise<Sponsor[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("sponsors")
      .select("*")
      .eq("active", true)
      .order("display_order");
    if (error) {
      console.error("Supabase sponsors error:", error);
      return PLACEHOLDER_SPONSORS;
    }
    return data?.length ? data : PLACEHOLDER_SPONSORS;
  } catch {
    return PLACEHOLDER_SPONSORS;
  }
}

export default async function SponsorsPage() {
  const sponsors = await getSponsors();

  const tiers = ["platinum", "gold", "silver", "bronze"] as const;
  const byTier = Object.fromEntries(
    tiers.map((t) => [t, sponsors.filter((s) => s.tier === t)])
  ) as Record<typeof tiers[number], Sponsor[]>;

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-primary py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <SectionHeading
                eyebrow="Partners"
                title="Our Partners"
                subtitle="ASSOC's sponsors invest in the next generation of actuaries — providing career opportunities, mentorship, and support."
                light
              />
            </AnimatedSection>
          </div>
        </section>

        {/* Sponsors */}
        <section className="py-20 bg-cream">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {tiers.map((tier) => (
              <AnimatedSection key={tier}>
                <SponsorTierSection tier={tier} sponsors={byTier[tier]} />
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* Become a sponsor */}
        <section className="py-20 bg-white border-t border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="bg-cream rounded-3xl border border-border p-12 text-center">
                <p className="font-sans text-sm font-semibold uppercase tracking-widest text-primary mb-4">
                  Partner With Us
                </p>
                <h2 className="font-display text-4xl text-text mb-4">
                  Become a Sponsor
                </h2>
                <p className="text-muted max-w-xl mx-auto leading-relaxed mb-8">
                  Reach hundreds of talented actuarial students at Macquarie
                  University. Sponsoring ASSOC gives your organisation direct
                  access to Australia&apos;s next generation of actuaries —
                  at networking events, careers fairs, and through our digital
                  channels.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button asChild size="lg">
                    <Link href="/contact">
                      <Mail size={16} /> Get in Touch
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/contact">Download Sponsorship Pack</Link>
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
