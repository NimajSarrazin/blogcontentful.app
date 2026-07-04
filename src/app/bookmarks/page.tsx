import type { Metadata } from "next";
import { BookmarksPageClient } from "@/app/bookmarks/bookmarks-page-client";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Bookmarks",
  description: "Your saved Readit articles.",
  alternates: { canonical: `${SITE_URL}/bookmarks` },
  robots: { index: false, follow: false },
  openGraph: {
    title: `Bookmarks | ${SITE_NAME}`,
    url: `${SITE_URL}/bookmarks`,
  },
};

export default function BookmarksPage() {
  return <BookmarksPageClient />;
}
