import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar, Clock, User } from "lucide-react";
import { CommentsSection } from "@/components/comments/comments-section";
import {
  extractTocFromContent,
  PostContent,
} from "@/components/blog/post-content";
import { PostNavigation } from "@/components/blog/post-navigation";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { RelatedPosts } from "@/components/blog/related-posts";
import { ShareButtons } from "@/components/blog/share-buttons";
import { BookmarkButton } from "@/components/blog/bookmark-button";
import { ReadingHistoryTracker } from "@/components/blog/reading-history-tracker";
import { JsonLd } from "@/components/seo/json-ld";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { Container } from "@/components/ui/container";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { absoluteUrl, formatDate } from "@/lib/utils";
import {
  getAdjacentPosts,
  getAllPostSlugs,
  getPostBySlug,
  getRelatedPosts,
} from "@/services/contentful/blog.service";
import { getCommentsForPost } from "@/services/comments/comment.service";
import { getAuthUser } from "@/services/auth/auth.service";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post not found" };
  }

  const url = absoluteUrl(`/post/${slug}`);

  return {
    title: post.seo.title,
    description: post.seo.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.seo.title,
      description: post.seo.description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: post.seo.ogImage ? [{ url: post.seo.ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo.title,
      description: post.seo.description,
      images: post.seo.ogImage ? [post.seo.ogImage] : undefined,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const [{ previous, next }, relatedPosts, commentsData, currentUser] =
    await Promise.all([
      getAdjacentPosts(slug),
      getRelatedPosts(slug, post.relatedSlugs),
      getCommentsForPost(slug),
      getAuthUser(),
    ]);

  const tocItems = extractTocFromContent(post.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seo.description,
    image: post.seo.ogImage ?? post.coverImage.url,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author?.name ?? SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: absoluteUrl(`/post/${slug}`),
  };

  return (
    <>
      <ReadingProgress />
      <ReadingHistoryTracker
        slug={post.slug}
        title={post.title}
        excerpt={post.excerpt}
        coverImageUrl={post.coverImage.url}
      />
      <JsonLd data={jsonLd} />

      <article className="pb-20 pt-24">
        <Container>
          <header className="mx-auto max-w-4xl text-center">
            <div className="mb-4 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
              {post.category && (
                <span className="rounded-full bg-muted px-3 py-1 font-medium text-foreground">
                  {post.category}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(post.publishedAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readingTime} min read
              </span>
            </div>

            <h1 className="font-display text-display-sm font-bold tracking-tight sm:text-display-md">
              {post.title}
            </h1>

            {post.author && (
              <div className="mt-6 inline-flex items-center gap-3">
                {post.author.avatar ? (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4" />
                  </div>
                )}
                <div className="text-left">
                  <p className="text-sm font-medium">{post.author.name}</p>
                  {post.author.bio && (
                    <p className="text-xs text-muted-foreground">{post.author.bio}</p>
                  )}
                </div>
              </div>
            )}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <BookmarkButton
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                coverImageUrl={post.coverImage.url}
                showLabel
              />
            </div>
          </header>

          <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-2xl border border-border">
            <div className="relative aspect-[21/9]">
              <Image
                src={post.coverImage.url}
                alt={post.coverImage.alt}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="mx-auto mt-12 grid max-w-6xl gap-12 lg:grid-cols-[220px_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-8">
                <TableOfContents items={tocItems} />
                <ShareButtons title={post.title} slug={post.slug} />
              </div>
            </aside>

            <div className="min-w-0 space-y-10">
              <PostContent content={post.content} />

              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 border-t border-border pt-8">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="lg:hidden">
                <ShareButtons title={post.title} slug={post.slug} />
              </div>

              <PostNavigation previous={previous} next={next} />

              <CommentsSection
                postSlug={slug}
                initialData={commentsData}
                currentUser={currentUser}
              />
            </div>
          </div>

          <div className="mx-auto mt-20 max-w-6xl">
            <RelatedPosts posts={relatedPosts} />
          </div>
        </Container>
      </article>
    </>
  );
}
