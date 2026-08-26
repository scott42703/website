"use client";

import { skillGroups } from "@/data/skills";
import { useFinderNav } from "@/components/windows/FinderWindow";
import { ChevronLeft, FolderGlyph } from "@/components/ui/icons";
import { RetroButton } from "@/components/ui/RetroButton";
import { EmptyState, IconTile, Page, PageHeader, TechList } from "./shared";

export function Skills({ groupId }: { groupId?: string }) {
  const { navigate } = useFinderNav();

  if (groupId) {
    const group = skillGroups.find((g) => g.id === groupId);
    if (!group) {
      return (
        <Page>
          <EmptyState>
            No such skill folder.{" "}
            <button
              type="button"
              className="underline"
              onClick={() => navigate({ section: "skills" })}
            >
              Back to Skills
            </button>
          </EmptyState>
        </Page>
      );
    }
    return (
      <Page>
        <RetroButton
          size="sm"
          className="mb-4"
          onClick={() => navigate({ section: "skills" })}
        >
          <ChevronLeft size={12} />
          Skills
        </RetroButton>
        <PageHeader
          eyebrow="Skills"
          title={group.name}
          description={group.description}
        />
        <TechList items={group.skills} />
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader
        eyebrow="Skills"
        title="Grouped by domain"
        description="Grouped by where the work actually happens. Open a folder for the full list."
      />

      <ul className="mb-6 grid grid-cols-2 gap-1 sm:grid-cols-4">
        {skillGroups.map((g) => (
          <li key={g.id}>
            <IconTile
              glyph={<FolderGlyph size={42} tone="folder-alt" />}
              label={g.name}
              sublabel={`${g.skills.length} items`}
              onOpen={() => navigate({ section: "skills", categoryId: g.id })}
            />
          </li>
        ))}
      </ul>

      <div className="space-y-4 border-t border-[var(--hairline)] pt-5">
        {skillGroups.map((g) => (
          <section key={g.id}>
            <div className="mb-1.5 flex flex-wrap items-baseline gap-x-2">
              <h3 className="label-micro text-[10px] tracking-widest text-[var(--accent)] uppercase">
                {g.name}
              </h3>
              <p className="text-[11.5px] text-[var(--ink-faint)]">
                {g.description}
              </p>
            </div>
            <TechList items={g.skills} />
          </section>
        ))}
      </div>
    </Page>
  );
}
