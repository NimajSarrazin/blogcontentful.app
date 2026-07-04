import Image from "next/image";
import {
  documentToReactComponents,
  type Options,
} from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";
import type { Document } from "@contentful/rich-text-types";
import { slugify } from "@/lib/utils";
import type { TocItem } from "@/components/blog/table-of-contents";

function extractTocItems(document: Document): TocItem[] {
  const items: TocItem[] = [];

  const walk = (node: Document | { nodeType: string; content?: unknown[]; value?: string }) => {
    if (
      node.nodeType === BLOCKS.HEADING_2 ||
      node.nodeType === BLOCKS.HEADING_3
    ) {
      const text =
        "content" in node && Array.isArray(node.content)
          ? node.content
              .map((child) =>
                typeof child === "object" &&
                child !== null &&
                "value" in child &&
                typeof child.value === "string"
                  ? child.value
                  : ""
              )
              .join("")
          : "";

      if (text) {
        items.push({
          id: slugify(text),
          text,
          level: node.nodeType === BLOCKS.HEADING_2 ? 2 : 3,
        });
      }
    }

    if ("content" in node && Array.isArray(node.content)) {
      node.content.forEach((child) => walk(child as Document));
    }
  };

  walk(document);
  return items;
}

function createRenderOptions(): Options {
  return {
    renderMark: {
      [MARKS.BOLD]: (text) => <strong>{text}</strong>,
      [MARKS.ITALIC]: (text) => <em>{text}</em>,
      [MARKS.CODE]: (text) => (
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm">{text}</code>
      ),
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (_node, children) => (
        <p className="mb-5 leading-7 text-foreground/90">{children}</p>
      ),
      [BLOCKS.HEADING_2]: (_node, children) => {
        const text = String(children);
        return (
          <h2
            id={slugify(text)}
            className="mb-4 mt-10 scroll-mt-28 text-2xl font-semibold tracking-tight"
          >
            {children}
          </h2>
        );
      },
      [BLOCKS.HEADING_3]: (_node, children) => {
        const text = String(children);
        return (
          <h3
            id={slugify(text)}
            className="mb-3 mt-8 scroll-mt-28 text-xl font-semibold tracking-tight"
          >
            {children}
          </h3>
        );
      },
      [BLOCKS.UL_LIST]: (_node, children) => (
        <ul className="mb-5 list-disc space-y-2 pl-6">{children}</ul>
      ),
      [BLOCKS.OL_LIST]: (_node, children) => (
        <ol className="mb-5 list-decimal space-y-2 pl-6">{children}</ol>
      ),
      [BLOCKS.QUOTE]: (_node, children) => (
        <blockquote className="my-8 border-l-4 border-brand pl-5 italic text-muted-foreground">
          {children}
        </blockquote>
      ),
      [BLOCKS.HR]: () => <hr className="my-10 border-border" />,
      [INLINES.HYPERLINK]: (node, children) => {
        const uri = node.data.uri as string;
        return (
          <a
            href={uri}
            target={uri.startsWith("http") ? "_blank" : undefined}
            rel={uri.startsWith("http") ? "noopener noreferrer" : undefined}
            className="font-medium text-brand underline-offset-4 hover:underline"
          >
            {children}
          </a>
        );
      },
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const fields = node.data.target?.fields;
        const file = fields?.file;
        if (!file?.url) return null;

        const url = file.url.startsWith("//") ? `https:${file.url}` : file.url;
        const alt = fields?.description ?? fields?.title ?? "Article image";

        return (
          <figure className="my-8 overflow-hidden rounded-xl border border-border">
            <div className="relative aspect-video">
              <Image
                src={url}
                alt={alt}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
            {fields?.description && (
              <figcaption className="px-4 py-3 text-sm text-muted-foreground">
                {fields.description}
              </figcaption>
            )}
          </figure>
        );
      },
    },
  };
}

interface PostContentProps {
  content: Document;
}

export function extractTocFromContent(content: Document): TocItem[] {
  return extractTocItems(content);
}

export function PostContent({ content }: PostContentProps) {
  return (
    <div
      id="article-content"
      className="prose prose-neutral max-w-none dark:prose-invert"
    >
      {documentToReactComponents(content, createRenderOptions())}
    </div>
  );
}
