import path from "node:path";
import type { NextConfig } from "next";

/**
 * GitHub Pages serves plain files, so it needs a fully static export, and it
 * serves project repositories from a subdirectory rather than the domain root.
 * Both are opt-in through the environment so the default build stays suited to
 * a normal Node host.
 */
const isStaticExport = process.env.NEXT_OUTPUT === "export";

// e.g. "/portfolio" when the site lives at username.github.io/portfolio.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Pin the workspace root: without this, a package-lock.json further up the
  // filesystem makes Turbopack guess (and warn about) the wrong root.
  turbopack: {
    root: path.resolve(import.meta.dirname),
  },

  ...(isStaticExport ? { output: "export" as const } : {}),

  ...(basePath ? { basePath, assetPrefix: basePath } : {}),

  // Static hosts match /about to /about/index.html, so emit directories.
  trailingSlash: isStaticExport,
};

export default nextConfig;
