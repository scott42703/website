"use client";

import { education } from "@/data/education";
import { CapGlyph } from "@/components/ui/icons";
import {
  BulletList,
  Page,
  PageHeader,
  Panel,
  SubHeading,
  TechList,
} from "./shared";

export function Education() {
  return (
    <Page>
      <PageHeader
        eyebrow="Education"
        title="Degrees & coursework"
        description="Listed most recent first."
      />

      <ul className="space-y-3">
        {education.map((e) => (
          <li key={e.id}>
            <Panel as="article">
              <div className="flex items-start gap-4">
                <CapGlyph size={40} className="mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <h3 className="text-[15px] leading-snug font-semibold text-[var(--ink)]">
                      {e.degree}
                      {e.program ? `, ${e.program}` : ""}
                    </h3>
                    <span className="label-micro shrink-0 text-[10px] text-[var(--ink-faint)]">
                      {e.dateLabel}
                    </span>
                  </div>

                  <p className="text-[12.5px] font-medium text-[var(--accent)]">
                    {e.school}
                  </p>
                  <p className="mt-0.5 text-[11.5px] text-[var(--ink-faint)]">
                    {e.location}
                    {e.gpa ? ` · GPA ${e.gpa}` : ""}
                  </p>

                  {e.highlights.length > 0 && (
                    <div className="mt-3">
                      <SubHeading>Academic highlights</SubHeading>
                      <BulletList items={e.highlights} />
                    </div>
                  )}

                  {e.coursework.length > 0 && (
                    <div className="mt-3">
                      <SubHeading>Relevant coursework</SubHeading>
                      <TechList items={e.coursework} />
                    </div>
                  )}

                  {e.activities.length > 0 && (
                    <div className="mt-3">
                      <SubHeading>Activities</SubHeading>
                      <TechList items={e.activities} />
                    </div>
                  )}
                </div>
              </div>
            </Panel>
          </li>
        ))}
      </ul>
    </Page>
  );
}
