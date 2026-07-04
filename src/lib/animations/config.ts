export const EASE = {
  premium: "power3.out",
  smooth: "power2.inOut",
  bounce: "back.out(1.2)",
} as const;

export const DURATION = {
  fast: 0.4,
  normal: 0.7,
  slow: 1.0,
} as const;

export const STAGGER = {
  tight: 0.08,
  normal: 0.12,
  relaxed: 0.18,
} as const;

export const SCROLL_TRIGGER = {
  start: "top 85%",
  toggleActions: "play none none none",
} as const;
