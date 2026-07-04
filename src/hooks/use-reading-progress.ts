"use client";

import { useEffect, useState } from "react";

export function useReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const article = document.getElementById("article-content");
      if (!article) return;

      const rect = article.getBoundingClientRect();
      const articleTop = window.scrollY + rect.top;
      const articleHeight = article.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollable = articleHeight - viewportHeight;

      if (scrollable <= 0) {
        setProgress(100);
        return;
      }

      const scrolled = window.scrollY - articleTop;
      const value = Math.min(100, Math.max(0, (scrolled / scrollable) * 100));
      setProgress(value);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return progress;
}
