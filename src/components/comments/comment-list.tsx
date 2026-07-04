"use client";

import { CommentEmpty } from "@/components/comments/comment-empty";
import { CommentItem } from "@/components/comments/comment-item";
import { CommentsSkeleton } from "@/components/comments/comment-skeleton";
import { Button } from "@/components/ui/button";
import type { Comment, CommentAuthor } from "@/types/comment";

interface CommentListProps {
  comments: Comment[];
  postSlug: string;
  currentUserId: string | null;
  currentUserAuthor?: CommentAuthor;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onOptimisticAdd?: (content: string, parentId: string) => void;
  onOptimisticUpdate?: (commentId: string, content: string) => void;
  onOptimisticDelete?: (commentId: string) => void;
  onOptimisticLike?: (commentId: string, liked: boolean) => void;
}

export function CommentList({
  comments,
  postSlug,
  currentUserId,
  currentUserAuthor,
  isLoading,
  hasMore,
  onLoadMore,
  onOptimisticAdd,
  onOptimisticUpdate,
  onOptimisticDelete,
  onOptimisticLike,
}: CommentListProps) {
  if (isLoading && comments.length === 0) {
    return <CommentsSkeleton />;
  }

  if (comments.length === 0) {
    return <CommentEmpty />;
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postSlug={postSlug}
          currentUserId={currentUserId}
          currentUserAuthor={currentUserAuthor}
          onOptimisticAdd={onOptimisticAdd}
          onOptimisticUpdate={onOptimisticUpdate}
          onOptimisticDelete={onOptimisticDelete}
          onOptimisticLike={onOptimisticLike}
        />
      ))}

      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onLoadMore}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Load more comments"}
          </Button>
        </div>
      )}
    </div>
  );
}
