"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  adminDeleteArticle,
  adminUpdateArticleStatus,
} from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { ARTICLE_STATUS_COLORS, formatStatusLabel } from "@/lib/articles/utils";
import { cn } from "@/lib/utils";
import type { Article, ArticleStatus } from "@/types/article";

const STATUSES: ArticleStatus[] = ["draft", "pending", "published", "rejected"];

export function AdminArticlesTable({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">No articles found.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left">
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Author</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Updated</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <AdminArticleRow key={article.id} article={article} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdminArticleRow({ article }: { article: Article }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (status: ArticleStatus) => {
    startTransition(async () => {
      await adminUpdateArticleStatus(article.id, status);
      router.refresh();
    });
  };

  const handleDelete = () => {
    if (!confirm("Delete this article permanently?")) return;
    startTransition(async () => {
      await adminDeleteArticle(article.id);
      router.refresh();
    });
  };

  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-4 py-3">
        <p className="font-medium">{article.title}</p>
        <p className="text-xs text-muted-foreground">/{article.slug}</p>
      </td>
      <td className="px-4 py-3">{article.author.username}</td>
      <td className="px-4 py-3">
        <select
          value={article.status}
          onChange={(e) => handleStatusChange(e.target.value as ArticleStatus)}
          disabled={isPending}
          className={cn(
            "rounded-md border border-border bg-background px-2 py-1 text-xs font-medium",
            ARTICLE_STATUS_COLORS[article.status]
          )}
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {formatStatusLabel(status)}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">
        {new Date(article.updatedAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-1">
          <Link href={`/admin?tab=articles&edit=${article.id}`}>
            <Button type="button" variant="ghost" size="sm">
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-red-600 dark:text-red-400"
            onClick={handleDelete}
            disabled={isPending}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
