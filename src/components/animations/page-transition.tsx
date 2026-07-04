"use client";

import { useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { DURATION, EASE } from "@/lib/animations/config";
import { gsap, registerGsapPlugins } from "@/lib/animations/register";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      registerGsapPlugins();
      const el = ref.current;
      if (!el || reducedMotion) return;

      gsap.fromTo(
        el,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: DURATION.fast, ease: EASE.premium }
      );
    },
    { dependencies: [pathname, reducedMotion], scope: ref }
  );

  return <div ref={ref}>{children}</div>;
}
