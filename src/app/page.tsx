"use client";

import { Hero } from "@/components/hero";
import { HogwartsScroll } from "@/components/HogwartsScroll";
import { Timeline } from "@/components/timeline";
import {
  WizardingCampus,
  WizardingInvitation,
  WizardingJourney,
  WizardingManifesto,
  WizardingSponsors,
} from "@/components/wizarding-home";

export default function Home() {
  return (
    <div
      className="relative w-full min-h-screen home-page home-atelier bg-[#080808]"
      data-home-ready="true"
    >
      <Hero />
      <HogwartsScroll />
      <WizardingJourney />
      <Timeline />
      <WizardingManifesto />
      <WizardingCampus />
      <WizardingSponsors />
      <WizardingInvitation />
    </div>
  );
}
