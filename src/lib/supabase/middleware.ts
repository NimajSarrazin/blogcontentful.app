import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_ROUTES,
  AUTH_ROUTES,
  GUEST_ONLY_ROUTES,
  PROTECTED_ROUTES,
} from "@/lib/supabase/routes";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { getRoleFromClaims, resolveUserRole } from "@/lib/auth/roles";
import type { UserRole } from "@/types/auth";

function matchesRoute(pathname: string, routes: readonly string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const { url, publishableKey } = getSupabaseConfig();

  const supabase = createServerClient(
    url,
    publishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          supabaseResponse = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data } = await supabase.auth.getClaims();
  const isAuthenticated = Boolean(data?.claims?.sub);
  const { pathname } = request.nextUrl;

  if (!isAuthenticated && matchesRoute(pathname, PROTECTED_ROUTES)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = AUTH_ROUTES.login;
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthenticated && matchesRoute(pathname, GUEST_ONLY_ROUTES)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    redirectUrl.searchParams.delete("next");
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthenticated && matchesRoute(pathname, ADMIN_ROUTES)) {
    const userId = data?.claims?.sub;
    if (!userId) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = AUTH_ROUTES.login;
      return NextResponse.redirect(redirectUrl);
    }

    const claimRole = getRoleFromClaims(data?.claims);
    let role: UserRole = claimRole ?? "user";

    if (claimRole !== "admin") {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle();

      role = resolveUserRole(profile?.role as UserRole | undefined, data?.claims);
    }

    if (role !== "admin") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/";
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
}
