"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";
import { Mail, MapPin, Share2, Link2, Globe } from "lucide-react";
import { useState } from "react";

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // In production this would call an API route
    setTimeout(() => setStatus("sent"), 1200);
  };

  if (status === "sent") {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-10 text-center">
        <p className="font-display text-2xl text-emerald-800 mb-2">Message Sent!</p>
        <p className="text-emerald-700 text-sm">
          Thank you — we&apos;ll get back to you within 2 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
            Name
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
            Email
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            placeholder="your@email.com"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
          Subject
        </label>
        <input
          type="text"
          required
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          placeholder="How can we help?"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
          Message
        </label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none"
          placeholder="Tell us more..."
        />
      </div>
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-primary py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <SectionHeading
                eyebrow="Get In Touch"
                title="Contact Us"
                subtitle="Have a question, sponsorship enquiry, or just want to say hi? We'd love to hear from you."
                light
              />
            </AnimatedSection>
          </div>
        </section>

        {/* Split layout */}
        <section className="py-20 bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Info */}
              <AnimatedSection direction="left" className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-2xl border border-border p-8">
                  <h3 className="font-display text-xl text-text mb-5">
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <InfoRow icon={Mail} label="Email" value="assoc@mq.edu.au" href="mailto:assoc@mq.edu.au" />
                    <InfoRow icon={MapPin} label="Location" value="Macquarie University, Sydney NSW 2109" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-border p-8">
                  <h3 className="font-display text-xl text-text mb-5">
                    Follow Us
                  </h3>
                  <div className="flex gap-3">
                    {[
                      { icon: Share2, label: "Instagram", href: "#" },
                      { icon: Link2, label: "LinkedIn", href: "#" },
                      { icon: Globe, label: "Facebook", href: "#" },
                    ].map(({ icon: Icon, label, href }) => (
                      <a
                        key={label}
                        href={href}
                        aria-label={label}
                        className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-muted hover:text-primary hover:border-primary/40 transition-all"
                      >
                        <Icon size={16} />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Map placeholder */}
                <div className="bg-cream-dark rounded-2xl border border-border h-48 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin size={24} className="text-muted mx-auto mb-2" />
                    <p className="text-xs text-muted">Macquarie University</p>
                    <p className="text-xs text-muted">Sydney NSW 2109</p>
                  </div>
                </div>
              </AnimatedSection>

              {/* Form */}
              <AnimatedSection direction="right" className="lg:col-span-3">
                <div className="bg-white rounded-2xl border border-border p-8">
                  <h3 className="font-display text-2xl text-text mb-6">
                    Send Us a Message
                  </h3>
                  <ContactForm />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-cream-dark flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={14} className="text-primary" />
      </div>
      <div>
        <p className="text-xs font-semibold text-muted uppercase tracking-wider">{label}</p>
        {href ? (
          <a href={href} className="text-sm text-text hover:text-primary transition-colors">
            {value}
          </a>
        ) : (
          <p className="text-sm text-text">{value}</p>
        )}
      </div>
    </div>
  );
}
