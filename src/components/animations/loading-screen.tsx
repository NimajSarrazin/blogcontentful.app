"use client";

import { useEffect, useState } from "react";
import { gsap } from "@/lib/animations/register";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setVisible(false);
      return;
    }

    const overlay = document.getElementById("loading-screen");
    if (!overlay) {
      setVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => setVisible(false),
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [reducedMotion]);

  if (!visible) return null;

  return (
    <div
      id="loading-screen"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="font-display text-2xl font-bold">
          Readit<span className="text-brand">.</span>
        </div>
        <div className="h-0.5 w-24 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-full origin-left animate-[loading-bar_0.8s_ease-in-out_infinite] bg-brand" />
        </div>
      </div>
    </div>
  );
}
