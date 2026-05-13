"use client";

import { motion } from "framer-motion";
import { Users, BookOpen, Heart } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import Link from "next/link";

const cards = [
  {
    icon: Users,
    title: "Career & Social Events",
    description:
      "From industry networking nights to trivia and social events, ASSOC creates spaces for students to connect with professionals and each other.",
    href: "/events",
    cta: "View Events",
  },
  {
    icon: BookOpen,
    title: "Unit Survival Guides",
    description:
      "Student-written guides for every actuarial unit at Macquarie — covering content, exam tips, and hard-won insights from those who've been there.",
    href: "/guides",
    cta: "Read Guides",
  },
  {
    icon: Heart,
    title: "Community",
    description:
      "A welcoming community that looks out for each other. Find study groups, mentors, and lifelong connections with fellow actuarial students.",
    href: "/about",
    cta: "Learn More",
  },
];

export function WhatWeDoSection() {
  return (
    <section className="py-24 bg-cream-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Purpose"
          title="What We're Here For"
          subtitle="ASSOC exists to make the actuarial journey a little easier — and a lot more memorable."
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="group bg-white rounded-2xl p-8 shadow-sm border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-cream-dark border border-border flex items-center justify-center mb-6 group-hover:bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)] group-hover:border-primary/30 transition-all">
                <card.icon
                  size={22}
                  className="text-muted group-hover:text-primary transition-colors"
                />
              </div>
              <h3 className="font-display text-xl text-text mb-3">
                {card.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed mb-6">
                {card.description}
              </p>
              <Link
                href={card.href}
                className="inline-flex items-center text-sm font-medium text-primary hover:gap-2 gap-1 transition-all"
              >
                {card.cta}
                <span className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
