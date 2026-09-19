import { createMcpHandler } from "@modelcontextprotocol/server";
import { createServer } from "../../mcp/dist/server.js";
import { useLocalRegistry } from "../../mcp/dist/load.js";
import { buildCatalog } from "@/lib/registry";
import { readSource } from "@/lib/source";

useLocalRegistry({
  catalog: () => buildCatalog(),
  readFile: (file) => {
    try {
      return readSource(file);
    } catch {
      return undefined;
    }
  },
});

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 120;
const hits = new Map<string, number[]>();

const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Accept, Authorization, MCP-Protocol-Version, MCP-Session-Id, Last-Event-ID",
  "Access-Control-Expose-Headers": "MCP-Session-Id, MCP-Protocol-Version",
};

const handler = createMcpHandler(createServer, { responseMode: "json" });

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

function overLimit(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 8_000) {
    for (const [key, times] of hits) {
      const last = times[times.length - 1];
      if (!last || now - last > WINDOW_MS) hits.delete(key);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

function withCors(response: Response): Response {
  const next = new Response(response.body, response);
  for (const [key, value] of Object.entries(CORS)) next.headers.set(key, value);
  return next;
}

function isBrowserGet(request: Request): boolean {
  if (request.method !== "GET") return false;
  const accept = request.headers.get("accept") ?? "";
  return accept.includes("text/html") && !accept.includes("text/event-stream");
}

export async function handleMcp(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") {
    return withCors(new Response(null, { status: 204 }));
  }

  if (isBrowserGet(request)) {
    return withCors(Response.redirect(new URL("/docs#mcp", request.url), 302));
  }

  if (overLimit(clientIp(request))) {
    return withCors(
      new Response(JSON.stringify({ error: "rate_limited" }), {
        status: 429,
        headers: { "Content-Type": "application/json", "Retry-After": "60" },
      }),
    );
  }

  return withCors(await handler.fetch(request));
}
