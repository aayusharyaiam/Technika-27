"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarPlus, Check, LockKeyhole } from "lucide-react";
import { festival } from "@/lib/festival";

function getTimeRemaining() {
  const seconds = Math.max(0, Math.floor((new Date(festival.start).getTime() - Date.now()) / 1000));
  return [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
}

export function Countdown({ compact = false }: { compact?: boolean }) {
  const [remaining, setRemaining] = useState<number[] | null>(null);
  useEffect(() => {
    const tick = () => setRemaining(getTimeRemaining());
    const first = window.setTimeout(tick, 0);
    const timer = window.setInterval(tick, 1000);
    return () => { window.clearTimeout(first); window.clearInterval(timer); };
  }, []);
  return <div className={`countdown ${compact ? "countdown-compact" : ""}`} aria-label="Countdown to the draft festival date"><span className="countdown-label">The magic begins in</span><div className="countdown-units">{["Days", "Hours", "Minutes", "Seconds"].map((label, i) => <div key={label}><span>{remaining ? String(remaining[i]).padStart(2, "0") : "—"}</span><small>{label}</small></div>)}</div><small className="countdown-date">08 JANUARY 2027 · PROVISIONAL DATE</small></div>;
}

export function SoonBadge({ children = "Coming soon" }: { children?: React.ReactNode }) {
  return <span className="soon-badge"><LockKeyhole size={12} />{children}<i /></span>;
}

export function BackLink() {
  return <Link className="back-link" href="/"><ArrowLeft size={14} />Return to the castle</Link>;
}

export function CalendarButton({ label = "Save the date" }: { label?: string }) {
  const [saved, setSaved] = useState(false);
  const save = () => {
    const calendar = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Technika 27//BIT Patna//EN", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
      "UID:technika27-draft-festival@bitpatna", "DTSTAMP:20261007T000000Z", "DTSTART;VALUE=DATE:20270108", "DTEND;VALUE=DATE:20270111",
      "SUMMARY:Technika 27 — BIT Patna (provisional)", "LOCATION:Birla Institute of Technology\\, Patna\\, Bihar",
      "DESCRIPTION:Three days of technology and magic. Dates are provisional. Check the festival website for the final programme.",
      "STATUS:TENTATIVE", "END:VEVENT", "END:VCALENDAR", "",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([calendar], { type: "text/calendar;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = "technika-27-save-the-date.ics"; anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setSaved(true);
  };
  return <><button className="button button-gold" onClick={save}>{saved ? <Check size={16} /> : <CalendarPlus size={16} />}{saved ? "Calendar downloaded" : label}</button><span className="sr-only" role="status">{saved ? "The provisional festival date has been downloaded as a calendar file." : ""}</span></>;
}
