import type { MetadataRoute } from "next";
import { linkableSections } from "@/lib/apps";
import { projects } from "@/data/projects";
import { siteUrl } from "@/lib/seo";

// Emitted as a file at build time so a static host can serve it.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", ...linkableSections.map((s) => `/${s}`), "/resume"];
  const projectRoutes = projects.map((p) => `/projects/${p.id}`);

  return [...routes, ...projectRoutes].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
