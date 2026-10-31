export const HOUSE_STORAGE_KEY = "technika:house:v1";

export const houseThemes = {
  default: {
    name: "The enchanted realm",
    motto: "A little magic belongs to everyone.",
    quality: "Unsorted · original gold",
    initial: "T",
    accent: "var(--primary-300)",
    deep: "var(--primary-600)",
    flag: "var(--primary-800)",
    second: "var(--secondary-300)",
  },
  gryffindor: {
    name: "Gryffindor",
    motto: "Where courage becomes creation.",
    quality: "Courage · daring · determination",
    initial: "G",
    accent: "var(--primary-300)",
    deep: "var(--primary-600)",
    flag: "var(--primary-800)",
    second: "var(--secondary-300)",
  },
  slytherin: {
    name: "Slytherin",
    motto: "Greatness begins with ambition.",
    quality: "Ambition · resourcefulness · resolve",
    initial: "S",
    accent: "var(--primary-300)",
    deep: "var(--primary-600)",
    flag: "var(--primary-800)",
    second: "var(--secondary-300)",
  },
  ravenclaw: {
    name: "Ravenclaw",
    motto: "Let curiosity open every door.",
    quality: "Wit · wisdom · wonder",
    initial: "R",
    accent: "var(--primary-300)",
    deep: "var(--primary-600)",
    flag: "var(--primary-800)",
    second: "var(--secondary-300)",
  },
  hufflepuff: {
    name: "Hufflepuff",
    motto: "A shared dream is the strongest spell.",
    quality: "Loyalty · patience · heart",
    initial: "H",
    accent: "var(--primary-300)",
    deep: "var(--primary-600)",
    flag: "var(--primary-800)",
    second: "var(--secondary-300)",
  },
} as const;

export type House = keyof typeof houseThemes;
export const selectableHouses = [
  "gryffindor",
  "slytherin",
  "ravenclaw",
  "hufflepuff",
] as const;

/** The crest used by the shared brand surfaces for each equipped house. */
export const houseLogoPaths: Record<House, string> = {
  default: "/images/hufflepuff.png",
  gryffindor: "/images/gryffindor.png",
  slytherin: "/images/slytherin.png",
  ravenclaw: "/images/ravenclaw.png",
  hufflepuff: "/images/hufflepuff.png",
};

export function houseLogoFor(house: House): string {
  return houseLogoPaths[house];
}

/** Favicon fallback for the unsorted theme; house themes use their PNG crest. */
export function houseIconFor(house: House): string {
  return house === "default" ? "/icon.svg" : houseLogoFor(house);
}

/** Apple touch icon fallback for the unsorted theme; house themes use their PNG crest. */
export function houseAppleIconFor(house: House): string {
  return house === "default" ? "/apple-icon.png" : houseLogoFor(house);
}

export function isHouse(value: unknown): value is House {
  return typeof value === "string" && Object.hasOwn(houseThemes, value);
}

/**
 * Supabase profile values have existed in both lowercase and display-name
 * forms. Normalize them at the boundary so every component uses one House
 * union and one theme key.
 */
export function houseFromValue(value: unknown): House | null {
  if (typeof value !== "string") return null;
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/^house\s+/, "")
    .replace(/\s+/g, "_");
  return isHouse(normalized) ? normalized : null;
}

export function themeAttributeForHouse(house: House): string {
  return house === "default" ? "hogwarts" : house;
}

// Runs before hydration to apply a saved palette without a flash of the default theme.
// Authenticated users use the server-fetched profile value as the source of truth;
// visitors without a session can still restore their local house preference.
export function houseBootScript(
  initialHouse: House = "default",
  preferInitialHouse = false,
) {
  return `try{var serverHouse=${JSON.stringify(initialHouse)};var savedHouse=localStorage.getItem(${JSON.stringify(HOUSE_STORAGE_KEY)});var h=${preferInitialHouse ? "serverHouse" : "savedHouse||serverHouse"};if(${JSON.stringify(Object.keys(houseThemes))}.includes(h)){document.documentElement.dataset.house=h;document.documentElement.dataset.theme=h==="default"?"hogwarts":h}}catch(e){}`;
}
