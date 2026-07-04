"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AUTH_ROUTES } from "@/lib/supabase/config";
import type { AuthActionState } from "@/types/auth";

function getFormValue(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function signInWithEmail(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = getFormValue(formData, "email");
  const password = getFormValue(formData, "password");
  const next = getFormValue(formData, "next") || "/";

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect(next.startsWith("/") ? next : "/");
}

export async function signUpWithEmail(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = getFormValue(formData, "email");
  const password = getFormValue(formData, "password");
  const username = getFormValue(formData, "username");

  if (!email || !password || !username) {
    return { error: "All fields are required." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success:
      "Account created. Check your email to confirm your address, then sign in.",
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function updateProfile(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const username = getFormValue(formData, "username");
  const avatarUrl = getFormValue(formData, "avatar_url");

  if (!username || username.length < 2) {
    return { error: "Username must be at least 2 characters." };
  }

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (!userId) {
    return { error: "You must be signed in to update your profile." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      username,
      avatar_url: avatarUrl || null,
    })
    .eq("id", userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(AUTH_ROUTES.profile);
  revalidatePath("/", "layout");
  return { success: "Profile updated successfully." };
}
