"use client";

import { PostCard } from "@/components/blog/post-card";
import { StaggerReveal } from "@/components/animations/stagger-reveal";
import type { BlogPostPreview } from "@/types/blog";

interface ArticlesGridProps {
  posts: BlogPostPreview[];
}

export function ArticlesGrid({ posts }: ArticlesGridProps) {
  return (
    <StaggerReveal className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <div
          key={post.id}
          data-stagger-item
          className={post.slug === "Mode" ? "md:hidden lg:block" : undefined}
        >
          <PostCard post={post} priority={index < 3} />
        </div>
      ))}
    </StaggerReveal>
  );
}
