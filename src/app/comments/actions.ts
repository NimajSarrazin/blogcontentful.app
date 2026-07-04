"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserRole } from "@/lib/auth/server";
import { isAdminRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { MAX_COMMENT_LENGTH, MAX_NESTING_DEPTH } from "@/lib/constants";
import { getCommentsForPost } from "@/services/comments/comment.service";
import type { CommentActionState, CommentSort } from "@/types/comment";

function validateContent(content: string): string | null {
  const trimmed = content.trim();
  if (!trimmed) return "Comment cannot be empty.";
  if (trimmed.length > MAX_COMMENT_LENGTH) {
    return `Comment must be ${MAX_COMMENT_LENGTH} characters or less.`;
  }
  return null;
}

async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return data?.claims?.sub ?? null;
}

async function getNestingDepth(parentId: string): Promise<number> {
  const supabase = await createClient();
  let depth = 1;
  let nextId: string | null = parentId;

  for (let i = 0; i < MAX_NESTING_DEPTH && nextId; i++) {
    const lookupId = nextId;
    const { data } = await supabase
      .from("comments")
      .select("parent_id")
      .eq("id", lookupId)
      .maybeSingle();

    const row = data as { parent_id: string | null } | null;
    if (!row?.parent_id) break;
    nextId = row.parent_id;
    depth += 1;
  }

  return depth;
}

export async function createComment(
  _prevState: CommentActionState,
  formData: FormData
): Promise<CommentActionState> {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "You must be signed in to comment." };

  const postSlug = String(formData.get("postSlug") ?? "").trim();
  const content = String(formData.get("content") ?? "");
  const parentId = String(formData.get("parentId") ?? "").trim() || null;

  if (!postSlug) return { error: "Invalid post." };

  const contentError = validateContent(content);
  if (contentError) return { error: contentError };

  if (parentId) {
    const depth = await getNestingDepth(parentId);
    if (depth >= MAX_NESTING_DEPTH) {
      return { error: `Replies are limited to ${MAX_NESTING_DEPTH} levels deep.` };
    }
  }

  const supabase = await createClient();
  const { error } = await supabase.from("comments").insert({
    post_slug: postSlug,
    user_id: userId,
    parent_id: parentId,
    content: content.trim(),
  });

  if (error) return { error: error.message };

  revalidatePath(`/post/${postSlug}`);
  return { success: "Comment posted." };
}

export async function updateComment(
  _prevState: CommentActionState,
  formData: FormData
): Promise<CommentActionState> {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "You must be signed in." };

  const commentId = String(formData.get("commentId") ?? "").trim();
  const content = String(formData.get("content") ?? "");
  const postSlug = String(formData.get("postSlug") ?? "").trim();

  if (!commentId) return { error: "Invalid comment." };

  const contentError = validateContent(content);
  if (contentError) return { error: contentError };

  const supabase = await createClient();
  const { error } = await supabase
    .from("comments")
    .update({ content: content.trim() })
    .eq("id", commentId)
    .eq("user_id", userId);

  if (error) return { error: error.message };

  if (postSlug) revalidatePath(`/post/${postSlug}`);
  revalidatePath("/dashboard");
  return { success: "Comment updated." };
}

export async function deleteComment(
  commentId: string,
  postSlug: string
): Promise<CommentActionState> {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "You must be signed in." };

  const supabase = await createClient();

  const { role } = await getCurrentUserRole(supabase);
  const isAdmin = isAdminRole(role);

  if (isAdmin) {
    const { error } = await supabase
      .from("comments")
      .update({ is_deleted: true, content: "" })
      .eq("id", commentId);

    if (error) return { error: error.message };
  } else {
    const { error } = await supabase
      .from("comments")
      .update({ is_deleted: true, content: "" })
      .eq("id", commentId)
      .eq("user_id", userId);

    if (error) return { error: error.message };
  }

  revalidatePath(`/post/${postSlug}`);
  revalidatePath("/dashboard");
  revalidatePath("/admin");
  return { success: "Comment deleted." };
}

export async function toggleCommentLike(
  commentId: string,
  postSlug: string
): Promise<{ liked: boolean; error?: string }> {
  const userId = await getCurrentUserId();
  if (!userId) return { liked: false, error: "You must be signed in to like comments." };

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("comment_likes")
    .select("id")
    .eq("comment_id", commentId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("comment_likes")
      .delete()
      .eq("comment_id", commentId)
      .eq("user_id", userId);

    if (error) return { liked: true, error: error.message };
    revalidatePath(`/post/${postSlug}`);
    return { liked: false };
  }

  const { error } = await supabase.from("comment_likes").insert({
    comment_id: commentId,
    user_id: userId,
  });

  if (error) return { liked: false, error: error.message };
  revalidatePath(`/post/${postSlug}`);
  return { liked: true };
}

export async function reportComment(
  commentId: string,
  postSlug: string,
  reason?: string
): Promise<CommentActionState> {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "You must be signed in to report comments." };

  const supabase = await createClient();

  const { error } = await supabase.from("comment_reports").insert({
    comment_id: commentId,
    user_id: userId,
    reason: reason?.trim() || null,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "You have already reported this comment." };
    }
    return { error: error.message };
  }

  revalidatePath(`/post/${postSlug}`);
  return { success: "Comment reported. Thank you." };
}

export async function loadMoreComments(
  postSlug: string,
  page: number,
  sort: CommentSort
) {
  return getCommentsForPost(postSlug, { sort, page });
}
