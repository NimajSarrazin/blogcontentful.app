"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { deleteComment, updateComment } from "@/app/comments/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { UserComment } from "@/types/article";
import type { CommentActionState } from "@/types/comment";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function UserCommentsList({ comments }: { comments: UserComment[] }) {
  if (comments.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-16 text-center">
        <p className="text-muted-foreground">You haven&apos;t posted any comments yet.</p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm font-medium text-brand hover:underline"
        >
          Browse articles
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <UserCommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}

function UserCommentItem({ comment }: { comment: UserComment }) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [message, setMessage] = useState<CommentActionState>({});
  const [isPending, startTransition] = useTransition();

  const handleUpdate = () => {
    const formData = new FormData();
    formData.set("commentId", comment.id);
    formData.set("postSlug", comment.postSlug);
    formData.set("content", content);

    startTransition(async () => {
      const result = await updateComment({}, formData);
      setMessage(result);
      if (result.success) setEditing(false);
    });
  };

  const handleDelete = () => {
    if (!confirm("Delete this comment?")) return;

    startTransition(async () => {
      const result = await deleteComment(comment.id, comment.postSlug);
      setMessage(result);
    });
  };

  if (comment.isDeleted) {
    return (
      <div className="rounded-xl border border-border bg-muted/30 p-4 opacity-60">
        <p className="text-sm italic text-muted-foreground">This comment was deleted.</p>
      </div>
    );
  }

  return (
    <article className="rounded-xl border border-border bg-card p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href={`/post/${comment.postSlug}#comments`}
            className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
          >
            {comment.postTitle}
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatDate(comment.createdAt)}
            {comment.likeCount > 0 && ` · ${comment.likeCount} like${comment.likeCount !== 1 ? "s" : ""}`}
          </p>
        </div>

        {!editing && (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setEditing(true)}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 dark:text-red-400"
              onClick={handleDelete}
              disabled={isPending}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {editing ? (
        <div className="mt-4 space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={handleUpdate} disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditing(false);
                setContent(comment.content);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm leading-relaxed">{comment.content}</p>
      )}

      {message.error && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">{message.error}</p>
      )}
      {message.success && (
        <p className={cn("mt-3 text-sm text-green-600 dark:text-green-400")}>
          {message.success}
        </p>
      )}
    </article>
  );
}
