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
export const metadata = createPageMetadata("/");

export default async function Home() {
  const supabase = await createClient();

  return (
    <div className="home-page">
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
