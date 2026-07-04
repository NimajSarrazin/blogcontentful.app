export type ArticleStatus = "draft" | "pending" | "published" | "rejected";

export interface ArticleAuthor {
  id: string;
  username: string;
  avatarUrl: string | null;
}

export interface Article {
  id: string;
  userId: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: ArticleStatus;
  createdAt: string;
  updatedAt: string;
  author: ArticleAuthor;
}

export interface ArticleActionState {
  error?: string;
  success?: string;
  articleId?: string;
}

export interface UserComment {
  id: string;
  postSlug: string;
  postTitle: string;
  content: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
}

export interface AdminComment {
  id: string;
  postSlug: string;
  postTitle: string;
  content: string;
  isDeleted: boolean;
  createdAt: string;
  author: ArticleAuthor;
  likeCount: number;
  reportCount: number;
}

export interface AdminUser {
  id: string;
  username: string;
  avatarUrl: string | null;
  role: "user" | "admin";
  createdAt: string;
}

export interface CommentReport {
  id: string;
  commentId: string;
  reason: string | null;
  createdAt: string;
  reporter: ArticleAuthor;
  comment: AdminComment;
}

export interface AdminActionState {
  error?: string;
  success?: string;
}
