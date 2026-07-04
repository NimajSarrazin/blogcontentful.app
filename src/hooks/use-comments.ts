"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { loadMoreComments } from "@/app/comments/actions";
import type { Comment, CommentSort, CommentsPage } from "@/types/comment";

interface UseCommentsOptions {
  postSlug: string;
  initialData: CommentsPage;
  initialSort?: CommentSort;
  currentUserId: string | null;
}

function mergeCommentTrees(existing: Comment[], incoming: Comment[]): Comment[] {
  const map = new Map<string, Comment>();

  const addToMap = (comments: Comment[]) => {
    for (const comment of comments) {
      map.set(comment.id, { ...comment, replies: [...comment.replies] });
      addToMap(comment.replies);
    }
  };

  addToMap(existing);
  addToMap(incoming);

  const roots: Comment[] = [];

  for (const comment of map.values()) {
    if (comment.parentId && map.has(comment.parentId)) {
      const parent = map.get(comment.parentId)!;
      if (!parent.replies.some((r) => r.id === comment.id)) {
        parent.replies.push(comment);
        parent.replyCount = parent.replies.length;
      }
    } else if (!comment.parentId) {
      roots.push(comment);
    }
  }

  return roots;
}

function sortComments(comments: Comment[], sort: CommentSort): Comment[] {
  const sorted = [...comments];

  switch (sort) {
    case "oldest":
      sorted.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      break;
    case "popular":
      sorted.sort((a, b) => b.likeCount - a.likeCount || b.replyCount - a.replyCount);
      break;
    case "newest":
    default:
      sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  return sorted;
}

function updateCommentInTree(
  comments: Comment[],
  commentId: string,
  updater: (comment: Comment) => Comment
): Comment[] {
  return comments.map((comment) => {
    if (comment.id === commentId) {
      return updater(comment);
    }
    if (comment.replies.length > 0) {
      return {
        ...comment,
        replies: updateCommentInTree(comment.replies, commentId, updater),
      };
    }
    return comment;
  });
}

function removeCommentFromTree(comments: Comment[], commentId: string): Comment[] {
  return comments
    .filter((c) => c.id !== commentId)
    .map((c) => ({
      ...c,
      replies: removeCommentFromTree(c.replies, commentId),
      replyCount: c.replies.filter((r) => r.id !== commentId).length,
    }));
}

export function useComments({
  postSlug,
  initialData,
  initialSort = "newest",
  currentUserId,
}: UseCommentsOptions) {
  const [comments, setComments] = useState<Comment[]>(initialData.comments);
  const [totalCount, setTotalCount] = useState(initialData.totalCount);
  const [hasMore, setHasMore] = useState(initialData.hasMore);
  const [sort, setSort] = useState<CommentSort>(initialSort);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const refreshRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refreshComments = useCallback(async () => {
    try {
      const data = await loadMoreComments(postSlug, 0, sort);
      setComments(data.comments);
      setTotalCount(data.totalCount);
      setHasMore(data.hasMore);
      setPage(0);
    } catch {
      setError("Failed to refresh comments.");
    }
  }, [postSlug, sort]);

  const scheduleRefresh = useCallback(() => {
    if (refreshRef.current) clearTimeout(refreshRef.current);
    refreshRef.current = setTimeout(() => {
      void refreshComments();
    }, 500);
  }, [refreshComments]);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`comments:${postSlug}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `post_slug=eq.${postSlug}`,
        },
        () => scheduleRefresh()
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comment_likes",
        },
        () => scheduleRefresh()
      )
      .subscribe();

    return () => {
      if (refreshRef.current) clearTimeout(refreshRef.current);
      void supabase.removeChannel(channel);
    };
  }, [postSlug, scheduleRefresh]);

  const handleSortChange = (newSort: CommentSort) => {
    setSort(newSort);
    setIsLoading(true);
    setError(null);

    startTransition(async () => {
      try {
        const data = await loadMoreComments(postSlug, 0, newSort);
        setComments(data.comments);
        setTotalCount(data.totalCount);
        setHasMore(data.hasMore);
        setPage(0);
      } catch {
        setError("Failed to sort comments.");
      } finally {
        setIsLoading(false);
      }
    });
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setIsLoading(true);
    setError(null);

    startTransition(async () => {
      try {
        const data = await loadMoreComments(postSlug, nextPage, sort);
        setComments((prev) => {
          const merged = mergeCommentTrees(prev, data.comments);
          return sortComments(merged, sort).slice(0, (nextPage + 1) * 10);
        });
        setHasMore(data.hasMore);
        setPage(nextPage);
      } catch {
        setError("Failed to load more comments.");
      } finally {
        setIsLoading(false);
      }
    });
  };

  const optimisticAdd = useCallback(
    (content: string, parentId: string | null, author: Comment["author"]) => {
      const tempId = `temp-${Date.now()}`;
      const optimistic: Comment = {
        id: tempId,
        postSlug,
        userId: currentUserId ?? "",
        parentId,
        content,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author,
        likeCount: 0,
        likedByMe: false,
        replyCount: 0,
        replies: [],
      };

      if (parentId) {
        setComments((prev) =>
          updateCommentInTree(prev, parentId, (parent) => ({
            ...parent,
            replies: [...parent.replies, optimistic],
            replyCount: parent.replyCount + 1,
          }))
        );
      } else {
        setComments((prev) => sortComments([optimistic, ...prev], sort));
        setTotalCount((c) => c + 1);
      }

      return tempId;
    },
    [postSlug, currentUserId, sort]
  );

  const optimisticUpdate = useCallback((commentId: string, content: string) => {
    setComments((prev) =>
      updateCommentInTree(prev, commentId, (c) => ({
        ...c,
        content,
        updatedAt: new Date().toISOString(),
      }))
    );
  }, []);

  const optimisticDelete = useCallback((commentId: string) => {
    setComments((prev) =>
      updateCommentInTree(prev, commentId, (c) => ({
        ...c,
        isDeleted: true,
        content: "",
      }))
    );
  }, []);

  const optimisticLike = useCallback((commentId: string, liked: boolean) => {
    setComments((prev) =>
      updateCommentInTree(prev, commentId, (c) => ({
        ...c,
        likedByMe: liked,
        likeCount: liked ? c.likeCount + 1 : Math.max(0, c.likeCount - 1),
      }))
    );
  }, []);

  const revertOptimistic = useCallback(
    (tempId: string) => {
      setComments((prev) => removeCommentFromTree(prev, tempId));
      if (!tempId.includes("temp")) return;
      setTotalCount((c) => Math.max(0, c - 1));
    },
    []
  );

  return {
    comments,
    totalCount,
    hasMore,
    sort,
    isLoading: isLoading || isPending,
    error,
    handleSortChange,
    handleLoadMore,
    optimisticAdd,
    optimisticUpdate,
    optimisticDelete,
    optimisticLike,
    revertOptimistic,
    refreshComments,
  };
}
