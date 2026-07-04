"use server";

import { createClient } from "@/lib/supabase/server";

export interface NewsletterActionState {
  error?: string;
  success?: string;
}

export async function subscribeNewsletter(
  _prevState: NewsletterActionState,
  formData: FormData
): Promise<NewsletterActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email) {
    return { error: "Email is required." };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("newsletter_subscribers").insert({
    email,
    status: "active",
  });

  if (error) {
    if (error.code === "23505") {
      return { success: "You're already subscribed. Thank you!" };
    }
    return { error: "Unable to subscribe right now. Please try again later." };
  }

  return { success: "Thanks for subscribing! Check your inbox soon." };
}
