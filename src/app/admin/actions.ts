"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUserId } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";
import type { AdminActionState } from "@/types/article";
import type { ArticleStatus } from "@/types/article";

async function requireAdminId(): Promise<string | { error: string }> {
  const supabase = await createClient();
  const userId = await requireAdminUserId(supabase);

  if (!userId) return { error: "Unauthorized." };

  return userId;
}

function revalidateAdmin() {
  revalidatePath("/admin");
  revalidatePath("/dashboard");
}

export async function adminDeleteComment(
  commentId: string,
  postSlug: string
): Promise<AdminActionState> {
  const adminCheck = await requireAdminId();
  if (typeof adminCheck !== "string") return adminCheck;

  const supabase = await createClient();
  const { error } = await supabase
    .from("comments")
    .update({ is_deleted: true, content: "" })
    .eq("id", commentId);

  if (error) return { error: error.message };

  revalidatePath(`/post/${postSlug}`);
  revalidateAdmin();
  return { success: "Comment deleted." };
}

export async function adminHardDeleteComment(
  commentId: string,
  postSlug: string
): Promise<AdminActionState> {
  const adminCheck = await requireAdminId();
  if (typeof adminCheck !== "string") return adminCheck;

  const supabase = await createClient();
  const { error } = await supabase.from("comments").delete().eq("id", commentId);

  if (error) return { error: error.message };

  revalidatePath(`/post/${postSlug}`);
  revalidateAdmin();
  return { success: "Comment permanently deleted." };
}

export async function adminSetUserRole(
  targetUserId: string,
  role: "user" | "admin"
): Promise<AdminActionState> {
  const adminCheck = await requireAdminId();
  if (typeof adminCheck !== "string") return adminCheck;

  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_set_user_role", {
    target_user_id: targetUserId,
    new_role: role,
  });

  if (error) return { error: error.message };

  revalidateAdmin();
  return { success: `User role updated to ${role}.` };
}

export async function adminUpdateArticleStatus(
  articleId: string,
  status: ArticleStatus
): Promise<AdminActionState> {
  const adminCheck = await requireAdminId();
  if (typeof adminCheck !== "string") return adminCheck;

  const supabase = await createClient();
  const { error } = await supabase
    .from("articles")
    .update({ status })
    .eq("id", articleId);

  if (error) return { error: error.message };

  revalidateAdmin();
  return { success: `Article status updated to ${status}.` };
}

export async function adminDeleteArticle(articleId: string): Promise<AdminActionState> {
  const adminCheck = await requireAdminId();
  if (typeof adminCheck !== "string") return adminCheck;

  const supabase = await createClient();
  const { error } = await supabase.from("articles").delete().eq("id", articleId);

  if (error) return { error: error.message };

  revalidateAdmin();
  return { success: "Article deleted." };
}
