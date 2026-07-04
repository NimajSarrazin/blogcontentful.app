export const SITE_NAME = "Readit";
export const SITE_DESCRIPTION =
  "A modern blog built with Next.js and Contentful — thoughtful writing on design, development, and technology.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://blogcontentful-app.vercel.app";
export const CONTENTFUL_CONTENT_TYPE = "blogNextjs";
export const POSTS_PER_PAGE = 9;
export const REVALIDATE_SECONDS = 60;

export const COMMENTS_PAGE_SIZE = 10;
export const MAX_COMMENT_LENGTH = 5000;
export const MAX_NESTING_DEPTH = 3;

export const ARTICLES_PAGE_SIZE = 10;
export const MAX_ARTICLE_TITLE_LENGTH = 200;
export const MAX_ARTICLE_EXCERPT_LENGTH = 500;
export const MAX_ARTICLE_CONTENT_LENGTH = 50000;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
