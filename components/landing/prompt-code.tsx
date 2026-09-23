"use client";

import { useState, type ReactNode } from "react";
import { Bot, Code2 } from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";
import { cn } from "@/lib/utils";
import { Section } from "./frame";

export function PromptCode({
  code,
  codeBlock,
  prompt,
}: {
  /** Raw source, for the copy button. */
  code: string;
  /** `<CodeBlock>` rendered by the server parent (it can't be imported here). */
  codeBlock: ReactNode;
  prompt: string;
}) {
  const [tab, setTab] = useState<"code" | "prompt">("code");

  return (
    <Section id="prompt">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="flex flex-col justify-center px-5 py-10 sm:px-8 lg:col-span-5 lg:border-e lg:border-border lg:py-16">
          <p className="  text-xs text-muted-foreground">
            هر کامپوننت دو خروجی داره
          </p>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
            کد می‌خواید یا پرامپت؟
          </h2>
          <p className="mt-4 max-w-md text-sm text-muted-foreground sm:text-[15px]">
            اگر خودتون کد می‌زنید، فایل را کپی کنید و در پروژه بگذارید. همین دکمه‌ای که این‌جا می‌بینید کد واقعیه،
            نه یک نمونه. اگر با Cursor یا Claude کار می‌کنید، پرامپت انگلیسی را به آن بدید تا همین کامپوننت را با سبک
            پروژه‌تون بسازه. در هر دو حالت خروجی راست‌چین و فارسیه.
          </p>
          <ul className="mt-6 space-y-2 text-sm">
            {[
              ["کد", "TypeScript و Tailwind، بدون هیچ وابستگی اضافه"],
              ["پرامپت", "به انگلیسی، با قوانین راست‌چین و فارسی داخلش"],
            ].map(([k, v]) => (
              <li key={k} className="flex items-baseline gap-3">
                <span className="w-14 shrink-0   text-xs text-foreground/80">
                  {k}
                </span>
                <span className="text-muted-foreground">{v}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 p-3 sm:p-4 lg:col-span-7">
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-2 py-2">
              <div className="inline-flex rounded-lg bg-background p-0.5 text-sm">
                {(
                  [
                    { k: "code", l: "کد", I: Code2 },
                    { k: "prompt", l: "پرامپت", I: Bot },
                  ] as const
                ).map(({ k, l, I }) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setTab(k)}
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 transition-colors duration-200",
                      tab === k
                        ? "bg-secondary font-semibold text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <I className="size-3.5" />
                    {l}
                  </button>
                ))}
              </div>
              <div dir="ltr" className="flex items-center gap-2">
                <span className="  text-xs text-muted-foreground" dir="ltr">
                  {tab === "code" ? "button.tsx" : "button.prompt.md"}
                </span>
                <CopyButton text={tab === "code" ? code : prompt} />
              </div>
            </div>
            <div className="min-h-[400px]">
              {tab === "code" ? (
                codeBlock
              ) : (
                <pre
                  className="whitespace-pre-wrap p-5 font-sans text-[15px] leading-7 text-foreground/90 animate-fade-in"
                  dir="ltr"
                >
                  {prompt}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
