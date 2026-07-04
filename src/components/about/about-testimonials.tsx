"use client";

import Image from "next/image";
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { ABOUT_TESTIMONIALS } from "@/data/about";
import { Reveal } from "@/components/animations/reveal";
import { cn } from "@/lib/utils";

export function AboutTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const testimonial = ABOUT_TESTIMONIALS[activeIndex];

  return (
    <section className="border-t border-border bg-muted/30 py-16 lg:py-24">
      <Container>
        <Reveal className="mb-12 text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-brand">
            Testimonials
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            What our readers say
          </h2>
        </Reveal>

        <div className="mx-auto max-w-3xl">
          <blockquote className="rounded-2xl border border-border bg-card p-8 shadow-soft">
            <p className="text-base leading-relaxed text-foreground sm:text-lg">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
            <footer className="mt-6 flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-full border border-border">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div>
                <cite className="not-italic font-semibold">{testimonial.name}</cite>
                <p className="text-sm text-brand">{testimonial.role}</p>
              </div>
            </footer>
          </blockquote>

          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="flex gap-2" role="tablist" aria-label="Testimonials">
              {ABOUT_TESTIMONIALS.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={index === activeIndex}
                  aria-label={`Show testimonial from ${item.name}`}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-250",
                    index === activeIndex
                      ? "w-8 bg-brand"
                      : "w-2.5 bg-border hover:bg-muted-foreground/40"
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 hidden gap-6 md:grid md:grid-cols-3">
          {ABOUT_TESTIMONIALS.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-border bg-card p-6 shadow-soft"
            >
              <p className="text-sm leading-relaxed text-muted-foreground">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-brand">{item.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
