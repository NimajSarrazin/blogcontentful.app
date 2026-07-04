import type { AuthUser } from "@/types/auth";
import { isAdminRole } from "@/lib/auth/roles";

export function isAdmin(user: AuthUser | null): boolean {
  return isAdminRole(user?.profile?.role);
}

export function getUserDisplayName(user: AuthUser | null): string {
  if (!user) return "Guest";
  return user.profile?.username ?? user.email.split("@")[0] ?? "User";
}

export function getUserAvatarUrl(user: AuthUser | null): string | null {
  return user?.profile?.avatarUrl ?? null;
}
