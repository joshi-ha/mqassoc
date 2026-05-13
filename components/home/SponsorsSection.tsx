import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import type { Sponsor } from "@/types";

const PLACEHOLDER_SPONSORS: Sponsor[] = [
  { id: "1", name: "Deloitte", tier: "platinum", display_order: 0, active: true },
  { id: "2", name: "PwC", tier: "gold", display_order: 0, active: true },
  { id: "3", name: "Finity", tier: "silver", display_order: 1, active: true },
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

const tierConfig = {
  platinum: { label: "Platinum Partner", size: "text-xl font-semibold", px: "px-10 py-6" },
  gold: { label: "Gold Partner", size: "text-lg font-medium", px: "px-8 py-5" },
  silver: { label: "Silver Partner", size: "text-base font-medium", px: "px-7 py-4" },
  bronze: { label: "Bronze Partner", size: "text-sm", px: "px-6 py-4" },
};

export async function SponsorsSection() {
  const sponsors = await getSponsors();
  const platinum = sponsors.filter((s) => s.tier === "platinum");
  const gold = sponsors.filter((s) => s.tier === "gold");
  const silver = sponsors.filter((s) => s.tier === "silver");

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Partners"
          title="Our Partners"
          subtitle="We're proud to partner with leading firms who share our commitment to developing the next generation of actuaries."
        />

        <div className="mt-14 space-y-8">
          {platinum.length > 0 && (
            <SponsorRow sponsors={platinum} tier="platinum" />
          )}
          {gold.length > 0 && (
            <SponsorRow sponsors={gold} tier="gold" />
          )}
          {silver.length > 0 && (
            <SponsorRow sponsors={silver} tier="silver" />
          )}
        </div>

        <div className="mt-14 text-center">
          <Button asChild variant="outline" size="md">
            <Link href="/sponsors">View All Partners</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function SponsorRow({ sponsors, tier }: { sponsors: Sponsor[]; tier: keyof typeof tierConfig }) {
  const config = tierConfig[tier];
  return (
    <div>
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)] mb-5">
        {config.label}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        {sponsors.map((sponsor) => (
          <a
            key={sponsor.id}
            href={sponsor.website_url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={`group ${config.px} bg-[var(--color-cream)] rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)]/40 hover:shadow-md transition-all duration-200 flex items-center justify-center`}
          >
            {sponsor.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={sponsor.logo_url}
                alt={sponsor.name}
                className="h-10 w-auto object-contain opacity-70 group-hover:opacity-100 transition-opacity"
              />
            ) : (
              <span
                className={`font-display text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors ${config.size}`}
              >
                {sponsor.name}
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
