import { Container } from "@/components/ui/container";
import { ImagePageHero } from "@/components/layout/image-page-hero";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <>
      <ImagePageHero
        title="Contact"
        description="Get in touch — we'd love to hear from you."
        breadcrumbs={[{ label: "Contact" }]}
      />
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Let&apos;s talk</h2>
            <p className="text-muted-foreground">
              Have a question or want to collaborate? Send us a message and we&apos;ll
              get back to you as soon as possible.
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Email:</span>{" "}
                <a href="mailto:hello@readit.blog" className="text-brand hover:underline">
                  hello@readit.blog
                </a>
              </p>
              <p>
                <span className="font-medium">Location:</span> Paris, France
              </p>
            </div>
          </div>

          <form className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-soft">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="Your message"
              />
            </div>
            <Button type="submit">Send message</Button>
          </form>
        </div>
      </Container>
    </>
  );
}
