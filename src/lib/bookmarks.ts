export const BOOKMARKS_STORAGE_KEY = "readit-bookmarks";

export interface Bookmark {
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string;
  savedAt: string;
}

export function parseBookmarks(raw: string | null): Bookmark[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as Bookmark[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function serializeBookmarks(bookmarks: Bookmark[]): string {
  return JSON.stringify(bookmarks);
}
