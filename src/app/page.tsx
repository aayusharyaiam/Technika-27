import { ComingSoonHero } from "@/components/coming-soon-hero";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/");

export default function Home() {
  return <ComingSoonHero />;
}
