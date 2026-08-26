import type { Metadata } from "next";
import { DesktopShell } from "@/components/desktop/DesktopShell";
import { StaticContent } from "@/components/seo/StaticContent";
import { buildMetadata } from "@/lib/seo";

// Declared explicitly rather than through [section], because the static
// `projects` segment also hosts /projects/[id].
export const metadata: Metadata = buildMetadata("projects");

export default function ProjectsPage() {
  return (
    <>
      <StaticContent />
      <DesktopShell initialRoute={{ section: "projects" }} />
    </>
  );
}
