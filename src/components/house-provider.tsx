"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";
import { HOUSE_STORAGE_KEY, houseAppleIconFor, houseIconFor, houseThemes, houseFromValue, themeAttributeForHouse, type House } from "@/lib/houses";

const CHANGE_EVENT = "technika:house-changed";
let memoryHouse: House | null = null;

function snapshot(fallback: House, preferFallback: boolean): House {
  if (memoryHouse) return memoryHouse;
  if (preferFallback) return fallback;
  try {
    const stored = houseFromValue(localStorage.getItem(HOUSE_STORAGE_KEY));
    if (stored) return stored;
  } catch {}
  return fallback;
}
function subscribe(callback: () => void) {
  const storage = (event: StorageEvent) => { if (event.key === HOUSE_STORAGE_KEY || event.key === null) callback(); };
  window.addEventListener("storage", storage);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => { window.removeEventListener("storage", storage); window.removeEventListener(CHANGE_EVENT, callback); };
}

const HouseContext = createContext<{ house: House; theme: (typeof houseThemes)[House]; setHouse: (house: House) => void }>({ house: "default", theme: houseThemes.default, setHouse: () => {} });
export const useHouse = () => useContext(HouseContext);

export function HouseProvider({
  children,
  initialHouse = "default",
  preferInitialHouse = false,
}: {
  children: React.ReactNode;
  initialHouse?: House;
  preferInitialHouse?: boolean;
}) {
  const house = useSyncExternalStore(
    subscribe,
    () => snapshot(initialHouse, preferInitialHouse),
    () => initialHouse,
  );
  const setHouse = useCallback((value: House) => {
    memoryHouse = value;
    document.documentElement.dataset.house = value;
    document.documentElement.dataset.theme = themeAttributeForHouse(value);
    try { localStorage.setItem(HOUSE_STORAGE_KEY, value); } catch {}
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.house = house;
    document.documentElement.dataset.theme = themeAttributeForHouse(house);
  }, [house]);

  useEffect(() => {
    const favicon = houseIconFor(house);
    const appleIcon = houseAppleIconFor(house);
    const faviconType = favicon.endsWith(".svg") ? "image/svg+xml" : "image/png";
    const withHouseCacheKey = (href: string) => `${href}?house=${house}`;

    const syncLinks = (selector: string, rel: string, href: string, type?: string) => {
      const links = [...document.head.querySelectorAll<HTMLLinkElement>(selector)];
      const targets = links.length > 0 ? links : [document.createElement("link")];

      for (const link of targets) {
        if (!link.isConnected) {
          link.rel = rel;
          document.head.appendChild(link);
        }
        link.href = withHouseCacheKey(href);
        if (type) link.type = type;
        link.dataset.houseIcon = "true";
      }
    };

    syncLinks('link[rel~="icon"]', "icon", favicon, faviconType);
    syncLinks('link[rel="apple-touch-icon"]', "apple-touch-icon", appleIcon, "image/png");
  }, [house]);

  return <HouseContext.Provider value={{ house, theme: houseThemes[house], setHouse }}>{children}</HouseContext.Provider>;
}
