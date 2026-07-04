"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { updateArticle } from "@/app/articles/actions";
import { Button } from "@/components/ui/button";
import { ARTICLE_STATUS_COLORS, formatStatusLabel } from "@/lib/articles/utils";
import { cn } from "@/lib/utils";
import type { Article, ArticleActionState, ArticleStatus } from "@/types/article";

const initialState: ArticleActionState = {};
const STATUSES: ArticleStatus[] = ["draft", "pending", "published", "rejected"];

export function AdminArticleEditor({ article }: { article: Article }) {
  const router = useRouter();
  const [state, formAction] = useFormState(updateArticle, initialState);

  useEffect(() => {
    if (state.success) {
      router.push("/admin?tab=articles");
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Edit article</h3>
        <button
          type="button"
          onClick={() => router.push("/admin?tab=articles")}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="articleId" value={article.id} />
        <input type="hidden" name="submitAction" value="keep-status" />

        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={article.title}
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="slug" className="text-sm font-medium">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            defaultValue={article.slug}
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={article.status}
            className={cn(
              "h-10 w-full rounded-md border border-border bg-background px-3 text-sm",
              ARTICLE_STATUS_COLORS[article.status]
            )}
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {formatStatusLabel(status)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="excerpt" className="text-sm font-medium">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            defaultValue={article.excerpt ?? ""}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="text-sm font-medium">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={14}
            defaultValue={article.content}
            className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm"
          />
        </div>

        <p className="text-xs text-muted-foreground">
          Author: {article.author.username}
        </p>

        {state.error && (
          <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
        )}

        <Button type="submit">Save changes</Button>
      </form>
    </div>
  );
}
