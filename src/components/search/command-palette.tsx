"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import {
  Bookmark,
  FileText,
  Home,
  Info,
  Mail,
  Moon,
  Search,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useCommandPalette } from "@/providers/command-palette-provider";
import { NAV_LINKS } from "@/lib/constants";
import type { BlogPostPreview } from "@/types/blog";

const ICONS: Record<string, typeof Home> = {
  "/": Home,
  "/about": Info,
  "/contact": Mail,
  "/bookmarks": Bookmark,
};

interface CommandPaletteProps {
  posts: BlogPostPreview[];
}

export function CommandPalette({ posts }: CommandPaletteProps) {
  const { open, setOpen } = useCommandPalette();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  const navigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command palette"
      className="fixed inset-0 z-[80]"
    >
      <div className="fixed inset-0 bg-background/70 backdrop-blur-sm" />
      <div className="fixed left-1/2 top-[15%] z-[81] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-card shadow-elevated">
        <div className="flex items-center gap-2 border-b border-border px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="Search articles, pages, actions..."
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">
            ESC
          </kbd>
        </div>

        <Command.List className="max-h-80 overflow-y-auto p-2">
          <Command.Empty className="px-3 py-6 text-center text-sm text-muted-foreground">
            No results found.
          </Command.Empty>

          <Command.Group heading="Pages" className="px-1 py-2 text-xs text-muted-foreground">
            {NAV_LINKS.map((link) => {
              const Icon = ICONS[link.href] ?? FileText;
              return (
                <Command.Item
                  key={link.href}
                  value={`${link.label} ${link.href}`}
                  onSelect={() => navigate(link.href)}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm aria-selected:bg-accent"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  {link.label}
                </Command.Item>
              );
            })}
            <Command.Item
              value="Bookmarks saved articles"
              onSelect={() => navigate("/bookmarks")}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm aria-selected:bg-accent"
            >
              <Bookmark className="h-4 w-4 text-muted-foreground" />
              Bookmarks
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Articles" className="px-1 py-2 text-xs text-muted-foreground">
            {posts.map((post) => (
              <Command.Item
                key={post.slug}
                value={`${post.title} ${post.excerpt} ${post.category ?? ""}`}
                onSelect={() => navigate(`/post/${post.slug}`)}
                className="flex cursor-pointer flex-col gap-0.5 rounded-lg px-3 py-2.5 text-sm aria-selected:bg-accent"
              >
                <span className="font-medium">{post.title}</span>
                <span className="line-clamp-1 text-xs text-muted-foreground">
                  {post.excerpt}
                </span>
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Actions" className="px-1 py-2 text-xs text-muted-foreground">
            <Command.Item
              value="Toggle theme dark light mode"
              onSelect={() => {
                setTheme(theme === "dark" ? "light" : "dark");
                setOpen(false);
              }}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm aria-selected:bg-accent"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Moon className="h-4 w-4 text-muted-foreground" />
              )}
              Toggle theme
            </Command.Item>
          </Command.Group>
        </Command.List>
      </div>
    </Command.Dialog>
  );
}
