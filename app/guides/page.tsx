import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GuidesGrid } from "@/components/guides/GuidesGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { createClient } from "@/lib/supabase/server";
import type { Guide } from "@/types";

export const metadata: Metadata = {
  title: "Unit Survival Guides",
  description: "Student-written survival guides for every actuarial unit at Macquarie University.",
};

const PLACEHOLDER_GUIDES: Guide[] = [
  {
    id: "1",
    title: "Introduction to Actuarial Studies",
    unit_code: "ACST101",
    unit_name: "Probability and Statistics",
    author: "Sarah Chen",
    difficulty: "easy",
    year_level: 1,
    tags: ["probability", "statistics", "foundations"],
    published: true,
    created_at: new Date().toISOString(),
    content: "A comprehensive guide to ACST101...",
  },
  {
    id: "2",
    title: "Survival Guide to Financial Mathematics",
    unit_code: "ACST201",
    unit_name: "Financial Mathematics",
    author: "James Park",
    difficulty: "medium",
    year_level: 2,
    tags: ["finance", "interest theory", "annuities"],
    published: true,
    created_at: new Date().toISOString(),
    content: "Everything you need to know about ACST201...",
  },
  {
    id: "3",
    title: "Mastering Life Contingencies",
    unit_code: "ACST305",
    unit_name: "Life Contingencies",
    author: "Emily Wang",
    difficulty: "hard",
    year_level: 3,
    tags: ["life insurance", "mortality", "actuarial tables"],
    published: true,
    created_at: new Date().toISOString(),
    content: "A deep dive into ACST305...",
  },
  {
    id: "4",
    title: "General Insurance Pricing",
    unit_code: "ACST356",
    unit_name: "General Insurance",
    author: "Michael Torres",
    difficulty: "hard",
    year_level: 3,
    tags: ["general insurance", "pricing", "reserving"],
    published: true,
    created_at: new Date().toISOString(),
    content: "Tackling ACST356...",
  },
];

async function getGuides(): Promise<Guide[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("guides")
      .select("*")
      .eq("published", true)
      .order("unit_code");
    if (error) {
      console.error("Supabase guides error:", error);
      return PLACEHOLDER_GUIDES;
    }
    return data?.length ? data : PLACEHOLDER_GUIDES;
  } catch {
    return PLACEHOLDER_GUIDES;
  }
}

export default async function GuidesPage() {
  const guides = await getGuides();

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-[var(--color-primary)] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Student Resources"
              title="Unit Survival Guides"
              subtitle="Written by students, for students. Everything you need to navigate your actuarial units at Macquarie."
              light
            />
          </div>
        </section>

        {/* Guides */}
        <section className="py-16 bg-[var(--color-cream)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <GuidesGrid guides={guides} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
