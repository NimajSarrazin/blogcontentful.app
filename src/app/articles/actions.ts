"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserRole } from "@/lib/auth/server";
import { isAdminRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/articles/utils";
import {
  MAX_ARTICLE_CONTENT_LENGTH,
  MAX_ARTICLE_EXCERPT_LENGTH,
  MAX_ARTICLE_TITLE_LENGTH,
} from "@/lib/constants";
import { isSlugTaken } from "@/services/articles/article.service";
import type { ArticleActionState, ArticleStatus } from "@/types/article";

async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return data?.claims?.sub ?? null;
}

function validateArticleFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim() || slugify(title);
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (title.length < 3) return { error: "Title must be at least 3 characters." };
  if (title.length > MAX_ARTICLE_TITLE_LENGTH) {
    return { error: `Title must be ${MAX_ARTICLE_TITLE_LENGTH} characters or less.` };
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { error: "Slug must be lowercase letters, numbers, and hyphens only." };
  }
  if (excerpt.length > MAX_ARTICLE_EXCERPT_LENGTH) {
    return {
      error: `Excerpt must be ${MAX_ARTICLE_EXCERPT_LENGTH} characters or less.`,
    };
  }
  if (content.length < 10) {
    return { error: "Content must be at least 10 characters." };
  }
  if (content.length > MAX_ARTICLE_CONTENT_LENGTH) {
    return {
      error: `Content must be ${MAX_ARTICLE_CONTENT_LENGTH} characters or less.`,
    };
  }

  return { title, slug, excerpt: excerpt || null, content };
}

function revalidateDashboard() {
  revalidatePath("/dashboard");
  revalidatePath("/admin");
}

export async function createArticle(
  _prevState: ArticleActionState,
  formData: FormData
): Promise<ArticleActionState> {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "You must be signed in." };

  const validated = validateArticleFields(formData);
  if ("error" in validated) return { error: validated.error };

  const { title, slug, excerpt, content } = validated;
  const submitAction = String(formData.get("submitAction") ?? "draft");
  const status: ArticleStatus = submitAction === "submit" ? "pending" : "draft";

  if (await isSlugTaken(slug)) {
    return { error: "This slug is already taken. Choose a different one." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .insert({
      user_id: userId,
      title,
      slug,
      excerpt,
      content,
      status,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidateDashboard();
  return {
    success: status === "pending" ? "Article submitted for review." : "Draft saved.",
    articleId: data.id,
  };
}

export async function updateArticle(
  _prevState: ArticleActionState,
  formData: FormData
): Promise<ArticleActionState> {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "You must be signed in." };

  const articleId = String(formData.get("articleId") ?? "").trim();
  if (!articleId) return { error: "Invalid article." };

  const validated = validateArticleFields(formData);
  if ("error" in validated) return { error: validated.error };

  const { title, slug, excerpt, content } = validated;
  const submitAction = String(formData.get("submitAction") ?? "draft");

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("articles")
    .select("user_id, status")
    .eq("id", articleId)
    .maybeSingle();

  if (!existing) return { error: "Article not found." };

  const { role } = await getCurrentUserRole(supabase);
  const isAdmin = isAdminRole(role);
  const isOwner = existing.user_id === userId;

  if (!isOwner && !isAdmin) return { error: "Unauthorized." };

  if (
    !isAdmin &&
    !["draft", "pending", "rejected"].includes(existing.status)
  ) {
    return { error: "Published articles cannot be edited." };
  }

  if (await isSlugTaken(slug, articleId)) {
    return { error: "This slug is already taken." };
  }

  let status = existing.status as ArticleStatus;
  if (submitAction === "submit" && !isAdmin) {
    status = "pending";
  } else if (submitAction === "draft" && !isAdmin && existing.status !== "published") {
    status = "draft";
  }

  const updatePayload: Record<string, unknown> = {
    title,
    slug,
    excerpt,
    content,
  };

  if (!isAdmin || submitAction !== "keep-status") {
    updatePayload.status = status;
  }

  if (isAdmin && formData.get("status")) {
    updatePayload.status = String(formData.get("status"));
  }

  const { error } = await supabase
    .from("articles")
    .update(updatePayload)
    .eq("id", articleId);

  if (error) return { error: error.message };

  revalidateDashboard();
  return { success: "Article updated.", articleId };
}

export async function deleteArticle(articleId: string): Promise<ArticleActionState> {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "You must be signed in." };

  const supabase = await createClient();

  const { role } = await getCurrentUserRole(supabase);
  const isAdmin = isAdminRole(role);

  let query = supabase.from("articles").delete().eq("id", articleId);

  if (!isAdmin) {
    query = query.eq("user_id", userId).in("status", ["draft", "rejected"]);
  }

  const { error } = await query;

  if (error) return { error: error.message };

  revalidateDashboard();
  return { success: "Article deleted." };
}

export async function updateArticleStatus(
  articleId: string,
  status: ArticleStatus
): Promise<ArticleActionState> {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "You must be signed in." };

  const supabase = await createClient();

  const { role } = await getCurrentUserRole(supabase);
  if (!isAdminRole(role)) return { error: "Unauthorized." };

  const { error } = await supabase
    .from("articles")
    .update({ status })
    .eq("id", articleId);

  if (error) return { error: error.message };

  revalidateDashboard();
  return { success: `Article marked as ${status}.` };
}
