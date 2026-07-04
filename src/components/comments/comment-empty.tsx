import { MessageSquare } from "lucide-react";

export function CommentEmpty() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
      <MessageSquare className="mb-3 h-10 w-10 text-muted-foreground/50" />
      <p className="text-sm font-medium">No comments yet</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Be the first to share your thoughts on this article.
      </p>
    </div>
  );
}
