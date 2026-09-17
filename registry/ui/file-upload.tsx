"use client";

import * as React from "react";
import { FileUp, X } from "lucide-react";
import { cn, faFileSize } from "@/lib/utils";

export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onFiles?: (files: File[]) => void;
  hint?: React.ReactNode;
  className?: string;
}

/** آپلود فایل. Drag-and-drop zone with a Persian file list (sizes in مگابایت). */
export function FileUpload({ accept, multiple = true, maxSize, onFiles, hint, className }: FileUploadProps) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [over, setOver] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function add(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list);
    const tooBig = maxSize ? incoming.find((f) => f.size > maxSize) : undefined;
    if (tooBig) {
      setError(`«${tooBig.name}» بزرگ‌تر از ${faFileSize(maxSize!)} است.`);
      return;
    }
    setError(null);
    const next = multiple ? [...files, ...incoming] : incoming.slice(0, 1);
    setFiles(next);
    onFiles?.(next);
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); add(e.dataTransfer.files); }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed p-6 text-center transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
          over ? "border-foreground/60 bg-accent/60" : "border-input hover:bg-accent/40",
        )}
      >
        <FileUp className="size-5 text-muted-foreground" />
        <p className="text-sm">فایل را این‌جا رها کنید یا <span className="font-medium underline underline-offset-4">انتخاب کنید</span></p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="sr-only" onChange={(e) => add(e.target.files)} />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      {files.length > 0 && (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="flex items-center gap-2 px-3 py-2 text-xs">
              <span className="flex-1 truncate" dir="auto">{f.name}</span>
              <span className="text-muted-foreground">{faFileSize(f.size)}</span>
              <button
                type="button"
                aria-label="حذف"
                onClick={() => { const next = files.filter((_, j) => j !== i); setFiles(next); onFiles?.(next); }}
                className="cursor-pointer rounded p-0.5 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
