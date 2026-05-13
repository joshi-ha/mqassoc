import type { Sponsor } from "@/types";

interface SponsorCardProps {
  sponsor: Sponsor;
  size?: "lg" | "md" | "sm";
}

const sizeConfig = {
  lg: { card: "p-10", logo: "h-14", text: "text-2xl font-semibold" },
  md: { card: "p-8", logo: "h-10", text: "text-xl font-medium" },
  sm: { card: "p-6", logo: "h-8", text: "text-base font-medium" },
};

export function SponsorCard({ sponsor, size = "md" }: SponsorCardProps) {
  const cfg = sizeConfig[size];
  return (
    <a
      href={sponsor.website_url ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block bg-white rounded-2xl border border-[var(--color-border)] ${cfg.card} text-center hover:border-[var(--color-primary)]/40 hover:shadow-lg transition-all duration-300`}
    >
      {sponsor.logo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={sponsor.logo_url}
          alt={sponsor.name}
          className={`${cfg.logo} w-auto mx-auto object-contain opacity-70 group-hover:opacity-100 transition-opacity`}
        />
      ) : (
        <p
          className={`font-display text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors ${cfg.text}`}
        >
          {sponsor.name}
        </p>
      )}
    </a>
  );
}
