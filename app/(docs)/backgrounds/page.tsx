import type { Metadata } from "next";
import { Backgrounds } from "@/components/landing/backgrounds";

export const metadata: Metadata = {
  title: "پس‌زمینه‌ها · وایب‌فارسی",
  description: "الگو و نور کم‌کنتراست که متن فارسی روی آن خوانا می‌ماند.",
};

export default function Index() {
  return <Backgrounds standalone />;
}
