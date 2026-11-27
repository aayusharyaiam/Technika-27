"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useState, type ReactNode } from "react";
import { TechnikaLoader } from "./loader";
import { Navbar } from "./navbar";
import type { NavRoute } from "./nav-routes";

const TechnikaShellContext = createContext({
  contentVisible: true,
  ready: true,
});

/** Lets sections like Hero coordinate their reveal animation after the loader flies to the navbar. */
export function useTechnikaShell() {
  return useContext(TechnikaShellContext);
}

/**
 * Wires the loader and the navbar together:
 *   loader plays → logo flies to the navbar → navbar blurs in → page fades in.
 *
 * The loader only plays when the visit STARTS on one of `loaderPaths`
 * (the home page by default). Landing on any other page skips it, and
 * navigating back to "/" later doesn't replay it.
 *
 * Put it inside <HouseProvider> in your root layout.
 */
export function TechnikaShell({
  children,
  routes,
  loaderPaths = ["/"],
}: {
  children: ReactNode;
  routes?: NavRoute[];
  /** Pages that get the intro loader */
  loaderPaths?: string[];
}) {
  const pathname = usePathname();
  const isStandaloneRoom =
    pathname === "/common-room" ||
    pathname.startsWith("/common-room/") ||
    pathname === "/account" ||
    pathname.startsWith("/account/");

  // Decided once, on first render (server and client agree, so no hydration mismatch)
  const initialSkip = isStandaloneRoom || !loaderPaths.includes(pathname);
  const [contentVisible, setContentVisible] = useState(initialSkip);
  const [ready, setReady] = useState(initialSkip);

  if (isStandaloneRoom) {
    return (
      <TechnikaShellContext.Provider value={{ contentVisible: true, ready: true }}>
        {children}
      </TechnikaShellContext.Provider>
    );
  }

  return (
    <TechnikaShellContext.Provider value={{ contentVisible, ready }}>
      <Navbar routes={routes} ready={ready} />
      {!ready && (
        <TechnikaLoader
          onReveal={() => setContentVisible(true)}
          onLanded={() => {
            setContentVisible(true);
            setReady(true);
          }}
        />
      )}
      <div
        aria-hidden={!contentVisible || undefined}
        className={`transition-opacity duration-700 ease-out motion-reduce:transition-none ${
          contentVisible
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        {children}
      </div>
    </TechnikaShellContext.Provider>
  );
}
