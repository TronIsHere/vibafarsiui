"use client";

import * as React from "react";
import { Bath, BedDouble, MapPin, Maximize2, ParkingCircle } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Badge } from "@/registry/ui/badge";
import { Checkbox } from "@/registry/ui/checkbox";
import { Combobox } from "@/registry/ui/combobox";
import { Field } from "@/registry/ui/input";
import { SearchInput } from "@/registry/ui/search-input";
import { SegmentedControl } from "@/registry/ui/segmented-control";
import { Slider } from "@/registry/ui/slider";
import { cn, fa, formatToman } from "@/lib/utils";

type Listing = {
  id: string;
  title: string;
  area: string;
  city: string;
  price: number;
  meters: number;
  rooms: number;
  baths: number;
  parking: boolean;
  kind: "sale" | "rent";
  tag?: string;
};

const cities = ["تهران", "کرج", "اصفهان", "شیراز", "مشهد", "تبریز"];
const listings: Listing[] = [
  { id: "1", title: "آپارتمان نوساز دو خواب", area: "سعادت‌آباد", city: "تهران", price: 18_500_000_000, meters: 105, rooms: 2, baths: 1, parking: true, kind: "sale", tag: "بازدید امروز" },
  { id: "2", title: "پنت‌هاوس با تراس جنوبی", area: "فرمانیه", city: "تهران", price: 42_000_000_000, meters: 210, rooms: 3, baths: 2, parking: true, kind: "sale" },
  { id: "3", title: "واحد اداری طبقه همکف", area: "جردن", city: "تهران", price: 85_000_000, meters: 68, rooms: 1, baths: 1, parking: false, kind: "rent", tag: "فوری" },
  { id: "4", title: "ویلای دوبلکس باغ‌دار", area: "مهرشهر", city: "کرج", price: 28_900_000_000, meters: 320, rooms: 4, baths: 3, parking: true, kind: "sale" },
  { id: "5", title: "استودیو مبله نزدیک مترو", area: "ونک", city: "تهران", price: 45_000_000, meters: 42, rooms: 1, baths: 1, parking: false, kind: "rent" },
  { id: "6", title: "آپارتمان نوساز سه خواب", area: "بلوار کشاورز", city: "شیراز", price: 9_800_000_000, meters: 135, rooms: 3, baths: 2, parking: true, kind: "sale" },
];

/** املاک: جست‌وجو و فیلتر خرید/اجاره، سقف قیمت تومانی، کارت‌های ملک با متراژ و امکانات. */
export function RealEstatePage() {
  const [mode, setMode] = React.useState<"sale" | "rent">("sale");
  const [city, setCity] = React.useState("تهران");
  const [q, setQ] = React.useState("");
  const [maxPrice, setMaxPrice] = React.useState(50_000_000_000);
  const [parkingOnly, setParkingOnly] = React.useState(false);

  const list = listings.filter((l) => {
    if (l.kind !== mode) return false;
    if (l.city !== city) return false;
    if (l.price > maxPrice) return false;
    if (parkingOnly && !l.parking) return false;
    if (q && !`${l.title}${l.area}`.includes(q)) return false;
    return true;
  });

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border bg-card/50">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-5">
          <div className="me-auto">
            <p className="text-lg font-bold">خانه یاب</p>
            <p className="text-xs text-muted-foreground">آگهی‌های تأییدشده با بازدید حضوری</p>
          </div>
          <SegmentedControl
            aria-label="نوع آگهی"
            value={mode}
            onChange={(v) => setMode(v as "sale" | "rent")}
            options={[
              { value: "sale", label: "خرید" },
              { value: "rent", label: "اجاره" },
            ]}
          />
          <Button size="sm">ثبت آگهی رایگان</Button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-4">
        <aside className="space-y-4 lg:col-span-1">
          <div className="rounded-2xl border border-border bg-card p-4 space-y-4">
            <Field label="شهر">
              <Combobox options={cities} value={city} onChange={setCity} placeholder="انتخاب شهر" className="w-full" />
            </Field>
            <SearchInput value={q} onChange={setQ} placeholder="محله یا عنوان…" />
            <Slider
              label={mode === "sale" ? "حداکثر قیمت خرید" : "حداکثر اجاره ماهانه"}
              min={mode === "sale" ? 5_000_000_000 : 20_000_000}
              max={mode === "sale" ? 50_000_000_000 : 120_000_000}
              step={mode === "sale" ? 500_000_000 : 5_000_000}
              value={maxPrice}
              onChange={setMaxPrice}
              format={formatToman}
            />
            <Checkbox label="فقط با پارکینگ" checked={parkingOnly} onCheckedChange={setParkingOnly} />
          </div>
        </aside>

        <section className="lg:col-span-3">
          <p className="mb-3 text-sm text-muted-foreground">{fa(list.length)} آگهی در {city}</p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {list.map((l) => (
              <li key={l.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                <div
                  className="aspect-16/10 bg-secondary"
                  style={{ backgroundImage: "radial-gradient(80% 80% at 20% 0%, oklch(from var(--brand) l c h / 18%), transparent 70%)" }}
                />
                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="font-semibold leading-6">{l.title}</h2>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3" />
                        {l.area}، {l.city}
                      </p>
                    </div>
                    {l.tag && <Badge variant="brand">{l.tag}</Badge>}
                  </div>
                  <p className="text-base font-bold tabular-nums">
                    {formatToman(l.price)}
                    {l.kind === "rent" && <span className="ms-1 text-xs font-normal text-muted-foreground">/ ماه</span>}
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Maximize2 className="size-3.5" />{fa(l.meters)} متر</span>
                    <span className="inline-flex items-center gap-1"><BedDouble className="size-3.5" />{fa(l.rooms)} خواب</span>
                    <span className="inline-flex items-center gap-1"><Bath className="size-3.5" />{fa(l.baths)} سرویس</span>
                    <span className={cn("inline-flex items-center gap-1", !l.parking && "opacity-40")}>
                      <ParkingCircle className="size-3.5" />
                      {l.parking ? "پارکینگ" : "بدون پارکینگ"}
                    </span>
                  </div>
                  <Button variant="outline" className="w-full" size="sm">درخواست بازدید</Button>
                </div>
              </li>
            ))}
          </ul>
          {list.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              با این فیلترها آگهی‌ای پیدا نشد. سقف قیمت را بالاتر ببرید.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
