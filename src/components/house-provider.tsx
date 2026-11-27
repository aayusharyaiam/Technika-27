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
    const targetFaviconUrl = new URL(`${favicon}?house=${house}`, window.location.origin).href;
    const targetAppleUrl = new URL(`${appleIcon}?house=${house}`, window.location.origin).href;

    let syncing = false;
    const syncLinkGroup = (
      selector: string,
      rel: string,
      targetUrl: string,
      type?: string,
    ) => {
      const links = Array.from(document.head.querySelectorAll<HTMLLinkElement>(selector));
      const managedLinks = links.filter((link) => link.dataset.houseIcon === "true");
      const foreignLinks = links.filter((link) => link.dataset.houseIcon !== "true");

      // Never remove React-managed/foreign <link> nodes (that causes React 19 removeChild crashes);
      // update foreign links in place and only replace imperatively created [data-house-icon] nodes.
      for (const link of foreignLinks) {
        if (link.href !== targetUrl) link.href = targetUrl;
        if (type && link.type !== type) link.type = type;
      }

      if (
        foreignLinks.length === 0 &&
        managedLinks.length === 1 &&
        managedLinks[0].href === targetUrl
      ) {
        return;
      }

      if (foreignLinks.length === 0) {
        const fresh = document.createElement("link");
        fresh.rel = rel;
        fresh.href = targetUrl;
        if (type) fresh.type = type;
        fresh.dataset.houseIcon = "true";
        document.head.appendChild(fresh);

        for (const oldLink of managedLinks) {
          if (oldLink !== fresh && oldLink.parentNode) {
            oldLink.parentNode.removeChild(oldLink);
          }
        }
      } else {
        for (const oldLink of managedLinks) {
          if (oldLink.parentNode) {
            oldLink.parentNode.removeChild(oldLink);
          }
        }
      }
    };

    const syncAllIcons = () => {
      if (syncing) return;
      syncing = true;
      try {
        syncLinkGroup('link[rel~="icon"]', "icon", targetFaviconUrl, faviconType);
        syncLinkGroup('link[rel="apple-touch-icon"]', "apple-touch-icon", targetAppleUrl, "image/png");
      } finally {
        syncing = false;
      }
    };

    syncAllIcons();

    // Keep house icon intact if Next.js head reconciliation mutates or inserts icon links on navigation
    const observer = new MutationObserver(() => {
      syncAllIcons();
    });
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["href", "rel"],
    });
    window.addEventListener("pageshow", syncAllIcons);

    return () => {
      observer.disconnect();
      window.removeEventListener("pageshow", syncAllIcons);
    };
  }, [house]);

  return <HouseContext.Provider value={{ house, theme: houseThemes[house], setHouse }}>{children}</HouseContext.Provider>;
}
