import type { Metadata } from "next";
import { Blocks } from "@/components/landing/blocks";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "بلاک‌های آماده‌ی صفحه راست‌چین · وایب‌فارسی",
  description: "نوار بالا، هیرو، قیمت تومانی، شبکه‌ی محصول، مقالات، تماس با ما و پابرگ. بخش‌های کامل صفحه برای لندینگ، فروشگاه و داشبورد فارسی با React و Next.js.",
  path: "/blocks",
});

export default function BlocksIndex() {
  return <Blocks standalone />;
}
