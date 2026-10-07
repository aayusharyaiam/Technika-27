"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { navigation } from "@/lib/festival";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); menuButton.current?.focus(); }
      if (event.key === "Tab") {
        const links = menuRef.current?.querySelectorAll<HTMLAnchorElement>("a");
        if (!links?.length) return;
        const first = links[0];
        const last = links[links.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); menuButton.current?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); menuButton.current?.focus(); }
        else if (document.activeElement === menuButton.current) { event.preventDefault(); (event.shiftKey ? last : first).focus(); }
      }
    };
    window.addEventListener("keydown", keydown);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", keydown); };
  }, [open]);

  return (
    <header className="header-wrap">
      <nav className="main-nav" aria-label="Main navigation">
        <Link href="/" className="brand" onClick={() => setOpen(false)} aria-label="Technika 27 home">
          <Image src="/images/crest.webp" width={48} height={48} alt="" priority />
          <span>TECHNIKA <b>’27</b><small>BIT PATNA CHAPTER</small></span>
        </Link>
        <div className="desktop-links">
          {navigation.map((item) => <div className="nav-item" key={item.href}>
            <Link className={`nav-link ${pathname === item.href ? "active" : ""}`} href={item.href} aria-current={pathname === item.href ? "page" : undefined}>{item.label}{item.dropdown && <ChevronDown size={10} />}</Link>
            {item.dropdown && <div className="nav-dropdown">
              <Link href={item.href}>{item.label === "Registrations" ? "The four houses" : item.label === "Members" ? "Meet the order" : "Hall of legacies"}<ArrowUpRight size={14} /></Link>
              <Link href={`${item.href}#${item.label === "Members" ? "order" : item.label === "Alumni" ? "memories" : "houses"}`}>{item.label === "Registrations" ? "Explore your track" : item.label === "Members" ? "The inner sanctum" : "Pensieve archives"}<ArrowUpRight size={14} /></Link>
            </div>}
          </div>)}
        </div>
        <Link href="/registrations" className="button button-gold nav-cta">Register now <ArrowUpRight size={13} /></Link>
        <button ref={menuButton} className="mobile-menu-button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X size={21} /> : <Menu size={21} />}</button>
      </nav>
      {open && <div ref={menuRef} id="mobile-navigation" className="mobile-navigation" data-lenis-prevent>
        <span className="eyebrow">The Marauder’s Map</span>
        {navigation.map((item, index) => <Link href={item.href} key={item.href} className={pathname === item.href ? "active" : ""} aria-current={pathname === item.href ? "page" : undefined} onClick={() => setOpen(false)}><span><small>0{index + 1}</small>{item.label}</span><ArrowUpRight size={19} /></Link>)}
        <p>All paths lead to a little magic.</p>
      </div>}
    </header>
  );
}
