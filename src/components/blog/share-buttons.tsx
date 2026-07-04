"use client";

import { Check, Link2, Share2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { absoluteUrl } from "@/lib/utils";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const url = absoluteUrl(`/post/${slug}`);

  const shareLinks = [
    {
      label: "Twitter",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
  ];

  const copyUrl = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Share2 className="h-4 w-4" />
        Share
      </div>

      <div className="flex flex-wrap gap-2">
        {shareLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-border px-3 py-2 text-sm transition-colors hover:bg-accent"
          >
            {link.label}
          </a>
        ))}
        <Button variant="outline" size="sm" onClick={copyUrl}>
          {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
          {copied ? "Copied" : "Copy link"}
        </Button>
      </div>
    </div>
  );
}
