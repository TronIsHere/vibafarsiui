import type { Metadata } from "next";
import { DesignSystems } from "@/components/landing/design-systems";

export const metadata: Metadata = {
  title: "سیستم‌های طراحی · وایب‌فارسی",
  description: "توکن‌های رنگ و شعاع گوشه. دکمه‌ی «اعمال» کل سایت را با همان تم عوض می‌کند.",
};

export default function ThemesIndex() {
  return <DesignSystems standalone />;
}
