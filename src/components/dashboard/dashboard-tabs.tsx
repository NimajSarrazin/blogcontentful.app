"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  href: string;
}

interface DashboardTabsProps {
  tabs: Tab[];
  activeTab: string;
}

export function DashboardTabs({ tabs, activeTab }: DashboardTabsProps) {
  return (
    <nav
      className="flex gap-1 overflow-x-auto border-b border-border"
      aria-label="Dashboard sections"
    >
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={tab.href}
          className={cn(
            "whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors",
            activeTab === tab.id
              ? "border-brand text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
          aria-current={activeTab === tab.id ? "page" : undefined}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
