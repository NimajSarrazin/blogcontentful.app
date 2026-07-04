import { createClient } from "@/lib/supabase/server";
import { resolveUserRole, isAdminRole } from "@/lib/auth/roles";
import type { AuthUser, UserProfile, UserRole } from "@/types/auth";

interface ProfileRow {
  id: string;
  username: string;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

function mapProfile(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    username: row.username,
    avatarUrl: row.avatar_url,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    return null;
  }

  const userId = data.claims.sub;
  const email = typeof data.claims.email === "string" ? data.claims.email : "";

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("id, username, avatar_url, role, created_at, updated_at")
    .eq("id", userId)
    .maybeSingle<ProfileRow>();

  const profile = profileRow ? mapProfile(profileRow) : null;
  const role = resolveUserRole(profile?.role, data.claims);

  return {
    id: userId,
    email,
    profile: profile
      ? {
          ...profile,
          role,
        }
      : null,
  };
}

export async function requireAuthUser(): Promise<AuthUser> {
  const user = await getAuthUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireAdminUser(): Promise<AuthUser> {
  const user = await requireAuthUser();
  if (!isAdminRole(user.profile?.role)) {
    throw new Error("Forbidden");
  }
  return user;
}
