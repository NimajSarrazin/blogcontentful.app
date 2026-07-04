import type { SupabaseClient } from "@supabase/supabase-js";

export type ProfileSummary = {
  id: string;
  username: string;
  avatar_url: string | null;
};

export async function fetchProfilesByIds(
  supabase: SupabaseClient,
  userIds: string[]
): Promise<Map<string, ProfileSummary>> {
  const uniqueIds = [...new Set(userIds.filter(Boolean))];
  if (uniqueIds.length === 0) return new Map();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, avatar_url")
    .in("id", uniqueIds);

  if (error) {
    console.error("Failed to fetch profiles:", error.message);
    return new Map();
  }

  return new Map((data ?? []).map((profile) => [profile.id, profile]));
}

export function attachProfiles<T extends { user_id: string }>(
  rows: T[],
  profiles: Map<string, ProfileSummary>
): (T & { profiles: ProfileSummary | null })[] {
  return rows.map((row) => ({
    ...row,
    profiles: profiles.get(row.user_id) ?? null,
  }));
}
