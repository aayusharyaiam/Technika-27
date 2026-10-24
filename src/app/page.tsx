import { createClient } from "@/utils/supabase/server";

import { Hero } from "@/components/hero";
import { Timeline } from "@/components/timeline";
import {
  About,
  Campus,
  Invitation,
  PreviousTechnika,
  PrizePool,
  Sponsors,
} from "@/components/home-sections";
import { createPageMetadata } from "@/lib/seo";
<<<<<<< HEAD
import { RelicsSection } from "@/components/relics-section";
import { HomeCanvasBackground } from "@/components/home-canvas-background";
=======

>>>>>>> 93c4ea46efe08293b2f6b929b4575f46a39cfc52
export const metadata = createPageMetadata("/");

export default async function Home() {
  const supabase = await createClient();

  return (
    <div className="home-page">
      <HomeCanvasBackground />
      <Hero />
      <PrizePool />
      <Timeline />
      <PreviousTechnika />
      <About />
      <Campus />
      <Sponsors />
      <Invitation />
    </div>
  );
}
