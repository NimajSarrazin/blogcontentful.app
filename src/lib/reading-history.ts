export const READING_HISTORY_STORAGE_KEY = "readit-reading-history";
export const MAX_READING_HISTORY = 20;

export interface ReadingHistoryEntry {
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string;
  readAt: string;
}

export function parseReadingHistory(raw: string | null): ReadingHistoryEntry[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as ReadingHistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function serializeReadingHistory(entries: ReadingHistoryEntry[]): string {
  return JSON.stringify(entries);
}
