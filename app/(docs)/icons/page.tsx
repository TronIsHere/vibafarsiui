import type { Metadata } from "next";
import { IconProposals } from "@/components/docs/icon-proposals";

export const metadata: Metadata = {
  title: "نشان · وایب‌فارسی",
  description: "دانلود نشان شمسه به‌صورت SVG و PNG برای فاویکون.",
};

export default function IconsPage() {
  return <IconProposals />;
}
