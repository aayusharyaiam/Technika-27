"use client";

import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import {
  ArrowUpRight,
  Award,
  Building2,
  CalendarDays,
  Compass,
  Cpu,
  GraduationCap,
  Landmark,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { setHomeIntroCompleted } from "@/lib/intro-state";
import { useMagic } from "@/components/experience";

const TIMELINE_DAYS = [
  {
    day: "Day 0",
    subtitle: "Arrival & Onboarding",
    summary: "Delegate check-in, welcome kits & campus walkthrough",
  },
  {
    day: "Day 1",
    subtitle: "The Opening",
    summary: "Grand inauguration, 24-hr hackathon & tech exhibitions",
  },
  {
    day: "Day 2",
    subtitle: "The Arena",
    summary: "Robotics, coding battles, e-sports & pro nights",
  },
  {
    day: "Day 3",
    subtitle: "The Finale",
    summary: "Final demos, prize distribution & closing pro show",
  },
] as const;

const EVENT_STATS = [
  { value: "30+", label: "Events", icon: Trophy },
  { value: "1000+", label: "Participants", icon: Users },
  { value: "10+", label: "Colleges", icon: GraduationCap },
] as const;

const BIT_PILLARS = [
  { label: "BIT Legacy", icon: Landmark },
  { label: "BIT Mesra Excellence", icon: Award },
  { label: "Modern Campus", icon: Building2 },
  { label: "Innovation & Growth", icon: Cpu },
] as const;

const REVEAL_EASE = [0.16, 1, 0.3, 1] as const;

export function MobileHogwartsJourney({
  className = "",
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const rootRef = useRef<HTMLElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const campusRef = useRef<HTMLDivElement | null>(null);
  const { setReady } = useMagic();

  useEffect(() => {
    setReady(true);
    setHomeIntroCompleted(true);
  }, [setReady]);

  // Master scroll progress across the mobile showcase
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start end", "end end"],
  });
  const topBarOpacity = useTransform(
    scrollYProgress,
    [0, 0.04, 0.96, 1],
    [0, 1, 1, 0],
  );

  // Deep GPU-only background parallax layers (translate / rotate / scale only — zero filter blur)
  const auraTopY = useTransform(scrollYProgress, [0, 1], [-40, 140]);
  const auraBottomY = useTransform(scrollYProgress, [0, 1], [120, -110]);
  const emblemRotate = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const emblemY = useTransform(scrollYProgress, [0, 1], [-30, 90]);
  const starsFastY = useTransform(scrollYProgress, [0, 1], [60, -140]);
  const starsSlowY = useTransform(scrollYProgress, [0, 1], [-20, 60]);

  // Section 1: Scroll-filled vertical spine
  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineRef,
    offset: ["start 80%", "end 62%"],
  });
  const spineScaleY = useTransform(timelineProgress, [0, 1], [0, 1]);
  const spineHeadTop = useTransform(timelineProgress, [0, 1], ["0%", "100%"]);

  // Section 2: Parallax offsets for stats & crest watermark
  const { scrollYProgress: aboutProgress } = useScroll({
    target: aboutRef,
    offset: ["start end", "end start"],
  });
  const aboutWatermarkY = useTransform(aboutProgress, [0, 1], [45, -55]);
  const stat0Y = useTransform(aboutProgress, [0, 1], [20, -18]);
  const stat1Y = useTransform(aboutProgress, [0, 1], [34, -30]);
  const stat2Y = useTransform(aboutProgress, [0, 1], [16, -14]);
  const statParallax = [stat0Y, stat1Y, stat2Y];

  // Section 3: Parallax depth on campus ring & pillars
  const { scrollYProgress: campusProgress } = useScroll({
    target: campusRef,
    offset: ["start end", "end start"],
  });
  const campusArcRotate = useTransform(campusProgress, [0, 1], [-18, 22]);
  const campusGlowY = useTransform(campusProgress, [0, 1], [40, -40]);

  return (
    <section
      ref={rootRef}
      className={`relative my-10 w-full overflow-hidden bg-[#080808] px-5 py-14 text-zinc-100 ${className}`}
      data-hogwarts-scroll="true"
    >
      {/* Fixed Top Horizontal Scroll Progress Indicator above navbar */}
      <motion.div
        aria-hidden="true"
        style={{
          scaleX: scrollYProgress,
          opacity: topBarOpacity,
          transformOrigin: "0% 50%",
        }}
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] bg-brand"
      />

      {/* Multi-depth GPU Parallax Atmosphere Layers */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <motion.div
          style={{ y: auraTopY }}
          className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--brand)_18%,transparent)_0%,transparent_70%)]"
        />
        <motion.div
          style={{ y: auraBottomY }}
          className="absolute bottom-28 -left-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--brand)_14%,transparent)_0%,transparent_72%)]"
        />
        <motion.div
          style={{ y: emblemY, rotate: emblemRotate }}
          className="absolute top-[22%] right-[-5.5rem] h-52 w-52 rounded-full border border-brand/15"
        >
          <span className="absolute inset-4 rounded-full border border-dashed border-white/10" />
          <span className="absolute top-0 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/60" />
        </motion.div>

        {/* Parallax Starlight Layers */}
        <motion.div style={{ y: starsFastY }} className="absolute inset-0">
          <span className="absolute top-[14%] left-[12%] h-1 w-1 rounded-full bg-brand/70" />
          <span className="absolute top-[38%] right-[16%] h-1.5 w-1.5 rounded-full bg-white/30" />
          <span className="absolute top-[64%] left-[18%] h-1 w-1 rounded-full bg-brand/60" />
          <span className="absolute top-[86%] right-[22%] h-1.5 w-1.5 rounded-full bg-white/25" />
        </motion.div>
        <motion.div style={{ y: starsSlowY }} className="absolute inset-0">
          <span className="absolute top-[25%] left-[78%] h-1 w-1 rounded-full bg-white/35" />
          <span className="absolute top-[52%] left-[84%] h-1 w-1 rounded-full bg-brand/50" />
          <span className="absolute top-[74%] left-[10%] h-1 w-1 rounded-full bg-white/25" />
        </motion.div>

        {/* Vertical Enchanted Spine Line */}
        <div className="absolute inset-y-8 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-md flex-col gap-20">
        {/* ================= 0. JOURNEY INTRO ================= */}
        <motion.div
          id="journey"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, ease: REVEAL_EASE }}
          className="text-center"
        >
          <span className="font-orbiter inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.26em] text-fg-brand">
            <Compass size={12} /> The Grounds
          </span>
          <h2 className="mt-2 font-serif text-3xl font-normal leading-tight text-zinc-100">
            Beyond the{" "}
            <em className="italic text-fg-brand">Castle Gates.</em>
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.85, ease: REVEAL_EASE }}
            className="mx-auto mt-5 h-px w-24 origin-center bg-gradient-to-r from-transparent via-brand/70 to-transparent"
          />
        </motion.div>

        {/* ================= 1. EVENT TIMELINE (Scroll-filled Spine + Day 0..3) ================= */}
        <div ref={timelineRef} id="timeline" className="relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: REVEAL_EASE }}
            className="mb-6 flex items-end justify-between border-b border-white/15 pb-3"
          >
            <div>
              <span className="font-orbiter inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-fg-brand">
                <CalendarDays size={11} /> 01 / Event Timeline
              </span>
              <h3 className="mt-1 font-serif text-2xl font-normal text-zinc-100">
                Four days of{" "}
                <em className="italic text-fg-brand">Technika.</em>
              </h3>
            </div>
            <Link
              href="/timeline"
              className="font-orbiter inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-fg-brand hover:underline"
            >
              Schedule <ArrowUpRight size={12} />
            </Link>
          </motion.div>

          <div className="relative flex gap-4">
            {/* Scroll-Driven Vertical Fill Bar */}
            <div
              aria-hidden="true"
              className="relative flex w-4 shrink-0 justify-center py-1"
            >
              <div className="relative h-full w-[2px] rounded-full bg-white/15">
                <motion.div
                  style={{ scaleY: spineScaleY, transformOrigin: "top center" }}
                  className="h-full w-full rounded-full bg-brand"
                />
                <motion.span
                  style={{ top: spineHeadTop }}
                  className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80 bg-brand"
                />
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-5">
              {TIMELINE_DAYS.map((item, idx) => (
                <motion.div
                  key={item.day}
                  initial={{ opacity: 0, x: 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{
                    duration: 0.55,
                    delay: idx * 0.08,
                    ease: REVEAL_EASE,
                  }}
                  className="border-t border-white/15 pt-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-orbiter text-[10px] font-semibold uppercase tracking-[0.2em] text-fg-brand">
                      {item.day} · {item.subtitle}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-brand/80" />
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-200/90">
                    {item.summary}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= 2. ABOUT EVENT (Parallax Crest + Stats Trio) ================= */}
        <div ref={aboutRef} id="about" className="relative py-4">
          <motion.div
            aria-hidden="true"
            style={{ y: aboutWatermarkY }}
            className="pointer-events-none absolute top-0 right-0 font-serif text-[7rem] leading-none font-bold text-white/[0.03] select-none"
          >
            02
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: REVEAL_EASE }}
            className="relative"
          >
            <span className="font-orbiter inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-fg-brand">
              <Sparkles size={11} /> 02 / About Event
            </span>
            <h3 className="mt-1.5 font-serif text-2xl font-normal leading-snug text-zinc-100">
              Annual Tech Fest of{" "}
              <em className="italic text-fg-brand">BIT Patna.</em>
            </h3>
            <p className="mt-2.5 text-xs leading-relaxed text-zinc-200/90">
              BIT Patna&apos;s flagship festival celebrating innovation and
              hands-on engineering through hackathons, robotics, workshops, and
              industry talks.
            </p>
          </motion.div>

          {/* 30+ Events · 1000+ Participants · 10+ Colleges with individual parallax */}
          <div className="mt-7 grid grid-cols-3 divide-x divide-white/15 border-t border-white/15 pt-5">
            {EVENT_STATS.map(({ value, label, icon: Icon }, idx) => (
              <motion.div
                key={label}
                style={{ y: statParallax[idx] }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.55,
                  delay: idx * 0.1,
                  ease: REVEAL_EASE,
                }}
                className="px-2 text-center"
              >
                <div className="inline-flex items-center justify-center gap-1 font-serif text-2xl font-bold text-fg-brand">
                  <Icon size={13} className="shrink-0" />
                  <span>{value}</span>
                </div>
                <span className="font-orbiter mt-1 block text-[9px] uppercase tracking-[0.16em] text-zinc-200">
                  {label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ================= 3. ABOUT BIT PATNA (Parallax Arc + Pillars + CTAs) ================= */}
        <div ref={campusRef} id="campus" className="relative pt-2 pb-4">
          <div
            id="sponsors"
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-0 h-px w-px"
          />

          <motion.div
            aria-hidden="true"
            style={{ y: campusGlowY, rotate: campusArcRotate }}
            className="pointer-events-none absolute -top-6 -left-16 h-48 w-48 rounded-full border border-brand/15"
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: REVEAL_EASE }}
            className="relative"
          >
            <span className="font-orbiter inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-fg-brand">
              <Landmark size={11} /> 03 / About BIT Patna
            </span>
            <h3 className="mt-1.5 font-serif text-2xl font-normal leading-snug text-zinc-100">
              BIT Patna <em className="italic text-fg-brand">Campus</em>
            </h3>
            <p className="mt-2.5 text-xs leading-relaxed text-zinc-200/90">
              An extension of BIT Mesra fostering technical excellence, research
              culture, and holistic student growth in Eastern India.
            </p>
          </motion.div>

          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-white/15 pt-5">
            {BIT_PILLARS.map(({ label, icon: Icon }, idx) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.08,
                  ease: REVEAL_EASE,
                }}
                className="flex items-center gap-2"
              >
                <Icon size={14} className="shrink-0 text-fg-brand" />
                <span className="font-orbiter text-[11px] font-medium text-zinc-100">
                  {label}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.15, ease: REVEAL_EASE }}
            className="mt-7 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/registrations"
              className="font-orbiter inline-flex items-center gap-1.5 rounded-full bg-brand px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-on transition-transform active:scale-95"
            >
              <span>Explore Events</span>
              <ArrowUpRight size={13} />
            </Link>
            <Link
              href="/contact"
              className="font-orbiter inline-flex items-center gap-1 text-[11px] font-medium text-fg-brand hover:underline"
            >
              <span>Connect</span>
              <ArrowUpRight size={13} />
            </Link>
          </motion.div>
        </div>

        {children && <div className="relative z-20 w-full">{children}</div>}
      </div>
    </section>
  );
}
