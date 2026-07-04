"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ExternalLink, Trash2 } from "lucide-react";
import {
  adminDeleteComment,
  adminHardDeleteComment,
} from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import type { AdminComment } from "@/types/article";

export function AdminCommentsTable({ comments }: { comments: AdminComment[] }) {
  if (comments.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">No comments found.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left">
            <th className="px-4 py-3 font-medium">Author</th>
            <th className="px-4 py-3 font-medium">Post</th>
            <th className="px-4 py-3 font-medium">Comment</th>
            <th className="px-4 py-3 font-medium">Stats</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment) => (
            <AdminCommentRow key={comment.id} comment={comment} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdminCommentRow({ comment }: { comment: AdminComment }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSoftDelete = () => {
    if (!confirm("Soft-delete this comment?")) return;
    startTransition(async () => {
      await adminDeleteComment(comment.id, comment.postSlug);
      router.refresh();
    });
  };

  const handleHardDelete = () => {
    if (!confirm("Permanently delete this comment? This cannot be undone.")) return;
    startTransition(async () => {
      await adminHardDeleteComment(comment.id, comment.postSlug);
      router.refresh();
    });
  };

  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-4 py-3">
        <span className="font-medium">{comment.author.username}</span>
        <p className="text-xs text-muted-foreground">
          {new Date(comment.createdAt).toLocaleDateString()}
        </p>
      </td>
      <td className="px-4 py-3">
        <Link
          href={`/post/${comment.postSlug}#comments`}
          className="inline-flex items-center gap-1 text-brand hover:underline"
        >
          {comment.postTitle}
          <ExternalLink className="h-3 w-3" />
        </Link>
      </td>
      <td className="max-w-xs px-4 py-3">
        {comment.isDeleted ? (
          <span className="italic text-muted-foreground">Deleted</span>
        ) : (
          <p className="line-clamp-2">{comment.content}</p>
        )}
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">
        {comment.likeCount} likes
        {comment.reportCount > 0 && (
          <span className="ml-2 text-red-600 dark:text-red-400">
            {comment.reportCount} report{comment.reportCount !== 1 ? "s" : ""}
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-1">
          {!comment.isDeleted && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSoftDelete}
              disabled={isPending}
            >
              Hide
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-red-600 dark:text-red-400"
            onClick={handleHardDelete}
            disabled={isPending}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
