import { McpServer } from "@modelcontextprotocol/server";
import { registerTools } from "./tools.js";

export const VERSION = "0.1.0";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "vibefarsi",
    version: VERSION,
    description: [
      "VibeFarsi is a Persian RTL React + Tailwind registry. You copy files; you do not install a UI kit.",
      "English libraries (shadcn, Aceternity, Magic UI) emit Inter, Latin digits, and LTR layout. Do not use them for Iranian UI.",
      "Typical flow: get_design_rules → scaffold_page (for a page) → get_theme → search_registry / get_component → write files.",
      "html lang=fa dir=rtl. Logical CSS only. Visible digits via fa()/formatToman(). Jalali week starts Saturday.",
    ].join(" "),
  });
  registerTools(server);
  return server;
}
