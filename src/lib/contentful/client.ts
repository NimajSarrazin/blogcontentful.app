import { createClient, type ContentfulClientApi } from "contentful";

function getEnvVar(name: string, fallback?: string): string {
  const value = (process.env[name] ?? fallback)?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function createContentfulClient(): ContentfulClientApi<undefined> {
  return createClient({
    space: getEnvVar("NEXT_PUBLIC_CONTENT_SPACE_ID"),
    accessToken: getEnvVar(
      "NEXT_PUBLIC_CONTENT_ACESS_TOKEN",
      process.env.NEXT_PUBLIC_CONTENT_ACCESS_TOKEN
    ),
  });
}

export function getContentfulImageUrl(
  url: string,
  options?: { width?: number; quality?: number; format?: "webp" | "jpg" | "png" }
): string {
  const normalized = url.startsWith("//") ? `https:${url}` : url;
  if (!options) return normalized;

  const params = new URLSearchParams();
  if (options.width) params.set("w", String(options.width));
  if (options.quality) params.set("q", String(options.quality));
  if (options.format) params.set("fm", options.format);

  const query = params.toString();
  return query ? `${normalized}?${query}` : normalized;
}
