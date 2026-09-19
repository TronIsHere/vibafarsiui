import type { Metadata } from "next";
import { Catalog } from "@/components/landing/catalog";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "کامپوننت‌ها · وایب‌فارسی",
  description: "دکمه، ورودی، جدول، تقویم شمسی و بقیه، همه از پایه راست‌چین. هر کدام کد، پرامپت و راهنما دارد.",
  path: "/components",
});

export default function ComponentsIndex() {
  return <Catalog standalone />;
}
