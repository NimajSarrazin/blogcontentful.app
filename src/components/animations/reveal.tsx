"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { DURATION, EASE, SCROLL_TRIGGER } from "@/lib/animations/config";
import { gsap, registerGsapPlugins } from "@/lib/animations/register";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  once?: boolean;
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 32,
  duration = DURATION.normal,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      registerGsapPlugins();
      const el = ref.current;
      if (!el || reducedMotion) return;

      gsap.from(el, {
        opacity: 0,
        y,
        duration,
        delay,
        ease: EASE.premium,
        scrollTrigger: {
          trigger: el,
          start: SCROLL_TRIGGER.start,
          toggleActions: once ? SCROLL_TRIGGER.toggleActions : "play none play reverse",
        },
      });
    },
    { dependencies: [reducedMotion, delay, y, duration, once], scope: ref }
  );

  return (
    <div ref={ref} className={cn(reducedMotion ? undefined : "will-change-transform", className)}>
      {children}
    </div>
  );
}
