"use client";

import Link from "next/link";
import { Accordion } from "@/registry/ui/accordion";
import { PRODUCT_FAQ } from "@/lib/faq";
import { Section } from "./frame";

export function Faq() {
  return (
    <Section id="faq">
      <div className="grid gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-5 lg:gap-12">
        <div className="lg:col-span-2">
          <p className="text-xs text-muted-foreground">پرسش‌های متداول</p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">قبل از نصب، همین‌ها را بپرسید</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground sm:text-[15px]">
            اگر جواب‌تون این‌جا نیست، در{" "}
            <Link href="/docs" className="text-foreground underline-offset-4 hover:underline">
              شروع سریع
            </Link>{" "}
            یا{" "}
            <Link href="/about" className="text-foreground underline-offset-4 hover:underline">
              درباره
            </Link>{" "}
            دنبالش بگردید.
          </p>
        </div>
        <div className="lg:col-span-3">
          <Accordion
            defaultOpen={[PRODUCT_FAQ[0].id]}
            items={PRODUCT_FAQ.map((item) => ({
              id: item.id,
              title: item.q,
              content: <p className="text-sm leading-7 text-muted-foreground">{item.a}</p>,
            }))}
          />
        </div>
      </div>
    </Section>
  );
}
