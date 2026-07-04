"use client";

import { Container } from "@/components/ui/container";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { ParallaxLayer } from "@/components/animations/parallax-layer";
import { TextReveal } from "@/components/animations/text-reveal";

interface ImagePageHeroProps {
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  backgroundImage?: string;
  backgroundLabel?: string;
}

export function ImagePageHero({
  title,
  description,
  breadcrumbs,
  backgroundImage = "/img/bg1.jpg",
  backgroundLabel = "Page background",
}: ImagePageHeroProps) {
  return (
    <section className="relative min-h-[70vh] overflow-hidden">
      <ParallaxLayer className="absolute inset-0" speed={0.12}>
        <div
          className="h-[120%] w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${backgroundImage}')` }}
          role="img"
          aria-label={backgroundLabel}
        />
      </ParallaxLayer>
      <div className="hero-overlay" />

      <Container className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
        <TextReveal>
          <h1
            data-reveal-item
            className="font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl"
          >
            {title}
          </h1>
          {description && (
            <p
              data-reveal-item
              className="mt-4 max-w-2xl text-base text-white/90 sm:text-lg"
            >
              {description}
            </p>
          )}
          <div data-reveal-item className="mt-4 flex justify-center">
            <Breadcrumbs
              className="justify-center"
              items={[{ label: "Home", href: "/" }, ...breadcrumbs]}
            />
          </div>
        </TextReveal>
      </Container>
    </section>
  );
}
