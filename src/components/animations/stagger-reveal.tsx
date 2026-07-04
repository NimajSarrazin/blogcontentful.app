"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { DURATION, EASE, SCROLL_TRIGGER, STAGGER } from "@/lib/animations/config";
import { gsap, registerGsapPlugins } from "@/lib/animations/register";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
}

export function StaggerReveal({
  children,
  className,
  stagger = STAGGER.normal,
  y = 40,
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      registerGsapPlugins();
      const container = ref.current;
      if (!container || reducedMotion) return;

      const items = container.querySelectorAll("[data-stagger-item]");
      if (!items.length) return;

      gsap.from(items, {
        opacity: 0,
        y,
        duration: DURATION.normal,
        stagger,
        ease: EASE.premium,
        scrollTrigger: {
          trigger: container,
          start: SCROLL_TRIGGER.start,
          toggleActions: SCROLL_TRIGGER.toggleActions,
        },
      });
    },
    { dependencies: [reducedMotion, stagger, y], scope: ref }
  );

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
