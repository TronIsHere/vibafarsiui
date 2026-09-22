import type { Metadata } from "next";
import { ShowcaseCard } from "@/components/community/cards";
import { CommunityNav, EmptyState } from "@/components/community/community-nav";
import { SectionHead } from "@/components/landing/section-head";
import { listSubmissions } from "@/lib/community/store";
import type { ShowcaseSubmission } from "@/lib/community/types";
import { pageMetadata } from "@/lib/site";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = pageMetadata({
  title: "ساخته‌شده با وایب‌فارسی · جامعه",
  description: "سایت‌ها و محصول‌هایی که برنامه‌نویس‌های ایرانی با کامپوننت‌های وایب‌فارسی ساختن، با لینک مستقیم و اسم سازنده.",
  path: "/showcase",
});

export default async function ShowcasePage() {
  const approved = await listSubmissions({ status: "approved" });
  const sites = approved.filter((s): s is ShowcaseSubmission => s.kind === "showcase");

  return (
    <div>
      <SectionHead
        eyebrow="جامعه"
        title="ساخته‌شده با وایب‌فارسی"
        desc="سایت‌ها و محصول‌هایی که بقیه با وایب‌فارسی ساختن و لانچ کردن. اگه شما هم چیزی ساختید، معرفیش کنید تا اینجا دیده بشه."
        href="/showcase"
        standalone
      />
      <CommunityNav active="showcase" counts={{ community: approved.length - sites.length, showcase: sites.length }} />
      <div className="pt-6">
        {sites.length === 0 ? (
          <EmptyState
            title="هنوز سایتی معرفی نشده"
            desc="با وایب‌فارسی چیزی ساختید؟ لینکش را با یک عکس بفرستید تا اولین سایت این صفحه باشه."
            href="/showcase/submit"
            cta="سایتتون را معرفی کنید"
          />
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
            {sites.map((item) => (
              <li key={item.id}>
                <ShowcaseCard item={item} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
