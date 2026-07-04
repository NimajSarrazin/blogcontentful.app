import Image from "next/image";
import { Container } from "@/components/ui/container";
import { AboutTabs } from "@/components/about/about-tabs";
import { Reveal } from "@/components/animations/reveal";

export function AboutIntro() {
  return (
    <section className="py-16 lg:py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal y={48}>
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border shadow-card">
                <Image
                  src="/img/ImageAbout1.webp"
                  alt="Team member reviewing articles on a notebook"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div
                className="absolute -bottom-4 -right-4 hidden h-20 w-20 items-center justify-center rounded-full bg-brand shadow-elevated lg:flex"
                aria-hidden="true"
              >
                <div className="ml-1 h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-brand-foreground" />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Welcome to Readit
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                  We give you the best articles you want.
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Readit is a modern blog for developers, designers, and curious
                  builders. We publish in-depth guides, architecture breakdowns,
                  and practical insights — all powered by a fast, accessible
                  reading experience.
                </p>
              </div>

              <AboutTabs />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
