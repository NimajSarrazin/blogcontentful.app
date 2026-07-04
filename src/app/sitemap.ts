import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllPostSlugs } from "@/services/contentful/blog.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllPostSlugs();

  const posts = slugs.map((slug) => ({
    url: `${SITE_URL}/post/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/feed.xml`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.6,
    },
    ...posts,
  ];
}
