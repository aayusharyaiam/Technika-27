"use client";

import { useState, type ReactNode } from "react";
import { TechnikaLoader } from "./loader";
import { Navbar } from "./navbar";
import type { NavRoute } from "./nav-routes";

/**
 * Wires the loader and the navbar together:
 *   loader plays → logo flies to the navbar → navbar links blur in → page fades in.
 *
 * Put it inside <HouseProvider> in your root layout.
 */
export function TechnikaShell({
  children,
  routes,
}: {
  children: ReactNode;
  routes?: NavRoute[];
}) {
  const [ready, setReady] = useState(false);

  return (
    <>
      <Navbar routes={routes} ready={ready} />
      {!ready && <TechnikaLoader onLanded={() => setReady(true)} />}
      <div
        className={`transition-opacity duration-700 ease-out motion-reduce:transition-none ${ready ? "opacity-100" : "opacity-0"}`}
      >
        {children}
      </div>
    </>
  );
}
