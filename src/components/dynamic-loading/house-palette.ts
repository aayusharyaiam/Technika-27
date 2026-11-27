/**
 * Logo colours per house, sampled from the four PNGs you supplied
 * (top / middle / bottom band of the gradient on each one).
 *
 * Keys are matched against the `house` value coming from `useHouse()`.
 * Anything not listed here (including "default") uses DEFAULT_LOGO_PALETTE.
 */
export type LogoPalette = {
  /** Gradient stop at the top of the mark */
  top: string;
  /** Gradient stop in the middle (also used for the navbar accent) */
  mid: string;
  /** Gradient stop at the bottom */
  bottom: string;
};

const HUFFLEPUFF: LogoPalette = {
  top: "#ffe03f",
  mid: "#fdbe23",
  bottom: "#e8a00c",
};

export const HOUSE_LOGO_PALETTES: Record<string, LogoPalette> = {
  gryffindor: { top: "#ff3f45", mid: "#fd2346", bottom: "#e80c38" },
  hufflepuff: HUFFLEPUFF,
  ravenclaw: { top: "#3fa0ff", mid: "#23affd", bottom: "#0ca1e8" },
  slytherin: { top: "#29a738", mid: "#19a517", bottom: "#0f9808" },
};

/** Used for the "default" house and for any house name not listed above. */
export const DEFAULT_LOGO_PALETTE: LogoPalette = HUFFLEPUFF;

export function getLogoPalette(house: string): LogoPalette {
  return HOUSE_LOGO_PALETTES[house] ?? DEFAULT_LOGO_PALETTE;
}
