import { existsSync } from "node:fs";
import path from "node:path";
import { writeAgentGuides } from "./agents.js";
import { applyThemeTokens } from "./css.js";
import { fail, hint, info, skip, title, warn } from "./log.js";
import { ensureTsPathAlias, hasIranSansFiles, loadProject, readText, resolveTarget, writeConfig, writeFile, } from "./project.js";
import { fetchCatalog, fetchItem, makeClient, resolveOne, rewriteUserSource, } from "./registry.js";
const VAZIR_VAR = "--font-vazirmatn";
const IRAN_VAR = "--font-iransans";
function vazirmatnSnippet() {
    return `import { Vazirmatn } from "next/font/google";

export const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "${VAZIR_VAR}",
  display: "swap",
});
`;
}
function iranSansSnippet() {
    return `import localFont from "next/font/local";

export const iranSans = localFont({
  src: [
    { path: "../fonts/IRANSans-Reg.woff", weight: "400", style: "normal" },
    { path: "../fonts/IRANSans-SemiBold.woff", weight: "600", style: "normal" },
    { path: "../fonts/IRANSans-Bold.woff", weight: "700", style: "normal" },
  ],
  variable: "${IRAN_VAR}",
  display: "swap",
});
`;
}
function pickFont(project, requested) {
    const hasFiles = hasIranSansFiles(project);
    if (requested === "iransans" && hasFiles) {
        return { id: "iransans", cssVar: IRAN_VAR, exportName: "iranSans" };
    }
    return { id: "vazirmatn", cssVar: VAZIR_VAR, exportName: "vazirmatn" };
}
function ensureImport(source, line) {
    if (source.includes(line))
        return source;
    const last = [...source.matchAll(/^import .+$/gm)].pop();
    if (last?.index != null) {
        const at = last.index + last[0].length;
        return `${source.slice(0, at)}\n${line}${source.slice(at)}`;
    }
    return `${line}\n${source}`;
}
function ensureFontModule(project, font, dryRun) {
    const rel = project.src ? "src/app/fonts.ts" : "app/fonts.ts";
    const file = project.paths.fonts ?? path.join(project.cwd, rel);
    let src = readText(file) ?? "";
    if (font.id === "vazirmatn" || !hasIranSansFiles(project)) {
        if (!src.includes("Vazirmatn")) {
            src = ensureImport(src, `import { Vazirmatn } from "next/font/google";`);
            src = `${src.replace(/\s*$/, "")}\n\n${vazirmatnSnippet().replace(/^import .+\n\n/, "")}`;
        }
    }
    if (font.id === "iransans" && hasIranSansFiles(project) && !src.includes("export const iranSans")) {
        src = ensureImport(src, `import localFont from "next/font/local";`);
        src = `${src.replace(/\s*$/, "")}\n\n${iranSansSnippet().replace(/^import .+\n\n/, "")}`;
    }
    if (!src.trim())
        src = font.id === "iransans" ? iranSansSnippet() : vazirmatnSnippet();
    writeFile(file, src, dryRun);
    return file;
}
function addImport(source, spec, names) {
    const re = new RegExp(`import\\s*\\{([^}]+)\\}\\s*from\\s*["']${spec.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`);
    const match = source.match(re);
    if (match) {
        const existing = match[1].split(",").map((s) => s.trim()).filter(Boolean);
        const merged = Array.from(new Set([...existing, ...names]));
        return source.replace(re, `import { ${merged.join(", ")} } from "${spec}"`);
    }
    const line = `import { ${names.join(", ")} } from "${spec}";\n`;
    const lastImport = [...source.matchAll(/^import .+$/gm)].pop();
    if (lastImport?.index != null) {
        const at = lastImport.index + lastImport[0].length;
        return `${source.slice(0, at)}\n${line}${source.slice(at)}`;
    }
    return line + source;
}
function patchHtmlOpen(source, classExpr) {
    return source.replace(/<html\b([^>]*)>/, (_, raw) => {
        let attrs = raw;
        if (/\blang\s*=/.test(attrs))
            attrs = attrs.replace(/\blang\s*=\s*(["']).*?\1/, 'lang="fa"');
        else
            attrs += ' lang="fa"';
        if (/\bdir\s*=/.test(attrs))
            attrs = attrs.replace(/\bdir\s*=\s*(["']).*?\1/, 'dir="rtl"');
        else
            attrs += ' dir="rtl"';
        if (classExpr) {
            if (/\bclassName\s*=/.test(attrs)) {
                attrs = attrs.replace(/\bclassName\s*=\s*\{`([^`]*)`\}/, (_m, inner) => {
                    if (inner.includes(classExpr))
                        return `className={\`${inner}\`}`;
                    return `className={\`${classExpr} ${inner}\`}`;
                });
                attrs = attrs.replace(/\bclassName\s*=\s*\{([^}]+)\}/, (m, inner) => {
                    if (m.includes("`") || inner.includes(classExpr))
                        return m;
                    return `className={\`${classExpr} \${${inner.trim()}}\`}`;
                });
                attrs = attrs.replace(/\bclassName\s*=\s*(["'])([^"']*)\1/, (_m, q, inner) => {
                    if (inner.includes(classExpr))
                        return `className=${q}${inner}${q}`;
                    return `className={\`${classExpr} ${inner}\`}`;
                });
            }
            else {
                attrs += ` className={${classExpr}}`;
            }
        }
        return `<html${attrs}>`;
    });
}
function patchBodyFont(source) {
    return source.replace(/<body\b([^>]*)>/, (m, raw) => {
        if (/\bclassName\s*=/.test(raw)) {
            if (/font-sans/.test(raw))
                return m;
            if (/\bclassName\s*=\s*(["'])/.test(raw)) {
                return `<body${raw.replace(/\bclassName\s*=\s*(["'])([^"']*)\1/, 'className=$1$2 font-sans bg-background text-foreground$1')}>`;
            }
            return `<body${raw.replace(/\bclassName\s*=\s*\{`([^`]*)`\}/, 'className={`$1 font-sans bg-background text-foreground`}')}>`;
        }
        return `<body${raw} className="font-sans bg-background text-foreground">`;
    });
}
function patchLayout(project, font, fontsFile, dryRun) {
    const layout = project.paths.layout;
    if (!layout)
        return false;
    let src = readText(layout);
    if (!src)
        return false;
    const relImport = path.relative(path.dirname(layout), fontsFile).replaceAll("\\", "/");
    const spec = relImport.startsWith(".") ? relImport.replace(/\.tsx?$/, "") : `./${relImport.replace(/\.tsx?$/, "")}`;
    src = addImport(src, spec, [font.exportName]);
    src = patchHtmlOpen(src, `${font.exportName}.variable`);
    src = patchBodyFont(src);
    writeFile(layout, src, dryRun);
    return true;
}
function patchIndexHtml(project, dryRun) {
    const file = project.paths.indexHtml;
    if (!file)
        return false;
    let src = readText(file);
    if (!src)
        return false;
    const next = src.replace(/<html\b([^>]*)>/, (_, raw) => {
        let attrs = raw;
        if (/\blang\s*=/.test(attrs))
            attrs = attrs.replace(/\blang\s*=\s*(["']).*?\1/, 'lang="fa"');
        else
            attrs += ' lang="fa"';
        if (/\bdir\s*=/.test(attrs))
            attrs = attrs.replace(/\bdir\s*=\s*(["']).*?\1/, 'dir="rtl"');
        else
            attrs += ' dir="rtl"';
        return `<html${attrs}>`;
    });
    if (next === src)
        return false;
    writeFile(file, next, dryRun);
    return true;
}
async function writeLibFromRegistry(project, flags, slug) {
    const client = makeClient(project.config.registry);
    const catalog = await fetchCatalog(client);
    const item = resolveOne(catalog, slug);
    if (!item)
        throw new Error(`Registry is missing lib "${slug}"`);
    const payload = await fetchItem(client, item);
    const file = payload.files[0];
    if (!file)
        throw new Error(`Registry item "${slug}" has no files`);
    const dest = resolveTarget(project, file.path);
    if (existsSync(dest) && !flags.overwrite) {
        skip(`${path.relative(project.cwd, dest)} (exists)`);
        return;
    }
    writeFile(dest, rewriteUserSource(file.content), flags.dryRun);
    info(path.relative(project.cwd, dest));
}
export async function runInit(flags) {
    const project = loadProject(flags.cwd, {
        registry: flags.registry,
        theme: flags.theme,
        font: flags.font,
    });
    if (!existsSync(project.paths.pkg)) {
        fail("No package.json here. Run this inside a React / Next.js project.");
        process.exitCode = 1;
        return;
    }
    title("vibefarsi init");
    hint(`registry  ${project.config.registry}`);
    hint(`cwd       ${project.cwd}`);
    const font = pickFont(project, flags.font);
    if (flags.font === "iransans" && font.id !== "iransans") {
        warn("IRANSans files were not in /fonts; using Vazirmatn. Drop IRANSans-Reg.woff there and re-run with --font iransans.");
    }
    const client = makeClient(project.config.registry);
    let catalog;
    try {
        await writeLibFromRegistry(project, flags, "utils");
        await writeLibFromRegistry(project, flags, "jalali");
        catalog = await fetchCatalog(client);
        const theme = resolveOne(catalog, flags.theme) ?? resolveOne(catalog, "graphite");
        if (!theme || theme.type !== "theme")
            throw new Error(`Theme "${flags.theme}" not in registry`);
        const themeItem = await fetchItem(client, theme);
        const themeCss = themeItem.files[0]?.content;
        if (!themeCss)
            throw new Error(`Theme "${theme.slug}" has no CSS`);
        applyThemeTokens(project, theme.slug, themeCss, font.cssVar, flags.dryRun, {
            googleCss: project.framework !== "next",
        });
        info(`${path.relative(project.cwd, project.paths.css)}  (${theme.slug} tokens)`);
    }
    catch (err) {
        fail(err instanceof Error ? err.message : String(err));
        hint("Pass a reachable registry:  --registry http://localhost:3000/r");
        process.exitCode = 1;
        return;
    }
    if (project.framework === "next") {
        const fontsFile = ensureFontModule(project, font, flags.dryRun);
        info(`${path.relative(project.cwd, fontsFile)}  (${font.id})`);
        if (patchLayout(project, font, fontsFile, flags.dryRun)) {
            info(`${path.relative(project.cwd, project.paths.layout)}  lang="fa" dir="rtl"`);
        }
        else {
            warn("Could not patch app/layout.tsx. Set lang=\"fa\" dir=\"rtl\" on <html> and add the font variable class.");
        }
    }
    else {
        if (patchIndexHtml(project, flags.dryRun)) {
            info(`${path.relative(project.cwd, project.paths.indexHtml)}  lang="fa" dir="rtl"`);
        }
        else {
            warn("Set lang=\"fa\" dir=\"rtl\" on <html> yourself.");
        }
        info(`font  Vazirmatn via Google Fonts in ${path.relative(project.cwd, project.paths.css)}`);
    }
    await writeAgentGuides(project, flags, client, catalog, font.id);
    if (ensureTsPathAlias(project, flags.dryRun))
        info("tsconfig paths  @/*");
    writeConfig(project, flags.dryRun);
    info("vibefarsi.json");
    console.log("");
    info(`RTL + ${font.id === "iransans" ? "IRANSans" : "Vazirmatn"} + ${flags.theme} tokens + lib/utils.ts + lib/jalali.ts + agent rules`);
    hint("npx vibefarsi add button calendar price");
}
