import type { Metadata } from "next";
import { Catalog } from "@/components/landing/catalog";

export const metadata: Metadata = {
  title: "کامپوننت‌ها · وایب‌فارسی",
  description: "دکمه، ورودی، جدول، تقویم شمسی و بقیه، همه از پایه راست‌چین. هر کدام کد، پرامپت و راهنما دارد.",
};

export default function ComponentsIndex() {
  return <Catalog standalone />;
}
