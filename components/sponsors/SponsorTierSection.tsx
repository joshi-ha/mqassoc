import { SponsorCard } from "./SponsorCard";
import type { Sponsor } from "@/types";

const tierConfig = {
  platinum: {
    label: "Platinum Partners",
    description: "Our most prestigious partners — integral to ASSOC's mission.",
    cols: "grid-cols-1 sm:grid-cols-2",
    size: "lg" as const,
  },
  gold: {
    label: "Gold Partners",
    description: "Valued contributors to student development and career growth.",
    cols: "grid-cols-2 sm:grid-cols-3",
    size: "md" as const,
  },
  silver: {
    label: "Silver Partners",
    description: "Supporters of our events and community programs.",
    cols: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
    size: "sm" as const,
  },
  bronze: {
    label: "Bronze Partners",
    description: "Generous contributors to ASSOC's ongoing work.",
    cols: "grid-cols-3 sm:grid-cols-4 lg:grid-cols-5",
    size: "sm" as const,
  },
};

interface SponsorTierSectionProps {
  tier: keyof typeof tierConfig;
  sponsors: Sponsor[];
}

export function SponsorTierSection({ tier, sponsors }: SponsorTierSectionProps) {
  if (sponsors.length === 0) return null;
  const cfg = tierConfig[tier];

  return (
    <div className="mb-16">
      <div className="flex items-center gap-4 mb-6">
        <div>
          <h3 className="font-display text-2xl text-[var(--color-text)]">
            {cfg.label}
          </h3>
          <p className="text-sm text-[var(--color-muted)] mt-1">{cfg.description}</p>
        </div>
        <div className="flex-1 h-px bg-[var(--color-border)]" />
      </div>
      <div className={`grid ${cfg.cols} gap-4`}>
        {sponsors.map((sponsor) => (
          <SponsorCard key={sponsor.id} sponsor={sponsor} size={cfg.size} />
        ))}
      </div>
    </div>
  );
}
