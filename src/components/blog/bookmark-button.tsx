"use client";

import { Bookmark } from "lucide-react";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string;
  className?: string;
  showLabel?: boolean;
}

export function BookmarkButton({
  slug,
  title,
  excerpt,
  coverImageUrl,
  className,
  showLabel = false,
}: BookmarkButtonProps) {
  const { ready, isBookmarked, toggleBookmark } = useBookmarks();
  const saved = ready && isBookmarked(slug);

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
        location: "bookmark-button.tsx:render",
        message: "BookmarkButton render state",
        data: { slug, ready, saved, ariaPressed: saved },
        timestamp: Date.now(),
        hypothesisId: "C",
      }),
    }).catch(() => {});
  }
  // #endregion

  return (
    <button
      type="button"
      disabled={!ready}
      aria-pressed={saved}
      aria-label={saved ? "Remove bookmark" : "Save bookmark"}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleBookmark({ slug, title, excerpt, coverImageUrl });
      }}
      className={cn(
        "inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:bg-accent disabled:opacity-50",
        saved && "border-brand/40 bg-brand/10 text-brand",
        className
      )}
    >
      <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
      {showLabel && (saved ? "Saved" : "Save")}
    </button>
  );
}
