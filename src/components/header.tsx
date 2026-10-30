"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, UserRound } from "lucide-react";
import { navigation } from "@/lib/festival";
import { houseLogoFor } from "@/lib/houses";
import { useAuth } from "./auth-provider";
import { useHouse } from "./house-provider";
import { useMagic } from "./experience";

const navLinkBase =
  "nav-link !text-fg-muted hover:!text-fg-brand focus-visible:!text-fg-brand focus-visible:ring-2 focus-visible:ring-ring before:!bg-gradient-to-r before:!from-transparent before:!via-brand before:!to-transparent";
const dropdownLink =
  "!text-fg-muted hover:!bg-brand-soft hover:!text-fg-strong focus-visible:ring-2 focus-visible:ring-ring";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { house, theme } = useHouse();
  const { ready } = useMagic();
  const visibleNavigation = navigation.filter(
    (item) => !item.authOnly || Boolean(user),
  );

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
      if (event.key === "Tab") {
        const links = menuRef.current?.querySelectorAll<HTMLAnchorElement>("a");
        if (!links?.length) return;
        const first = links[0];
        const last = links[links.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          menuButton.current?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          menuButton.current?.focus();
        } else if (document.activeElement === menuButton.current) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
        }
      }
    };
    window.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", keydown);
    };
  }, [open]);

  return (
    <header
      className={`
    header-wrap site-header
    fixed inset-x-0 top-5 z-50
    pointer-events-none
    transition-[opacity,transform,filter]
    duration-1000 ease-out
    ${
      ready
        ? "header-ready opacity-100 translate-y-0"
        : "header-waiting opacity-0 -translate-y-[18px]"
    }
  `}
      data-arrival-ready={ready ? "true" : "false"}
    >
      <nav
        className="main-nav"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="brand rounded-full focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => setOpen(false)}
          aria-label="Technika 2K26 home"
        >
          <Image
            src={houseLogoFor(house)}
            width={48}
            height={48}
            alt=""
            priority
            className="h-12 w-12 object-contain ring-1 ring-brand/30"
            data-house-logo={house}
          />
          <span className="!text-fg-brand">
            TECHNIKA <b className="font-normal">2K26</b>
            <small className="!text-fg-subtle">BIT PATNA CHAPTER</small>
          </span>
        </Link>
        <div className="desktop-links">
          {visibleNavigation.map((item) => (
            <div className="nav-item" key={item.href}>
              <Link
                className={`${navLinkBase} ${pathname === item.href ? "active !text-fg-brand after:!bg-brand after:!shadow-[0_0_7px_var(--brand)]" : ""}`}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.label}
                {item.dropdown && <ChevronDown size={10} />}
              </Link>
              {item.dropdown && (
                <div className="nav-dropdown before:!border-brand/30 before:!bg-surface/95">
                  {item.children?.map((child) => (
                    <Link
                      href={child.href}
                      key={child.href}
                      className={dropdownLink}
                    >
                      {child.label}
                      <ArrowUpRight size={14} />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        {!user && (
          <Link
            href="/login"
            className="nav-account !text-fg-brand hover:!bg-brand-soft hover:!text-fg-strong focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Sign in"
          >
            <UserRound size={15} />
            <span>Sign in</span>
            {house !== "default" && (
              <small className="!border-brand !text-fg-brand">
                {theme.initial}
              </small>
            )}
          </Link>
        )}
        <Link
          href={user ? "/registrations" : "/signup"}
          className="nav-cta button button-gold"
        >
          {user ? "Register now" : "Join the magic"} <ArrowUpRight size={16} />
        </Link>
        <button
          ref={menuButton}
          type="button"
          className="mobile-menu-button !text-fg-brand hover:!bg-brand-soft focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          <span className={`book-menu-icon ${open ? "is-open" : ""}`} aria-hidden="true">
            <span className="book book-bottom" />
            <span className="book book-middle" />
            <span className="book book-top" />
          </span>
        </button>
      </nav>
      {open && (
        <div
          ref={menuRef}
          id="mobile-navigation"
          className="mobile-navigation !border-brand/30 !bg-surface/95 !shadow-lg"
          data-lenis-prevent
        >
          <span className="eyebrow !text-fg-brand">The Marauder’s Map</span>
          {visibleNavigation.map((item, index) => (
            <span
              key={item.href}
              className="mobile-navigation-group !border-line-subtle"
            >
              <Link
                href={item.href}
                className={`!text-fg-strong hover:!text-fg-brand ${pathname === item.href ? "active !text-fg-brand" : ""}`}
                aria-current={pathname === item.href ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                <span>
                  <small className="!text-fg-subtle">0{index + 1}</small>
                  {item.label}
                </span>
                <ArrowUpRight size={19} className="!text-fg-brand" />
              </Link>
              {item.children?.map((child) => (
                <Link
                  href={child.href}
                  key={child.href}
                  className="mobile-subnav !border-line-subtle !text-fg-muted hover:!text-fg-brand"
                  onClick={() => setOpen(false)}
                >
                  <span>{child.label}</span>
                  <ArrowUpRight size={15} className="!text-fg-brand" />
                </Link>
              ))}
            </span>
          ))}
          {!user && (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="!border-line-subtle !text-fg-strong hover:!text-fg-brand"
            >
              <span>
                <UserRound size={17} className="!text-fg-brand" />
                Sign in / Sign up
              </span>
              <ArrowUpRight size={19} className="!text-fg-brand" />
            </Link>
          )}
          <p className="!text-fg-subtle">All paths lead to a little magic.</p>
        </div>
      )}
    </header>
  );
}
