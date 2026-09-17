import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
const DEFAULT_REGISTRY = "https://vibefarsi.dev/r";
export function defaultConfig() {
    return {
        registry: process.env.VIBEFARSI_REGISTRY || process.env.VIBEFARSI_URL || DEFAULT_REGISTRY,
        theme: "graphite",
        font: "vazirmatn",
        aliases: {
            components: "@/components",
            utils: "@/lib/utils",
            lib: "@/lib",
        },
        tailwind: { css: "app/globals.css" },
    };
}
function readJson(file) {
    try {
        return JSON.parse(readFileSync(file, "utf8"));
    }
    catch {
        return null;
    }
}
function hasDep(pkg, name) {
    const deps = { ...pkg?.dependencies, ...pkg?.devDependencies };
    return Boolean(deps && name in deps);
}
function detectPm(cwd) {
    if (existsSync(path.join(cwd, "bun.lock")) || existsSync(path.join(cwd, "bun.lockb")))
        return "bun";
    if (existsSync(path.join(cwd, "pnpm-lock.yaml")))
        return "pnpm";
    if (existsSync(path.join(cwd, "yarn.lock")))
        return "yarn";
    return "npm";
}
function firstExisting(cwd, candidates) {
    return candidates.map((f) => path.join(cwd, f)).find((f) => existsSync(f));
}
export function loadProject(cwd, overrides = {}) {
    const pkgPath = path.join(cwd, "package.json");
    const pkg = readJson(pkgPath);
    const src = existsSync(path.join(cwd, "src", "app")) || existsSync(path.join(cwd, "src", "pages"));
    const configPath = path.join(cwd, "vibefarsi.json");
    const saved = existsSync(configPath) ? readJson(configPath) : {};
    const config = {
        ...defaultConfig(),
        ...saved,
        ...overrides,
        aliases: { ...defaultConfig().aliases, ...saved?.aliases, ...overrides.aliases },
        tailwind: { ...defaultConfig().tailwind, ...saved?.tailwind, ...overrides.tailwind },
    };
    let framework = "unknown";
    if (hasDep(pkg, "next"))
        framework = "next";
    else if (hasDep(pkg, "vite"))
        framework = "vite";
    else if (hasDep(pkg, "react"))
        framework = "react";
    const layout = firstExisting(cwd, [
        "app/layout.tsx",
        "app/layout.jsx",
        "app/layout.js",
        "src/app/layout.tsx",
        "src/app/layout.jsx",
        "src/app/layout.js",
    ]);
    const indexHtml = firstExisting(cwd, ["index.html", "src/index.html"]);
    const css = firstExisting(cwd, [
        config.tailwind.css,
        src ? "src/app/globals.css" : "app/globals.css",
        src ? "src/index.css" : "index.css",
        "src/app/globals.css",
        "app/globals.css",
        "src/styles/globals.css",
        "styles/globals.css",
        "src/index.css",
        "src/app.css",
    ]) ?? path.join(cwd, src ? "src/app/globals.css" : "app/globals.css");
    const fonts = firstExisting(cwd, ["app/fonts.ts", "src/app/fonts.ts"]);
    const tsconfig = firstExisting(cwd, ["tsconfig.json", "jsconfig.json"]);
    const cssRel = path.relative(cwd, css).replaceAll("\\", "/");
    config.tailwind.css = cssRel;
    return {
        cwd,
        framework,
        pm: detectPm(cwd),
        src,
        config,
        paths: {
            pkg: pkgPath,
            layout,
            indexHtml,
            css,
            fonts,
            tsconfig,
            config: configPath,
        },
    };
}
export function resolveTarget(project, rel) {
    const normalized = rel.replaceAll("\\", "/").replace(/^\.\//, "");
    if (project.src && /^(app|components|lib|fonts)\//.test(normalized)) {
        return path.join(project.cwd, "src", normalized);
    }
    return path.join(project.cwd, normalized);
}
export function ensureDir(file) {
    mkdirSync(path.dirname(file), { recursive: true });
}
export function writeFile(file, content, dryRun) {
    if (dryRun)
        return;
    ensureDir(file);
    writeFileSync(file, content.endsWith("\n") ? content : `${content}\n`, "utf8");
}
export function readText(file) {
    return existsSync(file) ? readFileSync(file, "utf8") : null;
}
export function hasIranSansFiles(project) {
    const roots = [project.cwd, path.join(project.cwd, "public"), path.join(project.cwd, "fonts"), path.join(project.cwd, "src", "fonts")];
    return roots.some((root) => existsSync(path.join(root, "IRANSans-Reg.woff")) || existsSync(path.join(root, "IRANSans-Regular.woff")));
}
export function writeConfig(project, dryRun) {
    const body = `${JSON.stringify(project.config, null, 2)}\n`;
    writeFile(project.paths.config, body, dryRun);
}
export function ensureTsPathAlias(project, dryRun) {
    const file = project.paths.tsconfig;
    if (!file)
        return false;
    const raw = readText(file);
    if (!raw)
        return false;
    let json;
    try {
        json = JSON.parse(raw);
    }
    catch {
        return false;
    }
    const compiler = (json.compilerOptions ?? {});
    const paths = (compiler.paths ?? {});
    if (paths["@/*"])
        return false;
    compiler.paths = { ...paths, "@/*": [project.src ? "./src/*" : "./*"] };
    if (!compiler.baseUrl)
        compiler.baseUrl = ".";
    json.compilerOptions = compiler;
    writeFile(file, `${JSON.stringify(json, null, 2)}\n`, dryRun);
    return true;
}
