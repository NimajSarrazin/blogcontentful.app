import { Skeleton } from "@/components/ui/skeleton";

export function CommentSkeleton() {
  return (
    <div className="flex gap-3" aria-hidden="true">
      <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

export function CommentsSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <CommentSkeleton key={i} />
      ))}
    </div>
  );
}
