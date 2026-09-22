"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet } from "@/registry/ui/sheet";
import { navLinks } from "./nav-links";

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
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="inline-flex h-10 cursor-pointer items-center rounded-md px-3 text-sm text-foreground transition-colors duration-200 hover:bg-accent"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </Sheet>
    </>
  );
}
