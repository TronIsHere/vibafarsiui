import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, FileCode2, Terminal } from "lucide-react";
import { CodeBlock } from "@/components/shared/code-block";
import { CopyButton } from "@/components/shared/copy-button";
import { DocSection, Notes } from "@/components/docs/blocks";
import { readSource } from "@/lib/source";
import { sections } from "@/lib/registry";
import { cn, fa } from "@/lib/utils";

export const metadata: Metadata = {
  title: "شروع سریع · وایب‌فارسی",
  description: "نصب وایب‌فارسی در پروژه‌ی Next.js یا React با Tailwind؛ خودکار با CLI، یا دستی با کپی فایل‌ها.",
};

const CLI_INIT = "npx vibefarsi init";
const CLI_ADD = "npx vibefarsi add button calendar price";
const CLI_LIST = "npx vibefarsi list";

const LAYOUT = `// app/layout.tsx
import { Vazirmatn } from "next/font/google"
import "./globals.css"

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
})

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="bg-background text-foreground font-sans">{children}</body>
    </html>
  )
}`;

const GOOGLE_FONT = `@import url("https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap");`;

// Same block the CLI writes on init (packages/cli/src/css.ts), so the manual path lands on identical output.
const TAILWIND_MAP = `/* app/globals.css */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-brand: var(--brand);
  --color-brand-foreground: var(--brand-foreground);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --font-sans: var(--font-vazirmatn), "Vazirmatn", ui-sans-serif, system-ui, sans-serif;
}

@layer base {
  body {
    font-size: 16.5px;
    line-height: 1.8;
    letter-spacing: 0;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }
}`;

const MCP = `{
  "mcpServers": {
    "vibefarsi": {
      "command": "npx",
      "args": ["-y", "@vibefarsi/mcp"]
    }
  }
}`;

const INIT_WRITES: React.ReactNode[] = [
  <>
    <Inline>lang=&quot;fa&quot; dir=&quot;rtl&quot;</Inline> روی <Inline>&lt;html&gt;</Inline>؛ در Next.js داخل{" "}
    <Inline>app/layout.tsx</Inline> و در Vite داخل <Inline>index.html</Inline>
  </>,
  <>
    فونت Vazirmatn: در Next.js فایل <Inline>app/fonts.ts</Inline> و کلاس آن روی html؛ در بقیه‌ی پروژه‌ها import از
    Google Fonts داخل CSS
  </>,
  <>
    توکن‌های تم گرافیت و نگاشت Tailwind در <Inline>globals.css</Inline>
  </>,
  <>
    <Inline>lib/utils.ts</Inline> و <Inline>lib/jalali.ts</Inline> از رجیستری
  </>,
  <>
    <Inline>vibefarsi.json</Inline> و مسیر <Inline>@/*</Inline> در tsconfig
  </>,
];

const ADD_TARGETS: [string, string][] = [
  ["کامپوننت", "components/ui/"],
  ["بلاک", "components/blocks/"],
  ["انیمیشن", "components/animations/"],
  ["پس‌زمینه", "components/backgrounds/"],
  ["قالب", "components/templates/"],
  ["تم", "globals.css"],
];

const FLAGS: [string, React.ReactNode][] = [
  [
    "--font iransans",
    <>
      اگر <Inline>IRANSans-Reg.woff</Inline> در <Inline>/fonts</Inline> یا <Inline>/public</Inline> باشد، همان را
      به‌جای Vazirmatn وصل می‌کند
    </>,
  ],
  [
    "--theme saffron",
    <>
      تم دیگری به‌جای گرافیت. بعداً هم با <Inline>npx vibefarsi add saffron</Inline> عوضش کنید
    </>,
  ],
  ["--registry http://localhost:3000/r", "رجیستری همین ماشین، وقتی روی خود مخزن کار می‌کنید"],
  ["--dry-run", "فقط نشان می‌دهد چه فایل‌هایی نوشته می‌شوند؛ چیزی تغییر نمی‌کند"],
  ["--overwrite", "فایل‌های موجود را جایگزین می‌کند"],
  ["--no-install", "پکیج‌های npm را نصب نمی‌کند"],
];

function Inline({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-secondary px-1 py-0.5 text-[12px]" dir="ltr">
      {children}
    </code>
  );
}

function Pill({ tone, children }: { tone: "auto" | "manual"; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        tone === "auto"
          ? "border-brand/30 bg-brand/10 text-brand"
          : "border-border bg-secondary text-foreground/80",
      )}
    >
      {tone === "auto" ? <Terminal className="size-3" /> : <FileCode2 className="size-3" />}
      {children}
    </span>
  );
}

function Cmd({ cmd, className }: { cmd: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs",
        className,
      )}
      dir="ltr"
    >
      <span className="text-muted-foreground">$</span>
      <code className="bg-transparent">{cmd}</code>
      <CopyButton text={cmd} className="ms-auto" />
    </div>
  );
}

function Code({ name, code }: { name: string; code: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
        <span className="text-xs text-muted-foreground" dir="ltr">
          {name}
        </span>
        <CopyButton text={code} />
      </div>
      <CodeBlock code={code} className="max-h-[420px] overflow-auto" />
    </div>
  );
}

function Step({
  n,
  title,
  desc,
  children,
}: {
  n: number;
  title: string;
  desc?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <li className="relative ps-10 before:absolute before:start-[13px] before:top-8 before:h-[calc(100%-1.25rem)] before:w-px before:bg-border last:before:hidden">
      <span className="absolute start-0 top-0.5 flex size-7 items-center justify-center rounded-full border border-border bg-card text-xs font-semibold">
        {fa(n)}
      </span>
      <h3 className="text-base font-semibold leading-7">{title}</h3>
      {desc && <p className="mt-1 text-sm leading-7 text-muted-foreground">{desc}</p>}
      {children && <div className="mt-3 space-y-3">{children}</div>}
    </li>
  );
}

function Note({ kind = "نکته", children }: { kind?: "نکته" | "هشدار"; children: React.ReactNode }) {
  return (
    <p className="flex gap-2 rounded-lg border border-border bg-card/60 px-3 py-2 text-xs leading-6 text-muted-foreground">
      <span className={cn("shrink-0 font-semibold", kind === "هشدار" ? "text-warning" : "text-foreground/80")}>
        {kind}
      </span>
      <span>{children}</span>
    </p>
  );
}

function PathCard({
  href,
  tone,
  title,
  desc,
  meta,
  recommended,
}: {
  href: string;
  tone: "auto" | "manual";
  title: string;
  desc: string;
  meta: string;
  recommended?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-foreground/25",
        tone === "auto" ? "border-brand/25" : "border-border",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <Pill tone={tone}>{tone === "auto" ? "خودکار" : "دستی"}</Pill>
        {recommended && <span className="text-[11px] text-muted-foreground">پیشنهادی</span>}
      </div>
      <div>
        <p className="text-base font-semibold">{title}</p>
        <p className="mt-1 text-sm leading-7 text-muted-foreground">{desc}</p>
      </div>
      <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
        <span>{meta}</span>
        <span className="flex items-center gap-1 transition-colors group-hover:text-foreground">
          راهنما
          <ArrowLeft className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}

function PathHeader({
  tone,
  title,
  lead,
}: {
  tone: "auto" | "manual";
  title: string;
  lead: React.ReactNode;
}) {
  return (
    <div className="mb-6 border-b border-border pb-5">
      <Pill tone={tone}>{tone === "auto" ? "راه اول · خودکار" : "راه دوم · دستی"}</Pill>
      <h2 className="mt-3 text-xl font-bold sm:text-2xl">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">{lead}</p>
    </div>
  );
}

export default function DocsPage() {
  const utils = readSource("lib/utils.ts");
  const theme = readSource("registry/themes/graphite.css");

  return (
    <article className="space-y-16">
      <header>
        <p className="text-xs text-muted-foreground">مستندات</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">شروع سریع</h1>
        <p className="mt-3 max-w-2xl leading-8 text-muted-foreground">
          وایب‌فارسی پکیج npm نیست. هر قطعه به‌صورت فایل داخل پروژه نوشته می‌شود؛ از همان لحظه مال خودتان است
          و آزادانه تغییرش می‌دهید. شروع دو راه دارد: خودکار با CLI، یا دستی با کپی همان فایل‌ها. خروجی هر دو یکی است.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Link
            key={s.key}
            href={`/${s.key}`}
            className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground/25"
          >
            <span>
              <span className="block text-sm font-semibold">{s.label}</span>
              <span className="block text-xs text-muted-foreground">{s.desc}</span>
            </span>
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              {fa(s.count)}
              <ArrowLeft className="size-3.5" />
            </span>
          </Link>
        ))}
      </div>

      <section id="install" className="scroll-mt-24">
        <h2 className="text-lg font-bold">نصب و راه‌اندازی</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
          در پروژه‌ی Next.js یا Vite با Tailwind v4، دو دستور CLI فونت، جهت و توکن‌ها را می‌نویسد. اگر CLI
          نمی‌خواهید یا ساختار پروژه فرق دارد، راه دستی همان فایل‌ها را نشان می‌دهد تا خودتان بگذارید.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <PathCard
            href="#cli"
            tone="auto"
            title="با CLI"
            desc="دو دستور. init پروژه را راست‌چین و فارسی می‌کند؛ add قطعه‌ها را با وابستگی‌هایشان می‌آورد."
            meta="Next.js یا Vite · Tailwind v4"
            recommended
          />
          <PathCard
            href="#manual"
            tone="manual"
            title="کپی فایل‌ها"
            desc="چند فایل پایه را خودتان می‌نویسید؛ کد هر قطعه را از تب «کد» صفحه‌اش کپی می‌کنید. بدون ابزار اضافه."
            meta="هر پروژه‌ی React · Tailwind v4"
          />
        </div>
      </section>

      <section id="cli" className="scroll-mt-24">
        <PathHeader
          tone="auto"
          title="نصب خودکار با CLI"
          lead="داخل پروژه‌ی React با Tailwind v4 اجرا کنید. CLI فایل‌ها را می‌نویسد و پکیج‌های لازم را با همان مدیر پکیج پروژه نصب می‌کند: npm، pnpm، yarn یا bun."
        />
        <ol className="space-y-10">
          <Step n={1} title="پروژه را آماده کنید" desc="یک‌بار در ریشه‌ی پروژه اجرا کنید.">
            <Cmd cmd={CLI_INIT} />
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground">این دستور این فایل‌ها را می‌نویسد</p>
              <ul className="mt-2 space-y-1.5 text-sm leading-7">
                {INIT_WRITES.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="mt-2 size-3.5 shrink-0 text-success" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Note>
              اگر پروژه پوشه‌ی <Inline>src</Inline> دارد، همه‌ی این فایل‌ها داخل src نوشته می‌شوند.{" "}
              <Inline>globals.css</Inline> و <Inline>layout.tsx</Inline> فقط وصله می‌شوند، از نو نوشته نمی‌شوند.
              فایل‌های lib اگر از قبل باشند دست نمی‌خورند، مگر با <Inline>--overwrite</Inline>.
            </Note>
          </Step>

          <Step
            n={2}
            title="قطعه‌ها را اضافه کنید"
            desc={
              <>
                هر قطعه با وابستگی‌هایش می‌آید؛ مثلاً calendar فایل <Inline>lib/jalali.ts</Inline> را هم می‌آورد و
                پکیج‌های npm لازم نصب می‌شوند. بعد از نوشتن، فایل مال خودتان است؛ آزادانه تغییرش دهید.
              </>
            }
          >
            <Cmd cmd={CLI_ADD} />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs font-medium text-muted-foreground">مقصد فایل‌ها</p>
                <ul className="mt-2 space-y-1 text-sm leading-7">
                  {ADD_TARGETS.map(([kind, dir]) => (
                    <li key={kind} className="flex items-center justify-between gap-3">
                      <span>{kind}</span>
                      <Inline>{dir}</Inline>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs font-medium text-muted-foreground">اسم قطعه‌ها</p>
                <p className="mt-2 text-sm leading-7">
                  slug انگلیسی هر قطعه کنار عنوان صفحه‌اش آمده. فهرست کامل:
                </p>
                <Cmd cmd={CLI_LIST} className="mt-2 bg-background" />
              </div>
            </div>
          </Step>

          <Step n={3} title="گزینه‌ها (اختیاری)" desc="هر دو دستور این گزینه‌ها را می‌گیرند.">
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-xs text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 text-start font-medium">گزینه</th>
                    <th className="px-3 py-2 text-start font-medium">کار</th>
                  </tr>
                </thead>
                <tbody>
                  {FLAGS.map(([flag, desc]) => (
                    <tr key={flag} className="border-t border-border align-top">
                      <td className="whitespace-nowrap px-3 py-2 text-xs" dir="ltr">
                        <code className="bg-transparent">{flag}</code>
                      </td>
                      <td className="px-3 py-2 leading-7 text-foreground/85">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Step>
        </ol>
      </section>

      <section id="manual" className="scroll-mt-24">
        <PathHeader
          tone="manual"
          title="نصب دستی"
          lead={
            <>
              همان چیزی که init می‌نویسد، این‌جا فایل‌به‌فایل آمده. هر بلوک را کپی کنید و در مسیر گفته‌شده بگذارید.
              پیش‌نیاز React با Tailwind v4 است.
            </>
          }
        />
        <ol className="space-y-10">
          <Step
            n={1}
            title="جهت و فونت"
            desc={
              <>
                روی html، <Inline>dir=&quot;rtl&quot;</Inline> و <Inline>lang=&quot;fa&quot;</Inline> بگذارید و فونت را
                با یک متغیر CSS وصل کنید. نمونه‌ی Next.js با Vazirmatn از Google Fonts:
              </>
            }
          >
            <Code name="app/layout.tsx" code={LAYOUT} />
            <Note>
              برای IRANSans، فایل‌های woff را در <Inline>/fonts</Inline> بگذارید و با{" "}
              <Inline>next/font/local</Inline> همان متغیر را بسازید. در Vite به‌جای next/font، این خط را بالای
              CSS بگذارید:
            </Note>
            <Code name="globals.css (فقط Vite)" code={GOOGLE_FONT} />
          </Step>

          <Step
            n={2}
            title="توکن‌های تم"
            desc={
              <>
                کامپوننت‌ها رنگ‌شان را فقط از این متغیرها می‌گیرند. این بلوک را در <Inline>globals.css</Inline> بگذارید.
              </>
            }
          >
            <Code name="app/globals.css (تم گرافیت)" code={theme} />
            <Note>
              تم‌های دیگر (فیروزه، زعفران، انار، لاجورد، کاغذ) در{" "}
              <Link href="/themes" className="underline underline-offset-4 hover:text-foreground">
                سیستم‌های طراحی
              </Link>{" "}
              هستند. همان ساختار را دارند و جای همین بلوک می‌نشینند.
            </Note>
          </Step>

          <Step
            n={3}
            title="نگاشت Tailwind"
            desc={
              <>
                این بلوک متغیرهای بالا را به کلاس‌های Tailwind مثل <Inline>bg-background</Inline> و{" "}
                <Inline>text-muted-foreground</Inline> وصل می‌کند. زیر بلوک تم بگذارید. اگر اسم متغیر فونت فرق
                دارد، خط <Inline>--font-sans</Inline> را با همان عوض کنید.
              </>
            }
          >
            <Code name="app/globals.css (نگاشت Tailwind)" code={TAILWIND_MAP} />
          </Step>

          <Step
            n={4}
            title="ابزارهای کمکی"
            desc={
              <>
                <Inline>cn</Inline> برای کلاس‌ها، <Inline>fa</Inline> و <Inline>faNumber</Inline> برای ارقام فارسی،{" "}
                <Inline>formatToman</Inline> برای قیمت. در <Inline>lib/utils.ts</Inline> بگذارید.
              </>
            }
          >
            <Code name="lib/utils.ts" code={utils} />
            <Note>
              تقویم و انتخاب تاریخ به <Inline>lib/jalali.ts</Inline> هم نیاز دارند؛ از{" "}
              <a
                href="/r/lib/jalali.json"
                className="underline underline-offset-4 hover:text-foreground"
                dir="ltr"
              >
                /r/lib/jalali.json
              </a>{" "}
              بردارید.
            </Note>
          </Step>

          <Step
            n={5}
            title="قطعه‌ها"
            desc={
              <>
                در صفحه‌ی هر قطعه، تب «کد» را کپی کنید و در <Inline>components/ui/&lt;slug&gt;.tsx</Inline> بگذارید.
                پکیج‌های npm لازم و پیش‌نیازها در بخش «نصب» همان صفحه آمده‌اند. همه‌ی قطعه‌ها به{" "}
                <Inline>lucide-react</Inline> نیاز دارند.
              </>
            }
          >
            <Cmd cmd="npm i lucide-react" />
            <Link
              href="/components"
              className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 text-sm transition-colors hover:border-foreground/25"
            >
              <span>
                <span className="block font-semibold">کامپوننت‌ها</span>
                <span className="block text-xs text-muted-foreground">از دکمه و ورودی شروع کنید</span>
              </span>
              <ArrowLeft className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
            </Link>
          </Step>
        </ol>
      </section>

      <DocSection id="prompts" title="کار با هوش مصنوعی">
        <Notes
          notes={[
            "هر صفحه تب «پرامپت» دارد: توضیح همان قطعه به انگلیسی، با قوانین راست‌چین، فونت، ارقام و توکن‌ها. آن را در Cursor، Claude Code یا Windsurf بچسبانید تا مدل همان قطعه را با سبک پروژه بسازد.",
            "اگر خروجی چپ‌چین شد یا ارقام لاتین ماند، همان پرامپت را یک‌بار دیگر بفرستید و بگویید re-check the Persian RTL rules. قوانین داخل همان پرامپت است.",
            "نسخه‌ی ماشین‌خوان هر مورد در /r/<بخش>/<slug>.json است؛ CLI همان را می‌خواند.",
          ]}
        />
      </DocSection>

      <DocSection id="mcp" title="سرور MCP">
        <p className="mb-3 text-sm leading-7 text-muted-foreground">
          ابزارهای هوش مصنوعی به انگلیسی فکر می‌کنند. این پنج ابزار قوانین فارسی و کد رجیستری را به Cursor، Claude Code و Windsurf می‌دهند تا به‌جای Inter و چیدمان چپ‌چین، قطعه‌ی وایب‌فارسی بسازند.
        </p>
        <Code name="mcp.json" code={MCP} />
        <ul className="mt-4 space-y-2 text-sm leading-7">
          <li><Inline>get_design_rules</Inline> قوانین راست‌چین، فونت، ارقام، فرم و توکن. این را قبل از ساخت هر صفحه صدا بزنید.</li>
          <li><Inline>search_registry</Inline> جست‌وجو در کامپوننت، بلاک، انیمیشن، پس‌زمینه، قالب و تم؛ فارسی یا انگلیسی.</li>
          <li><Inline>get_component</Inline> کد، پرامپت و مسیر نصب یک یا چند قطعه، به‌همراه وابستگی‌هایی مثل jalali.</li>
          <li><Inline>get_theme</Inline> توکن‌های CSS تم (پیش‌فرض: گرافیت). مدل نباید رنگ از خودش بگذارد.</li>
          <li><Inline>scaffold_page</Inline> از توضیح صفحه (پرداخت، ورود پیامکی، نوبت شمسی) یک ترکیب آماده می‌سازد.</li>
        </ul>
        <p className="mt-3 text-xs leading-6 text-muted-foreground">
          تا وقتی پکیج روی npm منتشر نشده، در همین مخزن <Inline>npm run mcp</Inline> را به ادیتور بدهید. فهرست ماشین‌خوان: <Inline>/r/&lt;بخش&gt;/&lt;slug&gt;.json</Inline>.
        </p>
      </DocSection>
    </article>
  );
}
