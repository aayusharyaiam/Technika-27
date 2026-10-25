import { Bird, Flame, Leaf, Sun } from "lucide-react";
import { themeAttributeForHouse, type House } from "@/lib/houses";

// Original geometric shields with MIT-licensed Lucide symbols, not movie crests.
export function HouseCrest({ house }: { house: Exclude<House, "default"> }) {
  const Symbol = { gryffindor: Flame, ravenclaw: Bird, hufflepuff: Sun, slytherin: Leaf }[house];
  return <span className="ceremony-crest text-fg-brand" data-theme={themeAttributeForHouse(house)} aria-hidden="true">
    <span className="ceremony-crest-shield"><Symbol size={32} strokeWidth={1.25}/></span><span className="ceremony-crest-star"/>
  </span>;
}
