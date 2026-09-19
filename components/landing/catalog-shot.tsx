import Image from "next/image";
import { cn } from "@/lib/utils";

/** Templates whose UI sits in the middle of the page (not a side peek). */
export const CENTERED_TEMPLATE_PEEKS = new Set([
  "auth",
  "onboarding",
  "error-pages",
  "receipt",
  "startup-landing",
  "pricing",
]);

export function CatalogShot({
  kind,
  slug,
  name,
  cover,
  peek,
  sizes,
}: {
  kind: "blocks" | "templates";
  slug: string;
  name: string;
  cover?: boolean;
  /** Template peek image. Centered templates keep the UI in the middle of the card. */
  peek?: boolean;
  sizes: string;
}) {
  const centered = peek && CENTERED_TEMPLATE_PEEKS.has(slug);

  return (
    <Image
      src={`/previews/${kind}/${slug}.webp`}
      alt={`پیش‌نمایش ${name}`}
      fill
      sizes={sizes}
      unoptimized
      className={cn(
        "pointer-events-none",
        centered
          ? "object-cover object-center"
          : peek
            ? "object-cover object-right-top"
            : cover
              ? "object-cover object-top"
              : "object-contain p-3",
      )}
    />
  );
}
