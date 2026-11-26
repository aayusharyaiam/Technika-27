"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Sparkles } from "lucide-react";
import { useHouse } from "@/components/house-provider";

type FooterLinkItem = {
  href: string;
  label: string;
  featured?: boolean;
  external?: boolean;
};

const NAV_COLUMNS: { title: string; ariaLabel: string; links: FooterLinkItem[] }[] = [
  {
    title: "The grand halls",
    ariaLabel: "The grand halls",
    links: [
      { href: "/timeline", label: "Programme chronicle" },
      { href: "/#timeline", label: "Festival preview" },
      { href: "/#about", label: "Our story" },
      { href: "/#campus", label: "BIT Patna" },
      { href: "/#sponsors", label: "Our sponsors" },
    ],
  },
  {
    title: "Order & portals",
    ariaLabel: "Order and portals",
    links: [
      { href: "/events", label: "Event registry" },
      { href: "/registrations", label: "Registrations" },
      { href: "/members", label: "The inner sanctum" },
      { href: "/delegate", label: "Delegate enclave" },
      { href: "/accommodation", label: "Guest quarters" },
      { href: "/alumni", label: "Hall of legacies" },
      { href: "/login", label: "Your common room" },
    ],
  },
];

const LEGAL_PORTAL_LINKS: FooterLinkItem[] = [
  { href: "/terms-conditions", label: "Terms & conditions" },
  { href: "/privacy-policy", label: "Privacy policy" },
  {
    href: "https://www.bitmesra.ac.in",
    label: "Explore BIT Mesra",
    external: true,
  },
];

const linkClassName =
  "font-orbiter group inline-flex w-fit items-center gap-1.5 text-[0.9rem] tracking-[0.01em] text-zinc-400 transition-colors duration-200 hover:text-zinc-100";

const REVEAL_VARIANTS = {
  brand: {
    accent: "text-fg-brand",
    reduceHover: "motion-reduce:group-hover:text-fg-brand",
  },
  white: {
    accent: "text-white",
    reduceHover: "motion-reduce:group-hover:text-white",
  },
} as const;

type RevealVariant = keyof typeof REVEAL_VARIANTS;

function RevealLinkText({
  label,
  variant = "brand",
}: {
  label: string;
  variant?: RevealVariant;
}) {
  const styles = REVEAL_VARIANTS[variant];
  return (
    <span className="relative inline-flex overflow-hidden leading-[1.35]">
      <span
        className={`inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:-translate-y-full ${styles.reduceHover}`}
      >
        {label}
      </span>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 inline-block translate-y-full ${styles.accent} transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:translate-y-0`}
      >
        {label}
      </span>
    </span>
  );
}

function FooterActionLink({
  item,
  className = linkClassName,
  revealVariant = "brand",
  showArrow = false,
}: {
  item: FooterLinkItem;
  className?: string;
  revealVariant?: RevealVariant;
  showArrow?: boolean;
}) {
  const inner = (
    <>
      <RevealLinkText label={item.label} variant={revealVariant} />
      {showArrow && (
        <ArrowUpRight
          size={13}
          className="shrink-0 text-zinc-500 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg-brand"
        />
      )}
    </>
  );

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer"
        className={className}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={item.href} className={className}>
      {inner}
    </Link>
  );
}

export function Footer() {
  const { house: activeHouse } = useHouse();
  const house = activeHouse === "default" ? "hufflepuff" : activeHouse;

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#07070a] text-zinc-200">
      {/* Subtle top hairline shimmer & ambient house glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 left-1/2 h-56 w-[40rem] -translate-x-1/2 rounded-full bg-brand-soft opacity-45 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
          {/* Brand & festival manifesto */}
          <div className="flex flex-col items-start lg:col-span-5 lg:pr-8">
            <Link
              href="/"
              className="group inline-flex items-center gap-3.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
            >
              <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] p-1.5 shadow-inner transition-colors duration-300 group-hover:border-brand/40">
                <Image
                  src={`/images/${house}.png`}
                  width={55}
                  height={55}
                  alt={`${house} crest`}
                  className="h-full w-full object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.12)]"
                />
              </span>
              <span className="flex flex-col">
                <span className="flex items-baseline gap-2">
                  <span className="font-harryp text-[1.85rem] leading-none tracking-[0.14em] text-fg-brand">
                    TECHNIKA
                  </span>
                  <b className="font-orbiter text-xs font-semibold tracking-[0.22em] text-zinc-200">
                    2K26
                  </b>
                </span>
                <small className="font-orbiter mt-1 text-[0.65rem] uppercase tracking-[0.22em] text-zinc-400">
                  WHERE TECHNOLOGY MEETS CREATIVITY
                </small>
              </span>
            </Link>

            <p className="mt-5 max-w-lg text-[0.95rem] leading-relaxed text-zinc-400 lg:max-w-md">
              The annual technical festival of Birla Institute of Technology,
              Patna — a gathering of curious minds, bold ideas, and hands-on
              engineering excellence.
            </p>

            <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs tracking-[0.06em] text-zinc-300">
              <Sparkles size={13} className="shrink-0 text-fg-brand" />
              Solemnly sworn. Spectacularly built.
            </span>
          </div>

          {/* Navigation columns: 2 columns side-by-side on mobile, 3 balanced columns on sm+ */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 sm:gap-8 lg:col-span-7">
            {NAV_COLUMNS.map((col) => (
              <nav
                key={col.title}
                aria-label={col.ariaLabel}
                className="flex flex-col gap-3"
              >
                <h3 className="font-serif text-xs font-semibold uppercase tracking-[0.22em] text-zinc-200">
                  {col.title}
                </h3>
                <div className="h-px w-8 bg-brand/50" />
                <div className="mt-1 flex flex-col gap-2.5">
                  {col.links.map((item) => (
                    <FooterActionLink key={item.href} item={item} />
                  ))}
                </div>
              </nav>
            ))}

            <div className="col-span-2 flex flex-col gap-3 sm:col-span-1">
              <h3 className="font-serif text-xs font-semibold uppercase tracking-[0.22em] text-zinc-200">
                Find the magic
              </h3>
              <div className="h-px w-8 bg-brand/50" />

              <div className="mt-1 grid grid-cols-2 items-start gap-x-6 gap-y-4 sm:flex sm:flex-col sm:gap-3">
                <div className="flex flex-col gap-3">
                  <p className="flex items-start gap-2 text-[0.875rem] leading-relaxed text-zinc-400">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-fg-brand" />
                    <span>
                      BIT Patna, Near Patna Airport
                      <br />
                      Bihar, India · 800014
                    </span>
                  </p>

                  <FooterActionLink
                    item={{ href: "/contact", label: "Send an owl", featured: true }}
                    className="font-orbiter group inline-flex w-fit items-center gap-1.5 rounded-full border border-brand/35 bg-brand-soft/60 px-3.5 py-1.5 text-[0.85rem] font-medium tracking-[0.02em] text-zinc-100 transition-all duration-200 hover:border-brand/70 hover:bg-brand-soft"
                    revealVariant="white"
                    showArrow
                  />
                </div>

                <div className="flex flex-col gap-2.5">
                  {LEGAL_PORTAL_LINKS.map((item) => (
                    <FooterActionLink
                      key={item.href}
                      item={item}
                      showArrow
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-8 text-xs tracking-[0.04em] text-zinc-500 sm:flex-row sm:items-center">
          <span>© 2026 Technika · BIT Patna. Chapter complete.</span>
          <span className="inline-flex items-center gap-1.5 text-zinc-400">
            Made of code.{" "}
            <i className="font-serif italic text-zinc-300">Powered by ideas.</i>
            <Sparkles size={11} className="shrink-0 text-fg-brand" />
          </span>
        </div>
      </div>
    </footer>
  );
}
