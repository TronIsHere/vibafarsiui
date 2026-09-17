import { ArrowLeft } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Badge } from "@/registry/ui/badge";
import { AvatarGroup } from "@/registry/ui/avatar";

export interface HeroBlockProps {
  badge?: string;
  title: React.ReactNode;
  description: string;
  primary?: { label: string; href?: string };
  secondary?: { label: string; href?: string };
  /** Small social proof under the buttons. */
  proof?: { people: { name: string }[]; text: string };
}

/** هیرو. Centered headline block with two actions and optional social proof. */
export function HeroBlock({ badge, title, description, primary = { label: "شروع رایگان" }, secondary = { label: "دیدن نمونه‌ها" }, proof }: HeroBlockProps) {
  return (
    <section className="relative overflow-hidden px-6 py-20 text-center sm:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" style={{ backgroundImage: "linear-gradient(to right, oklch(from var(--foreground) l c h / 6%) 1px, transparent 1px), linear-gradient(to bottom, oklch(from var(--foreground) l c h / 6%) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
      <div className="relative mx-auto max-w-3xl">
        {badge && <Badge variant="brand">{badge}</Badge>}
        <h1 className="mt-5 text-4xl font-bold leading-[1.2] sm:text-5xl">{title}</h1>
        <p className="mx-auto mt-5 max-w-xl text-muted-foreground sm:text-lg">{description}</p>
        <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
          <Button size="lg" className="rounded-full px-6">{primary.label}<ArrowLeft /></Button>
          <Button size="lg" variant="outline" className="rounded-full px-6">{secondary.label}</Button>
        </div>
        {proof && (
          <div className="mt-8 flex items-center justify-center gap-3 text-sm text-muted-foreground">
            <AvatarGroup people={proof.people} max={4} size="sm" />
            <span>{proof.text}</span>
          </div>
        )}
      </div>
    </section>
  );
}
