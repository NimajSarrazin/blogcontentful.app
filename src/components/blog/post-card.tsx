import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { BookmarkButton } from "@/components/blog/bookmark-button";
import { formatDate } from "@/lib/utils";
import type { BlogPostPreview } from "@/types/blog";

interface PostCardProps {
  post: BlogPostPreview;
  priority?: boolean;
}

export function PostCard({ post, priority = false }: PostCardProps) {
  const publishedDate = new Date(post.publishedAt);

  return (
    <article className="group">
      <Link href={`/post/${post.slug}`} className="block">
        <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-soft transition-all duration-350 ease-premium group-hover:-translate-y-1 group-hover:shadow-card">
          <div className="relative aspect-[4/3] overflow-hidden">
            <div className="absolute right-3 top-3 z-10">
              <BookmarkButton
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                coverImageUrl={post.coverImage.url}
                className="border-background/20 bg-background/80 backdrop-blur-sm"
              />
            </div>
            <Image
              src={post.coverImage.url}
              alt={post.coverImage.alt}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 ease-premium group-hover:scale-105"
            />
            <div className="absolute bottom-4 left-4 rounded-md bg-brand px-3 py-2 text-brand-foreground shadow-soft">
              <p className="text-2xl font-bold leading-none">
                {publishedDate.getDate()}
              </p>
              <p className="text-xs font-medium uppercase">
                {formatDate(post.publishedAt, "MMM yyyy")}
              </p>
            </div>
          </div>

          <div className="space-y-3 p-5">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {post.category && (
                <span className="rounded-full bg-muted px-2.5 py-1 font-medium">
                  {post.category}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {post.readingTime} min read
              </span>
            </div>

            <h2 className="text-lg font-semibold tracking-tight transition-colors group-hover:text-brand">
              {post.title}
            </h2>
            <p className="line-clamp-3 text-sm text-muted-foreground">
              {post.excerpt}
            </p>

            <span className="inline-flex items-center gap-1 text-sm font-medium text-brand">
              Read article
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
