import type { Metadata, Viewport } from "next";
import { iranSans, geistMono } from "./fonts";
import { THEME_STORAGE_KEY } from "@/lib/registry";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#111111",
};

export const metadata: Metadata = {
  title: "کامپوننت‌های فارسی راست‌چین برای React · وایب‌فارسی",
  description:
    "کامپوننت‌های راست‌چین رایگان برای Next.js و React. فایل را کپی کنید یا پرامپت انگلیسی را به Cursor بدهید. فونت و اعداد فارسی داخل خود کامپوننت است.",
  manifest: "/icons/site.webmanifest",
  icons: {
    icon: [
      { url: "/icons/favicon.ico" },
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

// Applies a saved design system before first paint (see Next.js "preventing flash" guide).
const themeScript = `(function(){try{var q=new URLSearchParams(location.search).get("theme");var t=q||localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t&&t!=="graphite")document.documentElement.setAttribute("data-theme",t);else document.documentElement.removeAttribute("data-theme")}catch(e){}})()`;

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
