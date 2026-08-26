"use client";

import {
  featuredProjects,
  projectById,
  projectCategories,
  projectsInCategory,
} from "@/data/projects";
import type { Project } from "@/data/types";
import { useFinderNav } from "@/components/windows/FinderWindow";
import { ChevronLeft, FolderGlyph } from "@/components/ui/icons";
import { RetroButton } from "@/components/ui/RetroButton";
import { EmptyState, IconTile, Page, PageHeader, PanelButton } from "./shared";
import { ProjectDetail } from "./ProjectDetail";
import { assetPath } from "@/lib/asset";

/** A folder with nothing in it should not be on screen. */
const populatedCategories = projectCategories.filter(
  (c) => projectsInCategory(c.id).length > 0,
);

export function Projects({
  categoryId,
  itemId,
}: {
  categoryId?: string;
  itemId?: string;
}) {
  const { navigate, viewMode } = useFinderNav();

  if (itemId) {
    const project = projectById(itemId);
    if (!project) {
      return (
        <Page>
          <EmptyState>
            That project no longer exists.{" "}
            <button
              type="button"
              className="underline"
              onClick={() => navigate({ section: "projects" })}
            >
              Back to Projects
            </button>
          </EmptyState>
        </Page>
      );
    }
    return <ProjectDetail project={project} />;
  }

  if (categoryId) {
    const category = projectCategories.find((c) => c.id === categoryId);
    const items = projectsInCategory(categoryId);
    return (
      <Page>
        <RetroButton
          size="sm"
          className="mb-4"
          onClick={() => navigate({ section: "projects" })}
        >
          <ChevronLeft size={12} />
          Projects
        </RetroButton>

        <PageHeader
          eyebrow="Projects"
          title={category?.name ?? "Projects"}
          description={category?.description}
        />

        {items.length === 0 ? (
          <EmptyState>Nothing filed here yet.</EmptyState>
        ) : (
          <ProjectList items={items} view={viewMode} />
        )}
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader
        eyebrow="Projects"
        title="Sorted into folders"
        description="Open a folder to see what is inside, or jump straight to a featured build below."
      />

      <ul
        className={
          viewMode === "grid"
            ? "grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-4"
            : "space-y-1"
        }
      >
        {populatedCategories.map((cat) => {
          const count = projectsInCategory(cat.id).length;
          return (
            <li key={cat.id}>
              {viewMode === "grid" ? (
                <IconTile
                  glyph={<FolderGlyph size={46} />}
                  label={cat.name}
                  sublabel={`${count} ${count === 1 ? "item" : "items"}`}
                  onOpen={() =>
                    navigate({ section: "projects", categoryId: cat.id })
                  }
                />
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    navigate({ section: "projects", categoryId: cat.id })
                  }
                  className="flex w-full items-center gap-3 border border-transparent px-2 py-2 text-left hover:border-[var(--hairline)] hover:bg-[var(--surface-sunken)]"
                >
                  <FolderGlyph size={26} className="shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-[var(--ink)]">
                      {cat.name}
                    </span>
                    <span className="block truncate text-[11.5px] text-[var(--ink-faint)]">
                      {cat.description}
                    </span>
                  </span>
                  <span className="label-micro shrink-0 text-[10px] text-[var(--ink-faint)]">
                    {count}
                  </span>
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {featuredProjects.length > 0 && (
        <section className="mt-7 border-t border-[var(--hairline)] pt-5">
          <h3 className="label-micro mb-3 text-[10px] tracking-widest text-[var(--ink-faint)] uppercase">
            Featured
          </h3>
          <ProjectList items={featuredProjects} view="grid" />
        </section>
      )}
    </Page>
  );
}

function ProjectList({
  items,
  view,
}: {
  items: Project[];
  view: "grid" | "list";
}) {
  const { navigate, route } = useFinderNav();
  // Keep the folder you came from in the trail when opening a project.
  const from = route.categoryId;

  return (
    <ul
      className={
        view === "grid"
          ? "grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3"
          : "space-y-2.5"
      }
    >
      {items.map((p) => (
        <li key={p.id}>
          <PanelButton
            label={`Open ${p.title}`}
            className="h-full"
            onClick={() =>
              navigate({
                section: "projects",
                categoryId: from ?? p.categoryIds[0],
                itemId: p.id,
              })
            }
          >
            <div className="flex h-full flex-col">
              <ProjectThumb project={p} />
              <div className="mt-3 flex items-start justify-between gap-2">
                <h4 className="text-[14px] leading-snug font-semibold text-[var(--ink)]">
                  {p.title}
                </h4>
              </div>
              <p className="label-micro mt-1 text-[10px] text-[var(--accent)]">
                {p.technologies.slice(0, 3).join("  •  ")}
              </p>
              <p className="mt-2 flex-1 text-[12.5px] leading-relaxed text-[var(--ink-soft)]">
                {p.shortDescription}
              </p>
              <span className="mt-3 inline-block text-[11.5px] font-semibold text-[var(--accent)]">
                Open Project →
              </span>
            </div>
          </PanelButton>
        </li>
      ))}
    </ul>
  );
}

/**
 * Stands in for a screenshot until real ones exist, and renders the first
 * screenshot instead as soon as one is added to the data file.
 */
export function ProjectThumb({ project }: { project: Project }) {
  const shot = project.screenshots[0];
  if (shot) {
    // Screenshots are arbitrary files dropped into /public with no known
    // intrinsic size, so next/image cannot optimise them without dimensions.
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={assetPath(shot.src)}
        alt={shot.alt}
        loading="lazy"
        className="surface-inset h-28 w-full object-cover"
      />
    );
  }

  const initials = project.title
    .split(/\s+/)
    .slice(0, 3)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      aria-hidden
      className="surface-inset relative grid h-28 w-full place-items-center overflow-hidden bg-[var(--surface-sunken)]"
    >
      <span
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, var(--hairline) 0 1px, transparent 1px 7px)",
        }}
      />
      <span className="font-[family-name:var(--font-display)] relative text-[28px] font-bold tracking-widest text-[var(--ink-faint)]">
        {initials}
      </span>
    </div>
  );
}
