"use client";

import { projectCategories } from "@/data/projects";
import type { Project } from "@/data/types";
import { useFinderNav } from "@/components/windows/FinderWindow";
import { RetroButton, RetroLink } from "@/components/ui/RetroButton";
import { BranchIcon, ChevronLeft, ExternalIcon } from "@/components/ui/icons";
import { BulletList, Page, PageHeader, SubHeading, TechList } from "./shared";
import { ProjectThumb } from "./Projects";
import { assetPath } from "@/lib/asset";

export function ProjectDetail({ project }: { project: Project }) {
  const { navigate, route } = useFinderNav();
  const categories = projectCategories.filter((c) =>
    project.categoryIds.includes(c.id),
  );
  // Go back to the folder the visitor actually came through, when there was
  // one, a project can be filed under more than one category.
  const backCategory =
    categories.find((c) => c.id === route.categoryId) ?? categories[0];

  return (
    <Page>
      <RetroButton
        size="sm"
        className="mb-4"
        onClick={() =>
          navigate({
            section: "projects",
            categoryId: backCategory?.id,
          })
        }
      >
        <ChevronLeft size={12} />
        {backCategory?.name ?? "Projects"}
      </RetroButton>

      <PageHeader
        eyebrow={categories.map((c) => c.name).join(" · ")}
        title={project.title}
        description={project.shortDescription}
      />

      {/* Action buttons appear only when the corresponding URL exists. */}
      {(project.demoUrl || project.githubUrl) && (
        <div className="mb-5 flex flex-wrap gap-2">
          {project.demoUrl && (
            <RetroLink variant="primary" href={project.demoUrl}>
              <ExternalIcon size={13} />
              Open Project
            </RetroLink>
          )}
          {project.githubUrl && (
            <RetroLink href={project.githubUrl}>
              <BranchIcon size={13} />
              Source Code
            </RetroLink>
          )}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          <section className="space-y-3">
            {project.longDescription.map((paragraph, i) => (
              <p
                key={i}
                className="text-[13.5px] leading-[1.75] text-[var(--ink-soft)]"
              >
                {paragraph}
              </p>
            ))}
          </section>

          {project.screenshots.length > 0 && (
            <section>
              <SubHeading>Screenshots</SubHeading>
              <ul className="grid gap-2 sm:grid-cols-2">
                {project.screenshots.map((s) => (
                  <li key={s.src}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={assetPath(s.src)}
                      alt={s.alt}
                      loading="lazy"
                      className="surface-inset w-full"
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {project.architectureDiagram && (
            <section>
              <SubHeading>Architecture</SubHeading>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={assetPath(project.architectureDiagram.src)}
                alt={project.architectureDiagram.alt}
                loading="lazy"
                className="surface-inset w-full bg-[var(--surface)]"
              />
            </section>
          )}

          {project.accomplishments.length > 0 && (
            <section>
              <SubHeading>What it achieved</SubHeading>
              <BulletList items={project.accomplishments} />
            </section>
          )}

          {project.lessonsLearned.length > 0 && (
            <section>
              <SubHeading>Lessons learned</SubHeading>
              <BulletList items={project.lessonsLearned} />
            </section>
          )}
        </div>

        <aside className="space-y-4">
          <ProjectThumb project={project} />
          <div>
            <SubHeading>Date</SubHeading>
            <p className="text-[13px] text-[var(--ink)]">{project.dateLabel}</p>
          </div>
          <div>
            <SubHeading>Technologies</SubHeading>
            <TechList items={project.technologies} />
          </div>
          {categories.length > 0 && (
            <div>
              <SubHeading>Filed under</SubHeading>
              <ul className="flex flex-wrap gap-1.5">
                {categories.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() =>
                        navigate({ section: "projects", categoryId: c.id })
                      }
                      className="border border-[var(--accent)] bg-[var(--accent-soft)] px-2 py-[3px] text-[11px] leading-none text-[var(--accent)] hover:brightness-95"
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </Page>
  );
}
