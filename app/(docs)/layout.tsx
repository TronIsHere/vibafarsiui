import { TopBar } from "@/components/landing/top-bar";
import { DocsMobileNav } from "@/components/docs/mobile-nav";
import { DocsSidebar } from "@/components/docs/sidebar";

export default function DocsLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <TopBar />
      <DocsMobileNav />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-10 px-4 sm:px-6">
        <aside className="hidden w-60 shrink-0 border-e border-border py-8 pe-4 lg:block">
          <div className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto pe-2 [scrollbar-width:thin]">
            <DocsSidebar />
          </div>
        </aside>
        <main className="min-w-0 flex-1 py-8 pb-24">{children}</main>
      </div>
    </div>
  );
}
