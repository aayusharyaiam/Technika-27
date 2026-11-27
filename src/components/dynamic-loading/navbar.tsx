"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./technika.css";
// ⚠️ Adjust this path to wherever your HouseProvider / useHouse lives.
import { useHouse } from "@/components/house-provider";
import { getLogoPalette } from "./house-palette";
import { TechnikaBrand } from "./logo";
import { NavActions } from "./nav-actions";
import { NAV_ROUTES, type NavRoute } from "./nav-routes";

type NavbarProps = {
  /** Routes to render. Defaults to NAV_ROUTES (nav-routes.ts). */
  routes?: NavRoute[];
  /**
   * `false` while the loader is playing: the brand stays hidden (the loader logo
   * lands on it) and the rest waits to blur in. Leave it out if you don't use the loader.
   */
  ready?: boolean;
};

const TEXT = "tk-nav-text text-[12px] font-bold uppercase tracking-[0.14em]";

const matches = (pathname: string, href: string) =>
  href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);

const routeActive = (route: NavRoute, pathname: string) =>
  (route.href ? matches(pathname, route.href) : false) ||
  !!route.children?.some((child) => matches(pathname, child.href));

const reveal = (visible: boolean) =>
  visible
    ? "translate-y-0 opacity-100 blur-[0px]"
    : "translate-y-1 opacity-0 blur-[8px]";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 10 6"
      aria-hidden="true"
      className={`h-1.5 w-2.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M1 1l4 4 4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/* ---------------------------- desktop item ---------------------------- */

function DesktopItem({
  route,
  index,
  pathname,
  ready,
  open,
  onOpen,
  onClose,
  onToggle,
}: {
  route: NavRoute;
  index: number;
  pathname: string;
  ready: boolean;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}) {
  const active = routeActive(route, pathname);
  const delay = ready ? 250 + index * 70 : 0;
  // delay only the reveal properties, not the hover colour change
  const style = { transitionDelay: `${delay}ms, ${delay}ms, ${delay}ms, 0ms` };
  const itemClass = `${TEXT} relative inline-flex items-center gap-1.5 whitespace-nowrap px-2.5 py-2.5 outline-none transition-[opacity,filter,transform,color] duration-700 ease-out hover:text-white focus-visible:text-white focus-visible:ring-1 focus-visible:ring-white/50 motion-reduce:transition-none xl:px-3.5 ${
    active ? "text-[var(--tk-accent)]" : "text-[#d6d4cf]"
  } ${reveal(ready)}`;
  const underline = (
    <span
      aria-hidden="true"
      className={`absolute inset-x-3.5 bottom-1 h-px origin-left bg-[var(--tk-accent)] transition-transform duration-300 motion-reduce:transition-none ${
        active ? "scale-x-100" : "scale-x-0"
      }`}
    />
  );

  if (!route.children?.length) {
    return (
      <li>
        <Link
          href={route.href ?? "#"}
          aria-current={active ? "page" : undefined}
          style={style}
          className={itemClass}
        >
          {route.label}
          {underline}
        </Link>
      </li>
    );
  }

  return (
    <li
      className="relative"
      onMouseEnter={() =>
        window.matchMedia("(hover: hover)").matches && onOpen()
      }
      onMouseLeave={onClose}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null))
          onClose();
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        style={style}
        className={itemClass}
        onClick={(e) => {
          // A real mouse click is already covered by hover; keyboard / touch toggle.
          const hoverDevice = window.matchMedia("(hover: hover)").matches;
          if (e.detail === 0 || !hoverDevice) onToggle();
        }}
      >
        {route.label}
        <Chevron open={open} />
        {underline}
      </button>

      {/* pt-3 bridges the gap so the pointer can travel from the button to the panel */}
      <div
        className={`absolute left-1/2 top-full z-10 w-72 -translate-x-1/2 pt-3 transition-[opacity,transform,visibility] duration-200 motion-reduce:transition-none ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0"
        }`}
      >
        <ul className="tk-stripes relative rounded-[3px] border border-white/10 p-1.5 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.8)]">
          {route.children.map((child) => {
            const childActive = matches(pathname, child.href);
            return (
              <li key={child.href}>
                <Link
                  href={child.href}
                  aria-current={childActive ? "page" : undefined}
                  onClick={onClose}
                  className="group block bg-[#080808] px-3.5 py-3 outline-none transition-colors hover:bg-[#111] focus-visible:bg-[#111] focus-visible:ring-1 focus-visible:ring-white/50"
                >
                  <span
                    className={`${TEXT} block ${childActive ? "text-[var(--tk-accent)]" : "text-[#e6e4df] group-hover:text-white"}`}
                  >
                    {child.label}
                  </span>
                  {child.description && (
                    <span className="mt-1 block text-[12px] leading-snug text-white/45">
                      {child.description}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}

/* -------------------------------- navbar -------------------------------- */

export function Navbar({ routes = NAV_ROUTES, ready = true }: NavbarProps) {
  const pathname = usePathname();
  const { house } = useHouse();
  const accent = getLogoPalette(house).mid;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSub, setMobileSub] = useState<number | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const headerContainerRef = useRef<HTMLDivElement>(null);
  const desktopNavRef = useRef<HTMLElement>(null);

  // Reset open menus immediately during render when route changes (no effect cascade)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (mobileOpen) setMobileOpen(false);
    if (mobileSub !== null) setMobileSub(null);
    if (openIndex !== null) setOpenIndex(null);
  }

  // Desktop dropdown: click outside / Escape closes it
  useEffect(() => {
    if (openIndex === null) return;
    const onPointer = (e: PointerEvent) => {
      if (!desktopNavRef.current?.contains(e.target as Node))
        setOpenIndex(null);
    };
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setOpenIndex(null);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [openIndex]);

  // Mobile menu: outside tap / Escape closes; growing past lg breakpoint resets it
  useEffect(() => {
    if (!mobileOpen) return;
    const onPointer = (e: PointerEvent) => {
      if (!headerContainerRef.current?.contains(e.target as Node))
        setMobileOpen(false);
    };
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setMobileOpen(false);
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setMobileOpen(false);
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header
      style={{ "--tk-accent": accent } as CSSProperties}
      aria-hidden={!ready || undefined}
      className="tk-nav pointer-events-none fixed inset-x-0 top-0 z-50 w-full text-white"
    >
      <div
        ref={headerContainerRef}
        className={`${ready ? "pointer-events-auto" : "pointer-events-none"} relative w-full`}
      >
        {/* ------------- the bar: left | middle | right ------------- */}
        <div className="relative">
          <div
            aria-hidden="true"
            className="tk-stripes absolute inset-0"
          />

          <div className="relative grid h-14 grid-cols-[1fr_auto] items-center px-4 sm:h-16 lg:h-[72px] lg:grid-cols-[1fr_auto_1fr] lg:px-8">
            {/* LEFT – brand (the loader logo lands exactly on this element) */}
            <div className="flex items-center justify-self-start">
              <Link
                href="/"
                aria-label="Technika home"
                data-tk-nav-brand
                className={`inline-flex outline-none focus-visible:ring-1 focus-visible:ring-white/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#080808] ${
                  ready ? "opacity-100" : "opacity-0"
                }`}
              >
                <TechnikaBrand className="text-[1.85rem] sm:text-[2.2rem]" />
              </Link>
            </div>

            {/* MIDDLE – navigation (desktop) */}
            <nav
              ref={desktopNavRef}
              aria-label="Primary"
              className="hidden lg:block"
            >
              <ul className="flex items-center gap-1">
                {routes.map((route, i) => (
                  <DesktopItem
                    key={route.label}
                    route={route}
                    index={i}
                    pathname={pathname}
                    ready={ready}
                    open={openIndex === i}
                    onOpen={() => setOpenIndex(i)}
                    onClose={() =>
                      setOpenIndex((cur) => (cur === i ? null : cur))
                    }
                    onToggle={() =>
                      setOpenIndex((cur) => (cur === i ? null : i))
                    }
                  />
                ))}
              </ul>
            </nav>

            {/* RIGHT – Common Room + Register / Profile (desktop) */}
            <div
              style={{ transitionDelay: ready ? "450ms" : "0ms" }}
              className={`hidden justify-self-end transition-[opacity,filter,transform] duration-700 ease-out motion-reduce:transition-none lg:block ${reveal(ready)}`}
            >
              <NavActions />
            </div>

            {/* Mobile toggle */}
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="tk-mobile-menu"
              onClick={() => setMobileOpen((v) => !v)}
              className={`relative -mr-2 grid h-11 w-11 place-items-center justify-self-end outline-none transition-[opacity,filter] duration-700 focus-visible:ring-1 focus-visible:ring-white/60 motion-reduce:transition-none lg:hidden ${
                ready ? "opacity-100 blur-[0px]" : "opacity-0 blur-[8px]"
              }`}
            >
              <span className="relative block h-3 w-5">
                <span
                  className={`absolute left-0 h-0.5 w-5 bg-white transition-all duration-300 motion-reduce:transition-none ${
                    mobileOpen ? "top-[5px] rotate-45" : "top-0 rotate-0"
                  }`}
                />
                <span
                  className={`absolute left-0 h-0.5 w-5 bg-white transition-all duration-300 motion-reduce:transition-none ${
                    mobileOpen ? "top-[5px] -rotate-45" : "top-[10px] rotate-0"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* ------------- mobile menu: its own striped panel under the bar ------------- */}
        <div
          id="tk-mobile-menu"
          className={`absolute inset-x-0 top-full mt-2 grid transition-[grid-template-rows,visibility] duration-300 ease-out motion-reduce:transition-none lg:hidden ${collapse(
            mobileOpen,
          )}`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="tk-stripes relative max-h-[calc(100dvh-5.5rem)] overflow-y-auto rounded-[3px] border border-white/10">
              <nav aria-label="Mobile">
                <ul className="flex flex-col p-2">
                  {routes.map((route, i) => {
                    const active = routeActive(route, pathname);
                    const itemMotion = `transition-[opacity,transform] duration-300 motion-reduce:transition-none ${
                      mobileOpen
                        ? "translate-y-0 opacity-100"
                        : "-translate-y-1 opacity-0"
                    }`;
                    const itemStyle = {
                      transitionDelay: mobileOpen ? `${60 + i * 45}ms` : "0ms",
                    };
                    const rowClass = `${TEXT} flex w-full items-center justify-between bg-[#080808] px-4 py-4 text-left text-[13px] outline-none focus-visible:ring-1 focus-visible:ring-white/50 ${
                      active ? "text-[var(--tk-accent)]" : "text-[#e6e4df]"
                    }`;

                    if (!route.children?.length) {
                      return (
                        <li
                          key={route.label}
                          style={itemStyle}
                          className={`mb-1.5 ${itemMotion}`}
                        >
                          <Link
                            href={route.href ?? "#"}
                            aria-current={active ? "page" : undefined}
                            onClick={closeMobile}
                            className={rowClass}
                          >
                            {route.label}
                          </Link>
                        </li>
                      );
                    }

                    const subOpen = mobileSub === i;
                    return (
                      <li
                        key={route.label}
                        style={itemStyle}
                        className={`mb-1.5 ${itemMotion}`}
                      >
                        <button
                          type="button"
                          aria-expanded={subOpen}
                          aria-controls={`tk-sub-${i}`}
                          onClick={() => setMobileSub(subOpen ? null : i)}
                          className={rowClass}
                        >
                          {route.label}
                          <Chevron open={subOpen} />
                        </button>
                        <div
                          id={`tk-sub-${i}`}
                          className={`grid transition-[grid-template-rows,visibility] duration-300 ease-out motion-reduce:transition-none ${collapse(subOpen)}`}
                        >
                          <ul className="min-h-0 overflow-hidden">
                            {route.children.map((child) => {
                              const childActive = matches(pathname, child.href);
                              return (
                                <li key={child.href}>
                                  <Link
                                    href={child.href}
                                    aria-current={
                                      childActive ? "page" : undefined
                                    }
                                    onClick={closeMobile}
                                    className="block border-l border-white/15 bg-[#080808]/90 py-3 pl-6 pr-4 outline-none focus-visible:ring-1 focus-visible:ring-white/50"
                                  >
                                    <span
                                      className={`${TEXT} block ${childActive ? "text-[var(--tk-accent)]" : "text-[#cfcdc8]"}`}
                                    >
                                      {child.label}
                                    </span>
                                    {child.description && (
                                      <span className="mt-0.5 block text-[12px] text-white/45">
                                        {child.description}
                                      </span>
                                    )}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="border-t border-white/10 p-2">
                <NavActions variant="mobile" onNavigate={closeMobile} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/** grid-rows collapse helper: hidden panels are also removed from the tab order */
function collapse(isOpen: boolean) {
  return isOpen ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]";
}
