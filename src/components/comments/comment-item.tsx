"use client";

import { useEffect, useRef, useState } from "react";
import { UserAvatarImage } from "@/components/ui/user-avatar";
import {
  Flag,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  User,
} from "lucide-react";
import { useFormState, useFormStatus } from "react-dom";
import {
  deleteComment,
  reportComment,
  toggleCommentLike,
  updateComment,
} from "@/app/comments/actions";
import { CommentForm } from "@/components/comments/comment-form";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { MAX_NESTING_DEPTH } from "@/lib/constants";
import type { Comment, CommentActionState, CommentAuthor } from "@/types/comment";

const initialState: CommentActionState = {};

interface CommentItemProps {
  comment: Comment;
  postSlug: string;
  currentUserId: string | null;
  currentUserAuthor?: CommentAuthor;
  depth?: number;
  onOptimisticAdd?: (content: string, parentId: string) => void;
  onOptimisticUpdate?: (commentId: string, content: string) => void;
  onOptimisticDelete?: (commentId: string) => void;
  onOptimisticLike?: (commentId: string, liked: boolean) => void;
  onRevertOptimistic?: (tempId: string) => void;
}

function EditSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}

export function CommentItem({
  comment,
  postSlug,
  currentUserId,
  currentUserAuthor,
  depth = 0,
  onOptimisticAdd,
  onOptimisticUpdate,
  onOptimisticDelete,
  onOptimisticLike,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [editState, editAction] = useFormState(updateComment, initialState);
  const [isLiking, setIsLiking] = useState(false);
  const [reported, setReported] = useState(false);
  const prevEditSuccess = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (editState.success && editState.success !== prevEditSuccess.current) {
      prevEditSuccess.current = editState.success;
      setIsEditing(false);
    }
  }, [editState.success]);

  const isOwner = currentUserId === comment.userId;
  const canReply = depth < MAX_NESTING_DEPTH - 1 && !comment.isDeleted;

  const handleLike = async () => {
    if (!currentUserId || isLiking) return;
    setIsLiking(true);

    const newLiked = !comment.likedByMe;
    onOptimisticLike?.(comment.id, newLiked);

    const result = await toggleCommentLike(comment.id, postSlug);
    if (result.error) {
      onOptimisticLike?.(comment.id, !newLiked);
    }

    setIsLiking(false);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this comment?")) return;
    onOptimisticDelete?.(comment.id);
    await deleteComment(comment.id, postSlug);
    setShowMenu(false);
  };

  const handleReport = async () => {
    const result = await reportComment(comment.id, postSlug);
    if (!result.error) {
      setReported(true);
    }
    setShowMenu(false);
  };

  if (comment.isDeleted) {
    return (
      <div className={cn("flex gap-3", depth > 0 && "ml-8 sm:ml-12")}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="py-2 text-sm italic text-muted-foreground">Comment deleted</p>
      </div>
    );
  }

  return (
    <article className={cn("group", depth > 0 && "ml-8 sm:ml-12")}>
      <div className="flex gap-3">
        {comment.author.avatarUrl ? (
          <UserAvatarImage
            src={comment.author.avatarUrl}
            alt={comment.author.username}
            size={40}
            className="h-10 w-10 shrink-0"
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
            <span className="text-sm font-medium">
              {comment.author.username.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-sm font-semibold">{comment.author.username}</span>
              <time
                dateTime={comment.createdAt}
                className="ml-2 text-xs text-muted-foreground"
              >
                {formatDate(comment.createdAt, "MMM d, yyyy 'at' h:mm a")}
              </time>
              {comment.updatedAt !== comment.createdAt && (
                <span className="ml-1 text-xs text-muted-foreground">(edited)</span>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMenu((v) => !v)}
                className="rounded-md p-1 opacity-0 transition-opacity hover:bg-accent group-hover:opacity-100"
                aria-label="Comment options"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>

              {showMenu && (
                <div className="absolute right-0 z-10 mt-1 w-36 rounded-lg border border-border bg-card py-1 shadow-elevated">
                  {isOwner && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(true);
                          setShowMenu(false);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-accent dark:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </>
                  )}
                  {!isOwner && currentUserId && !reported && (
                    <button
                      type="button"
                      onClick={handleReport}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
                    >
                      <Flag className="h-3.5 w-3.5" />
                      Report
                    </button>
                  )}
                  {reported && (
                    <span className="block px-3 py-2 text-xs text-muted-foreground">
                      Reported
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {isEditing ? (
            <form action={editAction} className="mt-2 space-y-2">
              <input type="hidden" name="commentId" value={comment.id} />
              <input type="hidden" name="postSlug" value={postSlug} />
              <textarea
                name="content"
                defaultValue={comment.content}
                required
                rows={3}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <EditSubmitButton />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
              {editState.error && (
                <p className="text-sm text-red-600">{editState.error}</p>
              )}
            </form>
          ) : (
            <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">
              {comment.content}
            </p>
          )}

          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={handleLike}
              disabled={!currentUserId || isLiking}
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors hover:bg-accent",
                comment.likedByMe && "text-red-500",
                !currentUserId && "cursor-not-allowed opacity-50"
              )}
              aria-pressed={comment.likedByMe}
            >
              <Heart
                className={cn("h-3.5 w-3.5", comment.likedByMe && "fill-current")}
              />
              {comment.likeCount > 0 && comment.likeCount}
            </button>

            {canReply && (
              <button
                type="button"
                onClick={() => setIsReplying((v) => !v)}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Reply
              </button>
            )}
          </div>

          {isReplying && (
            <div className="mt-3">
              <CommentForm
                postSlug={postSlug}
                parentId={comment.id}
                currentUserId={currentUserId}
                author={currentUserAuthor}
                placeholder={`Reply to ${comment.author.username}...`}
                autoFocus
                onCancel={() => setIsReplying(false)}
                onSuccess={(content) => {
                  onOptimisticAdd?.(content, comment.id);
                  setIsReplying(false);
                }}
              />
            </div>
          )}

          {comment.replies.length > 0 && (
            <div className="mt-4 space-y-4 border-l-2 border-border pl-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  postSlug={postSlug}
                  currentUserId={currentUserId}
                  currentUserAuthor={currentUserAuthor}
                  depth={depth + 1}
                  onOptimisticAdd={onOptimisticAdd}
                  onOptimisticUpdate={onOptimisticUpdate}
                  onOptimisticDelete={onOptimisticDelete}
                  onOptimisticLike={onOptimisticLike}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
