import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminArticleCreate } from "@/components/admin/admin-article-create";
import { AdminArticleEditor } from "@/components/admin/admin-article-editor";
import { AdminArticlesTable } from "@/components/admin/admin-articles-table";
import { AdminCommentsTable } from "@/components/admin/admin-comments-table";
import { AdminUsersTable } from "@/components/admin/admin-users-table";
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/layout/hero";
import { requireAdminUser } from "@/services/auth/auth.service";
import { getAllArticles, getArticleById } from "@/services/articles/article.service";
import {
  getAllCommentsForAdmin,
  getAllUsersForAdmin,
} from "@/services/comments/comment.service";
import { enrichWithPostTitles } from "@/services/contentful/blog.service";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

interface AdminPageProps {
  searchParams: Promise<{
    tab?: string;
    edit?: string;
    new?: string;
    status?: string;
  }>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  let user;

  try {
    user = await requireAdminUser();
  } catch {
    redirect("/");
  }

  const params = await searchParams;
  const tab =
    params.tab === "articles" || params.tab === "users"
      ? params.tab
      : "comments";
  const editId = tab === "articles" ? params.edit ?? null : null;
  const showNewForm = tab === "articles" && params.new === "1";

  const [commentsData, articlesData, users, editingArticle] = await Promise.all([
    tab === "comments"
      ? getAllCommentsForAdmin({ page: 0, pageSize: 50 }).then(async (data) => ({
          ...data,
          comments: await enrichWithPostTitles(data.comments),
        }))
      : Promise.resolve({ comments: [], totalCount: 0 }),
    tab === "articles"
      ? getAllArticles({
          status: (params.status as "draft" | "pending" | "published" | "rejected" | "all") ?? "all",
          page: 0,
          pageSize: 50,
        })
      : Promise.resolve({ articles: [], totalCount: 0 }),
    tab === "users" ? getAllUsersForAdmin() : Promise.resolve([]),
    editId ? getArticleById(editId) : Promise.resolve(null),
  ]);

  const tabs = [
    { id: "comments", label: "Comments", href: "/admin?tab=comments" },
    { id: "articles", label: "Articles", href: "/admin?tab=articles" },
    { id: "users", label: "Users", href: "/admin?tab=users" },
  ];

  return (
    <>
      <PageHero
        title="Admin dashboard"
        description="Moderate comments, manage articles, and control user roles."
      />
      <Container className="py-12">
        <div className="mb-6 rounded-xl border border-border bg-card p-4 text-sm shadow-soft">
          Signed in as{" "}
          <span className="font-medium">{user.profile?.username}</span>
          <span className="ml-2 rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
            admin
          </span>
        </div>

        <DashboardTabs tabs={tabs} activeTab={tab} />

        <div className="mt-8">
          {tab === "comments" && (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                {commentsData.totalCount} comment{commentsData.totalCount !== 1 ? "s" : ""}
              </p>
              <AdminCommentsTable comments={commentsData.comments} />
            </>
          )}

          {tab === "articles" && (
            <>
              {showNewForm ? (
                <AdminArticleCreate />
              ) : editingArticle ? (
                <AdminArticleEditor article={editingArticle} />
              ) : (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {articlesData.totalCount} article{articlesData.totalCount !== 1 ? "s" : ""}
                    </p>
                    <Link
                      href="/admin?tab=articles&new=1"
                      className="inline-flex h-9 items-center justify-center rounded-md bg-brand px-3 text-sm font-medium text-brand-foreground transition-all hover:brightness-105"
                    >
                      New article
                    </Link>
                  </div>
                  <AdminArticlesTable articles={articlesData.articles} />
                </>
              )}
            </>
          )}

          {tab === "users" && (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                {users.length} user{users.length !== 1 ? "s" : ""}
              </p>
              <AdminUsersTable users={users} currentUserId={user.id} />
            </>
          )}
        </div>
      </Container>
    </>
  );
}
