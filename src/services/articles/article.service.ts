import { createClient } from "@/lib/supabase/server";
import { attachProfiles, fetchProfilesByIds } from "@/lib/supabase/profiles";
import { ARTICLES_PAGE_SIZE } from "@/lib/constants";
import type { Article, ArticleStatus } from "@/types/article";

interface ArticleRow {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: ArticleStatus;
  created_at: string;
  updated_at: string;
  profiles: {
    id: string;
    username: string;
    avatar_url: string | null;
  } | null;
}

function mapArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    author: {
      id: row.profiles?.id ?? row.user_id,
      username: row.profiles?.username ?? "Unknown",
      avatarUrl: row.profiles?.avatar_url ?? null,
    },
  };
}

const ARTICLE_SELECT = `
  id,
  user_id,
  title,
  slug,
  excerpt,
  content,
  status,
  created_at,
  updated_at
`;

async function withAuthorProfiles(
  supabase: Awaited<ReturnType<typeof createClient>>,
  rows: Omit<ArticleRow, "profiles">[]
): Promise<ArticleRow[]> {
  const profiles = await fetchProfilesByIds(
    supabase,
    rows.map((row) => row.user_id)
  );

  return attachProfiles(rows, profiles) as ArticleRow[];
}

export async function getArticlesForUser(userId: string): Promise<Article[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch user articles:", error.message);
    return [];
  }

  const rows = await withAuthorProfiles(
    supabase,
    (data ?? []) as Omit<ArticleRow, "profiles">[]
  );

  return rows.map(mapArticle);
}

export async function getArticleById(articleId: string): Promise<Article | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("id", articleId)
    .maybeSingle();

  if (error || !data) return null;

  const [row] = await withAuthorProfiles(supabase, [
    data as Omit<ArticleRow, "profiles">,
  ]);

  return mapArticle(row);
}

export async function getAllArticles(options: {
  status?: ArticleStatus | "all";
  page?: number;
  pageSize?: number;
} = {}): Promise<{ articles: Article[]; totalCount: number }> {
  const { status = "all", page = 0, pageSize = ARTICLES_PAGE_SIZE } = options;
  const supabase = await createClient();

  let query = supabase
    .from("articles")
    .select(ARTICLE_SELECT, { count: "exact" })
    .order("updated_at", { ascending: false });

  if (status !== "all") {
    query = query.eq("status", status);
  }

  const from = page * pageSize;
  const { data, error, count } = await query.range(from, from + pageSize - 1);

  if (error) {
    console.error("Failed to fetch articles:", error.message);
    return { articles: [], totalCount: 0 };
  }

  const rows = await withAuthorProfiles(
    supabase,
    (data ?? []) as Omit<ArticleRow, "profiles">[]
  );

  return {
    articles: rows.map(mapArticle),
    totalCount: count ?? 0,
  };
}

export async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const supabase = await createClient();

  let query = supabase.from("articles").select("id").eq("slug", slug);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data } = await query.maybeSingle();
  return Boolean(data);
}
