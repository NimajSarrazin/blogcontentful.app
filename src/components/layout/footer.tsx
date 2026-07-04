import Link from "next/link";
import { Rss } from "lucide-react";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";
import { Container } from "@/components/ui/container";
import { SITE_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <p className="font-display text-lg font-bold">
            {SITE_NAME}
            <span className="text-brand">.</span>
          </p>
          <p className="text-sm text-muted-foreground">
            A modern blog built with Next.js and Contentful. Thoughtful writing
            on design, development, and technology.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide">
            Navigation
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-foreground">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/bookmarks" className="hover:text-foreground">
                Bookmarks
              </Link>
            </li>
            <li>
              <Link
                href="/feed.xml"
                className="inline-flex items-center gap-1.5 hover:text-foreground"
              >
                <Rss className="h-3.5 w-3.5" />
                RSS Feed
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide">
            Topics
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Design</li>
            <li>Development</li>
            <li>Technology</li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide">
            Newsletter
          </h2>
          <NewsletterForm />
        </div>
      </Container>

      <div className="border-t border-border py-6">
        <Container>
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </Container>
      </div>
    </footer>
  );
}
