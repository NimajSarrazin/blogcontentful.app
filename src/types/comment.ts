export type CommentSort = "newest" | "oldest" | "popular";

export interface CommentAuthor {
  id: string;
  username: string;
  avatarUrl: string | null;
}

export interface Comment {
  id: string;
  postSlug: string;
  userId: string;
  parentId: string | null;
  content: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  author: CommentAuthor;
  likeCount: number;
  likedByMe: boolean;
  replyCount: number;
  replies: Comment[];
}

export interface CommentActionState {
  error?: string;
  success?: string;
}

export interface CommentsPage {
  comments: Comment[];
  totalCount: number;
  hasMore: boolean;
}
