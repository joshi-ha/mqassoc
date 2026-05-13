import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Heart, Users, BookOpen, Award } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About ASSOC",
  description:
    "Learn about the Macquarie University Actuarial Students' Society — our mission, history, and values.",
};

const values = [
  {
    icon: Heart,
    title: "Community First",
    description:
      "We believe the actuarial journey is better when you don't go it alone. ASSOC fosters genuine connection between students at every year level.",
  },
  {
    icon: BookOpen,
    title: "Academic Excellence",
    description:
      "We support students to achieve their best — through guides, workshops, and peer study networks that build real understanding.",
  },
  {
    icon: Users,
    title: "Professional Development",
    description:
      "We connect students with industry professionals, helping you build the network and skills needed to launch your actuarial career.",
  },
  {
    icon: Award,
    title: "Inclusivity",
    description:
      "ASSOC is open to every student interested in actuarial science — regardless of year level, background, or experience.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-primary py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <SectionHeading
                eyebrow="Who We Are"
                title="About ASSOC"
                subtitle="The Macquarie University Actuarial Students' Society — building tomorrow's actuaries today."
                light
              />
            </AnimatedSection>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <AnimatedSection direction="left">
                <SectionHeading
                  eyebrow="Our Mission"
                  title="Supporting Every Actuarial Student at Macquarie"
                  align="left"
                />
                <p className="mt-6 text-muted leading-relaxed">
                  The Macquarie University Actuarial Students&apos; Society (ASSOC)
                  is a student-led community focused on supporting students
                  through their actuarial journey — from first-year fundamentals
                  to graduate careers.
                </p>
                <p className="mt-4 text-muted leading-relaxed">
                  We bridge the gap between academic study and professional
                  practice. Whether you&apos;re studying your first probability unit
                  or preparing for your final actuarial exam, ASSOC has
                  resources, events, and people who understand exactly where
                  you are.
                </p>
                <div className="mt-8">
                  <Button asChild size="md">
                    <Link href="/join">Join ASSOC</Link>
                  </Button>
                </div>
              </AnimatedSection>

              <AnimatedSection direction="right">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Active Members", value: "500+" },
                    { label: "Events Per Year", value: "20+" },
                    { label: "Years Running", value: "4+" },
                    { label: "Industry Partners", value: "3" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-white rounded-2xl border border-border p-6 text-center shadow-sm"
                    >
                      <p className="font-display text-4xl text-primary">
                        {stat.value}
                      </p>
                      <p className="text-sm text-muted mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* History */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <SectionHeading
                eyebrow="Our Story"
                title="A Brief History"
                subtitle="ASSOC was founded by a group of passionate actuarial students who wanted to create a stronger community at Macquarie."
              />
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <div className="mt-10 space-y-6 text-muted leading-relaxed">
                <p>
                  What started as informal study groups grew into a
                  fully-fledged student society with a dedicated executive
                  team, industry sponsors, and a calendar of events that spans
                  the entire academic year.
                </p>
                <p>
                  Today, ASSOC is one of the most active student societies in
                  the Macquarie Business School, running networking nights,
                  resume workshops, trivia nights, and industry panels that
                  connect hundreds of students with the actuarial profession.
                </p>
                <p>
                  Our unit survival guides — written by students who&apos;ve
                  actually sat the exams — have become a go-to resource for
                  Macquarie actuarial students at every level.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-cream-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <SectionHeading
                eyebrow="What We Stand For"
                title="Our Values"
                subtitle="Everything we do is guided by these core principles."
              />
            </AnimatedSection>
            <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((v, i) => (
                <AnimatedSection key={v.title} delay={i * 0.1}>
                  <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-cream-dark flex items-center justify-center mb-5">
                      <v.icon size={20} className="text-primary" />
                    </div>
                    <h3 className="font-display text-xl text-text mb-2">
                      {v.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {v.description}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
