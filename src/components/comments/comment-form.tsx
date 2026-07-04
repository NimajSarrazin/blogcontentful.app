"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { createComment } from "@/app/comments/actions";
import { Button } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/lib/supabase/routes";
import { MAX_COMMENT_LENGTH } from "@/lib/constants";
import type { CommentActionState, CommentAuthor } from "@/types/comment";

const initialState: CommentActionState = {};

interface CommentFormProps {
  postSlug: string;
  parentId?: string | null;
  currentUserId: string | null;
  author?: CommentAuthor;
  placeholder?: string;
  onSuccess?: (content: string) => void;
  onCancel?: () => void;
  autoFocus?: boolean;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "Posting..." : label}
    </Button>
  );
}

export function CommentForm({
  postSlug,
  parentId = null,
  currentUserId,
  author,
  placeholder = "Share your thoughts...",
  onSuccess,
  onCancel,
  autoFocus = false,
}: CommentFormProps) {
  const [state, formAction] = useFormState(createComment, initialState);
  const [content, setContent] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const prevSuccess = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (state.success && state.success !== prevSuccess.current) {
      prevSuccess.current = state.success;
      const submittedContent = content;
      setContent("");
      onSuccess?.(submittedContent);
    }
  }, [state.success, content, onSuccess]);

  if (!currentUserId) {
    return (
      <div className="rounded-xl border border-border bg-muted/30 p-4 text-center text-sm">
        <Link href={`${AUTH_ROUTES.login}?next=/post/${postSlug}`} className="font-medium text-brand hover:underline">
          Sign in
        </Link>{" "}
        to join the conversation.
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <input type="hidden" name="postSlug" value={postSlug} />
      {parentId && <input type="hidden" name="parentId" value={parentId} />}

      <textarea
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        required
        autoFocus={autoFocus}
        maxLength={MAX_COMMENT_LENGTH}
        rows={parentId ? 3 : 4}
        className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {content.length}/{MAX_COMMENT_LENGTH}
        </span>
        <div className="flex gap-2">
          {onCancel && (
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <SubmitButton label={parentId ? "Reply" : "Post comment"} />
        </div>
      </div>

      {state.error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {state.error}
        </p>
      )}
    </form>
  );
}
