import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";
import { UserArticlesList } from "@/components/dashboard/user-articles-list";
import { UserCommentsList } from "@/components/dashboard/user-comments-list";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/layout/hero";
import { getUserDisplayName } from "@/lib/auth/utils";
import { AUTH_ROUTES } from "@/lib/supabase/config";
import { requireAuthUser } from "@/services/auth/auth.service";
import { getArticlesForUser } from "@/services/articles/article.service";
import { getCommentsForUser } from "@/services/comments/comment.service";
import { enrichWithPostTitles } from "@/services/contentful/blog.service";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

interface DashboardPageProps {
  searchParams: Promise<{
    tab?: string;
    new?: string;
    edit?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  let user;

  try {
    user = await requireAuthUser();
  } catch {
    redirect(`${AUTH_ROUTES.login}?next=/dashboard`);
  }

  const params = await searchParams;
  const tab = params.tab === "articles" ? "articles" : "comments";
  const showNewForm = tab === "articles" && params.new === "1";
  const editId = tab === "articles" ? params.edit ?? null : null;

  const [comments, articles] = await Promise.all([
    tab === "comments"
      ? getCommentsForUser(user.id).then(enrichWithPostTitles)
      : Promise.resolve([]),
    tab === "articles" ? getArticlesForUser(user.id) : Promise.resolve([]),
  ]);

  const displayName = getUserDisplayName(user);

  const tabs = [
    { id: "comments", label: "My comments", href: "/dashboard?tab=comments" },
    { id: "articles", label: "My articles", href: "/dashboard?tab=articles" },
  ];

  return (
    <>
      <PageHero
        title="Dashboard"
        description={`Welcome back, ${displayName}. Manage your comments and articles.`}
      />
      <Container className="py-12">
        <DashboardTabs tabs={tabs} activeTab={tab} />

        <div className="mt-8">
          {tab === "comments" && <UserCommentsList comments={comments} />}

          {tab === "articles" && (
            <UserArticlesList
              articles={articles}
              showNewForm={showNewForm}
              editId={editId}
            />
          )}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Need to update your profile?{" "}
          <Link href={AUTH_ROUTES.profile} className="text-brand hover:underline">
            Go to profile
          </Link>
        </p>
      </Container>
    </>
  );
}
