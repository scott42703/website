import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DesktopShell } from "@/components/desktop/DesktopShell";
import { StaticContent } from "@/components/seo/StaticContent";
import { linkableSections } from "@/lib/apps";
import { buildMetadata } from "@/lib/seo";
import type { SectionId } from "@/data/types";

/**
 * The linkable Finder sections, plus /resume which opens the document.
 * `projects` is excluded, it has its own folder so it can host
 * /projects/[id], and two routes resolving to /projects would collide.
 */
const ROUTES = [
  ...linkableSections.filter((s) => s !== "projects"),
  "resume",
] as const;

export function generateStaticParams() {
  return ROUTES.map((section) => ({ section }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/[section]">): Promise<Metadata> {
  const { section } = await params;
  return buildMetadata(section);
}

export default async function SectionPage({ params }: PageProps<"/[section]">) {
  const { section } = await params;
  if (!(ROUTES as readonly string[]).includes(section)) notFound();

  const isResume = section === "resume";

  return (
    <>
      <StaticContent />
      <DesktopShell
        initialRoute={
          isResume ? { section: "home" } : { section: section as SectionId }
        }
        initialApp={isResume ? "resume" : undefined}
      />
    </>
  );
}
