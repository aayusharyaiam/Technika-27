"use client";

import { useEffect, useRef, useState } from "react";

const SNAKE_PATH = "M 50 0 C 82 70 18 140 50 210 C 82 280 18 350 50 420 C 82 490 18 560 50 630 C 82 700 18 770 50 840 C 82 910 18 960 50 1000";

type HeadPosition = { x: number; y: number; angle: number };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function ScrollSnake() {
  const pathRef = useRef<SVGPathElement>(null);
  const frameRef = useRef<number | null>(null);
  const pathLengthRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [head, setHead] = useState<HeadPosition>({ x: 50, y: 45, angle: 0 });

  useEffect(() => {
    const root = document.documentElement;

    const update = () => {
      frameRef.current = null;
      const maxScroll = Math.max(1, root.scrollHeight - window.innerHeight);
      const nextProgress = clamp(window.scrollY / maxScroll, 0, 1);
      setProgress((current) => Math.abs(current - nextProgress) < 0.001 ? current : nextProgress);

      const path = pathRef.current;
      if (!path) return;
      if (!pathLengthRef.current) pathLengthRef.current = path.getTotalLength();

      const snakeProgress = 0.045 + nextProgress * 0.955;
      const distance = pathLengthRef.current * snakeProgress;
      const point = path.getPointAtLength(distance);
      const nextPoint = path.getPointAtLength(Math.min(pathLengthRef.current, distance + 1));
      const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180 / Math.PI - 90;

      setHead((current) => Math.abs(current.x - point.x) < 0.05 && Math.abs(current.y - point.y) < 0.05 ? current : { x: point.x, y: point.y, angle });
    };

    const scheduleUpdate = () => {
      if (frameRef.current === null) frameRef.current = window.requestAnimationFrame(update);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(scheduleUpdate);
    observer?.observe(root);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      observer?.disconnect();
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const snakeLength = (8 + progress * 92).toFixed(2);

  return (
    <aside className="scroll-snake" data-testid="scroll-snake" data-scroll-progress={Math.round(progress * 100)} data-snake-length={snakeLength} aria-hidden="true">
      <svg className="scroll-snake-svg" viewBox="0 0 100 1000" role="presentation">
        <defs>
          <linearGradient id="scroll-snake-body-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f0ca7a" />
            <stop offset="0.46" stopColor="#a9c887" />
            <stop offset="1" stopColor="#2d7058" />
          </linearGradient>
          <filter id="scroll-snake-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <path className="scroll-snake-rail" d={SNAKE_PATH} pathLength={100} />
        <path className="scroll-snake-body-shadow" d={SNAKE_PATH} pathLength={100} strokeDasharray={`${snakeLength} 100`} />
        <path className="scroll-snake-body" d={SNAKE_PATH} pathLength={100} strokeDasharray={`${snakeLength} 100`} />
        <path className="scroll-snake-scales" d={SNAKE_PATH} pathLength={100} strokeDasharray={`${snakeLength} 100`} />

        <circle className="scroll-snake-marker" cx="50" cy="0" r="2.4" />
        <circle className="scroll-snake-marker" cx="50" cy="1000" r="2.4" />

        <g className="scroll-snake-head" transform={`translate(${head.x} ${head.y}) rotate(${head.angle})`} filter="url(#scroll-snake-glow)">
          <path className="scroll-snake-head-shape" d="M 0 11 C -4 9 -7 5 -6 -1 C -5 -8 5 -8 6 -1 C 7 5 4 9 0 11 Z" />
          <circle className="scroll-snake-eye" cx="-3.2" cy="-1" r="1.15" />
          <circle className="scroll-snake-eye" cx="3.2" cy="-1" r="1.15" />
          <path className="scroll-snake-tongue" d="M 0 10 C -1 13 -2 14 -3 16 M 0 10 C 1 13 2 14 3 16" />
        </g>
      </svg>
    </aside>
  );
}
