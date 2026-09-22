"use client";

import * as React from "react";
import { Bot, Check, Code2, Eye } from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";
import { useTheme } from "@/lib/theme-store";
import type { ThemeDoc } from "@/lib/registry";
import { cn, fa, formatToman } from "@/lib/utils";
import { Button } from "@/registry/ui/button";
import { Badge } from "@/registry/ui/badge";
import { Switch } from "@/registry/ui/switch";
import { Field, Input } from "@/registry/ui/input";
import { Progress } from "@/registry/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/registry/ui/tabs";
import { Alert } from "@/registry/ui/alert";
import { Card } from "@/registry/ui/card";

const SPEC = [
  { key: "type", label: "فونت" },
  { key: "shape", label: "فرم" },
  { key: "depth", label: "عمق" },
  { key: "motion", label: "حرکت" },
  { key: "density", label: "تراکم" },
] as const;

function Sample({ theme }: { theme: ThemeDoc }) {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <h3 className="text-2xl leading-snug">کتاب‌فروشی شهر، سفارش امروز</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          همین کامپوننت‌ها در زبان «{theme.style}». فونت، گوشه، خط، سایه و حس کلیک همه از توکن‌ها می‌آن.
        </p>
      </div>
      <Card className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">سبد خرید</span>
          <Badge variant="brand">۳ کالا</Badge>
        </div>
        <Field label="کد تخفیف" htmlFor="t-code">
          <Input id="t-code" placeholder="مثلاً: NOWRUZ" dir="ltr" />
        </Field>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">جمع</span>
          <span className="font-bold">{formatToman(2_480_000)}</span>
        </div>
        <div className="flex gap-2">
          <Button className="flex-1">پرداخت</Button>
          <Button variant="outline">بعداً</Button>
        </div>
      </Card>
      <Card className="space-y-4 p-4">
        <Tabs defaultValue="a">
          <TabsList aria-label="نمونه">
            <TabsTrigger value="a">همه</TabsTrigger>
            <TabsTrigger value="b">فعال</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center justify-between text-sm">
          <span>اعلان ایمیلی</span>
          <Switch defaultChecked aria-label="اعلان" />
        </div>
        <Progress value={72} label="هدف ماهانه" showValue />
        <Alert variant="success" title="ذخیره شد">
          تنظیمات جدید اعمال شد.
        </Alert>
      </Card>
    </div>
  );
}

export function ThemeDetail({
  theme,
  css,
  codeBlock,
  prompt,
}: {
  theme: ThemeDoc;
  /** Raw CSS, for the copy button and token count. */
  css: string;
  /** `<CodeBlock>` of `css`, rendered by the server parent (it can't be imported here). */
  codeBlock: React.ReactNode;
  prompt: string;
}) {
  const [tab, setTab] = React.useState<"preview" | "code" | "prompt">(
    "preview",
  );
  const { theme: active, setTheme } = useTheme();
  const isActive = active === theme.slug;
  const tabs = [
    { id: "preview", label: "پیش‌نمایش", I: Eye },
    { id: "code", label: "توکن‌ها", I: Code2 },
    { id: "prompt", label: "پرامپت", I: Bot },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-1 space-x-reverse">
            {theme.swatches.map((c, j) => (
              <span
                key={j}
                className="size-7 rounded-full border border-foreground/20"
                style={{ background: c }}
              />
            ))}
          </div>
          <dl className="flex gap-5 text-xs text-muted-foreground">
            <div>
              <dt>زبان طراحی</dt>
              <dd className="text-foreground">{theme.style}</dd>
            </div>
            <div>
              <dt>حالت</dt>
              <dd className="text-foreground">
                {theme.light ? "روشن" : "تیره"}
              </dd>
            </div>
            <div>
              <dt>توکن‌ها</dt>
              <dd className="  text-foreground">
                {fa(css.split("\n").filter((l) => l.includes("--")).length)}
              </dd>
            </div>
          </dl>
        </div>
        <button
          type="button"
          onClick={() => setTheme(theme.slug)}
          aria-pressed={isActive}
          className={cn(
            "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-md border px-3 text-sm font-medium transition-colors",
            isActive
              ? "border-foreground bg-foreground text-background"
              : "border-border hover:bg-accent",
          )}
        >
          {isActive && <Check className="size-4" />}
          {isActive ? "فعال روی کل سایت" : "اعمال روی کل سایت"}
        </button>
        <dl className="grid w-full grid-cols-2 gap-x-6 gap-y-2 border-t border-border pt-3 text-xs sm:grid-cols-5">
          {SPEC.map((row) => (
            <div key={row.key}>
              <dt className="text-muted-foreground">{row.label}</dt>
              <dd className="mt-0.5 leading-5 text-foreground">{theme.language[row.key]}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-2 py-2">
          <div
            role="tablist"
            className="inline-flex rounded-lg bg-background p-0.5 text-sm"
          >
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 transition-colors",
                  tab === t.id
                    ? "bg-secondary font-semibold text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <t.I className="size-3.5" />
                {t.label}
              </button>
            ))}
          </div>
          {tab !== "preview" && (
            <div className="flex items-center gap-1.5">
              <span className="  text-xs text-muted-foreground" dir="ltr">
                {tab === "code" ? theme.file.split("/").pop() : "prompt.md"}
              </span>
              <CopyButton text={tab === "code" ? css : prompt} />
            </div>
          )}
        </div>
        {tab === "preview" && (
          <div
            data-theme={theme.slug}
            data-ds=""
            className="flex min-h-[360px] items-center justify-center bg-background p-6 text-foreground sm:p-10"
          >
            <Sample theme={theme} />
          </div>
        )}
        {tab === "code" && codeBlock}
        {tab === "prompt" && (
          <div className="p-5">
            <pre
              className="whitespace-pre-wrap font-sans text-[15px] leading-7 text-foreground/90"
              dir="ltr"
            >
              {prompt}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
