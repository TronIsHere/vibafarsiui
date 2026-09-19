import type { Metadata } from "next";
import { DesignSystems } from "@/components/landing/design-systems";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "سیستم‌های طراحی و توکن رنگ · وایب‌فارسی",
  description: "توکن‌های رنگ و شعاع گوشه برای رابط فارسی. دکمه‌ی اعمال کل سایت را با همان تم عوض می‌کند و انتخاب در مرورگر می‌ماند.",
  path: "/themes",
});

export default function ThemesIndex() {
  return <DesignSystems standalone />;
}
