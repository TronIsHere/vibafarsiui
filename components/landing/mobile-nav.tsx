"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet } from "@/registry/ui/sheet";
import { navLinks, isGroup, type NavLink } from "./nav-links";

export function LandingMobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="باز کردن منو"
        className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors duration-200 hover:text-foreground lg:hidden"
      >
        <Menu className="size-5" />
      </button>
      <Sheet open={open} onOpenChange={setOpen} title="منو" side="start">
        <nav className="flex flex-col gap-0.5" aria-label="ناوبری اصلی">
          {navLinks.map((l) =>
            isGroup(l) ? (
              <div
                key={l.label}
                className="my-2 flex flex-col gap-0.5 border-y border-border py-2"
              >
                <p className="px-3 pb-1 pt-1 text-xs text-muted-foreground">
                  {l.label}
                </p>
                {l.items.map((item) => (
                  <MobileLink
                    key={item.href}
                    link={item}
                    onNavigate={() => setOpen(false)}
                  />
                ))}
              </div>
            ) : (
              <MobileLink
                key={l.href}
                link={l}
                onNavigate={() => setOpen(false)}
              />
            ),
          )}
        </nav>
      </Sheet>
    </>
  );
}

function MobileLink({
  link,
  onNavigate,
}: {
  link: NavLink;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      className="inline-flex h-10 cursor-pointer items-center rounded-md px-3 text-sm text-foreground transition-colors duration-200 hover:bg-accent"
    >
      {link.label}
    </Link>
  );
}
