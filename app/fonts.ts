import localFont from "next/font/local";
import { Geist_Mono } from "next/font/google";

// IRANSans — primary Persian typeface. Weights map to the files in /fonts.
export const iranSans = localFont({
  src: [
    { path: "../fonts/IRANSans-Light.woff", weight: "300", style: "normal" },
    { path: "../fonts/IRANSans-Reg.woff", weight: "400", style: "normal" },
    { path: "../fonts/IRANSans-SemiBold.woff", weight: "600", style: "normal" },
    { path: "../fonts/IRANSans-Bold.woff", weight: "700", style: "normal" },
  ],
  variable: "--font-iransans",
  display: "swap",
});

// Monospace for code samples and install commands (always LTR).
export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});
