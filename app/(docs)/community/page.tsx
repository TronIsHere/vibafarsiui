import type { Metadata } from "next";
import { CodeCard } from "@/components/community/cards";
import { CommunityNav, EmptyState } from "@/components/community/community-nav";
import { SectionHead } from "@/components/landing/section-head";
import { listSubmissions } from "@/lib/community/store";
import type { CodeSubmission } from "@/lib/community/types";
import { pageMetadata } from "@/lib/site";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = pageMetadata({
  title: "کامپوننت‌های جامعه · وایب‌فارسی",
  description: "کامپوننت‌ها و بلاک‌های راست‌چینی که برنامه‌نویس‌های فارسی‌زبان ساختن، با پیش‌نمایش زنده، کد کامل و اسم سازنده.",
  path: "/community",
});

export default async function CommunityPage() {
  const approved = await listSubmissions({ status: "approved" });
  const code = approved.filter((s): s is CodeSubmission => s.kind !== "showcase");
  const showcaseCount = approved.length - code.length;

  return (
    <div>
      <SectionHead
        eyebrow="جامعه"
        title="ساخته‌ی جامعه"
        desc="کامپوننت‌ها و بلاک‌هایی که بقیه‌ی برنامه‌نویس‌ها ساختن. همه‌شون زنده اجرا میشن و کدشون را می‌تونید کپی کنید. اگه چیزی ساختید که به درد بقیه می‌خوره، بفرستید تا با اسم خودتون اینجا منتشر بشه."
        href="/community"
        standalone
      />
      <CommunityNav active="community" counts={{ community: code.length, showcase: showcaseCount }} />
      <div className="pt-6">
        {code.length === 0 ? (
          <EmptyState
            title="هنوز چیزی منتشر نشده"
            desc="اولین کامپوننت جامعه می‌تونه مال شما باشه. کد را بفرستید، پیش‌نمایشش را همون‌جا ببینید و بعد از بررسی با اسم خودتون منتشر میشه."
            href="/community/submit"
            cta="اولین کامپوننت را بفرستید"
          />
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {code.map((item) => (
              <li key={item.id}>
                <CodeCard item={item} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
