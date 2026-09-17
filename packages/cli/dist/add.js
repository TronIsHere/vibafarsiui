import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { applyItemCss, applyThemeTokens } from "./css.js";
import { fail, hint, info, skip, title, warn } from "./log.js";
import { loadProject, resolveTarget, writeFile } from "./project.js";
import { fetchCatalog, fetchItem, implicitLibSlugs, lucideNeeded, makeClient, resolveItems, resolveOne, rewriteUserSource, } from "./registry.js";
function installArgs(pm, pkgs) {
    if (pm === "yarn")
        return ["add", ...pkgs];
    if (pm === "pnpm")
        return ["add", ...pkgs];
    if (pm === "bun")
        return ["add", ...pkgs];
    return ["install", ...pkgs];
}
function readPkg(file) {
    try {
        return JSON.parse(readFileSync(file, "utf8"));
    }
    catch {
        return {};
    }
}
function installPackages(project, pkgs, dryRun) {
    const unique = Array.from(new Set(pkgs)).filter(Boolean);
    if (!unique.length)
        return;
    const pkg = existsSync(project.paths.pkg) ? readPkg(project.paths.pkg) : {};
    const have = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
    const missing = unique.filter((p) => !(p in have));
    if (!missing.length) {
        skip(`deps already installed (${unique.join(", ")})`);
        return;
    }
    info(`install ${missing.join(" ")}  (${project.pm})`);
    if (dryRun)
        return;
    const result = spawnSync(project.pm, installArgs(project.pm, missing), {
        cwd: project.cwd,
        stdio: "inherit",
        shell: true,
    });
    if (result.status !== 0) {
        warn(`Could not install with ${project.pm}. Run: ${project.pm} ${installArgs(project.pm, missing).join(" ")}`);
    }
}
function collectQueue(catalog, names) {
    const { found, missing } = resolveItems(catalog, names);
    const queue = [];
    const seen = new Set();
    const walk = (item) => {
        const key = `${item.type}:${item.slug}`;
        if (seen.has(key))
            return;
        seen.add(key);
        for (const dep of item.registryDeps) {
            const resolved = resolveOne(catalog, dep);
            if (resolved)
                walk(resolved);
        }
        queue.push(item);
    };
    for (const item of found)
        walk(item);
    return { queue, missing };
}
function isCssItem(item, payload) {
    return item.type === "theme" || payload.type === "registry:theme" || payload.files.every((f) => f.path.endsWith(".css") || f.type === "registry:style");
}
async function materialize(project, client, catalog, item, flags, written) {
    const key = `${item.type}:${item.slug}`;
    if (written.has(key))
        return undefined;
    written.add(key);
    const payload = await fetchItem(client, item);
    const extra = implicitLibSlugs(payload.files.map((f) => f.content).join("\n"));
    for (const slug of extra) {
        if (slug === item.slug)
            continue;
        const lib = resolveOne(catalog, slug);
        if (lib && lib.type === "lib")
            await materialize(project, client, catalog, lib, flags, written);
    }
    if (isCssItem(item, payload)) {
        const css = payload.files.map((f) => f.content).join("\n");
        applyThemeTokens(project, item.slug, css, "--font-vazirmatn", flags.dryRun, {
            googleCss: project.framework !== "next",
        });
        info(`theme  ${item.slug} → ${path.relative(project.cwd, project.paths.css)}`);
        return payload;
    }
    for (const file of payload.files) {
        const dest = resolveTarget(project, file.path);
        const rel = path.relative(project.cwd, dest);
        if (existsSync(dest) && !flags.overwrite) {
            skip(`${rel} (exists)`);
            continue;
        }
        writeFile(dest, rewriteUserSource(file.content), flags.dryRun);
        info(rel);
    }
    if (applyItemCss(project, payload, flags.dryRun)) {
        info(`css    ${item.slug} → ${path.relative(project.cwd, project.paths.css)}`);
    }
    return payload;
}
export async function runAdd(flags) {
    if (!flags.positionals.length) {
        fail("Nothing to add. Try: npx vibefarsi add button calendar price");
        process.exitCode = 1;
        return;
    }
    const project = loadProject(flags.cwd, { registry: flags.registry });
    const client = makeClient(project.config.registry);
    title("vibefarsi add");
    hint(`registry  ${project.config.registry}`);
    let catalog;
    try {
        catalog = await fetchCatalog(client);
    }
    catch (err) {
        fail(err instanceof Error ? err.message : String(err));
        hint("Pass --registry http://localhost:3000/r if you are developing locally.");
        process.exitCode = 1;
        return;
    }
    const { queue, missing } = collectQueue(catalog, flags.positionals);
    if (missing.length) {
        fail(`Not in registry: ${missing.join(", ")}`);
        hint("npx vibefarsi list");
        process.exitCode = 1;
        return;
    }
    const deps = new Set();
    const written = new Set();
    for (const item of queue) {
        try {
            const payload = await materialize(project, client, catalog, item, flags, written);
            if (!payload)
                continue;
            for (const d of payload.dependencies ?? [])
                deps.add(d);
            if (payload.files.some((f) => lucideNeeded(f.content)))
                deps.add("lucide-react");
        }
        catch (err) {
            fail(`${item.slug}: ${err instanceof Error ? err.message : String(err)}`);
            process.exitCode = 1;
            return;
        }
    }
    if (flags.install)
        installPackages(project, [...deps], flags.dryRun);
    else if (deps.size)
        hint(`skip install. Later: ${project.pm} ${installArgs(project.pm, [...deps]).join(" ")}`);
}
export async function runList(flags) {
    const project = loadProject(flags.cwd, { registry: flags.registry });
    const client = makeClient(project.config.registry);
    const catalog = await fetchCatalog(client);
    const filter = flags.positionals[0];
    const items = filter
        ? catalog.items.filter((i) => i.type === filter || i.type === filter.replace(/s$/, "") || `${i.type}s` === filter)
        : catalog.items;
    const grouped = new Map();
    for (const item of items) {
        const list = grouped.get(item.type) ?? [];
        list.push(item);
        grouped.set(item.type, list);
    }
    for (const [type, list] of grouped) {
        title(type);
        for (const item of list) {
            console.log(`  ${item.slug.padEnd(22)} ${item.name}`);
        }
    }
}
