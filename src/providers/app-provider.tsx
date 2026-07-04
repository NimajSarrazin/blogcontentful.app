"use client";

import { type ReactNode } from "react";
import { CommandPalette } from "@/components/search/command-palette";
import {
  KeyboardShortcutsDialog,
  useGlobalKeyboardShortcuts,
} from "@/components/search/keyboard-shortcuts";
import { CommandPaletteProvider } from "@/providers/command-palette-provider";
import type { BlogPostPreview } from "@/types/blog";

function KeyboardShortcutsListener() {
  useGlobalKeyboardShortcuts();
  return <KeyboardShortcutsDialog />;
}

interface AppProviderProps {
  children: ReactNode;
  posts: BlogPostPreview[];
}

export function AppProvider({ children, posts }: AppProviderProps) {
  return (
    <CommandPaletteProvider>
      {children}
      <CommandPalette posts={posts} />
      <KeyboardShortcutsListener />
    </CommandPaletteProvider>
  );
}
