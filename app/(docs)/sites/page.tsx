import type { Metadata } from "next";
import { Sites } from "@/components/landing/sites";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "سایت‌های کامل راست‌چین React و Next.js · وایب‌فارسی",
  description: "وب‌سایت‌های چندصفحه‌ای آماده برای آژانس، نرم‌افزار، فروشگاه، کلینیک، رستوران و اقامتگاه، با هدر و فوتر مشترک، فرم‌های واقعی و نصب با یک دستور.",
  path: "/sites",
});

export default function SitesIndex() {
  return <Sites standalone />;
}
