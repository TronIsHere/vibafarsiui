import { AlignRight, Hash, Palette, Type } from "lucide-react";
import { Section } from "./frame";

const items = [
  { icon: AlignRight, t: "راست‌چین واقعی", d: "چیدمان و آیکون‌ها از پایه راست‌چین‌اند. یک dir روی کل صفحه کافی نیست." },
  { icon: Type, t: "تایپوگرافی فارسی", d: "وزن فونت و ارتفاع خط برای فارسی تنظیم شده؛ letter-spacing حروف را از هم جدا نمی‌کند." },
  { icon: Hash, t: "اعداد و تقویم شمسی", d: "ارقام فارسی، جداکننده‌ی هزارگان، تومان و تاریخ شمسی داخل خود قطعه است." },
  { icon: Palette, t: "رنگ از توکن", d: "هر رنگ از یک متغیر CSS می‌آید. تم تیره پیش‌فرض است؛ با چند خط عوضش می‌کنید." },
];

export function Principles() {
  return (
    <Section>
      <ul className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
        {items.map((it, i) => (
          <li
            key={it.t}
            className={[
              "flex gap-4 px-5 py-6 sm:px-8",
              "sm:border-b sm:border-border lg:border-b-0",
              i % 2 === 0 ? "sm:border-e" : "",
              "lg:border-e lg:last:border-e-0",
            ].join(" ")}
          >
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
