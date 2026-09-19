import type { Metadata } from "next";
import { Backgrounds } from "@/components/landing/backgrounds";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "پس‌زمینه‌ها · وایب‌فارسی",
  description: "الگو و نور کم‌کنتراست که متن فارسی روی آن خوانا می‌ماند.",
  path: "/backgrounds",
});

export default function Index() {
  return <Backgrounds standalone />;
}
