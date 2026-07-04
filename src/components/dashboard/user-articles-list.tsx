"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { createArticle, deleteArticle, updateArticle } from "@/app/articles/actions";
import { Button } from "@/components/ui/button";
import { ARTICLE_STATUS_COLORS, formatStatusLabel } from "@/lib/articles/utils";
import { cn } from "@/lib/utils";
import type { Article, ArticleActionState } from "@/types/article";

const initialState: ArticleActionState = {};

function SaveDraftButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" name="submitAction" value="draft" variant="secondary" disabled={pending}>
      {pending ? "Saving..." : "Save draft"}
    </Button>
  );
}

function SubmitForReviewButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" name="submitAction" value="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit for review"}
    </Button>
  );
}

export function UserArticlesList({
  articles,
  showNewForm,
  editId,
}: {
  articles: Article[];
  showNewForm: boolean;
  editId: string | null;
}) {
  const editingArticle = editId ? articles.find((a) => a.id === editId) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {articles.length} article{articles.length !== 1 ? "s" : ""}
        </p>
        {!showNewForm && !editId && (
          <Link href="/dashboard?tab=articles&new=1">
            <Button type="button" size="sm">
              <Plus className="h-4 w-4" />
              New article
            </Button>
          </Link>
        )}
      </div>

      {showNewForm && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Write a new article</h3>
            <Link
              href="/dashboard?tab=articles"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Link>
          </div>
          <ArticleForm mode="create" />
        </div>
      )}

      {editingArticle && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Edit article</h3>
            <Link
              href="/dashboard?tab=articles"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Link>
          </div>
          <ArticleForm mode="edit" article={editingArticle} />
        </div>
      )}

      {articles.length === 0 && !showNewForm ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center">
          <p className="text-muted-foreground">No articles yet.</p>
          <Link
            href="/dashboard?tab=articles&new=1"
            className="mt-4 inline-block text-sm font-medium text-brand hover:underline"
          >
            Write your first article
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {articles
            .filter((a) => a.id !== editId)
            .map((article) => (
              <ArticleRow key={article.id} article={article} />
            ))}
        </div>
      )}
    </div>
  );
}

function ArticleRow({ article }: { article: Article }) {
  const router = useRouter();
  const canEdit = ["draft", "pending", "rejected"].includes(article.status);
  const canDelete = ["draft", "rejected"].includes(article.status);

  const handleDelete = async () => {
    if (!confirm("Delete this article?")) return;
    const result = await deleteArticle(article.id);
    if (result.error) alert(result.error);
    else router.refresh();
  };

  return (
    <article className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-soft">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-medium">{article.title}</h3>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium",
              ARTICLE_STATUS_COLORS[article.status]
            )}
          >
            {formatStatusLabel(article.status)}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          /{article.slug} · Updated{" "}
          {new Date(article.updatedAt).toLocaleDateString()}
        </p>
        {article.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {article.excerpt}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        {canEdit && (
          <Link href={`/dashboard?tab=articles&edit=${article.id}`}>
            <Button type="button" variant="ghost" size="sm">
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
          </Link>
        )}
        {canDelete && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-red-600 dark:text-red-400"
            onClick={handleDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        )}
      </div>
    </article>
  );
}

function ArticleForm({
  mode,
  article,
}: {
  mode: "create" | "edit";
  article?: Article;
}) {
  const router = useRouter();
  const action = mode === "create" ? createArticle : updateArticle;
  const [state, formAction] = useFormState(action, initialState);

  useEffect(() => {
    if (state.success && state.articleId) {
      router.push("/dashboard?tab=articles");
      router.refresh();
    }
  }, [state.success, state.articleId, router]);

  return (
    <form action={formAction} className="space-y-4">
      {mode === "edit" && article && (
        <input type="hidden" name="articleId" value={article.id} />
      )}

      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          minLength={3}
          defaultValue={article?.title ?? ""}
          className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
          placeholder="Article title"
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
          pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
          defaultValue={article?.slug ?? ""}
          className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
          placeholder="my-article-slug (auto-generated if empty)"
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
          defaultValue={article?.excerpt ?? ""}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          placeholder="Short summary (optional)"
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
          minLength={10}
          rows={12}
          defaultValue={article?.content ?? ""}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
          placeholder="Write your article content here..."
        />
      </div>

      {state.error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {state.error}
        </p>
      )}

      {state.success && (
        <p className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
          {state.success}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <SaveDraftButton />
        <SubmitForReviewButton />
      </div>
    </form>
  );
}
