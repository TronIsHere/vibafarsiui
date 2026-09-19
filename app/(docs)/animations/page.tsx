import type { Metadata } from "next";
import { Animations } from "@/components/landing/animations";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "انیمیشن‌ها · وایب‌فارسی",
  description: "انیمیشن با CSS و React، بدون کتابخانه‌ی اضافه. همه از راست شروع می‌شوند.",
  path: "/animations",
});

export default function Index() {
  return <Animations standalone />;
}
