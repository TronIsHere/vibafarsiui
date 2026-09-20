"use client";

import * as React from "react";
import { Button } from "@/registry/ui/button";
import { Checkbox } from "@/registry/ui/checkbox";
import { Field, Input } from "@/registry/ui/input";
import { PasswordInput } from "@/registry/ui/password-input";

export interface SignupValues { name: string; email: string; password: string }

/** کارت ثبت‌نام. Name, email and password with a strength meter, terms checkbox and a sign-in link. */
export function SignupCard({ onSubmit, termsHref = "/terms", loginHref = "/login" }: { onSubmit?: (v: SignupValues) => void | Promise<void>; termsHref?: string; loginHref?: string }) {
  const [agree, setAgree] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await onSubmit?.({ name: String(fd.get("name") ?? ""), email: String(fd.get("email") ?? ""), password: String(fd.get("password") ?? "") });
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-xl font-bold">ساخت حساب</h2>
      <p className="mt-1 text-sm text-muted-foreground">رایگان شروع کنید، هر وقت خواستید ارتقا بدید.</p>
      <div className="mt-6 space-y-4">
        <Field label="نام و نام خانوادگی" htmlFor="su-name"><Input id="su-name" name="name" autoComplete="name" required /></Field>
        <Field label="ایمیل" htmlFor="su-email"><Input id="su-email" name="email" type="email" autoComplete="email" dir="ltr" required placeholder="you@example.com" /></Field>
        <Field label="رمز عبور" htmlFor="su-password" hint="دست‌کم ۸ کاراکتر"><PasswordInput id="su-password" name="password" minLength={8} required strength /></Field>
        <Checkbox checked={agree} onCheckedChange={setAgree} label={<>با <a href={termsHref} className="underline underline-offset-4">قوانین و شرایط</a> موافقم</>} />
      </div>
      <Button type="submit" className="mt-6 w-full" disabled={!agree || busy}>{busy ? "در حال ساخت…" : "ساخت حساب"}</Button>
      <p className="mt-4 text-center text-sm text-muted-foreground">قبلاً حساب دارید؟ <a href={loginHref} className="text-foreground underline underline-offset-4">وارد شوید</a></p>
    </form>
  );
}
