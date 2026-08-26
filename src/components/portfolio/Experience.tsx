"use client";

import { experience } from "@/data/experience";
import { useFinderNav } from "@/components/windows/FinderWindow";
import { BriefcaseGlyph, ChevronLeft } from "@/components/ui/icons";
import { RetroButton } from "@/components/ui/RetroButton";
import {
  BulletList,
  EmptyState,
  Page,
  PageHeader,
  PanelButton,
  SubHeading,
  TechList,
} from "./shared";

export function Experience({ itemId }: { itemId?: string }) {
  const { navigate } = useFinderNav();
  const role = itemId ? experience.find((r) => r.id === itemId) : undefined;

  if (itemId && !role) {
    return (
      <Page>
        <EmptyState>
          That role no longer exists.{" "}
          <button
            type="button"
            className="underline"
            onClick={() => navigate({ section: "experience" })}
          >
            Back to Experience
          </button>
        </EmptyState>
      </Page>
    );
  }

  if (role) {
    return (
      <Page>
        <RetroButton
          size="sm"
          className="mb-4"
          onClick={() => navigate({ section: "experience" })}
        >
          <ChevronLeft size={12} />
          Experience
        </RetroButton>

        <PageHeader
          eyebrow={role.organization}
          title={role.position}
          description={role.summary}
        />

        <dl className="mb-5 grid gap-x-6 gap-y-2 border-b border-[var(--hairline)] pb-4 sm:grid-cols-3">
          <Field label="Organization" value={role.organization} />
          <Field
            label="Dates"
            value={
              role.employmentType
                ? `${role.dateLabel} · ${role.employmentType}`
                : role.dateLabel
            }
          />
          <Field label="Location" value={role.location} />
        </dl>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <section>
            <SubHeading>Responsibilities</SubHeading>
            <BulletList items={role.responsibilities} />
          </section>

          <div className="space-y-5">
            {role.accomplishments.length > 0 && (
              <section>
                <SubHeading>Major Accomplishments</SubHeading>
                <BulletList items={role.accomplishments} />
              </section>
            )}
            <section>
              <SubHeading>Technologies</SubHeading>
              <TechList items={role.technologies} />
            </section>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader
        eyebrow="Experience"
        title="Where I have worked"
        description="Each role opens like a file. Roles are listed most recent first."
      />

      <ul className="space-y-2.5">
        {experience.map((r) => (
          <li key={r.id}>
            <PanelButton
              label={`Open ${r.position} at ${r.organization}`}
              onClick={() => navigate({ section: "experience", itemId: r.id })}
            >
              <div className="flex items-start gap-3.5">
                <BriefcaseGlyph size={38} className="mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <h3 className="text-[15px] font-semibold text-[var(--ink)]">
                      {r.position}
                    </h3>
                    <span className="label-micro shrink-0 text-[10px] text-[var(--ink-faint)]">
                      {r.dateLabel}
                    </span>
                  </div>
                  <p className="text-[12.5px] font-medium text-[var(--accent)]">
                    {r.organization}
                    {r.employmentType ? ` · ${r.employmentType}` : ""}
                  </p>
                  <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-[var(--ink-soft)]">
                    {r.summary}
                  </p>
                  <div className="mt-2.5">
                    <TechList items={r.technologies.slice(0, 5)} />
                  </div>
                </div>
              </div>
            </PanelButton>
          </li>
        ))}
      </ul>
    </Page>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="label-micro text-[10px] tracking-widest text-[var(--ink-faint)] uppercase">
        {label}
      </dt>
      <dd className="mt-0.5 text-[13px] text-[var(--ink)]">{value}</dd>
    </div>
  );
}
