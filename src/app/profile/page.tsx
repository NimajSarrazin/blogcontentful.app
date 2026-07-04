import type { Metadata } from "next";
import { ProfileForm } from "@/components/auth/profile-form";
import { UserAvatarImage } from "@/components/ui/user-avatar";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/layout/hero";
import { getUserAvatarUrl, getUserDisplayName } from "@/lib/auth/utils";
import { redirect } from "next/navigation";
import { requireAuthUser } from "@/services/auth/auth.service";
import { AUTH_ROUTES } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Profile",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  let user;

  try {
    user = await requireAuthUser();
  } catch {
    redirect(`${AUTH_ROUTES.login}?next=${AUTH_ROUTES.profile}`);
  }
  const displayName = getUserDisplayName(user);
  const avatarUrl = getUserAvatarUrl(user);

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
        hypothesisId: "A",
        location: "profile/page.tsx:avatar",
        message: "Profile avatar URL hostname",
        data: { hostname, hasAvatar: true },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  }
  // #endregion

  return (
    <>
      <PageHero
        title="Your profile"
        description="Manage your public identity on Readit."
      />
      <Container className="py-16">
        <div className="mx-auto grid max-w-3xl gap-8">
          <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-6 shadow-soft">
            {avatarUrl ? (
              <UserAvatarImage
                src={avatarUrl}
                alt={displayName}
                size={72}
              />
            ) : (
              <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-muted text-2xl font-semibold">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold">{displayName}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <ProfileForm user={user} />
        </div>
      </Container>
    </>
  );
}
