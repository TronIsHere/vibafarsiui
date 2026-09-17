import type { Metadata } from "next";
import { Catalog } from "@/components/landing/catalog";

export const metadata: Metadata = {
  title: "کامپوننت‌ها · وایب‌فارسی",
  description: "دکمه، ورودی، جدول، تقویم شمسی و بقیه؛ از پایه راست‌چین. کد، پرامپت و راهنما برای هر کدام.",
};

export default function ComponentsIndex() {
  return <Catalog standalone />;
}
