import type { Metadata } from "next";
import Link from "next/link";
import { ImagePageHero } from "@/components/layout/image-page-hero";
import { AboutIntro } from "@/components/about/about-intro";
import { AboutStats } from "@/components/about/about-stats";
import { AboutTestimonials } from "@/components/about/about-testimonials";
import { Magnetic } from "@/components/animations/magnetic";
import { Reveal } from "@/components/animations/reveal";
import { Container } from "@/components/ui/container";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Readit — a modern blog for developers and designers, built with Next.js, TypeScript, and Contentful.",
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: `About | ${SITE_NAME}`,
    description:
      "Learn about Readit — thoughtful writing on design, development, and technology.",
    url: `${SITE_URL}/about`,
  },
};

export default function AboutPage() {
  return (
    <>
      <ImagePageHero title="About" breadcrumbs={[{ label: "About" }]} />
      <AboutIntro />
      <AboutStats />
      <AboutTestimonials />

      <section className="border-t border-border py-16">
        <Container className="text-center">
          <Reveal>
            <h2 className="font-display text-2xl font-bold tracking-tight">
              Want to get in touch?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              Whether you have feedback, a collaboration idea, or just want to say
              hello — we&apos;d love to hear from you.
            </p>
            <Magnetic className="mt-6">
              <Link
                href="/contact"
                className="inline-flex h-10 items-center justify-center rounded-md bg-brand px-6 text-sm font-medium text-brand-foreground transition-all hover:brightness-105"
              >
                Contact us
              </Link>
            </Magnetic>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
