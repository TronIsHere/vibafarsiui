"use client";

import * as React from "react";
import { MapPin, Navigation } from "lucide-react";
import { AmountInput } from "@/registry/ui/amount-input";
import { Badge } from "@/registry/ui/badge";
import { Button } from "@/registry/ui/button";
import { Combobox } from "@/registry/ui/combobox";
import { Field } from "@/registry/ui/input";
import { PhoneInput } from "@/registry/ui/phone-input";
import { PlateInput } from "@/registry/ui/plate-input";
import { RadioGroup } from "@/registry/ui/radio-group";
import { SegmentedControl } from "@/registry/ui/segmented-control";
import { cn, fa, formatToman } from "@/lib/utils";
import type { PlateValue } from "@/lib/persian";

const places = [
  "میدان آزادی",
  "ایستگاه مترو تجریش",
  "فرودگاه امام خمینی",
  "پایانه جنوب",
  "برج میلاد",
  "بازار بزرگ",
  "دانشگاه تهران",
];

const vehicles = [
  { value: "eco", label: "اقتصادی", description: "۴ نفر · حدود ۱۲ دقیقه", price: 185_000 },
  { value: "plus", label: "پلاس", description: "خودروی تمیزتر · حدود ۱۰ دقیقه", price: 245_000 },
  { value: "van", label: "ون", description: "تا ۶ نفر · مناسب فرودگاه", price: 390_000 },
];

/** درخواست تاکسی: مبدأ و مقصد، نوع خودرو، برآورد کرایه، پلاک راننده و تماس. */
export function RidePage() {
  const [step, setStep] = React.useState<"request" | "matched">("request");
  const [from, setFrom] = React.useState("میدان آزادی");
  const [to, setTo] = React.useState("فرودگاه امام خمینی");
  const [vehicle, setVehicle] = React.useState("eco");
  const [tip, setTip] = React.useState<number | null>(null);
  const [plate, setPlate] = React.useState<PlateValue>({ left: "12", letter: "ت", middle: "345", region: "11" });
  const chosen = vehicles.find((v) => v.value === vehicle)!;
  const total = chosen.price + (tip ?? 0);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="relative min-h-[42vh] border-b border-border bg-secondary/40" style={{ backgroundImage: "linear-gradient(to bottom, oklch(from var(--brand) l c h / 12%), transparent), radial-gradient(circle at 30% 40%, oklch(from var(--foreground) l c h / 8%) 1px, transparent 1px)", backgroundSize: "auto, 24px 24px" }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative h-48 w-[min(100%,20rem)]">
            <span className="absolute inset-e-6 top-4 flex size-10 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-lg"><MapPin className="size-5" /></span>
            <span className="absolute inset-s-4 bottom-8 flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"><Navigation className="size-5" /></span>
            <svg className="absolute inset-0 size-full text-brand" viewBox="0 0 200 180" fill="none" aria-hidden>
              <path d="M150 30 C 120 60, 90 70, 50 140" stroke="currentColor" strokeWidth="3" strokeDasharray="6 6" opacity="0.7" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <p className="rounded-full bg-background/90 px-3 py-1.5 text-sm font-bold backdrop-blur">راهی</p>
          <Badge variant="success">آنلاین</Badge>
        </div>
      </div>

      <main className="relative z-10 mx-auto -mt-8 max-w-lg px-4 pb-10">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_24px_60px_-30px_oklch(0_0_0/50%)]">
          {step === "request" ? (
            <div className="space-y-5">
              <div>
                <h1 className="text-lg font-bold">کجا می‌روید؟</h1>
                <p className="mt-1 text-sm text-muted-foreground">مسیر و نوع خودرو را انتخاب کنید؛ کرایه قبل از درخواست مشخص است.</p>
              </div>
              <Field label="مبدأ"><Combobox options={places} value={from} onChange={setFrom} className="w-full" /></Field>
              <Field label="مقصد"><Combobox options={places} value={to} onChange={setTo} className="w-full" /></Field>
              <div>
                <p className="mb-2 text-sm font-medium">نوع خودرو</p>
                <RadioGroup variant="cards" value={vehicle} onChange={setVehicle} options={vehicles} />
              </div>
              <Field label="انعام (اختیاری)">
                <AmountInput value={tip} onChange={setTip} quick={[10_000, 20_000, 50_000]} words={false} placeholder="۰" />
              </Field>
              <div className="flex items-center justify-between rounded-xl bg-secondary/60 px-4 py-3 text-sm">
                <span className="text-muted-foreground">برآورد کرایه</span>
                <span className="font-bold tabular-nums">{formatToman(total)}</span>
              </div>
              <Button className="w-full" size="lg" onClick={() => setStep("matched")}>درخواست {chosen.label}</Button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge variant="brand" className="mb-2">راننده در مسیر</Badge>
                  <h1 className="text-lg font-bold">رضا کاظمی</h1>
                  <p className="text-sm text-muted-foreground">پژو ۲۰۷ سفید · امتیاز ۴٫۹</p>
                </div>
                <SegmentedControl
                  size="sm"
                  aria-label="وضعیت سفر"
                  defaultValue="coming"
                  options={[
                    { value: "coming", label: "در راه" },
                    { value: "here", label: "رسید" },
                  ]}
                />
              </div>

              <div className="rounded-xl border border-border bg-background p-4">
                <p className="mb-2 text-xs text-muted-foreground">پلاک خودرو</p>
                <PlateInput value={plate} onChange={(v) => setPlate(v)} letters={["ب", "ج", "د", "س", "ص", "ط", "ق", "ل", "م", "ن", "و", "ه", "ی", "ت"]} />
              </div>

              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">مبدأ</dt><dd>{from}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">مقصد</dt><dd>{to}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">زمان رسیدن</dt><dd>حدود {fa(4)} دقیقه</dd></div>
                <div className="flex justify-between border-t border-border pt-2 font-bold"><dt>قابل پرداخت</dt><dd className="tabular-nums">{formatToman(total)}</dd></div>
              </dl>

              <div className="space-y-1.5"><span className="text-sm font-medium">تماس با راننده</span><PhoneInput /></div>

              <div className="flex gap-2">
                <Button className="flex-1" variant="outline" onClick={() => setStep("request")}>لغو سفر</Button>
                <Button className="flex-1">اشتراک‌گذاری مسیر</Button>
              </div>
              <p className={cn("text-center text-xs text-muted-foreground")}>تا {fa(2)} دقیقه بعد از درخواست، لغو رایگان است.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
