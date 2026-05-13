"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

const benefits = [
  "Access to exclusive networking events with industry leaders",
  "Free unit survival guides for every actuarial unit",
  "Career workshops and resume reviews",
  "ASSOC member discounts on study resources",
  "Connect with like-minded actuarial students",
  "Priority access to internship and graduate opportunities",
  "Fun social events throughout the year",
  "Be part of a supportive and ambitious community",
];

const faqs = [
  {
    question: "Who can join ASSOC?",
    answer:
      "Any Macquarie University student with an interest in actuarial science is welcome to join — regardless of your year level, major, or prior experience.",
  },
  {
    question: "How much does membership cost?",
    answer:
      "ASSOC membership is free for all Macquarie students. Some events may have a small ticket fee, but general membership and access to resources is always free.",
  },
  {
    question: "When can I join?",
    answer:
      "You can join ASSOC at any time during the year. We run a main membership drive at the start of each semester, but membership is open year-round.",
  },
  {
    question: "Do I need to be studying actuarial science to join?",
    answer:
      "No — any student interested in actuarial science, mathematics, finance, or data science is welcome. Many of our members come from adjacent degrees.",
  },
  {
    question: "How do I get involved beyond membership?",
    answer:
      "Beyond attending events, you can apply for a cabinet position each year, contribute to our unit survival guides, or volunteer at events.",
  },
];

function FAQ({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 bg-white hover:bg-cream transition-colors text-left"
      >
        <span className="font-sans font-medium text-text">{question}</span>
        {open ? (
          <ChevronUp size={16} className="text-muted shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-muted shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-5 pt-0 bg-white">
          <p className="text-sm text-muted leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function JoinPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-primary py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <SectionHeading
                eyebrow="Membership"
                title="Join ASSOC"
                subtitle="Become part of Macquarie's actuarial community — free, open to all, and worth every minute."
                light
              />
              <div className="mt-8 flex justify-center">
                <Button asChild variant="white" size="lg">
                  <Link href="https://mqunions.net/clubs/assoc" target="_blank" rel="noopener noreferrer">
                    Join Now — It&apos;s Free
                  </Link>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <SectionHeading
                eyebrow="Why Join"
                title="Membership Benefits"
                subtitle="Here's what you get as an ASSOC member — everything to support your actuarial journey."
              />
            </AnimatedSection>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {benefits.map((benefit, i) => (
                <AnimatedSection key={benefit} delay={i * 0.05}>
                  <div className="flex items-start gap-3 bg-white rounded-xl border border-border p-5">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} className="text-primary" />
                    </div>
                    <p className="text-sm text-text leading-relaxed">{benefit}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <SectionHeading
                eyebrow="Questions?"
                title="Frequently Asked Questions"
                subtitle="Everything you need to know about ASSOC membership."
              />
            </AnimatedSection>
            <div className="mt-10 space-y-3">
              {faqs.map((faq, i) => (
                <AnimatedSection key={faq.question} delay={i * 0.05}>
                  <FAQ question={faq.question} answer={faq.answer} />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-primary-dark">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <AnimatedSection>
              <h2 className="font-display text-4xl text-white mb-4">
                Ready to Join?
              </h2>
              <p className="text-white/70 mb-8 leading-relaxed">
                It takes less than 2 minutes. Join hundreds of Macquarie
                actuarial students already in the ASSOC community.
              </p>
              <Button asChild variant="white" size="xl">
                <Link href="https://mqunions.net/clubs/assoc" target="_blank" rel="noopener noreferrer">
                  Join ASSOC Now
                </Link>
              </Button>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
