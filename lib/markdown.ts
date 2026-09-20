/**
 * Minimal markdown parser for the skill files in registry/skills. Covers the
 * subset those files use (headings, paragraphs, nested lists, tables, fenced
 * code, blockquotes, rules, inline code/bold/italic/links) so the docs can
 * render SKILL.md without a markdown dependency.
 */

export type Inline =
  | { t: "text"; v: string }
  | { t: "code"; v: string }
  | { t: "strong"; c: Inline[] }
  | { t: "em"; c: Inline[] }
  | { t: "link"; href: string; c: Inline[] };

export type Block =
  | { t: "heading"; level: number; id: string; c: Inline[] }
  | { t: "para"; c: Inline[] }
  | { t: "list"; ordered: boolean; items: Block[][] }
  | { t: "quote"; c: Block[] }
  | { t: "code"; lang: string; v: string }
  | { t: "table"; head: Inline[][]; rows: Inline[][][] }
  | { t: "hr" };

export type Frontmatter = Record<string, string>;

/** Splits a leading `---` YAML block off. Values may be plain or `>` folded scalars. */
export function splitFrontmatter(src: string): { meta: Frontmatter; body: string } {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { meta: {}, body: src };
  const meta: Frontmatter = {};
  let key: string | null = null;
  let folded = false;
  for (const raw of m[1].split(/\r?\n/)) {
    const kv = raw.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (kv && !raw.startsWith(" ")) {
      key = kv[1];
      const value = kv[2].trim();
      folded = value === ">" || value === "|";
      meta[key] = folded ? "" : value.replace(/^["']|["']$/g, "");
      continue;
    }
    if (key && folded) {
      const line = raw.trim();
      meta[key] = meta[key] ? `${meta[key]} ${line}` : line;
    }
  }
  return { meta, body: src.slice(m[0].length) };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[`*_[\]()]/g, "")
    .replace(/[^\w؀-ۿ‌\s-]/g, "")
    .trim()
    .replace(/[\s]+/g, "-");
}

const INLINE = /(`[^`\n]+`)|(\*\*[^*\n]+\*\*)|(\*[^*\n]+\*)|(\[[^\]\n]+\]\([^)\s]+\))/g;

export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push({ t: "text", v: text.slice(last, idx) });
    const tok = m[0];
    if (m[1]) out.push({ t: "code", v: tok.slice(1, -1) });
    else if (m[2]) out.push({ t: "strong", c: parseInline(tok.slice(2, -2)) });
    else if (m[3]) out.push({ t: "em", c: parseInline(tok.slice(1, -1)) });
    else if (m[4]) {
      const lm = tok.match(/^\[([^\]]+)\]\(([^)]+)\)$/)!;
      out.push({ t: "link", href: lm[2], c: parseInline(lm[1]) });
    }
    last = idx + tok.length;
  }
  if (last < text.length) out.push({ t: "text", v: text.slice(last) });
  return out;
}

export function inlineText(nodes: Inline[]): string {
  return nodes.map((n) => ("v" in n ? n.v : inlineText(n.c))).join("");
}

const LIST_ITEM = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;
const TABLE_SEP = /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/;

function splitRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  return trimmed.split("|").map((c) => c.trim());
}

export function parseMarkdown(src: string): Block[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  const flushPara = (buf: string[]) => {
    const text = buf.join(" ").trim();
    if (text) blocks.push({ t: "para", c: parseInline(text) });
  };

  let para: string[] = [];

  while (i < lines.length) {
    const line = lines[i];

    if (/^\s*$/.test(line)) {
      flushPara(para);
      para = [];
      i++;
      continue;
    }

    const fence = line.match(/^```(\w*)\s*$/);
    if (fence) {
      flushPara(para);
      para = [];
      const lang = fence[1] || "text";
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) buf.push(lines[i++]);
      i++; // closing fence
      blocks.push({ t: "code", lang, v: buf.join("\n") });
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/);
    if (heading) {
      flushPara(para);
      para = [];
      const c = parseInline(heading[2]);
      blocks.push({ t: "heading", level: heading[1].length, id: slugify(inlineText(c)), c });
      i++;
      continue;
    }

    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      flushPara(para);
      para = [];
      blocks.push({ t: "hr" });
      i++;
      continue;
    }

    if (line.startsWith(">")) {
      flushPara(para);
      para = [];
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) buf.push(lines[i++].replace(/^>\s?/, ""));
      blocks.push({ t: "quote", c: parseMarkdown(buf.join("\n")) });
      continue;
    }

    if (line.trim().startsWith("|") && i + 1 < lines.length && TABLE_SEP.test(lines[i + 1])) {
      flushPara(para);
      para = [];
      const head = splitRow(line).map(parseInline);
      i += 2;
      const rows: Inline[][][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) rows.push(splitRow(lines[i++]).map(parseInline));
      blocks.push({ t: "table", head, rows });
      continue;
    }

    const li = line.match(LIST_ITEM);
    if (li && li[1].length === 0) {
      flushPara(para);
      para = [];
      const ordered = /\d/.test(li[2]);
      const items: Block[][] = [];
      while (i < lines.length) {
        const m = lines[i].match(LIST_ITEM);
        if (!m || m[1].length !== 0 || /\d/.test(m[2]) !== ordered) break;
        const indent = m[2].length + 1;
        const buf: string[] = [m[3]];
        i++;
        // Continuation lines: indented at least to the marker width, or blank lines followed by such.
        while (i < lines.length) {
          const next = lines[i];
          if (/^\s*$/.test(next)) {
            // A blank line stays inside the item only when indented content follows.
            const after = lines[i + 1];
            if (after !== undefined && /^\s{2,}\S/.test(after)) {
              buf.push("");
              i++;
              continue;
            }
            break;
          }
          if (/^\s{2,}/.test(next)) {
            buf.push(next.slice(Math.min(indent, next.match(/^\s*/)![0].length)));
            i++;
            continue;
          }
          break;
        }
        items.push(parseMarkdown(buf.join("\n")));
      }
      blocks.push({ t: "list", ordered, items });
      continue;
    }

    para.push(line.trim());
    i++;
  }
  flushPara(para);
  return blocks;
}
