import type { Metadata } from "next";
import { NotFoundView } from "@/components/landing/not-found-view";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "صفحه پیدا نشد · وایب‌فارسی",
  description:
    "این صفحه وجود ندارد. از خانه‌ی وایب‌فارسی یا فهرست کامپوننت‌ها ادامه دهید.",
  path: "/",
  index: false,
});

export default function NotFound() {
  return <NotFoundView />;
}
