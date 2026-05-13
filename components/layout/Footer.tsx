import Link from "next/link";
import { Share2, Globe, Link2, Mail } from "lucide-react";
const links = {
  About: [
    { label: "About ASSOC", href: "/about" },
    { label: "Meet the Cabinet", href: "/cabinet" },
    { label: "Actuarial Studies", href: "/actuarial-studies" },
    { label: "Welcome to Country", href: "/welcome-to-country" },
  ],
  Resources: [
    { label: "Unit Survival Guides", href: "/guides" },
    { label: "Events", href: "/events" },
    { label: "Sponsors", href: "/sponsors" },
  ],
  Connect: [
    { label: "Contact Us", href: "/contact" },
    { label: "Join ASSOC", href: "/join" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-primary-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-1 mb-4">
              <span className="font-display text-3xl text-cream">λ</span>
              <span className="font-display text-2xl text-white ml-0.5">
                ASSOC
              </span>
            </Link>
            <p className="text-sm text-white/65 leading-relaxed max-w-xs">
              The Macquarie University Actuarial Students&apos; Society.
              Building Tomorrow&apos;s Actuaries Today.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <SocialLink href="#" label="Instagram">
                <Share2 size={16} />
              </SocialLink>
              <SocialLink href="#" label="LinkedIn">
                <Link2 size={16} />
              </SocialLink>
              <SocialLink href="#" label="Facebook">
                <Globe size={16} />
              </SocialLink>
              <SocialLink href="mailto:assoc@mq.edu.au" label="Email">
                <Mail size={16} />
              </SocialLink>
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white/45 mb-4">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>
            &copy; {new Date().getFullYear()} Macquarie University Actuarial
            Students&apos; Society. All rights reserved.
          </p>
          <p>Macquarie University, Sydney NSW 2109</p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition-all"
    >
      {children}
    </a>
  );
}
