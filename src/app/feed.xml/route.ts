import { NextResponse } from "next/server";
import { buildRssFeed } from "@/lib/seo/structured-data";
import { getSearchablePosts } from "@/services/contentful/blog.service";

export const revalidate = 60;

export async function GET() {
  const posts = await getSearchablePosts();
  const feed = buildRssFeed(posts);

  return new NextResponse(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=60, stale-while-revalidate",
    },
  });
}
