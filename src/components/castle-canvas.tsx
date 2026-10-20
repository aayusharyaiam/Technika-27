"use client";

import { useEffect, useRef } from "react";

const DESIGN_WIDTH = 1440;
const DESIGN_HEIGHT = 900;

type SceneMode = "loading" | "background";

type CastleCanvasProps = {
  mode: SceneMode;
  progress?: number;
  motionEnabled?: boolean;
  className?: string;
};

type SceneOptions = {
  mode: SceneMode;
  loadProgress: number;
  scrollProgress: number;
  time: number;
  pointerX: number;
  pointerY: number;
};

type Point = { x: number; y: number };

const STAR_FIELD: Array<[number, number, number, number]> = [
  [92, 104, 1.5, 0.8],
  [164, 218, 1.1, 0.55],
  [237, 98, 1.8, 0.72],
  [314, 174, 1, 0.6],
  [392, 83, 1.35, 0.75],
  [468, 246, 1.7, 0.64],
  [544, 122, 1.1, 0.8],
  [620, 196, 1.4, 0.52],
  [702, 84, 1.8, 0.74],
  [780, 238, 1.25, 0.62],
  [864, 132, 1.1, 0.7],
  [946, 68, 1.6, 0.82],
  [1034, 224, 1.3, 0.62],
  [1120, 100, 1.7, 0.77],
  [1204, 198, 1.05, 0.58],
  [1288, 82, 1.45, 0.72],
  [1360, 258, 1.2, 0.55],
  [116, 352, 1.1, 0.42],
  [292, 312, 1.35, 0.5],
  [1180, 330, 1.1, 0.45],
  [1320, 380, 1.45, 0.48],
];

const WINDOW_POINTS: Array<[number, number, number, number]> = [
  [622, 492, 1, 0.86],
  [666, 474, 1, 0.68],
  [718, 446, 1.15, 0.98],
  [770, 472, 1, 0.76],
  [820, 494, 1, 0.92],
  [552, 542, 0.82, 0.52],
  [594, 558, 0.8, 0.48],
  [858, 552, 0.8, 0.58],
  [900, 536, 0.86, 0.72],
  [514, 608, 0.74, 0.48],
  [562, 618, 0.8, 0.56],
  [620, 604, 0.85, 0.6],
  [680, 592, 0.9, 0.78],
  [734, 596, 0.9, 0.86],
  [788, 596, 0.9, 0.8],
  [842, 606, 0.85, 0.62],
  [900, 612, 0.76, 0.5],
  [956, 594, 0.78, 0.6],
];

const FOREST_LEAVES: Array<[number, number, number, number, number]> = [
  [-12, 188, 74, 1.1, 0.86],
  [44, 266, 66, 1, 0.72],
  [98, 156, 58, 0.82, 0.9],
  [152, 304, 80, 1.18, 0.72],
  [208, 230, 62, 0.92, 0.66],
  [252, 372, 84, 1.16, 0.8],
  [318, 294, 62, 0.84, 0.56],
  [1395, 168, 70, 1.06, 0.82],
  [1340, 262, 76, 1.16, 0.74],
  [1290, 144, 62, 0.94, 0.82],
  [1234, 322, 86, 1.2, 0.72],
  [1170, 226, 60, 0.9, 0.62],
  [1114, 370, 82, 1.14, 0.76],
  [1058, 298, 58, 0.8, 0.52],
  [88, 690, 112, 1.55, 0.94],
  [192, 744, 96, 1.3, 0.86],
  [308, 706, 105, 1.42, 0.76],
  [1346, 704, 114, 1.52, 0.94],
  [1240, 752, 102, 1.35, 0.84],
  [1130, 708, 94, 1.28, 0.74],
];

const MOTES: Array<[number, number, number, number]> = [
  [378, 672, 2.4, 0.7],
  [430, 728, 1.6, 0.5],
  [478, 614, 1.8, 0.58],
  [934, 702, 2, 0.62],
  [1000, 650, 1.5, 0.52],
  [1062, 738, 2.2, 0.62],
  [1150, 606, 1.5, 0.45],
  [278, 596, 1.4, 0.42],
];

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
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
  glow.addColorStop(0.48, rgba(color, alpha * 0.28));
  glow.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawLeaf(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  scale: number,
  opacity: number,
  phase: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(phase + x * 0.01) * 0.12);
  ctx.scale(scale, 1);
  const leaf = ctx.createRadialGradient(-radius * 0.28, -radius * 0.34, 2, 0, 0, radius);
  leaf.addColorStop(0, rgba("#293b42", opacity));
  leaf.addColorStop(0.44, rgba("#0e2028", opacity * 0.94));
  leaf.addColorStop(1, rgba("#02070f", opacity));
  ctx.fillStyle = leaf;
  ctx.shadowColor = rgba("#01050c", opacity * 0.8);
  ctx.shadowBlur = radius * 0.18;
  ctx.beginPath();
  ctx.ellipse(0, 0, radius, radius * 0.72, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = rgba("#52625c", opacity * 0.22);
  ctx.lineWidth = Math.max(1, radius * 0.035);
  ctx.beginPath();
  ctx.moveTo(-radius * 0.65, radius * 0.1);
  ctx.quadraticCurveTo(0, 0, radius * 0.66, -radius * 0.08);
  ctx.stroke();
  ctx.restore();
}

function drawStars(
  ctx: CanvasRenderingContext2D,
  alpha: number,
  offsetY: number,
  pointerX: number,
  pointerY: number,
  time: number,
) {
  ctx.save();
  ctx.translate(pointerX * 0.2, offsetY + pointerY * 0.16);
  for (const [x, y, radius, opacity] of STAR_FIELD) {
    const twinkle = 0.82 + Math.sin(time * 0.0012 + x * 0.04) * 0.16;
    ctx.fillStyle = rgba("#f7e7bb", alpha * opacity * twinkle);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    if (radius > 1.45) {
      ctx.strokeStyle = rgba("#ffe8ad", alpha * opacity * 0.24);
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(x - radius * 3.4, y);
      ctx.lineTo(x + radius * 3.4, y);
      ctx.moveTo(x, y - radius * 3.4);
      ctx.lineTo(x, y + radius * 3.4);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawSky(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  reveal: number,
  entry: number,
  pointerX: number,
  pointerY: number,
  time: number,
) {
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#020611");
  sky.addColorStop(0.42, "#09152b");
  sky.addColorStop(0.72, "#182742");
  sky.addColorStop(1, "#0d1425");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  const cover = Math.max(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);
  const worldX = (width - DESIGN_WIDTH * cover) / 2;
  const worldY = (height - DESIGN_HEIGHT * cover) / 2;
  ctx.save();
  ctx.translate(worldX + pointerX * 0.12, worldY + pointerY * 0.1 - entry * 22);
  ctx.scale(cover, cover);
  drawStars(ctx, reveal, 0, 0, 0, time);
  drawGlow(ctx, 946, 160, 248, "#e5be76", reveal * (1 - entry * 0.42));

  const moon = ctx.createRadialGradient(922, 132, 3, 922, 132, 82);
  moon.addColorStop(0, rgba("#fffce5", reveal));
  moon.addColorStop(0.55, rgba("#f2d49c", reveal * 0.98));
  moon.addColorStop(1, rgba("#b98158", reveal * 0.9));
  ctx.fillStyle = moon;
  ctx.beginPath();
  ctx.arc(922, 132, 64, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = rgba("#09152a", reveal * 0.82);
  ctx.beginPath();
  ctx.arc(951, 111, 62, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = rgba("#b88a5b", reveal * 0.2);
  for (const crater of [
    [895, 108, 8],
    [932, 150, 5],
    [905, 160, 4],
  ]) {
    ctx.beginPath();
    ctx.arc(crater[0], crater[1], crater[2], 0, Math.PI * 2);
    ctx.fill();
  }

  const backMountains = ctx.createLinearGradient(0, 330, 0, 650);
  backMountains.addColorStop(0, rgba("#293a56", reveal * 0.62));
  backMountains.addColorStop(1, rgba("#111c33", reveal * 0.9));
  ctx.fillStyle = backMountains;
  ctx.beginPath();
  ctx.moveTo(0, 590);
  ctx.lineTo(160, 392);
  ctx.lineTo(276, 512);
  ctx.lineTo(424, 335);
  ctx.lineTo(584, 528);
  ctx.lineTo(738, 358);
  ctx.lineTo(878, 526);
  ctx.lineTo(1040, 306);
  ctx.lineTo(1190, 488);
  ctx.lineTo(1330, 366);
  ctx.lineTo(1440, 508);
  ctx.lineTo(1440, 900);
  ctx.lineTo(0, 900);
  ctx.closePath();
  ctx.fill();

  const frontMountains = ctx.createLinearGradient(0, 472, 0, 790);
  frontMountains.addColorStop(0, rgba("#15243c", reveal * 0.92));
  frontMountains.addColorStop(1, rgba("#070d1b", reveal));
  ctx.fillStyle = frontMountains;
  ctx.beginPath();
  ctx.moveTo(0, 660);
  ctx.lineTo(210, 470);
  ctx.lineTo(322, 558);
  ctx.lineTo(454, 426);
  ctx.lineTo(612, 618);
  ctx.lineTo(792, 462);
  ctx.lineTo(936, 596);
  ctx.lineTo(1108, 420);
  ctx.lineTo(1248, 580);
  ctx.lineTo(1390, 494);
  ctx.lineTo(1440, 610);
  ctx.lineTo(1440, 900);
  ctx.lineTo(0, 900);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawWater(
  ctx: CanvasRenderingContext2D,
  reveal: number,
  entry: number,
  time: number,
) {
  const water = ctx.createLinearGradient(0, 660, 0, 900);
  water.addColorStop(0, rgba("#121f35", reveal * 0.8));
  water.addColorStop(0.48, rgba("#091323", reveal * 0.92));
  water.addColorStop(1, "#030711");
  ctx.fillStyle = water;
  ctx.fillRect(0, 644, DESIGN_WIDTH, 256);

  ctx.save();
  ctx.globalAlpha = reveal * (1 - entry * 0.82);
  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < 22; i++) {
    const y = 674 + i * 10;
    const wave = Math.sin(time * 0.00055 + i * 1.8) * 10;
    const width = 36 + (i % 5) * 17;
    const center = 720 + Math.sin(i * 1.7) * 185 + wave;
    const gradient = ctx.createLinearGradient(center - width, y, center + width, y);
    gradient.addColorStop(0, "rgba(242, 201, 126, 0)");
    gradient.addColorStop(0.5, rgba("#d4b875", 0.18 - i * 0.004));
    gradient.addColorStop(1, "rgba(242, 201, 126, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(center - width, y, width * 2, 1.5);
  }
  ctx.restore();
}

function drawWindow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  opacity: number,
  time: number,
) {
  const flicker = 0.86 + Math.sin(time * 0.002 + x * 0.06) * 0.1;
  ctx.save();
  ctx.globalAlpha = opacity * flicker;
  drawGlow(ctx, x + 4 * scale, y + 8 * scale, 24 * scale, "#f4b957", 0.18);
  const light = ctx.createLinearGradient(x, y, x + 10 * scale, y + 30 * scale);
  light.addColorStop(0, "#fff4c1");
  light.addColorStop(0.45, "#eac064");
  light.addColorStop(1, "#7b482f");
  ctx.fillStyle = light;
  ctx.beginPath();
  ctx.moveTo(x, y + 26 * scale);
  ctx.lineTo(x, y + 9 * scale);
  ctx.quadraticCurveTo(x + 5 * scale, y, x + 10 * scale, y + 9 * scale);
  ctx.lineTo(x + 10 * scale, y + 26 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = rgba("#4b2c2b", 0.65);
  ctx.lineWidth = Math.max(0.75, scale * 1.2);
  ctx.beginPath();
  ctx.moveTo(x + 5 * scale, y + 4 * scale);
  ctx.lineTo(x + 5 * scale, y + 26 * scale);
  ctx.moveTo(x, y + 14 * scale);
  ctx.lineTo(x + 10 * scale, y + 14 * scale);
  ctx.stroke();
  ctx.restore();
}

function drawTower(
  ctx: CanvasRenderingContext2D,
  x: number,
  base: number,
  width: number,
  height: number,
  depth: number,
  scale: number,
  alpha: number,
  time: number,
  roofTint = "#151b2b",
) {
  const left = x - width / 2;
  const top = base - height;
  const side = Math.max(7, depth);
  ctx.save();
  ctx.globalAlpha = alpha;

  const face = ctx.createLinearGradient(left, top, left + width, base);
  face.addColorStop(0, "#4b5267");
  face.addColorStop(0.32, "#30384f");
  face.addColorStop(0.72, "#1c263b");
  face.addColorStop(1, "#10182b");
  ctx.fillStyle = face;
  ctx.fillRect(left, top, width, height);

  const shadow = ctx.createLinearGradient(left + width, top, left + width + side, top,);
  shadow.addColorStop(0, "#1a2034");
  shadow.addColorStop(1, "#080e1d");
  ctx.fillStyle = shadow;
  polygon(ctx, [
    { x: left + width, y: top + 6 },
    { x: left + width + side, y: top - 3 },
    { x: left + width + side, y: base - 6 },
    { x: left + width, y: base },
  ]);
  ctx.fill();

  ctx.strokeStyle = rgba("#9ca1ad", 0.22);
  ctx.lineWidth = Math.max(1, scale * 1.15);
  ctx.beginPath();
  ctx.moveTo(left + width, top + 8);
  ctx.lineTo(left + width, base - 2);
  ctx.stroke();

  const roof = ctx.createLinearGradient(x - width * 0.7, top - height * 0.26, x + width * 0.72, top);
  roof.addColorStop(0, roofTint);
  roof.addColorStop(0.5, "#2e3348");
  roof.addColorStop(1, "#0b1020");
  ctx.fillStyle = roof;
  polygon(ctx, [
    { x: left - width * 0.12, y: top + 5 },
    { x, y: top - height * 0.27 },
    { x: left + width + width * 0.12, y: top + 5 },
  ]);
  ctx.fill();
  ctx.fillStyle = rgba("#0b1020", 0.6);
  polygon(ctx, [
    { x, y: top - height * 0.27 },
    { x: left + width + width * 0.12, y: top + 5 },
    { x: left + width + width * 0.12 + side * 0.7, y: top + 3 },
    { x: x + side * 0.55, y: top - height * 0.21 },
  ]);
  ctx.fill();

  ctx.fillStyle = "#343a4d";
  for (let i = 0; i < 5; i++) {
    const battlementX = left + 8 + i * Math.max(10, (width - 16) / 4);
    ctx.fillRect(battlementX, top + 2, Math.max(5, width * 0.075), 10 * scale);
  }
  ctx.fillStyle = rgba("#10182a", 0.8);
  ctx.fillRect(left + width + side * 0.35, top - 3, side * 0.4, 10 * scale);

  const windowCount = Math.max(1, Math.floor(width / 48));
  for (let row = 0; row < 2; row++) {
    for (let column = 0; column < windowCount; column++) {
      const windowX = left + 17 + column * ((width - 34) / Math.max(1, windowCount - 1));
      const windowY = top + 42 + row * Math.max(36, height * 0.27);
      drawWindow(ctx, windowX, windowY, Math.max(0.55, scale), alpha * 0.78, time);
    }
  }
  ctx.restore();
}

function drawCastle(
  ctx: CanvasRenderingContext2D,
  reveal: number,
  scale: number,
  alpha: number,
  time: number,
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  drawGlow(ctx, 720, 534, 282, "#d2a35c", reveal * 0.12);

  // The far towers establish depth before the central keep arrives.
  drawTower(ctx, 410, 652, 82, 176, 18, scale * 0.9, alpha * 0.78, time, "#12182a");
  drawTower(ctx, 1040, 652, 86, 196, 18, scale * 0.92, alpha * 0.82, time, "#11182a");
  drawTower(ctx, 526, 660, 112, 242, 22, scale, alpha * 0.94, time, "#121b2c");
  drawTower(ctx, 914, 660, 122, 258, 23, scale * 1.02, alpha * 0.96, time, "#121a2b");

  const wall = ctx.createLinearGradient(540, 438, 906, 670);
  wall.addColorStop(0, "#566078");
  wall.addColorStop(0.36, "#3b465e");
  wall.addColorStop(0.73, "#232e45");
  wall.addColorStop(1, "#11192c");
  ctx.fillStyle = wall;
  polygon(ctx, [
    { x: 544, y: 505 },
    { x: 612, y: 454 },
    { x: 678, y: 478 },
    { x: 742, y: 430 },
    { x: 826, y: 474 },
    { x: 898, y: 508 },
    { x: 898, y: 668 },
    { x: 544, y: 668 },
  ]);
  ctx.fill();

  ctx.fillStyle = rgba("#11192b", 0.52);
  polygon(ctx, [
    { x: 898, y: 508 },
    { x: 932, y: 526 },
    { x: 932, y: 658 },
    { x: 898, y: 668 },
  ]);
  ctx.fill();

  ctx.strokeStyle = rgba("#b9bfcb", 0.16);
  ctx.lineWidth = 2 * scale;
  for (const point of [
    [612, 454, 612, 668],
    [678, 478, 678, 668],
    [742, 430, 742, 668],
    [826, 474, 826, 668],
  ]) {
    ctx.beginPath();
    ctx.moveTo(point[0], point[1]);
    ctx.lineTo(point[2], point[3]);
    ctx.stroke();
  }

  // Central keep and roof are drawn last so the silhouette has a readable 3D hierarchy.
  drawTower(ctx, 720, 666, 154, 302, 30, scale * 1.08, alpha, time, "#1a2134");
  drawTower(ctx, 720, 612, 82, 388, 19, scale * 1.13, alpha * 0.96, time, "#101729");

  const bridge = ctx.createLinearGradient(575, 590, 864, 668);
  bridge.addColorStop(0, "#3c4960");
  bridge.addColorStop(0.52, "#29364c");
  bridge.addColorStop(1, "#111a2d");
  ctx.fillStyle = bridge;
  ctx.fillRect(568, 590, 296, 78);
  ctx.fillStyle = rgba("#0b1221", 0.42);
  ctx.fillRect(568, 638, 296, 30);

  // Warm windows and the gate are the visual anchor of the arrival scene.
  for (const [x, y, windowScale, opacity] of WINDOW_POINTS) {
    drawWindow(ctx, x, y, windowScale * scale, opacity * reveal, time);
  }

  const gateGlow = ctx.createRadialGradient(720, 634, 6, 720, 634, 128);
  gateGlow.addColorStop(0, rgba("#ffedaf", reveal * 0.52));
  gateGlow.addColorStop(0.42, rgba("#e8ad53", reveal * 0.13));
  gateGlow.addColorStop(1, rgba("#e8ad53", 0));
  ctx.fillStyle = gateGlow;
  ctx.beginPath();
  ctx.arc(720, 634, 128, 0, Math.PI * 2);
  ctx.fill();

  const gate = ctx.createLinearGradient(682, 664, 758, 564);
  gate.addColorStop(0, "#191624");
  gate.addColorStop(0.55, "#4a332c");
  gate.addColorStop(1, "#f5cf83");
  ctx.fillStyle = gate;
  ctx.beginPath();
  ctx.moveTo(682, 666);
  ctx.lineTo(682, 622);
  ctx.quadraticCurveTo(682, 564, 720, 564);
  ctx.quadraticCurveTo(758, 564, 758, 622);
  ctx.lineTo(758, 666);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = rgba("#f8d88e", reveal * 0.72);
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.moveTo(686, 665);
  ctx.lineTo(686, 623);
  ctx.quadraticCurveTo(686, 574, 720, 574);
  ctx.quadraticCurveTo(754, 574, 754, 623);
  ctx.lineTo(754, 665);
  ctx.stroke();

  ctx.strokeStyle = rgba("#d3d8d6", reveal * 0.26);
  ctx.lineWidth = 1.2 * scale;
  ctx.beginPath();
  ctx.moveTo(486, 654);
  ctx.lineTo(955, 654);
  ctx.moveTo(480, 661);
  ctx.lineTo(960, 661);
  ctx.stroke();

  ctx.fillStyle = rgba("#f7d889", reveal * 0.8);
  ctx.fillRect(718, 208, 4 * scale, 62 * scale);
  polygon(ctx, [
    { x: 720, y: 196 },
    { x: 726, y: 211 },
    { x: 720, y: 220 },
    { x: 714, y: 211 },
  ]);
  ctx.fill();
  ctx.restore();
}

function drawForestFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  reveal: number,
  entry: number,
  pointerX: number,
  pointerY: number,
  time: number,
) {
  const leafOpacity =
    (1 - smoothstep((reveal - 0.08) / 0.86) * 0.62) * (1 - entry * 0.88);
  const cover = Math.max(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);
  const worldX = (width - DESIGN_WIDTH * cover) / 2;
  const worldY = (height - DESIGN_HEIGHT * cover) / 2;

  ctx.save();
  ctx.translate(worldX + pointerX * 0.42 - entry * 250, worldY + pointerY * 0.32);
  ctx.scale(cover, cover);
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = rgba("#02050d", leafOpacity * 0.82);
  ctx.fillRect(0, 0, DESIGN_WIDTH * 0.18, DESIGN_HEIGHT);

  ctx.strokeStyle = rgba("#02050d", leafOpacity * 0.98);
  ctx.lineCap = "round";
  ctx.lineWidth = 48;
  ctx.beginPath();
  ctx.moveTo(-42, 930);
  ctx.bezierCurveTo(58, 718, 24, 476, 172, 278);
  ctx.bezierCurveTo(238, 190, 244, 96, 320, -38);
  ctx.stroke();
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.moveTo(42, 524);
  ctx.bezierCurveTo(128, 446, 236, 408, 342, 354);
  ctx.moveTo(68, 690);
  ctx.bezierCurveTo(162, 612, 218, 546, 260, 432);
  ctx.stroke();

  for (const [x, y, radius, scale, opacity] of FOREST_LEAVES.slice(0, 13)) {
    drawLeaf(
      ctx,
      x,
      y,
      radius,
      scale,
      opacity * leafOpacity,
      time * 0.001,
    );
  }
  ctx.restore();

  ctx.save();
  ctx.translate(worldX + pointerX * 0.52 + entry * 250, worldY + pointerY * 0.38);
  ctx.scale(cover, cover);
  ctx.fillStyle = rgba("#02050d", leafOpacity * 0.82);
  ctx.fillRect(DESIGN_WIDTH * 0.82, 0, DESIGN_WIDTH * 0.2, DESIGN_HEIGHT);
  ctx.strokeStyle = rgba("#02050d", leafOpacity * 0.98);
  ctx.lineWidth = 52;
  ctx.beginPath();
  ctx.moveTo(1478, 934);
  ctx.bezierCurveTo(1388, 706, 1414, 486, 1274, 286);
  ctx.bezierCurveTo(1226, 210, 1210, 98, 1130, -38);
  ctx.stroke();
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.moveTo(1398, 532);
  ctx.bezierCurveTo(1312, 450, 1202, 410, 1100, 356);
  ctx.moveTo(1380, 704);
  ctx.bezierCurveTo(1296, 620, 1236, 544, 1194, 432);
  ctx.stroke();
  for (const [x, y, radius, scale, opacity] of FOREST_LEAVES.slice(7, 14)) {
    drawLeaf(
      ctx,
      x,
      y,
      radius,
      scale,
      opacity * leafOpacity,
      time * 0.001 + 0.8,
    );
  }
  ctx.restore();

  // The low foreground creates a soft, out-of-focus sense of depth around the lake.
  ctx.save();
  ctx.translate(worldX + pointerX * 0.7, worldY + pointerY * 0.48 + entry * 80);
  ctx.scale(cover, cover);
  ctx.globalAlpha = leafOpacity * 0.9;
  const foreground = ctx.createLinearGradient(0, 690, 0, 900);
  foreground.addColorStop(0, "rgba(2, 6, 13, 0.15)");
  foreground.addColorStop(0.5, "rgba(1, 4, 10, 0.72)");
  foreground.addColorStop(1, "rgba(0, 2, 7, 0.98)");
  ctx.fillStyle = foreground;
  ctx.fillRect(0, 690, DESIGN_WIDTH, 210);
  for (const [x, y, radius, scale, opacity] of FOREST_LEAVES.slice(14)) {
    drawLeaf(
      ctx,
      x,
      y,
      radius,
      scale,
      opacity * leafOpacity,
      time * 0.001 + 1.2,
    );
  }
  ctx.restore();
}

function drawMist(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  reveal: number,
  entry: number,
  time: number,
) {
  ctx.save();
  const cover = Math.max(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);
  const worldX = (width - DESIGN_WIDTH * cover) / 2;
  const worldY = (height - DESIGN_HEIGHT * cover) / 2;
  ctx.translate(worldX, worldY);
  ctx.scale(cover, cover);
  ctx.globalAlpha = reveal * (1 - entry) * 0.62;
  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < 4; i++) {
    const y = 628 + i * 38 + Math.sin(time * 0.00035 + i) * 9;
    const x = 160 + i * 180 + Math.sin(time * 0.00028 + i * 2) * 22;
    const width = 380 + i * 55;
    const fog = ctx.createRadialGradient(x, y, 0, x, y, width);
    fog.addColorStop(0, rgba("#d5dfdf", 0.16));
    fog.addColorStop(0.4, rgba("#a9bac6", 0.08));
    fog.addColorStop(1, rgba("#a9bac6", 0));
    ctx.fillStyle = fog;
    ctx.beginPath();
    ctx.ellipse(x, y, width, 34 + i * 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawInterior(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  entry: number,
  time: number,
) {
  const interior = smoothstep((entry - 0.28) / 0.72);
  if (interior <= 0) return;

  ctx.save();
  ctx.globalAlpha = interior;
  const darken = ctx.createLinearGradient(0, 0, 0, height);
  darken.addColorStop(0, "rgba(2, 4, 11, 0.45)");
  darken.addColorStop(0.42, "rgba(8, 7, 14, 0.2)");
  darken.addColorStop(1, "rgba(1, 3, 8, 0.76)");
  ctx.fillStyle = darken;
  ctx.fillRect(0, 0, width, height);

  const vanishingX = width * 0.5;
  const vanishingY = height * 0.42;
  const floor = ctx.createLinearGradient(0, vanishingY, 0, height);
  floor.addColorStop(0, "rgba(46, 37, 41, 0.05)");
  floor.addColorStop(0.44, "rgba(89, 51, 39, 0.35)");
  floor.addColorStop(1, "rgba(9, 7, 13, 0.96)");
  ctx.fillStyle = floor;
  polygon(ctx, [
    { x: 0, y: height },
    { x: width, y: height },
    { x: vanishingX + width * 0.06, y: vanishingY },
    { x: vanishingX - width * 0.06, y: vanishingY },
  ]);
  ctx.fill();

  ctx.strokeStyle = "rgba(210, 151, 82, 0.18)";
  ctx.lineWidth = Math.max(1, width * 0.0012);
  for (const fraction of [0.16, 0.32, 0.5, 0.68, 0.84]) {
    ctx.beginPath();
    ctx.moveTo(width * fraction, height);
    ctx.lineTo(vanishingX, vanishingY + height * 0.03);
    ctx.stroke();
  }

  const archWidth = Math.min(width * 0.72, 820);
  const archHeight = height * 0.92;
  const archLeft = (width - archWidth) / 2;
  const archTop = height * 0.08;
  const archGradient = ctx.createLinearGradient(archLeft, 0, archLeft + archWidth, 0);
  archGradient.addColorStop(0, "rgba(2, 3, 9, 0.96)");
  archGradient.addColorStop(0.18, "rgba(26, 20, 29, 0.72)");
  archGradient.addColorStop(0.5, "rgba(8, 7, 13, 0.12)");
  archGradient.addColorStop(0.82, "rgba(26, 20, 29, 0.72)");
  archGradient.addColorStop(1, "rgba(2, 3, 9, 0.96)");
  ctx.fillStyle = archGradient;
  ctx.beginPath();
  ctx.moveTo(archLeft, height);
  ctx.lineTo(archLeft, archTop + archHeight * 0.32);
  ctx.quadraticCurveTo(
    archLeft,
    archTop,
    width * 0.5,
    archTop,
  );
  ctx.quadraticCurveTo(
    archLeft + archWidth,
    archTop,
    archLeft + archWidth,
    archTop + archHeight * 0.32,
  );
  ctx.lineTo(archLeft + archWidth, height);
  ctx.closePath();
  ctx.fill();

  drawGlow(ctx, vanishingX, vanishingY + height * 0.1, width * 0.34, "#f0af59", interior * 0.25);
  const gate = ctx.createRadialGradient(
    vanishingX,
    vanishingY + height * 0.12,
    0,
    vanishingX,
    vanishingY + height * 0.12,
    width * 0.3,
  );
  gate.addColorStop(0, rgba("#fff2b6", interior * 0.88));
  gate.addColorStop(0.24, rgba("#d8884f", interior * 0.32));
  gate.addColorStop(1, rgba("#8a4f40", 0));
  ctx.fillStyle = gate;
  ctx.beginPath();
  ctx.ellipse(vanishingX, vanishingY + height * 0.12, width * 0.25, height * 0.34, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = rgba("#ddb46e", interior * 0.42);
  ctx.lineWidth = Math.max(1, width * 0.002);
  ctx.beginPath();
  ctx.moveTo(archLeft + width * 0.04, height);
  ctx.lineTo(archLeft + width * 0.04, archTop + archHeight * 0.32);
  ctx.quadraticCurveTo(archLeft + width * 0.04, archTop + height * 0.04, vanishingX, archTop + height * 0.04);
  ctx.quadraticCurveTo(archLeft + archWidth - width * 0.04, archTop + height * 0.04, archLeft + archWidth - width * 0.04, archTop + archHeight * 0.32);
  ctx.lineTo(archLeft + archWidth - width * 0.04, height);
  ctx.stroke();

  for (let i = 0; i < 8; i++) {
    const x = width * (0.3 + (i % 4) * 0.13);
    const y = height * (0.28 + Math.floor(i / 4) * 0.16) + Math.sin(time * 0.001 + i) * 8;
    drawGlow(ctx, x, y, 12 + (i % 3) * 4, "#f4c371", interior * 0.14);
    ctx.fillStyle = rgba("#ffd98a", interior * 0.8);
    ctx.beginPath();
    ctx.arc(x, y, 1.4 + (i % 2), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawMotes(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  reveal: number,
  entry: number,
  time: number,
) {
  ctx.save();
  const cover = Math.max(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);
  const worldX = (width - DESIGN_WIDTH * cover) / 2;
  const worldY = (height - DESIGN_HEIGHT * cover) / 2;
  ctx.translate(worldX, worldY);
  ctx.scale(cover, cover);
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = reveal * (1 - entry * 0.28);
  for (const [x, y, radius, opacity] of MOTES) {
    const drift = Math.sin(time * 0.001 + x * 0.02) * 14;
    const rise = Math.cos(time * 0.0007 + y * 0.03) * 20;
    drawGlow(ctx, x + drift, y + rise, radius * 8, "#f7cc7c", opacity * 0.22);
    ctx.fillStyle = rgba("#ffe0a2", opacity * (0.58 + Math.sin(time * 0.001 + x) * 0.18));
    ctx.beginPath();
    ctx.arc(x + drift, y + rise, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawVignette(ctx: CanvasRenderingContext2D, width: number, height: number, entry: number) {
  const vignette = ctx.createRadialGradient(
    width * 0.5,
    height * 0.44,
    Math.min(width, height) * 0.18,
    width * 0.5,
    height * 0.48,
    Math.max(width, height) * 0.76,
  );
  vignette.addColorStop(0, "rgba(4, 6, 16, 0)");
  vignette.addColorStop(0.55, "rgba(3, 5, 13, 0.08)");
  vignette.addColorStop(1, `rgba(1, 2, 7, ${0.7 + entry * 0.16})`);
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
}

function drawScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: SceneOptions,
) {
  const reveal =
    options.mode === "loading"
      ? smoothstep((options.loadProgress - 0.04) / 0.96)
      : 1;
  const entry =
    options.mode === "background"
      ? smoothstep(options.scrollProgress / 0.92)
      : 0;
  const cover = Math.max(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);
  const worldX = (width - DESIGN_WIDTH * cover) / 2;
  const worldY = (height - DESIGN_HEIGHT * cover) / 2;
  const castleReveal = options.mode === "loading"
    ? easeOutCubic((options.loadProgress - 0.13) / 0.72)
    : 1;
  const castleScale =
    (0.78 + castleReveal * 0.22) * (1 + entry * 1.16);
  const cameraX = 720 * cover;
  const cameraY = 640 * cover;

  drawSky(
    ctx,
    width,
    height,
    reveal,
    entry,
    options.pointerX,
    options.pointerY,
    options.time,
  );

  ctx.save();
  ctx.translate(worldX + options.pointerX * 0.28, worldY + options.pointerY * 0.22 - entry * 42);
  ctx.scale(cover, cover);
  drawWater(ctx, reveal, entry, options.time);
  ctx.restore();

  ctx.save();
  ctx.translate(
    worldX + options.pointerX * 0.32 + cameraX - cameraX * castleScale,
    worldY + options.pointerY * 0.24 + cameraY - cameraY * castleScale - entry * 8,
  );
  ctx.scale(cover * castleScale, cover * castleScale);
  drawCastle(ctx, castleReveal, castleScale, castleReveal, options.time);
  ctx.restore();

  drawMist(ctx, width, height, reveal, entry, options.time);
  drawForestFrame(ctx, width, height, reveal, entry, options.pointerX, options.pointerY, options.time);
  drawMotes(ctx, width, height, reveal, entry, options.time);
  drawInterior(ctx, width, height, entry, options.time);
  drawVignette(ctx, width, height, entry);
}

export function WizardingCanvas({
  mode,
  progress = 1,
  motionEnabled = true,
  className = "",
}: CastleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
    let frame = 0;
    let lastTime = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateScroll = () => {
      if (mode !== "background") return;
      const travel = Math.max(window.innerHeight * 2.15, 1);
      scrollRef.current = clamp(window.scrollY / travel);
      canvas.dataset.scrollProgress = scrollRef.current.toFixed(3);
      drawRef.current?.();
    };

    const resize = () => {
      devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(width * devicePixelRatio));
      canvas.height = Math.max(1, Math.floor(height * devicePixelRatio));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      drawRef.current?.();
    };

    const pointerMove = (event: PointerEvent) => {
      if (reducedMotion.matches || !motionEnabled) return;
      pointerRef.current.x = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 42;
      pointerRef.current.y = (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 26;
      drawRef.current?.();
    };

    const pointerReset = () => {
      pointerRef.current.x = 0;
      pointerRef.current.y = 0;
      drawRef.current?.();
    };

    const draw = (now = 0) => {
      if (!width || !height) return;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const elapsed = motionEnabled && !reducedMotion.matches ? now : lastTime;
      lastTime = elapsed;
      drawScene(ctx, width, height, {
        mode,
        loadProgress: progressRef.current,
        scrollProgress: scrollRef.current,
        time: elapsed,
        pointerX: pointerRef.current.x,
        pointerY: pointerRef.current.y,
      });
    };
    drawRef.current = () => draw(lastTime);
    resize();
    updateScroll();
    draw(0);

    const shouldAnimate =
      (mode === "loading" && !reducedMotion.matches) ||
      (motionEnabled && !reducedMotion.matches);
    const animate = (now: number) => {
      draw(now);
      if (shouldAnimate) frame = window.requestAnimationFrame(animate);
    };
    if (shouldAnimate) frame = window.requestAnimationFrame(animate);

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("pointermove", pointerMove, { passive: true });
    window.addEventListener("blur", pointerReset);
    return () => {
      window.cancelAnimationFrame(frame);
      drawRef.current = null;
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
