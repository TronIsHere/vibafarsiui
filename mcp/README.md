# @vibefarsi/mcp

MCP server for [VibeFarsi](https://vibefarsi.dev). English UI libraries emit Inter, Latin digits, and LTR layout. This server hands the model Persian RTL rules and the actual registry files.

## Tools

| Tool | Role |
| --- | --- |
| `get_design_rules` | RTL, type, digits, forms, tokens, Iranian patterns |
| `search_registry` | Find components / templates in Persian or English |
| `get_component` | Source + prompt + deps |
| `get_theme` | CSS tokens (default Graphite) |
| `scaffold_page` | Page brief → composition plan |

## Cursor / Claude Code / Windsurf

```json
{
  "mcpServers": {
    "vibefarsi": {
      "command": "npx",
      "args": ["-y", "@vibefarsi/mcp"]
    }
  }
}
```

From this repo, before publish: `npm run mcp`. Optional `VIBEFARSI_URL` (default `https://vibefarsi.dev`) and `VIBEFARSI_ROOT` if the registry lives elsewhere.

Typical model flow: `get_design_rules` → `scaffold_page` → `get_theme` → `get_component`.
