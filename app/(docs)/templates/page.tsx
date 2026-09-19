import type { Metadata } from "next";
import { Templates } from "@/components/landing/templates";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "قالب‌ها · وایب‌فارسی",
  description: "صفحه‌های کامل از همین کامپوننت‌ها و توکن‌ها. تم را عوض کنید و همه‌ی صفحه‌ها با هم عوض می‌شوند.",
  path: "/templates",
});

export default function TemplatesIndex() {
  return <Templates standalone />;
}
