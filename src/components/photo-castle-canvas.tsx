"use client";

import { useEffect, useRef } from "react";

const SOURCE_WIDTH = 2000;
const SOURCE_HEIGHT = 1063;
const SOURCE_URL = "/images/hogwarts.webp";

type SceneMode = "loading" | "background";

type PhotoCanvasProps = {
  mode: SceneMode;
  progress?: number;
  motionEnabled?: boolean;
  className?: string;
};

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function drawScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  image: HTMLImageElement | null,
  progress: number,
  scrollProgress: number,
  pointer: { x: number; y: number },
) {
  const reveal = clamp(progress);
  const zoom = 1 + clamp(scrollProgress) * 0.18;
  const scale = Math.max(width / SOURCE_WIDTH, height / SOURCE_HEIGHT) * zoom;
  const focusX = SOURCE_WIDTH * 0.5;
  const focusY = SOURCE_HEIGHT * (0.48 + clamp(scrollProgress) * 0.08);
  const x = width * 0.5 - focusX * scale + pointer.x;
  const y = height * 0.5 - focusY * scale + pointer.y;

  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#020611");
  sky.addColorStop(0.58, "#0c172c");
  sky.addColorStop(1, "#030711");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  if (image) {
    ctx.save();
    ctx.globalAlpha = reveal;
    ctx.filter = "saturate(1.08) contrast(1.06) brightness(0.78)";
    ctx.drawImage(image, x, y, SOURCE_WIDTH * scale, SOURCE_HEIGHT * scale);
    ctx.restore();
  }

  const veil = ctx.createLinearGradient(0, 0, 0, height);
  veil.addColorStop(0, "rgba(1, 4, 15, 0.22)");
  veil.addColorStop(0.55, "rgba(5, 13, 27, 0.02)");
  veil.addColorStop(1, "rgba(1, 2, 8, 0.76)");
  ctx.fillStyle = veil;
  ctx.fillRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(width * 0.52, height * 0.48, 0, width * 0.52, height * 0.48, width * 0.42);
  glow.addColorStop(0, "rgba(234, 184, 103, 0.15)");
  glow.addColorStop(1, "rgba(234, 184, 103, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  const vignette = ctx.createRadialGradient(width * 0.5, height * 0.45, Math.min(width, height) * 0.18, width * 0.5, height * 0.46, Math.max(width, height) * 0.78);
  vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  vignette.addColorStop(1, "rgba(0, 2, 8, 0.64)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
}

export function PhotoWizardingCanvas({ mode, progress = 1, motionEnabled = true, className = "" }: PhotoCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(clamp(progress));

  useEffect(() => {
    progressRef.current = clamp(progress);
  }, [progress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let scrollProgress = 0;
    let image: HTMLImageElement | null = null;
    const pointer = { x: 0, y: 0 };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const draw = () => {
      if (!width || !height) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      drawScene(ctx, width, height, image, progressRef.current, scrollProgress, pointer);
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      draw();
    };

    const onScroll = () => {
      if (mode === "background") scrollProgress = clamp(window.scrollY / Math.max(window.innerHeight * 2.15, 1));
      canvas.dataset.scrollProgress = scrollProgress.toFixed(3);
      draw();
    };

    const onPointer = (event: PointerEvent) => {
      if (!motionEnabled || reducedMotion.matches) return;
      pointer.x = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 18;
      pointer.y = (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 12;
      draw();
    };

    const resetPointer = () => { pointer.x = 0; pointer.y = 0; draw(); };
    image = new Image();
    image.decoding = "async";
    image.onload = () => { canvas.dataset.imageReady = "true"; draw(); };
    image.onerror = () => { canvas.dataset.imageReady = "false"; draw(); };
    image.src = SOURCE_URL;
    canvas.dataset.canvasSource = SOURCE_URL;
    canvas.dataset.imageLayers = "sky,castle,water,forest,mist,portal-interior";
    canvas.dataset.imageReady = "false";

    resize();
    onScroll();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("blur", resetPointer);

    const animate = () => {
      draw();
      if (!reducedMotion.matches && (mode === "loading" || motionEnabled)) frame = window.requestAnimationFrame(animate);
    };
    if (!reducedMotion.matches && (mode === "loading" || motionEnabled)) frame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frame);
      image = null;
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("blur", resetPointer);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [mode, motionEnabled]);

  return <canvas ref={canvasRef} className={`wizarding-canvas ${className}`.trim()} data-canvas-scene={mode} aria-hidden="true" />;
}
