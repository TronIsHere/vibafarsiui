import type { ComponentCat, ComponentDoc } from "./types";

export const componentCats: { key: ComponentCat | "all"; label: string }[] = [
  { key: "all", label: "همه" },
  { key: "form", label: "فرم" },
  { key: "display", label: "نمایش داده" },
  { key: "feedback", label: "بازخورد" },
  { key: "overlay", label: "پنجره و منو" },
  { key: "nav", label: "ناوبری" },
  { key: "data", label: "داده و نمودار" },
];

const ui = (slug: string) => `registry/ui/${slug}.tsx`;

export const components: ComponentDoc[] = [
  {
    slug: "button", name: "دکمه", cat: "form", file: ui("button"), deps: ["lucide-react"],
    desc: "واریانت‌ها، اندازه‌ها و حالت غیرفعال. آیکون کنار متن می‌نشیند، در جهت درست.",
    usage: `import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

<Button>ثبت سفارش</Button>
<Button variant="outline" size="sm">انصراف</Button>
<Button variant="brand"><Plus />محصول جدید</Button>`,
    props: [
      { name: "variant", type: '"default" | "secondary" | "outline" | "ghost" | "brand" | "destructive"', default: '"default"', desc: "سبک دکمه. default سفید و اصلی است." },
      { name: "size", type: '"sm" | "md" | "lg" | "icon"', default: '"md"', desc: "ارتفاع و پدینگ؛ icon مربع است." },
      { name: "disabled", type: "boolean", desc: "غیرفعال با کاهش شفافیت." },
    ],
    notes: ["آیکون را قبل از متن بگذارید؛ در RTL خودش سمت راست می‌نشیند.", "برای عمل مخرب از destructive و برای عمل ثانویه از outline استفاده کنید؛ در هر بخش فقط یک دکمه‌ی default."],
    promptBullets: ["Variants default, secondary, outline, ghost, destructive and sizes sm/md/lg/icon.", "Icons sized with [&_svg]:size-4 and gap-2 from the label.", "Disabled: opacity-50 and pointer-events-none; active: scale-[0.98]."],
  },
  {
    slug: "input", name: "ورودی", cat: "form", file: ui("input"),
    desc: "ورودی متن با برچسب، پیشوند/پسوند و پیام خطا. فیلد موبایل خودش چپ‌چین می‌شود.",
    usage: `import { Input, Field } from "@/components/ui/input"

<Field label="نام و نام خانوادگی" htmlFor="name">
  <Input id="name" placeholder="مثلاً: سارا محمدی" />
</Field>

<Field label="شماره‌ی موبایل" htmlFor="phone" hint="کد تأیید به این شماره پیامک می‌شود">
  <Input id="phone" dir="ltr" inputMode="tel" startAddon="+98" placeholder="912 345 6789" />
</Field>`,
    props: [
      { name: "startAddon", type: "ReactNode", desc: "محتوای ابتدای فیلد (سمت راست در RTL)، مثل پیش‌شماره." },
      { name: "endAddon", type: "ReactNode", desc: "محتوای انتهای فیلد، مثل واحد یا آیکون." },
      { name: "error", type: "string", desc: "پیام خطا زیر فیلد؛ aria-invalid را هم می‌گذارد." },
      { name: "dir", type: '"rtl" | "ltr"', default: "ارث‌بری", desc: "برای موبایل، ایمیل و کد از ltr استفاده کنید." },
    ],
    notes: ["برچسب همیشه بالا و با htmlFor وصل باشد؛ placeholder جای برچسب نیست.", "برای شماره‌ی موبایل dir=\"ltr\" و inputMode=\"tel\" بگذارید تا کیبورد عددی و ترتیب رقم‌ها درست باشد."],
    promptBullets: ["Input with startAddon, endAddon, and error props; Field wraps the label and hint.", "dir=\"ltr\" for phone and email so the value is left-aligned while the form stays RTL.", "Error: a mild red border and a text-xs message under the field."],
  },
  {
    slug: "textarea", name: "متن چندخطی", cat: "form", file: ui("textarea"),
    desc: "متن چندخطی با شمارنده‌ی کاراکتر فارسی و ارتفاع خودکار.",
    usage: `import { Textarea } from "@/components/ui/textarea"

<Textarea placeholder="پیام‌تان را بنویسید…" maxLength={200} showCount autoResize />`,
    props: [
      { name: "autoResize", type: "boolean", default: "false", desc: "ارتفاع با محتوا زیاد می‌شود." },
      { name: "showCount", type: "boolean", default: "false", desc: "شمارنده‌ی «۲۴ / ۲۰۰» زیر فیلد (به maxLength نیاز دارد)." },
    ],
    promptBullets: ["Character counter with Persian digits, left side under the field (text-end).", "Auto-height by measuring scrollHeight with resize-none."],
  },
  {
    slug: "select", name: "انتخاب", cat: "form", file: ui("select"), deps: ["lucide-react"],
    desc: "فهرست انتخاب بومی با ظاهر سفارشی؛ شورون سمت چپ.",
    usage: `import { Select } from "@/components/ui/select"

<Select
  placeholder="شهر را انتخاب کنید"
  options={[{ value: "thr", label: "تهران" }, { value: "mhd", label: "مشهد" }]}
  defaultValue=""
/>`,
    props: [
      { name: "options", type: "{ value; label; disabled? }[]", desc: "گزینه‌ها." },
      { name: "placeholder", type: "string", desc: "گزینه‌ی غیرفعال اول." },
    ],
    notes: ["روی موبایل، فهرست بومی سیستم‌عامل باز می‌شود؛ برای جست‌وجو از Combobox استفاده کنید."],
    promptBullets: ["Use a native <select> with appearance-none and put the chevron at end-3 (left in RTL).", "End padding pe-9 for the chevron; ps-3 for the text."],
  },
  {
    slug: "combobox", name: "کمبوباکس", cat: "form", file: ui("combobox"), deps: ["lucide-react"],
    desc: "ورودی با پیشنهادهای زنده؛ اول تطبیق پیشوند، بعد شامل‌بودن.",
    usage: `import { Combobox } from "@/components/ui/combobox"

const cities = ["اصفهان", "اهواز", "اراک", "اردبیل", "تهران", "تبریز"]
<Combobox options={cities} placeholder="نام شهر…" onChange={setCity} />`,
    props: [
      { name: "options", type: "string[]", desc: "همه‌ی گزینه‌ها؛ فیلتر داخل کامپوننت انجام می‌شود." },
      { name: "value / onChange", type: "string / (v) => void", desc: "کنترل‌شده یا آزاد." },
      { name: "emptyText", type: "string", default: '"چیزی پیدا نشد"', desc: "متن حالت خالی." },
    ],
    promptBullets: ["Two-stage filter: options that start with the query first, then those that contain it.", "Highlight the matched span of each option (font-semibold).", "Up/down, Enter, Escape; role=combobox and aria-expanded."],
  },
  {
    slug: "otp-field", name: "کد تأیید", cat: "form", file: ui("otp-field"),
    desc: "شش خانه‌ی جدا، ارقام فارسی، چسباندن خودکار از پیامک.",
    usage: `import { OtpField } from "@/components/ui/otp-field"

<OtpField length={6} onComplete={(code) => verify(code)} />`,
    props: [
      { name: "length", type: "number", default: "6", desc: "تعداد خانه‌ها." },
      { name: "onComplete", type: "(code: string) => void", desc: "وقتی همه‌ی خانه‌ها پر شد؛ کد با ارقام لاتین برمی‌گردد." },
      { name: "value / onChange", type: "string", desc: "حالت کنترل‌شده." },
    ],
    notes: ["خانه‌ها LTR چیده می‌شوند چون کد از پیامک به همان ترتیب خوانده می‌شود.", "autoComplete=\"one-time-code\" روی خانه‌ی اول، پیشنهاد کد از پیامک را در iOS و اندروید فعال می‌کند."],
    promptBullets: ["Cell layout dir=\"ltr\" but each glyph is a Persian digit; the submitted value uses Latin digits.", "Accept Persian and Latin digits from the keyboard; Backspace on an empty cell moves to the previous one.", "Paste fills every cell and fires onComplete."],
  },
  {
    slug: "number-field", name: "عدد", cat: "form", file: ui("number-field"), deps: ["lucide-react"],
    desc: "افزایش و کاهش با دکمه، ارقام فارسی، حداقل و حداکثر.",
    usage: `import { NumberField } from "@/components/ui/number-field"

<NumberField defaultValue={1} min={1} max={9} aria-label="تعداد" />`,
    props: [
      { name: "min / max / step", type: "number", desc: "محدوده و گام." },
      { name: "value / onChange", type: "number", desc: "حالت کنترل‌شده." },
    ],
    promptBullets: ["\"+\" button at the start (right) and \"−\" at the end; the number in the middle uses Persian digits.", "Manual input accepts Persian and Latin digits and stays in range."],
  },
  {
    slug: "checkbox-group", name: "گروه چک‌باکس", cat: "form", file: ui("checkbox"), deps: ["lucide-react"],
    desc: "چک‌باکس تکی با حالت نامشخص، و گروه با وضعیت مشترک.",
    usage: `import { Checkbox, CheckboxGroup } from "@/components/ui/checkbox"

<CheckboxGroup
  defaultValue={["ship"]}
  options={[
    { value: "ship", label: "ارسال رایگان" },
    { value: "gift", label: "بسته‌بندی هدیه", description: "۲۰ هزار تومان" },
  ]}
/>`,
    props: [
      { name: "checked", type: 'boolean | "indeterminate"', desc: "حالت نامشخص برای «انتخاب همه»." },
      { name: "label / description", type: "ReactNode", desc: "متن کنار جعبه." },
      { name: "options", type: "{ value; label; description?; disabled? }[]", desc: "برای CheckboxGroup." },
    ],
    promptBullets: ["Button with role=\"checkbox\" and aria-checked (including mixed); box first, then the label.", "CheckboxGroup returns an array of selected values."],
  },
  {
    slug: "radio-group", name: "گروه رادیویی", cat: "form", file: ui("radio-group"),
    desc: "یک انتخاب از چند گزینه، با توضیح زیر هر کدام و واریانت کارتی.",
    usage: `import { RadioGroup } from "@/components/ui/radio-group"

<RadioGroup
  variant="cards"
  defaultValue="post"
  options={[
    { value: "post", label: "پست پیشتاز", description: "۳ تا ۵ روز کاری" },
    { value: "bike", label: "پیک موتوری", description: "امروز، فقط تهران" },
  ]}
/>`,
    props: [
      { name: "variant", type: '"list" | "cards"', default: '"list"', desc: "کارتی برای انتخاب روش ارسال یا پلن." },
      { name: "options", type: "{ value; label; description?; disabled? }[]", desc: "گزینه‌ها." },
    ],
    promptBullets: ["role=\"radiogroup\" and role=\"radio\"; in RTL ArrowLeft moves to the next option.", "cards variant: the whole card is clickable, active option has a stronger border."],
  },
  {
    slug: "switch", name: "کلید", cat: "form", file: ui("switch"),
    desc: "روشن و خاموش با انیمیشن؛ در RTL دستگیره سمت درست می‌رود.",
    usage: `import { Switch } from "@/components/ui/switch"

<label className="flex items-center justify-between">
  <span>اعلان ایمیلی</span>
  <Switch defaultChecked onCheckedChange={setEmail} />
</label>`,
    props: [
      { name: "checked / defaultChecked", type: "boolean", desc: "کنترل‌شده یا آزاد." },
      { name: "onCheckedChange", type: "(checked: boolean) => void", desc: "هنگام تغییر." },
    ],
    notes: ["در RTL حالت «روشن» یعنی دستگیره سمت چپ؛ با translate منفی پیاده شده تا با dir هماهنگ بماند."],
    promptBullets: ["role=\"switch\" with aria-checked; the thumb moves left when on (RTL).", "On: bg-primary thumb bg-primary-foreground; off: bg-input thumb bg-foreground."],
  },
  {
    slug: "slider", name: "اسلایدر", cat: "form", file: ui("slider"),
    desc: "بازه با یک دستگیره و برچسب مقدار؛ پرشدن مسیر از راست.",
    usage: `import { Slider } from "@/components/ui/slider"
import { formatToman } from "@/lib/utils"

<Slider label="حداکثر قیمت" min={100_000} max={10_000_000} step={100_000} defaultValue={6_500_000} format={formatToman} />`,
    props: [
      { name: "format", type: "(v: number) => string", default: "ارقام فارسی", desc: "قالب برچسب، مثلاً formatToman." },
      { name: "min / max / step", type: "number", desc: "محدوده." },
    ],
    promptBullets: ["Use a native input[type=range] and fill the track from the right with linear-gradient(to left …).", "Value label uses Persian digits and is swappable via a format prop."],
  },
  {
    slug: "rating", name: "امتیاز", cat: "form", file: ui("rating"), deps: ["lucide-react"],
    desc: "ستاره‌ها از راست پر می‌شوند؛ پیش‌نمایش با هاور.",
    usage: `import { Rating } from "@/components/ui/rating"

<Rating defaultValue={4} showValue onChange={setScore} />
<Rating value={4} readOnly size="sm" />`,
    props: [
      { name: "max", type: "number", default: "5", desc: "تعداد ستاره." },
      { name: "readOnly", type: "boolean", desc: "فقط نمایش." },
      { name: "showValue", type: "boolean", desc: "«۴ از ۵» کنار ستاره‌ها." },
    ],
    promptBullets: ["First star is on the right (natural RTL order); hover fills up to that star.", "role=\"radiogroup\" with labels «۱ ستاره» through «۵ ستاره»."],
  },
  {
    slug: "file-upload", name: "آپلود فایل", cat: "form", file: ui("file-upload"), deps: ["lucide-react"],
    desc: "کشیدن و رها کردن، فهرست فایل با حجم فارسی و حد اندازه.",
    usage: `import { FileUpload } from "@/components/ui/file-upload"

<FileUpload accept=".pdf,.png" maxSize={5 * 1024 * 1024} hint="PDF یا PNG، تا ۵ مگابایت" onFiles={setFiles} />`,
    props: [
      { name: "maxSize", type: "number", desc: "بایت؛ فایل بزرگ‌تر رد می‌شود و پیام فارسی می‌دهد." },
      { name: "onFiles", type: "(files: File[]) => void", desc: "فهرست فعلی پس از هر تغییر." },
    ],
    promptBullets: ["Drop zone with a dashed border that strengthens on dragover.", "File size via a Persian helper (کیلوبایت/مگابایت) and file name with dir=\"auto\"."],
  },
  {
    slug: "calendar", name: "تقویم شمسی", cat: "form", file: ui("calendar"), wide: true, deps: ["lucide-react"], registryDeps: ["jalali"],
    desc: "ماه و روز شمسی، جمعه‌ها خاکستری، امروز با حلقه. خروجی Date معمولی.",
    usage: `import { Calendar } from "@/components/ui/calendar"

<Calendar defaultValue={new Date()} onChange={(d) => console.log(formatJalali(d))} />`,
    props: [
      { name: "value / defaultValue", type: "Date | null", desc: "تاریخ انتخاب‌شده (Date میلادی معمولی)." },
      { name: "min / max", type: "Date", desc: "روزهای خارج از بازه غیرفعال می‌شوند." },
      { name: "markWeekend", type: "boolean", default: "true", desc: "جمعه‌ها کم‌رنگ." },
      { name: "compact", type: "boolean", desc: "نسخه‌ی کوچک برای پاپ‌آور." },
    ],
    notes: ["تبدیل تاریخ با الگوریتم جلالی بدون وابستگی در lib/jalali.ts؛ سال‌های کبیسه (مثل ۱۴۰۳) درست حساب می‌شوند.", "هفته از شنبه شروع می‌شود و ستون آخر جمعه است."],
    promptBullets: ["Week starts Saturday (ش ی د س چ پ ج), Fridays muted, today with a ring.", "Use the Jalali conversion helper (jalaali) and return a Date.", "Prev/next month buttons with chevrons; \"prev\" points right and \"next\" points left."],
  },
  {
    slug: "date-picker", name: "انتخاب تاریخ", cat: "form", file: ui("date-picker"), deps: ["lucide-react"], registryDeps: ["calendar"],
    desc: "ورودی تاریخ با تقویم شمسی در پاپ‌آور و پاک‌کردن سریع.",
    usage: `import { DatePicker } from "@/components/ui/date-picker"

<DatePicker placeholder="تاریخ ارسال" onChange={setDate} min={new Date()} />`,
    props: [
      { name: "clearable", type: "boolean", default: "true", desc: "دکمه‌ی × برای پاک کردن." },
      { name: "placeholder", type: "string", desc: "متن وقتی تاریخی انتخاب نشده." },
    ],
    promptBullets: ["An input-like button that shows the date as «چهارشنبه، ۲۵ شهریور ۱۴۰۵».", "Popover closes on outside click and Escape; start-0 under the field."],
  },
  {
    slug: "command", name: "پالت دستور", cat: "overlay", file: ui("command"), deps: ["lucide-react"],
    desc: "جست‌وجو و اجرای دستور با ⌘K، با گروه‌بندی و میانبر.",
    usage: `import { CommandDialog } from "@/components/ui/command"

const [open, setOpen] = useState(false)
<CommandDialog
  open={open}
  onOpenChange={setOpen}
  items={[
    { id: "new", label: "افزودن محصول", group: "عمل‌ها", shortcut: "N", onSelect: () => router.push("/products/new") },
    { id: "orders", label: "سفارش‌های امروز", group: "رفتن به", icon: ShoppingBag },
  ]}
/>`,
    props: [
      { name: "items", type: "CommandItem[]", desc: "id، label، icon، shortcut، keywords، group، onSelect." },
      { name: "open / onOpenChange", type: "boolean", desc: "برای CommandDialog؛ ⌘K و Ctrl+K خودکار وصل‌اند." },
    ],
    promptBullets: ["Filter on label and keywords; group with a small heading.", "Up/down and Enter; active item bg-accent with an Enter icon on the left.", "Dialog version opens with ⌘K and sits on a blurred overlay."],
  },
  {
    slug: "dialog", name: "پنجره", cat: "overlay", file: ui("dialog"), deps: ["lucide-react"],
    desc: "مودال با عنوان، بدنه و دکمه‌های عمل در جای درست؛ قفل اسکرول و بازگشت فوکوس.",
    usage: `import { Dialog } from "@/components/ui/dialog"

<Dialog
  open={open}
  onOpenChange={setOpen}
  title="ویرایش آدرس"
  description="آدرس پیش‌فرض ارسال را تغییر دهید."
  footer={<><Button onClick={save}>ذخیره</Button><Button variant="ghost" onClick={() => setOpen(false)}>انصراف</Button></>}
>
  <Input defaultValue="تهران، خیابان ولیعصر…" />
</Dialog>`,
    props: [
      { name: "open / onOpenChange", type: "boolean / (o) => void", desc: "کنترل باز و بسته." },
      { name: "title / description", type: "ReactNode", desc: "با aria-labelledby و aria-describedby وصل می‌شوند." },
      { name: "footer", type: "ReactNode", desc: "دکمه‌ها؛ دکمه‌ی اصلی اول." },
      { name: "role", type: '"dialog" | "alertdialog"', default: '"dialog"', desc: "alertdialog با کلیک بیرون بسته نمی‌شود." },
    ],
    promptBullets: ["Escape and overlay click close it; lock body scroll; move focus inside on open and restore on close.", "On mobile from the bottom (items-end), centered on desktop; close button in the top-left corner."],
  },
  {
    slug: "alert-dialog", name: "تأیید عمل", cat: "overlay", file: ui("alert-dialog"), registryDeps: ["dialog", "button"],
    desc: "پنجره‌ی تأیید برای کارهای برگشت‌ناپذیر؛ فوکوس اول روی «انصراف».",
    usage: `import { AlertDialog } from "@/components/ui/alert-dialog"

<AlertDialog
  open={open}
  onOpenChange={setOpen}
  title="این محصول حذف شود؟"
  description="این کار قابل بازگشت نیست."
  confirmText="حذف"
  destructive
  onConfirm={async () => { await deleteProduct(id) }}
/>`,
    props: [
      { name: "onConfirm", type: "() => void | Promise<void>", desc: "اگر Promise برگرداند، دکمه تا پایان «لطفاً صبر کنید…» می‌شود." },
      { name: "destructive", type: "boolean", desc: "دکمه‌ی تأیید قرمز." },
    ],
    promptBullets: ["role=\"alertdialog\"; initial focus on cancel, not delete.", "Confirm button disables while a Promise is pending, with waiting copy."],
  },
  {
    slug: "dropdown-menu", name: "منوی کشویی", cat: "overlay", file: ui("dropdown-menu"),
    desc: "منوی عمل با میانبر، جداکننده و آیتم خطرناک.",
    usage: `import { DropdownMenu } from "@/components/ui/dropdown-menu"

<DropdownMenu
  trigger={<Button variant="outline" size="icon"><MoreHorizontal /></Button>}
  items={[
    { label: "ویرایش", icon: Pencil, shortcut: "E" },
    { label: "کپی لینک", icon: Copy },
    { type: "separator" },
    { label: "حذف", icon: Trash2, danger: true, onSelect: remove },
  ]}
/>`,
    props: [
      { name: "items", type: "MenuItem[]", desc: "item | separator | label." },
      { name: "align", type: '"start" | "end"', default: '"start"', desc: "تراز منو نسبت به دکمه." },
    ],
    promptBullets: ["Menu opens under the button at start-0; outside click and Escape close it.", "role=\"menu\"/\"menuitem\", up/down navigation, shortcut as kbd on the left."],
  },
  {
    slug: "tooltip", name: "راهنمای ابزار", cat: "overlay", file: ui("tooltip"),
    desc: "توضیح کوتاه هنگام هاور یا فوکوس؛ فقط CSS.",
    usage: `import { Tooltip } from "@/components/ui/tooltip"

<Tooltip content="افزودن به علاقه‌مندی‌ها">
  <Button size="icon" variant="outline" aria-label="علاقه‌مندی"><Star /></Button>
</Tooltip>`,
    props: [
      { name: "content", type: "ReactNode", desc: "متن راهنما." },
      { name: "side", type: '"top" | "bottom"', default: '"top"', desc: "سمت نمایش." },
    ],
    promptBullets: ["No JavaScript: show with group-hover and group-focus-within.", "role=\"tooltip\" wired with aria-describedby."],
  },
  {
    slug: "sheet", name: "کشو", cat: "overlay", file: ui("sheet"), deps: ["lucide-react"],
    desc: "پنل کناری که از سمت راست باز می‌شود؛ برای فیلتر، سبد و منوی موبایل.",
    usage: `import { Sheet } from "@/components/ui/sheet"

<Sheet open={open} onOpenChange={setOpen} title="فیلترها">
  …
</Sheet>`,
    props: [
      { name: "side", type: '"start" | "end" | "bottom"', default: '"start"', desc: "start در RTL یعنی راست." },
    ],
    promptBullets: ["Slide in from the right with inset-y-0 start-0; bottom variant has rounded top corners for mobile.", "Escape and overlay close it; title via aria-labelledby."],
  },
  {
    slug: "tabs", name: "تب‌ها", cat: "nav", file: ui("tabs"),
    desc: "تب‌های بخش‌بندی‌شده یا خطی؛ با کیبورد کار می‌کنند و جهت راست‌چین را رعایت می‌کنند.",
    usage: `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

<Tabs defaultValue="preview">
  <TabsList aria-label="نمایش">
    <TabsTrigger value="preview">پیش‌نمایش</TabsTrigger>
    <TabsTrigger value="code">کد</TabsTrigger>
  </TabsList>
  <TabsContent value="preview">…</TabsContent>
  <TabsContent value="code">…</TabsContent>
</Tabs>`,
    props: [
      { name: "variant", type: '"segmented" | "underline"', default: '"segmented"', desc: "ظاهر فهرست تب‌ها." },
      { name: "value / defaultValue / onValueChange", type: "string", desc: "کنترل تب فعال." },
    ],
    promptBullets: ["role=\"tablist\"/\"tab\"/\"tabpanel\" with aria-controls; only the active tab is tabIndex=0.", "In RTL ArrowLeft moves to the next tab (to the left)."],
  },
  {
    slug: "pagination", name: "صفحه‌بندی", cat: "nav", file: ui("pagination"), deps: ["lucide-react"],
    desc: "شماره‌ی صفحه‌ها با ارقام فارسی، سه‌نقطه، و فلش در جهت راست‌چین.",
    usage: `import { Pagination } from "@/components/ui/pagination"

<Pagination page={page} total={12} onChange={setPage} />`,
    props: [
      { name: "page / total", type: "number", desc: "صفحه‌ی فعلی (از ۱) و تعداد کل." },
      { name: "siblings", type: "number", default: "1", desc: "چند شماره دور صفحه‌ی فعلی." },
    ],
    promptBullets: ["\"Previous\" with a right chevron and \"Next\" with a left chevron; aria-current=\"page\" on the current page.", "Ellipsis algorithm: always 1 and last, plus neighbors."],
  },
  {
    slug: "breadcrumb", name: "مسیر", cat: "nav", file: ui("breadcrumb"), deps: ["lucide-react"],
    desc: "مسیر صفحه‌ی فعلی؛ جداکننده‌ها به سمت چپ.",
    usage: `import { Breadcrumb } from "@/components/ui/breadcrumb"

<Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "فروشگاه", href: "/shop" }, { label: "هدفون بی‌سیم" }]} />`,
    props: [{ name: "items", type: "{ label; href? }[]", desc: "آخرین آیتم صفحه‌ی فعلی است و لینک نمی‌شود." }],
    promptBullets: ["nav with aria-label=\"مسیر\" and an ol; ChevronLeft separator; last item aria-current=\"page\"."],
  },
  {
    slug: "stepper", name: "مراحل", cat: "nav", file: ui("stepper"), wide: true, deps: ["lucide-react"],
    desc: "گام‌های فرم چندمرحله‌ای، افقی یا عمودی، از راست به چپ.",
    usage: `import { Stepper } from "@/components/ui/stepper"

<Stepper current={1} steps={[{ label: "سبد" }, { label: "آدرس", description: "کجا بفرستیم؟" }, { label: "پرداخت" }]} />`,
    props: [
      { name: "current", type: "number", desc: "شاخص گام فعلی (از صفر)." },
      { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', desc: "جهت چیدمان." },
    ],
    promptBullets: ["Completed steps get a check and bg-primary, current step a ring, others a gray border.", "Connector line between circles; aria-current=\"step\" on the current step."],
  },
  {
    slug: "sidebar", name: "نوار کناری", cat: "nav", file: ui("sidebar"), deps: ["lucide-react"],
    desc: "ناوبری اپ با گروه، نشان و بخش جمع‌شونده.",
    usage: `import { Sidebar, SidebarGroup, SidebarItem } from "@/components/ui/sidebar"

<Sidebar header={<Logo />}>
  <SidebarItem icon={Home} label="خانه" href="/" />
  <SidebarGroup title="فروشگاه" collapsible>
    <SidebarItem icon={ShoppingBag} label="سفارش‌ها" badge={12} active />
    <SidebarItem icon={Package} label="محصولات" />
  </SidebarGroup>
</Sidebar>`,
    props: [
      { name: "active", type: "boolean", desc: "آیتم صفحه‌ی فعلی با aria-current." },
      { name: "badge", type: "number | string", desc: "شمارنده با ارقام فارسی." },
      { name: "collapsible", type: "boolean", desc: "گروه باز و بسته شود." },
    ],
    promptBullets: ["aside on the right; active item bg-accent; numeric badge with Persian digits.", "Collapsible group with a chevron that rotates 90deg when closed."],
  },
  {
    slug: "toast", name: "اعلان", cat: "feedback", file: ui("toast"), deps: ["lucide-react"],
    desc: "پشته‌ی اعلان: چند اعلان روی هم با سقف تعداد، «بستن همه»، جایگاه قابل تنظیم؛ با Provider و هوک.",
    usage: `// app/layout.tsx
import { ToastProvider } from "@/components/ui/toast"
<ToastProvider>{children}</ToastProvider>

// هر جای دیگر
const { toast } = useToast()
toast({ title: "تغییرات ذخیره شد", variant: "success", action: { label: "واگرد", onClick: undo } })`,
    props: [
      { name: "toast(options)", type: "{ title; description?; variant?; action?; duration? }", desc: "نمایش اعلان؛ duration پیش‌فرض ۴۰۰۰ میلی‌ثانیه." },
      { name: "variant", type: '"default" | "success" | "error"', desc: "آیکون و رنگ." },
      { name: "ToastProvider max / position", type: 'number / "bottom-start" | "bottom-end" | "top-start" | "top-end"', default: '3 / "bottom-start"', desc: "سقف اعلان‌های هم‌زمان و گوشه." },
    ],
    notes: ["اعلان‌ها در گوشه‌ی پایین راست (start) می‌نشینند؛ همان جایی که چشم فارسی‌خوان اول می‌رود.", "با بیش از یک اعلان، دکمه‌ی «بستن همه» ظاهر می‌شود؛ قدیمی‌ترها با رسیدن به سقف حذف می‌شوند."],
    promptBullets: ["ToastProvider with useToast; aria-live=\"polite\" region at bottom-right (bottom-4 start-4).", "Card with a status icon, title, description, action, and close; short enter animation from the right."],
  },
  {
    slug: "alert", name: "هشدار", cat: "feedback", file: ui("alert"), deps: ["lucide-react"],
    desc: "پیام درون‌صفحه‌ای برای اطلاع، موفقیت، توجه و خطا.",
    usage: `import { Alert } from "@/components/ui/alert"

<Alert variant="success" title="پرداخت با موفقیت انجام شد">رسید به شماره‌ی ۰۹۱۲۳۴۵۶۷۸۹ پیامک شد.</Alert>
<Alert variant="destructive" title="پرداخت ناموفق">موجودی کارت کافی نیست.</Alert>`,
    props: [
      { name: "variant", type: '"info" | "success" | "warning" | "destructive"', default: '"info"', desc: "رنگ و آیکون." },
      { name: "icon", type: "Component", desc: "آیکون سفارشی به‌جای پیش‌فرض." },
    ],
    promptBullets: ["Icon at the start (right), bold title, body text-foreground/80.", "variant=destructive uses role=\"alert\"; others role=\"status\"."],
  },
  {
    slug: "progress", name: "پیشرفت", cat: "feedback", file: ui("progress"),
    desc: "نوار پیشرفت که از راست پر می‌شود، با درصد فارسی.",
    usage: `import { Progress } from "@/components/ui/progress"

<Progress value={72} label="آپلود فایل‌ها" showValue />`,
    props: [
      { name: "value / max", type: "number", desc: "مقدار و بیشینه (پیش‌فرض ۱۰۰)." },
      { name: "showValue", type: "boolean", desc: "درصد با ارقام فارسی سمت چپ." },
    ],
    promptBullets: ["role=\"progressbar\" with aria-valuenow; fill with width and a transition.", "Percent with Persian «٪» and Persian digits."],
  },
  {
    slug: "skeleton", name: "اسکلت", cat: "feedback", file: ui("skeleton"),
    desc: "جای خالی ضربان‌دار یا درخشان، تا داده برسد.",
    usage: `import { Skeleton, SkeletonRow } from "@/components/ui/skeleton"

<Skeleton className="h-24 w-full rounded-lg" shimmer />
<SkeletonRow />`,
    props: [{ name: "shimmer", type: "boolean", desc: "موج نور به‌جای ضربان." }],
    promptBullets: ["Two modes: pulse and shimmer (gradient moving right to left); aria-hidden."],
  },
  {
    slug: "empty-state", name: "حالت خالی", cat: "feedback", file: ui("empty-state"), deps: ["lucide-react"],
    desc: "وقتی هنوز داده‌ای نیست؛ با توضیح و دکمه‌ی قدم بعدی.",
    usage: `import { EmptyState } from "@/components/ui/empty-state"

<EmptyState title="هنوز سفارشی ندارید" description="اولین محصول را اضافه کنید تا این‌جا پر شود." action={<Button size="sm">افزودن محصول</Button>} />`,
    props: [
      { name: "icon", type: "Component", default: "Inbox", desc: "آیکون بالای متن." },
      { name: "action", type: "ReactNode", desc: "دکمه‌ی عمل پیشنهادی." },
    ],
    promptBullets: ["Dashed border, icon in a gray circle, short title and description, and one button."],
  },
  {
    slug: "badge", name: "نشان", cat: "display", file: ui("badge"),
    desc: "برچسب وضعیت؛ فقط متن رنگی، بدون پس‌زمینه و آیکون.",
    usage: `import { Badge } from "@/components/ui/badge"

<Badge variant="success">فعال</Badge>
<Badge variant="warning">در انتظار</Badge>`,
    props: [{ name: "variant", type: '"default" | "secondary" | "outline" | "success" | "warning" | "brand" | "destructive"', default: '"default"', desc: "رنگ متن." }],
    promptBullets: ["Text only, no background and no icon; text-xs and font-medium.", "Color from the variant token: success, warning, brand, destructive."],
  },
  {
    slug: "avatar", name: "آواتار", cat: "display", file: ui("avatar"),
    desc: "تصویر دایره‌ای؛ اگر نباشد حرف اول سفید با حلقه‌ی سفید روی پس‌زمینه‌ی شفاف.",
    usage: `import { Avatar, AvatarGroup } from "@/components/ui/avatar"

<Avatar name="سارا محمدی" src="/avatars/sara.jpg" />
<Avatar name="علی رضایی" />
<AvatarGroup people={[{ name: "سارا", src: "/avatars/sara.jpg" }, { name: "علی", src: "/avatars/ali.jpg" }, { name: "نگار" }, { name: "رضا" }, { name: "مینا" }]} max={4} />`,
    props: [
      { name: "name", type: "string", desc: "title و حرف اول وقتی تصویر نیست." },
      { name: "src", type: "string", desc: "آدرس تصویر؛ اگر نباشد حرف اول سفید." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', desc: "اندازه." },
    ],
    promptBullets: ["If src is set, a circular image only, no fill or gradient.", "If there is no image, a white first letter, a white ring, and a transparent background.", "AvatarGroup overlaps with -ms-2 and a «+۱۲ نفر دیگر» trailer."],
  },
  {
    slug: "table", name: "جدول", cat: "display", file: ui("table"), wide: true,
    desc: "ستون‌ها از راست، مبلغ‌ها با تومان، سطرها با هاور.",
    usage: `import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"

<Table>
  <TableHeader><TableRow><TableHead>مشتری</TableHead><TableHead>مبلغ</TableHead></TableRow></TableHeader>
  <TableBody>
    <TableRow><TableCell>مریم احمدی</TableCell><TableCell numeric>{formatToman(2_890_000)}</TableCell></TableRow>
  </TableBody>
</Table>`,
    props: [{ name: "numeric", type: "boolean", desc: "روی TableCell: ارقام هم‌عرض برای ستون مبلغ." }],
    promptBullets: ["th with text-start; header row on a muted background; rows hover:bg-accent/40.", "Numeric cells tabular-nums and amounts with «تومان»."],
  },
  {
    slug: "stat", name: "آمار", cat: "display", file: ui("stat"), deps: ["lucide-react"],
    desc: "عدد کلیدی با تغییر نسبت به دوره‌ی قبل.",
    usage: `import { Stat } from "@/components/ui/stat"

<Stat label="درآمد این ماه" value={faNumber(216_000_000)} unit="تومان" delta={18} />`,
    props: [
      { name: "delta", type: "number", desc: "درصد تغییر؛ منفی قرمز و رو به پایین." },
      { name: "unit", type: "ReactNode", desc: "واحد کنار عدد." },
    ],
    promptBullets: ["Growth arrow points up-left (ArrowUpLeft) because \"forward\" in RTL is left.", "Positive text-success, negative text-destructive."],
  },
  {
    slug: "price", name: "قیمت", cat: "display", file: ui("price"),
    desc: "عدد با جداکننده‌ی هزارگان، تخفیف و واحد.",
    usage: `import { Price } from "@/components/ui/price"

<Price amount={12_450_000} original={14_900_000} />`,
    props: [
      { name: "amount / original", type: "number", desc: "قیمت فعلی و قبلی؛ درصد تخفیف خودکار حساب می‌شود." },
      { name: "unit", type: "string", default: '"تومان"', desc: "واحد." },
    ],
    promptBullets: ["Separator «٬» (U+066C), unit after the number, original price line-through, discount percent in a badge."],
  },
  {
    slug: "timeline", name: "خط زمان", cat: "display", file: ui("timeline"), registryDeps: ["jalali"],
    desc: "رویدادها با تاریخ شمسی، خط در سمت راست.",
    usage: `import { Timeline } from "@/components/ui/timeline"

<Timeline items={[{ date: new Date(), title: "سفارش تحویل شد" }, { date: "۲۳ شهریور", title: "بسته ارسال شد" }]} />`,
    props: [
      { name: "items", type: "{ date: Date | string; title; description? }[]", desc: "Date به شمسی تبدیل می‌شود." },
      { name: "activeIndex", type: "number", default: "0", desc: "رویداد پررنگ." },
    ],
    promptBullets: ["Vertical line with border-s on the right and dots on it; date under the title as text-xs."],
  },
  {
    slug: "accordion", name: "آکاردئون", cat: "display", file: ui("accordion"), deps: ["lucide-react"],
    desc: "پرسش‌های متداول؛ شورون در سمت چپ، ارتفاع با CSS grid انیمیت می‌شود.",
    usage: `import { Accordion } from "@/components/ui/accordion"

<Accordion items={[{ id: "free", title: "آیا رایگان است؟", content: "بله، بدون پلن پولی." }]} defaultOpen={["free"]} />`,
    props: [
      { name: "multiple", type: "boolean", desc: "چند پنل هم‌زمان باز باشند." },
      { name: "defaultOpen", type: "string[]", desc: "شناسه‌ی پنل‌های باز اولیه." },
    ],
    promptBullets: ["Height animation via grid-template-rows: 0fr → 1fr, no measuring.", "Button with aria-expanded and aria-controls; chevron on the left that rotates 180deg."],
  },
  {
    slug: "kbd", name: "کلید میانبر", cat: "display", file: ui("kbd"),
    desc: "نمایش میانبرهای کیبورد، همیشه چپ‌به‌راست.",
    usage: `import { Kbd } from "@/components/ui/kbd"

<Kbd keys={["⌘", "K"]} />`,
    props: [{ name: "keys", type: "string[]", desc: "کلیدها به ترتیب فشردن." }],
    promptBullets: ["dir=\"ltr\" on the container so «⌘ K» reads in the right order; mono font and a 1px bottom shadow."],
  },
  {
    slug: "prompt-input", name: "جعبه‌ی پرامپت", cat: "form", file: ui("prompt-input"), wide: true, deps: ["lucide-react"],
    desc: "ورودی چت هوش مصنوعی: بزرگ‌شونده، پیوست، مدل و دکمه‌ی ارسال/توقف.",
    usage: `import { PromptInput } from "@/components/ui/prompt-input"

<PromptInput loading={streaming} onSubmit={send} onStop={stop} placeholder="یک فرم ثبت‌نام فارسی بساز…" />`,
    props: [
      { name: "onSubmit", type: "(value: string) => void", desc: "Enter یا دکمه‌ی ارسال؛ Shift+Enter خط جدید." },
      { name: "loading / onStop", type: "boolean / () => void", desc: "در حال تولید: دکمه‌ی توقف نشان داده می‌شود." },
      { name: "tools", type: "ReactNode", desc: "جایگزین انتخاب مدل در نوار ابزار." },
    ],
    promptBullets: ["Textarea auto-grows up to 200px; Enter submits, Shift+Enter is a newline, ignore isComposing.", "Send button at the end (left) and tools at the start (right); loading shows a square stop button."],
  },
  {
    slug: "card", name: "کارت", cat: "display", file: ui("card"),
    desc: "کادر محتوا با سربرگ، عنوان و توضیح.",
    usage: `import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

<Card>
  <CardHeader><CardTitle>هدف ماهانه</CardTitle><CardDescription>۷۲٪ از ۳۰۰ میلیون تومان</CardDescription></CardHeader>
  <CardContent>…</CardContent>
</Card>`,
    promptBullets: ["1px border from the border token, card background, radius from --radius; no heavy shadow."],
  },
  {
    slug: "data-table", name: "جدول داده", cat: "data", file: ui("data-table"), wide: true, deps: ["lucide-react"], registryDeps: ["table", "pagination", "skeleton", "empty-state", "input"],
    desc: "مرتب‌سازی، فیلتر متنی، ستون‌های تومانی، اسکلت بارگذاری، حالت خالی و صفحه‌بندی؛ همه در سمت کلاینت.",
    usage: `import { DataTable, type Column } from "@/components/ui/data-table"

const columns: Column<Order>[] = [
  { key: "customer", header: "مشتری", sortable: true },
  { key: "amount", header: "مبلغ", sortable: true, numeric: true, cell: (o) => formatToman(o.amount) },
  { key: "status", header: "وضعیت", cell: (o) => <Badge>{o.status}</Badge> },
]
<DataTable rows={orders} columns={columns} rowKey={(o) => o.id} searchKeys={["customer"]} pageSize={8} />`,
    props: [
      { name: "columns", type: "Column<T>[]", desc: "key، header، sortable، numeric، cell، className." },
      { name: "searchKeys", type: "(keyof T)[]", desc: "فیلدهای جست‌وجو؛ ارقام فارسی و لاتین یکی حساب می‌شوند." },
      { name: "loading", type: "boolean", desc: "ردیف‌های اسکلتی به‌جای داده." },
      { name: "pageSize", type: "number", default: "8", desc: "تعداد در هر صفحه." },
      { name: "toolbar", type: "ReactNode", desc: "فیلترهای اضافه کنار جست‌وجو." },
    ],
    notes: ["مرتب‌سازی رشته‌ها با localeCompare('fa') تا ترتیب الفبای فارسی درست باشد؛ ستون‌های numeric عددی مرتب می‌شوند.", "جست‌وجو قبل از مقایسه ارقام فارسی را لاتین می‌کند؛ «۱۴۰۵۲» و «14052» هر دو پیدا می‌شوند."],
    promptBullets: ["Columns from config (key/header/sortable/numeric/cell); header click cycles asc, desc, unsorted and sets aria-sort.", "Text filter on searchKeys with Persian-digit normalization; loading uses Skeleton, empty uses EmptyState inside a colSpan row.", "Pagination with Persian digits and «صفحه‌ی ۲ از ۵»."],
  },
  {
    slug: "chart", name: "نمودار", cat: "data", file: ui("chart"), wide: true, registryDeps: ["jalali"],
    desc: "نمودار میله‌ای، خطی و اسپارک‌لاین با SVG خالص؛ برچسب‌های شمسی، هفته از شنبه، تیک‌های فارسی، محور مقدار سمت راست.",
    usage: `import { BarChart, LineChart, Sparkline, jalaliWeekLabels, jalaliDayLabels } from "@/components/ui/chart"

const week = jalaliWeekLabels() // ["ش","ی","د","س","چ","پ","ج"] ending today
<BarChart data={week.map((label, i) => ({ label, value: sales[i] }))} highlight={6} />
<LineChart data={jalaliDayLabels(10).map((label, i) => ({ label, value: visits[i] }))} />
<Sparkline data={[3, 5, 4, 8, 7, 9]} />`,
    props: [
      { name: "data", type: "{ label: string; value: number }[]", desc: "نقطه‌ها؛ اولی سمت راست رسم می‌شود." },
      { name: "format", type: "(n) => string", default: "compactFa", desc: "قالب تیک‌ها: «۱۲ میلیون»، «۸۰۰ هزار»." },
      { name: "highlight", type: "number", desc: "شاخص میله‌ی برجسته (مثلاً امروز)." },
      { name: "height", type: "number", default: "180", desc: "ارتفاع viewBox." },
    ],
    notes: ["بدون کتابخانه‌ی نمودار؛ SVG با viewBox و عرض ۱۰۰٪. برای داشبوردهای سنگین همین هندسه را می‌توان به Recharts منتقل کرد.", "jalaliWeekLabels از شنبه شروع نمی‌کند؛ هفت روز اخیر را با نام روز شمسی برمی‌گرداند. برای هفته‌ی تقویمی ثابت از JALALI_WEEKDAYS_SHORT استفاده کنید."],
    promptBullets: ["x of the first point is on the right (x = width − pad − (i+1)·slot) and the value axis labels sit on the right edge.", "\"Nice\" ticks (1, 2, 2.5, 5 × power of 10) and compact Persian formatting; simple hover tooltip.", "Time labels from the Jalali calendar; weekly short names ش to ج."],
  },
  {
    slug: "popover", name: "پاپ‌آور", cat: "overlay", file: ui("popover"),
    desc: "پنل کوچک چسبیده به دکمه؛ با کلیک بیرون و Escape بسته می‌شود.",
    usage: `import { Popover } from "@/components/ui/popover"

<Popover trigger={<Button variant="outline">فیلتر</Button>} align="start">
  …
</Popover>`,
    props: [{ name: "side / align", type: '"top"|"bottom" / "start"|"center"|"end"', default: "bottom / start", desc: "جهت و تراز نسبت به دکمه." }, { name: "open / onOpenChange", type: "boolean", desc: "حالت کنترل‌شده." }],
    promptBullets: ["role=dialog and aria-expanded on the button; start-0 means flush with the button's right edge in RTL.", "z-40 and a short enter animation; no positioning library."],
  },
  {
    slug: "context-menu", name: "منوی راست‌کلیک", cat: "overlay", file: ui("context-menu"), registryDeps: ["dropdown-menu"],
    desc: "منو در نقطه‌ی راست‌کلیک باز می‌شود؛ همان آیتم‌های منوی کشویی.",
    usage: `import { ContextMenu } from "@/components/ui/context-menu"

<ContextMenu items={[{ label: "ویرایش", icon: Pencil }, { type: "separator" }, { label: "حذف", danger: true }]}>
  <div className="rounded-xl border p-8">راست‌کلیک کنید</div>
</ContextMenu>`,
    promptBullets: ["onContextMenu preventDefault and store relative coords; menu is absolute at that point.", "Close on outside click, Escape, and scroll."],
  },
  {
    slug: "hover-card", name: "کارت شناور", cat: "overlay", file: ui("hover-card"),
    desc: "با نگه‌داشتن ماوس یا فوکوس باز می‌شود؛ برای پیش‌نمایش پروفایل.",
    usage: `import { HoverCard } from "@/components/ui/hover-card"

<HoverCard trigger={<a href="#" className="underline">@negar</a>}>
  <ProfilePreview />
</HoverCard>`,
    props: [{ name: "openDelay / closeDelay", type: "number", default: "300 / 150", desc: "تأخیر باز و بسته شدن (میلی‌ثانیه)." }],
    promptBullets: ["Open/close timers with delay so a fast mouse pass does not open it; open immediately on focus."],
  },
  {
    slug: "carousel", name: "اسلایدر", cat: "display", file: ui("carousel"), wide: true, deps: ["lucide-react"],
    desc: "اسکرول‌اسنپ بومی راست‌چین: اولین اسلاید سمت راست، «بعدی» به چپ می‌رود. نه آینه‌ی یک اسلایدر چپ‌چین.",
    usage: `import { Carousel } from "@/components/ui/carousel"

<Carousel slideWidth={0.5}>
  {products.map((p) => <ProductCard key={p.id} {...p} />)}
</Carousel>`,
    props: [{ name: "slideWidth", type: "number", default: "1", desc: "سهم هر اسلاید از عرض (۰٫۵ = دو تا در دید)." }, { name: "showDots", type: "boolean", default: "true", desc: "نقطه‌های پایین." }],
    notes: ["در مرورگرهای امروزی scrollLeft ظرف RTL از صفر شروع می‌شود و منفی می‌رود؛ همین باعث می‌شود «بعدی» = scrollTo(left منفی) باشد."],
    promptBullets: ["Flex container with snap-x snap-mandatory and overflow-x-auto; slides are shrink-0 snap-start.", "Active index from Math.abs(scrollLeft) / slide width; previous button on the right with a right chevron, next on the left with a left chevron."],
  },
  {
    slug: "combobox-async", name: "کمبوباکس آنلاین", cat: "form", file: ui("combobox-async"), deps: ["lucide-react"],
    desc: "جست‌وجوی سرور با debounce، لغو درخواست‌های قدیمی، و حالت‌های بارگذاری/خالی/خطا؛ برای شهر و محصول.",
    usage: `import { ComboboxAsync } from "@/components/ui/combobox-async"

<ComboboxAsync
  placeholder="نام شهر…"
  loadOptions={async (q, signal) => {
    const res = await fetch(\`/api/cities?q=\${encodeURIComponent(q)}\`, { signal })
    return res.json() // [{ value, label, hint }]
  }}
  onChange={setCity}
/>`,
    props: [{ name: "loadOptions", type: "(q, signal) => Promise<Option[]>", desc: "با signal درخواست قدیمی را لغو کنید." }, { name: "debounce / minChars", type: "number", default: "250 / 1", desc: "تأخیر و حداقل حروف." }],
    promptBullets: ["AbortController per search; ignore responses from aborted requests.", "Three list states: «در حال جست‌وجو…», «چیزی پیدا نشد», «خطا در دریافت»; spinner at the end of the field.", "Highlight the matched span; use ZWJ so Persian letter joining does not break."],
  },
  {
    slug: "password-input", name: "رمز عبور", cat: "form", file: ui("password-input"), deps: ["lucide-react"],
    desc: "نمایش/پنهان کردن، همیشه چپ‌چین، و سنجش قدرت با برچسب فارسی.",
    usage: `import { PasswordInput } from "@/components/ui/password-input"

<PasswordInput strength placeholder="حداقل ۸ کاراکتر" />`,
    props: [{ name: "strength", type: "boolean", desc: "نوار چهارقسمتی و برچسب «ضعیف تا عالی»." }],
    promptBullets: ["Field dir=ltr so characters appear in typing order; eye button with aria-pressed.", "Strength from length, upper/lower case, digits, and symbols; bar color from destructive to success."],
  },
  {
    slug: "iban-input", name: "شماره‌ی شبا", cat: "form", file: ui("iban-input"), deps: ["lucide-react"], registryDeps: ["persian"],
    desc: "پیشوند ثابت IR، گروه‌بندی چهارتایی، اعتبارسنجی mod-97 و تشخیص بانک.",
    usage: `import { IbanInput } from "@/components/ui/iban-input"

<IbanInput onChange={(iban, valid) => setIban(valid ? iban : null)} />`,
    props: [{ name: "onChange", type: "(iban, valid) => void", desc: "شبا نرمال‌شده (IR + ۲۴ رقم) و اعتبار." }],
    notes: ["الگوریتم: رشته‌ی بعد از IR + «1827» + دو رقم کنترل، پیمانه‌ی ۹۷ باید ۱ شود. نام بانک از سه رقم بعد از ارقام کنترل."],
    promptBullets: ["Fixed IR outside the input; input is 24 digits grouped every 4 with font-mono.", "mod-97 validation and bank name from the three-digit code; show the error only when all 24 digits are filled."],
  },
  {
    slug: "phone-input", name: "شماره‌ی موبایل", cat: "form", file: ui("phone-input"), deps: ["lucide-react"], registryDeps: ["persian"],
    desc: "+۹۸ ثابت در چپ، گروه ۳-۳-۴، تشخیص اپراتور، پذیرش ارقام فارسی و صفر اول.",
    usage: `import { PhoneInput } from "@/components/ui/phone-input"

<PhoneInput onChange={(digits, valid) => valid && setPhone(digits)} />`,
    props: [{ name: "onChange", type: "(digits, valid) => void", desc: "ده رقم ملی («912…») و اعتبار." }],
    promptBullets: ["Normalize: strip +98, 0098, and a leading zero; convert Persian digits to Latin.", "Operator from the prefix (همراه اول، ایرانسل، رایتل); inputMode=tel and autoComplete=tel-national."],
  },
  {
    slug: "notification-inbox", name: "صندوق اعلان", cat: "feedback", file: ui("notification-inbox"), deps: ["lucide-react"], registryDeps: ["popover", "persian"],
    desc: "زنگ با شمارنده‌ی نخوانده و پنل گروه‌بندی‌شده به امروز/دیروز/قدیمی‌تر؛ زمان نسبی فارسی.",
    usage: `import { NotificationInbox } from "@/components/ui/notification-inbox"

<NotificationInbox items={notifications} onRead={markRead} onReadAll={markAllRead} />`,
    props: [{ name: "items", type: "Notification[]", desc: "id، title، description، date، read، icon، href." }],
    promptBullets: ["Group by day difference from today; relative time like «۵ دقیقه پیش» and «دیروز».", "All/unread tabs, a «خواندن همه» button, brand dot on unread items."],
  },
  {
    slug: "form", name: "فرم", cat: "form", file: ui("form"), registryDeps: ["persian"],
    desc: "useForm شصت‌خطی: مقدارها، نقشه‌ی خطا، اعتبارسنج‌های فارسی (موبایل، شبا، کد ملی) و FormField؛ بدون کتابخانه‌ی فرم.",
    usage: `import { useForm, rules, FormField, FormErrors } from "@/components/ui/form"

const form = useForm({
  initial: { name: "", phone: "", nationalId: "" },
  schema: { name: [rules.required()], phone: [rules.required(), rules.mobile()], nationalId: [rules.nationalId()] },
  onSubmit: async (values) => save(values),
})

<form onSubmit={form.handleSubmit} className="space-y-4">
  <FormField label="نام" htmlFor="name" error={form.field("name").error} required>
    <Input {...form.field("name")} />
  </FormField>
  <FormErrors errors={form.errors} labels={{ name: "نام", phone: "موبایل" }} />
  <Button type="submit" disabled={form.submitting}>ثبت</Button>
</form>`,
    props: [
      { name: "useForm({ initial, schema, onSubmit })", type: "hook", desc: "values، errors، touched، field(name)، handleSubmit، reset، isValid." },
      { name: "rules", type: "required · minLength · pattern · mobile · iban · nationalId · email · equals", desc: "پیام‌های فارسی پیش‌فرض، قابل تغییر." },
      { name: "FormField", type: "component", desc: "برچسب، ستاره‌ی الزامی، پیام خطا با role=alert." },
    ],
    promptBullets: ["Hook with useState; validate a field after blur and every field on submit; the first failing rule supplies the message.", "field(name) returns id/name/value/onChange/onBlur/error so it spreads onto Input.", "FormErrors is a summary of errors with links to the fields."],
  },
];
