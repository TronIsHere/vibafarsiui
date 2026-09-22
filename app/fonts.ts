import localFont from "next/font/local";
import { Geist_Mono, IBM_Plex_Sans_Arabic, Lalezar, Noto_Kufi_Arabic, Noto_Naskh_Arabic, Vazirmatn } from "next/font/google";

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

// Design-system display/body faces. preload: false — a face downloads only
// when a design system that uses it renders text (see --type-* in globals.css).
export const lalezar = Lalezar({
  variable: "--font-lalezar",
  weight: "400",
  subsets: ["arabic"],
  display: "swap",
  preload: false,
});

export const notoNaskh = Noto_Naskh_Arabic({
  variable: "--font-naskh",
  subsets: ["arabic"],
  display: "swap",
  preload: false,
});

export const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
  display: "swap",
  preload: false,
});

export const notoKufi = Noto_Kufi_Arabic({
  variable: "--font-kufi",
  subsets: ["arabic"],
  display: "swap",
  preload: false,
});

export const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  weight: ["400", "500", "600", "700"],
  subsets: ["arabic"],
  display: "swap",
  preload: false,
});

/** All font variables, for the <html> className. */
export const fontVariables = [iranSans, geistMono, lalezar, notoNaskh, vazirmatn, notoKufi, plexArabic]
  .map((f) => f.variable)
  .join(" ");
