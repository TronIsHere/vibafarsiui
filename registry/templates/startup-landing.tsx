import { ArrowLeft, Check, Shield, Sparkles, Zap } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Badge } from "@/registry/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/ui/card";
import { Accordion } from "@/registry/ui/accordion";
import { Price } from "@/registry/ui/price";

const features = [
  { icon: Zap, t: "سریع راه می‌افتد", d: "در کمتر از ده دقیقه فروشگاه‌تان بالا است؛ بدون کدنویسی." },
  { icon: Shield, t: "پرداخت امن", d: "درگاه‌های بانکی ایران با تأیید دومرحله‌ای و رسید پیامکی." },
  { icon: Sparkles, t: "هوش مصنوعی فارسی", d: "توضیح محصول و پاسخ به مشتری را خودش می‌نویسد." },
];
const plans = [
  { name: "شروع", price: 0, desc: "برای امتحان کردن", items: ["۱۰ محصول", "دامنه‌ی رایگان", "پشتیبانی تلگرامی"] },
  { name: "حرفه‌ای", price: 290_000, desc: "برای کسب‌وکار در حال رشد", items: ["محصول نامحدود", "دامنه‌ی اختصاصی", "گزارش فروش", "پشتیبانی تلفنی"], hot: true },
  { name: "سازمانی", price: 990_000, desc: "برای تیم‌های بزرگ", items: ["چند فروشگاه", "API اختصاصی", "مدیر حساب"] },
];

/** لندینگ استارتاپ — هیرو، ویژگی‌ها، قیمت و پرسش‌های متداول. */
export function StartupLanding() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <span className="text-base font-bold">دکان</span>
        <nav className="hidden gap-6 text-sm text-muted-foreground sm:flex"><a href="#">ویژگی‌ها</a><a href="#">قیمت</a><a href="#">وبلاگ</a></nav>
        <Button size="sm">شروع رایگان</Button>
      </header>

      <section className="mx-auto max-w-3xl px-4 pb-16 pt-20 text-center">
        <Badge variant="brand">نسخه‌ی ۲ منتشر شد</Badge>
        <h1 className="mt-5 text-4xl font-bold leading-[1.2] sm:text-5xl">فروشگاه آنلاین‌تان را امروز باز کنید، نه ماه بعد.</h1>
        <p className="mx-auto mt-5 max-w-xl text-muted-foreground">درگاه بانکی، پست، فاکتور شمسی، و هوش مصنوعی‌ای که به زبان مشتری حرف می‌زند. همه‌اش از روز اول داخل است.</p>
        <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
          <Button size="lg">ساخت فروشگاه رایگان</Button>
          <Button size="lg" variant="ghost">دیدن نمونه‌ها<ArrowLeft /></Button>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl grid-cols-1 gap-4 px-4 py-12 md:grid-cols-3">
        {features.map((f) => (
          <Card key={f.t}>
            <CardHeader>
              <span className="mb-2 flex size-9 items-center justify-center rounded-lg bg-secondary"><f.icon className="size-4" /></span>
              <CardTitle>{f.t}</CardTitle>
              <CardDescription>{f.d}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-center text-2xl font-bold">از رایگان تا سازمانی</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {plans.map((p) => (
            <Card key={p.name} className={p.hot ? "border-foreground/40" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between"><CardTitle>{p.name}</CardTitle>{p.hot && <Badge>محبوب</Badge>}</div>
                <CardDescription>{p.desc}</CardDescription>
                <div className="pt-3"><Price amount={p.price} unit="تومان / ماه" /></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">{p.items.map((it) => <li key={it} className="flex items-center gap-2"><Check className="size-4 text-brand" />{it}</li>)}</ul>
                <Button className="mt-5 w-full" variant={p.hot ? "default" : "outline"}>انتخاب {p.name}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-12">
        <h2 className="mb-6 text-center text-2xl font-bold">پرسش‌های متداول</h2>
        <Accordion
          items={[
            { id: "1", title: "برای شروع به کارت بانکی نیاز دارم؟", content: "خیر. پلن شروع رایگان است و تا وقتی نخواهید ارتقا دهید، چیزی پرداخت نمی‌کنید." },
            { id: "2", title: "درگاه پرداخت چطور وصل می‌شود؟", content: "ترمینال بانک را در تنظیمات وارد می‌کنید؛ حدود پنج دقیقه طول می‌کشد." },
            { id: "3", title: "می‌توانم دامنه‌ی خودم را وصل کنم؟", content: "بله، در پلن حرفه‌ای و بالاتر. راهنمای قدم‌به‌قدم داخل پنل است." },
          ]}
        />
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">© ۱۴۰۵ دکان</footer>
    </div>
  );
}
