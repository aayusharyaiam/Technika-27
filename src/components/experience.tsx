"use client";

import Image from "next/image";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from "motion/react";
import Lenis from "lenis";
import { ArrowRight, Sparkles, WandSparkles } from "lucide-react";
import { AmbientParticles, Divider } from "./ornaments";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MagicInteractions } from "./magic-interactions";
import { WandCursor } from "./wand-cursor";

const MagicContext = createContext({ enabled: true, ready: false });
export const useMagic = () => useContext(MagicContext);

type Spark = { x: number; y: number; vx: number; vy: number; age: number; life: number; size: number; blue: boolean };

function WandSparks({ enabled }: { enabled: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let sparks: Spark[] = [];
    let frame = 0;
    let lastSpawn = 0;
    const finePointer = window.matchMedia("(pointer: fine)");
    let accent = "#ffd893";
    const getAccent = () => { accent = getComputedStyle(document.documentElement).getPropertyValue("--gold").trim() || "#ffd893"; };
    const palette = new MutationObserver(getAccent);
    palette.observe(document.documentElement, { attributes: true, attributeFilter: ["data-house"] });
    getAccent();
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      sparks = sparks.filter((p) => p.age < p.life);
      for (const p of sparks) {
        p.age++; p.x += p.vx; p.y += p.vy; p.vy += .025;
        ctx.globalAlpha = Math.max(0, (1 - p.age / p.life) * .9);
        ctx.fillStyle = p.blue ? "#b8e3ff" : accent;
        ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 7;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      frame = sparks.length ? requestAnimationFrame(draw) : 0;
    };
    const spawn = (event: PointerEvent, burst: boolean) => {
      if (!burst && (!finePointer.matches || performance.now() - lastSpawn < 32)) return;
      lastSpawn = performance.now();
      const count = burst ? 22 : 2;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = burst ? 1.3 + Math.random() * 3 : .3;
        sparks.push({ x: event.clientX + 4, y: event.clientY + 4, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, age: 0, life: burst ? 30 + Math.random() * 25 : 22, size: burst ? .8 + Math.random() * 1.5 : .9, blue: Math.random() > .8 });
      }
      sparks = sparks.slice(-100);
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const move = (e: PointerEvent) => spawn(e, false);
    const click = (e: PointerEvent) => spawn(e, true);
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", click, { passive: true });
    return () => { palette.disconnect(); cancelAnimationFrame(frame); ctx.clearRect(0, 0, canvas.width, canvas.height); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", move); window.removeEventListener("pointerdown", click); };
  }, [enabled]);
  return <canvas className="wand-sparks" ref={canvasRef} aria-hidden="true" />;
}

function LoadingScreen({ dismiss }: { dismiss: () => void }) {
  const [progress, setProgress] = useState(0);
  const skip = useRef<(() => void) | null>(null);

  useEffect(() => {
    const counter = { value: 0 };
    let baselineReady = false;
    let resourcesReady = false;
    let completing = false;
    let active = true;
    let last = -1;
    let closeTimer = 0;
    const paint = () => {
      const value = Math.round(counter.value);
      if (value !== last && active) { last = value; setProgress(value); }
    };
    const complete = () => {
      if (completing || !active) return;
      completing = true;
      gsap.killTweensOf(counter);
      gsap.to(counter, { value: 100, duration: .55, ease: "power2.out", onUpdate: paint, onComplete: () => {
        closeTimer = window.setTimeout(dismiss, 450);
      } });
    };
    const finishWhenReady = () => { if (baselineReady && resourcesReady) complete(); };
    gsap.to(counter, { value: 88, duration: 2.4, ease: "power2.inOut", onUpdate: paint, onComplete: () => {
      baselineReady = true; finishWhenReady();
    } });
    const criticalImages = [...document.images].filter((image) => image.loading !== "lazy");
    Promise.all([document.fonts.ready, ...criticalImages.map((image) => image.decode().catch(() => {}))]).then(() => {
      if (!active) return;
      resourcesReady = true; finishWhenReady();
    });
    // Slow or unavailable imagery must never trap a visitor behind the introduction.
    const timeout = window.setTimeout(complete, 6500);
    skip.current = complete;
    return () => {
      active = false;
      gsap.killTweensOf(counter);
      window.clearTimeout(timeout);
      window.clearTimeout(closeTimer);
      skip.current = null;
    };
  }, [dismiss]);

  return <motion.div className="loading-screen" role="dialog" aria-modal="true" aria-labelledby="loading-title" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }} transition={{ duration: .8, ease: "easeInOut" }}>
    <AmbientParticles count={28} />
    <div className="loader-map" aria-hidden="true"><span>✧</span><span>✦</span><span>✧</span></div>
    <motion.div className="loading-content" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
      <span className="eyebrow">A little magic is on its way</span>
      <div className="loader-crest"><i /><Image src="/images/crest.webp" width={200} height={200} alt="Technika 27 Golden Snitch crest" priority /></div>
      <h2 id="loading-title">“I solemnly swear that<br />I am up to no good.”</h2>
      <Divider />
      <p className="loading-phase">{progress < 30 ? "Gathering the stars…" : progress < 65 ? "Lighting the castle…" : progress < 100 ? "Weaving your adventure…" : "The magic is ready."}</p>
      <div className="loading-counter" aria-hidden="true"><span>{String(progress).padStart(2, "0")}</span><small>%</small></div>
      <div className="loading-progress" role="progressbar" aria-label="Preparing the magical experience" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{ transform: `scaleX(${progress / 100})` }} /></div>
      <button className="button button-gold" onClick={() => skip.current?.()} autoFocus>Enter Hogwarts <ArrowRight size={15} /></button>
      <small>TECHNIKA ’27 · BIT PATNA</small>
    </motion.div>
  </motion.div>;
}

export function Experience({ children, skipLoading = false, minimal = false }: { children: React.ReactNode; skipLoading?: boolean; minimal?: boolean }) {
  const [loading, setLoading] = useState(!skipLoading);
  const [preference, setPreference] = useState<"system" | "on" | "off">("system");
  const reducedMotion = useReducedMotion();
  const enabled = preference === "on" || (preference === "system" && !reducedMotion);
  const dismiss = useCallback(() => setLoading(false), []);

  useEffect(() => {
    if (!loading) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; };
  }, [loading]);

  useEffect(() => {
    document.documentElement.dataset.magic = enabled ? "on" : "off";
    if (!enabled || loading || minimal) return;
    const lenis = new Lenis({ duration: 1.3, smoothWheel: true, syncTouch: false, anchors: { offset: -105 } });
    const tick = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { lenis.off("scroll", ScrollTrigger.update); gsap.ticker.remove(tick); lenis.destroy(); };
  }, [enabled, loading, minimal]);

  return <MotionConfig reducedMotion={enabled ? "never" : "always"}><MagicContext.Provider value={{ enabled, ready: !loading }}>
    <div className="experience-content" inert={loading || undefined}>{children}</div>
    <AnimatePresence>{loading && <LoadingScreen dismiss={dismiss} />}</AnimatePresence>
    {!minimal && <><WandSparks enabled={enabled} /><WandCursor/><MagicInteractions />{!loading && <><div className="scroll-progress" aria-hidden="true" /><button className={`magic-toggle ${enabled ? "" : "magic-disabled"}`} aria-label={enabled ? "Pause magical effects" : "Enable magical effects"} aria-pressed={enabled} onClick={() => setPreference(enabled ? "off" : "on")} title={enabled ? "Pause magical effects" : "Enable magic"}>{enabled ? <WandSparkles size={17} /> : <Sparkles size={17} />}<span>{enabled ? "Magic on" : "Enable magic"}</span></button></>}</>}
  </MagicContext.Provider></MotionConfig>;
}
