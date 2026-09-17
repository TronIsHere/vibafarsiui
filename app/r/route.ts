import { buildCatalog } from "@/lib/registry";

/**
 * Registry index for the MCP server and CLI: GET /r
 * Item payloads live at /r/{type}/{slug}.json
 */
export async function GET() {
  return Response.json(buildCatalog(), { headers: { "Cache-Control": "public, max-age=3600" } });
}
