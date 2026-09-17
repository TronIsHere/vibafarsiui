"use client";

import { Bell, CreditCard, Shield, User } from "lucide-react";
import { Sidebar, SidebarItem } from "@/registry/ui/sidebar";
import { Field, Input } from "@/registry/ui/input";
import { Switch } from "@/registry/ui/switch";
import { Button } from "@/registry/ui/button";
import { Avatar } from "@/registry/ui/avatar";
import { RadioGroup } from "@/registry/ui/radio-group";

function Panel({ title, desc, children, footer }: { title: string; desc: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card">
      <div className="border-b border-border p-5"><h2 className="font-semibold">{title}</h2><p className="mt-0.5 text-sm text-muted-foreground">{desc}</p></div>
      <div className="p-5">{children}</div>
      {footer && <div className="flex justify-start border-t border-border p-4">{footer}</div>}
    </section>
  );
}

/** پنل تنظیمات — پروفایل، امنیت و اعلان‌ها با ناوبری کناری. */
export function SettingsPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto flex max-w-5xl gap-8 px-4 py-10">
        <Sidebar className="hidden h-fit w-52 shrink-0 md:flex">
          <SidebarItem icon={User} label="پروفایل" active />
          <SidebarItem icon={Shield} label="امنیت" />
          <SidebarItem icon={Bell} label="اعلان‌ها" />
          <SidebarItem icon={CreditCard} label="صورت‌حساب" />
        </Sidebar>

        <div className="min-w-0 flex-1 space-y-6">
          <h1 className="text-xl font-bold">تنظیمات</h1>

          <Panel title="پروفایل" desc="این اطلاعات برای مشتری‌ها هم نمایش داده می‌شود." footer={<Button size="sm">ذخیره</Button>}>
            <div className="mb-5 flex items-center gap-4"><Avatar name="سارا محمدی" size="lg" /><Button variant="outline" size="sm">تغییر تصویر</Button></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="نام و نام خانوادگی" htmlFor="n"><Input id="n" defaultValue="سارا محمدی" /></Field>
              <Field label="ایمیل" htmlFor="e"><Input id="e" dir="ltr" type="email" defaultValue="sara@example.com" /></Field>
            </div>
          </Panel>

          <Panel title="امنیت" desc="ورود دومرحله‌ای را برای حساب فروشگاهی توصیه می‌کنیم.">
            <RadioGroup
              variant="cards"
              defaultValue="sms"
              options={[
                { value: "sms", label: "پیامک", description: "کد به شماره‌ی موبایل شما ارسال می‌شود" },
                { value: "app", label: "اپلیکیشن احراز هویت", description: "Google Authenticator یا مشابه" },
              ]}
            />
          </Panel>

          <Panel title="اعلان‌ها" desc="کدام رویدادها را می‌خواهید بدانید؟">
            <ul className="divide-y divide-border">
              {[
                ["سفارش جدید", "با هر سفارش پیامک و ایمیل بگیرید", true],
                ["خلاصه‌ی روزانه", "هر شب ساعت ۲۱", true],
                ["پیشنهادهای بازاریابی", "گاهی؛ نه بیشتر از هفته‌ای یک بار", false],
              ].map(([t, d, on]) => (
                <li key={String(t)} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div><p className="text-sm font-medium">{t}</p><p className="text-xs text-muted-foreground">{d}</p></div>
                  <Switch defaultChecked={Boolean(on)} aria-label={String(t)} />
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
