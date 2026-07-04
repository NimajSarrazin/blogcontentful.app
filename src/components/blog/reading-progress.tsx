"use client";

import { useReadingProgress } from "@/hooks/use-reading-progress";

export function ReadingProgress() {
  const progress = useReadingProgress();

  // #region agent log
  if (typeof window !== "undefined") {
    fetch("http://127.0.0.1:7263/ingest/4e4403bf-211c-4df0-815b-6ab32322b273", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "688f2a",
      },
      body: JSON.stringify({
        sessionId: "688f2a",
        runId: "pre-fix",
        location: "reading-progress.tsx:render",
        message: "ReadingProgress render state",
        data: {
          progress,
          ariaValuenow: Math.round(progress),
          width: `${progress}%`,
          scrollY: window.scrollY,
        },
        timestamp: Date.now(),
        hypothesisId: "E",
      }),
    }).catch(() => {});
  }
  // #endregion

  return (
    <div
      className="fixed inset-x-0 top-0 z-[60] h-1 bg-transparent"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <div
        className="h-full bg-brand transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
