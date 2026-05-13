"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navLinks = [
  {
    label: "About",
    href: "#",
    children: [
      { label: "About ASSOC", href: "/about" },
      { label: "Meet the Cabinet", href: "/cabinet" },
      { label: "Actuarial Studies", href: "/actuarial-studies" },
      { label: "Welcome to Country", href: "/welcome-to-country" },
    ],
  },
  { label: "Unit Survival Guides", href: "/guides" },
  { label: "Events", href: "/events" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Contact Us", href: "/contact" },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="font-display text-xl text-[var(--color-text)]"
                >
                  <span className="text-[var(--color-primary)]">λ</span> ASSOC
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-[var(--color-cream)] rounded-lg text-[var(--color-muted)]"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-5 space-y-1">
                <button
                  onClick={() => setAboutOpen(!aboutOpen)}
                  className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-cream)] transition-colors"
                >
                  About
                  <ChevronDown
                    size={16}
                    className={cn(
                      "text-[var(--color-muted)] transition-transform",
                      aboutOpen && "rotate-180"
                    )}
                  />
                </button>

                <AnimatePresence>
                  {aboutOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pl-4 space-y-1"
                    >
                      {navLinks[0].children?.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "block px-3 py-2 rounded-lg text-sm transition-colors",
                            pathname === child.href
                              ? "text-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)]"
                              : "text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-cream)]"
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {navLinks.slice(1).map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      pathname === link.href
                        ? "text-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)]"
                        : "text-[var(--color-text)] hover:bg-[var(--color-cream)]"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="pt-4">
                  <Link
                    href="/join"
                    onClick={() => setIsOpen(false)}
                    className="block text-center bg-[var(--color-primary)] text-white rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors"
                  >
                    Join Us
                  </Link>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
