import { AppWindow, ArrowLeft, FileText, Pin, Plus } from "lucide-react";
import { fa } from "@/lib/utils";
import { SPONSOR_URL } from "@/lib/site";
import { goldSponsors, silverSponsors, sponsors, type Sponsor } from "@/lib/sponsors";
import { Section } from "./frame";
import { SponsorMark } from "./sponsor-card";

const GOLD_SEATS = 3;
const WALL_SEATS = 4;

const perks = [
  {
    icon: AppWindow,
    t: "لوگو روی صفحه‌ی اول",
    d: "کنار خود کامپوننت‌ها دیده میشه، نه توی یک فوتر گم‌شده.",
  },
  {
    icon: FileText,
    t: "نام در README",
    d: "کسانی که از گیت‌هاب می‌آن، اسم شما را همان‌جا می‌بینن.",
  },
  {
    icon: Pin,
    t: "صندلی ثابت",
    d: "تا وقتی حمایت ادامه داره، این جا مال شماست.",
  },
];

function padSeats(list: Sponsor[], min: number): (Sponsor | null)[] {
  const n = Math.max(min, list.length);
  return Array.from({ length: n }, (_, i) => list[i] ?? null);
}

function seatNo(n: number) {
  return fa(String(n).padStart(2, "0"));
}

function GoldSeat({ sponsor, index }: { sponsor: Sponsor | null; index: number }) {
  if (sponsor) {
    return (
      <a
        href={sponsor.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={sponsor.name}
        className="group flex min-h-[220px] cursor-pointer flex-col justify-between bg-background p-6 transition-colors duration-200 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 sm:p-8"
      >
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[11px] text-muted-foreground">{seatNo(index + 1)}</span>
          <span className="rounded-full border border-brand/30 bg-brand/10 px-2.5 py-0.5 text-[11px] font-medium text-brand">
            {sponsor.role === "hosting" ? "میزبانی" : "حامی اصلی"}
          </span>
        </div>
        <div>
          <div className="flex items-center gap-4">
            <SponsorMark sponsor={sponsor} large />
            <div>
              <p className="text-base font-semibold sm:text-lg">{sponsor.name}</p>
              {sponsor.nameEn ? (
                <p className="mt-0.5 text-[11px] text-muted-foreground" dir="ltr">
                  {sponsor.nameEn}
                </p>
              ) : null}
            </div>
          </div>
          {sponsor.blurb ? (
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">{sponsor.blurb}</p>
          ) : null}
        </div>
      </a>
    );
  }

  return (
    <a
      href={SPONSOR_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="حامی شوید"
      className="group flex min-h-[220px] cursor-pointer flex-col bg-hatch p-6 transition-colors duration-200 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 sm:p-8"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] text-muted-foreground">{seatNo(index + 1)}</span>
        <span className="text-[11px] text-muted-foreground">آزاد</span>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <span className="flex size-10 items-center justify-center rounded-full border border-dashed border-border bg-background text-muted-foreground transition-colors duration-200 group-hover:border-foreground/30 group-hover:text-foreground">
          <Plus className="size-4" />
        </span>
        <p className="mt-3 text-sm font-semibold">حامی اصلی</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">لوگوی شما این‌جا می‌شینه</p>
      </div>
    </a>
  );
}

function WallSeat({ sponsor, index }: { sponsor: Sponsor | null; index: number }) {
  if (sponsor) {
    return (
      <a
        href={sponsor.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={sponsor.name}
        className="group flex min-h-[132px] cursor-pointer flex-col items-center justify-center gap-2 bg-background px-4 py-6 text-center transition-colors duration-200 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
      >
        <SponsorMark sponsor={sponsor} />
        {sponsor.logo ? (
          <span className="text-xs text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
            {sponsor.name}
          </span>
        ) : null}
      </a>
    );
  }

  return (
    <a
      href={SPONSOR_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="حامی شوید"
      className="group flex min-h-[132px] cursor-pointer flex-col items-center justify-center gap-2 bg-hatch px-4 py-6 text-center transition-colors duration-200 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
    >
      <span className="font-mono text-2xl text-muted-foreground/45">{seatNo(index + 1)}</span>
      <span className="text-[11px] text-muted-foreground">آزاد</span>
    </a>
  );
}

export function Sponsors() {
  const gold = padSeats(goldSponsors, GOLD_SEATS);
  const wall = padSeats(silverSponsors, WALL_SEATS);
  const filled = sponsors.length;

  return (
    <Section id="sponsors" className="scroll-mt-20">
      <div className="flex flex-col gap-5 border-b border-border px-5 py-8 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div>
          <p className="text-xs text-muted-foreground">
            {filled ? <>{fa(filled)} حامی</> : "حامیان"}
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            این کار را با هم سر پا نگه می‌داریم
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-[15px]">
            پلن پولی نداریم و هیچ کامپوننتی قفل نیست. حمایت حامی‌ها خرج دامنه و
            سرور میشه و لوگوشون کنار خود کامپوننت‌ها روی صفحه‌ی اول می‌نشینه.
          </p>
        </div>
        <a
          href={SPONSOR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 shrink-0 cursor-pointer items-center gap-1.5 self-start rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:self-auto"
        >
          حامی شوید
          <ArrowLeft className="size-4" />
        </a>
      </div>

      <ul className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
        {gold.map((sponsor, i) => (
          <li key={sponsor ? sponsor.name : `gold-open-${i}`}>
            <GoldSeat sponsor={sponsor} index={i} />
          </li>
        ))}
      </ul>

      <ul className="grid grid-cols-2 gap-px border-t border-border bg-border sm:grid-cols-4">
        {wall.map((sponsor, i) => (
          <li key={sponsor ? sponsor.name : `wall-open-${i}`}>
            <WallSeat sponsor={sponsor} index={GOLD_SEATS + i} />
          </li>
        ))}
      </ul>

      <ul className="grid grid-cols-1 gap-px border-t border-border bg-border sm:grid-cols-3">
        {perks.map((it) => (
          <li key={it.t} className="flex gap-4 bg-background px-5 py-6 sm:px-8">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-card text-foreground/80">
              <it.icon className="size-4" />
            </span>
            <div>
              <h3 className="text-[15px] font-semibold">{it.t}</h3>
              <p className="mt-1 text-[13px] leading-6 text-muted-foreground">{it.d}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
