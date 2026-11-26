import { useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { CDN_BASE_URL, FRAME_CONFIG, ANIMATION_CONFIG } from "@/lib/config";

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
