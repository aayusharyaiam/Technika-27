"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";

import LiquidGlass from "liquid-glass-react";

import { useHouse } from "@/components/house-provider";
// SUPABASE: browser-client helper (getSupabase returns null when auth isn't configured).
import { getSupabase } from "@/lib/supabase/client";

/* ================================================================== */
/* CONFIG: change routes here                                          */
/* ================================================================== */

type Child = { label: string; href: string; hint?: string };
type NavItem = { label: string; href?: string; children?: Child[] };

const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Marauder’s Map", href: "/marauders-map" },
  {
    label: "Registrations",
    children: [
      {
        label: "Event registry",
        href: "/events",
        hint: "Competitions and shows",
      },
      {
        label: "Merchandise",
        href: "/merchandise",
        hint: "The festival collection",
      },
      {
        label: "Accommodation",
        href: "/accommodation",
        hint: "Stays and delegate kit",
      },
    ],
  },
  {
    label: "Members",
    children: [
      {
        label: "Core team",
        href: "/core",
        hint: "The organising council",
      },
      {
        label: "Developers",
        href: "/devs",
        hint: "The site crew",
      },
      {
        label: "Alumni",
        href: "/alumni",
        hint: "Reunions and the network",
      },
    ],
  },
  { label: "Contact", href: "/contact" },
];

const AUTH = {
  signIn: "/login",
  register: "/registrations", // where "Register now" goes
  profile: "/profile",
  myRegistrations: "/profile/registrations",
  afterSignOut: "/",
};

/* ================================================================== */
/* Supabase                                                            */
/* ================================================================== */

function useSupabaseUser() {
  const supabase = useMemo(() => getSupabase(), []);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!alive) return;
      setUser(data.user ?? null);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => {
      alive = false;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  return { user, loading: loading && !!supabase, supabase };
}

type Profile = {
  name: string;
  first: string;
  email: string;
  avatar?: string;
  initials: string;
};

function profileOf(user: User): Profile {
  const m = (user.user_metadata ?? {}) as Record<string, unknown>;
  const name = String(
    m.full_name ?? m.name ?? user.email?.split("@")[0] ?? "Wizard",
  );
  return {
    name,
    first: name.split(" ")[0],
    email: user.email ?? "",
    avatar: (m.avatar_url ?? m.picture) as string | undefined,
    initials: name
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase(),
  };
}

/* ================================================================== */
/* small helpers + icons                                               */
/* ================================================================== */

const isActive = (pathname: string, href?: string) =>
  !!href &&
  (href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(href + "/"));

const groupActive = (pathname: string, item: NavItem) =>
  !!item.children?.some((c) => isActive(pathname, c.href));

function useDismiss(
  ref: { current: HTMLElement | null },
  active: boolean,
  onDismiss: () => void,
) {
  useEffect(() => {
    if (!active) return;
    const down = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onDismiss();
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("keydown", key);
    };
  }, [ref, active, onDismiss]);
}

const ChevronDown = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <path d="m2.5 4.5 3.5 3.5 3.5-3.5" />
  </svg>
);

const UserIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4.5 20.5c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5" />
  </svg>
);

const ArrowUpRight = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

/** Fallback crest (a golden snitch) when no logoSrc is given. */
function Crest({ size }: { size: number }) {
  const wing =
    "M29 31C22 20 12 16 4 20c5 2 10 7 16 11-5 0-9 2-12 6 8-1 15-2 21-3Z";
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <defs>
        <radialGradient id="tn-gold" cx="38%" cy="32%" r="75%">
          <stop offset="0" style={{ stopColor: "var(--primary-300)" }} />
          <stop offset=".55" style={{ stopColor: "var(--primary-500)" }} />
          <stop offset="1" style={{ stopColor: "var(--primary-800)" }} />
        </radialGradient>
        <linearGradient id="tn-wing" x1="0" x2="1">
          <stop
            offset="0"
            style={{ stopColor: "var(--primary-200)", stopOpacity: 0.9 }}
          />
          <stop
            offset="1"
            style={{ stopColor: "var(--primary-700)", stopOpacity: 0.7 }}
          />
        </linearGradient>
      </defs>
      <circle
        cx="32"
        cy="32"
        r="30"
        style={{ fill: "var(--bg-sunken)", stroke: "var(--primary-600)" }}
        strokeWidth="1.5"
      />
      <path d={wing} fill="url(#tn-wing)" />
      <path d={wing} fill="url(#tn-wing)" transform="matrix(-1 0 0 1 64 0)" />
      <circle cx="32" cy="33" r="7.5" fill="url(#tn-gold)" />
    </svg>
  );
}

function Avatar({ p, size }: { p: Profile; size: number }) {
  return p.avatar ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={p.avatar}
      alt=""
      loading="lazy"
      referrerPolicy="no-referrer"
      className="rounded-full object-cover ring-1 ring-brand/50"
      style={{ width: size, height: size }}
    />
  ) : (
    <span
      aria-hidden
      className="grid place-items-center rounded-full bg-brand-soft text-[12px] font-semibold text-fg-brand ring-1 ring-brand/50"
      style={{ width: size, height: size }}
    >
      {p.initials}
    </span>
  );
}

export const HOUSE_LOGOS: Record<string, string> = {
  gryffindor: "/images/gryffindor.png",
  slytherin: "/images/slytherin.png",
  ravenclaw: "/images/ravenclaw.png",
  hufflepuff: "/images/hufflepuff.png",
  default: "/images/hufflepuff.png",
};

const LINK =
  "relative inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.07em] outline-none transition-all duration-200 text-white/70 hover:text-white hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-ring/50 min-[1280px]:px-3.5 min-[1280px]:text-[11.5px]";

const MENU_ITEM =
  "block rounded-xl px-3 py-2 text-[12px] text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white";

const ActiveDot = () => (
  <span
    aria-hidden
    className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-brand shadow-[0_0_8px_var(--brand)]"
  />
);

function RegisterButton({
  href,
  className = "",
  onClick,
}: {
  href: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group relative inline-flex shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full border border-brand/35 bg-brand-soft px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-fg-brand shadow-[0_0_18px_color-mix(in_oklab,var(--brand)_14%,transparent)] outline-none transition-all duration-300 hover:scale-[1.03] hover:border-brand/60 hover:bg-brand/20 hover:shadow-[0_0_24px_color-mix(in_oklab,var(--brand)_26%,transparent)] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring/50 min-[1280px]:px-4.5 min-[1280px]:py-2 min-[1280px]:text-[11.5px] ${className}`}
    >
      <span className="relative">
        Register<span className="max-[1180px]:hidden"> now</span>
      </span>
      <ArrowUpRight className="relative h-3 w-3 text-fg-brand/90 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}

/* ================================================================== */
/* The three-book hamburger                                            */
/* ================================================================== */

type BurgerState = "idle" | "open" | "close";

function BookBurger({
  state,
  onClick,
  controls,
}: {
  state: BurgerState;
  onClick: () => void;
  controls: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-state={state}
      aria-label={state === "open" ? "Close menu" : "Open menu"}
      aria-expanded={state === "open"}
      aria-controls={controls}
      className="tn-burger relative -mr-1 h-12 w-14 shrink-0 rounded-2xl outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring min-[901px]:hidden"
    >
      <span aria-hidden className="tn-book tn-b1" />
      <span aria-hidden className="tn-book tn-b2" />
      <span aria-hidden className="tn-book tn-b3" />
    </button>
  );
}

/* Icon box is 56 x 48. Books are 30 x 8 with 2px gaps; the floor is y = 44.
   The top book ends at translate(20.7px, 8.5px) rotate(72deg): standing on its end,
   leaning against the top-right corner of the middle book.
   The fall is staged like real physics: slide off the stack -> slow tip over the
   corner -> accelerating free fall -> impact slap -> damped rocking to rest. */
const CSS = `
.tn-book{position:absolute;border-radius:2px 3px 3px 2px;transform-origin:50% 50%;
   background:
     radial-gradient(circle at 18% 62%,color-mix(in srgb,var(--brand) 75%,transparent) 0 1.1px,transparent 1.7px),
     radial-gradient(circle at 71% 28%,color-mix(in srgb,var(--brand-active) 70%,transparent) 0 1px,transparent 1.6px),
     linear-gradient(90deg,transparent 36%,color-mix(in srgb,var(--fg-accent) 55%,transparent) 36% 64%,transparent 64%) 0 50%/100% 1px no-repeat,
     linear-gradient(180deg,color-mix(in srgb,var(--fg-brand) 30%,transparent),color-mix(in srgb,var(--fg-brand) 0%,transparent) 40%,color-mix(in srgb,var(--bg-sunken) 38%,transparent)),
     var(--book);
   box-shadow:inset 0 0 0 .5px color-mix(in srgb,var(--bg-sunken) 55%,transparent),0 1px 1.5px color-mix(in srgb,var(--bg-sunken) 60%,transparent)}
.tn-book::before,.tn-book::after{content:"";position:absolute;top:0;bottom:0;width:2px;
  background:linear-gradient(180deg,var(--fg-brand),var(--brand-active));opacity:.85}
.tn-book::before{left:5px}.tn-book::after{right:5px}
.tn-b1{left:8px;top:36px;width:30px;height:8px;--book:var(--brand-active);--thud:.8px}
.tn-b2{left:9px;top:26px;width:28px;height:8px;--book:var(--primary-800);--thud:1.6px}
.tn-b3{left:7px;top:16px;width:30px;height:8px;--book:var(--primary-600);transition:transform .25s ease}
.tn-burger[data-state="idle"]:hover .tn-b3{transform:translate(1px,-1.5px) rotate(-2.5deg)}
.tn-burger[data-state="open"] .tn-b3{animation:tn-fall 1.05s both}
.tn-burger[data-state="close"] .tn-b3{animation:tn-rise .9s both}
.tn-burger[data-state="open"] .tn-b1,.tn-burger[data-state="open"] .tn-b2{animation:tn-thud 1.05s both}

@keyframes tn-fall{
  0%{transform:translate(0,0) rotate(0);animation-timing-function:ease-out}
  12%{transform:translate(2.5px,-1px) rotate(-3deg);animation-timing-function:ease-in-out}
  24%{transform:translate(7px,-.5px) rotate(3deg);animation-timing-function:ease-in}
  34%{transform:translate(11.5px,1px) rotate(12deg);animation-timing-function:ease-in}
  43%{transform:translate(15px,2.6px) rotate(27deg);animation-timing-function:ease-in}
  51%{transform:translate(17.5px,4.8px) rotate(46deg);animation-timing-function:ease-in}
  58%{transform:translate(19.5px,6.9px) rotate(64deg);animation-timing-function:ease-in}
  64%{transform:translate(20.9px,8.3px) rotate(80deg);animation-timing-function:ease-in}
  68%{transform:translate(21.6px,8.9px) rotate(88deg);animation-timing-function:ease-out}
  76%{transform:translate(21.8px,8.3px) rotate(62deg);animation-timing-function:ease-in-out}
  85%{transform:translate(21.1px,8.6px) rotate(79deg);animation-timing-function:ease-out}
  92%{transform:translate(20.8px,8.5px) rotate(68deg);animation-timing-function:ease-in-out}
  100%{transform:translate(20.7px,8.5px) rotate(72deg)}
}
@keyframes tn-rise{
  0%{transform:translate(20.7px,8.5px) rotate(72deg);animation-timing-function:ease-in-out}
  8%{transform:translate(20.8px,8.5px) rotate(68deg);animation-timing-function:ease-in-out}
  15%{transform:translate(21.1px,8.6px) rotate(79deg);animation-timing-function:ease-in-out}
  24%{transform:translate(21.8px,8.3px) rotate(62deg);animation-timing-function:ease-out}
  32%{transform:translate(21.6px,8.9px) rotate(88deg);animation-timing-function:ease-in}
  36%{transform:translate(20.9px,8.3px) rotate(80deg);animation-timing-function:ease-out}
  42%{transform:translate(19.5px,6.9px) rotate(64deg);animation-timing-function:ease-out}
  49%{transform:translate(17.5px,4.8px) rotate(46deg);animation-timing-function:ease-out}
  57%{transform:translate(15px,2.6px) rotate(27deg);animation-timing-function:ease-out}
  66%{transform:translate(11.5px,1px) rotate(12deg);animation-timing-function:ease-out}
  76%{transform:translate(7px,-.5px) rotate(3deg);animation-timing-function:ease-in-out}
  88%{transform:translate(2.5px,-1px) rotate(-3deg);animation-timing-function:ease-in-out}
  100%{transform:translate(0,0) rotate(0)}
}
@keyframes tn-thud{
  0%,66%{transform:none}
  72%{transform:translateY(var(--thud))}
  80%{transform:translateY(calc(var(--thud) * -.4))}
  88%,100%{transform:none}
}

@keyframes tn-pop{from{opacity:0;transform:translateY(-6px) scale(.98)}to{opacity:1;transform:none}}
.tn-pop{animation:tn-pop .16s ease-out both}
@keyframes tn-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.tn-in{animation:tn-in .35s ease-out both}

@media (prefers-reduced-motion:reduce){
  .tn-book,.tn-pop,.tn-in{animation-duration:.01ms!important;animation-delay:0s!important;transition:none!important}
}

.liquid-nav-container{perspective:1000px}
.premium-dark-glass {
  position: relative;
  background: linear-gradient(135deg, rgba(14, 16, 26, 0.58) 0%, rgba(8, 9, 15, 0.48) 100%) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-top: 1px solid rgba(255, 255, 255, 0.22) !important;
  box-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.16),
    0 16px 38px -10px rgba(0, 0, 0, 0.75) !important;
  border-radius: 9999px !important;
}
.liquid-nav-container .glass{
  display:flex!important;width:100%!important;height:100%!important;
  align-items:center!important;justify-content:space-between!important;
  overflow:visible!important;border-radius:9999px!important;
  border:none!important;background:transparent!important;box-shadow:none!important;
}
.liquid-nav-container .glass > div:last-child{
  width:100%!important;height:100%!important;display:flex!important;
  align-items:center!important;justify-content:space-between!important;
  font:inherit!important;text-shadow:none!important;color:inherit!important;
}
.liquid-nav-container .glass__warp{
  border-radius:9999px!important;
}
`;

/* ================================================================== */
/* Desktop                                                             */
/* ================================================================== */

function DesktopNav({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState<string | null>(null);
  const ref = useRef<HTMLUListElement>(null);
  const viaHover = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const close = useCallback(() => setOpen(null), []);

  useDismiss(ref, open !== null, close);

  const cancel = () => {
    if (timer.current) clearTimeout(timer.current);
  };

  return (
    <ul ref={ref} className="flex items-center gap-0.5 sm:gap-1">
      {NAV.map((item) => {
        const active = item.href
          ? isActive(pathname, item.href)
          : groupActive(pathname, item);

        if (!item.children) {
          const cls = `${LINK} ${active ? "text-fg-brand font-semibold bg-white/[0.08]" : "text-white/70 hover:text-white hover:bg-white/[0.05]"}`;
          return (
            <li key={item.label}>
              <Link
                href={item.href!}
                className={cls}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
                {active && <ActiveDot />}
              </Link>
            </li>
          );
        }

        const isOpen = open === item.label;
        const isHighlighted = active || isOpen;
        const btnCls = `${LINK} ${isHighlighted ? "text-fg-brand font-semibold bg-white/[0.08]" : "text-white/70 hover:text-white hover:bg-white/[0.05]"}`;
        return (
          <li
            key={item.label}
            className="relative"
            onMouseEnter={() => {
              cancel();
              viaHover.current = true;
              setOpen(item.label);
            }}
            onMouseLeave={() => {
              viaHover.current = false;
              cancel();
              timer.current = setTimeout(close, 140);
            }}
          >
            <button
              type="button"
              className={btnCls}
              aria-expanded={isOpen}
              aria-haspopup="true"
              onClick={() => {
                // a tap on touch screens fires mouseenter first; don't toggle it straight back shut
                if (viaHover.current) {
                  viaHover.current = false;
                  setOpen(item.label);
                  return;
                }
                setOpen((o) => (o === item.label ? null : item.label));
              }}
            >
              {item.label}
              <ChevronDown
                className={`h-2.5 w-2.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
              {active && <ActiveDot />}
            </button>

            {isOpen && (
              <div className="absolute left-1/2 top-full z-10 w-60 -translate-x-1/2 pt-2.5">
                <ul className="tn-pop rounded-2xl border border-white/10 bg-[#0a0b12]/92 p-1.5 shadow-[0_20px_45px_rgba(0,0,0,0.85)] backdrop-blur-2xl">
                  {item.children.map((c) => (
                    <li key={c.href}>
                      <Link
                        href={c.href}
                        onClick={close}
                        className="block rounded-xl px-3 py-2 transition-colors hover:bg-white/[0.08]"
                      >
                        <span
                          className={`block text-[12px] font-medium tracking-wide ${isActive(pathname, c.href) ? "text-fg-brand font-semibold" : "text-white/85"}`}
                        >
                          {c.label}
                        </span>
                        {c.hint && (
                          <span className="block text-[10px] text-white/45">
                            {c.hint}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function ProfileMenu({
  profile,
  onSignOut,
}: {
  profile: Profile;
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-1 pr-2.5 outline-none transition-colors hover:border-brand/40 hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Avatar p={profile} size={28} />
        <span className="max-w-[6.5rem] truncate text-[11px] font-medium text-fg-brand/90 max-[1180px]:hidden">
          {profile.first}
        </span>
        <ChevronDown
          className={`h-2.5 w-2.5 text-white/50 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-10 w-64 pt-2.5">
          <div className="tn-pop rounded-2xl border border-white/10 bg-[#0a0b12]/92 p-2 shadow-[0_20px_45px_rgba(0,0,0,0.85)] backdrop-blur-2xl">
            <div className="flex items-center gap-2.5 px-2.5 py-2">
              <Avatar p={profile} size={36} />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-white">
                  {profile.name}
                </p>
                <p className="truncate text-[11px] text-white/50">
                  {profile.email}
                </p>
              </div>
            </div>
            <div className="my-1.5 h-px bg-white/10" />
            <Link href="/dashboard" onClick={close} className={MENU_ITEM}>
              Dashboard
            </Link>
            <Link href={AUTH.profile} onClick={close} className={MENU_ITEM}>
              My profile
            </Link>
            <Link
              href={AUTH.myRegistrations}
              onClick={close}
              className={MENU_ITEM}
            >
              My registrations
            </Link>
            <div className="my-1.5 h-px bg-white/10" />
            <button
              type="button"
              onClick={() => {
                close();
                onSignOut();
              }}
              className="block w-full rounded-xl px-3 py-2 text-left text-[12px] text-red-400 transition-colors hover:bg-red-500/10"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/* Mobile panel                                                        */
/* ================================================================== */

function MobilePanel(props: {
  id: string;
  open: boolean;
  pathname: string;
  loading: boolean;
  profile: Profile | null;
  registerHref: string;
  onNavigate: () => void;
  onSignOut: () => void;
}) {
  const {
    id,
    open,
    pathname,
    loading,
    profile,
    registerHref,
    onNavigate,
    onSignOut,
  } = props;
  const [group, setGroup] = useState<string | null>(null);

  let i = 0;
  const stagger = () => ({ animationDelay: `${80 + i++ * 45}ms` });
  const row =
    "flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-[12px] font-medium uppercase tracking-[0.08em] transition-colors";

  return (
    <div
      id={id}
      className={`grid transition-[grid-template-rows,opacity,visibility] duration-300 ease-out min-[901px]:hidden ${
        open
          ? "visible mt-2 grid-rows-[1fr] opacity-100"
          : "invisible grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="min-h-0 overflow-hidden">
        <nav
          aria-label="Mobile"
          className="max-h-[calc(100dvh-6.5rem)] overflow-y-auto overscroll-contain rounded-3xl border border-white/10 bg-[#0a0b12]/95 p-3.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] backdrop-blur-3xl"
        >
          <ul className="space-y-1">
            {NAV.map((item) => {
              const active = item.href
                ? isActive(pathname, item.href)
                : groupActive(pathname, item);
              const tone = active
                ? "bg-white/[0.08] text-fg-brand font-semibold"
                : "text-white/70 hover:bg-white/[0.04] hover:text-white";

              if (!item.children) {
                return (
                  <li
                    key={item.label}
                    className={open ? "tn-in" : ""}
                    style={stagger()}
                  >
                    <Link
                      href={item.href!}
                      onClick={onNavigate}
                      className={`${row} ${tone}`}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                      {active && (
                        <span
                          aria-hidden
                          className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_8px_var(--brand)]"
                        />
                      )}
                    </Link>
                  </li>
                );
              }

              const expanded = group === item.label;
              return (
                <li
                  key={item.label}
                  className={open ? "tn-in" : ""}
                  style={stagger()}
                >
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setGroup(expanded ? null : item.label)}
                    className={`${row} ${tone}`}
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                    />
                  </button>
                  {expanded && (
                    <ul className="tn-pop ml-3 space-y-1 border-l border-white/10 pl-2">
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link
                            href={c.href}
                            onClick={onNavigate}
                            className={`block rounded-lg px-3 py-2 text-xs transition-colors hover:text-white ${
                              isActive(pathname, c.href)
                                ? "text-fg-brand font-medium"
                                : "text-white/60"
                            }`}
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

          <div
            className={`mt-3 space-y-2 border-t border-white/10 pt-3 ${open ? "tn-in" : ""}`}
            style={stagger()}
          >
            {loading ? (
              <div className="h-12 animate-pulse rounded-2xl bg-white/10" />
            ) : profile ? (
              <>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <Avatar p={profile} size={42} />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-white">
                      {profile.name}
                    </p>
                    <p className="truncate text-[11px] text-white/50">
                      {profile.email}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/dashboard"
                    onClick={onNavigate}
                    className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5 text-center text-[12px] text-white/70 hover:border-white/20 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href={AUTH.profile}
                    onClick={onNavigate}
                    className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5 text-center text-[12px] text-white/70 hover:border-white/20 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    My profile
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={AUTH.myRegistrations}
                    onClick={onNavigate}
                    className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5 text-center text-[12px] text-white/70 hover:border-white/20 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    Registrations
                  </Link>
                  <Link
                    href="/common-room"
                    onClick={onNavigate}
                    className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5 text-center text-[12px] text-white/70 hover:border-white/20 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    Common room
                  </Link>
                </div>
                <RegisterButton
                  href={registerHref}
                  onClick={onNavigate}
                  className="w-full py-3"
                />
                <button
                  type="button"
                  onClick={onSignOut}
                  className="w-full rounded-xl px-3 py-2 text-center text-[12px] text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href={AUTH.signIn}
                  onClick={onNavigate}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2.5 text-[11.5px] font-medium text-white/80 hover:text-white hover:bg-white/[0.08] hover:border-white/25 transition-all"
                >
                  <UserIcon className="h-4 w-4 opacity-75" />
                  Common room
                </Link>
                <RegisterButton
                  href={registerHref}
                  onClick={onNavigate}
                  className="py-2.5"
                />
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}

/* ================================================================== */
/* The navbar                                                          */
/* ================================================================== */

export interface TechnikaNavbarProps {
  title?: string;
  subtitle?: string;
  logoSrc?: string;
  titleClassName?: string;
  className?: string;
}

export default function TechnikaNavbar({
  logoSrc,
  className = "",
}: TechnikaNavbarProps) {
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const router = useRouter();
  const panelId = useId();
  const { house } = useHouse();
  const { user, loading, supabase } = useSupabaseUser();
  const profile = useMemo(() => (user ? profileOf(user) : null), [user]);

  const [burger, setBurger] = useState<BurgerState>("idle");
  const menuOpen = burger === "open";
  const toggleMenu = useCallback(
    () => setBurger((b) => (b === "open" ? "close" : "open")),
    [],
  );
  const closeMenu = useCallback(
    () => setBurger((b) => (b === "open" ? "close" : b)),
    [],
  );

  const registerHref =
    user || loading
      ? AUTH.register
      : `${AUTH.signIn}?next=${encodeURIComponent(AUTH.register)}`;

  const onSignOut = useCallback(async () => {
    await supabase?.auth.signOut();
    closeMenu();
    router.push(AUTH.afterSignOut);
    router.refresh();
  }, [supabase, closeMenu, router]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMenu();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, closeMenu]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 901px)");
    const onChange = (e: MediaQueryListEvent) => e.matches && setBurger("idle");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const activeLogo =
    logoSrc && logoSrc !== "/images/crest.webp"
      ? logoSrc
      : HOUSE_LOGOS[house] || "/images/hufflepuff.png";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {menuOpen && (
        <div
          aria-hidden="true"
          onClick={closeMenu}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm pointer-events-auto min-[901px]:hidden"
        />
      )}

      <header
        className={`fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4 pointer-events-none ${className}`}
      >
        <div className="pointer-events-auto mx-auto w-[94%] sm:w-[86%] lg:w-[70%] max-w-[1150px]">
          <div className="relative h-14 sm:h-15 min-[901px]:h-[58px] min-[1280px]:h-[62px] w-full liquid-nav-container">
            <LiquidGlass
              cornerRadius={999}
              blurAmount={0.03}
              displacementScale={40}
              saturation={120}
              aberrationIntensity={1.2}
              elasticity={0.12}
              padding="0px"
              mode="standard"
              className="w-full h-full premium-dark-glass"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "100%",
                height: "100%",
              }}
            >
              <div className="flex h-full w-full items-center justify-between gap-2 sm:gap-3 px-3.5 sm:px-4">
                {/* brand logo - only logo routes to / */}
                <Link
                  href="/"
                  aria-label="Technika Home"
                  className="group relative flex shrink-0 items-center outline-none transition-transform duration-300 hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Image
                    src={activeLogo}
                    alt="Technika"
                    width={44}
                    height={44}
                    priority
                    className="h-9 w-9 sm:h-10 sm:w-10 min-[1280px]:h-11 min-[1280px]:w-11 object-contain drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)] transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>

                {/* desktop links */}
                <nav
                  aria-label="Primary"
                  className="hidden min-w-0 flex-1 justify-center min-[901px]:flex"
                >
                  <DesktopNav key={pathname} pathname={pathname} />
                </nav>

                {/* desktop right actions */}
                <div className="hidden shrink-0 items-center gap-2.5 min-[901px]:flex">
                  {loading ? (
                    <div className="h-8 w-20 animate-pulse rounded-full bg-white/10" />
                  ) : profile ? (
                    <ProfileMenu profile={profile} onSignOut={onSignOut} />
                  ) : (
                    <>
                      <Link
                        href={AUTH.signIn}
                        aria-label="Sign in to the common room"
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-medium tracking-wide text-white/70 outline-none transition-colors hover:text-white hover:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-ring/50"
                      >
                        <UserIcon className="h-3.5 w-3.5 opacity-70" />
                        <span className="max-[1180px]:hidden">Common room</span>
                      </Link>
                      <RegisterButton href={registerHref} />
                    </>
                  )}
                </div>

                {/* mobile hamburger: three old books */}
                <div className="flex shrink-0 items-center min-[901px]:hidden">
                  <BookBurger
                    state={burger}
                    onClick={toggleMenu}
                    controls={panelId}
                  />
                </div>
              </div>
            </LiquidGlass>
          </div>

          <MobilePanel
            key={`${pathname}-${menuOpen ? "open" : "closed"}`}
            id={panelId}
            open={menuOpen}
            pathname={pathname}
            loading={loading}
            profile={profile}
            registerHref={registerHref}
            onNavigate={closeMenu}
            onSignOut={onSignOut}
          />
        </div>
      </header>
    </>
  );
}
