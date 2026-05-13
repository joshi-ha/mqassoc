"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";

const aboutLinks = [
  { label: "About ASSOC", href: "/about" },
  { label: "Meet the Cabinet", href: "/cabinet" },
  { label: "What is Actuarial Studies?", href: "/actuarial-studies" },
  { label: "Welcome to Country", href: "/welcome-to-country" },
];

const navLinks = [
  { label: "Unit Survival Guides", href: "/guides" },
  { label: "Events", href: "/events" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Contact Us", href: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openAbout = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setAboutOpen(true);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setAboutOpen(false), 180);
  };

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "sticky top-0 z-30 w-full transition-all duration-300",
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-cream border-b border-border",
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 shrink-0">
            <span className="font-display text-2xl text-primary">λ</span>
            <span className="font-display text-xl text-text ml-0.5">ASSOC</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {/* About dropdown */}
            <div
              className="relative"
              onMouseEnter={openAbout}
              onMouseLeave={scheduleClose}
            >
              <button
                className={cn(
                  "flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname.startsWith("/about") ||
                    pathname === "/cabinet" ||
                    pathname === "/actuarial-studies" ||
                    pathname === "/welcome-to-country"
                    ? "text-primary"
                    : "text-text hover:text-primary",
                )}
              >
                About
                <ChevronDown
                  size={14}
                  className={cn(
                    "transition-transform",
                    aboutOpen && "rotate-180",
                  )}
                />
              </button>

              {aboutOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  onMouseEnter={openAbout}
                  onMouseLeave={scheduleClose}
                  className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-border py-1.5 overflow-hidden"
                >
                  {aboutLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "block px-4 py-2.5 text-sm transition-colors",
                        pathname === link.href
                          ? "text-primary bg-[color-mix(in_srgb,var(--color-primary)_6%,transparent)]"
                          : "text-text hover:bg-cream hover:text-primary",
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>

            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                active={pathname === link.href}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/join"
              className="hidden lg:inline-flex items-center bg-primary text-white rounded-full px-5 py-2 text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm"
            >
              Join Us
            </Link>
            <div className="lg:hidden">
              <MobileMenu />
            </div>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors group",
        active ? "text-primary" : "text-text hover:text-primary",
      )}
    >
      {children}
      <span
        className={cn(
          "absolute bottom-1.5 left-3.5 right-3.5 h-px bg-primary transition-transform origin-left",
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
        )}
      />
    </Link>
  );
}
