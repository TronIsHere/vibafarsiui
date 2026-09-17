"use client";

import * as React from "react";
import { Heart, Share2, ShieldCheck, ShoppingCart, Store, Truck } from "lucide-react";
import { Breadcrumb } from "@/registry/ui/breadcrumb";
import { Button } from "@/registry/ui/button";
import { Badge } from "@/registry/ui/badge";
import { Price } from "@/registry/ui/price";
import { Rating } from "@/registry/ui/rating";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/ui/tabs";
import { Sheet } from "@/registry/ui/sheet";
import { Carousel } from "@/registry/ui/carousel";
import { NumberField } from "@/registry/ui/number-field";
import { fa, formatToman } from "@/lib/utils";

const colors = ["مشکی", "نقره‌ای", "آبی نفتی"];
const similar = ["هدفون مدل X۱", "هندزفری بی‌سیم S", "اسپیکر قابل‌حمل", "کیف حمل هدفون"];
const specs: [string, string][] = [["نوع اتصال", "بلوتوث ۵٫۳"], ["مدت شارژ", "۳۰ ساعت"], ["حذف نویز", "فعال (ANC)"], ["وزن", "۲۵۰ گرم"]];

/** فروشگاه — صفحه‌ی محصول به سبک فروشگاه‌های ایرانی: گالری، جعبه‌ی فروشنده، قیمت، سبد کشویی. */
export function StorePage() {
  const [cartOpen, setCartOpen] = React.useState(false);
  const [color, setColor] = React.useState(0);
  const [qty, setQty] = React.useState(1);
  const price = 1_890_000;
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <span className="font-bold">دکان</span>
          <Button variant="outline" size="sm" onClick={() => setCartOpen(true)}><ShoppingCart />سبد ({fa(qty)})</Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Breadcrumb items={[{ label: "خانه", href: "#" }, { label: "صوتی و تصویری", href: "#" }, { label: "هدفون", href: "#" }, { label: "هدفون بی‌سیم مدل X۲" }]} />
        <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* gallery */}
          <div className="lg:col-span-4">
            <div className="flex aspect-square items-center justify-center rounded-2xl border border-border bg-card"><span className="text-8xl">🎧</span></div>
            <div className="mt-3 grid grid-cols-4 gap-2">{[1, 2, 3, 4].map((i) => <span key={i} className={`aspect-square rounded-lg border ${i === 1 ? "border-foreground" : "border-border"} bg-card`} />)}</div>
            <div className="mt-3 flex gap-2"><Button variant="ghost" size="sm"><Heart />علاقه‌مندی</Button><Button variant="ghost" size="sm"><Share2 />اشتراک</Button></div>
          </div>

          {/* info */}
          <div className="space-y-5 lg:col-span-5">
            <div>
              <p className="text-xs text-muted-foreground">Wireless Headphone X2</p>
              <h1 className="mt-1 text-xl font-bold">هدفون بی‌سیم مدل X۲ با حذف نویز فعال</h1>
              <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground"><Rating value={4} readOnly size="sm" /><span>۴٫۲ از ۱٬۲۴۰ نظر</span><span>·</span><span>۳۸ پرسش</span></div>
            </div>
            <div>
              <p className="text-sm font-medium">رنگ: <span className="text-muted-foreground">{colors[color]}</span></p>
              <div className="mt-2 flex gap-2">{colors.map((c, i) => <button key={c} type="button" onClick={() => setColor(i)} className={`cursor-pointer rounded-full border px-3 py-1 text-xs transition-colors ${i === color ? "border-foreground bg-accent" : "border-border"}`}>{c}</button>)}</div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">ویژگی‌ها</p>
              <dl className="grid grid-cols-2 gap-2 text-sm">{specs.map(([k, v]) => <div key={k} className="rounded-lg bg-secondary/60 p-2.5"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>)}</dl>
            </div>
            <Tabs defaultValue="desc" variant="underline">
              <TabsList aria-label="جزئیات"><TabsTrigger value="desc">معرفی</TabsTrigger><TabsTrigger value="specs">مشخصات</TabsTrigger><TabsTrigger value="reviews">نظرات</TabsTrigger></TabsList>
              <TabsContent value="desc" className="text-sm leading-7 text-muted-foreground">هدفون X۲ با حذف نویز فعال و ۳۰ ساعت شارژ برای سفر و کار طراحی شده. اتصال هم‌زمان به دو دستگاه و شارژ سریع ۱۰ دقیقه‌ای برای ۵ ساعت پخش.</TabsContent>
              <TabsContent value="specs" className="text-sm text-muted-foreground">مشخصات کامل در جدول بالا.</TabsContent>
              <TabsContent value="reviews" className="text-sm text-muted-foreground">۱٬۲۴۰ نظر ثبت شده.</TabsContent>
            </Tabs>
          </div>

          {/* seller box */}
          <aside className="h-fit space-y-4 rounded-2xl border border-border bg-card p-5 lg:col-span-3">
            <div className="flex items-center gap-2 text-sm"><Store className="size-4 text-muted-foreground" /><span className="font-medium">فروشگاه صوتی آوا</span><Badge variant="success" className="ms-auto">عملکرد عالی</Badge></div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4" />گارانتی ۱۸ ماهه‌ی شرکتی</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Truck className="size-4" />ارسال امروز · موجود در انبار</div>
            <div className="border-t border-border pt-4"><Price amount={price} original={2_190_000} size="md" /></div>
            <div className="flex items-center justify-between"><span className="text-sm">تعداد</span><NumberField value={qty} min={1} max={5} onChange={setQty} aria-label="تعداد" /></div>
            <Button className="w-full" onClick={() => setCartOpen(true)}><ShoppingCart />افزودن به سبد</Button>
            <p className="text-center text-[11px] text-muted-foreground">۷ روز ضمانت بازگشت · پرداخت در محل</p>
          </aside>
        </div>

        <section className="mt-12">
          <h2 className="mb-4 text-lg font-bold">کالاهای مشابه</h2>
          <Carousel slideWidth={0.5} showDots={false}>
            {similar.map((s) => (
              <div key={s} className="rounded-xl border border-border bg-card p-4"><div className="flex h-28 items-center justify-center rounded-lg bg-secondary text-3xl">🎧</div><p className="mt-3 text-sm font-medium">{s}</p><p className="text-xs text-muted-foreground">{formatToman(890_000)}</p></div>
            ))}
          </Carousel>
        </section>
      </main>

      <Sheet open={cartOpen} onOpenChange={setCartOpen} title={`سبد خرید (${fa(qty)})`}>
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 rounded-lg border border-border p-3"><span className="text-3xl">🎧</span><div className="flex-1 text-sm"><p className="font-medium">هدفون بی‌سیم مدل X۲</p><p className="text-xs text-muted-foreground">{colors[color]} · {fa(qty)} عدد</p></div><span className="text-sm font-semibold">{formatToman(price * qty)}</span></div>
          <div className="mt-auto space-y-3 pt-6"><div className="flex justify-between text-sm"><span className="text-muted-foreground">جمع</span><span className="font-bold">{formatToman(price * qty)}</span></div><Button className="w-full">ادامه‌ی خرید</Button></div>
        </div>
      </Sheet>
    </div>
  );
}
