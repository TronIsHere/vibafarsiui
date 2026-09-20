"use client";

import * as React from "react";
import { Clock, MapPin, Phone } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Field, Input } from "@/registry/ui/input";
import { Textarea } from "@/registry/ui/textarea";

export interface ContactInfo { address?: string; phone?: string; hours?: string }

export interface ContactBlockProps {
  title?: string;
  description?: string;
  info: ContactInfo;
  /** A map embed or image for the info card; a soft placeholder is drawn when absent. */
  map?: React.ReactNode;
  onSubmit?: (values: { name: string; phone: string; message: string }) => void | Promise<void>;
}

/** تماس با ما. Form on the right, address card with hours and a map slot on the left. */
export function ContactBlock({ title = "با ما در تماس باشید", description = "پیامتان را بنویسید، در کمتر از یک روز کاری جواب می‌دهیم.", info, map, onSubmit }: ContactBlockProps) {
  const [sent, setSent] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    await onSubmit?.({ name: String(fd.get("name") ?? ""), phone: String(fd.get("phone") ?? ""), message: String(fd.get("message") ?? "") });
    setBusy(false);
    setSent(true);
  }
  return (
    <section className="px-6 py-16">
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-5">
        <form onSubmit={submit} className="md:col-span-3">
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="mt-2 text-muted-foreground">{description}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Field label="نام" htmlFor="contact-name"><Input id="contact-name" name="name" required autoComplete="name" /></Field>
            <Field label="شماره‌ی موبایل" htmlFor="contact-phone"><Input id="contact-phone" name="phone" type="tel" inputMode="numeric" dir="ltr" required autoComplete="tel" placeholder="0912 000 0000" /></Field>
            <Field label="پیام" htmlFor="contact-message" className="sm:col-span-2"><Textarea id="contact-message" name="message" rows={5} required /></Field>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <Button type="submit" size="lg" disabled={busy || sent}>{sent ? "پیام ثبت شد" : busy ? "در حال ارسال…" : "ارسال پیام"}</Button>
            {sent && <p role="status" className="text-sm text-success">ممنون، به‌زودی تماس می‌گیریم.</p>}
          </div>
        </form>
        <aside className="overflow-hidden rounded-2xl border border-border bg-card md:col-span-2">
          <div className="h-40 bg-secondary">
            {map ?? <div aria-hidden className="size-full" style={{ backgroundImage: "linear-gradient(to right, oklch(from var(--foreground) l c h / 8%) 1px, transparent 1px), linear-gradient(to bottom, oklch(from var(--foreground) l c h / 8%) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />}
          </div>
          <dl className="space-y-4 p-5 text-sm">
            {info.address && <div className="flex gap-3"><dt className="sr-only">آدرس</dt><MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" /><dd className="leading-6">{info.address}</dd></div>}
            {info.phone && <div className="flex gap-3"><dt className="sr-only">تلفن</dt><Phone className="mt-0.5 size-4 shrink-0 text-muted-foreground" /><dd dir="ltr" className="text-end tabular-nums">{info.phone}</dd></div>}
            {info.hours && <div className="flex gap-3"><dt className="sr-only">ساعت کاری</dt><Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" /><dd className="leading-6">{info.hours}</dd></div>}
          </dl>
        </aside>
      </div>
    </section>
  );
}
