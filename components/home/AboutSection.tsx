"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

const stats = [
  { value: 500, suffix: "+", label: "Active Members" },
  { value: 20, suffix: "+", label: "Events Per Year" },
  { value: 4, suffix: "+", label: "Years Running" },
  { value: 3, suffix: "", label: "Industry Partners" },
];

function CountUp({ end, suffix }: { end: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1500;
          const startTime = Date.now();
          const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * end));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export function AboutSection() {
  return (
    <section className="py-24 bg-[var(--color-cream)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeading
              eyebrow="Who We Are"
              title="More Than Just a Society"
              subtitle="ASSOC is the home for every actuarial student at Macquarie — whether you're just starting out or finishing your final year."
              align="left"
            />

            <p className="mt-6 text-[var(--color-muted)] leading-relaxed">
              We bridge the gap between academic study and professional
              practice. Through events, resources, and a strong community, we
              help you build the skills, networks, and confidence you need to
              succeed as an actuary.
            </p>

            <p className="mt-4 text-[var(--color-muted)] leading-relaxed">
              From industry networking nights with Deloitte and PwC to unit
              survival guides written by students who aced the exam — ASSOC has
              you covered at every stage.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="md">
                <Link href="/about">About ASSOC</Link>
              </Button>
              <Button asChild variant="outline" size="md">
                <Link href="/cabinet">Meet the Cabinet</Link>
              </Button>
            </div>
          </motion.div>

          {/* Stats grid */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl border border-[var(--color-border)] p-7 text-center shadow-sm"
              >
                <p className="font-display text-4xl text-[var(--color-primary)]">
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="font-sans text-sm text-[var(--color-muted)] mt-2">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
