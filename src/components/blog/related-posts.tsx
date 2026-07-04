import { PostCard } from "@/components/blog/post-card";
import type { BlogPostPreview } from "@/types/blog";

interface RelatedPostsProps {
  posts: BlogPostPreview[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts.length) return null;

  return (
    <section className="space-y-6" aria-labelledby="related-posts-heading">
      <h2 id="related-posts-heading" className="text-2xl font-semibold tracking-tight">
        Related articles
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
