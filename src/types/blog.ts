import type { Document } from "@contentful/rich-text-types";

export interface ContentfulAsset {
  fields: {
    title?: string;
    description?: string;
    file: {
      url: string;
      details?: {
        image?: {
          width: number;
          height: number;
        };
      };
    };
  };
}

export interface ContentfulAuthor {
  fields: {
    name: string;
    avatar?: ContentfulAsset;
    bio?: string;
    slug?: string;
  };
}

export interface ContentfulCategory {
  fields: {
    name: string;
    slug: string;
  };
}

export interface ContentfulTag {
  fields: {
    name: string;
    slug: string;
  };
}

export interface ContentfulBlogPostFields {
  title: string;
  slug: string;
  extract?: string;
  excerpt?: string;
  content: Document;
  featureImage: ContentfulAsset;
  createdAt?: string;
  author?: ContentfulAuthor;
  category?: ContentfulCategory;
  categories?: ContentfulCategory[];
  tags?: ContentfulTag[];
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: ContentfulAsset;
  relatedPosts?: ContentfulBlogPostEntry[];
}

export interface ContentfulBlogPostEntry {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  fields: ContentfulBlogPostFields;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: Document;
  coverImage: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
  };
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  author?: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  category?: string;
  categories: string[];
  tags: string[];
  seo: {
    title: string;
    description: string;
    ogImage?: string;
  };
  relatedSlugs: string[];
}

export interface BlogPostPreview {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: {
    url: string;
    alt: string;
  };
  publishedAt: string;
  readingTime: number;
  category?: string;
  categories: string[];
  tags: string[];
}

export interface ArticleFacets {
  categories: string[];
  tags: string[];
}

export interface ArticleFilters {
  query: string;
  category: string | null;
  tag: string | null;
}
