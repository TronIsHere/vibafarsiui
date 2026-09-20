# vibefarsi

Persian RTL components for React + Tailwind. Copy files into your app from the [VibeFarsi registry](https://vibefarsi.ir).

```bash
npx vibefarsi@latest init
npx vibefarsi add button calendar price
npx vibefarsi list
```

`init` sets `lang="fa" dir="rtl"`, Vazirmatn (or IRANSans), Graphite tokens, `lib/utils.ts`, and `lib/jalali.ts`. It also gives coding agents their rules: a compact Persian RTL + UI craft block in `AGENTS.md` (replaced in place on re-run), `@AGENTS.md` in `CLAUDE.md`, the full guides in `docs/`, and a Cursor rule when `.cursor/` exists. `add` pulls items from `https://vibefarsi.ir/r`.

Docs: [vibefarsi.ir/docs](https://vibefarsi.ir/docs)
