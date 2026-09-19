"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { Sheet } from "@/registry/ui/sheet";
import { DocsSidebar } from "./sidebar";

export function DocsMobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className="sticky top-14 z-30 border-b border-border bg-background/80 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex h-11 max-w-7xl items-center px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
            className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md px-2 text-[13px] text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            <Menu className="size-4" />
            فهرست
          </button>
        </div>
      </div>
      <Sheet open={open} onOpenChange={setOpen} title="مستندات" side="start">
        <DocsSidebar onNavigate={() => setOpen(false)} />
      </Sheet>
    </>
  );
}
