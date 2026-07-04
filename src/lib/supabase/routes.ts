export const AUTH_ROUTES = {
  login: "/auth/login",
  signup: "/auth/signup",
  callback: "/auth/callback",
  error: "/auth/auth-code-error",
  profile: "/profile",
  dashboard: "/dashboard",
  admin: "/admin",
} as const;

export const PROTECTED_ROUTES = [
  AUTH_ROUTES.profile,
  AUTH_ROUTES.dashboard,
  AUTH_ROUTES.admin,
] as const;

export const ADMIN_ROUTES = [AUTH_ROUTES.admin] as const;

export const GUEST_ONLY_ROUTES = [
  AUTH_ROUTES.login,
  AUTH_ROUTES.signup,
] as const;
