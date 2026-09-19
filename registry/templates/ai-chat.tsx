"use client";

import * as React from "react";
import { Check, Plus, Sparkles, Wrench } from "lucide-react";
import { PromptInput } from "@/registry/ui/prompt-input";
import { Avatar } from "@/registry/ui/avatar";
import { Badge } from "@/registry/ui/badge";
import { Kbd } from "@/registry/ui/kbd";
import { Button } from "@/registry/ui/button";

type Msg = {
  role: "user" | "assistant";
  text: string;
  tools?: { name: string; result: string[] }[];
};

const seed: Msg[] = [
  {
    role: "user",
    text: "یک فرم ثبت‌نام فارسی برای پنل بساز، با شماره‌ی موبایل و کد تأیید.",
  },
  {
    role: "assistant",
    text: "فرم ثبت‌نام ساخته شد: سه فیلد راست‌چین با فونت پروژه، اعتبارسنجی شماره‌ی موبایل ایرانی و ورودی کد تأیید ۶ رقمی با ارقام فارسی.",
    tools: [
      {
        name: "vibefarsi.get_design_rules()",
        result: ["فونت: IRANSans", "جهت: rtl", "اعداد: فارسی"],
      },
      {
        name: 'vibefarsi.get_component("input", "otp-field")',
        result: ["input.tsx", "otp-field.tsx"],
      },
    ],
  },
];

/** چت هوش مصنوعی: گفت‌وگو، فراخوانی ابزار و جعبه‌ی پرامپت چسبیده به پایین. */
export function AiChat() {
  const [msgs, setMsgs] = React.useState<Msg[]>(seed);
  const [loading, setLoading] = React.useState(false);

  function send(text: string) {
    setMsgs((m) => [...m, { role: "user", text }]);
    setLoading(true);
    window.setTimeout(() => {
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          text: "انجام شد. کد را در پنل «کد» ببینید و اگر چیزی باید عوض شود بگویید.",
        },
      ]);
      setLoading(false);
    }, 1400);
  }

  return (
    <div className="flex h-dvh flex-col bg-background text-foreground">
      <header className="flex h-14 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">گفت‌وگوی جدید</span>
          <Badge variant="outline" className="  text-[10px]">
            vibefarsi mcp
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="hidden sm:inline">گفت‌وگوی جدید</span>
          <Kbd keys={["⌘", "N"]} />
          <Button
            size="icon"
            variant="ghost"
            aria-label="گفت‌وگوی جدید"
            className="size-8"
          >
            <Plus />
          </Button>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 overflow-y-auto px-4 py-6">
        {msgs.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex items-start gap-3">
              <Avatar name="سارا" size="sm" />
              <p className="max-w-[80%] rounded-2xl rounded-ss-sm bg-secondary px-4 py-2.5 text-sm leading-7">
                {m.text}
              </p>
            </div>
          ) : (
            <div key={i} className="flex items-start gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-card">
                <Sparkles className="size-3.5" />
              </span>
              <div className="min-w-0 flex-1 space-y-3">
                {m.tools?.map((t) => (
                  <div
                    key={t.name}
                    className="rounded-xl border border-border bg-card"
                  >
                    <div className="flex items-center gap-2 border-b border-border px-3 py-2 text-xs">
                      <Wrench className="size-3.5 text-brand" />
                      <span className=" " dir="ltr">
                        {t.name}
                      </span>
                    </div>
                    <ul className="flex flex-wrap gap-x-4 gap-y-1 p-3 text-xs">
                      {t.result.map((r) => (
                        <li key={r} className="flex items-center gap-1.5">
                          <Check className="size-3 text-success" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <p className="text-sm leading-7">{m.text}</p>
              </div>
            </div>
          ),
        )}
        {loading && (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex size-7 items-center justify-center rounded-full border border-border bg-card">
              <Sparkles className="size-3.5" />
            </span>
            در حال نوشتن…
          </div>
        )}
      </div>

      <div className="border-t border-border bg-background/80 p-4 backdrop-blur">
        <div className="mx-auto max-w-3xl">
          <PromptInput
            loading={loading}
            onSubmit={send}
            onStop={() => setLoading(false)}
            placeholder="بپرسید یا بگویید چه بسازد…"
          />
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            Enter برای ارسال، Shift+Enter برای خط جدید
          </p>
        </div>
      </div>
    </div>
  );
}
