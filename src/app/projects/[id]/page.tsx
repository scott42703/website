import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DesktopShell } from "@/components/desktop/DesktopShell";
import { StaticContent } from "@/components/seo/StaticContent";
import { projectById, projects } from "@/data/projects";
import { personal } from "@/data/personal";
import { siteUrl } from "@/lib/seo";

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/projects/[id]">): Promise<Metadata> {
  const { id } = await params;
  const project = projectById(id);
  if (!project) return {};

  const title = `${project.title} | ${personal.name}`;
  return {
    metadataBase: new URL(siteUrl),
    title,
    description: project.shortDescription,
    alternates: { canonical: `/projects/${project.id}` },
    openGraph: {
      type: "article",
      title,
      description: project.shortDescription,
      url: `/projects/${project.id}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.shortDescription,
    },
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[id]">) {
  const { id } = await params;
  const project = projectById(id);
  if (!project) notFound();

  return (
    <>
      <StaticContent />
      <DesktopShell
        initialRoute={{ section: "projects", itemId: project.id }}
      />
    </>
  );
}
