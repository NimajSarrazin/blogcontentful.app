"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BOOKMARKS_STORAGE_KEY,
  parseBookmarks,
  serializeBookmarks,
  type Bookmark,
} from "@/lib/bookmarks";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = parseBookmarks(localStorage.getItem(BOOKMARKS_STORAGE_KEY));
    setBookmarks(stored);
    setReady(true);
  }, []);

  const persist = useCallback((next: Bookmark[]) => {
    setBookmarks(next);
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, serializeBookmarks(next));
  }, []);

  const isBookmarked = useCallback(
    (slug: string) => bookmarks.some((bookmark) => bookmark.slug === slug),
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    (bookmark: Omit<Bookmark, "savedAt">) => {
      const exists = bookmarks.some((item) => item.slug === bookmark.slug);

      if (exists) {
        persist(bookmarks.filter((item) => item.slug !== bookmark.slug));
        return false;
      }

      persist([
        {
          ...bookmark,
          savedAt: new Date().toISOString(),
        },
        ...bookmarks,
      ]);
      return true;
    },
    [bookmarks, persist]
  );

  const removeBookmark = useCallback(
    (slug: string) => {
      persist(bookmarks.filter((item) => item.slug !== slug));
    },
    [bookmarks, persist]
  );

  return {
    bookmarks,
    ready,
    isBookmarked,
    toggleBookmark,
    removeBookmark,
  };
}
