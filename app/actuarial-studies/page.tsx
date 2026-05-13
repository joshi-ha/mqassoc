import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TrendingUp, Shield, Calculator, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "What is Actuarial Studies?",
  description:
    "An introduction to actuarial science — what actuaries do, how to qualify, and what to expect from the degree at Macquarie.",
};

const careers = [
  { icon: Shield, title: "Insurance", description: "Pricing and reserving for life, health, and general insurance products." },
  { icon: TrendingUp, title: "Superannuation", description: "Advising on retirement funds, investment strategy, and long-term liabilities." },
  { icon: Calculator, title: "Consulting", description: "Providing actuarial advice to clients across financial services and government." },
  { icon: Globe, title: "Risk Management", description: "Identifying and quantifying risk across banking, finance, and enterprise sectors." },
];

const examPaths = [
  { code: "CS1", name: "Actuarial Statistics", type: "Core Principle" },
  { code: "CS2", name: "Risk Modelling and Survival Analysis", type: "Core Principle" },
  { code: "CM1", name: "Actuarial Mathematics for Modelling", type: "Core Principle" },
  { code: "CM2", name: "Financial Engineering and Loss Reserving", type: "Core Principle" },
  { code: "CB1", name: "Business Finance", type: "Core Business" },
  { code: "CB2", name: "Business Economics", type: "Core Business" },
];

export default function ActuarialStudiesPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-primary py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <SectionHeading
                eyebrow="The Profession"
                title="What is Actuarial Studies?"
                subtitle="One of the most challenging and rewarding careers in finance — and it starts here at Macquarie."
                light
              />
            </AnimatedSection>
          </div>
        </section>

        {/* What is an actuary */}
        <section className="py-20 bg-cream">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <SectionHeading
                eyebrow="The Basics"
                title="What Does an Actuary Do?"
                align="left"
              />
            </AnimatedSection>
            <AnimatedSection delay={0.1} className="mt-8 space-y-5 text-muted leading-relaxed">
              <p>
                Actuaries are experts in risk — specifically, the financial
                impact of uncertain future events. Using mathematics, statistics,
                and financial theory, actuaries help organisations understand,
                manage, and price risk.
              </p>
              <p>
                You&apos;ll find actuaries across insurance (life, health, general),
                superannuation, investment management, banking, consulting, and
                increasingly in data science and technology roles.
              </p>
              <p>
                The actuarial profession is consistently rated among the
                highest-paying and most intellectually rewarding careers in
                Australia — and demand continues to grow.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Career paths */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <SectionHeading
                eyebrow="Where Actuaries Work"
                title="Career Pathways"
                subtitle="Actuarial skills open doors across the entire financial services sector."
              />
            </AnimatedSection>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {careers.map((career, i) => (
                <AnimatedSection key={career.title} delay={i * 0.08}>
                  <div className="bg-cream rounded-2xl border border-border p-7 text-center h-full">
                    <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center mx-auto mb-4">
                      <career.icon size={22} className="text-primary" />
                    </div>
                    <h3 className="font-display text-lg text-text mb-2">
                      {career.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {career.description}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* The degree */}
        <section className="py-20 bg-cream-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <AnimatedSection direction="left">
                <SectionHeading
                  eyebrow="The Degree"
                  title="Actuarial Studies at Macquarie"
                  align="left"
                />
                <div className="mt-6 space-y-4 text-muted leading-relaxed">
                  <p>
                    Macquarie University offers one of Australia&apos;s most
                    respected actuarial programs, with an accreditation pathway
                    through the Actuaries Institute of Australia.
                  </p>
                  <p>
                    The Bachelor of Actuarial Studies and the combined Bachelor
                    of Actuarial Studies / Bachelor of Commerce provide a
                    rigorous grounding in the mathematics, statistics, finance,
                    and economics that underpin actuarial practice.
                  </p>
                  <p>
                    Completing the degree — combined with the Institute&apos;s
                    professional exams — leads to Fellowship of the Actuaries
                    Institute (FIAA).
                  </p>
                </div>
                <div className="mt-8">
                  <Button asChild size="md">
                    <Link href="/guides">View Unit Survival Guides</Link>
                  </Button>
                </div>
              </AnimatedSection>

              <AnimatedSection direction="right">
                <div className="bg-white rounded-2xl border border-border p-8">
                  <h3 className="font-display text-2xl text-text mb-6">
                    Professional Exam Pathway
                  </h3>
                  <div className="space-y-3">
                    {examPaths.map((exam) => (
                      <div
                        key={exam.code}
                        className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0"
                      >
                        <div>
                          <span className="font-sans text-xs font-bold text-primary mr-2">
                            {exam.code}
                          </span>
                          <span className="text-sm text-text">{exam.name}</span>
                        </div>
                        <span className="text-xs text-muted bg-cream-dark rounded-full px-2.5 py-1 shrink-0">
                          {exam.type}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted mt-4">
                    Partial exam exemptions available through accredited university units.
                  </p>
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
