import type { Metadata } from "next";
import { Blocks } from "@/components/landing/blocks";

export const metadata: Metadata = {
  title: "بلاک‌ها · وایب‌فارسی",
  description: "بخش‌های آماده‌ی صفحه مثل هیرو، قیمت، پرسش‌های متداول، آمار و کارت ورود.",
};

export default function BlocksIndex() {
  return <Blocks standalone />;
}
