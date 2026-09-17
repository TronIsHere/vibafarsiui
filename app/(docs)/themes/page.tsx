import type { Metadata } from "next";
import { DesignSystems } from "@/components/landing/design-systems";

export const metadata: Metadata = {
  title: "سیستم‌های طراحی · وایب‌فارسی",
  description: "توکن رنگ و شعاع؛ «اعمال» کل سایت را عوض می‌کند.",
};

export default function ThemesIndex() {
  return <DesignSystems standalone />;
}
