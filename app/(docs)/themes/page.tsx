import type { Metadata } from "next";
import { DesignSystems } from "@/components/landing/design-systems";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "سیستم‌های طراحی · وایب‌فارسی",
  description: "توکن‌های رنگ و شعاع گوشه. دکمه‌ی «اعمال» کل سایت را با همان تم عوض می‌کند.",
  path: "/themes",
});

export default function ThemesIndex() {
  return <DesignSystems standalone />;
}
