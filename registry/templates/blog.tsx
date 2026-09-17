import { Breadcrumb } from "@/registry/ui/breadcrumb";
import { Avatar } from "@/registry/ui/avatar";
import { Badge } from "@/registry/ui/badge";
import { formatJalali } from "@/lib/jalali";

const toc = ["چرا فونت مهم است", "ارتفاع خط و اندازه", "اعداد فارسی", "جمع‌بندی"];

/** وبلاگ — صفحه‌ی مطلب با فهرست مطالب چسبان و تایپوگرافی خواندنی. */
export function BlogPost() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4"><span className="font-bold">وبلاگ وایب‌فارسی</span><span className="text-sm text-muted-foreground">مقاله‌ها</span></header>
      <main className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-4 py-10 lg:grid-cols-[1fr_220px]">
        <article>
          <Breadcrumb items={[{ label: "خانه", href: "#" }, { label: "تایپوگرافی", href: "#" }, { label: "فونت فارسی در وب" }]} />
          <div className="mt-5 flex items-center gap-2"><Badge variant="outline">تایپوگرافی</Badge><Badge variant="outline">راست‌چین</Badge></div>
          <h1 className="mt-3 text-3xl font-bold leading-[1.3] sm:text-4xl">فونت فارسی در وب: چه چیزی خوانایی را می‌سازد و چه چیزی خرابش می‌کند</h1>
          <div className="mt-5 flex items-center gap-3 text-sm text-muted-foreground">
            <Avatar name="نگار کریمی" size="sm" />
            <span>نگار کریمی</span>
            <span>·</span>
            <span>{formatJalali(new Date())}</span>
            <span>·</span>
            <span>۶ دقیقه مطالعه</span>
          </div>

          <div className="mt-8 max-w-[65ch] space-y-6 text-[17px] leading-[1.9] text-foreground/90">
            <p>بیشتر سایت‌های فارسی با یک فونت خوب شروع می‌کنند و با چند تصمیم کوچک خرابش می‌کنند: فاصله‌ی حروف، ارتفاع خط کم، و اعدادی که وسط جمله لاتین می‌شوند. این مطلب همان تصمیم‌ها را یکی‌یکی مرور می‌کند.</p>
            <h2 id="s1" className="text-xl font-bold text-foreground">چرا فونت مهم است</h2>
            <p>خط فارسی پیوسته است. حروف به هم می‌چسبند و شکل‌شان بسته به جای‌شان در کلمه عوض می‌شود. هر چیزی که این پیوستگی را به هم بزند، از letter-spacing گرفته تا فونت جایگزین سیستم، خواندن را کند می‌کند.</p>
            <h2 id="s2" className="text-xl font-bold text-foreground">ارتفاع خط و اندازه</h2>
            <p>متن فارسی در همان اندازه‌ی لاتین کوچک‌تر دیده می‌شود، چون بخش بزرگی از حروف زیر خط کرسی می‌نشیند. یک قدم بزرگ‌تر بگیرید و ارتفاع خط را حداقل ۱٫۸ بگذارید.</p>
            <blockquote className="border-s-2 border-foreground/30 ps-4 text-muted-foreground">قانون ساده: اگر با ۱۶ پیکسل لاتین راحت می‌خوانید، فارسی را ۱۷ بگذارید.</blockquote>
            <h2 id="s3" className="text-xl font-bold text-foreground">اعداد فارسی</h2>
            <p>«۱۲٬۴۵۰٬۰۰۰ تومان» را با «12,450,000 تومان» مقایسه کنید. دومی چشم را از جریان راست‌به‌چپ بیرون می‌کشد. اعداد را همان‌جا که تولید می‌شوند فارسی کنید، نه با CSS.</p>
            <h2 id="s4" className="text-xl font-bold text-foreground">جمع‌بندی</h2>
            <p>فونت درست، بدون فاصله‌ی حروف، با ارتفاع خط کافی و اعداد فارسی. همین چهار تصمیم، بیشترِ تفاوت را می‌سازد.</p>
          </div>

          <div className="mt-12 flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
            <Avatar name="نگار کریمی" size="lg" />
            <div><p className="font-semibold">نگار کریمی</p><p className="text-sm text-muted-foreground">طراح رابط کاربری. درباره‌ی تایپوگرافی فارسی و سیستم‌های طراحی می‌نویسد.</p></div>
          </div>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-8">
            <p className="text-xs font-medium text-muted-foreground">در این مقاله</p>
            <ol className="mt-3 space-y-2 border-s border-border text-sm">
              {toc.map((t, i) => <li key={t}><a href={`#s${i + 1}`} className={`-ms-px block border-s-2 ps-3 ${i === 0 ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{t}</a></li>)}
            </ol>
          </div>
        </aside>
      </main>
    </div>
  );
}
