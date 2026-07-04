import type { ArticleFacets, ArticleFilters, BlogPostPreview } from "@/types/blog";

export function extractFacets(posts: BlogPostPreview[]): ArticleFacets {
  const categories = new Set<string>();
  const tags = new Set<string>();

  for (const post of posts) {
    post.categories.forEach((category) => categories.add(category));
    post.tags.forEach((tag) => tags.add(tag));
    if (post.category) categories.add(post.category);
  }

  return {
    categories: Array.from(categories).sort((a, b) => a.localeCompare(b)),
    tags: Array.from(tags).sort((a, b) => a.localeCompare(b)),
  };
}

export function filterPosts(
  posts: BlogPostPreview[],
  filters: ArticleFilters
): BlogPostPreview[] {
  const query = filters.query.trim().toLowerCase();

  return posts.filter((post) => {
    if (filters.category) {
      const matchesCategory =
        post.category === filters.category ||
        post.categories.includes(filters.category);
      if (!matchesCategory) return false;
    }

    if (filters.tag && !post.tags.includes(filters.tag)) {
      return false;
    }

    if (!query) return true;

    const haystack = [
      post.title,
      post.excerpt,
      post.category ?? "",
      ...post.categories,
      ...post.tags,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

export function getRecentPosts(
  posts: BlogPostPreview[],
  limit = 5
): BlogPostPreview[] {
  return [...posts]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, limit);
}

export function getPopularPosts(
  posts: BlogPostPreview[],
  limit = 5
): BlogPostPreview[] {
  return [...posts]
    .sort((a, b) => b.readingTime - a.readingTime || a.title.localeCompare(b.title))
    .slice(0, limit);
}
