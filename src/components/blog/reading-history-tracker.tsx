"use client";

import { useEffect } from "react";
import { useReadingHistory } from "@/hooks/use-reading-history";

interface ReadingHistoryTrackerProps {
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string;
}

export function ReadingHistoryTracker({
  slug,
  title,
  excerpt,
  coverImageUrl,
}: ReadingHistoryTrackerProps) {
  const { addToHistory } = useReadingHistory();

  useEffect(() => {
    addToHistory({ slug, title, excerpt, coverImageUrl });
  }, [slug, title, excerpt, coverImageUrl, addToHistory]);

  return null;
}
