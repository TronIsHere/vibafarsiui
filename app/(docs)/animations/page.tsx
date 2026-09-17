import type { Metadata } from "next";
import { Animations } from "@/components/landing/animations";

export const metadata: Metadata = {
  title: "انیمیشن‌ها · وایب‌فارسی",
  description: "حرکت با CSS و React، بدون کتابخانه‌ی اضافه. همه از راست شروع می‌شوند.",
};

export default function Index() {
  return <Animations standalone />;
}
