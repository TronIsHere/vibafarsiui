import type { Metadata } from "next";
import { Skills } from "@/components/landing/skills";
import { DocSection, Notes } from "@/components/docs/blocks";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "مهارت‌های فارسی برای Claude Code، Cursor و Codex · وایب‌فارسی",
  description:
    "فایل‌های SKILL.md و راهنمای مارک‌داون که به هوش مصنوعی فارسی محاوره‌ای و رسمی، متن رابط کاربری، تقویم شمسی، کد ملی و شبا، سئوی فارسی و رابط راست‌چین یاد می‌دهند. با یک دستور نصب می‌شود.",
  path: "/skills",
});

export default function SkillsIndex() {
  return (
    <div className="space-y-12">
      <Skills standalone />
      <DocSection id="how" title="مهارت چیه و چطور کار می‌کنه">
        <Notes
          notes={[
            "مهارت (Skill) یک پوشه با فایل SKILL.md هست. بالای فایل یک توضیح کوتاه داره که مدل با همان تصمیم می‌گیره کی این فایل را بخونه، پس لازم نیست هر بار توی پرامپت یادآوری کنید که فارسی باشه یا هفته از شنبه شروع بشه.",
            "با npx vibefarsi add <slug> فایل داخل .claude/skills پروژه نوشته میشه و Claude Code همان لحظه می‌بیندش. برای Cursor و Codex همان پوشه را در مسیر مهارت‌های آن ابزار بگذارید، یا یک خط در AGENTS.md به فایل اشاره کنید. راه دقیقش در صفحه‌ی هر مهارت هست.",
            "راهنماها (guide) فرانت‌متر ندارن و خودکار فعال نمیشن. آن‌ها را در docs پروژه بگذارید و از CLAUDE.md یا AGENTS.md به‌شون لینک بدید تا مدل در هر جلسه بخوندشون.",
            "متن مهارت‌ها انگلیسی با مثال فارسی هست، چون مدل‌ها دستور انگلیسی را دقیق‌تر اجرا می‌کنن. فایل مال شماست؛ لحن، فونت یا قانون‌هایی که با پروژه‌تون فرق داره را همان‌جا عوض کنید.",
          ]}
        />
      </DocSection>
    </div>
  );
}
