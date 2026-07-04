export type UserRole = "user" | "admin";

export interface UserProfile {
  id: string;
  username: string;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  profile: UserProfile | null;
}

export interface AuthActionState {
  error?: string;
  success?: string;
}
