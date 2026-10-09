"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";
import { HOUSE_STORAGE_KEY, houseThemes, isHouse, type House } from "@/lib/houses";

const CHANGE_EVENT = "technika:house-changed";
let memoryHouse: House = "default";

function snapshot(): House {
  try { const stored = localStorage.getItem(HOUSE_STORAGE_KEY); if (isHouse(stored)) return stored; } catch {}
  return memoryHouse;
}
function subscribe(callback: () => void) {
  const storage = (event: StorageEvent) => { if (event.key === HOUSE_STORAGE_KEY || event.key === null) callback(); };
  window.addEventListener("storage", storage);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => { window.removeEventListener("storage", storage); window.removeEventListener(CHANGE_EVENT, callback); };
}

const HouseContext = createContext<{ house: House; theme: (typeof houseThemes)[House]; setHouse: (house: House) => void }>({ house: "default", theme: houseThemes.default, setHouse: () => {} });
export const useHouse = () => useContext(HouseContext);

export function HouseProvider({ children }: { children: React.ReactNode }) {
  const house = useSyncExternalStore(subscribe, snapshot, () => "default" as House);
  const setHouse = useCallback((value: House) => {
    memoryHouse = value;
    document.documentElement.dataset.house = value;
    try { localStorage.setItem(HOUSE_STORAGE_KEY, value); } catch {}
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  useEffect(() => { document.documentElement.dataset.house = house; }, [house]);

  return <HouseContext.Provider value={{ house, theme: houseThemes[house], setHouse }}>{children}</HouseContext.Provider>;
}
