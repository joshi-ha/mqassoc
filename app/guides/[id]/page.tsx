import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Calendar, Tag } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/server";
import type { Guide } from "@/types";

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
    content: `## Overview\n\nACSTI01 introduces you to the foundational concepts in probability and statistics that underpin actuarial science. This unit is manageable if you keep up with weekly problem sets.\n\n## Key Topics\n\n- Probability spaces and axioms\n- Random variables (discrete and continuous)\n- Common distributions: Binomial, Poisson, Normal, Exponential\n- Moment generating functions\n- Central Limit Theorem\n\n## Exam Tips\n\nThe exam is formula-heavy but conceptually straightforward. Make sure you know your distribution properties cold. The last 2-3 questions typically involve multi-part probability problems — practice these under timed conditions.\n\n## Recommended Approach\n\n1. Attend all lectures — the worked examples are directly exam-relevant\n2. Complete every tutorial question (don't just read the solutions)\n3. Form a study group — explaining concepts to others is the best test\n4. Past papers from the last 3 years are very representative`,
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
    content: `## Overview\n\nACSTI201 is where actuarial maths starts to feel "real". You'll learn the time value of money in depth — essential knowledge for almost every actuarial exam.\n\n## Key Topics\n\n- Force of interest and effective rates\n- Present value and accumulation factors\n- Annuities (certain, life, variable)\n- Loan amortisation and sinking funds\n- Bond pricing and duration\n\n## Exam Tips\n\nThis unit has a lot of formula memorisation. Build a personal formula sheet early and drill it. The exam typically includes 2-3 multi-part bond pricing questions.\n\n## Resources\n\n- The textbook exercises are well-aligned with the exam style\n- Institute of Actuaries past papers (CT1/CM1) are excellent practice`,
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
    content: `## Overview\n\nACST305 is one of the most challenging units in the degree — but also one of the most directly relevant to actuarial practice. It covers the mathematical modelling of human mortality and its application to life insurance products.\n\n## Key Topics\n\n- Life tables and mortality models\n- Net premium calculations\n- Policy values and reserves\n- Multiple decrement models\n- Thiele's differential equation\n\n## Exam Strategy\n\nDon't leave Thiele's equation until the last week. The exam always has at least one major question on policy values. Practise deriving results rather than memorising them.\n\n## Survival Tips\n\nForm a study group early. The notation-heavy content is much easier to parse when discussed with peers.`,
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
    content: `## Overview\n\nACSTI356 dives into the pricing and reserving methods used in property and casualty (general) insurance. Highly relevant if you're considering a career in general insurance.\n\n## Key Topics\n\n- Premium components and rating factors\n- Loss reserving: chain ladder, Bornhuetter-Ferguson\n- Credibility theory\n- Reinsurance structures\n- Catastrophe modelling basics\n\n## Exam Tips\n\nChain ladder questions are always on the exam — know this method inside out. The Bornhuetter-Ferguson method often comes up too. Practice working through triangles quickly and accurately.`,
  },
];

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const guide = await getGuide(id);
  if (!guide) return { title: "Guide Not Found" };
  return {
    title: `${guide.unit_code}: ${guide.title}`,
    description: `Unit survival guide for ${guide.unit_name} at Macquarie University.`,
  };
}

async function getGuide(id: string): Promise<Guide | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("guides")
      .select("*")
      .eq("id", id)
      .eq("published", true)
      .single();
    if (error || !data) {
      return PLACEHOLDER_GUIDES.find((g) => g.id === id) ?? null;
    }
    return data;
  } catch {
    return PLACEHOLDER_GUIDES.find((g) => g.id === id) ?? null;
  }
}

function renderContent(content: string) {
  const lines = content.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("## "))
      return (
        <h2 key={i} className="font-display text-2xl text-[var(--color-text)] mt-8 mb-3">
          {line.replace("## ", "")}
        </h2>
      );
    if (line.startsWith("- "))
      return (
        <li key={i} className="text-[var(--color-muted)] leading-relaxed">
          {line.replace("- ", "")}
        </li>
      );
    if (/^\d+\./.test(line))
      return (
        <li key={i} className="text-[var(--color-muted)] leading-relaxed list-decimal">
          {line.replace(/^\d+\.\s/, "")}
        </li>
      );
    if (line === "") return <br key={i} />;
    return (
      <p key={i} className="text-[var(--color-muted)] leading-relaxed">
        {line}
      </p>
    );
  });
}

export default async function GuidePage({ params }: Props) {
  const { id } = await params;
  const guide = await getGuide(id);

  if (!guide) notFound();

  const diffVariant =
    guide.difficulty === "easy"
      ? "easy"
      : guide.difficulty === "medium"
      ? "medium"
      : "hard";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--color-cream)]">
        {/* Header */}
        <div className="bg-[var(--color-primary)] py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-8 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Guides
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="font-sans text-sm font-semibold text-white/60 uppercase tracking-widest">
                {guide.unit_code}
              </span>
              {guide.difficulty && (
                <Badge variant={diffVariant as "easy" | "medium" | "hard"}>
                  {guide.difficulty === "easy"
                    ? "1st Year"
                    : guide.difficulty === "medium"
                    ? "2nd–3rd Year"
                    : "Advanced"}
                </Badge>
              )}
            </div>

            <h1 className="font-display text-4xl sm:text-5xl text-white leading-tight mb-3">
              {guide.title}
            </h1>
            <p className="text-white/70 text-lg">{guide.unit_name}</p>

            <div className="flex flex-wrap gap-6 mt-6 text-sm text-white/60">
              {guide.author && (
                <span className="flex items-center gap-1.5">
                  <User size={14} /> {guide.author}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {new Date(guide.created_at).toLocaleDateString("en-AU", {
                  year: "numeric",
                  month: "long",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Sidebar */}
            <aside className="lg:col-span-1 order-2 lg:order-1">
              {guide.tags && guide.tags.length > 0 && (
                <div className="bg-white rounded-2xl border border-[var(--color-border)] p-5 sticky top-24">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)] mb-3 flex items-center gap-1.5">
                    <Tag size={12} /> Topics
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {guide.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-[var(--color-cream-dark)] text-[var(--color-muted)] rounded-full px-2.5 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </aside>

            {/* Main */}
            <article className="lg:col-span-3 order-1 lg:order-2">
              <div className="bg-white rounded-2xl border border-[var(--color-border)] p-8 space-y-2">
                {guide.content ? (
                  <ul className="space-y-1">{renderContent(guide.content)}</ul>
                ) : (
                  <p className="text-[var(--color-muted)]">
                    Content coming soon.
                  </p>
                )}
              </div>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
