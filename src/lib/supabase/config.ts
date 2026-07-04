export {
  AUTH_ROUTES,
  PROTECTED_ROUTES,
  ADMIN_ROUTES,
  GUEST_ONLY_ROUTES,
} from "@/lib/supabase/routes";

export type SupabaseConfig = {
  url: string;
  publishableKey: string;
};

let cachedConfig: SupabaseConfig | null = null;

function readSupabaseEnv(): SupabaseConfig {
  // Static property access is required so Next.js can inline NEXT_PUBLIC_*
  // values into the Edge middleware bundle. Dynamic process.env[name] lookups
  // are not replaced and resolve to undefined on Edge.
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim() ||
    "";
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.SUPABASE_PUBLISHABLE_KEY?.trim() ||
    "";

  // #region agent log
  fetch("http://127.0.0.1:7263/ingest/4e4403bf-211c-4df0-815b-6ab32322b273", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "61d722",
    },
    body: JSON.stringify({
      sessionId: "61d722",
      runId: "post-fix",
      location: "config.ts:readSupabaseEnv",
      message: "supabase env lookup (static)",
      data: {
        urlLen: url.length,
        publishableKeyLen: publishableKey.length,
        hasPublicUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()),
        hasServerUrl: Boolean(process.env.SUPABASE_URL?.trim()),
      },
      timestamp: Date.now(),
      hypothesisId: "C",
    }),
  }).catch(() => {});
  // #endregion

  if (!url) {
    throw new Error("Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!publishableKey) {
    throw new Error(
      "Missing required environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
    );
  }

  return { url, publishableKey };
}

export function getSupabaseConfig(): SupabaseConfig {
  if (!cachedConfig) {
    cachedConfig = readSupabaseEnv();
  }

  return cachedConfig;
}

/** @deprecated Use getSupabaseConfig() */
export const supabaseConfig = new Proxy({} as SupabaseConfig, {
  get(_target, prop: keyof SupabaseConfig) {
    return getSupabaseConfig()[prop];
  },
});
