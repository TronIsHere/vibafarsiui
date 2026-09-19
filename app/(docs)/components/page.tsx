import type { Metadata } from "next";
import { Catalog } from "@/components/landing/catalog";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "کامپوننت‌های راست‌چین React و Next.js · وایب‌فارسی",
  description: "دکمه، ورودی، جدول و تقویم شمسی، همه از پایه راست‌چین. هر کدام کد، پرامپت انگلیسی و راهنمای نصب برای Next.js و React دارد.",
  path: "/components",
});

export default function ComponentsIndex() {
  return <Catalog standalone />;
}
