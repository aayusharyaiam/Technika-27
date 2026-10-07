"use client";

import Image from "next/image";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from "motion/react";
import Lenis from "lenis";
import { ArrowRight, Sparkles, WandSparkles } from "lucide-react";
import { AmbientParticles, Divider } from "./ornaments";

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
        ctx.fillStyle = p.blue ? "#b8e3ff" : "#ffd893";
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
    return () => { cancelAnimationFrame(frame); ctx.clearRect(0, 0, canvas.width, canvas.height); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", move); window.removeEventListener("pointerdown", click); };
  }, [enabled]);
  return <canvas className="wand-sparks" ref={canvasRef} aria-hidden="true" />;
}

function LoadingScreen({ dismiss }: { dismiss: () => void }) {
  return <motion.div className="loading-screen" role="dialog" aria-modal="true" aria-labelledby="loading-title" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }} transition={{ duration: .8, ease: "easeInOut" }}>
    <AmbientParticles count={28} />
    <div className="loader-map" aria-hidden="true"><span>✧</span><span>✦</span><span>✧</span></div>
    <motion.div className="loading-content" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
      <span className="eyebrow">A little magic is on its way</span>
      <div className="loader-crest"><i /><Image src="/images/crest.webp" width={200} height={200} alt="Technika 27 Golden Snitch crest" priority /></div>
      <h2 id="loading-title">“I solemnly swear that<br />I am up to no good.”</h2>
      <Divider />
      <p>Gathering the stars. Lighting the castle.<br />Preparing your extraordinary adventure.</p>
      <div className="loading-progress" role="progressbar" aria-label="Preparing the magical experience"><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 2.3, ease: "easeInOut" }} /></div>
      <button className="button button-gold" onClick={dismiss} autoFocus>Enter Hogwarts <ArrowRight size={15} /></button>
      <small>TECHNIKA ’27 · BIT PATNA</small>
    </motion.div>
  </motion.div>;
}

export function Experience({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [effects, setEffects] = useState(true);
  const reducedMotion = useReducedMotion();
  const enabled = effects && !reducedMotion;

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 2800);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; };
  }, [loading]);

  useEffect(() => {
    document.documentElement.dataset.magic = enabled ? "on" : "off";
    if (!enabled || loading) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, syncTouch: false, anchors: { offset: -105 }, autoRaf: true });
    return () => lenis.destroy();
  }, [enabled, loading]);

  return <MotionConfig reducedMotion="user"><MagicContext.Provider value={{ enabled, ready: !loading }}>
    <div className="experience-content" inert={loading || undefined}>{children}</div>
    <AnimatePresence>{loading && <LoadingScreen dismiss={() => setLoading(false)} />}</AnimatePresence>
    <WandSparks enabled={enabled} />
    {!loading && <button className="magic-toggle" aria-label={effects ? "Pause magical effects" : "Enable magical effects"} aria-pressed={effects} onClick={() => setEffects(!effects)} title={effects ? "Pause magical effects" : "Enable magical effects"}>{effects ? <WandSparkles size={17} /> : <Sparkles size={17} />}<span>{effects ? "Magic on" : "Magic paused"}</span></button>}
  </MagicContext.Provider></MotionConfig>;
}
