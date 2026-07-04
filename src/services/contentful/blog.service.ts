import type { Document } from "@contentful/rich-text-types";
import {
  createContentfulClient,
  getContentfulImageUrl,
} from "@/lib/contentful/client";
import { CONTENTFUL_CONTENT_TYPE, POSTS_PER_PAGE } from "@/lib/constants";
import { getReadingTime } from "@/lib/utils";
import type {
  BlogPost,
  BlogPostPreview,
  ContentfulBlogPostEntry,
  ContentfulBlogPostFields,
} from "@/types/blog";

function extractPlainText(document: Document): string {
  const walk = (node: Document | { nodeType: string; value?: string; content?: unknown[] }): string => {
    if ("value" in node && typeof node.value === "string") {
      return node.value;
    }
    if ("content" in node && Array.isArray(node.content)) {
      return node.content.map((child) => walk(child as Document)).join(" ");
    }
    return "";
  };
  return walk(document).replace(/\s+/g, " ").trim();
}

function parseAsset(
  asset: ContentfulBlogPostFields["featureImage"] | undefined,
  fallbackAlt: string
) {
  if (!asset?.fields?.file?.url) {
    return {
      url: "/vercel.svg",
      alt: fallbackAlt,
    };
  }

  return {
    url: getContentfulImageUrl(asset.fields.file.url, { width: 1400, quality: 80, format: "webp" }),
    alt: asset.fields.description ?? asset.fields.title ?? fallbackAlt,
    width: asset.fields.file.details?.image?.width,
    height: asset.fields.file.details?.image?.height,
  };
}

function parsePost(entry: ContentfulBlogPostEntry): BlogPost {
  const { fields, sys } = entry;
  const plainText = extractPlainText(fields.content);
  const excerpt = fields.excerpt ?? fields.extract ?? plainText.slice(0, 160);

  const categories =
    fields.categories?.map((c) => c.fields.name) ??
    (fields.category ? [fields.category.fields.name] : []);

  const tags = fields.tags?.map((t) => t.fields.name) ?? [];

  const ogImageAsset = fields.ogImage ?? fields.featureImage;

  return {
    id: sys.id,
    title: fields.title,
    slug: fields.slug,
    excerpt,
    content: fields.content,
    coverImage: parseAsset(fields.featureImage, fields.title),
    publishedAt: fields.createdAt ?? sys.createdAt,
    updatedAt: sys.updatedAt,
    readingTime: getReadingTime(plainText),
    author: fields.author
      ? {
          name: fields.author.fields.name,
          avatar: fields.author.fields.avatar
            ? getContentfulImageUrl(fields.author.fields.avatar.fields.file.url, {
                width: 96,
                quality: 80,
              })
            : undefined,
          bio: fields.author.fields.bio,
        }
      : undefined,
    category: categories[0],
    categories,
    tags,
    seo: {
      title: fields.seoTitle ?? fields.title,
      description: fields.seoDescription ?? excerpt,
      ogImage: ogImageAsset
        ? getContentfulImageUrl(ogImageAsset.fields.file.url, {
            width: 1200,
            quality: 85,
            format: "webp",
          })
        : undefined,
    },
    relatedSlugs:
      fields.relatedPosts?.map((post) => post.fields.slug).filter(Boolean) ?? [],
  };
}

function parsePreview(entry: ContentfulBlogPostEntry): BlogPostPreview {
  const post = parsePost(entry);
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    coverImage: {
      url: post.coverImage.url,
      alt: post.coverImage.alt,
    },
    publishedAt: post.publishedAt,
    readingTime: post.readingTime,
    category: post.category,
    categories: post.categories,
    tags: post.tags,
  };
}

export async function getAllPosts(limit = POSTS_PER_PAGE): Promise<BlogPostPreview[]> {
  const client = createContentfulClient();
  const data = await client.getEntries({
    content_type: CONTENTFUL_CONTENT_TYPE,
    order: ["-sys.createdAt"],
    limit,
  });

  return data.items.map((item) =>
    parsePreview(item as unknown as ContentfulBlogPostEntry)
  );
}

export async function getSearchablePosts(limit = 100): Promise<BlogPostPreview[]> {
  return getAllPosts(limit);
}

export async function getPostTitlesBySlugs(
  slugs: string[]
): Promise<Map<string, string>> {
  const uniqueSlugs = [...new Set(slugs.filter(Boolean))];
  if (uniqueSlugs.length === 0) return new Map();

  const client = createContentfulClient();
  const data = await client.getEntries({
    content_type: CONTENTFUL_CONTENT_TYPE,
    "fields.slug[in]": uniqueSlugs.join(","),
    select: ["fields.slug", "fields.title"],
    limit: uniqueSlugs.length,
  });

  const titles = new Map<string, string>();

  for (const item of data.items) {
    const slug = item.fields.slug;
    const title = item.fields.title;
    if (typeof slug === "string" && typeof title === "string") {
      titles.set(slug, title);
    }
  }

  return titles;
}

export async function enrichWithPostTitles<T extends { postSlug: string }>(
  items: T[]
): Promise<(T & { postTitle: string })[]> {
  const titles = await getPostTitlesBySlugs(items.map((item) => item.postSlug));

  return items.map((item) => ({
    ...item,
    postTitle: titles.get(item.postSlug) ?? item.postSlug,
  }));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const client = createContentfulClient();
  const data = await client.getEntries({
    content_type: CONTENTFUL_CONTENT_TYPE,
    "fields.slug": slug,
    limit: 1,
  });

  const entry = data.items[0] as unknown as ContentfulBlogPostEntry | undefined;
  return entry ? parsePost(entry) : null;
}

export async function getAllPostSlugs(): Promise<string[]> {
  const client = createContentfulClient();
  const data = await client.getEntries({
    content_type: CONTENTFUL_CONTENT_TYPE,
    select: ["fields.slug"],
  });

  return data.items
    .map((item) => item.fields.slug)
    .filter((slug): slug is string => Boolean(slug));
}

export async function getAdjacentPosts(slug: string): Promise<{
  previous: BlogPostPreview | null;
  next: BlogPostPreview | null;
}> {
  const posts = await getAllPosts(100);
  const index = posts.findIndex((post) => post.slug === slug);

  if (index === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: index > 0 ? posts[index - 1] : null,
    next: index < posts.length - 1 ? posts[index + 1] : null,
  };
}

export async function getRelatedPosts(
  slug: string,
  relatedSlugs: string[],
  limit = 3
): Promise<BlogPostPreview[]> {
  const posts = await getAllPosts(50);
  const related = posts.filter(
    (post) => post.slug !== slug && relatedSlugs.includes(post.slug)
  );

  if (related.length >= limit) {
    return related.slice(0, limit);
  }

  const fallback = posts
    .filter((post) => post.slug !== slug && !relatedSlugs.includes(post.slug))
    .slice(0, limit - related.length);

  return [...related, ...fallback].slice(0, limit);
}
