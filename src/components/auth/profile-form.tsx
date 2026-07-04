"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/app/auth/actions";
import type { AuthActionState, AuthUser } from "@/types/auth";

const initialState: AuthActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save changes"}
    </Button>
  );
}

export function ProfileForm({ user }: { user: AuthUser }) {
  const [state, formAction] = useActionState(updateProfile, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-soft">
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          minLength={2}
          defaultValue={user.profile?.username ?? ""}
          className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="avatar_url" className="text-sm font-medium">
          Avatar URL
        </label>
        <input
          id="avatar_url"
          name="avatar_url"
          type="url"
          defaultValue={user.profile?.avatarUrl ?? ""}
          placeholder="https://example.com/avatar.jpg"
          className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
        />
      </div>

      <div className="space-y-1 text-sm text-muted-foreground">
        <p>Email: {user.email}</p>
        <p className="capitalize">Role: {user.profile?.role ?? "user"}</p>
      </div>

      {state.error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {state.error}
        </p>
      )}

      {state.success && (
        <p className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
          {state.success}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
