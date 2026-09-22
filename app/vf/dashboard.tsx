import Link from "next/link";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Stat } from "@/registry/ui/stat";
import { logout } from "@/lib/analytics/actions";
import { ADMIN_PATH, RANGES, type RangeKey } from "@/lib/analytics/config";
import { getStats, startedOnLabel, type Device } from "@/lib/analytics/store";
import { listSubmissions } from "@/lib/community/store";
import { fa, faNumber, cn } from "@/lib/utils";

const DEVICE_ICON: Record<Device, typeof Monitor> = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
};

function relativeFa(ts: number): string {
  const sec = Math.max(0, Math.round((Date.now() - ts) / 1000));
  if (sec < 60) return `${fa(sec)} ثانیه پیش`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${fa(min)} دقیقه پیش`;
  const hour = Math.round(min / 60);
  if (hour < 24) return `${fa(hour)} ساعت پیش`;
  return `${fa(Math.round(hour / 24))} روز پیش`;
}

function Chart({ series }: { series: { key: string; label: string; views: number }[] }) {
  const max = Math.max(1, ...series.map((s) => s.views));
  const tickEvery = series.length > 12 ? 4 : series.length > 8 ? 2 : 1;
  return (
    <div dir="ltr" className="flex h-40 gap-1" role="img" aria-label="نمودار روند بازدید">
      {series.map((s, i) => (
        <div key={s.key} className="flex h-full min-w-0 flex-1 flex-col items-center gap-1">
          <div className="flex min-h-0 w-full flex-1 items-end">
            <div
              className="w-full rounded-t-sm bg-brand/80"
              style={{ height: `${s.views === 0 ? 2 : Math.max(8, (s.views / max) * 100)}%` }}
              title={`${s.label}: ${faNumber(s.views)}`}
            />
          </div>
          <span
            className={cn(
              "shrink-0 text-[9px] leading-none text-muted-foreground",
              i % tickEvery !== 0 && "invisible",
            )}
          >
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function RankedList({
  items,
  empty,
  ltr,
}: {
  items: { name: string; views: number }[];
  empty: string;
  ltr?: boolean;
}) {
  const max = Math.max(1, ...items.map((i) => i.views));
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">{empty}</p>;
  }
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item.name}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
            <span className="min-w-0 truncate" dir={ltr ? "ltr" : undefined}>
              {item.name}
            </span>
            <span className="shrink-0 tabular-nums text-muted-foreground">{faNumber(item.views)}</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-brand" style={{ width: `${(item.views / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export async function Dashboard({ range }: { range: RangeKey }) {
  const [stats, pending] = await Promise.all([getStats(range), listSubmissions({ status: "pending" })]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-sm text-muted-foreground">{startedOnLabel(range)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`${ADMIN_PATH}/community`}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-3 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            صف جامعه
            {pending.length > 0 && (
              <span className="rounded-full bg-brand px-1.5 text-[11px] font-semibold text-brand-foreground">{fa(pending.length)}</span>
            )}
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="inline-flex h-8 cursor-pointer items-center rounded-md border border-border px-3 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              خروج
            </button>
          </form>
        </div>
      </header>

      <div className="mt-6 flex w-fit flex-wrap gap-1 rounded-lg border border-border p-1">
        {RANGES.map((r) => (
          <Link
            key={r.key}
            href={r.key === "7d" ? ADMIN_PATH : `${ADMIN_PATH}?r=${r.key}`}
            className={cn(
              "inline-flex h-8 cursor-pointer items-center rounded-md px-3 text-[13px] transition-colors",
              r.key === range ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {r.label}
          </Link>
        ))}
      </div>

      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="بازدید" value={faNumber(stats.views)} delta={stats.viewsDelta ?? undefined} />
        <Stat label="بازدیدکننده‌ی یکتا" value={faNumber(stats.visitors)} delta={stats.visitorsDelta ?? undefined} />
        <Stat label="صفحه" value={faNumber(stats.pages)} />
        <Stat label="منبع ارجاع" value={faNumber(stats.referrers)} />
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card p-4 sm:p-5">
        <h2 className="mb-4 text-sm font-semibold">روند بازدید</h2>
        {stats.views === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            هنوز بازدیدی ثبت نشده. چند صفحه را باز کنید و برگردید.
          </p>
        ) : (
          <>
            {range === "all" && (
              <p className="mb-3 text-xs text-muted-foreground">نمودار فقط ۳۰ روز اخیر را نشان می‌دهد.</p>
            )}
            <Chart series={stats.series} />
          </>
        )}
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <h2 className="mb-4 text-sm font-semibold">صفحات پربازدید</h2>
          <RankedList items={stats.topPages} empty="هنوز صفحه‌ای دیده نشده." ltr />
        </section>
        <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <h2 className="mb-4 text-sm font-semibold">منابع ارجاع</h2>
          <RankedList items={stats.topReferrers} empty="هنوز ارجاعی ثبت نشده." />
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-border bg-card p-4 sm:p-5">
        <h2 className="mb-4 text-sm font-semibold">دستگاه</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {stats.devices.map((d) => {
            const Icon = DEVICE_ICON[d.key];
            return (
              <div key={d.key} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5">
                <Icon className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{d.label}</p>
                  <p className="text-sm font-semibold tabular-nums">{faNumber(d.views)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card p-4 sm:p-5">
        <h2 className="mb-4 text-sm font-semibold">بازدیدهای اخیر</h2>
        {stats.recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">چیزی برای نشان دادن نیست.</p>
        ) : (
          <ul className="divide-y divide-border text-sm">
            {stats.recent.map((row, i) => (
              <li key={`${row.t}-${row.p}-${i}`} className="flex items-baseline justify-between gap-4 py-2">
                <span className="min-w-0 truncate">
                  <span dir="ltr">{row.p}</span>
                  {row.r ? (
                    <span className="ms-2 text-xs text-muted-foreground">
                      از <span dir="ltr">{row.r}</span>
                    </span>
                  ) : null}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">{relativeFa(row.t)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
