"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserMenu } from "@/components/auth/user-menu";
import { NavbarAnimation } from "@/components/animations/navbar-animation";
import { CommandPaletteTrigger } from "@/components/search/command-palette-trigger";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/types/auth";

interface NavbarClientProps {
  initialUser: AuthUser | null;
}

export function NavbarClient({ initialUser }: NavbarClientProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <NavbarAnimation scrolled={scrolled}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-brand-foreground"
      >
        Skip to content
      </a>

      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight transition-transform hover:scale-[1.02]"
          onClick={() => setMobileOpen(false)}
        >
          {SITE_NAME}
          <span className="text-brand">.</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-underline rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <CommandPaletteTrigger />
          <ThemeToggle />
          <UserMenu initialUser={initialUser} />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <UserMenu initialUser={initialUser} />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            <span className="sr-only">Menu</span>
            <div className="flex flex-col gap-1.5">
              <span
                className={cn(
                  "block h-0.5 w-5 bg-foreground transition-transform",
                  mobileOpen && "translate-y-2 rotate-45"
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-5 bg-foreground transition-opacity",
                  mobileOpen && "opacity-0"
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-5 bg-foreground transition-transform",
                  mobileOpen && "-translate-y-2 -rotate-45"
                )}
              />
            </div>
          </button>
        </div>
      </Container>

      {mobileOpen && (
        <nav
          id="mobile-menu"
          className="border-t border-border bg-background md:hidden"
          aria-label="Mobile"
        >
          <Container className="flex flex-col py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-3 text-sm font-medium hover:bg-accent"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </Container>
        </nav>
      )}
    </NavbarAnimation>
  );
}
