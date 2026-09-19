#!/usr/bin/env node
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { createServer, VERSION } from "./server.js";

export { createServer, VERSION };

void serveStdio(createServer);
console.error(`vibefarsi MCP ${VERSION} on stdio`);
