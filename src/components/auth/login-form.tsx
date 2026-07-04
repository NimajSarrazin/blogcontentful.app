"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signInWithEmail } from "@/app/auth/actions";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { AUTH_ROUTES } from "@/lib/supabase/config";
import type { AuthActionState } from "@/types/auth";

const initialState: AuthActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Signing in..." : "Sign in"}
    </Button>
  );
}

export function LoginForm({ nextPath = "/" }: { nextPath?: string }) {
  const [state, formAction] = useFormState(signInWithEmail, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      <OAuthButtons nextPath={nextPath} />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="next" value={nextPath} />

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
            placeholder="••••••••"
          />
        </div>

        {state.error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            {state.error}
          </p>
        )}

        <SubmitButton />
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href={AUTH_ROUTES.signup} className="font-medium text-brand hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
