"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from "motion/react";
import Lenis from "lenis";
import { Sparkles, WandSparkles } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MagicInteractions } from "./magic-interactions";
import { WandCursor } from "./wand-cursor";
import { ScrollSnake } from "./scroll-snake";

const MagicContext = createContext({ enabled: true, ready: false });
export const useMagic = () => useContext(MagicContext);
const subscribeHydration = () => () => {};

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const finishTimer = useRef<number | null>(null);

  useEffect(() => {
    let active = true;
    let ended = false;
    let started = false;
    let monitorFrame = 0;
    let startupTimer = 0;
    const video = videoRef.current;
    if (!video) return;
    const paintProgress = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      const ratio = Math.max(0, Math.min(1, video.currentTime / video.duration));
      setProgress(Math.min(99, Math.floor(ratio * 100)));
    };
    const finish = () => {
      if (!active || ended) return;
      ended = true;
      setProgress(100);
      window.clearTimeout(startupTimer);
      if (monitorFrame) cancelAnimationFrame(monitorFrame);
      finishTimer.current = window.setTimeout(dismiss, 120);
    };
    const handleError = () => { if (active) dismiss(); };
    const monitorPlayback = () => {
      if (!active) return;
      paintProgress();
      const atEnd = video.ended || (Number.isFinite(video.duration) && video.duration > 0 && video.currentTime >= video.duration - .03);
      if (atEnd) { finish(); return; }
      monitorFrame = requestAnimationFrame(monitorPlayback);
    };
    const startPlayback = () => {
      if (started || ended) return;
      started = true;
      video.playbackRate = 2;
      video.defaultPlaybackRate = 2;
      void video.play().then(() => {
        if (!monitorFrame) monitorFrame = requestAnimationFrame(monitorPlayback);
      }).catch(() => { started = false; handleError(); });
    };
    const markMetadataReady = () => {
      window.clearTimeout(startupTimer);
      paintProgress();
      startPlayback();
    };
    video.addEventListener("loadedmetadata", startPlayback);
    video.addEventListener("loadeddata", markMetadataReady);
    video.addEventListener("canplay", startPlayback);
    video.addEventListener("timeupdate", paintProgress);
    video.addEventListener("durationchange", paintProgress);
    video.addEventListener("ended", finish);
    video.addEventListener("error", handleError);
    startupTimer = window.setTimeout(() => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) handleError();
    }, 15000);
    if (video.readyState >= 1) markMetadataReady();
    return () => {
      active = false;
      window.clearTimeout(startupTimer);
      video.removeEventListener("loadedmetadata", startPlayback);
      video.removeEventListener("loadeddata", markMetadataReady);
      video.removeEventListener("canplay", startPlayback);
      video.removeEventListener("timeupdate", paintProgress);
      video.removeEventListener("durationchange", paintProgress);
      video.removeEventListener("ended", finish);
      video.removeEventListener("error", handleError);
      if (monitorFrame) cancelAnimationFrame(monitorFrame);
      if (finishTimer.current) window.clearTimeout(finishTimer.current);
    };
  }, [dismiss]);

  return <motion.div className="loading-screen" role="dialog" aria-modal="true" aria-label="Entering the wizarding world" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.05, ease: "easeInOut" }}>
    <video ref={videoRef} className="loading-video" autoPlay muted playsInline preload="auto" aria-hidden="true"><source src="/videos/hogwarts-loader.mp4" type="video/mp4" /></video>
    <motion.div className="loading-mark" role="progressbar" aria-label="Loading Technika" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} initial={{ opacity: 0, scale: .92 }} animate={{ opacity: 1, scale: 1 }}>
      <span className="loading-percent">{progress}%</span>
    </motion.div>
  </motion.div>;
}

export function Experience({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const authExperience = ["/login", "/signup", "/reset-password", "/sorting", "/account"].includes(pathname);
  const [loading, setLoading] = useState(true);
  // Auth/ceremony routes use the supplied hat artwork and open immediately, without the film loader.
  const showLoader = loading && !authExperience;
  const [preference, setPreference] = useState<"system" | "on" | "off">("system");
  const reducedMotion = useReducedMotion();
  // Keep the first client render identical to SSR, then apply the system preference.
  const hydrated = useSyncExternalStore(subscribeHydration, () => true, () => false);
  const enabled = preference === "on" || (preference === "system" && (!hydrated || !reducedMotion));
  const dismiss = useCallback(() => setLoading(false), []);

  useEffect(() => {
    if (!showLoader) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; };
  }, [showLoader]);

  useEffect(() => {
    document.documentElement.dataset.magic = enabled ? "on" : "off";
    if (!enabled || showLoader) return;
    const lenis = new Lenis({ duration: 1.3, smoothWheel: true, syncTouch: false, anchors: { offset: -105 } });
    const tick = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { lenis.off("scroll", ScrollTrigger.update); gsap.ticker.remove(tick); lenis.destroy(); };
  }, [enabled, showLoader]);

  return <MotionConfig reducedMotion={enabled ? "never" : "always"}><MagicContext.Provider value={{ enabled, ready: !showLoader }}>
    <div className="experience-content" inert={showLoader || undefined}>{children}</div>
    <AnimatePresence>{showLoader && <LoadingScreen dismiss={dismiss} />}</AnimatePresence>
    <WandSparks enabled={enabled} />
    <WandCursor/>
    <MagicInteractions />
    {!showLoader && <><div className="scroll-progress" aria-hidden="true" /><ScrollSnake /><button className={`magic-toggle ${enabled ? "" : "magic-disabled"}`} aria-label={enabled ? "Pause magical effects" : "Enable magical effects"} aria-pressed={enabled} onClick={() => setPreference(enabled ? "off" : "on")} title={enabled ? "Pause magical effects" : "Enable magical effects"}>{enabled ? <WandSparkles size={17} /> : <Sparkles size={17} />}<span>{enabled ? "Magic on" : "Enable magic"}</span></button></>}
  </MagicContext.Provider></MotionConfig>;
}
