import type { UserRole } from "@/types/auth";

type JwtClaims = Record<string, unknown> | null | undefined;

function readRole(value: unknown): UserRole | null {
  return value === "admin" || value === "user" ? value : null;
}

export function getRoleFromClaims(claims: JwtClaims): UserRole | null {
  const directRole = readRole(claims?.role);
  if (directRole === "admin") return "admin";

  const appMetadata = claims?.app_metadata;
  if (appMetadata && typeof appMetadata === "object") {
    const metadataRole = readRole(
      (appMetadata as Record<string, unknown>).role
    );
    if (metadataRole) return metadataRole;
  }

  return directRole;
}

export function resolveUserRole(
  profileRole: UserRole | null | undefined,
  claims: JwtClaims
): UserRole {
  const claimRole = getRoleFromClaims(claims);

  if (profileRole === "admin" || claimRole === "admin") {
    return "admin";
  }

  return profileRole ?? claimRole ?? "user";
}

export function isAdminRole(role: UserRole | null | undefined): boolean {
  return role === "admin";
}
