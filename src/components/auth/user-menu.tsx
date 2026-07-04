"use client";

import Link from "next/link";
import { UserAvatarImage } from "@/components/ui/user-avatar";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LayoutDashboard, LogOut, Shield, User } from "lucide-react";
import { signOut } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/client";
import { AUTH_ROUTES } from "@/lib/supabase/config";
import { resolveUserRole } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/types/auth";
import {
  getUserAvatarUrl,
  getUserDisplayName,
  isAdmin,
} from "@/lib/auth/utils";

interface UserMenuProps {
  initialUser: AuthUser | null;
}

export function UserMenu({ initialUser }: UserMenuProps) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();

    const syncUser = async () => {
      const { data } = await supabase.auth.getClaims();
      const userId = data?.claims?.sub;

      if (!userId) {
        setUser(null);
        return;
      }

      const email =
        typeof data?.claims?.email === "string" ? data.claims.email : "";

      const { data: profile } = await supabase
        .from("profiles")
        .select("id, username, avatar_url, role, created_at, updated_at")
        .eq("id", userId)
        .maybeSingle();

      const role = resolveUserRole(profile?.role, data?.claims);

      setUser({
        id: userId,
        email,
        profile: profile
          ? {
              id: profile.id,
              username: profile.username,
              avatarUrl: profile.avatar_url,
              role,
              createdAt: profile.created_at,
              updatedAt: profile.updated_at,
            }
          : null,
      });
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void syncUser();
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href={AUTH_ROUTES.login}
          className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Sign in
        </Link>
        <Link
          href={AUTH_ROUTES.signup}
          className="inline-flex h-9 items-center justify-center rounded-md bg-brand px-3 text-sm font-medium text-brand-foreground transition-all hover:brightness-105"
        >
          Sign up
        </Link>
      </div>
    );
  }

  const displayName = getUserDisplayName(user);
  const avatarUrl = getUserAvatarUrl(user);
  const admin = isAdmin(user);

  // #region agent log
  if (avatarUrl) {
    let hostname = "invalid";
    try {
      hostname = new URL(avatarUrl).hostname;
    } catch {
      /* keep invalid */
    }
    fetch("http://127.0.0.1:7263/ingest/4e4403bf-211c-4df0-815b-6ab32322b273", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "ecc2bf" },
      body: JSON.stringify({
        sessionId: "ecc2bf",
        runId: "post-fix",
        hypothesisId: "B",
        location: "user-menu.tsx:avatar",
        message: "UserMenu avatar URL hostname",
        data: { hostname, hasAvatar: true },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  }
  // #endregion

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3 text-sm font-medium transition-colors hover:bg-accent"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        {avatarUrl ? (
          <UserAvatarImage
            src={avatarUrl}
            alt={displayName}
            size={32}
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            <User className="h-4 w-4" />
          </span>
        )}
        <span className="max-w-[120px] truncate">{displayName}</span>
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-card shadow-elevated"
        >
          <div className="border-b border-border px-4 py-3">
            <p className="truncate text-sm font-medium">{displayName}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            <p className="mt-1 text-xs capitalize text-brand">
              {user.profile?.role ?? "user"}
            </p>
          </div>

          <div className="p-1">
            <Link
              href={AUTH_ROUTES.dashboard}
              role="menuitem"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
              onClick={() => setOpen(false)}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>

            <Link
              href={AUTH_ROUTES.profile}
              role="menuitem"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
              onClick={() => setOpen(false)}
            >
              <User className="h-4 w-4" />
              Profile
            </Link>

            {admin && (
              <Link
                href={AUTH_ROUTES.admin}
                role="menuitem"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
                onClick={() => setOpen(false)}
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}

            <form action={signOut}>
              <button
                type="submit"
                role="menuitem"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-accent dark:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
