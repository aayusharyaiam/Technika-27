"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { CDN_BASE_URL, FRAME_CONFIG, ANIMATION_CONFIG } from "@/lib/config";
import { useMagic } from "@/components/experience";
import { setHomeIntroCompleted } from "@/lib/intro-state";

const {
  COUNT: FRAME_COUNT,
  DPR_LIMIT,
  START_FRAME = 120,
  END_FRAME = 473,
} = FRAME_CONFIG;
const { LERP_FACTOR, LERP_THRESHOLD, SPRING: SPRING_CONFIG } = ANIMATION_CONFIG;

function pad5(n: number): string {
  return String(n).padStart(5, "0");
}

function getWebpSrc(i: number): string {
  const base = CDN_BASE_URL.replace(/\/+$/, "");
  const normalizedBase =
    base.startsWith("http") || base.startsWith("/") ? base : `/${base}`;
  return `${normalizedBase}/${pad5(i + 1)}.webp`;
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
    // Canvas is wider than image (landscape/ultrawide)
    dw = cw;
    dh = cw / imgAR;
  } else {
    // Canvas is taller than image (mobile portrait / tablet): cover 100% height with NO vertical gaps
    dh = ch;
    dw = ch * imgAR;
  }

  // Exact center cropping with ceil/floor to avoid sub-pixel gaps
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
    ctx.fillStyle = "#050505";
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

function preloadFrame(
  i: number,
  imagesRef: React.MutableRefObject<(HTMLImageElement | undefined)[]>,
): Promise<HTMLImageElement> {
  const safeIndex = Math.max(0, Math.min(FRAME_COUNT - 1, i));
  const existing = imagesRef.current[safeIndex];
  if (existing && existing.complete && existing.naturalWidth > 0) {
    return Promise.resolve(existing);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.src = getWebpSrc(safeIndex);

    img.onload = () => {
      imagesRef.current[safeIndex] = img;
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
      resolve(img);
    };
  });
}

function startProgressivePreload(
  imagesRef: React.MutableRefObject<(HTMLImageElement | undefined)[]>,
  startFrame: number,
  onFirstLoaded: () => void,
  cancelledRef: { current: boolean },
) {
  // Phase 1: Immediately fetch initial 25 forward frames with high priority
  const priorityCount = 25;
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

  // Phase 2: Background concurrent stream for remaining forward frames
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

  setTimeout(() => {
    if (cancelledRef.current) return;
    for (let c = 0; c < CONCURRENCY; c++) {
      worker();
    }
  }, 80);
}

export interface HogwartsScrollProps {
  children?: React.ReactNode;
  className?: string;
  trackHeight?: string;
}

export function HogwartsScroll({
  children,
  className = "",
  trackHeight = "h-[300vh]",
}: HogwartsScrollProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imagesRef = useRef<(HTMLImageElement | undefined)[]>([]);
  const targetFrameRef = useRef<number>(START_FRAME);
  const currentFrameRef = useRef<number>(START_FRAME);
  const lastDrawnFrameRef = useRef<number>(-1);
  const rafRef = useRef<number | null>(null);

  const [loaded, setLoaded] = useState(false);
  const { setReady } = useMagic();

  // Scroll tracking is scoped strictly to this component's track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, SPRING_CONFIG);

  const drawFrame = useCallback((index: number) => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    let img = imagesRef.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < FRAME_COUNT; offset++) {
        const lower = index - offset;
        if (
          lower >= 0 &&
          imagesRef.current[lower]?.complete &&
          imagesRef.current[lower]!.naturalWidth > 0
        ) {
          img = imagesRef.current[lower];
          break;
        }
        const higher = index + offset;
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
  }, []);

  const lookaheadBuffer = useCallback((centerFrame: number) => {
    const ahead = 20;
    for (let offset = 1; offset <= ahead; offset++) {
      const idx = centerFrame + offset;
      if (idx < FRAME_COUNT && !imagesRef.current[idx]) {
        preloadFrame(idx, imagesRef);
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
      drawFrame(Math.round(currentFrameRef.current));
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

    startProgressivePreload(
      imagesRef,
      START_FRAME,
      () => {
        if (cancelledRef.current) return;
        drawFrame(START_FRAME);
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
      drawFrame(START_FRAME);
    }, 1200);

    return () => {
      cancelledRef.current = true;
      clearTimeout(fallbackTimer);
    };
  }, [drawFrame, setReady]);

  useMotionValueEvent(smoothProgress, "change", (v) => {
    const nextTarget = Math.max(
      0,
      Math.min(FRAME_COUNT - 1, START_FRAME + v * (END_FRAME - START_FRAME)),
    );
    targetFrameRef.current = nextTarget;
    lookaheadBuffer(Math.round(nextTarget));
  });

  useEffect(() => {
    const tick = () => {
      const curr = currentFrameRef.current;
      const target = targetFrameRef.current;
      const diff = target - curr;

      if (Math.abs(diff) > LERP_THRESHOLD) {
        const step = diff * LERP_FACTOR;
        const next = Math.abs(diff) < 0.005 ? target : curr + step;
        currentFrameRef.current = next;

        const nextFrame = Math.round(next);
        if (nextFrame !== lastDrawnFrameRef.current) {
          drawFrame(nextFrame);
          lastDrawnFrameRef.current = nextFrame;
        }
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
      className={`relative w-full ${trackHeight} bg-transparent ${className}`}
      data-hogwarts-scroll="true"
    >
      {/* Sticky Viewport pinned inside this component only */}
      <div
        className="sticky top-0 left-0 w-full h-screen h-[100dvh] overflow-hidden pointer-events-none z-0"
        style={{
          height: "100dvh",
        }}
        aria-hidden="true"
      >
        <canvas
          ref={canvasRef}
          className="wizarding-canvas block w-full h-full"
          style={{ width: "100%", height: "100%", display: "block" }}
        />

        {/* Ambient subtle vignette overlay to match dark wizarding theme */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none"
        />
      </div>

      {/* Optional Overlay Content / Children */}
      {children && (
        <div className="relative z-10 w-full -mt-[100dvh] pointer-events-auto">
          {children}
        </div>
      )}
    </section>
  );
}

export default HogwartsScroll;
