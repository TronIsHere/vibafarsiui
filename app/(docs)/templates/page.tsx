import type { Metadata } from "next";
import { Templates } from "@/components/landing/templates";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "قالب‌های راست‌چین React و Next.js · وایب‌فارسی",
  description: "صفحه‌های کامل از همین کامپوننت‌ها و توکن‌ها: داشبورد، ورود پیامکی، فروشگاه و فاکتور شمسی. با عوض کردن تم همه با هم عوض می‌شوند.",
  path: "/templates",
});

export default function TemplatesIndex() {
  return <Templates standalone />;
}
