"use client";

import * as React from "react";
import type { EditorView } from "@codemirror/view";
import { cn } from "@/lib/utils";

type Cursor = { line: number; col: number; selected: number };

const LANG_LABEL = { tsx: "TypeScript JSX", css: "CSS" } as const;

/** VS Code's UI font stack. IRANSans would render the Latin digits in "Ln 5, Col 12" as Persian. */
const UI_FONT: React.CSSProperties = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, Ubuntu, sans-serif',
};

function FileIcon({ language }: { language: "tsx" | "css" }) {
  // Same glyph colors VS Code's default icon theme uses for these file types.
  return language === "tsx" ? (
    <svg viewBox="0 0 16 16" aria-hidden className="size-3.5 shrink-0" fill="none" stroke="#519aba" strokeWidth="1.2">
      <ellipse cx="8" cy="8" rx="6.5" ry="2.6" />
      <ellipse cx="8" cy="8" rx="6.5" ry="2.6" transform="rotate(60 8 8)" />
      <ellipse cx="8" cy="8" rx="6.5" ry="2.6" transform="rotate(120 8 8)" />
      <circle cx="8" cy="8" r="1.1" fill="#519aba" stroke="none" />
    </svg>
  ) : (
    <span aria-hidden className="shrink-0 font-mono text-[11px] font-bold text-[#42a5f5]">#</span>
  );
}

export interface EditorFile {
  name: string;
  language: "tsx" | "css";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}

/**
 * A VS Code-looking editor: CodeMirror 6 with the Dark+ palette, a tab per file, a breadcrumb
 * and the blue status bar. CodeMirror loads after mount; until then the raw code is shown.
 */
export function CodeEditor({ files, height = 460, className }: { files: EditorFile[]; height?: number; className?: string }) {
  const [active, setActive] = React.useState(0);
  const [cursor, setCursor] = React.useState<Cursor>({ line: 1, col: 1, selected: 0 });
  const file = files[active] ?? files[0];
  const over = file.maxLength !== undefined && file.value.length > file.maxLength;

  return (
    <div dir="ltr" className={cn("overflow-hidden rounded-lg border border-[#2b2b2b] bg-[#1e1e1e] text-left", className)}>
      <div role="tablist" aria-label="Files" className="flex h-9 items-stretch overflow-x-auto bg-[#252526] [scrollbar-width:none]" style={UI_FONT}>
        {files.map((f, i) => (
          <button
            key={f.name}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={cn(
              "flex shrink-0 cursor-pointer items-center gap-2 border-r border-r-[#2b2b2b] px-3 text-[13px] transition-colors",
              i === active ? "border-t border-t-[#007acc] bg-[#1e1e1e] text-white" : "border-t border-t-transparent text-[#969696] hover:text-[#cccccc]",
            )}
          >
            <FileIcon language={f.language} />
            {f.name}
          </button>
        ))}
      </div>
      <div className="flex h-6 items-center gap-1 border-b border-[#2b2b2b] px-3 text-[12px] text-[#a9a9a9]" style={UI_FONT}>
        <span>src</span>
        <span className="text-[#6b6b6b]">›</span>
        <FileIcon language={file.language} />
        <span>{file.name}</span>
      </div>
      <EditorPane key={file.name} file={file} height={height} onCursor={setCursor} />
      <div className="flex h-[22px] items-center justify-between bg-[#007acc] px-2.5 text-[12px] text-white" style={UI_FONT}>
        <span className="opacity-90">{over ? `Too long: ${file.value.length} / ${file.maxLength}` : ""}</span>
        <div className="flex items-center gap-4">
          <span>
            Ln {cursor.line}, Col {cursor.col}
            {cursor.selected > 0 && ` (${cursor.selected} selected)`}
          </span>
          <span className="hidden sm:inline">Spaces: 2</span>
          <span className="hidden sm:inline">UTF-8</span>
          <span>{LANG_LABEL[file.language]}</span>
        </div>
      </div>
    </div>
  );
}

function EditorPane({ file, height, onCursor }: { file: EditorFile; height: number; onCursor: (c: Cursor) => void }) {
  const host = React.useRef<HTMLDivElement>(null);
  const view = React.useRef<EditorView | null>(null);
  const onChangeRef = React.useRef(file.onChange);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    onChangeRef.current = file.onChange;
  });

  React.useEffect(() => {
    let cancelled = false;
    void import("./editor-setup").then(({ createEditor }) => {
      if (cancelled || !host.current) return;
      view.current = createEditor({
        parent: host.current,
        doc: file.value,
        language: file.language,
        placeholder: file.placeholder,
        onChange: (v) => onChangeRef.current(v),
        onCursor,
      });
      setReady(true);
    });
    return () => {
      cancelled = true;
      view.current?.destroy();
      view.current = null;
    };
    // The editor owns its document after mount (the pane is keyed by file); outside changes sync below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Outside changes (a restored draft) replace the document; typing round-trips as a no-op.
  React.useEffect(() => {
    const v = view.current;
    if (!v) return;
    const current = v.state.doc.toString();
    if (current !== file.value) v.dispatch({ changes: { from: 0, to: current.length, insert: file.value } });
  }, [file.value, ready]);

  return (
    <div style={{ height }} className="relative overflow-hidden">
      <div ref={host} className="absolute inset-0" />
      {!ready && (
        <pre className="absolute inset-0 overflow-auto py-2 pr-2 pl-[60px] font-mono text-[13px] leading-[1.6] text-[#d4d4d4]">
          {file.value || file.placeholder}
        </pre>
      )}
    </div>
  );
}
