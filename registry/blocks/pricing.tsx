"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Badge } from "@/registry/ui/badge";
import { Price } from "@/registry/ui/price";
import { Tabs, TabsList, TabsTrigger } from "@/registry/ui/tabs";
import { cn } from "@/lib/utils";

export interface Plan { name: string; monthly: number; description: string; features: string[]; cta?: string; highlighted?: boolean }

/** ردیف قیمت. Monthly/yearly toggle (two months free), toman prices, one highlighted plan. */
export function PricingBlock({ title = "قیمتی ساده، بدون غافلگیری", plans }: { title?: string; plans: Plan[] }) {
  const [period, setPeriod] = React.useState("monthly");
  const yearly = period === "yearly";
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold">{title}</h2>
          <Tabs defaultValue="monthly" onValueChange={setPeriod} className="mt-5 inline-block">
            <TabsList aria-label="دوره‌ی پرداخت">
              <TabsTrigger value="monthly">ماهانه</TabsTrigger>
              <TabsTrigger value="yearly">سالانه <span className="ms-1 text-xs text-brand">دو ماه رایگان</span></TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {plans.map((p) => (
            <div key={p.name} className={cn("flex flex-col rounded-2xl border bg-card p-6", p.highlighted ? "border-foreground/40 shadow-[0_0_0_1px_var(--foreground)_inset]" : "border-border")}>
              <div className="flex items-center justify-between"><h3 className="font-semibold">{p.name}</h3>{p.highlighted && <Badge>پیشنهادی</Badge>}</div>
              <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
              <div className="mt-5"><Price amount={yearly ? p.monthly * 10 : p.monthly} unit={yearly ? "تومان / سال" : "تومان / ماه"} /></div>
              <ul className="mt-5 space-y-2 text-sm">{p.features.map((f) => <li key={f} className="flex items-center gap-2"><Check className="size-4 text-brand" />{f}</li>)}</ul>
              <Button className="mt-6 w-full" variant={p.highlighted ? "default" : "outline"}>{p.cta ?? `انتخاب ${p.name}`}</Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
