"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { useMagic } from "./experience";

const relics = [
  { name: "The Elder Wand", part: "wand", number: "I", virtue: "The power to create", words: "Not every powerful spell needs a wand. Sometimes, it begins with an idea brave enough to change the world.", line: "Build boldly. Let your work leave a mark." },
  { name: "The Resurrection Stone", part: "stone", number: "II", virtue: "The stories we carry", words: "Great ideas never truly disappear. They return in the people we inspire, the memories we keep, and the things we make together.", line: "Honour the past. Reimagine what comes next." },
  { name: "The Invisibility Cloak", part: "cloak", number: "III", virtue: "The courage to explore", words: "Step beyond the familiar. The most extraordinary discoveries are waiting where no one has thought to look.", line: "Stay curious. Find magic in the unexpected." },
] as const;

export function DeathlyHallows() {
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const { enabled, ready } = useMagic();
  useEffect(() => {
    if (!enabled || !ready || !autoplay) return;
    const timer = window.setInterval(() => { if (!document.hidden) setActive((value) => (value + 1) % 3); }, 6500);
    return () => window.clearInterval(timer);
  }, [enabled, ready, autoplay]);
  const relic = relics[active];
  return <div className="hallows-component" data-active-hallow={relic.part}>
    <div className="hallows-symbol" aria-hidden="true"><div className="hallows-symbol-aura" /><svg viewBox="0 0 300 280" fill="none"><path className={`hallow-path hallow-cloak ${active === 2 ? "illuminated" : ""}`} d="M150 25L274 244H26Z" strokeWidth="2.2" strokeLinejoin="round"/><circle className={`hallow-path hallow-stone ${active === 1 ? "illuminated" : ""}`} cx="150" cy="171" r="71" strokeWidth="2.2"/><path className={`hallow-path hallow-wand ${active === 0 ? "illuminated" : ""}`} d="M150 25V244" strokeWidth="2.6" strokeLinecap="round"/></svg><span className="hallows-symbol-caption">THE TALE OF THREE BROTHERS</span></div>
    <div className="hallows-tabs" role="tablist" aria-label="Explore the Deathly Hallows">{relics.map((item, index) => <button key={item.part} type="button" role="tab" id={`hallow-tab-${index}`} aria-controls="hallow-story" aria-selected={active === index} tabIndex={active === index ? 0 : -1} onClick={() => { setActive(index); setAutoplay(false); }} onKeyDown={(event) => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); const next = (active + (event.key === "ArrowRight" ? 1 : -1) + 3) % 3; setActive(next); setAutoplay(false); document.getElementById(`hallow-tab-${next}`)?.focus(); } }}><small>{item.number}</small>{item.name.replace("The ", "")}</button>)}</div>
    <div id="hallow-story" role="tabpanel" aria-labelledby={`hallow-tab-${active}`}><AnimatePresence mode="wait"><motion.div className="hallow-story-copy" key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .4 }}><span className="eyebrow">{relic.virtue}</span><h3>{relic.name}</h3><p>{relic.words}</p><blockquote>{relic.line}</blockquote></motion.div></AnimatePresence></div>
    <button type="button" className="hallows-autoplay" aria-label={autoplay ? "Pause Hallows story rotation" : "Play Hallows story rotation"} onClick={() => setAutoplay(!autoplay)}>{autoplay ? <Pause size={11}/> : <Play size={11}/>} {autoplay ? "Pause the tale" : "Let the tale unfold"}</button>
  </div>;
}
