export const HOUSE_STORAGE_KEY = "technika:house:v1";

export const houseThemes = {
  default: { name: "The enchanted realm", motto: "A little magic belongs to everyone.", quality: "Unsorted · original gold", initial: "T", accent: "#ffd893", deep: "#b99554", flag: "#483324", second: "#eac779" },
  gryffindor: { name: "Gryffindor", motto: "Where courage becomes creation.", quality: "Courage · daring · determination", initial: "G", accent: "#f2a28e", deep: "#b95343", flag: "#7b202c", second: "#e4bd66" },
  slytherin: { name: "Slytherin", motto: "Greatness begins with ambition.", quality: "Ambition · resourcefulness · resolve", initial: "S", accent: "#98d8b4", deep: "#408763", flag: "#154d3a", second: "#c3d6cc" },
  ravenclaw: { name: "Ravenclaw", motto: "Let curiosity open every door.", quality: "Wit · wisdom · wonder", initial: "R", accent: "#a7d2ff", deep: "#568ec3", flag: "#173b68", second: "#c1a475" },
  hufflepuff: { name: "Hufflepuff", motto: "A shared dream is the strongest spell.", quality: "Loyalty · patience · heart", initial: "H", accent: "#f6d569", deep: "#b79736", flag: "#a07a24", second: "#302b20" },
} as const;

export type House = keyof typeof houseThemes;
export const selectableHouses = ["gryffindor", "slytherin", "ravenclaw", "hufflepuff"] as const;
export function isHouse(value: unknown): value is House {
  return typeof value === "string" && Object.hasOwn(houseThemes, value);
}

// Runs before hydration to apply a saved palette without a flash of the default theme.
export const houseBootScript = `try{var h=localStorage.getItem(${JSON.stringify(HOUSE_STORAGE_KEY)});if(${JSON.stringify(Object.keys(houseThemes))}.includes(h))document.documentElement.dataset.house=h}catch(e){}`;
