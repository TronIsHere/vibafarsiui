/**
 * قالب‌های ایمیل راست‌چین. Email clients ignore most CSS, so these are
 * table-based HTML strings with inline styles and `dir="rtl"` on every
 * structural element. Render them server-side and send the string.
 */

const FONT = "Tahoma, 'Segoe UI', Arial, sans-serif";
const FA = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const fa = (v: string | number) => String(v).replace(/\d/g, (d) => FA[Number(d)]);
const toman = (n: number) => fa(n.toLocaleString("en-US")).replace(/,/g, "٬") + " تومان";

function shell(opts: { title: string; preheader?: string; body: string; footer?: string }) {
  return `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${opts.title}</title></head>
<body dir="rtl" style="margin:0;padding:0;background:#f4f4f5;font-family:${FONT};">
${opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;color:#f4f4f5;">${opts.preheader}</div>` : ""}
<table dir="rtl" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:24px 12px;">
  <tr><td align="center">
    <table dir="rtl" role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;border:1px solid #e4e4e7;">
      <tr><td dir="rtl" style="padding:24px 28px 0;text-align:right;font-size:18px;font-weight:bold;color:#18181b;">دکان</td></tr>
      <tr><td dir="rtl" style="padding:20px 28px 28px;text-align:right;font-size:15px;line-height:1.9;color:#27272a;">${opts.body}</td></tr>
      <tr><td dir="rtl" style="padding:16px 28px;border-top:1px solid #e4e4e7;text-align:right;font-size:12px;line-height:1.8;color:#71717a;">${opts.footer ?? "این ایمیل خودکار است؛ لطفاً به آن پاسخ ندهید. اگر این درخواست از طرف شما نبوده، همین ایمیل را نادیده بگیرید."}</td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

const button = (label: string, href = "#") =>
  `<table dir="rtl" role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0;"><tr><td style="background:#18181b;border-radius:10px;"><a href="${href}" style="display:inline-block;padding:12px 22px;color:#ffffff;text-decoration:none;font-weight:bold;font-size:14px;font-family:${FONT};">${label}</a></td></tr></table>`;

/** کد تأیید: بزرگ، LTR و قابل کپی. */
export function otpEmail({ name, code, minutes = 5 }: { name: string; code: string; minutes?: number }) {
  return shell({
    title: "کد تأیید",
    preheader: `کد تأیید شما: ${fa(code)}`,
    body: `<p style="margin:0 0 8px;">سلام ${name}،</p>
<p style="margin:0 0 16px;">برای ورود، این کد را وارد کنید. تا ${fa(minutes)} دقیقه معتبر است.</p>
<div dir="ltr" style="text-align:center;margin:8px 0 20px;"><span style="display:inline-block;padding:14px 24px;border-radius:12px;background:#f4f4f5;font-family:Consolas,Menlo,monospace;font-size:28px;letter-spacing:8px;color:#18181b;">${code}</span></div>
<p style="margin:0;color:#71717a;font-size:13px;">این کد را با کسی به اشتراک نگذارید؛ حتی اگر خودش را کارمند ما معرفی کند.</p>`,
  });
}

/** تأیید سفارش: جدول اقلام با تومان و لینک پیگیری. */
export function orderEmail({ name, orderId, items, shipping = 0 }: { name: string; orderId: number; items: { title: string; qty: number; price: number }[]; shipping?: number }) {
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const rows = items.map((i) => `<tr><td style="padding:10px 0;border-bottom:1px solid #f4f4f5;text-align:right;">${i.title} <span style="color:#71717a;">× ${fa(i.qty)}</span></td><td style="padding:10px 0;border-bottom:1px solid #f4f4f5;text-align:left;white-space:nowrap;">${toman(i.qty * i.price)}</td></tr>`).join("");
  return shell({
    title: `سفارش #${fa(orderId)} ثبت شد`,
    preheader: `سفارش شما ثبت شد و در حال آماده‌سازی است.`,
    body: `<p style="margin:0 0 8px;">سلام ${name}،</p>
<p style="margin:0 0 16px;">سفارش <strong>#${fa(orderId)}</strong> ثبت شد. تا ارسال، از همین ایمیل خبردارتان می‌کنیم.</p>
<table dir="rtl" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
${rows}
<tr><td style="padding:10px 0;text-align:right;color:#71717a;">هزینه‌ی ارسال</td><td style="padding:10px 0;text-align:left;">${shipping ? toman(shipping) : "رایگان"}</td></tr>
<tr><td style="padding:12px 0;text-align:right;font-weight:bold;border-top:1px solid #e4e4e7;">جمع کل</td><td style="padding:12px 0;text-align:left;font-weight:bold;border-top:1px solid #e4e4e7;">${toman(subtotal + shipping)}</td></tr>
</table>
${button("پیگیری سفارش")}`,
  });
}

/** بازیابی رمز: لینک یک‌بارمصرف. */
export function resetEmail({ name, minutes = 30 }: { name: string; minutes?: number }) {
  return shell({
    title: "بازیابی رمز عبور",
    body: `<p style="margin:0 0 8px;">سلام ${name}،</p>
<p style="margin:0;">درخواست تغییر رمز عبور رسید. با دکمه‌ی زیر رمز جدید بگذارید؛ لینک تا ${fa(minutes)} دقیقه معتبر است.</p>
${button("تغییر رمز عبور")}
<p style="margin:0;color:#71717a;font-size:13px;">اگر شما درخواست نداده‌اید، کاری لازم نیست؛ رمز فعلی‌تان تغییری نمی‌کند.</p>`,
  });
}

/** Preview helper for the docs: renders all three in isolated iframes. */
export function EmailPreview() {
  const samples = [
    { name: "کد تأیید", html: otpEmail({ name: "سارا", code: "482913" }) },
    { name: "تأیید سفارش", html: orderEmail({ name: "مریم", orderId: 14052, items: [{ title: "هدفون بی‌سیم مدل X۲", qty: 1, price: 1_890_000 }, { title: "کابل شارژ ۲ متری", qty: 2, price: 120_000 }], shipping: 45_000 }) },
    { name: "بازیابی رمز", html: resetEmail({ name: "علی" }) },
  ];
  return (
    <div className="grid min-h-dvh grid-cols-1 gap-4 bg-background p-4 text-foreground lg:grid-cols-3">
      {samples.map((s) => (
        <div key={s.name} className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
          <p className="border-b border-border px-3 py-2 text-xs font-semibold">{s.name}</p>
          <iframe title={s.name} srcDoc={s.html} className="h-[560px] w-full bg-white" />
        </div>
      ))}
    </div>
  );
}
