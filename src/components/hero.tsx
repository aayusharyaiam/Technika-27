"use client";

import Link from "next/link";
/**
 * Hero, styled purely with Tailwind CSS classes and theme tokens.
 * Responsive editorial split layout: typography & CTAs on the left (top on mobile),
 * interactive house-themed ParticleLogo showcase on the right (bottom on mobile).
 */

import { useEffect, useRef } from "react";
import { motion, type Variants } from "motion/react";
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  MapPin,
  Sparkles,
} from "lucide-react";
import { gsap } from "@/lib/gsap";
import { AmbientParticles, SnitchArtwork } from "./ornaments";
import { useMagic } from "./experience";
import { HouseBanners } from "./house-banners";
import ParticleLogo from "./ParticleLogo";
import { useHouse } from "@/components/house-provider";

const FLOATING_CANDLES = [
  "left-[10%] top-[22%] [animation-delay:0s]",
  "left-[22%] top-[34%] [animation-delay:-0.8s]",
  "left-[34%] top-[46%] [animation-delay:-1.6s]",
  "left-[68%] top-[22%] [animation-delay:-2.4s]",
  "left-[80%] top-[34%] [animation-delay:-3.2s]",
  "left-[91%] top-[46%] [animation-delay:-4s]",
] as const;

/* Motion Variants */
const HERO_EASE = [0.16, 1, 0.3, 1] as const;

const heroContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.2,
    },
  },
};

const heroItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 26,
    filter: "blur(6px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1.35,
      ease: HERO_EASE,
    },
  },
};

const heroTitleVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 32,
    scale: 0.96,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1.65,
      ease: HERO_EASE,
    },
  },
};

const heroCrestVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 1.8,
      delay: 0.4,
      ease: HERO_EASE,
    },
  },
};

const heroCueVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.3,
      delay: 1.55,
      ease: HERO_EASE,
    },
  },
};

function GoldenSnitch() {
  const realmRef = useRef<HTMLDivElement>(null);
  const snitchRef = useRef<HTMLDivElement>(null);
  const { enabled } = useMagic();

  useEffect(() => {
    const realm = realmRef.current;
    const snitch = snitchRef.current;
    if (!realm || !snitch || !enabled) return;

    let flight: gsap.core.Timeline | undefined;
    const bank = { angle: 0 };

    const buildFlight = () => {
      const width = realm.clientWidth;
      const height = realm.clientHeight;
      flight?.kill();

      gsap.set(snitch, {
        x: width * 0.78,
        y: height * 0.22,
        opacity: 1,
        scale: 1,
        rotation: -12,
      });

      flight = gsap.timeline({ repeat: -1, defaults: { ease: "none" } });
      flight.to(snitch, {
        duration: 15,
        motionPath: {
          path: [
            { x: width * 0.78, y: height * 0.22 },
            { x: width * 0.88, y: height * 0.42 },
            { x: width * 0.65, y: height * 0.62 },
            { x: width * 0.22, y: height * 0.54 },
            { x: width * 0.12, y: height * 0.28 },
            { x: width * 0.4, y: height * 0.32 },
            { x: width * 0.66, y: height * 0.34 },
            { x: width * 0.82, y: height * 0.18 },
            { x: width * 0.78, y: height * 0.22 },
          ],
          curviness: 1.4,
        },
        onUpdate: () => {
          if (!flight) return;
          const phase = flight.progress();
          bank.angle = Math.sin(phase * Math.PI * 6) * 22;
          gsap.set(snitch, { rotation: bank.angle });
        },
      });
    };

    const resize = new ResizeObserver(buildFlight);
    resize.observe(realm);
    buildFlight();

    return () => {
      flight?.kill();
      resize.disconnect();
    };
  }, [enabled]);

  return (
    <div
      ref={realmRef}
      className="snitch-realm pointer-events-none absolute inset-0 z-[8]"
      aria-hidden="true"
    >
      <div
        className="flying-snitch absolute left-0 top-0 h-12 w-[4.5rem] will-change-transform sm:h-16 sm:w-24 [&_svg]:relative [&_svg]:block [&_svg]:size-full [&_svg]:drop-shadow-[0_0_8px_rgba(255,201,83,0.78)]"
        ref={snitchRef}
      >
        <span className="snitch-halo absolute -inset-[45%] rounded-full bg-[radial-gradient(circle,rgba(255,218,128,0.6),transparent_66%)] animate-hx-pulse motion-reduce:animate-none" />
        <SnitchArtwork />
        <span className="snitch-trail absolute right-full top-1/2 h-px w-20 bg-[linear-gradient(to_left,rgba(255,216,128,0.7),transparent)]" />
      </div>
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { house: activeHouse } = useHouse();
  const house = activeHouse === "default" ? "hufflepuff" : activeHouse;

  return (
    <section
      ref={ref}
      className="hero relative isolate min-h-[100svh] overflow-hidden bg-[#080808] text-zinc-100 select-none flex flex-col justify-between"
      aria-labelledby="hero-title"
    >
      {/* Atmospheric Depth Layer (constant obsidian backdrop so neutrals never shift hue) */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(to_bottom,rgba(8,8,10,0.75),transparent_36%,rgba(8,8,10,0.92)_100%),radial-gradient(110%_85%_at_50%_42%,transparent_42%,rgba(8,8,10,0.85)_100%)]"
        aria-hidden="true"
      />

      <HouseBanners />
      <AmbientParticles count={36} />
      <GoldenSnitch />

      {/* Floating Candles */}
      <div
        className="floating-candles pointer-events-none absolute inset-0 z-[3]"
        aria-hidden="true"
      >
        {FLOATING_CANDLES.map((candleClasses) => (
          <i
            key={candleClasses}
            className={`absolute block h-9 w-2 animate-hx-float motion-reduce:animate-none ${candleClasses}`}
          >
            <span className="absolute -top-3.5 inset-x-0 mx-auto block h-3.5 w-2 animate-hx-flicker rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-t from-amber-500 to-amber-100 shadow-[0_0_16px_6px_rgba(251,191,36,0.42)] motion-reduce:animate-none" />
            <span className="block h-full w-full rounded-[2px] bg-gradient-to-b from-zinc-100/90 to-zinc-400/50" />
          </i>
        ))}
      </div>

      {/* Main Responsive Split Container: Particle Logo Top (small) + Text Bottom on Mobile/Tablet, Left-Right Split on Desktop */}
      <div className="relative z-[6] flex flex-1 items-center px-5 pb-6 pt-20 sm:px-8 sm:pb-8 sm:pt-24 lg:px-14 lg:pb-12 lg:pt-24">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-5 sm:gap-7 lg:flex-row lg:items-center lg:justify-between lg:gap-8 xl:gap-12">
          {/* Left Column on Desktop (Bottom on small screens): Editorial Typography & CTAs with Staggered Reveal */}
          <motion.div
            variants={heroContainerVariants}
            initial="hidden"
            animate="visible"
            className="order-2 flex w-full flex-col items-center text-center lg:order-1 lg:w-[54%] lg:items-start lg:text-left"
          >
            <motion.div
              variants={heroItemVariants}
              className="flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em] text-zinc-400 sm:text-xs sm:tracking-[0.32em] lg:justify-start"
            >
              <span className="h-px w-8 bg-gradient-to-r from-white/30 to-transparent max-lg:hidden sm:w-12" />
              <span className="h-px w-6 bg-gradient-to-r from-transparent to-white/25 max-sm:hidden lg:hidden" />
              BIRLA INSTITUTE OF TECHNOLOGY · PATNA
              <span className="h-px w-6 bg-gradient-to-l from-transparent to-white/25 max-sm:hidden lg:hidden" />
            </motion.div>

            <div className="mt-3 flex flex-col items-center sm:mt-4 lg:mt-5 lg:items-start">
              <motion.span
                variants={heroItemVariants}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-200 backdrop-blur-md shadow-[0_0_24px_rgba(0,0,0,0.45)] sm:px-4 sm:py-1.5 sm:text-[11px]"
              >
                <Sparkles size={12} className="text-zinc-300" /> THE MAKERS&apos;
                CHAPTER <Sparkles size={12} className="text-zinc-300" />
              </motion.span>

              <motion.div variants={heroTitleVariants}>
                <h1
                  id="hero-title"
                  className="font-harryp mt-3 inline-block select-none text-fg-brand text-[clamp(2rem,10.5vw,3rem)] font-normal leading-[1.08] tracking-[0.14em] uppercase transition-colors duration-500 [text-shadow:none] [filter:drop-shadow(0_0_26px_color-mix(in_oklab,var(--fg-brand)_38%,transparent))_drop-shadow(0_4px_14px_rgba(0,0,0,0.92))] sm:mt-4 sm:text-[clamp(3.85rem,11vw,5.25rem)] sm:tracking-[0.16em] lg:text-[clamp(3rem,5vw,6rem)]"
                >
                  TECHNIKA
                </h1>
              </motion.div>

              <motion.p
                variants={heroItemVariants}
                className="mt-2 font-serif text-base italic tracking-wide text-zinc-300 sm:mt-3 sm:text-xl lg:text-2xl"
              >
                The annual techno-cultural festival
              </motion.p>
            </div>

            <div className="mt-4 flex flex-col items-center gap-3.5 sm:mt-6 sm:gap-5 lg:items-start">
              <motion.div
                variants={heroItemVariants}
                className="flex items-center gap-3.5"
              >
                <span className="hidden h-px w-6 bg-white/25 lg:block" />
                <p className="font-serif text-base font-medium tracking-[0.18em] text-zinc-200 sm:text-xl lg:text-2xl">
                  15 <i className="px-1 not-italic text-zinc-500">—</i> 17
                  JANUARY, 2026
                </p>
              </motion.div>

              <motion.div
                variants={heroItemVariants}
                className="flex flex-row flex-wrap items-center justify-center gap-3 sm:gap-3.5 lg:justify-start"
              >
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href="/registrations"
                    className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-brand px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-brand-on shadow-glow-brand outline-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-ring active:translate-y-0 active:bg-brand-active sm:px-7 sm:py-3.5 sm:text-[13px]"
                  >
                    <span>Register Now</span>
                    <ArrowUpRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    href="#journey"
                    className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-100 shadow-inset backdrop-blur-xl backdrop-saturate-150 outline-none transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.09] focus-visible:ring-2 focus-visible:ring-ring active:translate-y-0 sm:px-7 sm:py-3.5 sm:text-[13px]"
                  >
                    Explore Events <BookOpen size={15} />
                  </a>
                </motion.div>
              </motion.div>

              <motion.span
                variants={heroItemVariants}
                className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-zinc-400"
              >
                <MapPin size={11} className="text-zinc-400" /> BIT PATNA · INDIA
              </motion.span>
            </div>
          </motion.div>

          {/* Right Column on Desktop (Top & compact on small screens): Interactive Particle House Crest */}
          <motion.div
            variants={heroCrestVariants}
            initial="hidden"
            animate="visible"
            className="order-1 relative flex w-full flex-col items-center justify-center lg:order-2 lg:w-[46%]"
          >
            <div className="relative flex h-[155px] w-[155px] items-center justify-center sm:h-[200px] sm:w-[200px] md:h-[230px] md:w-[230px] lg:h-[460px] lg:w-[460px] xl:h-[530px] xl:w-[530px]">
              {/* Subtle House-Themed Aura Behind Crest */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.9, scale: 1 }}
                transition={{ duration: 2.1, delay: 0.5, ease: HERO_EASE }}
                className="pointer-events-none absolute -inset-4 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--primary-400)_18%,transparent)_0%,color-mix(in_oklab,var(--secondary-300)_9%,transparent)_44%,transparent_72%)] blur-2xl transition-all duration-700 lg:-inset-6"
                aria-hidden="true"
              />
              {/* Delicate Orbital Accent Ring */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.85, delay: 0.7, ease: HERO_EASE }}
                className="pointer-events-none absolute inset-2 rounded-full border border-white/10 lg:inset-4"
                aria-hidden="true"
              />

              <ParticleLogo
                src={`/images/${house}.png`}
                dotSize={1.15}
                particles={14000}
                background="transparent"
                ariaLabel={`${house} interactive particle crest`}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <motion.div
        variants={heroCueVariants}
        initial="hidden"
        animate="visible"
        className="relative z-[7] mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-5 pb-6 text-[10px] uppercase tracking-[0.25em] text-zinc-500 sm:px-8 lg:px-14"
      >
        <span className="max-lg:hidden font-mono text-zinc-500">
          VOL. XVI ✦ A NEW CHAPTER
        </span>
        <a
          href="#journey"
          className="mx-auto flex items-center gap-2 text-zinc-300 transition-colors hover:text-white lg:mx-0"
        >
          <span>Scroll to enter the castle</span>
          <ArrowDown size={13} className="animate-hx-bob text-fg-brand" />
        </a>
        <span className="max-lg:hidden font-mono text-right text-zinc-500">
          BUILD WHAT COMES NEXT.
        </span>
      </motion.div>
    </section>
  );
}
