# @vibefarsi/mcp

MCP server for [VibeFarsi](https://vibefarsi.ir). English UI libraries emit Inter, Latin digits, and LTR layout. This server hands the model Persian RTL rules and the actual registry files.

The hosted endpoint is `https://vibefarsi.ir/mcp` (Streamable HTTP). This package is the local stdio fallback: `npx -y @vibefarsi/mcp`.

## Tools

| Tool | Role |
| --- | --- |
| `get_design_rules` | RTL, type, digits, forms, tokens, Iranian patterns |
| `search_registry` | Find components / templates in Persian or English |
| `get_component` | Source + prompt + deps |
| `get_theme` | CSS tokens (default Graphite) |
| `scaffold_page` | Page brief → composition plan |

## Cursor / Claude Code / Codex

Remote (no Node on the machine):

```json
{
  "mcpServers": {
    "vibefarsi": {
      "url": "https://vibefarsi.ir/mcp"
    }
  }
}
```

- Cursor: paste that into `.cursor/mcp.json`, or [Add to Cursor](https://cursor.com/en/install-mcp?name=vibefarsi&config=eyJ1cmwiOiJodHRwczovL3ZpYmVmYXJzaS5pci9tY3AifQ==)
- Claude Code: `claude mcp add --transport http vibefarsi https://vibefarsi.ir/mcp`
- Codex: `codex mcp add vibefarsi --url https://vibefarsi.ir/mcp`

Local stdio:

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

From this repo: `npm run mcp`. Optional `VIBEFARSI_URL` (default `https://vibefarsi.ir`) and `VIBEFARSI_ROOT` if the registry lives elsewhere.

Typical model flow: `get_design_rules` → `scaffold_page` → `get_theme` → `get_component`.
