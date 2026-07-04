import type { SupabaseClient } from "@supabase/supabase-js";
import { getRoleFromClaims, isAdminRole, resolveUserRole } from "@/lib/auth/roles";
import type { UserRole } from "@/types/auth";

export async function getCurrentUserRole(
  supabase: SupabaseClient
): Promise<{ userId: string | null; role: UserRole | null }> {
  const { data } = await supabase.auth.getClaims();
  const userId = typeof data?.claims?.sub === "string" ? data.claims.sub : null;

  if (!userId) {
    return { userId: null, role: null };
  }

  const claimRole = getRoleFromClaims(data?.claims);
  if (claimRole === "admin") {
    return { userId, role: "admin" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  return {
    userId,
    role: resolveUserRole(profile?.role as UserRole | undefined, data?.claims),
  };
}

export async function requireAdminUserId(
  supabase: SupabaseClient
): Promise<string | null> {
  const { userId, role } = await getCurrentUserRole(supabase);
  if (!userId || !isAdminRole(role)) return null;
  return userId;
}
