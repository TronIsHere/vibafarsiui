import type { NextConfig } from "next";

/**
 * Community code runs in /sandbox. The CSP sandbox gives it an opaque origin even when opened
 * directly, so submitted code can't read cookies or call same-origin APIs. Dev only skips it:
 * Chrome sends no Referer from an opaque origin and `next dev` then 403s every chunk.
 */
const SANDBOX_CSP =
  process.env.NODE_ENV === "production"
    ? [{ key: "Content-Security-Policy", value: "sandbox allow-scripts; form-action 'none'" }]
    : [];

const nextConfig: NextConfig = {
  serverExternalPackages: ["@modelcontextprotocol/server", "@modelcontextprotocol/core"],
  experimental: {
    serverActions: {
      // Showcase screenshots are capped at 1.5MB; multipart overhead needs the rest.
      bodySizeLimit: "2mb",
    },
  },
  async headers() {
    return [
      {
        source: "/sandbox",
        headers: [...SANDBOX_CSP, { key: "X-Robots-Tag", value: "noindex" }],
      },
      {
        // Font requests from the opaque-origin sandbox are cross-origin and need CORS.
        source: "/_next/static/media/:path*",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
    ];
  },
};

export default nextConfig;
