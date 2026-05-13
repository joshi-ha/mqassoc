"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/Button";

const floatingSymbols = [
  { symbol: "∑", top: "12%", left: "8%", size: "text-5xl", delay: 0 },
  { symbol: "λ", top: "20%", right: "10%", size: "text-6xl", delay: 0.3 },
  { symbol: "π", bottom: "30%", left: "5%", size: "text-4xl", delay: 0.6 },
  { symbol: "∫", bottom: "20%", right: "8%", size: "text-5xl", delay: 0.2 },
  { symbol: "μ", top: "55%", left: "14%", size: "text-3xl", delay: 0.8 },
  { symbol: "σ", top: "40%", right: "5%", size: "text-3xl", delay: 0.5 },
  { symbol: "∂", top: "70%", right: "18%", size: "text-4xl", delay: 0.4 },
  { symbol: "Φ", top: "8%", left: "45%", size: "text-3xl", delay: 0.7 },
];

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-cream">
      {/* Subtle radial gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, color-mix(in srgb, #913f4a 6%, transparent) 0%, transparent 70%)",
        }}
      />

      {/* Floating mathematical symbols */}
      {floatingSymbols.map((s, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.08, 0.05] }}
          transition={{
            duration: 3,
            delay: s.delay,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className={`absolute font-display text-primary select-none pointer-events-none ${s.size}`}
          style={{
            top: s.top,
            bottom: (s as { bottom?: string }).bottom,
            left: (s as { left?: string }).left,
            right: (s as { right?: string }).right,
          }}
        >
          {s.symbol}
        </motion.span>
      ))}

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
      >
        <motion.div variants={itemVariants}>
          <span className="inline-block font-sans text-sm font-semibold uppercase tracking-widest text-primary mb-6 px-4 py-1.5 rounded-full border border-primary/25 bg-primary/5">
            Macquarie University
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="font-display text-5xl sm:text-6xl lg:text-7xl text-text leading-[1.1] mb-6"
        >
          Start Your Actuarial
          <br />
          <span className="text-primary">Journey</span> With Confidence
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="font-sans text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed mb-10"
        >
          The Macquarie University Actuarial Students&apos; Society (ASSOC)
          supports students through their actuarial journey — from first-year
          fundamentals to graduate careers.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button asChild size="lg">
            <Link href="/join">Join Us</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/guides">Resources</Link>
          </Button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-8 flex items-center justify-center gap-6 text-sm text-muted"
        >
          <Stat value="500+" label="Members" />
          <div className="w-px h-6 bg-border" />
          <Stat value="4+" label="Years" />
          <div className="w-px h-6 bg-border" />
          <Stat value="20+" label="Events/year" />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted"
      >
        <span className="text-xs font-sans uppercase tracking-widest">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowDown size={14} />
        </motion.div>
      </motion.div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="font-display text-2xl text-text">{value}</p>
      <p className="text-xs">{label}</p>
    </div>
  );
}
