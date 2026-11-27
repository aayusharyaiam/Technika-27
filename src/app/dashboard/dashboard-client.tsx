"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, type Variants } from "motion/react";
import {
  ArrowUpRight,
  BadgeCheck,
  Bird,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  Compass,
  Copy,
  Flame,
  GraduationCap,
  Leaf,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Sun,
  User,
} from "lucide-react";
import { useHouse } from "@/components/house-provider";
import type { AssignedHouse } from "@/lib/common-room/types";
import {
  houseFromValue,
  houseLogoFor,
  houseThemes,
  themeAttributeForHouse,
  type House,
} from "@/lib/houses";
import LogoutButton from "./logout-button";

interface DashboardProfile {
  full_name: string | null;
  college: string | null;
  phone: string | null;
  house: string | null;
  is_bit?: boolean;
  created_at?: string | null;
}

interface DashboardClientProps {
  userId: string;
  email: string;
  profile: DashboardProfile;
  createdAt?: string | null;
}

const DASH_EASE = [0.16, 1, 0.3, 1] as const;

const sectionContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: DASH_EASE },
  },
};

const cardStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: DASH_EASE },
  },
};

const houseSymbols = {
  gryffindor: Flame,
  slytherin: Leaf,
  ravenclaw: Bird,
  hufflepuff: Sun,
} as const;

const houseMascots: Record<
  AssignedHouse,
  { mascot: string; element: string }
> = {
  gryffindor: { mascot: "Lion", element: "Fire" },
  slytherin: { mascot: "Serpent", element: "Water" },
  ravenclaw: { mascot: "Eagle", element: "Air" },
  hufflepuff: { mascot: "Badger", element: "Earth" },
};

const directoryLinks = [
  {
    href: "/registrations",
    label: "Festival Chambers",
    detail:
      "Explore hackathons, robotics arenas, cultural shows, and registrations.",
    badge: "Four Tracks",
    Icon: CalendarDays,
  },
  {
    href: "/marauders-map",
    label: "The Marauder's Map",
    detail:
      "Interactive campus grounds, chamber routes, and live event discovery.",
    badge: "Campus Explorer",
    Icon: Compass,
  },
  {
    href: "/accommodation",
    label: "Guest Quarters",
    detail:
      "Festival passes, guest accommodation guidance, and travel directions.",
    badge: "Stay & Passes",
    Icon: ShieldCheck,
  },
] as const;

export default function DashboardClient({
  userId,
  email,
  profile,
  createdAt,
}: DashboardClientProps) {
  const { house: contextHouse, setHouse } = useHouse();
  const [copiedId, setCopiedId] = useState(false);

  const activeHouse: House =
    houseFromValue(profile.house) || houseFromValue(contextHouse) || "default";
  const theme = houseThemes[activeHouse];
  const assignedHouse: AssignedHouse | null =
    activeHouse !== "default" ? activeHouse : null;

  useEffect(() => {
    if (assignedHouse && contextHouse !== assignedHouse) {
      setHouse(assignedHouse);
    }
  }, [assignedHouse, contextHouse, setHouse]);

  const displayName = profile.full_name?.trim() || "Wizard";
  const firstName = displayName.split(/\s+/)[0] || "Wizard";

  const handleCopyId = () => {
    navigator.clipboard.writeText(userId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const registeredDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Verified Delegate";

  const ActiveHouseIcon = assignedHouse
    ? houseSymbols[assignedHouse]
    : Sparkles;

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#080808] px-4 pb-20 pt-28 text-zinc-100 transition-colors duration-500 sm:px-6 lg:px-8"
      data-theme={themeAttributeForHouse(activeHouse)}
      data-house={activeHouse}
    >
      {/* Subtle theme-reactive radial atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[32rem] w-[64rem] -translate-x-1/2 rounded-full bg-brand-soft opacity-40 blur-3xl transition-colors duration-700"
      />

      <motion.div
        variants={sectionContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto flex max-w-7xl flex-col gap-8"
      >
        {/* =========================================================
            TOP STATUS BAR
           ========================================================= */}
        <motion.div
          variants={fadeUpItem}
          className="flex flex-col justify-between gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-brand-border bg-brand-soft text-fg-brand">
              <Sparkles size={14} />
            </span>
            <span className="font-orbiter text-[11px] font-semibold uppercase tracking-[0.22em] text-fg-brand">
              Command Centre · Technika &apos;27
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="font-orbiter inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-brand" />
              <span>Owls &amp; Server Synchronized</span>
            </div>

            {assignedHouse && (
              <Link
                href="/common-room"
                className="font-orbiter inline-flex items-center gap-1.5 rounded-full border border-brand-border bg-brand-soft px-3.5 py-1.5 text-xs font-medium text-fg-brand transition-all duration-200 hover:border-brand hover:brightness-110"
              >
                <BookOpen size={13} />
                <span>3D Common Room</span>
              </Link>
            )}
          </div>
        </motion.div>

        {/* =========================================================
            HERO COMMAND CHAMBER BANNER
           ========================================================= */}
        <motion.section
          variants={fadeUpItem}
          className="relative overflow-hidden rounded-3xl border border-brand-border bg-white/[0.025] p-6 shadow-glow-brand backdrop-blur-2xl transition-colors duration-500 sm:p-10 lg:p-12"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-soft opacity-65 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/55 to-transparent"
          />

          <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
            {/* Greeting & Actions */}
            <div className="flex flex-col gap-4 lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-orbiter inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-fg-brand">
                  <ShieldCheck size={14} />
                  Verified Castle Delegate
                </span>

                {profile.is_bit && (
                  <span className="font-orbiter inline-flex items-center gap-1.5 rounded-full border border-brand-border bg-brand-soft/80 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-fg-brand">
                    <BadgeCheck size={12} />
                    BIT Patna Verified
                  </span>
                )}
              </div>

              <h1 className="font-serif text-4xl leading-[1.06] tracking-tight text-zinc-100 sm:text-6xl lg:text-7xl">
                Welcome home,
                <br />
                <em className="italic text-fg-brand">{firstName}.</em>
              </h1>

              <p className="max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
                Your Technika command centre is primed for the festival. Explore
                your interactive 3D House Common Room below, follow campus
                quests on the Marauder&apos;s Map, and carry your house colours
                with pride.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-3">
                <Link
                  href="/registrations"
                  className="font-orbiter inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-on shadow-glow-brand transition-all duration-200 hover:bg-brand-hover sm:text-sm"
                >
                  <span>Explore Events</span>
                  <ArrowUpRight size={16} />
                </Link>

                {assignedHouse && (
                  <Link
                    href="/common-room"
                    className="font-orbiter inline-flex items-center gap-2 rounded-xl border border-brand-border bg-brand-soft/60 px-5 py-3 text-xs font-medium uppercase tracking-wider text-zinc-100 transition-all duration-200 hover:border-brand hover:bg-brand-soft sm:text-sm"
                  >
                    <BookOpen size={15} className="text-fg-brand" />
                    <span>Enter 3D Common Room</span>
                  </Link>
                )}

                <Link
                  href="/marauders-map"
                  className="font-orbiter inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-xs font-medium uppercase tracking-wider text-zinc-300 transition-all duration-200 hover:border-white/25 hover:text-zinc-100 sm:text-sm"
                >
                  <Compass size={15} className="text-fg-brand" />
                  <span>Campus Map</span>
                </Link>
              </div>
            </div>

            {/* Locked House Crest Showcase */}
            <div className="flex flex-col gap-4 lg:col-span-5">
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.35, ease: DASH_EASE }}
                className="relative flex flex-col gap-5 rounded-2xl border border-brand-border bg-[#0c0c12]/80 p-6 shadow-xl backdrop-blur-xl sm:p-7"
              >
                <div className="flex items-center gap-5">
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-brand-border bg-brand-soft p-2.5 shadow-inner sm:h-24 sm:w-24"
                  >
                    <Image
                      src={houseLogoFor(activeHouse)}
                      width={80}
                      height={80}
                      alt={theme.name}
                      priority
                      className="h-full w-full object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.8)]"
                    />
                  </motion.div>

                  <div className="min-w-0 flex flex-col gap-1">
                    <span className="font-orbiter inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-fg-brand">
                      <Lock size={10} />
                      Permanent House
                    </span>
                    <h2 className="truncate font-serif text-2xl font-bold text-zinc-100 sm:text-3xl">
                      {theme.name}
                    </h2>
                    <p className="line-clamp-2 text-xs italic text-zinc-400">
                      {theme.motto}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 border-t border-white/10 pt-4 text-xs">
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2">
                    <span className="font-orbiter font-semibold text-fg-brand">
                      Element:
                    </span>
                    <span className="capitalize text-zinc-200">
                      {assignedHouse
                        ? houseMascots[assignedHouse].element
                        : "Magic"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2">
                    <span className="font-orbiter font-semibold text-fg-brand">
                      Mascot:
                    </span>
                    <span className="capitalize text-zinc-200">
                      {assignedHouse
                        ? houseMascots[assignedHouse].mascot
                        : "Crest"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-0.5 text-xs text-zinc-400">
                  <span className="inline-flex min-w-0 items-center gap-2 truncate">
                    <CheckCircle2
                      size={15}
                      className="shrink-0 text-fg-brand"
                    />
                    <span className="truncate">{theme.quality}</span>
                  </span>
                  <ActiveHouseIcon
                    size={15}
                    className="shrink-0 text-fg-brand"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* =========================================================
            PERSONAL DETAILS & CREDENTIALS LEDGER
           ========================================================= */}
        <motion.section
          variants={fadeUpItem}
          className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 shadow-xl sm:p-8"
        >
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex flex-col gap-1">
              <span className="font-orbiter text-[10px] font-semibold uppercase tracking-[0.22em] text-fg-brand">
                OFFICIAL STUDENT LEDGER
              </span>
              <h2 className="font-serif text-2xl text-zinc-100 sm:text-3xl">
                Personal Details &amp; Credentials
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border bg-brand-soft text-fg-brand">
              <User size={18} />
            </div>
          </div>

          <motion.div
            variants={cardStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <motion.div
              variants={cardItem}
              className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/[0.02] p-4"
            >
              <span className="font-orbiter flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                <User size={12} className="text-fg-brand" /> Full Name
              </span>
              <span className="text-sm font-semibold text-zinc-100 sm:text-base">
                {profile.full_name || "Wizard Delegate"}
              </span>
            </motion.div>

            <motion.div
              variants={cardItem}
              className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/[0.02] p-4"
            >
              <span className="font-orbiter flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                <Mail size={12} className="text-fg-brand" /> Owl-Post Email
              </span>
              <div className="flex items-center justify-between gap-2">
                <span
                  className="truncate text-sm font-semibold text-zinc-100"
                  title={email}
                >
                  {email}
                </span>
                {profile.is_bit && (
                  <span className="font-orbiter shrink-0 rounded-full border border-brand-border bg-brand-soft px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-fg-brand">
                    BIT
                  </span>
                )}
              </div>
            </motion.div>

            <motion.div
              variants={cardItem}
              className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/[0.02] p-4"
            >
              <span className="font-orbiter flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                <GraduationCap size={12} className="text-fg-brand" />{" "}
                Institution / College
              </span>
              <span className="text-sm font-semibold text-zinc-100">
                {profile.college || "Not provided"}
              </span>
            </motion.div>

            <motion.div
              variants={cardItem}
              className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/[0.02] p-4"
            >
              <span className="font-orbiter flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                <Phone size={12} className="text-fg-brand" /> Secure Dispatch
                Phone
              </span>
              <span className="text-sm font-semibold text-zinc-100">
                {profile.phone || "Not recorded yet"}
              </span>
            </motion.div>

            <motion.div
              variants={cardItem}
              className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/[0.02] p-4"
            >
              <span className="font-orbiter flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                <ShieldCheck size={12} className="text-fg-brand" /> House
                Affiliation
              </span>
              <span className="flex items-center gap-2 text-sm font-semibold capitalize text-zinc-100">
                {theme.name}
                {assignedHouse && (
                  <span className="rounded-full bg-brand-soft px-2 py-0.5 font-mono text-xs text-fg-brand">
                    {theme.initial}
                  </span>
                )}
              </span>
            </motion.div>

            <motion.div
              variants={cardItem}
              className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/[0.02] p-4"
            >
              <span className="font-orbiter flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                <CalendarDays size={12} className="text-fg-brand" /> Enrolled
                Since
              </span>
              <span className="text-sm font-semibold text-zinc-100">
                {registeredDate}
              </span>
            </motion.div>
          </motion.div>

          {/* Delegate UUID copy bar */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-brand-border bg-brand-soft/40 p-4 text-xs">
            <div className="min-w-0 flex-1">
              <span className="font-orbiter block text-[10px] uppercase tracking-widest text-zinc-400">
                Delegate Cipher / UUID
              </span>
              <span
                className="mt-0.5 block truncate font-mono text-zinc-100"
                title={userId}
              >
                {userId}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyId}
              className="font-orbiter flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-brand-border bg-[#0b0b10] px-3.5 py-2 text-xs font-medium text-fg-brand transition-colors hover:border-brand hover:bg-brand-soft"
            >
              {copiedId ? (
                <>
                  <Check size={14} className="text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </motion.section>

        {/* =========================================================
            CHAMBER PASSAGES & FESTIVAL SHORTCUTS
           ========================================================= */}
        <motion.section variants={fadeUpItem} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-orbiter text-[10px] font-semibold uppercase tracking-[0.22em] text-fg-brand">
                THE GRAND DIRECTORY
              </span>
              <h2 className="font-serif text-2xl text-zinc-100 sm:text-3xl">
                Festival Passages &amp; Quests
              </h2>
            </div>

            <span className="font-orbiter hidden text-xs text-zinc-500 sm:block">
              Direct portals to official chambers
            </span>
          </div>

          <motion.div
            variants={cardStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {assignedHouse && (
              <motion.div
                variants={cardItem}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
              >
                <Link
                  href="/common-room"
                  className="group relative flex h-full flex-col justify-between rounded-3xl border border-brand-border bg-brand-soft/35 p-6 text-left transition-all duration-300 hover:border-brand hover:bg-brand-soft/60 hover:shadow-glow-brand"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-brand-border bg-[#07070a]/70 text-fg-brand">
                        <BookOpen size={18} />
                      </span>

                      <span className="font-orbiter rounded-full border border-brand-border bg-[#07070a]/60 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest text-fg-brand">
                        3D Room
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-zinc-100 transition-colors group-hover:text-fg-brand">
                      Common Room
                    </h3>

                    <p className="text-xs leading-relaxed text-zinc-400">
                      Enter the dedicated full-viewport 3D chamber, inspect house
                      archives, notice boards, and member rolls.
                    </p>
                  </div>

                  <div className="font-orbiter mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-xs font-semibold text-fg-brand">
                    <span>Enter 3D Chamber</span>
                    <ArrowUpRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                </Link>
              </motion.div>
            )}

            {directoryLinks.map(({ href, label, detail, badge, Icon }) => (
              <motion.div
                key={href}
                variants={cardItem}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
              >
                <Link
                  href={href}
                  className="group relative flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:border-brand-border hover:bg-brand-soft/40 hover:shadow-glow-brand"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-brand-border bg-brand-soft text-fg-brand">
                        <Icon size={18} />
                      </span>

                      <span className="font-orbiter rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest text-zinc-400">
                        {badge}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-zinc-100 transition-colors group-hover:text-fg-brand">
                      {label}
                    </h3>

                    <p className="text-xs leading-relaxed text-zinc-400">
                      {detail}
                    </p>
                  </div>

                  <div className="font-orbiter mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-xs font-semibold text-fg-brand">
                    <span>Enter Chamber</span>
                    <ArrowUpRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* =========================================================
            BOTTOM CASTLE FOOTER & LOGOUT
           ========================================================= */}
        <motion.section
          variants={fadeUpItem}
          className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-brand-border bg-gradient-to-r from-white/[0.02] via-brand-soft/50 to-white/[0.02] p-6 shadow-md sm:flex-row sm:p-8"
        >
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand-border bg-brand-soft text-fg-brand sm:flex">
              <Sparkles size={22} />
            </div>

            <div>
              <span className="font-orbiter block text-[10px] font-semibold uppercase tracking-[0.22em] text-fg-brand">
                A NOTE FROM THE CASTLE
              </span>
              <p className="mt-0.5 font-serif text-xl italic text-zinc-100 sm:text-2xl">
                &ldquo;{theme.motto}&rdquo;
              </p>
            </div>
          </div>

          <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
            <Link
              href="/"
              className="font-orbiter rounded-xl border border-white/10 bg-white/[0.03] px-5 py-2.5 text-xs font-medium text-zinc-200 transition-colors hover:border-brand-border hover:bg-brand-soft"
            >
              Return Home
            </Link>

            <LogoutButton />
          </div>
        </motion.section>
      </motion.div>
    </main>
  );
}
