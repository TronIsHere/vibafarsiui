import type { Metadata } from "next";
import { Templates } from "@/components/landing/templates";

export const metadata: Metadata = {
  title: "قالب‌ها · وایب‌فارسی",
  description: "صفحه‌های کامل از همین کامپوننت‌ها و توکن‌ها. تم را عوض کنید و همه‌ی صفحه‌ها با هم عوض می‌شوند.",
};

export default function TemplatesIndex() {
  return <Templates standalone />;
}
