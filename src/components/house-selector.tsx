"use client";

import { Bird, Flame, Leaf, Sun, Check } from "lucide-react";
import { houseThemes, selectableHouses } from "@/lib/houses";
import { useHouse } from "./house-provider";

const symbols = { gryffindor: Flame, slytherin: Leaf, ravenclaw: Bird, hufflepuff: Sun };

export function HouseSelector({ compact = false, includeDefault = true }: { compact?: boolean; includeDefault?: boolean }) {
  const { house, setHouse } = useHouse();
  return <div className={`house-selector ${compact ? "house-selector-compact" : ""}`}>
    <div className="house-selector-label"><span>Choose your house</span><small>Your colours. Your castle.</small></div>
    <div className="house-options" role="group" aria-label="Choose your Hogwarts house">{selectableHouses.map((key) => {
      const theme = houseThemes[key];
      const Symbol = symbols[key];
      return <button type="button" key={key} aria-pressed={house === key} onClick={() => setHouse(key)} style={{ "--choice-color": theme.accent, "--choice-flag": theme.flag } as React.CSSProperties} className={`house-option ${house === key ? "selected" : ""}`}>
        <span className="house-option-crest"><Symbol size={21} strokeWidth={1.25} /></span><span>{theme.name}<small>{theme.quality.split(" · ")[0]}</small></span>{house === key && <Check size={12} className="house-check" />}
      </button>;
    })}</div>
    {includeDefault && <button type="button" className="house-reset" onClick={() => setHouse("default")} aria-pressed={house === "default"}>Keep the original enchanted gold</button>}
    <span role="status" className="sr-only">{house === "default" ? "Original gold theme selected" : `${houseThemes[house].name} theme selected`}</span>
  </div>;
}
