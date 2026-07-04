import Link from "next/link";
import { Container } from "@/components/ui/container";
import { AUTH_ROUTES } from "@/lib/supabase/config";

export default function AuthCodeErrorPage() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-sm font-medium text-brand">Authentication error</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">
        We couldn&apos;t sign you in
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        The authentication link may have expired or already been used. Please try
        signing in again.
      </p>
      <Link
        href={AUTH_ROUTES.login}
        className="mt-8 inline-flex h-10 items-center justify-center rounded-md bg-brand px-4 text-sm font-medium text-brand-foreground transition-all hover:brightness-105"
      >
        Back to sign in
      </Link>
    </Container>
  );
}
