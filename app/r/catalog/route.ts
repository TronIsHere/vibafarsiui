import { buildCatalog } from "@/lib/registry";

/** Registry index: GET /r/catalog  (also /r via app/r/route.ts) */
export async function GET() {
  return Response.json(buildCatalog(), { headers: { "Cache-Control": "public, max-age=3600" } });
}
