import { Hero } from "@/components/hero";
import { Timeline } from "@/components/timeline";
import {
  About,
  Campus,
  Invitation,
  Sponsors,
} from "@/components/home-sections";
import { createPageMetadata } from "@/lib/seo";
import { RelicsSection } from "@/components/relics-section";
import { HomeCanvasBackground } from "@/components/home-canvas-background";

export const metadata = createPageMetadata("/");

export default function Home() {
  return (
    <div className="home-page">
      <HomeCanvasBackground />
      <Hero />
      <Timeline />
      <RelicsSection />
      <About />
      <Campus />
      <Sponsors />
      <Invitation />
    </div>
  );
}
