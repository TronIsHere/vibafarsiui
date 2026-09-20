import { Check, Minus } from "lucide-react";
import { Badge } from "@/registry/ui/badge";
import { Button } from "@/registry/ui/button";
import { cn } from "@/lib/utils";

export interface ComparePlan { name: string; price: string; highlighted?: boolean }
/** A row: the feature name and one value per plan (true = check, false = dash, string = text). */
export interface CompareRow { feature: string; values: (boolean | string)[] }

/** جدول مقایسه. Features down the right, plans across the top, checks and dashes in the cells. */
export function ComparisonTable({ title = "مقایسه‌ی پلن‌ها", plans, rows }: { title?: string; plans: ComparePlan[]; rows: CompareRow[] }) {
  return (
    <section className="px-6 py-16">
      <h2 className="mb-8 text-center text-3xl font-bold">{title}</h2>
      <div className="mx-auto max-w-5xl overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="p-4 text-start font-medium text-muted-foreground">امکانات</th>
              {plans.map((p) => (
                <th key={p.name} scope="col" className={cn("p-4 text-center", p.highlighted && "bg-secondary/60")}>
                  <div className="flex items-center justify-center gap-2 font-semibold">{p.name}{p.highlighted && <Badge variant="brand">پیشنهادی</Badge>}</div>
                  <p className="mt-1 text-xs font-normal text-muted-foreground">{p.price}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.feature} className="border-b border-border last:border-0">
                <th scope="row" className="p-4 text-start font-normal">{r.feature}</th>
                {r.values.map((v, i) => (
                  <td key={i} className={cn("p-4 text-center", plans[i]?.highlighted && "bg-secondary/60")}>
                    {v === true ? <Check aria-label="دارد" className="mx-auto size-4 text-success" /> : v === false ? <Minus aria-label="ندارد" className="mx-auto size-4 text-muted-foreground/50" /> : <span className="tabular-nums">{v}</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="p-4" />
              {plans.map((p) => (
                <td key={p.name} className={cn("p-4 text-center", p.highlighted && "bg-secondary/60")}>
                  <Button size="sm" variant={p.highlighted ? "default" : "outline"}>انتخاب {p.name}</Button>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
