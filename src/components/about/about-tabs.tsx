"use client";

import { useState } from "react";
import { ABOUT_TABS } from "@/data/about";
import { cn } from "@/lib/utils";

export function AboutTabs() {
  type TabId = (typeof ABOUT_TABS)[number]["id"];
  const [activeTab, setActiveTab] = useState<TabId>(ABOUT_TABS[0].id);
  const activeContent = ABOUT_TABS.find((tab) => tab.id === activeTab);

  return (
    <div className="space-y-4">
      <div
        role="tablist"
        aria-label="About Readit"
        className="flex flex-col gap-2 sm:flex-row"
      >
        {ABOUT_TABS.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 rounded-lg border px-5 py-3 text-center text-sm font-semibold transition-all duration-250 ease-premium",
                isActive
                  ? "border-brand bg-brand text-brand-foreground shadow-soft"
                  : "border-border bg-card text-foreground hover:border-brand/40 hover:bg-accent"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className="rounded-xl border border-border bg-muted/50 p-6 text-sm leading-relaxed text-muted-foreground"
      >
        {activeContent?.content}
      </div>
    </div>
  );
}
