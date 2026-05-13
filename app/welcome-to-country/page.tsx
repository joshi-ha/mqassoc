import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Welcome to Country",
  description:
    "ASSOC acknowledges the Traditional Custodians of the land on which Macquarie University stands.",
};

export default function WelcomeToCountryPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#fef8f0]">
        {/* Decorative top bar */}
        <div className="h-1.5 bg-linear-to-r from-[#b85c38] via-[#c4843a] to-[#8b5e3c]" />

        <section className="py-28">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Decorative symbol */}
            <div className="mb-10">
              <div className="w-20 h-20 rounded-full border-2 border-[#b85c38]/30 mx-auto flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-[#b85c38]/50 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-[#b85c38]/40" />
                </div>
              </div>
            </div>

            <p className="font-sans text-sm font-semibold uppercase tracking-widest text-[#b85c38] mb-6">
              Acknowledgement of Country
            </p>

            <h1 className="font-display text-4xl sm:text-5xl text-[#2a1f18] leading-tight mb-10">
              Welcome to Country
            </h1>

            <div className="space-y-6 text-[#5a4a3f] leading-[1.9] text-lg">
              <p>
                The Macquarie University Actuarial Students&apos; Society
                acknowledges the Traditional Custodians of the land on which
                Macquarie University stands — the Wallumattagal people of the
                Dharug Nation.
              </p>
              <p>
                We pay our respects to Elders past, present, and emerging, and
                recognise the continued connection of Aboriginal and Torres
                Strait Islander peoples to Country, culture, and community.
              </p>
              <p>
                We acknowledge that sovereignty was never ceded, and that this
                land always was, and always will be, Aboriginal land.
              </p>
            </div>

            <div className="mt-14 pt-8 border-t border-[#e8d9c8]">
              <p className="text-sm text-[#8a7060]">
                ASSOC is committed to respectful engagement with Aboriginal and
                Torres Strait Islander peoples, histories, and cultures.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
