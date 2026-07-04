"use client";

import { useMemo, useState } from "react";
import { ArticlesGrid } from "@/components/blog/articles-grid";
import { ArticleFilters } from "@/components/search/article-filters";
import { SearchBar } from "@/components/search/search-bar";
import {
  extractFacets,
  filterPosts,
} from "@/services/blog/search.service";
import type { BlogPostPreview } from "@/types/blog";

interface ArticlesExplorerProps {
  posts: BlogPostPreview[];
}

export function ArticlesExplorer({ posts }: ArticlesExplorerProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [tag, setTag] = useState<string | null>(null);

  const facets = useMemo(() => extractFacets(posts), [posts]);

  const filteredPosts = useMemo(
    () => filterPosts(posts, { query, category, tag }),
    [posts, query, category, tag]
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <SearchBar value={query} onChange={setQuery} />
        <p className="self-center text-sm text-muted-foreground lg:text-right">
          {filteredPosts.length} of {posts.length} articles
        </p>
      </div>

      <ArticleFilters
        categories={facets.categories}
        tags={facets.tags}
        activeCategory={category}
        activeTag={tag}
        onCategoryChange={setCategory}
        onTagChange={setTag}
      />

      {filteredPosts.length > 0 ? (
        <ArticlesGrid posts={filteredPosts} />
      ) : (
        <div className="rounded-xl border border-dashed border-border py-16 text-center">
          <p className="text-sm font-medium">No articles match your filters</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or clearing filters.
          </p>
        </div>
      )}
    </div>
  );
}
