"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createArticle } from "@/app/articles/actions";
import { Button } from "@/components/ui/button";
import type { ArticleActionState } from "@/types/article";

const initialState: ArticleActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create article"}
    </Button>
  );
}

export function AdminArticleCreate() {
  const router = useRouter();
  const [state, formAction] = useFormState(createArticle, initialState);

  useEffect(() => {
    if (state.success && state.articleId) {
      router.push(`/admin?tab=articles&edit=${state.articleId}`);
      router.refresh();
    }
  }, [state.success, state.articleId, router]);

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Create article</h3>
        <button
          type="button"
          onClick={() => router.push("/admin?tab=articles")}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="submitAction" value="draft" />

        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
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
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
            placeholder="auto-generated if empty"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="excerpt" className="text-sm font-medium">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={2}
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
            rows={12}
            className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm"
          />
        </div>

        {state.error && (
          <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
        )}

        <SubmitButton />
      </form>
    </div>
  );
}
