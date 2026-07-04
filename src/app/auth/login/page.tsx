import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/layout/hero";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = params.next?.startsWith("/") ? params.next : "/";

  return (
    <>
      <PageHero
        title="Sign in"
        description="Access your account to comment, bookmark, and manage your profile."
      />
      <Container className="py-16">
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 shadow-soft">
          <LoginForm nextPath={nextPath} />
        </div>
      </Container>
    </>
  );
}
