"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { DURATION, EASE, STAGGER } from "@/lib/animations/config";
import { gsap, registerGsapPlugins } from "@/lib/animations/register";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function TextReveal({ children, className, delay = 0 }: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      registerGsapPlugins();
      const container = ref.current;
      if (!container || reducedMotion) return;

      const items = container.querySelectorAll("[data-reveal-item]");
      if (!items.length) return;

      gsap.from(items, {
        opacity: 0,
        y: 28,
        duration: DURATION.slow,
        stagger: STAGGER.relaxed,
        delay,
        ease: EASE.premium,
      });
    },
    { dependencies: [reducedMotion, delay], scope: ref }
  );

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
