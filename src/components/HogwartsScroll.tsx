"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import {
  ArrowUpRight,
  Award,
  Building2,
  CalendarDays,
  Cpu,
  GraduationCap,
  Landmark,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { CDN_BASE_URL, FRAME_CONFIG, ANIMATION_CONFIG } from "@/lib/config";
import { setHomeIntroCompleted } from "@/lib/intro-state";
import { useMagic } from "@/components/experience";

const {
  COUNT: FRAME_COUNT,
  DPR_LIMIT,
  START_FRAME = 0,
  END_FRAME = FRAME_COUNT - 1,
} = FRAME_CONFIG;
const { LERP_FACTOR, LERP_THRESHOLD, SPRING: SPRING_CONFIG } = ANIMATION_CONFIG;

function pad4(n: number): string {
  return String(n).padStart(4, "0");
}

function getFrameSrc(i: number): string {
  const base = CDN_BASE_URL.replace(/\/+$/, "");
  const normalizedBase =
    base.startsWith("http") || base.startsWith("/") ? base : `/${base}`;
  return `${normalizedBase}/${pad4(i + 1)}.webp`;
}

function calculateCoverFit(
  canvasWidth: number,
  canvasHeight: number,
  imageWidth: number,
  imageHeight: number,
  dpr: number,
) {
  const cw = canvasWidth / dpr;
  const ch = canvasHeight / dpr;
  const canvasAR = cw / ch;
  const imgAR = imageWidth / imageHeight;

  let dw: number;
  let dh: number;

  if (canvasAR > imgAR) {
    dw = cw;
    dh = cw / imgAR;
  } else {
    dh = ch;
    dw = ch * imgAR;
  }

  const x = Math.floor((cw - dw) / 2);
  const y = Math.floor((ch - dh) / 2);

  return { width: Math.ceil(dw), height: Math.ceil(dh), x, y };
}

function drawImageToCanvas(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  img: HTMLImageElement | undefined,
  dprLimit: number,
) {
  const dpr = Math.min(window.devicePixelRatio || 1, dprLimit);
  const cw = canvas.width / dpr;
  const ch = canvas.height / dpr;

  if (!img || !img.complete || !img.naturalWidth || !img.naturalHeight) {
    ctx.fillStyle = "#080808";
    ctx.fillRect(0, 0, cw, ch);
    return;
  }

  const fit = calculateCoverFit(
    canvas.width,
    canvas.height,
    img.naturalWidth,
    img.naturalHeight,
    dpr,
  );

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "medium";
  ctx.drawImage(img, fit.x, fit.y, fit.width, fit.height);
}

const inFlightFrames = new Map<number, Promise<HTMLImageElement | undefined>>();

function preloadFrame(
  i: number,
  imagesRef: React.MutableRefObject<(HTMLImageElement | undefined)[]>,
): Promise<HTMLImageElement | undefined> {
  const safeIndex = Math.max(0, Math.min(FRAME_COUNT - 1, i));
  const existing = imagesRef.current[safeIndex];
  if (existing && existing.complete && existing.naturalWidth > 0) {
    return Promise.resolve(existing);
  }

  const inflight = inFlightFrames.get(safeIndex);
  if (inflight) {
    return inflight;
  }

  const promise = new Promise<HTMLImageElement | undefined>((resolve) => {
    const img = new window.Image();
    img.decoding = "async";
    img.src = getFrameSrc(safeIndex);

    img.onload = () => {
      imagesRef.current[safeIndex] = img;
      inFlightFrames.delete(safeIndex);
      if ("decode" in img) {
        img
          .decode()
          .catch(() => {})
          .finally(() => resolve(img));
      } else {
        resolve(img);
      }
    };

    img.onerror = () => {
      inFlightFrames.delete(safeIndex);
      resolve(undefined);
    };
  });

  inFlightFrames.set(safeIndex, promise);
  return promise;
}

function startProgressivePreload(
  imagesRef: React.MutableRefObject<(HTMLImageElement | undefined)[]>,
  startFrame: number,
  onFirstLoaded: () => void,
  cancelledRef: { current: boolean },
) {
  const priorityCount = Math.min(30, FRAME_COUNT);
  let firstBatchLoaded = 0;

  for (let i = 0; i < priorityCount; i++) {
    const idx = startFrame + i;
    if (idx < FRAME_COUNT) {
      preloadFrame(idx, imagesRef).then(() => {
        if (cancelledRef.current) return;
        firstBatchLoaded++;
        if (firstBatchLoaded === 1) {
          onFirstLoaded();
        }
      });
    }
  }

  // Also preload the final frame early so scrubbing down quickly never stalls on the ending
  if (END_FRAME < FRAME_COUNT) {
    preloadFrame(END_FRAME, imagesRef);
  }

  const queue: number[] = [];
  for (let i = startFrame + priorityCount; i < FRAME_COUNT; i++) {
    queue.push(i);
  }
  for (let i = startFrame - 1; i >= 0; i--) {
    queue.push(i);
  }

  const CONCURRENCY = 6;
  let qIndex = 0;

  async function worker() {
    while (qIndex < queue.length && !cancelledRef.current) {
      const idx = queue[qIndex++];
      await preloadFrame(idx, imagesRef);
    }
  }

  const workerTimer = setTimeout(() => {
    if (cancelledRef.current) return;
    for (let c = 0; c < CONCURRENCY; c++) {
      worker();
    }
  }, 80);

  return () => clearTimeout(workerTimer);
}

const TIMELINE_DAYS = [
  {
    day: "Day 0",
    subtitle: "Arrival & Onboarding",
    summary: "Check-in, kits & campus walkthrough",
  },
  {
    day: "Day 1",
    subtitle: "The Opening",
    summary: "Inauguration, 24-hr hackathon & expos",
  },
  {
    day: "Day 2",
    subtitle: "The Arena",
    summary: "Robotics, coding, e-sports & pro nights",
  },
  {
    day: "Day 3",
    subtitle: "The Finale",
    summary: "Finals, awards & closing pro show",
  },
] as const;

const EVENT_STATS = [
  { value: "30+", label: "Events", icon: Trophy },
  { value: "1000+", label: "Participants", icon: Users },
  { value: "10+", label: "Colleges", icon: GraduationCap },
] as const;

const BIT_PILLARS = [
  { label: "BIT Legacy", icon: Landmark },
  { label: "BIT Mesra Excellence", icon: Award },
  { label: "Modern Campus", icon: Building2 },
  { label: "Innovation & Growth", icon: Cpu },
] as const;

export interface HogwartsScrollProps {
  children?: React.ReactNode;
  className?: string;
  trackHeight?: string;
}

export function HogwartsScroll({
  children,
  className = "",
  trackHeight = "h-[640vh]",
}: HogwartsScrollProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imagesRef = useRef<(HTMLImageElement | undefined)[]>([]);
  const targetFrameRef = useRef<number>(START_FRAME);
  const currentFrameRef = useRef<number>(START_FRAME);
  const lastDrawnFrameRef = useRef<number>(-1);
  const lastDrawExactRef = useRef<boolean>(false);
  const rafRef = useRef<number | null>(null);

  const [loaded, setLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const { setReady } = useMagic();

  // Entry (before sticky) & Exit (after sticky releases) scroll progress
  const { scrollYProgress: entryRawProgress } = useScroll({
    target: containerRef,
    offset: ["start 92%", "start start"],
  });
  const entryProgress = useSpring(entryRawProgress, {
    stiffness: 150,
    damping: 28,
    mass: 0.35,
  });

  const { scrollYProgress: exitRawProgress } = useScroll({
    target: containerRef,
    offset: ["end end", "end 8%"],
  });
  const exitProgress = useSpring(exitRawProgress, {
    stiffness: 150,
    damping: 28,
    mass: 0.35,
  });

  // 8.5deg 3D tilt on entry -> 0deg flat 2D while pinned -> -8.5deg 3D tilt on exit
  const cardRotateX = useTransform(
    [entryProgress, exitProgress],
    ([en, ex]: number[]) => (1 - en) * 8.5 - ex * 8.5,
  );
  const cardScale = useTransform(
    [entryProgress, exitProgress],
    ([en, ex]: number[]) => 1 - Math.max(1 - en, ex) * 0.13,
  );
  const cardRadius = useTransform(
    [entryProgress, exitProgress],
    ([en, ex]: number[]) => Math.max(1 - en, ex) * 32,
  );
  const cardTranslateY = useTransform(
    [entryProgress, exitProgress],
    ([en, ex]: number[]) => (1 - en) * 20 - ex * 20,
  );
  const cardBorderOpacity = useTransform(
    [entryProgress, exitProgress],
    ([en, ex]: number[]) => Math.min(1, Math.max(1 - en, ex) * 1.25),
  );

  // Main sticky frame scrub across 0001.jpg -> 0234.jpg
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, SPRING_CONFIG);
  const progressBarOpacity = useTransform(
    scrollYProgress,
    [0, 0.008, 0.992, 1],
    [0, 1, 1, 0],
  );

  // Section 1: Event Timeline (0.08 -> 0.36) — Right edge sky beside castle
  const timelineOpacity = useTransform(
    smoothProgress,
    [0.08, 0.14, 0.29, 0.36],
    [0, 1, 1, 0],
  );
  const timelineY = useTransform(
    smoothProgress,
    [0.08, 0.14, 0.36],
    [26, 0, -22],
  );
  const timelineFilter = useTransform(
    smoothProgress,
    [0.08, 0.14, 0.29, 0.36],
    ["blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)"],
  );
  const timelineFillScaleY = useTransform(smoothProgress, [0.11, 0.31], [0, 1]);

  // Day items progressive emphasis along scroll inside Section 1
  const day0Opacity = useTransform(
    smoothProgress,
    [0.1, 0.14, 0.33],
    [0.4, 1, 1],
  );
  const day1Opacity = useTransform(
    smoothProgress,
    [0.15, 0.19, 0.33],
    [0.4, 1, 1],
  );
  const day2Opacity = useTransform(
    smoothProgress,
    [0.2, 0.24, 0.33],
    [0.4, 1, 1],
  );
  const day3Opacity = useTransform(
    smoothProgress,
    [0.25, 0.29, 0.33],
    [0.4, 1, 1],
  );
  const dayOpacities = [day0Opacity, day1Opacity, day2Opacity, day3Opacity];

  // Gap 1: 0.36 -> 0.44 (pure background frames)

  // Section 2: About Event (0.44 -> 0.68) — Left shadowed edge off Platform 9 3/4 & Express
  const aboutEventOpacity = useTransform(
    smoothProgress,
    [0.44, 0.51, 0.61, 0.68],
    [0, 1, 1, 0],
  );
  const aboutEventY = useTransform(
    smoothProgress,
    [0.44, 0.51, 0.68],
    [26, 0, -22],
  );
  const aboutEventFilter = useTransform(
    smoothProgress,
    [0.44, 0.51, 0.61, 0.68],
    ["blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)"],
  );

  // Gap 2: 0.68 -> 0.78 (pure background frames)

  // Section 3: About BIT Patna (0.78 -> 1.00) — Lower-right mist below departing train
  const bitPatnaOpacity = useTransform(
    smoothProgress,
    [0.78, 0.86, 1],
    [0, 1, 1],
  );
  const bitPatnaY = useTransform(smoothProgress, [0.78, 0.86, 1], [26, 0, 0]);
  const bitPatnaFilter = useTransform(
    smoothProgress,
    [0.78, 0.86, 1],
    ["blur(8px)", "blur(0px)", "blur(0px)"],
  );

  const drawFrame = useCallback((index: number): boolean => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return false;

    const clamped = Math.max(0, Math.min(FRAME_COUNT - 1, index));
    let img = imagesRef.current[clamped];
    const isExact = Boolean(img && img.complete && img.naturalWidth > 0);

    if (!isExact) {
      for (let offset = 1; offset < FRAME_COUNT; offset++) {
        const lower = clamped - offset;
        if (
          lower >= 0 &&
          imagesRef.current[lower]?.complete &&
          imagesRef.current[lower]!.naturalWidth > 0
        ) {
          img = imagesRef.current[lower];
          break;
        }
        const higher = clamped + offset;
        if (
          higher < FRAME_COUNT &&
          imagesRef.current[higher]?.complete &&
          imagesRef.current[higher]!.naturalWidth > 0
        ) {
          img = imagesRef.current[higher];
          break;
        }
      }
    }

    drawImageToCanvas(ctx, canvas, img, DPR_LIMIT);
    return isExact;
  }, []);

  const lookaheadBuffer = useCallback((centerFrame: number) => {
    const startOffset = -6;
    const endOffset = 24;
    for (let offset = 0; offset <= endOffset; offset++) {
      const forward = centerFrame + offset;
      if (
        forward >= 0 &&
        forward < FRAME_COUNT &&
        !imagesRef.current[forward]
      ) {
        preloadFrame(forward, imagesRef);
      }
    }
    for (let offset = -1; offset >= startOffset; offset--) {
      const backward = centerFrame + offset;
      if (
        backward >= 0 &&
        backward < FRAME_COUNT &&
        !imagesRef.current[backward]
      ) {
        preloadFrame(backward, imagesRef);
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    ctxRef.current = ctx;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_LIMIT);
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      canvas.width = Math.floor(vw * dpr);
      canvas.height = Math.floor(vh * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const frameIndex = Math.round(currentFrameRef.current);
      lastDrawExactRef.current = drawFrame(frameIndex);
      lastDrawnFrameRef.current = frameIndex;
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [drawFrame]);

  useEffect(() => {
    const cancelledRef = { current: false };
    imagesRef.current = new Array(FRAME_COUNT);
    inFlightFrames.clear();

    const stopWorkers = startProgressivePreload(
      imagesRef,
      START_FRAME,
      () => {
        if (cancelledRef.current) return;
        const frameIndex = Math.round(currentFrameRef.current);
        lastDrawExactRef.current = drawFrame(frameIndex);
        lastDrawnFrameRef.current = frameIndex;
        setLoaded(true);
        setReady(true);
        setHomeIntroCompleted(true);
      },
      cancelledRef,
    );

    const fallbackTimer = setTimeout(() => {
      if (cancelledRef.current) return;
      setLoaded(true);
      setReady(true);
      setHomeIntroCompleted(true);
      const frameIndex = Math.round(currentFrameRef.current);
      lastDrawExactRef.current = drawFrame(frameIndex);
      lastDrawnFrameRef.current = frameIndex;
    }, 1200);

    return () => {
      cancelledRef.current = true;
      stopWorkers();
      inFlightFrames.clear();
      clearTimeout(fallbackTimer);
    };
  }, [drawFrame, setReady]);

  useMotionValueEvent(smoothProgress, "change", (v) => {
    const clampedV = Math.max(0, Math.min(1, v));
    const nextTarget = Math.max(
      0,
      Math.min(
        FRAME_COUNT - 1,
        START_FRAME + clampedV * (END_FRAME - START_FRAME),
      ),
    );
    targetFrameRef.current = nextTarget;
    lookaheadBuffer(Math.round(nextTarget));

    const sec = clampedV < 0.4 ? 0 : clampedV < 0.72 ? 1 : 2;
    setActiveSection((prev) => (prev === sec ? prev : sec));

    const nextDay =
      clampedV < 0.15 ? 0 : clampedV < 0.21 ? 1 : clampedV < 0.27 ? 2 : 3;
    setActiveDayIndex((prev) => (prev === nextDay ? prev : nextDay));
  });

  useEffect(() => {
    const tick = () => {
      const curr = currentFrameRef.current;
      const target = targetFrameRef.current;
      const diff = target - curr;

      if (Math.abs(diff) > LERP_THRESHOLD) {
        const step = diff * LERP_FACTOR;
        currentFrameRef.current = Math.abs(diff) < 0.005 ? target : curr + step;
      } else if (curr !== target) {
        currentFrameRef.current = target;
      }

      const nextFrame = Math.round(currentFrameRef.current);
      if (
        nextFrame !== lastDrawnFrameRef.current ||
        !lastDrawExactRef.current
      ) {
        lastDrawExactRef.current = drawFrame(nextFrame);
        lastDrawnFrameRef.current = nextFrame;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [drawFrame]);

  return (
    <section
      ref={containerRef}
      className={`relative my-16 w-full bg-[#080808] sm:my-24 lg:my-28 ${trackHeight} ${className}`}
      data-hogwarts-scroll="true"
    >
      {/* Fixed Top Horizontal Scroll Progress Indicator above navbar (z-[60] > z-50) */}
      <motion.div
        aria-hidden="true"
        style={{
          scaleX: smoothProgress,
          opacity: progressBarOpacity,
          transformOrigin: "0% 50%",
        }}
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] bg-brand shadow-[0_0_8px_var(--brand)]"
      />

      {/* Navigation anchors mapped to scroll depths */}
      <div
        id="journey"
        aria-hidden="true"
        className="pointer-events-none absolute top-[2%] left-0 h-px w-px"
      />
      <div
        id="timeline"
        aria-hidden="true"
        className="pointer-events-none absolute top-[12%] left-0 h-px w-px"
      />
      <div
        id="about"
        aria-hidden="true"
        className="pointer-events-none absolute top-[54%] left-0 h-px w-px"
      />
      <div
        id="campus"
        aria-hidden="true"
        className="pointer-events-none absolute top-[82%] left-0 h-px w-px"
      />
      <div
        id="sponsors"
        aria-hidden="true"
        className="pointer-events-none absolute top-[92%] left-0 h-px w-px"
      />

      {/* Sticky 100dvh Viewport: 3D Tilted Entry -> 2D Flatten -> 3D Tilted Exit */}
      <div
        className="sticky top-0 left-0 h-[100dvh] w-full overflow-hidden"
        style={{ perspective: "1200px" }}
      >
        <motion.div
          style={{
            transformPerspective: 1200,
            transformOrigin: "50% 50%",
            rotateX: cardRotateX,
            scale: cardScale,
            y: cardTranslateY,
            borderRadius: cardRadius,
          }}
          className="relative h-full w-full overflow-hidden bg-[#080808] shadow-[0_30px_90px_rgba(0,0,0,0.85)]"
        >
          {/* Rounded theme-colored glowing border visible during 3D tilt */}
          <motion.div
            aria-hidden="true"
            style={{ opacity: cardBorderOpacity, borderRadius: cardRadius }}
            className="pointer-events-none absolute inset-0 z-30 border-2 border-brand shadow-glow-brand"
          />

          <canvas
            ref={canvasRef}
            className="wizarding-canvas block h-full w-full"
            style={{ width: "100%", height: "100%", display: "block" }}
          />

          {/* Soft edge vignette keeping the center focal scene bright & unobstructed */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,8,8,0.06)_25%,rgba(8,8,8,0.42)_72%,rgba(8,8,8,0.78)_100%)]"
          />

          {!loaded && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="font-orbiter text-xs uppercase tracking-[0.25em] text-fg-brand">
                Opening the castle gates…
              </span>
            </div>
          )}

          {/* ================= 3 COMPACT EDGE-PLACED STORY CHAPTERS ================= */}
          <div className="pointer-events-none absolute inset-0 z-20 mx-auto max-w-7xl px-5 sm:px-10 lg:px-14">
            {/* 1. EVENT TIMELINE (Upper-right night sky beside castle towers) */}
            <motion.div
              style={{
                opacity: timelineOpacity,
                y: timelineY,
                filter: timelineFilter,
              }}
              className={`absolute inset-0 flex items-start justify-end px-5 pt-20 sm:px-10 sm:pt-24 lg:px-14 ${
                activeSection === 0
                  ? "pointer-events-auto"
                  : "pointer-events-none"
              }`}
            >
              <div className="w-full max-w-[280px] sm:max-w-[320px] drop-shadow-[0_3px_18px_rgba(0,0,0,0.95)]">
                <div className="mb-3.5 border-b border-white/15 pb-2.5">
                  <span className="font-orbiter inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-fg-brand">
                    <CalendarDays size={11} /> 01 / Event Timeline
                  </span>
                  <h2 className="mt-1 font-serif text-xl font-normal leading-tight text-zinc-100 sm:text-2xl">
                    Four days of{" "}
                    <em className="italic text-fg-brand">Technika.</em>
                  </h2>
                </div>

                {/* Vertical scroll-filled spine + compact Day 0..3 list */}
                <div className="relative flex gap-3.5">
                  <div
                    aria-hidden="true"
                    className="relative flex w-3 shrink-0 flex-col items-center py-0.5"
                  >
                    <div className="relative h-full w-[2px] overflow-hidden rounded-full bg-white/20">
                      <motion.div
                        style={{
                          scaleY: timelineFillScaleY,
                          transformOrigin: "top center",
                        }}
                        className="h-full w-full rounded-full bg-brand shadow-[0_0_12px_var(--brand)]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-2.5">
                    {TIMELINE_DAYS.map((item, idx) => {
                      const isReached = idx <= activeDayIndex;
                      return (
                        <motion.div
                          key={item.day}
                          style={{ opacity: dayOpacities[idx] }}
                          className={`border-b pb-2 last:border-b-0 last:pb-0 transition-colors duration-300 ${
                            isReached ? "border-brand/40" : "border-white/10"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-orbiter text-[10px] font-semibold uppercase tracking-[0.18em] text-fg-brand">
                              {item.day} · {item.subtitle}
                            </span>
                            <span
                              className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300 ${
                                idx === activeDayIndex
                                  ? "bg-brand shadow-[0_0_8px_var(--brand)]"
                                  : isReached
                                    ? "bg-brand/75"
                                    : "bg-white/25"
                              }`}
                            />
                          </div>
                          <p className="mt-0.5 text-[11px] leading-snug text-zinc-200/90">
                            {item.summary}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                <Link
                  href="/timeline"
                  className="font-orbiter mt-3 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-fg-brand hover:underline"
                >
                  Full Schedule <ArrowUpRight size={11} />
                </Link>
              </div>
            </motion.div>

            {/* 2. ABOUT EVENT (Left shadowed edge beside Platform 9 3/4, off train & steam) */}
            <motion.div
              style={{
                opacity: aboutEventOpacity,
                y: aboutEventY,
                filter: aboutEventFilter,
              }}
              className={`absolute inset-0 flex items-center justify-start px-5 pt-10 sm:px-10 lg:px-14 ${
                activeSection === 1
                  ? "pointer-events-auto"
                  : "pointer-events-none"
              }`}
            >
              <div className="w-full max-w-[285px] text-left sm:max-w-[330px] drop-shadow-[0_3px_18px_rgba(0,0,0,0.95)]">
                <span className="font-orbiter inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-fg-brand">
                  <Sparkles size={11} /> 02 / About Event
                </span>
                <h2 className="mt-1 font-serif text-xl font-normal leading-snug text-zinc-100 sm:text-2xl lg:text-[28px]">
                  Annual Tech Fest of{" "}
                  <em className="italic text-fg-brand">BIT Patna.</em>
                </h2>

                <p className="mt-2.5 text-xs leading-relaxed text-zinc-200/90 sm:text-[13px]">
                  BIT Patna&apos;s flagship festival celebrating innovation and
                  hands-on engineering through hackathons, robotics, workshops,
                  and industry talks.
                </p>

                {/* 30+ Events · 1000+ Participants · 10+ Colleges */}
                <div className="mt-4 grid grid-cols-3 divide-x divide-white/15 border-t border-white/15 pt-3.5">
                  {EVENT_STATS.map(({ value, label, icon: Icon }) => (
                    <div key={label} className="pr-2 first:pl-0 pl-2">
                      <div className="inline-flex items-center gap-1 font-serif text-lg font-bold text-fg-brand sm:text-2xl">
                        <Icon size={13} className="hidden shrink-0 sm:inline" />
                        <span>{value}</span>
                      </div>
                      <span className="font-orbiter mt-0.5 block text-[9px] uppercase tracking-[0.16em] text-zinc-200 sm:text-[10px]">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* 3. ABOUT BIT PATNA (Bottom-right dark mist below departing train) */}
            <motion.div
              style={{
                opacity: bitPatnaOpacity,
                y: bitPatnaY,
                filter: bitPatnaFilter,
              }}
              className={`absolute inset-0 flex items-end justify-end px-5 pb-10 sm:px-10 sm:pb-14 lg:px-14 ${
                activeSection === 2
                  ? "pointer-events-auto"
                  : "pointer-events-none"
              }`}
            >
              <div className="w-full max-w-[290px] text-right sm:max-w-[340px] drop-shadow-[0_3px_18px_rgba(0,0,0,0.95)]">
                <span className="font-orbiter inline-flex items-center justify-end gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-fg-brand">
                  <Landmark size={11} /> 03 / About BIT Patna
                </span>
                <h2 className="mt-1 font-serif text-xl font-normal leading-snug text-zinc-100 sm:text-2xl lg:text-[28px]">
                  BIT Patna <em className="italic text-fg-brand">Campus</em>
                </h2>

                <p className="mt-2.5 text-xs leading-relaxed text-zinc-200/90 sm:text-[13px]">
                  An extension of BIT Mesra fostering technical excellence,
                  research culture, and holistic student growth in Eastern
                  India.
                </p>

                {/* BIT Legacy · BIT Mesra Excellence · Modern Campus · Innovation & Growth */}
                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-white/15 pt-3.5 text-right">
                  {BIT_PILLARS.map(({ label, icon: Icon }) => (
                    <div
                      key={label}
                      className="flex items-center justify-end gap-1.5"
                    >
                      <span className="font-orbiter text-[10px] font-medium text-zinc-100 sm:text-[11px]">
                        {label}
                      </span>
                      <Icon size={12} className="shrink-0 text-fg-brand" />
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-end gap-4">
                  <Link
                    href="/contact"
                    className="font-orbiter inline-flex items-center gap-1 text-[11px] font-medium text-fg-brand hover:underline"
                  >
                    <span>Connect</span>
                    <ArrowUpRight size={12} />
                  </Link>
                  <Link
                    href="/registrations"
                    className="font-orbiter inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-on shadow-glow-brand transition-colors hover:bg-brand-hover"
                  >
                    <span>Explore Events</span>
                    <ArrowUpRight size={12} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          {children && (
            <div className="pointer-events-auto relative z-20 w-full">
              {children}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export default HogwartsScroll;
