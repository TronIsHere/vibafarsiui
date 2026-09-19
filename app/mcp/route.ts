import { handleMcp } from "@/lib/mcp/handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export function OPTIONS(request: Request) {
  return handleMcp(request);
}

export function GET(request: Request) {
  return handleMcp(request);
}

export function POST(request: Request) {
  return handleMcp(request);
}

export function DELETE(request: Request) {
  return handleMcp(request);
}
