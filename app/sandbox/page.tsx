import { readFileSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { SandboxRuntime } from "@/components/community/sandbox-runtime";

export const metadata: Metadata = {
  title: "sandbox",
  robots: { index: false, follow: false },
};

/**
 * The site's own globals.css, handed to Tailwind's browser compiler so submitted code gets the
 * same tokens, custom utilities and keyframes. Preflight is already in the page CSS.
 */
function tailwindSource(): string {
  const css = readFileSync(path.join(/* turbopackIgnore: true */ process.cwd(), "app", "globals.css"), "utf8");
  return css.replace(
    /@import\s+["']tailwindcss["'];/,
    '@import "tailwindcss/theme.css" layer(theme);\n@import "tailwindcss/utilities.css" layer(utilities);',
  );
}

export default function SandboxPage() {
  return <SandboxRuntime tailwind={tailwindSource()} />;
}
