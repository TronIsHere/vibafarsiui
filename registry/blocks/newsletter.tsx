"use client";

import * as React from "react";
import { Button } from "@/registry/ui/button";
import { Input } from "@/registry/ui/input";

export interface NewsletterProps {
  title?: string;
  description?: string;
  /** Email or mobile number; decides placeholder, keyboard and validation. */
  channel?: "email" | "sms";
  onSubscribe?: (value: string) => void | Promise<void>;
}

/** خبرنامه. One field and one button in a soft card; switches between email and SMS. */
export function NewsletterBlock({ title = "خبرنامه‌ی ما", description = "هر دو هفته یک ایمیل کوتاه، فقط وقتی حرف تازه‌ای داریم.", channel = "email", onSubscribe }: NewsletterProps) {
  const [done, setDone] = React.useState(false);
  const sms = channel === "sms";
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = String(new FormData(e.currentTarget).get("contact") ?? "");
    await onSubscribe?.(value);
    setDone(true);
  }
  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-8 text-center sm:p-10">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
        {done ? (
          <p role="status" className="mt-6 text-sm font-medium text-success">ثبت شد. اولین شماره به‌زودی می‌رسد.</p>
        ) : (
          <form onSubmit={submit} className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row">
            <Input
              name="contact"
              type={sms ? "tel" : "email"}
              inputMode={sms ? "numeric" : "email"}
              autoComplete={sms ? "tel" : "email"}
              dir="ltr"
              required
              aria-label={sms ? "شماره‌ی موبایل" : "ایمیل"}
              placeholder={sms ? "0912 000 0000" : "you@example.com"}
              className="flex-1"
            />
            <Button type="submit">عضویت</Button>
          </form>
        )}
        <p className="mt-3 text-xs text-muted-foreground">هر وقت خواستید با یک کلیک لغو می‌کنید.</p>
      </div>
    </section>
  );
}
