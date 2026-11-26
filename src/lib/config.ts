export const CDN_BASE_URL =
  process.env.NEXT_PUBLIC_CDN_BASE || "/images/frames";

export const FRAME_CONFIG = {
  COUNT: 473,
  DPR_LIMIT: 2,
  INITIAL_FRAME_COUNT: 40,
  START_FRAME: 120,
  END_FRAME: 473,
} as const;

export const ANIMATION_CONFIG = {
  LERP_FACTOR: 0.2,
  LERP_THRESHOLD: 0.001,
  SPRING: {
    stiffness: 220,
    damping: 30,
    mass: 0.2,
  },
} as const;

export const PRELOAD_STRATEGY = "visible" as "eager" | "visible" | "none";

export const OPACITY_TRANSITIONS = {
  title: [0.0, 0.05, 0.12],
  left: [0.25, 0.32, 0.42],
  right: [0.55, 0.62, 0.72],
  cta: [0.85, 0.92, 1.0],
};
