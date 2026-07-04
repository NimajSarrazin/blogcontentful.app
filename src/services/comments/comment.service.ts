import { createClient } from "@/lib/supabase/server";
import { attachProfiles, fetchProfilesByIds } from "@/lib/supabase/profiles";
import { COMMENTS_PAGE_SIZE } from "@/lib/constants";
import type { Comment, CommentSort, CommentsPage } from "@/types/comment";

interface CommentRow {
  id: string;
  post_slug: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  profiles: {
    id: string;
    username: string;
    avatar_url: string | null;
  } | null;
}

interface LikeRow {
  comment_id: string;
  user_id: string;
}

type ProfileJoin = {
  id: string;
  username: string;
  avatar_url: string | null;
};

function resolveProfile(
  profiles: ProfileJoin | ProfileJoin[] | null | undefined
): ProfileJoin | null {
  if (!profiles) return null;
  return Array.isArray(profiles) ? profiles[0] ?? null : profiles;
}

function buildCommentTree(
  rows: CommentRow[],
  likes: LikeRow[],
  currentUserId: string | null
): Comment[] {
  const likeMap = new Map<string, { count: number; likedByMe: boolean }>();

  for (const like of likes) {
    const existing = likeMap.get(like.comment_id) ?? { count: 0, likedByMe: false };
    existing.count += 1;
    if (currentUserId && like.user_id === currentUserId) {
      existing.likedByMe = true;
    }
    likeMap.set(like.comment_id, existing);
  }

  const commentMap = new Map<string, Comment>();

  for (const row of rows) {
    const likesInfo = likeMap.get(row.id) ?? { count: 0, likedByMe: false };

    commentMap.set(row.id, {
      id: row.id,
      postSlug: row.post_slug,
      userId: row.user_id,
      parentId: row.parent_id,
      content: row.is_deleted ? "" : row.content,
      isDeleted: row.is_deleted,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      author: {
        id: row.profiles?.id ?? row.user_id,
        username: row.profiles?.username ?? "Unknown",
        avatarUrl: row.profiles?.avatar_url ?? null,
      },
      likeCount: likesInfo.count,
      likedByMe: likesInfo.likedByMe,
      replyCount: 0,
      replies: [],
    });
  }

  const roots: Comment[] = [];

  for (const comment of commentMap.values()) {
    if (comment.parentId && commentMap.has(comment.parentId)) {
      const parent = commentMap.get(comment.parentId)!;
      parent.replies.push(comment);
      parent.replyCount += 1;
    } else if (!comment.parentId) {
      roots.push(comment);
    }
  }

  const sortReplies = (comments: Comment[]) => {
    comments.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    for (const comment of comments) {
      sortReplies(comment.replies);
    }
  };

  sortReplies(roots);
  return roots;
}

function sortTopLevel(comments: Comment[], sort: CommentSort): Comment[] {
  const sorted = [...comments];

  switch (sort) {
    case "oldest":
      sorted.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      break;
    case "popular":
      sorted.sort((a, b) => b.likeCount - a.likeCount || b.replyCount - a.replyCount);
      break;
    case "newest":
    default:
      sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  return sorted;
}

export async function getCommentsForPost(
  postSlug: string,
  options: {
    sort?: CommentSort;
    page?: number;
    pageSize?: number;
  } = {}
): Promise<CommentsPage> {
  const { sort = "newest", page = 0, pageSize = COMMENTS_PAGE_SIZE } = options;

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const currentUserId = claimsData?.claims?.sub ?? null;

  const { data: rows, error } = await supabase
    .from("comments")
    .select(
      `
      id,
      post_slug,
      user_id,
      parent_id,
      content,
      is_deleted,
      created_at,
      updated_at
    `
    )
    .eq("post_slug", postSlug)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch comments:", error.message);
    return { comments: [], totalCount: 0, hasMore: false };
  }

  const baseRows = rows ?? [];
  const profiles = await fetchProfilesByIds(
    supabase,
    baseRows.map((row) => row.user_id)
  );
  const commentRows = attachProfiles(baseRows, profiles) as unknown as CommentRow[];
  const commentIds = commentRows.map((row) => row.id);

  let likes: LikeRow[] = [];

  if (commentIds.length > 0) {
    const { data: likeRows } = await supabase
      .from("comment_likes")
      .select("comment_id, user_id")
      .in("comment_id", commentIds);

    likes = (likeRows ?? []) as LikeRow[];
  }

  const tree = buildCommentTree(commentRows, likes, currentUserId);
  const sorted = sortTopLevel(tree, sort);
  const totalCount = sorted.length;
  const start = page * pageSize;
  const paginated = sorted.slice(start, start + pageSize);

  return {
    comments: paginated,
    totalCount,
    hasMore: start + pageSize < totalCount,
  };
}

export async function getCommentCount(postSlug: string): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("comments")
    .select("id", { count: "exact", head: true })
    .eq("post_slug", postSlug)
    .eq("is_deleted", false);

  if (error) return 0;
  return count ?? 0;
}

export async function getCommentById(commentId: string): Promise<CommentRow | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("comments")
    .select(
      `
      id,
      post_slug,
      user_id,
      parent_id,
      content,
      is_deleted,
      created_at,
      updated_at
    `
    )
    .eq("id", commentId)
    .maybeSingle();

  if (error || !data) return null;

  const profiles = await fetchProfilesByIds(supabase, [data.user_id]);
  return attachProfiles([data], profiles)[0] as unknown as CommentRow;
}

export async function getCommentsForUser(userId: string) {
  const supabase = await createClient();

  const { data: rows, error } = await supabase
    .from("comments")
    .select("id, post_slug, content, is_deleted, created_at, updated_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch user comments:", error.message);
    return [];
  }

  const commentRows = rows ?? [];
  const commentIds = commentRows.map((row) => row.id);

  let likeCounts = new Map<string, number>();

  if (commentIds.length > 0) {
    const { data: likeRows } = await supabase
      .from("comment_likes")
      .select("comment_id")
      .in("comment_id", commentIds);

    for (const like of likeRows ?? []) {
      likeCounts.set(
        like.comment_id,
        (likeCounts.get(like.comment_id) ?? 0) + 1
      );
    }
  }

  return commentRows.map((row) => ({
    id: row.id,
    postSlug: row.post_slug,
    content: row.is_deleted ? "" : row.content,
    isDeleted: row.is_deleted,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    likeCount: likeCounts.get(row.id) ?? 0,
  }));
}

export async function getAllCommentsForAdmin(options: {
  page?: number;
  pageSize?: number;
  includeDeleted?: boolean;
} = {}) {
  const { page = 0, pageSize = 20, includeDeleted = false } = options;
  const supabase = await createClient();

  let query = supabase
    .from("comments")
    .select(
      `
      id,
      post_slug,
      user_id,
      content,
      is_deleted,
      created_at
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  if (!includeDeleted) {
    query = query.eq("is_deleted", false);
  }

  const from = page * pageSize;
  const { data: rows, error, count } = await query.range(from, from + pageSize - 1);

  if (error) {
    console.error("Failed to fetch admin comments:", error.message);
    return { comments: [], totalCount: 0 };
  }

  const baseRows = rows ?? [];
  const profiles = await fetchProfilesByIds(
    supabase,
    baseRows.map((row) => row.user_id)
  );
  const commentRows = attachProfiles(baseRows, profiles);
  const commentIds = commentRows.map((row) => row.id);

  let likeCounts = new Map<string, number>();
  let reportCounts = new Map<string, number>();

  if (commentIds.length > 0) {
    const [{ data: likeRows }, { data: reportRows }] = await Promise.all([
      supabase
        .from("comment_likes")
        .select("comment_id")
        .in("comment_id", commentIds),
      supabase
        .from("comment_reports")
        .select("comment_id")
        .in("comment_id", commentIds),
    ]);

    for (const like of likeRows ?? []) {
      likeCounts.set(
        like.comment_id,
        (likeCounts.get(like.comment_id) ?? 0) + 1
      );
    }

    for (const report of reportRows ?? []) {
      reportCounts.set(
        report.comment_id,
        (reportCounts.get(report.comment_id) ?? 0) + 1
      );
    }
  }

  const comments = commentRows.map((row) => {
    const profile = resolveProfile(
      row.profiles as ProfileJoin | ProfileJoin[] | null
    );

    return {
      id: row.id,
      postSlug: row.post_slug,
      content: row.is_deleted ? "" : row.content,
      isDeleted: row.is_deleted,
      createdAt: row.created_at,
      author: {
        id: profile?.id ?? "",
        username: profile?.username ?? "Unknown",
        avatarUrl: profile?.avatar_url ?? null,
      },
      likeCount: likeCounts.get(row.id) ?? 0,
      reportCount: reportCounts.get(row.id) ?? 0,
    };
  });

  return { comments, totalCount: count ?? 0 };
}

export async function getAllUsersForAdmin() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, avatar_url, role, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch users:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    username: row.username,
    avatarUrl: row.avatar_url,
    role: row.role as "user" | "admin",
    createdAt: row.created_at,
  }));
}
