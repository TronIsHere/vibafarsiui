import { Printer } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/ui/table";
import { Badge } from "@/registry/ui/badge";
import { Button } from "@/registry/ui/button";
import { fa, faNumber, formatToman } from "@/lib/utils";
import { tomanToWords } from "@/lib/number-to-words";
import { formatJalali } from "@/lib/jalali";

const items = [
  { name: "هدفون بی‌سیم مدل X۲", qty: 1, price: 1_890_000 },
  { name: "کابل شارژ ۲ متری", qty: 2, price: 120_000 },
  { name: "قاب محافظ", qty: 1, price: 240_000 },
];

/** فاکتور — قابل چاپ، با تاریخ شمسی و جمع‌های تومانی. دکمه‌ها در چاپ پنهان می‌شوند. */
export function InvoicePage() {
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;
  return (
    <div className="min-h-dvh bg-background px-4 py-10 text-foreground print:bg-white print:py-0">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between print:hidden">
          <h1 className="text-lg font-bold">پیش‌فاکتور</h1>
          <Button variant="outline" size="sm">
            <Printer />
            چاپ
          </Button>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 print:border-0 print:p-0 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
            <div>
              <p className="text-xl font-bold">فروشگاه دکان</p>
              <p className="mt-1 text-xs text-muted-foreground">
                تهران، خیابان ولیعصر، پلاک ۱۲۰
              </p>
              <p className="text-xs text-muted-foreground" dir="ltr">
                021-8800 0000
              </p>
            </div>
            <div className="text-end text-sm">
              <p>
                <span className="text-muted-foreground">شماره‌ی فاکتور:</span>{" "}
                <span className=" ">#{fa(14052)}</span>
              </p>
              <p>
                <span className="text-muted-foreground">تاریخ:</span>{" "}
                {formatJalali(new Date())}
              </p>
              <div className="mt-2">
                <Badge variant="warning">در انتظار پرداخت</Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 py-6 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">خریدار</p>
              <p className="font-medium">مریم احمدی</p>
              <p className="text-xs text-muted-foreground">
                اصفهان، خیابان چهارباغ
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">روش ارسال</p>
              <p className="font-medium">پست پیشتاز</p>
              <p className="text-xs text-muted-foreground">۳ تا ۵ روز کاری</p>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>شرح</TableHead>
                <TableHead>تعداد</TableHead>
                <TableHead>قیمت واحد</TableHead>
                <TableHead>جمع</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((it) => (
                <TableRow key={it.name}>
                  <TableCell>{it.name}</TableCell>
                  <TableCell numeric>{fa(it.qty)}</TableCell>
                  <TableCell numeric>{faNumber(it.price)}</TableCell>
                  <TableCell numeric>{faNumber(it.qty * it.price)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <dl className="ms-auto mt-6 w-full max-w-xs space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">جمع اقلام</dt>
              <dd>{formatToman(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">
                مالیات بر ارزش افزوده (۱۰٪)
              </dt>
              <dd>{formatToman(tax)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
              <dt>قابل پرداخت</dt>
              <dd>{formatToman(total)}</dd>
            </div>
            <p className="text-xs text-muted-foreground">
              به حروف: {tomanToWords(total)}
            </p>
          </dl>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            این پیش‌فاکتور تا ۷ روز اعتبار دارد.
          </p>
        </div>
      </div>
    </div>
  );
}
