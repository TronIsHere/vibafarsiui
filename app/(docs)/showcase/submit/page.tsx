import type { Metadata } from "next";
import { SubmitShowcaseForm } from "@/components/community/submit-showcase-form";
import { SectionHead } from "@/components/landing/section-head";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "معرفی سایت · ساخته‌شده با وایب‌فارسی",
  description: "سایت یا محصولی که با وایب‌فارسی ساختید را معرفی کنید تا با لینک و اسم خودتون در صفحه‌ی ساخته‌شده با وایب‌فارسی نشون داده بشه.",
  path: "/showcase/submit",
});

export default function SubmitShowcasePage() {
  return (
    <div className="relative">
      <SectionHead
        eyebrow="جامعه"
        title="سایتتون را معرفی کنید"
        desc="لینک سایت، یک توضیح کوتاه و یک عکس از صفحه‌ی اصلیش را بفرستید. بعد از بررسی در صفحه‌ی ساخته‌شده با وایب‌فارسی نشون داده میشه."
        href="/showcase/submit"
        standalone
      />
      <SubmitShowcaseForm />
    </div>
  );
}
