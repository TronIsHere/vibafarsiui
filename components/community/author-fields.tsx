"use client";

import { LIMITS } from "@/lib/community/types";
import { Field, Input } from "@/registry/ui/input";

export type AuthorDraft = { name: string; x: string; github: string; site: string };

export const emptyAuthor: AuthorDraft = { name: "", x: "", github: "", site: "" };

/** "Who made it" fields shared by both submit forms. */
export function AuthorFields({ value, onChange }: { value: AuthorDraft; onChange: (v: Partial<AuthorDraft>) => void }) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-lg font-bold">سازنده</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          این‌ها کنار کارتون نشون داده میشن تا بقیه بتونن پیداتون کنن. فقط اسم لازمه.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="اسم" htmlFor="name">
          <Input id="name" name="name" required minLength={2} maxLength={LIMITS.name} autoComplete="name" value={value.name} onChange={(e) => onChange({ name: e.target.value })} />
        </Field>
        <Field label="ایکس (اختیاری)" htmlFor="x">
          <Input id="x" name="x" dir="ltr" maxLength={80} startAddon="@" placeholder="username" value={value.x} onChange={(e) => onChange({ x: e.target.value })} />
        </Field>
        <Field label="گیت‌هاب (اختیاری)" htmlFor="github">
          <Input id="github" name="github" dir="ltr" maxLength={80} startAddon="github.com/" placeholder="username" value={value.github} onChange={(e) => onChange({ github: e.target.value })} />
        </Field>
        <Field label="سایت شخصی (اختیاری)" htmlFor="site">
          <Input id="site" name="site" dir="ltr" inputMode="url" maxLength={LIMITS.url} placeholder="https://" value={value.site} onChange={(e) => onChange({ site: e.target.value })} />
        </Field>
      </div>
    </section>
  );
}

/** Invisible field that bots fill in and people never see; the action drops any submission that has it. */
export function Honeypot() {
  return (
    <div aria-hidden className="pointer-events-none absolute size-px overflow-hidden opacity-0">
      <label>
        Company
        <input type="text" name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}
