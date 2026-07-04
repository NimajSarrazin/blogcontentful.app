import type { Metadata } from "next";
import { Suspense } from "react";
import { Hero } from "@/components/layout/hero";
import { ReadingHistorySection } from "@/components/blog/reading-history-section";
import { Container } from "@/components/ui/container";
import { ArticlesExplorer } from "@/components/search/articles-explorer";
import { Reveal } from "@/components/animations/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { PostCardSkeleton } from "@/components/ui/skeleton";
import { SITE_URL } from "@/lib/constants";
import { buildBlogJsonLd } from "@/lib/seo/structured-data";
import { getSearchablePosts } from "@/services/contentful/blog.service";

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
};

export const revalidate = 60;

async function ArticlesExplorerServer() {
  const posts = await getSearchablePosts();
  return (
    <>
      <JsonLd data={buildBlogJsonLd(posts)} />
      <ArticlesExplorer posts={posts} />
    </>
  );
}

function ArticlesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <PostCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <ReadingHistorySection />
      <section id="articles" className="py-20">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <p className="mb-2 text-sm font-medium text-brand">Latest</p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Articles & insights
            </h2>
            <p className="mt-4 text-muted-foreground">
              Explore the latest writing from the Readit blog.
            </p>
          </Reveal>

          <Suspense fallback={<ArticlesSkeleton />}>
            <ArticlesExplorerServer />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
