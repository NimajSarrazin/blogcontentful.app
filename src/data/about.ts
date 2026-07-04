export const ABOUT_TABS = [
  {
    id: "mission",
    label: "Our Mission",
    content:
      "Readit exists to publish thoughtful writing on design, development, and technology. We focus on articles that are practical, well-researched, and genuinely useful — the kind you bookmark and come back to when building real products.",
  },
  {
    id: "vision",
    label: "Our Vision",
    content:
      "We want every reading session to feel as polished as the best engineering blogs: fast to load, easy on the eyes, accessible to everyone, and built for deep focus — not endless scrolling or noisy distractions.",
  },
  {
    id: "values",
    label: "Our Values",
    content:
      "Clarity over clickbait. Quality over quantity. We believe in open tools, honest writing, and respecting the reader's time. Every article should teach something, spark an idea, or help you ship better work.",
  },
] as const;

export const ABOUT_TESTIMONIALS = [
  {
    id: "1",
    quote:
      "Readit has become my go-to for frontend architecture insights. The writing is clear, the examples are practical, and I always leave with something I can apply the same day.",
    name: "Sarah Chen",
    role: "Senior Frontend Engineer",
    avatar: "/img/Personne1.webp",
  },
  {
    id: "2",
    quote:
      "Finally a blog that treats performance and accessibility as first-class concerns. The attention to detail in both the content and the reading experience is rare.",
    name: "Marcus Webb",
    role: "Tech Lead",
    avatar: "/img/person_2.jpg",
  },
  {
    id: "3",
    quote:
      "I recommend Readit to every developer on my team. It's the kind of resource that makes you a better engineer without feeling like homework.",
    name: "Elena Rodriguez",
    role: "Product Designer",
    avatar: "/img/person_3.jpg",
  },
] as const;

export const ABOUT_STATS = [
  { label: "Articles published", value: "50+" },
  { label: "Monthly readers", value: "12k+" },
  { label: "Topics covered", value: "15+" },
  { label: "Countries reached", value: "40+" },
] as const;
