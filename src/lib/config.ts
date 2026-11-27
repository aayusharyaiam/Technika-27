export const CDN_BASE_URL =
  process.env.NEXT_PUBLIC_CDN_BASE || "/images/frames";

export const FRAME_CONFIG = {
  COUNT: 234,
  DPR_LIMIT: 2,
  INITIAL_FRAME_COUNT: 40,
  START_FRAME: 0,
  END_FRAME: 233,
} as const;

export const ANIMATION_CONFIG = {
  LERP_FACTOR: 0.19,
  LERP_THRESHOLD: 0.001,
  SPRING: {
    stiffness: 200,
    damping: 30,
    mass: 0.25,
  },
} as const;

export const PRELOAD_STRATEGY = "visible" as "eager" | "visible" | "none";

export const OPACITY_TRANSITIONS = {
  title: [0.0, 0.06, 0.22],
  left: [0.22, 0.28, 0.44],
  right: [0.45, 0.51, 0.67],
  cta: [0.85, 0.91, 1.0],
};
