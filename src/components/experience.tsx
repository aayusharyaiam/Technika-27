"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  MotionConfig,
} from "motion/react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MagicInteractions } from "./magic-interactions";
import { WandCursor } from "./wand-cursor";
import { ScrollSnake } from "./scroll-snake";
import { LoadingScene } from "./loading-scene";

const MagicContext = createContext({ enabled: true, ready: false });
export const useMagic = () => useContext(MagicContext);

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  size: number;
  blue: boolean;
};

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
    const getAccent = () => {
      accent =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--gold")
          .trim() || "#ffd893";
    };
    const palette = new MutationObserver(getAccent);
    palette.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-house"],
    });
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
        p.age++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.025;
        ctx.globalAlpha = Math.max(0, (1 - p.age / p.life) * 0.9);
        ctx.fillStyle = p.blue ? "#b8e3ff" : accent;
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      frame = sparks.length ? requestAnimationFrame(draw) : 0;
    };
    const spawn = (event: PointerEvent, burst: boolean) => {
      if (
        !burst &&
        (!finePointer.matches || performance.now() - lastSpawn < 32)
      )
        return;
      lastSpawn = performance.now();
      const count = burst ? 22 : 2;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = burst ? 1.3 + Math.random() * 3 : 0.3;
        sparks.push({
          x: event.clientX + 4,
          y: event.clientY + 4,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          age: 0,
          life: burst ? 30 + Math.random() * 25 : 22,
          size: burst ? 0.8 + Math.random() * 1.5 : 0.9,
          blue: Math.random() > 0.8,
        });
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
    return () => {
      palette.disconnect();
      cancelAnimationFrame(frame);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", click);
    };
  }, [enabled]);
  return <canvas className="wand-sparks" ref={canvasRef} aria-hidden="true" />;
}

function LoadingScreen({ dismiss }: { dismiss: () => void }) {
  const [progress, setProgress] = useState(0);
  const finishTimer = useRef<number | null>(null);
  const screenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    let frame = 0;
    let finished = false;
    const startedAt = performance.now();
    const duration = 3400;
    const animate = (now: number) => {
      if (!active) return;
      const elapsed = now - startedAt;
      const ratio = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - ratio, 2);
      const next = ratio >= 1 ? 100 : Math.min(99, Math.floor(eased * 100));
      setProgress((current) => (current === next ? current : next));
      if (ratio >= 1) {
        if (!finished) {
          finished = true;
          finishTimer.current = window.setTimeout(dismiss, 220);
        }
        return;
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      if (finishTimer.current) window.clearTimeout(finishTimer.current);
    };
  }, [dismiss]);

  useEffect(() => {
    const screen = screenRef.current;
    if (!screen || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;

    let frame = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    const paintParallax = () => {
      currentX += (targetX - currentX) * 0.09;
      currentY += (targetY - currentY) * 0.09;
      const layers = {
        far: 0.24,
        mid: 0.48,
        near: 0.8,
      };
      for (const [name, depth] of Object.entries(layers)) {
        screen.style.setProperty(
          `--loading-x-${name}`,
          `${(currentX * depth).toFixed(2)}px`,
        );
        screen.style.setProperty(
          `--loading-y-${name}`,
          `${(currentY * depth).toFixed(2)}px`,
        );
      }
      if (
        Math.abs(targetX - currentX) > 0.1 ||
        Math.abs(targetY - currentY) > 0.1
      ) {
        frame = requestAnimationFrame(paintParallax);
      } else {
        frame = 0;
      }
    };
    const move = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 44;
      targetY = (event.clientY / window.innerHeight - 0.5) * 26;
      if (!frame) frame = requestAnimationFrame(paintParallax);
    };
    const reset = () => {
      targetX = 0;
      targetY = 0;
      if (!frame) frame = requestAnimationFrame(paintParallax);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("blur", reset);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("blur", reset);
    };
  }, []);

  return (
    <motion.div
      ref={screenRef}
      className="loading-screen"
      role="dialog"
      aria-modal="true"
      aria-label="Entering the wizarding world"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.05, ease: "easeInOut" }}
    >
      <LoadingScene progress={progress} />
      <motion.div
        className="loading-mark"
        role="progressbar"
        aria-label="Loading Technika"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <span className="loading-percent">{progress}%</span>
        <span className="loading-status" role="status" aria-live="polite">
          {progress < 100 ? "Tracing the castle in moonlight" : "The gates are open"}
        </span>
        <span className="loading-progress-track" aria-hidden="true">
          <span
            className="loading-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </span>
      </motion.div>
    </motion.div>
  );
}

export function Experience({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const authExperience = [
    "/login",
    "/signup",
    "/reset-password",
    "/sorting",
    "/account",
  ].includes(pathname);
  const [loading, setLoading] = useState(true);
  // Auth/ceremony routes use the supplied hat artwork and open immediately, without the arrival loader.
  const showLoader = loading && !authExperience;
  // The wizarding experience is intentionally always active; there is no pause
  // control so the arrival scene and all page interactions stay in sync.
  const enabled = true;
  const dismiss = useCallback(() => setLoading(false), []);

  useEffect(() => {
    if (!showLoader) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [showLoader]);

  useEffect(() => {
    document.documentElement.dataset.magic = enabled ? "on" : "off";
    if (!enabled || showLoader) return;
    const lenis = new Lenis({
      duration: 1.3,
      smoothWheel: true,
      syncTouch: false,
      anchors: { offset: -105 },
    });
    const tick = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [enabled, showLoader]);

  return (
    <MotionConfig reducedMotion={enabled ? "never" : "always"}>
      <MagicContext.Provider value={{ enabled, ready: !showLoader }}>
        <div className="experience-content" inert={showLoader || undefined}>
          {children}
        </div>
        <AnimatePresence>
          {showLoader && <LoadingScreen dismiss={dismiss} />}
        </AnimatePresence>
        <WandSparks enabled={enabled} />
        <WandCursor />
        <MagicInteractions />
        {!showLoader && (
          <>
            <div className="scroll-progress" aria-hidden="true" />
            <ScrollSnake />
          </>
        )}
      </MagicContext.Provider>
    </MotionConfig>
  );
}
