import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, pattern = "MMMM d, yyyy") {
  const result = format(new Date(date), pattern);
  const isClient = typeof window !== "undefined";

  // #region agent log
  if (pattern.includes("h:mm") || pattern.includes("getDate")) {
    fetch("http://127.0.0.1:7263/ingest/4e4403bf-211c-4df0-815b-6ab32322b273", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "688f2a",
      },
      body: JSON.stringify({
        sessionId: "688f2a",
        runId: "pre-fix",
        location: "utils.ts:formatDate",
        message: "formatDate timezone-sensitive call",
        data: {
          isClient,
          input: String(date),
          pattern,
          result,
          timezone: isClient
            ? Intl.DateTimeFormat().resolvedOptions().timeZone
            : "server",
        },
        timestamp: Date.now(),
        hypothesisId: "D",
      }),
    }).catch(() => {});
  }
  // #endregion

  return result;
}

export function getReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function absoluteUrl(path: string): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://blogcontentful-app.vercel.app";
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}
