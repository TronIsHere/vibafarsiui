import { ShoppingCart } from "lucide-react";
import { Badge } from "@/registry/ui/badge";
import { Button } from "@/registry/ui/button";
import { Price } from "@/registry/ui/price";
import { Rating } from "@/registry/ui/rating";
import { fa } from "@/lib/utils";

export interface Product {
  id: string;
  name: string;
  price: number;
  /** Original price before discount; the percent is computed. */
  original?: number;
  rating?: number;
  reviews?: number;
  badge?: string;
  image?: React.ReactNode;
  outOfStock?: boolean;
}

/** شبکه‌ی محصول. Four-up product cards with a toman price, discount and an add-to-cart row. */
export function ProductGrid({ title, products, onAdd }: { title?: string; products: Product[]; onAdd?: (p: Product) => void }) {
  return (
    <section className="px-6 py-16">
      {title && <div className="mx-auto mb-8 flex max-w-6xl items-center justify-between"><h2 className="text-2xl font-bold">{title}</h2><a href="#" className="text-sm text-muted-foreground hover:text-foreground">دیدن همه</a></div>}
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-4">
        {products.map((p) => (
          <li key={p.id} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
            <div className="relative aspect-square bg-secondary">
              {p.image ?? <div aria-hidden className="size-full" style={{ background: "radial-gradient(70% 70% at 50% 40%, oklch(from var(--foreground) l c h / 10%), transparent 70%)" }} />}
              {p.badge && <Badge variant="brand" className="absolute end-3 top-3 rounded-full bg-card px-2">{p.badge}</Badge>}
              {p.outOfStock && <div className="absolute inset-0 flex items-center justify-center bg-background/70 text-sm font-medium">ناموجود</div>}
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="line-clamp-2 text-sm font-medium leading-6">{p.name}</h3>
              {p.rating !== undefined && (
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Rating value={p.rating} readOnly size="sm" />
                  {p.reviews !== undefined && <span>({fa(p.reviews)})</span>}
                </div>
              )}
              <div className="mt-auto flex items-end justify-between gap-2 pt-4">
                <Price amount={p.price} original={p.original} size="sm" />
                <Button size="icon" variant="outline" aria-label={`افزودن ${p.name} به سبد`} disabled={p.outOfStock} onClick={() => onAdd?.(p)}><ShoppingCart /></Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
