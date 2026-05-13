"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  return (
    <section className="bg-primary py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-sans text-sm font-semibold uppercase tracking-widest text-white/55 mb-4">
            Ready to Begin?
          </p>
          <h2 className="font-display text-4xl sm:text-5xl text-white leading-tight mb-6">
            Building Tomorrow&apos;s
            <br />
            Actuaries Today
          </h2>
          <p className="text-white/70 text-lg max-w-xl mx-auto leading-relaxed mb-10">
            Join hundreds of students already benefiting from ASSOC&apos;s
            events, resources, and community. Your actuarial career starts here.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="white" size="lg">
              <Link href="/join">Join ASSOC</Link>
            </Button>
            <Button asChild variant="outline-white" size="lg">
              <Link href="/events">Upcoming Events</Link>
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-white/50">
            <span>Free membership</span>
            <span>·</span>
            <span>Open to all MQ students</span>
            <span>·</span>
            <span>Join anytime</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
