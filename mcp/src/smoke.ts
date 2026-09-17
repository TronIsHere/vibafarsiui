/**
 * Runs the five tools against the local registry (no MCP host required).
 *   npx tsx src/smoke.ts
 */
import { handleDesignRules, handleGetComponent, handleGetTheme, handleScaffold, handleSearch } from "./tools.js";

async function section(title: string, run: () => Promise<string>) {
  const body = await run();
  const preview = body.length > 900 ? `${body.slice(0, 900)}\n… (${body.length} chars)` : body;
  console.log(`\n======== ${title} ========\n${preview}`);
}

await section("get_design_rules(forms)", () => handleDesignRules("forms"));
await section("search_registry(تقویم)", () => handleSearch("تقویم"));
await section("search_registry(toman)", () => handleSearch("toman"));
await section("get_component(otp-field)", () => handleGetComponent(["otp-field"], true));
await section("get_theme(paper)", () => handleGetTheme("کاغذ"));
await section("scaffold_page(پرداخت)", () => handleScaffold("صفحه پرداخت", "graphite"));
console.log("\nsmoke ok");
