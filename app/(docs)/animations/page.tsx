import type { Metadata } from "next";
import { Animations } from "@/components/landing/animations";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "انیمیشن CSS راست‌چین برای React · وایب‌فارسی",
  description: "انیمیشن با CSS و React، بدون کتابخانه‌ی اضافه. همه از راست شروع می‌شوند و با prefers-reduced-motion خاموش می‌شوند.",
  path: "/animations",
});

export default function Index() {
  return <Animations standalone />;
}
