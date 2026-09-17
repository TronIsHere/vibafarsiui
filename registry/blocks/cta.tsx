import { ArrowLeft } from "lucide-react";
import { Button } from "@/registry/ui/button";

/** فراخوان پایانی. A warm banner with one action; gradient comes from the brand token. */
export function CtaBlock({ title, description, action = "شروع کنید", note }: { title: string; description?: string; action?: string; note?: string }) {
  return (
    <section className="px-6 py-12">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-border bg-card px-6 py-14 text-center sm:px-12">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(60% 80% at 50% 0%, oklch(from var(--brand) l c h / 22%), transparent 70%)" }} />
        <div className="relative">
          <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
          {description && <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{description}</p>}
          <Button size="lg" className="mt-8 rounded-full px-7">{action}<ArrowLeft /></Button>
          {note && <p className="mt-4 text-xs text-muted-foreground">{note}</p>}
        </div>
      </div>
    </section>
  );
}
