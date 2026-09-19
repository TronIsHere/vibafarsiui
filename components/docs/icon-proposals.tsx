"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { LogoMark, logoMarkSvg } from "@/components/shared/logo";
import { Button } from "@/registry/ui/button";
import { fa } from "@/lib/utils";

const PNG_SIZES = [16, 32, 48, 180, 192, 512] as const;

function cssToHex(color: string) {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return color;
  ctx.fillStyle = "#000";
  ctx.fillStyle = color;
  return ctx.fillStyle;
}

function resolveBrandColors() {
  const probe = document.createElement("span");
  probe.style.position = "fixed";
  probe.style.left = "-9999px";
  document.body.appendChild(probe);
  probe.style.color = "var(--brand)";
  const brand = cssToHex(getComputedStyle(probe).color);
  probe.style.color = "color-mix(in oklch, var(--brand) 70%, white)";
  const brandLight = cssToHex(getComputedStyle(probe).color);
  probe.remove();
  return { brand, brandLight };
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function svgToPng(svg: string, size: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("canvas"));
        return;
      }
      ctx.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (!blob) reject(new Error("png"));
        else resolve(blob);
      }, "image/png");
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("svg"));
    };
    img.src = url;
  });
}

export function IconProposals() {
  const [busy, setBusy] = React.useState<string | null>(null);

  const markSvg = React.useCallback(() => {
    const { brand, brandLight } = resolveBrandColors();
    return logoMarkSvg(brand, brandLight);
  }, []);

  async function saveSvg() {
    setBusy("svg");
    try {
      downloadBlob(new Blob([markSvg()], { type: "image/svg+xml;charset=utf-8" }), "vibefarsi-mark.svg");
    } finally {
      setBusy(null);
    }
  }

  async function savePng(size: number) {
    setBusy(String(size));
    try {
      const blob = await svgToPng(markSvg(), size);
      downloadBlob(blob, `vibefarsi-mark-${size}.png`);
    } finally {
      setBusy(null);
    }
  }

  async function saveAll() {
    setBusy("all");
    try {
      const svg = markSvg();
      downloadBlob(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }), "vibefarsi-mark.svg");
      for (const size of PNG_SIZES) {
        const blob = await svgToPng(svg, size);
        downloadBlob(blob, `vibefarsi-mark-${size}.png`);
        await new Promise((r) => setTimeout(r, 120));
      }
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <header className="pb-8">
        <p className="text-xs text-muted-foreground">نشان فعلی</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">شمسه برای فاویکون</h1>
        <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground sm:text-[15px]">
          همان نشان نوار بالا. SVG را مستقیم در سایت بگذارید؛ PNG ۵۱۲ را به
          سازندهٔ فاویکون بدهید تا ico و آیکون اپل ساخته شود.
        </p>
      </header>

      <div className="rounded-xl border border-border bg-card p-5 sm:p-8">
        <div className="flex flex-wrap items-center gap-8">
          <span className="inline-flex h-8 items-center gap-2.5">
            <LogoMark paintId="vf-dl-word" />
            <span className="inline-flex items-center text-[17px] font-bold leading-none">
              وایب‌فارسی
              <span className="ms-1.5 text-[12px] font-medium leading-none text-muted-foreground">
                UI
              </span>
            </span>
          </span>
          <LogoMark paintId="vf-dl-lg" className="size-24" />
          <div className="flex items-end gap-5">
            {([16, 32, 48] as const).map((px) => (
              <div key={px} className="flex flex-col items-center gap-1.5">
                <LogoMark
                  paintId={`vf-dl-${px}`}
                  className={px === 16 ? "size-4" : px === 32 ? "size-8" : "size-12"}
                />
                <span className="text-[10px] text-muted-foreground">{fa(px)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="brand"
            className="cursor-pointer"
            disabled={busy !== null}
            onClick={saveSvg}
          >
            <Download />
            {busy === "svg" ? "…" : "دانلود SVG"}
          </Button>
          {PNG_SIZES.map((size) => (
            <Button
              key={size}
              size="sm"
              variant="outline"
              className="cursor-pointer"
              disabled={busy !== null}
              onClick={() => savePng(size)}
            >
              <Download />
              {busy === String(size) ? "…" : `PNG ${fa(size)}`}
            </Button>
          ))}
          <Button
            size="sm"
            variant="secondary"
            className="cursor-pointer"
            disabled={busy !== null}
            onClick={saveAll}
          >
            <Download />
            {busy === "all" ? "…" : "دانلود همه"}
          </Button>
        </div>
        <p className="mt-4 text-xs leading-6 text-muted-foreground">
          پس‌زمینه شفاف است. مرورگر ممکن است برای «دانلود همه» چند فایل پشت‌سرهم
          بخواهد؛ اگر یکی را بلاک کرد، همان اندازه را جدا بگیرید.
        </p>
      </div>
    </div>
  );
}
