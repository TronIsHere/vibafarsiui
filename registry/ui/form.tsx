"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { isIban, isIranMobile, isNationalId } from "@/lib/persian";

/* ---------- validators (Persian messages) ---------- */

export type Validator<V = unknown> = (value: V, values: Record<string, unknown>) => string | undefined;

export const rules = {
  required: (msg = "این فیلد الزامی است"): Validator => (v) => (v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0) ? msg : undefined),
  minLength: (n: number, msg?: string): Validator => (v) => (typeof v === "string" && v.length < n ? msg ?? `حداقل ${n} کاراکتر` : undefined),
  pattern: (re: RegExp, msg = "فرمت واردشده درست نیست"): Validator => (v) => (typeof v === "string" && v && !re.test(v) ? msg : undefined),
  mobile: (msg = "شماره‌ی موبایل معتبر نیست"): Validator => (v) => (typeof v === "string" && v && !isIranMobile(v) ? msg : undefined),
  iban: (msg = "شماره‌ی شبا معتبر نیست"): Validator => (v) => (typeof v === "string" && v && !isIban(v) ? msg : undefined),
  nationalId: (msg = "کد ملی معتبر نیست"): Validator => (v) => (typeof v === "string" && v && !isNationalId(v) ? msg : undefined),
  email: (msg = "ایمیل معتبر نیست"): Validator => (v) => (typeof v === "string" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? msg : undefined),
  equals: (other: string, msg = "مقدارها یکسان نیستند"): Validator => (v, all) => (v !== all[other] ? msg : undefined),
};

/* ---------- state ---------- */

export type Errors<T> = Partial<Record<keyof T, string>>;

export interface UseFormOptions<T extends Record<string, unknown>> {
  initial: T;
  /** Per-field rules, checked in order; the first failing message wins. */
  schema?: Partial<Record<keyof T, Validator[]>>;
  onSubmit: (values: T) => void | Promise<void>;
}

/**
 * useForm — a 60-line form state hook: values, an error map, touched flags,
 * `field(name)` to bind inputs, and `handleSubmit`. No form library.
 */
export function useForm<T extends Record<string, unknown>>({ initial, schema = {}, onSubmit }: UseFormOptions<T>) {
  const [values, setValues] = React.useState<T>(initial);
  const [errors, setErrors] = React.useState<Errors<T>>({});
  const [touched, setTouched] = React.useState<Partial<Record<keyof T, boolean>>>({});
  const [submitting, setSubmitting] = React.useState(false);

  const validateField = React.useCallback((name: keyof T, all: T): string | undefined => {
    for (const rule of schema[name] ?? []) {
      const msg = rule(all[name], all as Record<string, unknown>);
      if (msg) return msg;
    }
  }, [schema]);

  const validateAll = React.useCallback((all: T) => {
    const next: Errors<T> = {};
    (Object.keys(schema) as (keyof T)[]).forEach((k) => { const m = validateField(k, all); if (m) next[k] = m; });
    return next;
  }, [schema, validateField]);

  function setValue<K extends keyof T>(name: K, value: T[K]) {
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      if (touched[name]) setErrors((e) => ({ ...e, [name]: validateField(name, next) }));
      return next;
    });
  }

  function field<K extends keyof T>(name: K) {
    return {
      id: String(name),
      name: String(name),
      value: values[name] as T[K],
      error: touched[name] ? errors[name] : undefined,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | T[K]) =>
        setValue(name, (typeof e === "object" && e !== null && "target" in (e as object) ? (e as React.ChangeEvent<HTMLInputElement>).target.value : e) as T[K]),
      onBlur: () => { setTouched((t) => ({ ...t, [name]: true })); setErrors((e) => ({ ...e, [name]: validateField(name, values) })); },
    };
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const all = validateAll(values);
    setErrors(all);
    setTouched(Object.fromEntries(Object.keys(values).map((k) => [k, true])) as Partial<Record<keyof T, boolean>>);
    if (Object.keys(all).length) return;
    setSubmitting(true);
    try { await onSubmit(values); } finally { setSubmitting(false); }
  }

  return { values, errors, touched, submitting, setValue, setError: (n: keyof T, m?: string) => setErrors((e) => ({ ...e, [n]: m })), field, handleSubmit, reset: () => { setValues(initial); setErrors({}); setTouched({}); }, isValid: Object.keys(validateAll(values)).length === 0 };
}

/* ---------- layout ---------- */

/** Label + control + hint/error, wired with aria-describedby. */
export function FormField({ label, htmlFor, error, hint, required, className, children }: { label: React.ReactNode; htmlFor?: string; error?: string; hint?: React.ReactNode; required?: boolean; className?: string; children: React.ReactNode }) {
  const msgId = htmlFor ? `${htmlFor}-msg` : undefined;
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground/90">
        {label}
        {required && <span className="ms-1 text-destructive">*</span>}
      </label>
      {children}
      {(error || hint) && (
        <p id={msgId} role={error ? "alert" : undefined} className={cn("text-xs", error ? "text-destructive" : "text-muted-foreground")}>{error ?? hint}</p>
      )}
    </div>
  );
}

/** Summarises the error map above the submit button, linking to each field. */
export function FormErrors<T>({ errors, labels }: { errors: Errors<T>; labels: Partial<Record<keyof T, string>> }) {
  const entries = Object.entries(errors).filter(([, m]) => m) as [string, string][];
  if (!entries.length) return null;
  return (
    <ul role="alert" className="space-y-1 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs">
      {entries.map(([k, m]) => (
        <li key={k}><a href={`#${k}`} className="font-medium underline underline-offset-4">{labels[k as keyof T] ?? k}</a>: {m}</li>
      ))}
    </ul>
  );
}
