import type { Metadata } from "next";
import { IconProposals } from "@/components/docs/icon-proposals";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "نشان · وایب‌فارسی",
  description: "دانلود نشان شمسه به‌صورت SVG و PNG برای فاویکون.",
  path: "/icons",
});

export default function IconsPage() {
  return <IconProposals />;
}
