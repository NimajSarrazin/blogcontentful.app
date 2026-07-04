import type { CommentSort } from "@/types/comment";
import { cn } from "@/lib/utils";

const SORT_OPTIONS: { value: CommentSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "popular", label: "Popular" },
];

interface CommentSortProps {
  value: CommentSort;
  onChange: (sort: CommentSort) => void;
  disabled?: boolean;
}

export function CommentSortSelect({ value, onChange, disabled }: CommentSortProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Sort by</span>
      <div className="flex rounded-lg border border-border p-0.5">
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              value === option.value
                ? "bg-brand text-brand-foreground"
                : "text-muted-foreground hover:text-foreground",
              disabled && "opacity-50"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
