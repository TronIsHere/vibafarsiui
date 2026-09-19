import type { Metadata } from "next";
import { Backgrounds } from "@/components/landing/backgrounds";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "پس‌زمینه‌های کم‌کنتراست برای متن فارسی · وایب‌فارسی",
  description: "الگو و نور کم‌کنتراست که خط فارسی روی آن خوانا می‌ماند. شیدرهای WebGL رنگ را از توکن تم می‌گیرند.",
  path: "/backgrounds",
});

export default function Index() {
  return <Backgrounds standalone />;
}
