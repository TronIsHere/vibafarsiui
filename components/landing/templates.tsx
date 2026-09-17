import Link from "next/link";
import { cn, fa as faN } from "@/lib/utils";
import { templates } from "@/lib/registry";
import { Section } from "./frame";
import { SectionFoot, SectionHead } from "./section-head";

/* Wireframe thumbnails: monochrome blocks, one accent element each. */
const bar = "rounded-sm bg-foreground/15";
const ink = "rounded-sm bg-foreground/60";
const box = "rounded border border-border bg-card";

function ShopDashboard() {
  return (
    <div className="flex h-full gap-1.5 p-2">
      <div className="flex w-1/5 flex-col gap-1 border-e border-border pe-1.5">
        <span className={cn(ink, "h-1.5 w-2/3")} />
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={cn(bar, "h-1.5", i === 2 && "bg-foreground/40")}
          />
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="grid grid-cols-3 gap-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className={cn(box, "h-6 p-1")}>
              <span className={cn(ink, "block h-1 w-1/2")} />
            </div>
          ))}
        </div>
        <div className="flex flex-1 items-end gap-1 rounded border border-border p-1.5">
          {[40, 60, 45, 80, 65, 90, 55].map((h, i) => (
            <span
              key={i}
              className={cn(
                "flex-1 rounded-sm",
                i === 5 ? "bg-primary" : "bg-foreground/20",
              )}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className={cn(box, "h-7 space-y-1 p-1")}>
          {[1, 2].map((i) => (
            <span key={i} className={cn(bar, "block h-1")} />
          ))}
        </div>
      </div>
    </div>
  );
}
function Auth() {
  return (
    <div className="flex h-full items-center justify-center p-3">
      <div className={cn(box, "w-2/3 space-y-1.5 p-2.5")}>
        <span className={cn(ink, "block h-1.5 w-1/2")} />
        <span className={cn(bar, "block h-3")} />
        <div className="flex gap-1" dir="ltr">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <span
              key={i}
              className={cn(
                "h-4 flex-1 rounded border",
                i === 4 ? "border-foreground" : "border-border",
              )}
            />
          ))}
        </div>
        <span className="block h-3 rounded-sm bg-primary" />
      </div>
    </div>
  );
}
function StartupLanding() {
  return (
    <div className="flex h-full flex-col gap-1.5 p-2">
      <div className="flex items-center justify-between">
        <span className={cn(ink, "h-1.5 w-8")} />
        <span className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <span key={i} className={cn(bar, "h-1.5 w-4")} />
          ))}
        </span>
      </div>
      <div className="mt-1 flex flex-col items-center gap-1">
        <span className={cn(ink, "h-2.5 w-2/3")} />
        <span className={cn(ink, "h-2.5 w-1/2")} />
        <span className={cn(bar, "mt-0.5 h-1 w-1/3")} />
        <span className="mt-1 h-3 w-10 rounded-full bg-primary" />
      </div>
      <div className="mt-auto grid grid-cols-3 gap-1.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className={cn(box, "h-7 p-1")}>
            <span className={cn(bar, "block h-1 w-2/3")} />
          </div>
        ))}
      </div>
    </div>
  );
}
function Pricing() {
  return (
    <div className="flex h-full items-end gap-1.5 p-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            box,
            "flex flex-1 flex-col gap-1 p-1.5",
            i === 1 ? "h-[92%] border-foreground/50" : "h-4/5",
          )}
        >
          <span className={cn(bar, "h-1 w-1/2")} />
          <span className={cn(ink, "h-2 w-2/3")} />
          {[1, 2, 3].map((j) => (
            <span key={j} className={cn(bar, "h-1")} />
          ))}
          <span
            className={cn(
              "mt-auto h-2.5 rounded-sm",
              i === 1 ? "bg-primary" : "border border-border",
            )}
          />
        </div>
      ))}
    </div>
  );
}
function AiChat() {
  return (
    <div className="flex h-full flex-col gap-1.5 p-2">
      <span className={cn(bar, "ms-auto h-4 w-1/2 rounded-md")} />
      <div className={cn(box, "w-3/4 space-y-1 p-1.5")}>
        {[1, 2, 3].map((i) => (
          <span key={i} className={cn(bar, "block h-1", i === 3 && "w-2/3")} />
        ))}
      </div>
      <span className={cn(bar, "ms-auto h-3 w-1/3 rounded-md")} />
      <div
        className={cn(
          box,
          "mt-auto flex h-6 items-center justify-between px-1.5",
        )}
      >
        <span className={cn(bar, "h-1 w-1/2")} />
        <span className="size-3 rounded bg-primary" />
      </div>
    </div>
  );
}
function Invoice() {
  return (
    <div className="flex h-full flex-col gap-1.5 p-2.5">
      <div className="flex items-start justify-between">
        <span className={cn(ink, "h-2 w-1/4")} />
        <span className={cn(bar, "h-1.5 w-1/5")} />
      </div>
      <div className="mt-1 space-y-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between gap-2">
            <span className={cn(bar, "h-1 flex-1")} />
            <span className={cn(bar, "h-1 w-1/6")} />
          </div>
        ))}
      </div>
      <div className="mt-auto flex justify-between border-t border-border pt-1">
        <span className={cn(bar, "h-1.5 w-1/5")} />
        <span className={cn(ink, "h-1.5 w-1/4")} />
      </div>
    </div>
  );
}
function Blog() {
  return (
    <div className="flex h-full gap-2 p-2.5">
      <div className="flex flex-1 flex-col gap-1">
        <span className={cn(ink, "h-2.5 w-3/4")} />
        <span className={cn(bar, "h-1 w-1/3")} />
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <span key={i} className={cn(bar, "h-1", i % 3 === 0 && "w-3/4")} />
        ))}
      </div>
      <div className="w-1/4 space-y-1 border-s border-border ps-2">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={cn(bar, "block h-1", i === 2 && "bg-foreground/50")}
          />
        ))}
      </div>
    </div>
  );
}
function SettingsPanel() {
  return (
    <div className="flex h-full gap-1.5 p-2">
      <div className="w-1/4 space-y-1 border-e border-border pe-1.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={cn(bar, "block h-1.5", i === 1 && "bg-foreground/50")}
          />
        ))}
      </div>
      <div className="flex-1 space-y-1.5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(box, "flex items-center justify-between p-1.5")}
          >
            <span className={cn(bar, "h-1 w-1/2")} />
            <span
              className={cn(
                "h-2 w-4 rounded-full",
                i < 3 ? "bg-primary" : "bg-foreground/20",
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
function Checkout() {
  return (
    <div className="flex h-full gap-1.5 p-2">
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full",
                i === 1 ? "bg-primary" : "bg-foreground/15",
              )}
            />
          ))}
        </div>
        {[1, 2].map((i) => (
          <div key={i} className={cn(box, "flex items-center gap-1.5 p-1.5")}>
            <span className="size-5 rounded bg-foreground/10" />
            <span className={cn(bar, "h-1 flex-1")} />
            <span className={cn(ink, "h-1 w-1/5")} />
          </div>
        ))}
      </div>
      <div className={cn(box, "flex w-1/3 flex-col gap-1 p-1.5")}>
        <span className={cn(bar, "h-1 w-2/3")} />
        <span className={cn(bar, "h-1")} />
        <span className={cn(ink, "mt-auto h-1.5 w-3/4")} />
        <span className="h-2.5 rounded-sm bg-primary" />
      </div>
    </div>
  );
}
function Store() {
  return (
    <div className="flex h-full gap-1.5 p-2">
      <div className="flex w-[38%] flex-col gap-1">
        <div className={cn(box, "flex-1")} />
        <div className="grid grid-cols-4 gap-0.5">
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={cn(
                "aspect-square rounded border",
                i === 1 ? "border-foreground" : "border-border bg-card",
              )}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <span className={cn(ink, "h-1.5 w-4/5")} />
        <span className={cn(bar, "h-1 w-1/2")} />
        <div className="mt-1 grid grid-cols-2 gap-1">
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className={cn(box, "h-4")} />
          ))}
        </div>
      </div>
      <div className={cn(box, "flex w-1/4 flex-col gap-1 p-1.5")}>
        <span className={cn(bar, "h-1 w-3/4")} />
        <span className={cn(ink, "h-2 w-2/3")} />
        <span className="mt-auto h-2.5 rounded-sm bg-primary" />
      </div>
    </div>
  );
}
function Onboarding() {
  return (
    <div className="flex h-full items-center justify-center p-3">
      <div className={cn(box, "w-2/3 space-y-1.5 p-2.5")}>
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full",
                i === 1 ? "bg-primary" : "bg-foreground/15",
              )}
            />
          ))}
        </div>
        <span className={cn(ink, "block h-1.5 w-1/2")} />
        <span className={cn(bar, "block h-3")} />
        <span className="block h-3 rounded-sm bg-primary" />
      </div>
    </div>
  );
}
function AdminOrders() {
  return (
    <div className="flex h-full flex-col gap-1.5 p-2">
      <div className="grid grid-cols-3 gap-1.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className={cn(box, "h-6 p-1")}>
            <span className={cn(bar, "block h-1 w-2/3")} />
            <span className={cn(ink, "mt-1 block h-1.5 w-1/2")} />
          </div>
        ))}
      </div>
      <div className={cn(box, "flex flex-1 flex-col gap-1 p-1.5")}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className={cn(bar, "h-1 flex-1")} />
            <span className={cn(bar, "h-1 w-1/6")} />
            <span
              className={cn(
                "h-1.5 w-6 rounded-full",
                i === 1 ? "bg-primary" : "bg-foreground/20",
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
function Booking() {
  return (
    <div className="flex h-full gap-1.5 p-2">
      <div className="flex w-1/4 flex-col gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              box,
              "flex-1 p-1",
              i === 1 && "border-foreground/50",
            )}
          >
            <span className={cn(bar, "block h-1 w-2/3")} />
          </div>
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="grid flex-1 grid-cols-7 gap-0.5">
          {Array.from({ length: 21 }, (_, i) => (
            <span
              key={i}
              className={cn(
                "rounded-sm",
                i === 10 ? "bg-primary" : "bg-foreground/10",
              )}
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-0.5">
          {[1, 2, 3].map((i) => (
            <span key={i} className={cn(box, "h-2.5")} />
          ))}
        </div>
      </div>
      <div className={cn(box, "flex w-1/4 flex-col gap-1 p-1.5")}>
        <span className={cn(bar, "h-1")} />
        <span className={cn(bar, "h-1 w-2/3")} />
        <span className="mt-auto h-2.5 rounded-sm bg-primary" />
      </div>
    </div>
  );
}
function Wallet() {
  return (
    <div className="flex h-full flex-col gap-1.5 p-2">
      <div className={cn(box, "space-y-1.5 p-2")}>
        <span className={cn(bar, "block h-1 w-1/3")} />
        <span className={cn(ink, "block h-2.5 w-1/2")} />
        <div className="flex gap-1">
          <span className="h-2.5 w-10 rounded-sm bg-primary" />
          <span className={cn(box, "h-2.5 w-8")} />
        </div>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={cn(box, "h-3 flex-1")} />
        ))}
      </div>
      <div className="flex-1 space-y-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-foreground/15" />
            <span className={cn(bar, "h-1 flex-1")} />
            <span className={cn(ink, "h-1 w-1/5")} />
          </div>
        ))}
      </div>
    </div>
  );
}
function ErrorPages() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-1 p-3">
      <span className="font-mono text-xl font-bold text-foreground/15">۴۰۴</span>
      <span className={cn(ink, "h-1.5 w-1/3")} />
      <span className={cn(bar, "h-1 w-1/2")} />
      <span className="mt-1 h-2.5 w-10 rounded-sm bg-primary" />
    </div>
  );
}
function Email() {
  return (
    <div className="flex h-full items-center justify-center bg-foreground/5 p-3">
      <div className={cn(box, "w-3/4 space-y-1.5 p-2.5")}>
        <span className={cn(ink, "block h-1.5 w-1/4")} />
        <span className={cn(bar, "block h-1 w-3/4")} />
        <div className="flex justify-center gap-1 py-0.5" dir="ltr">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <span key={i} className={cn(box, "h-4 w-3")} />
          ))}
        </div>
        <span className="mx-auto block h-2.5 w-12 rounded-sm bg-primary" />
      </div>
    </div>
  );
}
function Fallback() {
  return (
    <div className="flex h-full flex-col gap-1.5 p-2">
      <span className={cn(ink, "h-1.5 w-1/3")} />
      <span className={cn(bar, "h-1 w-2/3")} />
      <div className={cn(box, "flex-1")} />
    </div>
  );
}

const thumbs: Record<string, React.ReactNode> = {
  "shop-dashboard": <ShopDashboard />,
  auth: <Auth />,
  "startup-landing": <StartupLanding />,
  pricing: <Pricing />,
  "ai-chat": <AiChat />,
  invoice: <Invoice />,
  blog: <Blog />,
  settings: <SettingsPanel />,
  checkout: <Checkout />,
  store: <Store />,
  onboarding: <Onboarding />,
  "admin-orders": <AdminOrders />,
  booking: <Booking />,
  wallet: <Wallet />,
  "error-pages": <ErrorPages />,
  email: <Email />,
};

export function Templates({ standalone }: { standalone?: boolean }) {
  const head = (
    <SectionHead
      eyebrow={<>{faN(templates.length)} قالب</>}
      title={standalone ? "قالب‌ها" : "صفحه‌های کامل، از همین قطعه‌ها"}
      desc="قالب‌ها با همین کامپوننت‌ها و توکن‌ها ساخته شده‌اند. تم را عوض کنید، همه‌ی صفحه‌ها با هم عوض می‌شوند. هر کدام را تمام‌صفحه باز کنید و کدش را بردارید."
      href="/templates"
      standalone={standalone}
    />
  );
  const grid = (
    <ul className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4", standalone ? "xl:grid-cols-3" : "p-3 sm:p-4 xl:grid-cols-4")}>
      {templates.map((t) => (
        <li key={t.slug}>
          <Link href={`/templates/${t.slug}`} className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors duration-200 hover:border-foreground/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60">
            <div className="aspect-[16/10] border-b border-border bg-background/60 transition-colors group-hover:bg-background">{thumbs[t.slug] ?? <Fallback />}</div>
            <div className="flex flex-1 flex-col px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">{t.name}</h3>
                <span className="  text-[11px] text-muted-foreground" dir="ltr">{t.slug}</span>
              </div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{t.desc}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {t.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">{tag}</span>
                ))}
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
  if (standalone) return <div>{head}{grid}</div>;
  return (
    <Section id="templates">
      {head}
      {grid}
      <SectionFoot href="/templates" label="همه‌ی قالب‌ها" note="پیش‌نمایش زنده و کد کامل هر صفحه." />
    </Section>
  );
}
