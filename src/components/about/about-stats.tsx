import { Container } from "@/components/ui/container";
import { ABOUT_STATS } from "@/data/about";
import { StaggerReveal } from "@/components/animations/stagger-reveal";

export function AboutStats() {
  return (
    <section className="border-t border-border py-16">
      <Container>
        <StaggerReveal className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {ABOUT_STATS.map((stat) => (
            <div key={stat.label} data-stagger-item className="text-center">
              <p className="font-display text-3xl font-bold text-brand sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </StaggerReveal>
      </Container>
    </section>
  );
}
