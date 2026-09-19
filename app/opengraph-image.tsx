import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { OG_ALT } from "@/lib/site";

export const alt = OG_ALT;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const bold = await readFile(join(process.cwd(), "fonts/IRANSans-Bold.ttf"));
const regular = await readFile(join(process.cwd(), "fonts/IRANSans-Reg.ttf"));

/** Satori has no real bidi. One flex item per word, packed from the right. Avoid ZWNJ. */
function Fa({
  text,
  fontSize,
  fontWeight,
  color,
  gap = 12,
}: {
  text: string;
  fontSize: number;
  fontWeight?: number;
  color?: string;
  gap?: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row-reverse",
        justifyContent: "flex-start",
        gap,
        fontSize,
        fontWeight: fontWeight ?? 400,
        color: color ?? "#F5F5F5",
        letterSpacing: 0,
      }}
    >
      {text.split(" ").map((word, i) => (
        <span key={`${word}-${i}`} style={{ display: "flex" }}>
          {word}
        </span>
      ))}
    </div>
  );
}

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#121214",
          color: "#F5F5F5",
          padding: "72px 80px",
          fontFamily: "IRANSans",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row-reverse",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #E8B84A",
              borderRadius: 12,
              color: "#E8B84A",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            و
          </div>
          <Fa text="وایب فارسی" fontSize={28} fontWeight={700} />
          <span style={{ display: "flex", fontSize: 18, color: "#A1A1AA" }}>UI</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-end" }}>
          <Fa text="کامپوننت های فارسی راست چین" fontSize={54} fontWeight={700} gap={16} />
          <Fa text="فایل را کپی کنید یا پرامپت بدهید" fontSize={26} color="#C4C4CC" gap={10} />
          <span style={{ display: "flex", fontSize: 22, color: "#E8B84A", marginTop: 4 }}>
            React · Next.js · Tailwind
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <span style={{ display: "flex", fontSize: 22, color: "#A1A1AA" }}>vibefarsi.ir</span>
          <Fa text="رایگان و متن باز" fontSize={22} color="#A1A1AA" />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "IRANSans", data: regular, weight: 400, style: "normal" },
        { name: "IRANSans", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
