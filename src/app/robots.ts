import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

// Emitted as a file at build time so a static host can serve it.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
