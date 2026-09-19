import type { Metadata } from "next";
import { Blocks } from "@/components/landing/blocks";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "بلاک‌های آماده‌ی صفحه راست‌چین · وایب‌فارسی",
  description: "هیرو، قیمت تومانی، پرسش‌های متداول، آمار و کارت ورود؛ بخش‌های کامل صفحه برای لندینگ فارسی React و Next.js.",
  path: "/blocks",
});

export default function BlocksIndex() {
  return <Blocks standalone />;
}
