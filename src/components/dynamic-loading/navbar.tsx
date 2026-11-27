"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";
import "./technika.css";
// ⚠️ Adjust this path to wherever your HouseProvider / useHouse lives.
import { useHouse } from "@/components/house-provider";
import { getLogoPalette } from "./house-palette";
import { TechnikaBrand } from "./logo";
import { NAV_ROUTES, type NavRoute } from "./nav-routes";

type NavbarProps = {
  /** Routes to render. Defaults to NAV_ROUTES (nav-routes.ts). */
  routes?: NavRoute[];
  /**
   * `false` while the loader is playing: the brand stays hidden (the loader logo
   * lands on it) and the links wait to blur in. Leave it out if you don't use the loader.
   */
  ready?: boolean;
};

export function Navbar({ routes = NAV_ROUTES, ready = true }: NavbarProps) {
  const pathname = usePathname();
  const { house } = useHouse();
  const accent = getLogoPalette(house).mid;

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  // Close the mobile menu after navigating
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Glass background once the page scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes the menu; growing past the md breakpoint resets it
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
    };
  }, [open]);

  const reveal = (visible: boolean) =>
    visible
      ? "translate-y-0 opacity-100 blur-[0px]"
      : "translate-y-1 opacity-0 blur-[8px]";

  return (
    <header
      style={{ "--tk-accent": accent } as CSSProperties}
      className={`tk-nav fixed inset-x-0 top-0 z-50 border-b text-white transition-[background-color,border-color,backdrop-filter] duration-300 motion-reduce:transition-none ${
        open
          ? "border-white/[0.08] bg-[#0a0a0a]/95 backdrop-blur-xl"
          : scrolled
            ? "border-white/[0.08] bg-[#0a0a0a]/75 backdrop-blur-xl"
            : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1680px] items-center justify-between px-5 sm:px-8 lg:px-14">
        {/* Brand – the loader logo lands exactly on this element */}
        <Link
          href="/"
          aria-label="Technika home"
          data-tk-nav-brand
          className={`inline-flex rounded-md outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0a0a0a] ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        >
          <TechnikaBrand className="text-[1.5rem] sm:text-[1.75rem]" />
        </Link>

        {/* Desktop links */}
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {routes.map((route, i) => {
              const active = isActive(route.href);
              const delay = ready ? 250 + i * 70 : 0;
              return (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    aria-current={active ? "page" : undefined}
                    // delay only the reveal properties, not the hover colour change
                    style={{
                      transitionDelay: `${delay}ms, ${delay}ms, ${delay}ms, 0ms`,
                    }}
                    className={`relative inline-block rounded-sm py-2 text-sm font-medium outline-none transition-[opacity,filter,transform,color] duration-700 ease-out hover:text-white focus-visible:text-white focus-visible:ring-2 focus-visible:ring-white/50 motion-reduce:transition-none ${
                      active ? "text-white" : "text-white/65"
                    } ${reveal(ready)}`}
                  >
                    {route.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-0 bottom-0 h-0.5 origin-left rounded-full bg-[var(--tk-accent)] transition-transform duration-300 motion-reduce:transition-none ${
                        active ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="tk-mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className={`relative -mr-2 grid h-11 w-11 place-items-center rounded-full outline-none transition-[opacity,filter] duration-700 focus-visible:ring-2 focus-visible:ring-white/60 motion-reduce:transition-none md:hidden ${
            ready ? "opacity-100 blur-[0px]" : "opacity-0 blur-[8px]"
          }`}
        >
          <span className="relative block h-3 w-5">
            <span
              className={`absolute left-0 h-0.5 w-5 rounded-full bg-white transition-all duration-300 motion-reduce:transition-none ${
                open ? "top-[5px] rotate-45" : "top-0 rotate-0"
              }`}
            />
            <span
              className={`absolute left-0 h-0.5 w-5 rounded-full bg-white transition-all duration-300 motion-reduce:transition-none ${
                open ? "top-[5px] -rotate-45" : "top-[10px] rotate-0"
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile menu – animates height via grid rows, hidden from focus when closed */}
      <div
        id="tk-mobile-menu"
        className={`grid transition-[grid-template-rows,visibility] duration-300 ease-out motion-reduce:transition-none md:hidden ${
          open ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"
        }`}
      >
        <nav aria-label="Mobile" className="min-h-0 overflow-hidden">
          <ul className="flex flex-col px-5 pb-4 sm:px-8">
            {routes.map((route, i) => {
              const active = isActive(route.href);
              return (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    style={{
                      transitionDelay: open ? `${60 + i * 45}ms` : "0ms",
                    }}
                    className={`flex items-center justify-between border-t border-white/[0.07] py-4 text-xl font-medium outline-none transition-[opacity,transform,color] duration-300 focus-visible:text-white motion-reduce:transition-none ${
                      active ? "text-white" : "text-white/70 active:text-white"
                    } ${open ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"}`}
                  >
                    {route.label}
                    {active && (
                      <span
                        aria-hidden="true"
                        className="h-2 w-2 rounded-full bg-[var(--tk-accent)]"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
