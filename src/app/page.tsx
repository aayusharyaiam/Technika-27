import { Hero } from "@/components/hero";
import { Timeline } from "@/components/timeline";
import { About, Campus, Sponsors, Invitation } from "@/components/home-sections";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/");

export default function Home() {
  return <><Hero /><Timeline /><About /><Campus /><Sponsors /><Invitation /></>;
}
