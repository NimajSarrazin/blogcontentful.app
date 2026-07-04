import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { BlogPostPreview } from "@/types/blog";

interface PostNavigationProps {
  previous: BlogPostPreview | null;
  next: BlogPostPreview | null;
}

export function PostNavigation({ previous, next }: PostNavigationProps) {
  if (!previous && !next) return null;

  return (
    <nav
      className="grid gap-4 border-t border-border pt-8 sm:grid-cols-2"
      aria-label="Post navigation"
    >
      {previous ? (
        <Link
          href={`/post/${previous.slug}`}
          className="group rounded-xl border border-border p-5 transition-colors hover:bg-accent"
        >
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            Previous
          </span>
          <p className="mt-2 font-medium group-hover:text-brand">{previous.title}</p>
        </Link>
      ) : (
        <div />
      )}

      {next && (
        <Link
          href={`/post/${next.slug}`}
          className="group rounded-xl border border-border p-5 text-right transition-colors hover:bg-accent sm:col-start-2"
        >
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            Next
            <ArrowRight className="h-4 w-4" />
          </span>
          <p className="mt-2 font-medium group-hover:text-brand">{next.title}</p>
        </Link>
      )}
    </nav>
  );
}
