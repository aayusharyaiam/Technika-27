"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Bot, Clock3, Code2, Flame, FlaskConical, MapPin, Music2, Shield, Trophy, Wind } from "lucide-react";
import { schedule } from "@/lib/festival";
import { Divider, Eyebrow } from "./ornaments";
import { Reveal } from "./reveal";

const icons = { flame: Flame, wind: Wind, shield: Shield, code: Code2, flask: FlaskConical, bot: Bot, trophy: Trophy, music: Music2 };

export function Timeline() {
  const [day, setDay] = useState(0);
  return <section id="timeline" className="section timeline-section">
    <div className="shell">
      <Reveal className="section-intro"><Eyebrow>The grimoire of events</Eyebrow><h2>Three days. <em>Infinite magic.</em></h2><p>Every great story begins with a quest. Here’s yours.</p><Divider /></Reveal>
      <Reveal><div className="day-tabs" role="tablist" aria-label="Festival days">{schedule.map((item, index) => <button key={item.day} id={`day-tab-${index}`} role="tab" aria-selected={day === index} aria-controls="schedule-panel" tabIndex={day === index ? 0 : -1} onClick={() => setDay(index)} onKeyDown={(e) => { if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) { e.preventDefault(); const next = e.key === "Home" ? 0 : e.key === "End" ? 2 : (day + (e.key === "ArrowRight" ? 1 : -1) + 3) % 3; setDay(next); document.getElementById(`day-tab-${next}`)?.focus(); } }} className={day === index ? "active" : ""}><span>DAY {item.day} <i>·</i> {item.date}</span><small>{item.title}</small></button>)}</div></Reveal>
      <div id="schedule-panel" role="tabpanel" aria-labelledby={`day-tab-${day}`} tabIndex={0}>
        <AnimatePresence mode="wait"><motion.div className="event-grid" key={day} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .25 }}>{schedule[day].events.map((event, index) => {
          const Icon = icons[event.icon as keyof typeof icons];
          return <article className={`event-card accent-${event.color}`} key={event.title}>
            <div className="event-meta"><span className="event-category">{event.category}</span><span><Clock3 size={12} />{event.time}</span></div>
            <div className="event-icon"><Icon size={27} strokeWidth={1.25} /><span>0{index + 1}</span></div>
            <h3>{event.title}</h3><p>{event.description}</p>
            <div className="event-footer"><span><MapPin size={12} />{event.venue}</span><Link href="/registrations" aria-label={`Registration details for ${event.title}`}><ArrowUpRight size={18} /></Link></div>
          </article>;
        })}</motion.div></AnimatePresence>
      </div>
      <p className="schedule-note"><span>✦</span> A glimpse of what awaits. This is an illustrative schedule; the final programme will be revealed soon.</p>
    </div>
  </section>;
}
