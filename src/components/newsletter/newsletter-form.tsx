"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { subscribeNewsletter, type NewsletterActionState } from "@/app/newsletter/actions";
import { Button } from "@/components/ui/button";

const initialState: NewsletterActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending} className="shrink-0">
      {pending ? "..." : "Subscribe"}
    </Button>
  );
}

export function NewsletterForm() {
  const [state, formAction] = useActionState(subscribeNewsletter, initialState);
  const [email, setEmail] = useState("");
  const prevSuccess = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (state.success && state.success !== prevSuccess.current) {
      prevSuccess.current = state.success;
      setEmail("");
    }
  }, [state.success]);

  return (
    <form action={formAction} className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Get the latest articles delivered to your inbox.
      </p>
      <div className="flex gap-2">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          placeholder="you@example.com"
          aria-label="Email address"
          className="h-9 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <SubmitButton />
      </div>
      {state.error && (
        <p className="text-xs text-red-600 dark:text-red-400">{state.error}</p>
      )}
      {state.success && (
        <p className="text-xs text-green-600 dark:text-green-400">{state.success}</p>
      )}
    </form>
  );
}
