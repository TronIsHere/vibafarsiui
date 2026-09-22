"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, ImagePlus, Loader2, Send, X } from "lucide-react";
import { submitShowcase, type SubmitState } from "@/lib/community/actions";
import { LIMITS } from "@/lib/community/types";
import { Button } from "@/registry/ui/button";
import { Field, Input } from "@/registry/ui/input";
import { AuthorFields, Honeypot, emptyAuthor, type AuthorDraft } from "./author-fields";

export function SubmitShowcaseForm() {
  const [author, setAuthor] = React.useState<AuthorDraft>(emptyAuthor);
  const [fields, setFields] = React.useState({ title: "", url: "", description: "" });
  const [image, setImage] = React.useState<{ file: File; url: string } | null>(null);
  const [imageError, setImageError] = React.useState("");
  const [state, formAction, pending] = React.useActionState<SubmitState, FormData>(submitShowcase, { ok: false });
  const fileRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => () => {
    if (image) URL.revokeObjectURL(image.url);
  }, [image]);

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setImageError("");
    if (!file) return;
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
      setImageError("عکس باید PNG، JPG یا WebP باشه.");
      e.target.value = "";
      return;
    }
    if (file.size > LIMITS.imageBytes) {
      setImageError("حجم عکس باید کمتر از ۱٫۵ مگابایت باشه.");
      e.target.value = "";
      return;
    }
    setImage({ file, url: URL.createObjectURL(file) });
  }

  function clearImage() {
    setImage(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    React.startTransition(() => formAction(data));
  }

  if (state.ok) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-success/30 bg-success/5 px-6 py-14 text-center">
        <CheckCircle2 className="size-8 text-success" />
        <p className="text-lg font-semibold">رسید، ممنون!</p>
        <p className="max-w-md text-sm text-muted-foreground">
          بعد از بررسی، سایتتون در صفحه‌ی ساخته‌شده با وایب‌فارسی نشون داده میشه.
        </p>
        <Link href="/showcase" className="mt-2 inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm transition-colors hover:bg-accent">
          برگشت به صفحه‌ی سایت‌ها
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      <Honeypot />
      <section className="space-y-5">
        <h2 className="text-lg font-bold">سایت</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="اسم سایت یا محصول" htmlFor="title">
            <Input id="title" name="title" required minLength={3} maxLength={LIMITS.title} value={fields.title} onChange={(e) => setFields((f) => ({ ...f, title: e.target.value }))} />
          </Field>
          <Field label="آدرس" htmlFor="url">
            <Input id="url" name="url" required dir="ltr" inputMode="url" maxLength={LIMITS.url} placeholder="https://" value={fields.url} onChange={(e) => setFields((f) => ({ ...f, url: e.target.value }))} />
          </Field>
        </div>
        <Field label="توضیح کوتاه" htmlFor="description" hint="چی کار می‌کنه و از کدوم بخش‌های وایب‌فارسی استفاده کردید.">
          <Input id="description" name="description" maxLength={LIMITS.description} value={fields.description} onChange={(e) => setFields((f) => ({ ...f, description: e.target.value }))} />
        </Field>

        <Field label="عکس صفحه‌ی اصلی (اختیاری)" hint="PNG، JPG یا WebP تا ۱٫۵ مگابایت. نسبت ۱۶ به ۱۰ بهتر دیده میشه.">
          <input ref={fileRef} type="file" name="image" accept="image/png,image/jpeg,image/webp" onChange={pick} className="sr-only" id="image" />
          {image ? (
            <div className="relative overflow-hidden rounded-xl border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt="پیش‌نمایش عکس" className="aspect-[16/10] w-full object-cover object-top" />
              <button
                type="button"
                onClick={clearImage}
                aria-label="حذف عکس"
                className="absolute end-2 top-2 flex size-8 cursor-pointer items-center justify-center rounded-lg border border-border bg-background/80 backdrop-blur transition-colors hover:bg-accent"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <label
              htmlFor="image"
              className="flex aspect-[16/6] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              <ImagePlus className="size-6" />
              انتخاب عکس
            </label>
          )}
          {imageError && <p className="text-xs text-destructive">{imageError}</p>}
        </Field>
      </section>

      <AuthorFields value={author} onChange={(a) => setAuthor((v) => ({ ...v, ...a }))} />

      <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-6 text-muted-foreground">قبل از انتشار همه‌چیز دستی بررسی میشه.</p>
        <Button type="submit" variant="brand" disabled={pending} className="shrink-0">
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          فرستادن برای بررسی
        </Button>
      </div>
      {state.error && (
        <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}
    </form>
  );
}
