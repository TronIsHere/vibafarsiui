import type { Metadata } from "next";
import { SubmitCodeForm } from "@/components/community/submit-code-form";
import { SectionHead } from "@/components/landing/section-head";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "فرستادن کامپوننت · جامعه‌ی وایب‌فارسی",
  description: "کامپوننت یا بلاک راست‌چین خودتون را بفرستید، پیش‌نمایش زنده‌ش را ببینید و بعد از بررسی با اسم خودتون در وایب‌فارسی منتشر کنید.",
  path: "/community/submit",
});

export default function SubmitComponentPage() {
  return (
    <div className="relative">
      <SectionHead
        eyebrow="جامعه"
        title="کامپوننت بفرستید"
        desc="کد را اینجا بنویسید یا پیست کنید و همون لحظه اجراش را ببینید. بعد از بررسی، با اسم و لینک‌های خودتون در صفحه‌ی جامعه منتشر میشه."
        href="/community/submit"
        standalone
      />
      <SubmitCodeForm />
    </div>
  );
}
