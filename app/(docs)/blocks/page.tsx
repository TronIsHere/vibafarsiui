import type { Metadata } from "next";
import { Blocks } from "@/components/landing/blocks";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "بلاک‌ها · وایب‌فارسی",
  description: "بخش‌های آماده‌ی صفحه مثل هیرو، قیمت، پرسش‌های متداول، آمار و کارت ورود.",
  path: "/blocks",
});

export default function BlocksIndex() {
  return <Blocks standalone />;
}
