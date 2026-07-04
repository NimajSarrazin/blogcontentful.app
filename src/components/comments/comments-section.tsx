"use client";

import { MessageSquare } from "lucide-react";
import { CommentForm } from "@/components/comments/comment-form";
import { CommentList } from "@/components/comments/comment-list";
import { CommentSortSelect } from "@/components/comments/comment-sort";
import { useComments } from "@/hooks/use-comments";
import type { AuthUser } from "@/types/auth";
import type { CommentsPage } from "@/types/comment";

interface CommentsSectionProps {
  postSlug: string;
  initialData: CommentsPage;
  currentUser: AuthUser | null;
}

export function CommentsSection({
  postSlug,
  initialData,
  currentUser,
}: CommentsSectionProps) {
  const currentUserId = currentUser?.id ?? null;
  const currentUserAuthor = currentUser?.profile
    ? {
        id: currentUser.id,
        username: currentUser.profile.username,
        avatarUrl: currentUser.profile.avatarUrl,
      }
    : undefined;

  const {
    comments,
    totalCount,
    hasMore,
    sort,
    isLoading,
    error,
    handleSortChange,
    handleLoadMore,
    optimisticAdd,
    optimisticUpdate,
    optimisticDelete,
    optimisticLike,
  } = useComments({
    postSlug,
    initialData,
    currentUserId,
  });

  const handleTopLevelAdd = (content: string) => {
    if (currentUserAuthor) {
      optimisticAdd(content, null, currentUserAuthor);
    }
  };

  const handleReplyAdd = (content: string, parentId: string) => {
    if (currentUserAuthor) {
      optimisticAdd(content, parentId, currentUserAuthor);
    }
  };

  return (
    <section
      id="comments"
      className="scroll-mt-28 border-t border-border pt-10"
      aria-labelledby="comments-heading"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2
          id="comments-heading"
          className="flex items-center gap-2 text-xl font-semibold tracking-tight"
        >
          <MessageSquare className="h-5 w-5" />
          Comments
          {totalCount > 0 && (
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-sm font-medium text-muted-foreground">
              {totalCount}
            </span>
          )}
        </h2>

        {totalCount > 0 && (
          <CommentSortSelect
            value={sort}
            onChange={handleSortChange}
            disabled={isLoading}
          />
        )}
      </div>

      <div className="mb-8">
        <CommentForm
          postSlug={postSlug}
          currentUserId={currentUserId}
          author={currentUserAuthor}
          onSuccess={handleTopLevelAdd}
        />
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      <CommentList
        comments={comments}
        postSlug={postSlug}
        currentUserId={currentUserId}
        currentUserAuthor={currentUserAuthor}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        onOptimisticAdd={handleReplyAdd}
        onOptimisticUpdate={optimisticUpdate}
        onOptimisticDelete={optimisticDelete}
        onOptimisticLike={optimisticLike}
      />
    </section>
  );
}
