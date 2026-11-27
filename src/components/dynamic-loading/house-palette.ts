/**
 * Logo colours per house, sampled from the four PNGs you supplied
 * (top / middle / bottom band of the gradient on each one).
 *
 * Keys are matched against the `house` value coming from `useHouse()`.
 * If a key is missing, the "default" palette is used.
 */
export type LogoPalette = {
  /** Gradient stop at the top of the mark */
  top: string;
  /** Gradient stop in the middle (also used for the navbar accent) */
  mid: string;
  /** Gradient stop at the bottom */
  bottom: string;
  /** Soft radial glow behind the loader logo */
  glow: string;
};

export const HOUSE_LOGO_PALETTES: Record<string, LogoPalette> = {
  // White, like the logo in your reference video
  default: {
    top: "#ffffff",
    mid: "#f1f1f1",
    bottom: "#b8b8b8",
    glow: "rgba(255,255,255,0.14)",
  },
  gryffindor: {
    top: "#ff3f45",
    mid: "#fd2346",
    bottom: "#e80c38",
    glow: "rgba(255,35,70,0.26)",
  },
  hufflepuff: {
    top: "#ffe03f",
    mid: "#fdbe23",
    bottom: "#e8a00c",
    glow: "rgba(253,190,35,0.24)",
  },
  ravenclaw: {
    top: "#3fa0ff",
    mid: "#23affd",
    bottom: "#0ca1e8",
    glow: "rgba(35,175,253,0.26)",
  },
  slytherin: {
    top: "#29a738",
    mid: "#19a517",
    bottom: "#0f9808",
    glow: "rgba(25,165,23,0.26)",
  },
};

export function getLogoPalette(house: string): LogoPalette {
  return HOUSE_LOGO_PALETTES[house] ?? HOUSE_LOGO_PALETTES.default;
}
