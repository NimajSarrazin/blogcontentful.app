"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsapPlugins } from "@/lib/animations/register";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface ParallaxLayerProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

export function ParallaxLayer({
  children,
  className,
  speed = 0.3,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      registerGsapPlugins();
      const el = ref.current;
      if (!el || reducedMotion) return;

      gsap.to(el, {
        yPercent: speed * 100,
        ease: "none",
        scrollTrigger: {
          trigger: el.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { dependencies: [reducedMotion, speed], scope: ref }
  );

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}
