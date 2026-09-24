import { indentWithTab } from "@codemirror/commands";
import type { CompletionContext, CompletionResult } from "@codemirror/autocomplete";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { HighlightStyle, indentUnit, syntaxHighlighting } from "@codemirror/language";
import { EditorState, type Extension } from "@codemirror/state";
import { EditorView, keymap, placeholder as placeholderExt } from "@codemirror/view";
import { tags as t } from "@lezer/highlight";
import { basicSetup } from "codemirror";
import { animations } from "@/lib/registry/animations";
import { backgrounds } from "@/lib/registry/backgrounds";
import { blocks } from "@/lib/registry/blocks";
import { components } from "@/lib/registry/components";
import { libs } from "@/lib/registry/libs";

/** VS Code "Dark+" colors, so the editor feels like the one people already use. */
export const DARK_PLUS = {
  bg: "#1e1e1e",
  fg: "#d4d4d4",
  tabBar: "#252526",
  border: "#2b2b2b",
  statusBar: "#007acc",
  lineNumber: "#858585",
  activeLineNumber: "#c6c6c6",
  selection: "#264f78",
  cursor: "#aeafad",
} as const;

const theme = EditorView.theme(
  {
    "&": { color: DARK_PLUS.fg, backgroundColor: DARK_PLUS.bg, height: "100%", fontSize: "13px" },
    "&.cm-focused": { outline: "none" },
    ".cm-scroller": { fontFamily: "var(--font-mono), Menlo, Consolas, monospace", lineHeight: "1.6" },
    ".cm-content": { caretColor: DARK_PLUS.cursor, padding: "8px 0" },
    ".cm-cursor, .cm-dropCursor": { borderLeftColor: DARK_PLUS.cursor, borderLeftWidth: "2px" },
    "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
      { backgroundColor: DARK_PLUS.selection },
    ".cm-activeLine": { backgroundColor: "transparent", boxShadow: "inset 0 0 0 1px #282828" },
    ".cm-selectionMatch": { backgroundColor: "#add6ff26" },
    ".cm-matchingBracket, .cm-nonmatchingBracket": { backgroundColor: "#0064001a", outline: "1px solid #888" },
    ".cm-gutters": { backgroundColor: DARK_PLUS.bg, color: DARK_PLUS.lineNumber, border: "none" },
    ".cm-lineNumbers .cm-gutterElement": { padding: "0 12px 0 16px", minWidth: "40px" },
    ".cm-activeLineGutter": { backgroundColor: "transparent", color: DARK_PLUS.activeLineNumber },
    ".cm-foldGutter .cm-gutterElement": { color: "#c5c5c5", opacity: "0.6" },
    ".cm-placeholder": { color: "#6a6a6a" },
    ".cm-searchMatch": { backgroundColor: "#623315", outline: "1px solid #ea5c0055" },
    ".cm-searchMatch.cm-searchMatch-selected": { backgroundColor: "#515c6a" },
    ".cm-panels": { backgroundColor: DARK_PLUS.tabBar, color: DARK_PLUS.fg },
    ".cm-panels.cm-panels-top": { borderBottom: `1px solid ${DARK_PLUS.border}` },
    ".cm-panel input, .cm-panel button": { fontFamily: "inherit" },
    ".cm-tooltip": { backgroundColor: DARK_PLUS.tabBar, border: "1px solid #454545", color: DARK_PLUS.fg },
    ".cm-tooltip-autocomplete > ul > li": { padding: "2px 8px" },
    ".cm-tooltip-autocomplete > ul > li[aria-selected]": { backgroundColor: "#04395e", color: "#fff" },
    ".cm-completionDetail": { color: "#9d9d9d", fontStyle: "normal", marginInlineStart: "12px" },
    ".cm-completionMatchedText": { color: "#2aaaff", textDecoration: "none", fontWeight: "600" },
  },
  { dark: true },
);

const highlight = HighlightStyle.define([
  { tag: [t.comment, t.lineComment, t.blockComment], color: "#6a9955" },
  { tag: [t.controlKeyword, t.moduleKeyword], color: "#c586c0" },
  { tag: [t.keyword, t.definitionKeyword, t.modifier, t.operatorKeyword, t.bool, t.null, t.self], color: "#569cd6" },
  { tag: [t.string, t.special(t.string), t.regexp], color: "#ce9178" },
  { tag: [t.number, t.unit], color: "#b5cea8" },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: "#dcdcaa" },
  { tag: [t.typeName, t.className, t.namespace], color: "#4ec9b0" },
  { tag: [t.variableName, t.propertyName, t.attributeName, t.definition(t.variableName)], color: "#9cdcfe" },
  { tag: [t.constant(t.variableName)], color: "#4fc1ff" },
  { tag: t.tagName, color: "#569cd6" },
  { tag: t.special(t.tagName), color: "#4ec9b0" },
  { tag: [t.angleBracket], color: "#808080" },
  { tag: [t.operator, t.punctuation, t.separator], color: "#d4d4d4" },
  { tag: t.bracket, color: "#ffd700" },
  { tag: t.escape, color: "#d7ba7d" },
  { tag: t.invalid, color: "#f44747" },
  // CSS
  { tag: t.atom, color: "#ce9178" },
  { tag: [t.labelName], color: "#d7ba7d" },
]);

const IMPORTS = [
  { label: "react", detail: "React" },
  { label: "lucide-react", detail: "آیکون‌ها" },
  ...components.map((c) => ({ label: `@/components/ui/${c.slug}`, detail: c.name })),
  ...blocks.map((c) => ({ label: `@/components/blocks/${c.slug}`, detail: c.name })),
  ...animations.map((c) => ({ label: `@/components/animations/${c.slug}`, detail: c.name })),
  ...backgrounds.map((c) => ({ label: `@/components/backgrounds/${c.slug}`, detail: c.name })),
  ...libs.map((c) => ({ label: `@/lib/${c.slug}`, detail: c.name })),
].map((o) => ({ ...o, type: "module" }));

/** Completes the module path inside `from "…"`, listing everything the sandbox can import. */
function importPaths(ctx: CompletionContext): CompletionResult | null {
  const line = ctx.state.doc.lineAt(ctx.pos);
  const before = line.text.slice(0, ctx.pos - line.from);
  const m = /(?:from\s+|import\s+)(["'])([^"']*)$/.exec(before);
  if (!m) return null;
  return { from: ctx.pos - m[2].length, options: IMPORTS, validFor: /^[\w@/.-]*$/ };
}

export function createEditor({
  parent,
  doc,
  language,
  placeholder,
  onChange,
  onCursor,
}: {
  parent: HTMLElement;
  doc: string;
  language: "tsx" | "css";
  placeholder?: string;
  onChange: (value: string) => void;
  onCursor: (pos: { line: number; col: number; selected: number }) => void;
}): EditorView {
  const extensions: Extension[] = [
    basicSetup,
    keymap.of([
      indentWithTab,
      // Habit from VS Code: Cmd/Ctrl+S would otherwise open the browser's "save page" dialog.
      { key: "Mod-s", run: () => true, preventDefault: true },
    ]),
    EditorState.tabSize.of(2),
    indentUnit.of("  "),
    language === "tsx" ? javascript({ jsx: true, typescript: true }) : css(),
    theme,
    syntaxHighlighting(highlight),
    EditorView.contentAttributes.of({ "aria-label": language === "tsx" ? "کد" : "CSS", dir: "ltr" }),
    EditorView.updateListener.of((u) => {
      if (u.docChanged) onChange(u.state.doc.toString());
      if (u.docChanged || u.selectionSet) {
        const sel = u.state.selection.main;
        const line = u.state.doc.lineAt(sel.head);
        onCursor({ line: line.number, col: sel.head - line.from + 1, selected: Math.abs(sel.to - sel.from) });
      }
    }),
  ];
  // basicSetup already enables autocompletion; this adds import paths next to the language's own words.
  if (language === "tsx") extensions.push(EditorState.languageData.of(() => [{ autocomplete: importPaths }]));
  if (placeholder) extensions.push(placeholderExt(placeholder));

  return new EditorView({ parent, state: EditorState.create({ doc, extensions }) });
}
