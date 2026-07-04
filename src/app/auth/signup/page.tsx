import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/layout/hero";

export const metadata: Metadata = {
  title: "Sign up",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <>
      <PageHero
        title="Create account"
        description="Join Readit to engage with articles and the community."
      />
      <Container className="py-16">
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 shadow-soft">
          <SignupForm />
        </div>
      </Container>
    </>
  );
}
