"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

/* ==========================================================================
   ParticleLogo
   --------------------------------------------------------------------------
   A canvas of thousands of tiny dots that gather out of dust into your logo.

   - Dots are sampled from the non-transparent pixels of `src`, keeping the
     logo's own colours and gradient.
   - On load the dots drift in from a 3D cloud and settle into the shape.
   - Drag to spin the logo in 3D. The dots chase their targets on springs, so
     the shape smears and glows while it moves, then snaps back to the front.
   - Hover to push the dots around. Double-click to blast them apart and
     watch them gather again.

   Usage:
     <div style={{ width: "100%", height: "70vh" }}>
       <ParticleLogo src="/hufflepuff.png" />
     </div>

   The canvas fills its parent, so give the parent a size.
   ========================================================================== */

const TAU = Math.PI * 2;
const CAM = 3.2; // camera distance, in logo-heights
const DAMP = 0.84; // per-frame velocity damping for smoother, slower drift
const THICKNESS = 0.05; // how deep the logo slab is (so it has an edge when spun edge-on)

/* ------------------------------- types ---------------------------------- */

interface ParticleSet {
  n: number;
  aspect: number;
  fillRatio: number;
  // home positions (the logo shape)
  hx: Float32Array;
  hy: Float32Array;
  hz: Float32Array;
  // current positions
  x: Float32Array;
  y: Float32Array;
  z: Float32Array;
  // velocities
  vx: Float32Array;
  vy: Float32Array;
  vz: Float32Array;
  ks: Float32Array; // spring stiffness per dot
  delay: Float32Array; // start delay per dot, in frames
  cr: Float32Array;
  cg: Float32Array;
  cb: Float32Array; // colour per dot
}

interface Frame {
  u8: Uint8ClampedArray;
  u32: Uint32Array;
  imageData: ImageData;
  bg: number;
}

interface Pointer {
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
  down: boolean;
  radius: number;
}

export interface ParticleLogoProps {
  /** Path to your logo. In Next.js, put it in /public. */
  src?: string;
  /** Dot count. Defaults to 70k on desktop and 38k on small screens. */
  particles?: number;
  /** Dot size in CSS px. */
  dotSize?: number;
  /** Hex colour behind the dots. Match your page background. */
  background?: string;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
}

/* ------------------------------ engine ---------------------------------- */

// Pick `count` random dots from the logo's solid pixels.
function extractPoints(
  imageData: ImageData,
  count: number,
): ParticleSet | null {
  const { data, width, height } = imageData;
  const solid: number[] = [];
  let minX = width,
    maxX = 0,
    minY = height,
    maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (data[i + 3] < 128) continue;
      const r = data[i],
        g = data[i + 1],
        b = data[i + 2];
      // ignore white / grey pixels so a white background can't sneak in
      if (Math.max(r, g, b) - Math.min(r, g, b) < 50) continue;
      solid.push(y * width + x);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  if (!solid.length) return null;

  const bw = maxX - minX + 1;
  const bh = maxY - minY + 1;
  const cx = (minX + maxX + 1) / 2;
  const cy = (minY + maxY + 1) / 2;

  const P: ParticleSet = {
    n: count,
    aspect: bw / bh,
    fillRatio: solid.length / (bw * bh),
    hx: new Float32Array(count),
    hy: new Float32Array(count),
    hz: new Float32Array(count),
    x: new Float32Array(count),
    y: new Float32Array(count),
    z: new Float32Array(count),
    vx: new Float32Array(count),
    vy: new Float32Array(count),
    vz: new Float32Array(count),
    ks: new Float32Array(count),
    delay: new Float32Array(count),
    cr: new Float32Array(count),
    cg: new Float32Array(count),
    cb: new Float32Array(count),
  };

  for (let i = 0; i < count; i++) {
    const idx = solid[(Math.random() * solid.length) | 0];
    const px = idx % width;
    const py = (idx / width) | 0;
    P.hx[i] = (px + Math.random() - cx) / bh; // logo height = 1 unit
    P.hy[i] = (py + Math.random() - cy) / bh;
    P.hz[i] = (Math.random() - 0.5) * THICKNESS;
    P.ks[i] = 0.012 + Math.random() * 0.024; // varied low stiffness = slow, graceful trailing
    const o = idx * 4;
    const jitter = 0.6 + Math.random() * 0.55; // grain
    P.cr[i] = Math.min(255, data[o] * jitter);
    P.cg[i] = Math.min(255, data[o + 1] * jitter);
    P.cb[i] = Math.min(255, data[o + 2] * jitter);
  }
  return P;
}

// Put every dot in a loose 3D dust cloud, each with its own start delay.
// Put every dot in a loose 3D dust cloud that fits inside the canvas.
// halfWu / halfHu = half the canvas size in logo units.
function scatter(
  P: ParticleSet,
  formed: boolean,
  halfWu = 2,
  halfHu = 1.5,
): void {
  for (let i = 0; i < P.n; i++) {
    P.vx[i] = P.vy[i] = P.vz[i] = 0;
    if (formed) {
      P.x[i] = P.hx[i];
      P.y[i] = P.hy[i];
      P.z[i] = P.hz[i];
      P.delay[i] = 0;
      continue;
    }
    const a = Math.random() * TAU;
    // soft Gaussian cloud: flat in the middle, fading out toward the canvas edge
    let rr = 0.34 * Math.sqrt(-2 * Math.log(1 - Math.random()));
    if (rr > 0.95) rr = Math.random() * 0.95; // rare strays go inside instead
    const z = (Math.random() * 2 - 1) * 1.2;
    const persp = CAM / (CAM - z);
    P.x[i] = (Math.cos(a) * rr * halfWu) / persp;
    P.y[i] = (Math.sin(a) * rr * halfHu) / persp;
    P.z[i] = z;
    P.vx[i] = (Math.random() - 0.5) * 0.003;
    P.vy[i] = (Math.random() - 0.5) * 0.003;
    P.vz[i] = (Math.random() - 0.5) * 0.003;
    P.delay[i] = Math.random() * 70; // frames at 60fps, so about 1.2s of staggering
  }
}

// Blast the dots outward from where they are; the springs pull them back.
function burst(P: ParticleSet): void {
  for (let i = 0; i < P.n; i++) {
    const a = Math.random() * TAU;
    const b = Math.acos(2 * Math.random() - 1);
    const s = 0.05 + Math.random() * 0.22;
    P.vx[i] += Math.sin(b) * Math.cos(a) * s * 1.4;
    P.vy[i] += Math.sin(b) * Math.sin(a) * s;
    P.vz[i] += Math.cos(b) * s;
    P.delay[i] = 0;
  }
}

// Advance the simulation one tick.
function step(
  P: ParticleSet,
  dtn: number,
  ry: number,
  rx: number,
  ptr: Pointer,
  S: number,
  W: number,
  H: number,
): void {
  const cy = Math.cos(ry),
    sy = Math.sin(ry);
  const cx = Math.cos(rx),
    sx = Math.sin(rx);
  const damp = Math.pow(DAMP, dtn);
  const hasPointer = ptr.active && !ptr.down;
  const rad = ptr.radius;
  const rad2 = rad * rad;
  const halfW = W * 0.5,
    halfH = H * 0.5;

  for (let i = 0; i < P.n; i++) {
    if (P.delay[i] > 0) {
      P.delay[i] -= dtn;
      P.x[i] += P.vx[i] * dtn;
      P.y[i] += P.vy[i] * dtn;
      P.z[i] += P.vz[i] * dtn;
      continue;
    }

    // where this dot wants to be: its home spot, rotated in 3D
    const hx = P.hx[i],
      hy = P.hy[i],
      hz = P.hz[i];
    const x1 = hx * cy + hz * sy;
    const z1 = -hx * sy + hz * cy;
    const tx = x1;
    const ty = hy * cx - z1 * sx;
    const tz = hy * sx + z1 * cx;

    const k = P.ks[i] * dtn;
    let vx = P.vx[i] + (tx - P.x[i]) * k;
    let vy = P.vy[i] + (ty - P.y[i]) * k;
    let vz = P.vz[i] + (tz - P.z[i]) * k;

    if (hasPointer) {
      const persp = CAM / Math.max(0.4, CAM - P.z[i]);
      const dx = halfW + P.x[i] * S * persp - ptr.x;
      const dy = halfH + P.y[i] * S * persp - ptr.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < rad2) {
        const d = Math.sqrt(d2) + 1e-3;
        const f = 1 - d / rad;
        const f2 = f * f;
        // shove away from the cursor, and drag along with its motion
        vx += (dx / d) * f2 * 0.012 * dtn + (ptr.vx / S) * f2 * 0.35;
        vy += (dy / d) * f2 * 0.012 * dtn + (ptr.vy / S) * f2 * 0.35;
        vz += (Math.random() - 0.5) * 0.012 * f2;
      }
    }

    vx *= damp;
    vy *= damp;
    vz *= damp;
    P.vx[i] = vx;
    P.vy[i] = vy;
    P.vz[i] = vz;
    P.x[i] += vx * dtn;
    P.y[i] += vy * dtn;
    P.z[i] += vz * dtn;
  }
}

// Splat every dot into the pixel buffer, additively. Overlaps glow.
function render(
  P: ParticleSet,
  frame: Frame,
  W: number,
  H: number,
  S: number,
  dot: number,
  weight: number,
): void {
  const { u8, u32, bg } = frame;
  u32.fill(bg);
  const halfW = W * 0.5,
    halfH = H * 0.5,
    halfDot = dot * 0.5;
  const fade = Math.max(1, Math.min(W, H) * 0.1); // px over which dots fade out at the border

  for (let i = 0; i < P.n; i++) {
    const dz = CAM - P.z[i];
    if (dz < 0.4) continue;
    const persp = CAM / dz;
    const fx = halfW + P.x[i] * S * persp - halfDot;
    const fy = halfH + P.y[i] * S * persp - halfDot;
    if (fx < 0 || fy < 0 || fx > W - dot || fy > H - dot) continue;
    const px = fx | 0;
    const py = fy | 0;

    const vx = P.vx[i],
      vy = P.vy[i],
      vz = P.vz[i];
    const speed = Math.sqrt(vx * vx + vy * vy + vz * vz);
    let shade = 1 + (persp - 1) * 1.5; // nearer = brighter
    shade = shade < 0.45 ? 0.45 : shade > 1.25 ? 1.25 : shade;
    let edge = Math.min(fx, fy, W - dot - fx, H - dot - fy) / fade;
    edge = edge >= 1 ? 1 : edge * edge * (3 - 2 * edge); // smooth fade near the border
    const k = shade * weight * edge * (1 + Math.min(speed * 14, 1) * 0.7); // moving dots flare up
    const r = P.cr[i] * k,
      g = P.cg[i] * k,
      b = P.cb[i] * k;

    for (let yy = 0; yy < dot; yy++) {
      let o = ((py + yy) * W + px) * 4;
      for (let xx = 0; xx < dot; xx++) {
        u8[o] += r;
        u8[o + 1] += g;
        u8[o + 2] += b;
        o += 4;
      }
    }
  }
}

function parseColor(input: string): [number, number, number] {
  let h = String(input || "#000")
    .trim()
    .replace("#", "");
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  const n = parseInt(h, 16);
  if (Number.isNaN(n) || h.length !== 6) return [0, 0, 0];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// Turns the additive glow into real transparency: brightness becomes alpha.
function resolveAlpha(frame: Frame): void {
  const { u8, u32 } = frame;
  for (let i = 0; i < u32.length; i++) {
    if (u32[i] === 0) continue; // empty pixel, stays transparent
    const o = i * 4;
    const r = u8[o],
      g = u8[o + 1],
      b = u8[o + 2];
    const m = r > g ? (r > b ? r : b) : g > b ? g : b;
    if (m === 0) continue;
    const s = 255 / m;
    u8[o] = r * s;
    u8[o + 1] = g * s;
    u8[o + 2] = b * s;
    u8[o + 3] = m;
  }
}
/* ----------------------------- component -------------------------------- */

export default function ParticleLogo({
  src = "/images/hufflepuff.png",
  particles,
  dotSize = 1,
  background = "transparent",
  className,
  style,
  ariaLabel = "Logo made of gathering particles",
}: ParticleLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const transparent = background === "transparent";

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: transparent });
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const [bgR, bgG, bgB] = parseColor(background);

    let cancelled = false;
    let raf = 0;
    let P: ParticleSet | null = null;
    let frame: Frame | null = null;
    let W = 1,
      H = 1,
      S = 1,
      dot = 2,
      weight = 1,
      dpr = 1;

    const rot = { y: 0, x: 0, vy: 0, vx: 0 };
    const ptr: Pointer = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      active: false,
      down: false,
      radius: 0,
    };

    // size the buffer to the canvas, and work out scale + brightness
    const layout = (): void => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.round(rect.width * dpr));
      H = Math.max(1, Math.round(rect.height * dpr));
      canvas.width = W;
      canvas.height = H;

      const imageData = ctx.createImageData(W, H);
      frame = {
        u8: imageData.data,
        u32: new Uint32Array(imageData.data.buffer),
        imageData,
        bg: transparent
          ? 0
          : ((255 << 24) | (bgB << 16) | (bgG << 8) | bgR) >>> 0,
      };

      const aspect = P ? P.aspect : 1.26;
      S = Math.min((W * 0.74) / aspect, H * 0.74); // pixels per logo-height
      dot = Math.max(1, Math.round(dotSize * dpr));
      ptr.radius = S * 0.16;

      if (P) {
        // keep overall brightness steady whatever the dot count or screen size
        const logoPx = P.fillRatio * P.aspect * S * S;
        const coverage = (P.n * dot * dot) / Math.max(1, logoPx);
        weight = Math.min(1, Math.max(0.12, 1.15 / coverage));
      }
    };

    // load the logo and turn it into dots
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;
      const scale = Math.min(
        1,
        900 / Math.max(img.naturalWidth, img.naturalHeight),
      );
      const off = document.createElement("canvas");
      off.width = Math.max(1, Math.round(img.naturalWidth * scale));
      off.height = Math.max(1, Math.round(img.naturalHeight * scale));
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;
      octx.drawImage(img, 0, 0, off.width, off.height);

      const rect = canvas.getBoundingClientRect();
      const count = particles || (rect.width < 640 ? 8000 : 14000);
      P = extractPoints(octx.getImageData(0, 0, off.width, off.height), count);
      if (!P) return;
      layout(); // works out the scale from the logo's shape
      scatter(P, reduceMotion, W / (2 * S), H / (2 * S));
    };
    img.onerror = () => console.warn(`ParticleLogo: could not load "${src}"`);
    img.src = src;

    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(canvas);

    // pointer: drag spins the logo, hover pushes the dots
    const toDevice = (e: PointerEvent): [number, number] => {
      const r = canvas.getBoundingClientRect();
      return [
        (e.clientX - r.left) * (W / r.width),
        (e.clientY - r.top) * (H / r.height),
      ];
    };
    const onEnter = (e: PointerEvent): void => {
      [ptr.x, ptr.y] = toDevice(e);
      ptr.vx = ptr.vy = 0;
      ptr.active = true;
    };
    const onLeave = (): void => {
      ptr.active = false;
    };
    const MAX_STEP = 60; // max px counted per move event, so a jump can't fling the logo
    const clamp = (v: number, m: number): number =>
      Math.max(-m, Math.min(m, v));

    // one place that always ends a drag cleanly
    const endDrag = (): void => {
      if (!ptr.down) return;
      ptr.down = false;
      canvas.style.cursor = "grab";
      rot.vy = clamp(rot.vy, 0.3); // cap the fling so it can't spin away
      rot.vx = clamp(rot.vx, 0.3);
    };

    const onDown = (e: PointerEvent): void => {
      if (e.pointerType === "mouse" && e.button !== 0) return; // right-click must not start a drag
      ptr.down = true;
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      canvas.style.cursor = "grabbing";
      [ptr.x, ptr.y] = toDevice(e);
      rot.vy = rot.vx = 0;
    };

    const onMove = (e: PointerEvent): void => {
      // the button was released somewhere we never heard about
      if (ptr.down && e.buttons === 0) endDrag();

      const [x, y] = toDevice(e);
      const dx = x - ptr.x,
        dy = y - ptr.y;
      ptr.vx = ptr.vx * 0.6 + dx * 0.4;
      ptr.vy = ptr.vy * 0.6 + dy * 0.4;
      ptr.x = x;
      ptr.y = y;
      ptr.active = true;
      if (ptr.down) {
        const ay = clamp(dx / dpr, MAX_STEP) * 0.009;
        const ax = -clamp(dy / dpr, MAX_STEP) * 0.006;
        rot.y += ay;
        rot.x = Math.max(-1.1, Math.min(1.1, rot.x + ax));
        rot.vy = rot.vy * 0.5 + ay * 0.5;
        rot.vx = rot.vx * 0.5 + ax * 0.5;
      }
    };

    const onUp = (e: PointerEvent): void => {
      endDrag();
      try {
        if (canvas.hasPointerCapture(e.pointerId))
          canvas.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };
    // const onDouble = (): void => {
    //   if (P) burst(P);
    // };

    canvas.addEventListener("pointerenter", onEnter);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    // canvas.addEventListener("dblclick", onDouble);
    canvas.addEventListener("lostpointercapture", endDrag);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    window.addEventListener("blur", endDrag);
    document.addEventListener("visibilitychange", endDrag);

    // main loop
    let last = performance.now();
    let clock = 0;
    const tick = (now: number): void => {
      raf = requestAnimationFrame(tick);
      const dtn = Math.min((now - last) / 16.667, 3); // 1 = one 60fps frame
      last = now;
      clock += dtn;
      if (!P || !frame) return;

      // rotation: follow the drag, then coast and gently spring back to facing front
      if (!ptr.down) {
        const turns = Math.round((rot.y + rot.vy * 18) / TAU); // land on the nearest front-facing turn
        const targetY =
          turns * TAU + (reduceMotion ? 0 : Math.sin(clock * 0.008) * 0.045);
        rot.vy += (targetY - rot.y) * 0.009 * dtn;
        rot.vx += (0 - rot.x) * 0.012 * dtn;
        const d = Math.pow(0.9, dtn);
        rot.vy *= d;
        rot.vx *= d;
        rot.y += rot.vy * dtn;
        rot.x += rot.vx * dtn;
      }
      ptr.vx *= Math.pow(0.85, dtn);
      ptr.vy *= Math.pow(0.85, dtn);

      step(P, dtn, rot.y, rot.x, ptr, S, W, H);
      render(P, frame, W, H, S, dot, weight);
      if (transparent) resolveAlpha(frame);
      ctx.putImageData(frame.imageData, 0, 0);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerenter", onEnter);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      // canvas.removeEventListener("dblclick", onDouble);
      canvas.removeEventListener("lostpointercapture", endDrag);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
      window.removeEventListener("blur", endDrag);
      document.removeEventListener("visibilitychange", endDrag);
    };
  }, [src, particles, dotSize, background]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={ariaLabel}
      className={className}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        cursor: "grab",
        touchAction: "pan-y",
        backgroundImage: "transparent", // vertical swipes still scroll the page on touch screens
        ...style,
      }}
    />
  );
}
