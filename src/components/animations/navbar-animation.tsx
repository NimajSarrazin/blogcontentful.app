"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { DURATION, EASE } from "@/lib/animations/config";
import { gsap, registerGsapPlugins } from "@/lib/animations/register";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface NavbarAnimationProps {
  children: React.ReactNode;
  scrolled: boolean;
}

export function NavbarAnimation({ children, scrolled }: NavbarAnimationProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      registerGsapPlugins();
      const el = ref.current;
      if (!el || reducedMotion) return;

      gsap.from(el, {
        y: -20,
        opacity: 0,
        duration: DURATION.normal,
        ease: EASE.premium,
      });
    },
    { scope: ref }
  );

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reducedMotion) return;

      gsap.to(el, {
        backdropFilter: scrolled ? "blur(12px)" : "blur(0px)",
        duration: 0.3,
        ease: EASE.smooth,
      });
    },
    { dependencies: [scrolled, reducedMotion], scope: ref }
  );

  return (
    <header
      ref={ref}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-350 ease-premium",
        scrolled
          ? "border-b border-border/60 bg-background/80 shadow-soft"
          : "bg-transparent"
      )}
    >
      {children}
    </header>
  );
}
