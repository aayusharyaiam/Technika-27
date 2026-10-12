import { Bird, Flame, Leaf, Sun } from "lucide-react";
import { houseThemes, type House } from "@/lib/houses";

// Original geometric shields with MIT-licensed Lucide symbols, not movie crests.
export function HouseCrest({ house }: { house: Exclude<House, "default"> }) {
  const theme = houseThemes[house];
  const Symbol = { gryffindor: Flame, ravenclaw: Bird, hufflepuff: Sun, slytherin: Leaf }[house];
  return <span className="ceremony-crest" style={{ "--crest-accent": theme.accent, "--crest-flag": theme.flag } as React.CSSProperties} aria-hidden="true">
    <span className="ceremony-crest-shield"><Symbol size={32} strokeWidth={1.25}/></span><span className="ceremony-crest-star"/>
  </span>;
}
