"use client";

import { Search } from "lucide-react";
import { useCommandPalette } from "@/providers/command-palette-provider";
import { SearchShortcutHint } from "@/components/search/search-bar";

export function CommandPaletteTrigger() {
  const { setOpen } = useCommandPalette();

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:inline-flex"
      aria-label="Open command palette"
    >
      <Search className="h-4 w-4" />
      <span>Search</span>
      <SearchShortcutHint />
    </button>
  );
}
