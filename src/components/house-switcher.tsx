"use client";

import { Check, ChevronUp, Palette, Sparkles } from "lucide-react";
import { useState } from "react";
import {
  selectableHouses,
  houseThemes,
  themeAttributeForHouse,
  type House,
} from "@/lib/houses";
import { useAuth } from "./auth-provider";
import { useHouse } from "./house-provider";

const symbols = {
  gryffindor: "G",
  slytherin: "S",
  ravenclaw: "R",
  hufflepuff: "H",
} as const;

export function HouseSwitcher() {
  const { user, loading } = useAuth();
  const { house, theme: houseTheme, setHouse } = useHouse();
  const [open, setOpen] = useState(false);

  // Registered / signed-in users cannot change their assigned house.
  if (loading || user) {
    return null;
  }

  const chooseThemePreview = (nextHouse: Exclude<House, "default">) => {
    setHouse(nextHouse);
    setOpen(false);
  };

  return (
    <div className="house-switcher fixed bottom-4 left-4 z-[75] sm:bottom-6 sm:left-6">
      {open && (
        <div
          className="absolute bottom-full left-0 mb-3 w-[min(19rem,calc(100vw-2rem))] rounded-2xl border border-brand/35 bg-surface/95 p-3 shadow-lg backdrop-blur-2xl"
          role="dialog"
          aria-label="Preview a house theme"
        >
          <div className="mb-3 flex items-start justify-between gap-3 px-1">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-fg-brand">
                Preview house theme
              </p>
              <p className="mt-1 text-xs leading-relaxed text-fg-muted">
                Preview site colours before signing in. Your house is assigned
                permanently on registration.
              </p>
            </div>
            <Sparkles
              size={15}
              className="mt-0.5 shrink-0 text-fg-brand"
              aria-hidden="true"
            />
          </div>

          <div
            className="grid grid-cols-2 gap-2"
            role="group"
            aria-label="House themes"
          >
            {selectableHouses.map((key) => {
              const option = houseThemes[key];
              const selected = house === key;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => chooseThemePreview(key)}
                  data-theme={themeAttributeForHouse(key)}
                  className={`group relative flex min-h-20 items-center gap-2 rounded-xl border border-brand-border px-3 py-2 text-left text-fg-brand transition-[border-color,background,transform] hover:-translate-y-0.5 hover:border-brand ${selected ? "bg-brand-soft" : "bg-bg/35 hover:bg-brand-soft"}`}
                >
                  <span
                    className="grid h-9 w-8 shrink-0 place-items-center rounded-md border border-brand-border bg-brand-soft text-sm font-semibold text-fg-brand"
                    aria-hidden="true"
                  >
                    {symbols[key]}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-fg-strong">
                      {option.name}
                    </span>
                    <span className="mt-0.5 block truncate text-[10px] uppercase tracking-[0.1em] text-fg-subtle">
                      {option.quality.split(" · ")[0]}
                    </span>
                  </span>
                  {selected && (
                    <Check
                      size={14}
                      className="absolute right-2 top-2 text-fg-brand"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        type="button"
        aria-expanded={open}
        aria-label="Preview house theme"
        onClick={() => setOpen((value) => !value)}
        suppressHydrationWarning
        className="group inline-flex items-center gap-2 rounded-full border border-brand/40 bg-surface/90 px-3 py-2.5 text-left shadow-lg backdrop-blur-xl transition-colors hover:border-brand hover:bg-brand-soft focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span
          className="grid h-7 w-7 place-items-center rounded-full bg-brand-soft text-fg-brand"
          aria-hidden="true"
        >
          <Palette size={15} />
        </span>
        <span className="hidden sm:block">
          <span className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-fg-brand">
            Preview theme
          </span>
          <span className="mt-0.5 block max-w-28 truncate text-[11px] text-fg-muted">
            {houseTheme.name}
          </span>
        </span>
        <ChevronUp
          size={14}
          className={`text-fg-subtle transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
