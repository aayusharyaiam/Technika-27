"use client";

import Link from "next/link";
import { ArrowUpRight, BookOpen, CalendarDays, CheckCircle2, Compass, Sparkles, UserRound } from "lucide-react";
import { useHouse } from "@/components/house-provider";
import { HouseCrest } from "@/components/house-crest";
import { houseThemes, houseFromValue } from "@/lib/houses";
import LogoutButton from "./logout-button";

type DashboardProfile = {
  full_name: string | null;
  college: string | null;
  phone: string | null;
  house: string | null;
};

type DashboardClientProps = {
  email: string;
  profile: DashboardProfile | null;
};

const actionCards = [
  { href: "/registrations", label: "Explore registrations", detail: "See the four house tracks and festival timeline.", Icon: CalendarDays },
  { href: "/marauders-map", label: "Open the map", detail: "Browse the event directory and build your itinerary.", Icon: Compass },
  { href: "/account", label: "Visit common room", detail: "Open your saved-house note and account controls.", Icon: BookOpen },
];

export default function DashboardClient({ email, profile }: DashboardClientProps) {
  const { house } = useHouse();
  const selectedHouse = houseFromValue(house) || houseFromValue(profile?.house) || "default";
  const theme = houseThemes[selectedHouse];
  const displayName = profile?.full_name?.trim() || "wizard";
  const firstName = displayName.split(/\s+/)[0];

  if (!profile) {
    return (
      <main className="min-h-[calc(100svh-5rem)] bg-bg px-5 pb-24 pt-32 text-fg sm:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-brand-border bg-surface p-8 text-center shadow-glow-brand sm:p-14">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-soft text-fg-brand">
            <Sparkles size={26} />
          </span>
          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.25em] text-fg-brand">The profile ledger</p>
          <h1 className="mt-4 font-serif text-4xl text-fg-strong sm:text-6xl">Your dashboard is <em>almost ready.</em></h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-fg-muted">We could not find a profile row for this account yet. Your session is valid, but the profile service needs to finish preparing your common room.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="button button-gold">Return to the festival <ArrowUpRight size={15} /></Link>
            <LogoutButton />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100svh-5rem)] bg-bg px-5 pb-24 pt-32 text-fg sm:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-[2rem] border border-brand-border bg-surface p-6 shadow-glow-brand sm:p-10 lg:p-14" style={{ backgroundImage: "var(--gradient-hero)" }}>
          <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-brand-soft blur-3xl" aria-hidden="true" />
          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <div>
              <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-fg-brand"><Sparkles size={13} /> Member dashboard</p>
              <h1 className="mt-5 max-w-3xl font-serif text-5xl leading-[0.95] text-fg-strong sm:text-7xl">Welcome back, <em>{firstName}.</em></h1>
              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-fg-muted sm:text-base">Your Technika command centre is ready. Keep your profile close, follow the festival trail, and let your house colours guide the next chapter.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/registrations" className="button button-gold">Explore the festival <ArrowUpRight size={15} /></Link>
                <Link href="/account" className="button button-glass">Open common room <BookOpen size={15} /></Link>
              </div>
            </div>

            <div className="rounded-2xl border border-brand/30 bg-bg/45 p-5 backdrop-blur-md sm:p-6">
              <div className="flex items-center gap-4">
                {selectedHouse === "default" ? (
                  <span className="grid h-16 w-14 place-items-center rounded-xl border border-brand/35 bg-brand-soft font-serif text-2xl text-fg-brand">T</span>
                ) : (
                  <HouseCrest house={selectedHouse} />
                )}
                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-fg-subtle">Your current colours</p>
                  <h2 className="mt-1 truncate font-serif text-3xl text-fg-strong">{theme.name}</h2>
                  <p className="mt-1 text-xs text-fg-muted">{theme.quality}</p>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-2 border-t border-line-subtle pt-4 text-xs text-fg-muted">
                <CheckCircle2 size={14} className="text-fg-brand" />
                <span>Theme preference is synced with your profile.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
          <article className="rounded-[1.5rem] border border-line bg-surface p-6 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-fg-brand">Profile ledger</p>
                <h2 className="mt-2 font-serif text-3xl text-fg-strong">Your details.</h2>
              </div>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-soft text-fg-brand"><UserRound size={18} /></span>
            </div>
            <dl className="mt-7 grid gap-4">
              <div className="border-b border-line-subtle pb-3"><dt className="text-[9px] uppercase tracking-[0.16em] text-fg-subtle">Email</dt><dd className="mt-1 truncate text-sm text-fg-strong">{email}</dd></div>
              <div className="border-b border-line-subtle pb-3"><dt className="text-[9px] uppercase tracking-[0.16em] text-fg-subtle">College</dt><dd className="mt-1 text-sm text-fg-strong">{profile.college || "Not added yet"}</dd></div>
              <div><dt className="text-[9px] uppercase tracking-[0.16em] text-fg-subtle">Phone</dt><dd className="mt-1 text-sm text-fg-strong">{profile.phone || "Not added yet"}</dd></div>
            </dl>
          </article>

          <article className="rounded-[1.5rem] border border-line bg-surface p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-fg-brand">Continue your journey</p>
                <h2 className="mt-2 font-serif text-3xl text-fg-strong">Choose your next passage.</h2>
              </div>
              <span className="hidden text-4xl text-fg-brand/60 sm:block">✧</span>
            </div>
            <div className="mt-6 grid gap-3">
              {actionCards.map(({ href, label, detail, Icon }) => (
                <Link key={href} href={href} className="group flex items-center gap-4 rounded-xl border border-line-subtle bg-bg/30 p-4 transition-colors hover:border-brand/40 hover:bg-brand-soft">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-soft text-fg-brand"><Icon size={17} /></span>
                  <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-fg-strong">{label}</span><span className="mt-1 block text-xs leading-relaxed text-fg-muted">{detail}</span></span>
                  <ArrowUpRight size={16} className="shrink-0 text-fg-subtle transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg-brand" />
                </Link>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-6 flex flex-col gap-5 rounded-[1.5rem] border border-brand-border bg-brand-soft p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-fg-brand">A note from the castle</p>
            <p className="mt-2 max-w-2xl font-serif text-2xl text-fg-strong">{theme.motto}</p>
          </div>
          <LogoutButton />
        </section>
      </div>
    </main>
  );
}
