"use client";

import { Hero } from "@/components/hero";
import { HogwartsScroll } from "@/components/HogwartsScroll";

export default function Home() {
  return (
    <div
      className="relative min-h-screen w-full home-page home-atelier bg-[#080808]"
      data-home-ready="true"
      data-lenis-prevent
    >
      <Hero />
      <HogwartsScroll />
    </div>
  );
}
