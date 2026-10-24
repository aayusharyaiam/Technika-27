"use client";

import { useEffect, useRef } from "react";

const SOURCE_WIDTH = 2000;
const SOURCE_HEIGHT = 1063;
const SOURCE_URL = "/images/hogwarts.jpg";

type SceneMode = "loading" | "background";

type PhotoCanvasProps = {
  mode: SceneMode;
  progress?: number;
  motionEnabled?: boolean;
  className?: string;
};

type Point = { x: number; y: number };

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Transform = {
  x: number;
  y: number;
  scale: number;
};

type SceneOptions = {
  mode: SceneMode;
  image: HTMLImageElement | null;
  loadProgress: number;
  scrollProgress: number;
  time: number;
  pointerX: number;
  pointerY: number;
};

const IMAGE_LAYERS = [
  "sky",
  "cloud-bank",
  "moon",
  "west-towers",
  "central-towers",
  "right-towers",
  "castle-windows",
  "water-reflection",
  "mist",
  "left-forest",
  "right-forest",
  "portal-interior",
] as const;

const MOON_REGION: Rect = { x: 945, y: 118, width: 300, height: 300 };
const CASTLE_REGION: Rect = { x: 250, y: 90, width: 1240, height: 660 };
const WEST_TOWERS_REGION: Rect = { x: 250, y: 70, width: 710, height: 670 };
const CENTRAL_TOWERS_REGION: Rect = { x: 760, y: 220, width: 390, height: 540 };
const RIGHT_TOWERS_REGION: Rect = { x: 970, y: 210, width: 530, height: 560 };
const WATER_REGION: Rect = { x: 0, y: 760, width: SOURCE_WIDTH, height: 303 };
const LEFT_FOREST_REGION: Rect = { x: 0, y: 650, width: 860, height: 413 };
const RIGHT_FOREST_REGION: Rect = { x: 1350, y: 590, width: 650, height: 473 };
const PORTAL_REGION: Rect = { x: 990, y: 410, width: 500, height: 420 };

const CASTLE_MASK: Point[] = [
  { x: 250, y: 680 },
  { x: 290, y: 560 },
  { x: 350, y: 450 },
  { x: 408, y: 425 },
  { x: 452, y: 326 },
  { x: 478, y: 430 },
  { x: 530, y: 405 },
  { x: 575, y: 372 },
  { x: 584, y: 160 },
  { x: 604, y: 116 },
  { x: 625, y: 166 },
  { x: 654, y: 136 },
  { x: 698, y: 94 },
  { x: 748, y: 268 },
  { x: 790, y: 290 },
  { x: 818, y: 474 },
  { x: 870, y: 470 },
  { x: 918, y: 286 },
  { x: 972, y: 460 },
  { x: 1015, y: 518 },
  { x: 1046, y: 322 },
  { x: 1081, y: 410 },
  { x: 1120, y: 258 },
  { x: 1168, y: 442 },
  { x: 1196, y: 396 },
  { x: 1244, y: 505 },
  { x: 1288, y: 454 },
  { x: 1340, y: 510 },
  { x: 1402, y: 500 },
  { x: 1465, y: 602 },
  { x: 1485, y: 740 },
  { x: 250, y: 740 },
];

const WEST_TOWERS_MASK: Point[] = [
  { x: 310, y: 650 },
  { x: 350, y: 440 },
  { x: 448, y: 410 },
  { x: 500, y: 328 },
  { x: 542, y: 394 },
  { x: 570, y: 170 },
  { x: 605, y: 112 },
  { x: 636, y: 180 },
  { x: 682, y: 100 },
  { x: 746, y: 270 },
  { x: 790, y: 310 },
  { x: 812, y: 650 },
];

const CENTRAL_TOWERS_MASK: Point[] = [
  { x: 760, y: 700 },
  { x: 800, y: 458 },
  { x: 840, y: 390 },
  { x: 890, y: 286 },
  { x: 930, y: 410 },
  { x: 978, y: 302 },
  { x: 1020, y: 424 },
  { x: 1070, y: 360 },
  { x: 1118, y: 470 },
  { x: 1155, y: 700 },
];

const RIGHT_TOWERS_MASK: Point[] = [
  { x: 980, y: 720 },
  { x: 1034, y: 430 },
  { x: 1080, y: 326 },
  { x: 1120, y: 414 },
  { x: 1162, y: 260 },
  { x: 1202, y: 438 },
  { x: 1244, y: 398 },
  { x: 1290, y: 508 },
  { x: 1340, y: 450 },
  { x: 1410, y: 510 },
  { x: 1490, y: 640 },
  { x: 1490, y: 720 },
];

const LEFT_FOREST_MASK: Point[] = [
  { x: 0, y: 682 },
  { x: 130, y: 694 },
  { x: 275, y: 726 },
  { x: 392, y: 778 },
  { x: 500, y: 860 },
  { x: 630, y: 922 },
  { x: 860, y: 968 },
  { x: 860, y: SOURCE_HEIGHT },
  { x: 0, y: SOURCE_HEIGHT },
];

const RIGHT_FOREST_MASK: Point[] = [
  { x: 1350, y: 652 },
  { x: 1508, y: 678 },
  { x: 1600, y: 700 },
  { x: 1700, y: 680 },
  { x: 1800, y: 710 },
  { x: 1900, y: 680 },
  { x: SOURCE_WIDTH, y: 692 },
  { x: SOURCE_WIDTH, y: SOURCE_HEIGHT },
  { x: 1350, y: SOURCE_HEIGHT },
];

const SOURCE_POINT = {
  moon: { x: 1074, y: 252 },
  entry: { x: 1190, y: 645 },
};

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function lerp(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

function smoothstep(value: number) {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - clamp(value), 3);
}

function rgba(hex: string, alpha: number) {
  const value = hex.replace("#", "");
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${clamp(alpha)})`;
}

function polygon(ctx: CanvasRenderingContext2D, points: Point[]) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (const point of points.slice(1)) ctx.lineTo(point.x, point.y);
  ctx.closePath();
}

function drawGlow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  alpha: number,
) {
  const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
  glow.addColorStop(0, rgba(color, alpha));
  glow.addColorStop(0.46, rgba(color, alpha * 0.24));
  glow.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function getCoverTransform(
  width: number,
  height: number,
  zoom: number,
  focus: Point,
  pointerX: number,
  pointerY: number,
): Transform {
  const scale = Math.max(width / SOURCE_WIDTH, height / SOURCE_HEIGHT) * zoom;
  return {
    scale,
    x: width * 0.5 - focus.x * scale + pointerX,
    y: height * 0.48 - focus.y * scale + pointerY,
  };
}

function withTransform(
  ctx: CanvasRenderingContext2D,
  transform: Transform,
  paint: () => void,
) {
  ctx.save();
  ctx.translate(transform.x, transform.y);
  ctx.scale(transform.scale, transform.scale);
  paint();
  ctx.restore();
}

function drawPhoto(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  transform: Transform,
  alpha = 1,
  filter = "none",
) {
  withTransform(ctx, transform, () => {
    ctx.globalAlpha = alpha;
    ctx.filter = filter;
    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      SOURCE_WIDTH,
      SOURCE_HEIGHT,
    );
    ctx.filter = "none";
  });
}

function drawPhotoRegion(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  region: Rect,
  transform: Transform,
  alpha = 1,
  offsetX = 0,
  offsetY = 0,
  extraScale = 1,
  composite: GlobalCompositeOperation = "source-over",
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = composite;
  ctx.translate(transform.x + offsetX, transform.y + offsetY);
  ctx.scale(transform.scale * extraScale, transform.scale * extraScale);
  ctx.drawImage(
    image,
    region.x,
    region.y,
    region.width,
    region.height,
    region.x,
    region.y,
    region.width,
    region.height,
  );
  ctx.restore();
}

function drawMaskedRegion(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  region: Rect,
  mask: Point[],
  transform: Transform,
  alpha = 1,
  offsetX = 0,
  offsetY = 0,
  extraScale = 1,
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(transform.x + offsetX, transform.y + offsetY);
  ctx.scale(transform.scale * extraScale, transform.scale * extraScale);
  polygon(ctx, mask);
  ctx.clip();
  ctx.drawImage(
    image,
    region.x,
    region.y,
    region.width,
    region.height,
    region.x,
    region.y,
    region.width,
    region.height,
  );
  ctx.restore();
}

function drawMoonLayer(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  transform: Transform,
  alpha: number,
  pointerX: number,
  pointerY: number,
  time: number,
) {
  const moonX = transform.x + SOURCE_POINT.moon.x * transform.scale;
  const moonY = transform.y + SOURCE_POINT.moon.y * transform.scale;
  const moonRadius = 34 * transform.scale;
  drawGlow(ctx, moonX, moonY, moonRadius * 4.8, "#b9edee", alpha * 0.24);

  ctx.save();
  ctx.globalAlpha = alpha * 0.92;
  ctx.translate(
    transform.x + pointerX * 0.16,
    transform.y + pointerY * 0.12 + Math.sin(time * 0.00022) * transform.scale * 4,
  );
  ctx.scale(transform.scale, transform.scale);
  ctx.beginPath();
  ctx.arc(SOURCE_POINT.moon.x, SOURCE_POINT.moon.y, 39, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(
    image,
    MOON_REGION.x,
    MOON_REGION.y,
    MOON_REGION.width,
    MOON_REGION.height,
    MOON_REGION.x,
    MOON_REGION.y,
    MOON_REGION.width,
    MOON_REGION.height,
  );
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = alpha * 0.18;
  ctx.strokeStyle = "rgba(232, 250, 245, 0.9)";
  ctx.lineWidth = Math.max(1, transform.scale * 1.4);
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonRadius * 1.08, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawSkyLayers(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  transform: Transform,
  alpha: number,
  pointerX: number,
  pointerY: number,
  entry: number,
) {
  const farTransform: Transform = {
    ...transform,
    x: transform.x + pointerX * 0.08,
    y: transform.y + pointerY * 0.06 - entry * 8,
    scale: transform.scale * 1.002,
  };
  drawPhotoRegion(
    ctx,
    image,
    { x: 0, y: 0, width: SOURCE_WIDTH, height: 520 },
    farTransform,
    alpha * 0.18,
    0,
    0,
    1,
    "screen",
  );

  const cloudTransform: Transform = {
    ...transform,
    x: transform.x + pointerX * 0.13,
    y: transform.y + pointerY * 0.1 - entry * 14,
    scale: transform.scale * 1.006,
  };
  drawPhotoRegion(
    ctx,
    image,
    { x: 0, y: 86, width: SOURCE_WIDTH, height: 360 },
    cloudTransform,
    alpha * 0.16,
    0,
    0,
    1,
    "screen",
  );
}

function drawWaterLayer(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  transform: Transform,
  alpha: number,
  pointerX: number,
  pointerY: number,
  time: number,
  entry: number,
) {
  const waterTransform: Transform = {
    ...transform,
    x: transform.x + pointerX * 0.26,
    y: transform.y + pointerY * 0.18 + entry * 20,
    scale: transform.scale * 1.003,
  };
  drawPhotoRegion(
    ctx,
    image,
    WATER_REGION,
    waterTransform,
    alpha * (0.24 - entry * 0.12),
    0,
    0,
    1,
    "screen",
  );

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = alpha * (0.1 - entry * 0.04);
  for (let index = 0; index < 13; index++) {
    const y = 800 + index * 17 + Math.sin(time * 0.0005 + index) * 4;
    const x = 950 + Math.sin(index * 1.35) * 160;
    const width = 42 + (index % 4) * 19;
    const reflection = ctx.createLinearGradient(x - width, y, x + width, y);
    reflection.addColorStop(0, "rgba(255, 227, 154, 0)");
    reflection.addColorStop(0.5, "rgba(245, 203, 123, 0.52)");
    reflection.addColorStop(1, "rgba(255, 227, 154, 0)");
    ctx.fillStyle = reflection;
    ctx.fillRect(x - width, y, width * 2, 1.4);
  }
  ctx.restore();
}

function drawFoliageLayer(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  transform: Transform,
  alpha: number,
  pointerX: number,
  pointerY: number,
  time: number,
  entry: number,
) {
  const nearOffset = entry * 88;
  drawMaskedRegion(
    ctx,
    image,
    LEFT_FOREST_REGION,
    LEFT_FOREST_MASK,
    transform,
    alpha * 0.66,
    -pointerX * 0.38 - nearOffset,
    -pointerY * 0.24,
    1.012,
  );
  drawMaskedRegion(
    ctx,
    image,
    RIGHT_FOREST_REGION,
    RIGHT_FOREST_MASK,
    transform,
    alpha * 0.74,
    pointerX * 0.42 + nearOffset,
    pointerY * 0.28,
    1.016,
  );

  ctx.save();
  ctx.globalAlpha = alpha * 0.72;
  ctx.translate(pointerX * 0.56, pointerY * 0.4 + entry * 72);
  ctx.strokeStyle = "rgba(1, 4, 10, 0.92)";
  ctx.lineCap = "round";
  ctx.lineWidth = Math.max(18, transform.scale * 32);
  ctx.beginPath();
  ctx.moveTo(-20, 1050);
  ctx.bezierCurveTo(50, 820, 60, 590, 190, 360);
  ctx.bezierCurveTo(255, 250, 268, 126, 342, -30);
  ctx.moveTo(2020, 1060);
  ctx.bezierCurveTo(1940, 820, 1945, 590, 1810, 350);
  ctx.bezierCurveTo(1738, 232, 1732, 120, 1650, -30);
  ctx.stroke();

  for (let index = 0; index < 26; index++) {
    const side = index % 2 === 0 ? 1 : -1;
    const x = side > 0
      ? 68 + (index % 6) * 62 + Math.sin(index * 2.2 + time * 0.0003) * 8
      : 1934 - (index % 6) * 62 + Math.sin(index * 2.1 + time * 0.0003) * 8;
    const y = 160 + (index % 7) * 83 + Math.cos(index + time * 0.00025) * 8;
    const radius = 24 + (index % 4) * 9;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(side * (0.36 + (index % 3) * 0.12));
    const leaf = ctx.createRadialGradient(-radius * 0.28, -radius * 0.25, 2, 0, 0, radius);
    leaf.addColorStop(0, "rgba(35, 54, 61, 0.76)");
    leaf.addColorStop(0.5, "rgba(7, 21, 28, 0.9)");
    leaf.addColorStop(1, "rgba(1, 5, 12, 0.98)");
    ctx.fillStyle = leaf;
    ctx.beginPath();
    ctx.ellipse(0, 0, radius, radius * 0.64, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function drawMistLayer(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  alpha: number,
  time: number,
  entry: number,
) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = alpha * (1 - entry * 0.65);
  for (let index = 0; index < 4; index++) {
    const x = width * (0.2 + index * 0.24) + Math.sin(time * 0.00028 + index * 2) * 24;
    const y = height * (0.66 + index * 0.035) + Math.sin(time * 0.00036 + index) * 8;
    const radius = width * (0.18 + index * 0.025);
    const fog = ctx.createRadialGradient(x, y, 0, x, y, radius);
    fog.addColorStop(0, "rgba(204, 226, 229, 0.16)");
    fog.addColorStop(0.44, "rgba(128, 163, 177, 0.08)");
    fog.addColorStop(1, "rgba(128, 163, 177, 0)");
    ctx.fillStyle = fog;
    ctx.beginPath();
    ctx.ellipse(x, y, radius, height * 0.035 + index * 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawPortalInterior(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  interior: number,
  time: number,
) {
  if (interior <= 0) return;

  const archWidth = Math.min(width * 0.76, 900);
  const archTop = height * 0.07;
  const archHeight = height * 1.04;
  const archLeft = (width - archWidth) / 2;
  const sourceScale = Math.max(archWidth / PORTAL_REGION.width, archHeight / PORTAL_REGION.height);
  const sourceX = width * 0.5 - PORTAL_REGION.width * sourceScale * 0.5;
  const sourceY = height * 0.46 - PORTAL_REGION.height * sourceScale * 0.44;

  ctx.save();
  ctx.globalAlpha = interior * 0.86;
  ctx.beginPath();
  ctx.moveTo(archLeft, height);
  ctx.lineTo(archLeft, archTop + archHeight * 0.34);
  ctx.quadraticCurveTo(archLeft, archTop, width * 0.5, archTop);
  ctx.quadraticCurveTo(archLeft + archWidth, archTop, archLeft + archWidth, archTop + archHeight * 0.34);
  ctx.lineTo(archLeft + archWidth, height);
  ctx.closePath();
  ctx.clip();
  ctx.filter = "saturate(1.18) contrast(1.06) brightness(0.82)";
  ctx.drawImage(
    image,
    PORTAL_REGION.x,
    PORTAL_REGION.y,
    PORTAL_REGION.width,
    PORTAL_REGION.height,
    sourceX,
    sourceY,
    PORTAL_REGION.width * sourceScale,
    PORTAL_REGION.height * sourceScale,
  );
  ctx.filter = "none";

  const warmLight = ctx.createRadialGradient(width * 0.5, height * 0.44, 0, width * 0.5, height * 0.44, width * 0.46);
  warmLight.addColorStop(0, rgba("#ffd48b", interior * 0.42));
  warmLight.addColorStop(0.32, rgba("#b55d43", interior * 0.14));
  warmLight.addColorStop(1, rgba("#190e18", 0));
  ctx.fillStyle = warmLight;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = interior * 0.8;
  const frame = ctx.createLinearGradient(archLeft, 0, archLeft + archWidth, 0);
  frame.addColorStop(0, "rgba(6, 6, 13, 0.96)");
  frame.addColorStop(0.24, "rgba(47, 29, 35, 0.42)");
  frame.addColorStop(0.5, "rgba(209, 155, 80, 0.1)");
  frame.addColorStop(0.76, "rgba(47, 29, 35, 0.42)");
  frame.addColorStop(1, "rgba(6, 6, 13, 0.96)");
  ctx.fillStyle = frame;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = rgba("#e4b774", interior * 0.42);
  ctx.lineWidth = Math.max(1.2, width * 0.0018);
  ctx.beginPath();
  ctx.moveTo(archLeft + width * 0.035, height);
  ctx.lineTo(archLeft + width * 0.035, archTop + archHeight * 0.34);
  ctx.quadraticCurveTo(archLeft + width * 0.035, archTop + height * 0.03, width * 0.5, archTop + height * 0.03);
  ctx.quadraticCurveTo(archLeft + archWidth - width * 0.035, archTop + height * 0.03, archLeft + archWidth - width * 0.035, archTop + archHeight * 0.34);
  ctx.lineTo(archLeft + archWidth - width * 0.035, height);
  ctx.stroke();

  const floor = ctx.createLinearGradient(0, height * 0.62, 0, height);
  floor.addColorStop(0, "rgba(59, 27, 29, 0)");
  floor.addColorStop(0.5, "rgba(59, 27, 29, 0.35)");
  floor.addColorStop(1, "rgba(4, 4, 10, 0.98)");
  ctx.fillStyle = floor;
  ctx.fillRect(0, height * 0.58, width, height * 0.42);

  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = interior * 0.58;
  for (let index = 0; index < 7; index++) {
    const x = width * (0.31 + (index % 4) * 0.13);
    const y = height * (0.3 + Math.floor(index / 4) * 0.17) + Math.sin(time * 0.001 + index) * 5;
    drawGlow(ctx, x, y, 22 + (index % 2) * 6, "#ffca70", 0.18);
    ctx.fillStyle = "rgba(255, 224, 159, 0.78)";
    ctx.beginPath();
    ctx.arc(x, y, 1.5 + (index % 2), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawVignette(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  entry: number,
  loading: number,
) {
  const vignette = ctx.createRadialGradient(
    width * 0.5,
    height * 0.44,
    Math.min(width, height) * 0.2,
    width * 0.5,
    height * 0.48,
    Math.max(width, height) * 0.78,
  );
  vignette.addColorStop(0, "rgba(1, 3, 10, 0)");
  vignette.addColorStop(0.56, "rgba(1, 3, 10, 0.08)");
  vignette.addColorStop(1, `rgba(0, 2, 8, ${0.56 + entry * 0.2 + (1 - loading) * 0.2})`);
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
}

function drawFallback(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
) {
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#020611");
  sky.addColorStop(0.58, "#0b1529");
  sky.addColorStop(1, "#030711");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);
  drawGlow(ctx, width * 0.53, height * 0.28, width * 0.16, "#9dcfd3", progress * 0.16);
  ctx.fillStyle = rgba("#02050d", 0.6 + (1 - progress) * 0.32);
  ctx.fillRect(0, height * 0.62, width, height * 0.38);
}

function drawImageScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: SceneOptions,
) {
  const loading = options.mode === "loading";
  const reveal = loading ? smoothstep((options.loadProgress - 0.02) / 0.98) : 1;
  const entry = options.mode === "background"
    ? smoothstep(options.scrollProgress / 0.92)
    : 0;
  const castleReveal = loading ? easeOutCubic((options.loadProgress - 0.1) / 0.76) : 1;
  const focus = {
    x: lerp(1000, SOURCE_POINT.entry.x, entry),
    y: lerp(520, SOURCE_POINT.entry.y, entry),
  };
  const transform = getCoverTransform(
    width,
    height,
    1 + entry * 0.58,
    focus,
    options.pointerX * 0.18,
    options.pointerY * 0.12,
  );

  drawPhoto(
    ctx,
    options.image!,
    transform,
    reveal,
    "saturate(1.06) contrast(1.08) brightness(0.84)",
  );

  ctx.save();
  ctx.globalAlpha = reveal * 0.22;
  const grade = ctx.createLinearGradient(0, 0, 0, height);
  grade.addColorStop(0, "rgba(1, 6, 18, 0.32)");
  grade.addColorStop(0.52, "rgba(4, 13, 27, 0.04)");
  grade.addColorStop(1, "rgba(0, 2, 8, 0.68)");
  ctx.fillStyle = grade;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  drawSkyLayers(ctx, options.image!, transform, reveal, options.pointerX, options.pointerY, entry);
  drawMoonLayer(
    ctx,
    options.image!,
    transform,
    reveal,
    options.pointerX,
    options.pointerY,
    options.time,
  );

  drawMaskedRegion(
    ctx,
    options.image!,
    CASTLE_REGION,
    CASTLE_MASK,
    transform,
    castleReveal * 0.18,
    options.pointerX * 0.16,
    options.pointerY * 0.12 - entry * 9,
    1.004,
  );
  drawMaskedRegion(
    ctx,
    options.image!,
    WEST_TOWERS_REGION,
    WEST_TOWERS_MASK,
    transform,
    castleReveal * 0.24,
    options.pointerX * 0.2,
    options.pointerY * 0.15 - entry * 5,
    1.008,
  );
  drawMaskedRegion(
    ctx,
    options.image!,
    CENTRAL_TOWERS_REGION,
    CENTRAL_TOWERS_MASK,
    transform,
    castleReveal * 0.26,
    options.pointerX * 0.27,
    options.pointerY * 0.2 - entry * 8,
    1.012,
  );
  drawMaskedRegion(
    ctx,
    options.image!,
    RIGHT_TOWERS_REGION,
    RIGHT_TOWERS_MASK,
    transform,
    castleReveal * 0.3,
    options.pointerX * 0.34,
    options.pointerY * 0.24 - entry * 10,
    1.016,
  );

  drawWaterLayer(ctx, options.image!, transform, reveal, options.pointerX, options.pointerY, options.time, entry);
  drawMistLayer(ctx, width, height, reveal, options.time, entry);
  const foliageReveal = loading ? 1 - smoothstep((options.loadProgress - 0.04) / 0.76) * 0.72 : 0.36 - entry * 0.22;
  drawFoliageLayer(ctx, options.image!, transform, Math.max(0.06, foliageReveal), options.pointerX, options.pointerY, options.time, entry);

  const interior = smoothstep((entry - 0.24) / 0.76);
  drawPortalInterior(ctx, options.image!, width, height, interior, options.time);
  drawVignette(ctx, width, height, entry, reveal);
}

function drawScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: SceneOptions,
) {
  ctx.clearRect(0, 0, width, height);
  if (!options.image) {
    drawFallback(ctx, width, height, options.loadProgress);
    return;
  }
  drawImageScene(ctx, width, height, options);
}

export function PhotoWizardingCanvas({
  mode,
  progress = 1,
  motionEnabled = true,
  className = "",
}: PhotoCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const progressRef = useRef(clamp(progress));
  const scrollRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const drawRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    progressRef.current = clamp(progress);
    drawRef.current?.();
  }, [progress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let devicePixelRatio = 1;
    let animationFrame = 0;
    let scheduledFrame = 0;
    let lastTime = 0;
    let scheduled = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const image = new Image();
    image.decoding = "async";
    image.fetchPriority = "high";
    image.onload = () => {
      imageRef.current = image;
      canvas.dataset.imageReady = "true";
      drawRef.current?.();
    };
    image.onerror = () => {
      canvas.dataset.imageReady = "false";
      drawRef.current?.();
    };
    image.src = SOURCE_URL;

    const updateScroll = () => {
      if (mode !== "background") return;
      const travel = Math.max(window.innerHeight * 2.15, 1);
      scrollRef.current = clamp(window.scrollY / travel);
      canvas.dataset.scrollProgress = scrollRef.current.toFixed(3);
      scheduleDraw();
    };

    const resize = () => {
      devicePixelRatio = Math.min(window.devicePixelRatio || 1, 1.75);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(width * devicePixelRatio));
      canvas.height = Math.max(1, Math.floor(height * devicePixelRatio));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      scheduleDraw();
    };

    const pointerMove = (event: PointerEvent) => {
      if (reducedMotion.matches || !motionEnabled) return;
      pointerRef.current.x = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 42;
      pointerRef.current.y = (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 26;
      scheduleDraw();
    };

    const pointerReset = () => {
      pointerRef.current.x = 0;
      pointerRef.current.y = 0;
      scheduleDraw();
    };

    const draw = (now = performance.now()) => {
      scheduled = false;
      if (!width || !height) return;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      const elapsed = motionEnabled && !reducedMotion.matches ? now : lastTime;
      lastTime = elapsed;
      drawScene(ctx, width, height, {
        mode,
        image: imageRef.current,
        loadProgress: progressRef.current,
        scrollProgress: scrollRef.current,
        time: elapsed,
        pointerX: pointerRef.current.x,
        pointerY: pointerRef.current.y,
      });
    };

    function scheduleDraw() {
      if (scheduled) return;
      scheduled = true;
      scheduledFrame = window.requestAnimationFrame(() => {
        scheduledFrame = 0;
        draw();
      });
    }

    drawRef.current = scheduleDraw;
    canvas.dataset.imageLayers = IMAGE_LAYERS.join(",");
    canvas.dataset.canvasSource = SOURCE_URL;
    canvas.dataset.imageReady = "false";
    resize();
    updateScroll();
    draw(0);

    const shouldAnimate = !reducedMotion.matches && (mode === "loading" || motionEnabled);
    let lastAnimateTime = 0;
    const animate = (now: number) => {
      // When in background mode, throttle ambient time ripples to ~30fps to keep
      // main thread and smooth scrolling 100% fluid at 60/120fps.
      if (mode === "background") {
        if (now - lastAnimateTime >= 33) {
          lastAnimateTime = now;
          draw(now);
        }
      } else {
        draw(now);
      }
      if (shouldAnimate) animationFrame = window.requestAnimationFrame(animate);
    };
    if (shouldAnimate) animationFrame = window.requestAnimationFrame(animate);

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("pointermove", pointerMove, { passive: true });
    window.addEventListener("blur", pointerReset);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      if (scheduledFrame) window.cancelAnimationFrame(scheduledFrame);
      drawRef.current = null;
      image.onload = null;
      image.onerror = null;
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("pointermove", pointerMove);
      window.removeEventListener("blur", pointerReset);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [mode, motionEnabled]);

  return (
    <canvas
      ref={canvasRef}
      className={`wizarding-canvas ${className}`.trim()}
      data-canvas-scene={mode}
      aria-hidden="true"
    />
  );
}
