"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { gsap } from "@/lib/animations/register";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface MagneticProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export function Magnetic({ children, className, strength = 0.35 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    gsap.to(ref.current, {
      x: x * strength,
      y: y * strength,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleLeave = () => {
    if (reducedMotion || !ref.current) return;

    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    });
  };

  return (
    <div
      ref={ref}
      className={cn("inline-block", className)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  );
}
