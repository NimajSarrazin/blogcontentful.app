"use client";

import { useEffect, useState } from "react";
import { useCommandPalette } from "@/providers/command-palette-provider";

const SHORTCUTS = [
  { keys: ["⌘", "K"], description: "Open command palette" },
  { keys: ["/"], description: "Focus article search" },
  { keys: ["?"], description: "Show keyboard shortcuts" },
  { keys: ["Esc"], description: "Close dialogs" },
];

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  return (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    target.isContentEditable
  );
}

export function KeyboardShortcutsDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "?" && !event.metaKey && !event.ctrlKey && !isTypingTarget(event.target)) {
        event.preventDefault();
        setOpen(true);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
        aria-label="Close shortcuts"
        onClick={() => setOpen(false)}
      />
      <div className="relative z-[91] w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-elevated">
        <h2 className="text-lg font-semibold">Keyboard shortcuts</h2>
        <ul className="mt-4 space-y-3">
          {SHORTCUTS.map((shortcut) => (
            <li
              key={shortcut.description}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <span className="text-muted-foreground">{shortcut.description}</span>
              <span className="flex items-center gap-1">
                {shortcut.keys.map((key) => (
                  <kbd
                    key={key}
                    className="rounded border border-border bg-muted px-2 py-1 text-xs font-medium"
                  >
                    {key}
                  </kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function useGlobalKeyboardShortcuts() {
  const { setOpen } = useCommandPalette();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
        return;
      }

      if (
        event.key === "/" &&
        !event.metaKey &&
        !event.ctrlKey &&
        !isTypingTarget(event.target)
      ) {
        event.preventDefault();
        const searchInput = document.getElementById("article-search");
        if (searchInput instanceof HTMLInputElement) {
          searchInput.focus();
          searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setOpen]);
}
