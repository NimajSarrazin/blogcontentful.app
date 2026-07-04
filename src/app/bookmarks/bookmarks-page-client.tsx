"use client";

import Image from "next/image";
import Link from "next/link";
import { Bookmark, Trash2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/layout/hero";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { formatDate } from "@/lib/utils";

export function BookmarksPageClient() {
  const { bookmarks, ready, removeBookmark } = useBookmarks();

  return (
    <>
      <PageHero
        title="Bookmarks"
        description="Articles you've saved for later reading."
      />
      <Container className="py-16">
        {!ready ? (
          <p className="text-sm text-muted-foreground">Loading bookmarks...</p>
        ) : bookmarks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-16 text-center">
            <Bookmark className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="font-medium">No bookmarks yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Save articles from any post page to read them later.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex text-sm font-medium text-brand hover:underline"
            >
              Browse articles
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((bookmark) => (
              <article
                key={bookmark.slug}
                className="flex gap-4 rounded-xl border border-border bg-card p-4 shadow-soft"
              >
                <Link
                  href={`/post/${bookmark.slug}`}
                  className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg"
                >
                  <Image
                    src={bookmark.coverImageUrl}
                    alt={bookmark.title}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/post/${bookmark.slug}`}
                    className="font-semibold hover:text-brand"
                  >
                    {bookmark.title}
                  </Link>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {bookmark.excerpt}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Saved {formatDate(bookmark.savedAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeBookmark(bookmark.slug)}
                  className="self-start rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-red-500"
                  aria-label={`Remove ${bookmark.title} from bookmarks`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </article>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
