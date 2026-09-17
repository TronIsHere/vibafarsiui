import type { Metadata } from "next";
import { iranSans, geistMono } from "./fonts";
import { THEME_STORAGE_KEY } from "@/lib/registry";
import "./globals.css";

export const metadata: Metadata = {
  title: "کامپوننت‌های فارسی راست‌چین برای React · وایب‌فارسی",
  description:
    "قطعه‌های راست‌چین رایگان برای Next.js و React. فایل را کپی کنید یا پرامپت انگلیسی را به Cursor بدهید؛ فونت و ارقام فارسی داخل خود قطعه است.",
};

// Applies a saved design system before first paint (see Next.js "preventing flash" guide).
const themeScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t&&t!=="graphite")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      suppressHydrationWarning
      className={`${iranSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
