/**
 * Lazy loaders for the registry libs the community sandbox (/sandbox) can import, keyed "./utils.ts".
 * Keep in sync with lib/registry/libs.ts; server-only modules must never be listed here.
 */
export const libModules: Record<string, () => Promise<unknown>> = import.meta.glob([
  "./utils.ts",
  "./jalali.ts",
  "./persian.ts",
  "./number-to-words.ts",
  "./svg-text-path-rtl.ts",
  "./float.tsx",
]);
