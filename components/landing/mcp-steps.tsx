import { Check } from "lucide-react";
import { Badge } from "@/registry/ui/badge";
import { CodeBlock } from "@/components/shared/code-block";
import { Section } from "./frame";

const CONFIG = `
{
  "mcpServers": {
    "vibefarsi": {
      "command": "npx",
      "args": ["-y", "@vibefarsi/mcp"]
    }
  }
}
`;

const TOOLS = [
  { id: "get_design_rules", d: "قوانین راست‌چین، فونت، ارقام و توکن" },
  { id: "search_registry", d: "جست‌وجو در قطعه‌ها؛ فارسی یا انگلیسی" },
  { id: "get_component", d: "کد و پرامپت همان قطعه" },
  { id: "get_theme", d: "توکن‌های رنگ و شعاع گوشه" },
  { id: "scaffold_page", d: "از توضیح صفحه، یک ترکیب آماده" },
] as const;

export function McpSteps() {
  return (
    <Section id="mcp">
      <div className="px-5 py-14 text-center sm:px-8 sm:py-20">
        <Badge variant="outline" className="text-[11px] text-muted-foreground">
          MCP
        </Badge>
        <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-bold sm:text-[2.6rem] sm:leading-[1.2]">
          پرامپت را بدهید؛ <span className="text-brand">قطعه‌ی فارسی</span> ساخته می‌شود.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
          ابزارهای هوش مصنوعی به انگلیسی فکر می‌کنند: فونت Inter می‌گذارند،
          ارقام را لاتین می‌نویسند و دکمه را چپ‌چین می‌کنند. سرور MCP وایب‌فارسی
          قوانین طراحی فارسی و کد قطعه‌ها را مستقیم به Cursor، Claude Code و
          Windsurf می‌دهد.
        </p>
      </div>

      <ul className="grid grid-cols-1 border-t border-border sm:grid-cols-2 lg:grid-cols-5">
        {TOOLS.map((t, i) => (
          <li
            key={t.id}
            className={[
              "px-4 py-4 text-start",
              i < TOOLS.length - 1 ? "border-b border-border sm:border-b lg:border-b-0 lg:border-e" : "",
              i % 2 === 0 ? "sm:border-e" : "sm:border-e-0",
              i < TOOLS.length - 2 ? "sm:border-b lg:border-b-0" : "",
            ].join(" ")}
          >
            <code className="font-mono text-[11px] text-foreground" dir="ltr">{t.id}</code>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{t.d}</p>
          </li>
        ))}
      </ul>

      <ol className="grid grid-cols-1 border-t border-border lg:grid-cols-3">
        <li className="flex flex-col border-b border-border lg:border-b-0 lg:border-e">
          <StepHead
            n="۱"
            t="سرور را اضافه کنید"
            d="یک‌بار در تنظیمات ادیتور؛ بعد دیگر کاری نیست."
          />
          <div className="m-4 mt-0 overflow-hidden rounded-lg border border-border bg-background">
            <CodeBlock code={CONFIG} lang="json" className="p-4 text-[12px]" />
          </div>
        </li>
        <li className="flex flex-col border-b border-border lg:border-b-0 lg:border-e">
          <StepHead
            n="۲"
            t="مثل همیشه پرامپت بدهید"
            d="لازم نیست چیزی درباره‌ی فارسی یادآوری کنید."
          />
          <div className="m-4 mt-0 flex-1 rounded-lg border border-border bg-background p-4 text-sm">
            <p className="rounded-lg bg-secondary px-3 py-2 leading-7">
              یک صفحه‌ی پرداخت با خلاصه‌ی سبد و فرم آدرس بساز.
            </p>
            <p className="mt-3 font-mono text-[11px] leading-6 text-muted-foreground" dir="ltr">
              → get_design_rules()
              <br />→ scaffold_page(&quot;صفحه‌ی پرداخت&quot;)
              <br />→ get_component(&quot;input&quot;, &quot;price&quot;, &quot;button&quot;)
            </p>
          </div>
        </li>
        <li className="flex flex-col">
          <StepHead
            n="۳"
            t="خروجی فارسی درست بگیرید"
            d="همان بار اول؛ بدون رفت‌وبرگشت برای راست‌چین و ارقام."
          />
          <ul className="m-4 mt-0 flex-1 space-y-2 rounded-lg border border-border bg-background p-4 text-sm">
            {[
              "فونت پروژه، بدون letter-spacing",
              "چیدمان راست‌چین، آیکون سمت راست",
              "مبلغ‌ها با ارقام فارسی و تومان",
              "فیلد موبایل چپ‌چین و ۱۱ رقمی",
              "توکن‌های تم پروژه، نه رنگ دلخواه مدل",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2 text-foreground/85">
                <Check className="size-3.5 shrink-0 text-brand" />
                {t}
              </li>
            ))}
          </ul>
        </li>
      </ol>
    </Section>
  );
}

function StepHead({ n, t, d }: { n: string; t: string; d: string }) {
  return (
    <div className="flex items-start gap-3 p-4 sm:p-5">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border text-xs">
        {n}
      </span>
      <div>
        <h3 className="text-[15px] font-semibold">{t}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{d}</p>
      </div>
    </div>
  );
}
