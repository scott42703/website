/**
 * Prefixes a path in /public with the deployment's base path.
 *
 * Next rewrites hrefs inside <Link> and its own asset URLs automatically, but
 * not raw attributes like <audio src>, <object data> or a plain <a href>. On a
 * host that serves the site from a subdirectory, such as a GitHub Pages
 * project site, those would otherwise resolve to the domain root and 404.
 *
 * Set NEXT_PUBLIC_BASE_PATH to "/repo-name" for that case. Leave it unset when
 * the site is served from the root of its domain.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetPath(path: string): string {
  // Absolute URLs and data URIs are already complete.
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}

/** The site's own base path, for the few places that need it directly. */
export const basePath = BASE_PATH;

/**
 * Compares two in-page paths, ignoring a trailing slash. Static exports are
 * built with trailing slashes, so the address bar and our own route strings
 * would otherwise never look equal.
 */
export function samePath(a: string, b: string): boolean {
  const trim = (p: string) => p.replace(/\/+$/, "") || "/";
  return trim(a) === trim(b);
}
