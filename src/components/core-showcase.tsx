"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowUpRight, Crown, Sparkles, Users } from "lucide-react";
import { coreSections } from "@/lib/core-team";
import CoreCard from "@/components/CoreCard";

const HERO_EASE = [0.16, 1, 0.3, 1] as const;

const totalMembers = coreSections.reduce(
  (sum, section) => sum + section.members.length,
  0,
);

export function CoreShowcase() {
  const [selectedSectionId, setSelectedSectionId] = useState<string>("all");

  const visibleSections =
    selectedSectionId === "all"
      ? coreSections
      : coreSections.filter((section) => section.id === selectedSectionId);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080808] px-4 pb-24 pt-28 text-zinc-100 sm:px-6 lg:px-10 lg:pt-32">
      {/* Subtle theme-reactive radial atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[36rem] w-[68rem] -translate-x-1/2 rounded-full bg-brand-soft opacity-45 blur-3xl transition-colors duration-700"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-brand-soft opacity-25 blur-3xl transition-colors duration-700"
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Top Masthead */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: HERO_EASE }}
          className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4"
        >
          <Link
            href="/"
            className="font-orbiter inline-flex items-center gap-2 text-[13px] text-zinc-400 transition-colors hover:text-fg-brand"
          >
            <ArrowLeft size={15} />
            <span>Back to Home</span>
          </Link>

          <span className="font-orbiter inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-fg-brand">
            <Crown size={14} />
            <span>Council Archive · Technika &apos;27</span>
          </span>
        </motion.div>

        {/* Hero Section */}
        <motion.header
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.85, ease: HERO_EASE }}
          className="py-12 text-center sm:py-16"
        >
          <span className="font-orbiter inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-soft/60 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-fg-brand">
            <Sparkles size={13} />
            BIT Patna · Organising Council
          </span>

          <h1 className="mt-5 font-serif text-[2.65rem] font-normal leading-[1.05] tracking-tight text-zinc-100 sm:text-[4rem] lg:text-[4.65rem]">
            The Core{" "}
            <em className="font-serif italic text-fg-brand">Committee</em>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-zinc-400 sm:text-[17px]">
            Meet the heads and co-heads orchestrating Technika &apos;27 — from
            engineering arenas and visual craft to hospitality and execution.
          </p>

          {/* Compact Roster Stats */}
          <div className="mt-7 inline-flex flex-wrap items-center justify-center gap-3 sm:gap-5">
            <span className="font-orbiter inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-[13px] text-zinc-300">
              <Users size={14} className="text-fg-brand" />
              <span>{totalMembers} Council Leaders</span>
            </span>
            <span className="font-orbiter inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-soft/45 px-4 py-1.5 text-[13px] text-fg-brand">
              <Sparkles size={14} />
              <span>{coreSections.length} Core Wings</span>
            </span>
          </div>
        </motion.header>

        {/* Responsive Team Filter Bar */}
        <div className="mb-10 rounded-2xl border border-white/10 bg-white/[0.02] p-2.5 backdrop-blur-xl sm:mb-12 sm:p-4">
          <div
            className="flex flex-nowrap gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0"
            role="group"
            aria-label="Filter core teams"
          >
            <button
              type="button"
              onClick={() => setSelectedSectionId("all")}
              aria-pressed={selectedSectionId === "all"}
              className={`font-orbiter shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 sm:text-[13px] ${
                selectedSectionId === "all"
                  ? "border-brand bg-brand text-brand-on shadow-glow-brand"
                  : "border-white/10 bg-white/[0.02] text-zinc-400 hover:border-brand-border hover:text-zinc-100"
              }`}
            >
              All Teams ({coreSections.length})
            </button>

            {coreSections.map((section) => {
              const active = selectedSectionId === section.id;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setSelectedSectionId(section.id)}
                  aria-pressed={active}
                  className={`font-orbiter shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 sm:text-[13px] ${
                    active
                      ? "border-brand bg-brand text-brand-on shadow-glow-brand"
                      : "border-white/10 bg-white/[0.02] text-zinc-400 hover:border-brand-border hover:text-zinc-100"
                  }`}
                >
                  {section.title.replace(/\s+Team$/i, "")}
                </button>
              );
            })}
          </div>
        </div>

        {/* Core Sections */}
        <div className="flex flex-col gap-16 sm:gap-20">
          {visibleSections.map((section, sectionIdx) => {
            const globalIndex = coreSections.findIndex(
              (s) => s.id === section.id,
            );
            const sectionNumber = String(
              (globalIndex >= 0 ? globalIndex : sectionIdx) + 1,
            ).padStart(2, "0");

            return (
              <section
                key={section.id}
                id={`team-${section.id}`}
                aria-labelledby={`heading-${section.id}`}
                className="scroll-mt-28"
              >
                {/* Centered Editorial Section Heading */}
                <div className="mb-8 flex flex-col items-center text-center sm:mb-10">
                  <span className="font-orbiter text-[11px] font-semibold uppercase tracking-[0.24em] text-fg-brand sm:text-xs">
                    Wing {sectionNumber} · {section.members.length}{" "}
                    {section.members.length === 1 ? "Member" : "Members"}
                  </span>
                  <h2
                    id={`heading-${section.id}`}
                    className="mt-1.5 font-serif text-[1.65rem] font-harryp tracking-tight text-zinc-100 sm:text-[2.35rem]"
                  >
                    {section.title}
                  </h2>
                  <div className="mt-3.5 h-px w-34 bg-gradient-to-r from-transparent via-brand to-transparent opacity-70" />
                </div>

                {/* Centered Responsive Flex Rows: odd remaining cards sit equally divided in the middle */}
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-7">
                  {section.members.map((member, memberIdx) => (
                    <CoreCard
                      key={`${section.id}-${member.title || memberIdx}`}
                      member={member}
                      index={memberIdx}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Bottom Portal Callout */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: HERO_EASE }}
          className="mt-20 flex flex-col items-center justify-between gap-5 rounded-3xl border border-brand-border bg-gradient-to-r from-white/[0.02] via-brand-soft/45 to-white/[0.02] p-6 text-center sm:flex-row sm:p-8 sm:text-left"
        >
          <div>
            <span className="font-orbiter block text-[11px] font-semibold uppercase tracking-[0.22em] text-fg-brand">
              BEHIND EVERY SPELL
            </span>
            <h2 className="mt-1 font-serif text-[1.6rem] text-zinc-100 sm:text-[2rem]">
              Explore the Developers &amp; Alumni Network
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/devs"
              className="font-orbiter inline-flex items-center gap-2 rounded-xl border border-brand-border bg-brand-soft px-4 py-2.5 text-[13px] font-semibold uppercase tracking-wider text-fg-brand transition-all hover:border-brand"
            >
              <span>Web Crew</span>
              <ArrowUpRight size={14} />
            </Link>
            <Link
              href="/alumni"
              className="font-orbiter inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-[13px] font-semibold uppercase tracking-wider text-brand-on shadow-glow-brand transition-colors hover:bg-brand-hover"
            >
              <span>Hall of Legacies</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
