"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, History, Trash2 } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { Container } from "@/components/ui/container";
import { useReadingHistory } from "@/hooks/use-reading-history";
import { formatDate } from "@/lib/utils";

export function ReadingHistorySection() {
  const { history, ready, clearHistory } = useReadingHistory();

  if (!ready || history.length === 0) return null;

  return (
    <section className="border-t border-border bg-muted/20 py-16">
      <Container>
        <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-medium text-brand">
              <History className="h-4 w-4" />
              Continue reading
            </p>
            <h2 className="font-display text-2xl font-bold tracking-tight">
              Recently read
            </h2>
          </div>
          <button
            type="button"
            onClick={clearHistory}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <Trash2 className="h-4 w-4" />
            Clear history
          </button>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {history.slice(0, 3).map((entry) => (
            <Link
              key={entry.slug}
              href={`/post/${entry.slug}`}
              className="group flex gap-4 rounded-xl border border-border bg-card p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
            >
              <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={entry.coverImageUrl}
                  alt={entry.title}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <h3 className="line-clamp-2 font-medium group-hover:text-brand">
                  {entry.title}
                </h3>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  Read {formatDate(entry.readAt, "MMM d")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
