import { cn } from "@/lib/utils";

export interface Logo { name: string; /** Optional mark; falls back to the name in a bold wordmark. */ node?: React.ReactNode }

/** لوگوی مشتریان. A quiet row of customer marks that colour up on hover. */
export function LogoCloud({ title = "به ما اعتماد کرده‌اند", logos, className }: { title?: string; logos: Logo[]; className?: string }) {
  return (
    <section className={cn("px-6 py-12", className)}>
      <p className="text-center text-sm text-muted-foreground">{title}</p>
      <ul className="mx-auto mt-6 flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-6">
        {logos.map((l) => (
          <li key={l.name} className="text-muted-foreground/60 transition-colors hover:text-foreground" title={l.name}>
            {l.node ?? <span className="text-lg font-black tracking-tight">{l.name}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}
