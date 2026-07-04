"use client";

import { cn } from "@/lib/utils";

interface ArticleFiltersProps {
  categories: string[];
  tags: string[];
  activeCategory: string | null;
  activeTag: string | null;
  onCategoryChange: (category: string | null) => void;
  onTagChange: (tag: string | null) => void;
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-brand bg-brand text-brand-foreground"
          : "border-border bg-card text-muted-foreground hover:border-brand/40 hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

export function ArticleFilters({
  categories,
  tags,
  activeCategory,
  activeTag,
  onCategoryChange,
  onTagChange,
}: ArticleFiltersProps) {
  if (!categories.length && !tags.length) return null;

  return (
    <div className="space-y-4">
      {categories.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Categories
          </p>
          <div className="flex flex-wrap gap-2">
            <FilterChip
              label="All"
              active={!activeCategory}
              onClick={() => onCategoryChange(null)}
            />
            {categories.map((category) => (
              <FilterChip
                key={category}
                label={category}
                active={activeCategory === category}
                onClick={() =>
                  onCategoryChange(activeCategory === category ? null : category)
                }
              />
            ))}
          </div>
        </div>
      )}

      {tags.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Tags
          </p>
          <div className="flex flex-wrap gap-2">
            <FilterChip
              label="All"
              active={!activeTag}
              onClick={() => onTagChange(null)}
            />
            {tags.map((tag) => (
              <FilterChip
                key={tag}
                label={`#${tag}`}
                active={activeTag === tag}
                onClick={() => onTagChange(activeTag === tag ? null : tag)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
