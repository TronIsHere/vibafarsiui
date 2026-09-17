import { cn } from "@/lib/utils";

const TOKEN =
  /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b(?:import|export|from|const|let|function|return|type|interface|default|extends|as)\b)|(<\/?[A-Za-z][\w.]*)|(\b[a-zA-Z_]\w*)(?==)|(\{|\})/gm;

function highlight(line: string) {
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index));
    const [text, comment, str, kw, tag, attr, brace] = m;
    let cls = "";
    if (comment) cls = "text-muted-foreground/70 italic";
    else if (str) cls = "text-success";
    else if (kw) cls = "text-fuchsia-300";
    else if (tag) cls = "text-brand";
    else if (attr) cls = "text-sky-300";
    else if (brace) cls = "text-warning/90";
    out.push(
      <span key={m.index} className={cls}>
        {text}
      </span>,
    );
    last = m.index + text.length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

export function CodeBlock({ code, className }: { code: string; className?: string }) {
  const lines = code.replace(/^\n+|\n+$/g, "").split("\n");
  return (
    <pre
      dir="ltr"
      className={cn(
        "overflow-x-auto p-5 text-[13px] leading-[1.7] text-foreground/85 [scrollbar-width:thin]",
        className,
      )}
    >
      <code>
        {lines.map((l, i) => (
          <span key={i} className="grid grid-cols-[2ch_1fr] gap-4">
            <span className="select-none text-end text-muted-foreground/40">{i + 1}</span>
            <span>{highlight(l)}</span>
          </span>
        ))}
      </code>
    </pre>
  );
}
