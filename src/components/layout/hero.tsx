"use client";

import { ArrowDown } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ParallaxLayer } from "@/components/animations/parallax-layer";
import { TextReveal } from "@/components/animations/text-reveal";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

function scrollToSection(selector: string) {
  const target = document.querySelector(selector);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Hero() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative min-h-[70vh] overflow-hidden">
      <ParallaxLayer className="absolute inset-0" speed={0.15}>
        <div
          className="h-[120%] w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/img/bg1.jpg')" }}
          role="img"
          aria-label="Hero background"
        />
      </ParallaxLayer>
      <div className="hero-overlay" />

      <Container className="relative z-10 flex min-h-[70vh] items-center py-24">
        <TextReveal className="max-w-3xl">
          <p
            data-reveal-item
            className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-white/80"
          >
            Welcome to
          </p>
          <h1
            data-reveal-item
            className="font-display text-display-sm font-bold text-white sm:text-display-md lg:text-display-lg"
          >
            Readit blog
          </h1>
          <p
            data-reveal-item
            className="mt-6 max-w-2xl text-base text-white/90 sm:text-lg"
          >
            Far far away, behind the word mountains, far from the countries
            Vokalia and Consonantia, there live the blind texts.
          </p>

          <button
            data-reveal-item
            type="button"
            className="mt-10 inline-flex items-center gap-2 text-white transition-opacity hover:opacity-80"
            aria-label="Scroll to articles"
            onClick={() => {
              if (reducedMotion) {
                document
                  .getElementById("articles")
                  ?.scrollIntoView({ behavior: "auto" });
                return;
              }
              scrollToSection("#articles");
            }}
          >
            <span className="text-sm font-medium">Explore articles</span>
            <ArrowDown className="h-5 w-5 animate-bounce" />
          </button>
        </TextReveal>
      </Container>
    </section>
  );
}

export function PageHero({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <section className="border-b border-border bg-muted/40 py-16 pt-28">
      <Container>
        <TextReveal>
          <p data-reveal-item className="mb-2 text-sm font-medium text-brand">
            Readit
          </p>
          <h1
            data-reveal-item
            className="font-display text-display-sm font-bold tracking-tight"
          >
            {title}
          </h1>
          {description && (
            <p data-reveal-item className="mt-4 max-w-2xl text-muted-foreground">
              {description}
            </p>
          )}
        </TextReveal>
      </Container>
    </section>
  );
}
