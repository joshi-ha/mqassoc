import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { WhatWeDoSection } from "@/components/home/WhatWeDoSection";
import { EventsPreview } from "@/components/home/EventsPreview";
import { AboutSection } from "@/components/home/AboutSection";
import { SponsorsSection } from "@/components/home/SponsorsSection";
import { FinalCTA } from "@/components/home/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WhatWeDoSection />
        <EventsPreview />
        <AboutSection />
        <SponsorsSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
