import { Hero } from "@/components/hero";
import { Timeline } from "@/components/timeline";
import {
  WizardingCampus,
  WizardingInvitation,
  WizardingJourney,
  WizardingManifesto,
  WizardingSponsors,
} from "@/components/wizarding-home";
import { createPageMetadata } from "@/lib/seo";
export const metadata = createPageMetadata("/");

export default async function Home() {
  return (
    <div className="home-page home-atelier">
      <Hero />
      <WizardingJourney />
      <Timeline />
      <WizardingManifesto />
      <WizardingCampus />
      <WizardingSponsors />
      <WizardingInvitation />
    </div>
  );
}
