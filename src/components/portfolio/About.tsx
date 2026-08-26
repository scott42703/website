"use client";

import { personal } from "@/data/personal";
import { education } from "@/data/education";
import { certifications } from "@/data/certifications";
import { experience } from "@/data/experience";
import { useFinderNav } from "@/components/windows/FinderWindow";
import { RetroButton } from "@/components/ui/RetroButton";
import { Page, PageHeader, Panel, SubHeading } from "./shared";

export function About() {
  const { navigate } = useFinderNav();
  const current = experience[0];
  const highestDegree = education[0];

  return (
    <Page>
      <PageHeader
        eyebrow="About Me"
        title={personal.name}
        description={`${personal.title}, based in ${personal.location}.`}
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <div className="space-y-3.5">
          {personal.bio.map((paragraph, i) => (
            <p
              key={i}
              className="text-[13.5px] leading-[1.75] text-[var(--ink-soft)]"
            >
              {paragraph}
            </p>
          ))}

          <div className="flex flex-wrap gap-2 pt-1">
            <RetroButton onClick={() => navigate({ section: "experience" })}>
              See Experience
            </RetroButton>
            <RetroButton onClick={() => navigate({ section: "projects" })}>
              See Projects
            </RetroButton>
          </div>
        </div>

        <aside className="space-y-2.5">
          <Panel>
            <SubHeading>
              {current.endDate ? "Most Recent" : "Currently"}
            </SubHeading>
            <p className="text-[13px] leading-snug font-semibold text-[var(--ink)]">
              {current.position}
            </p>
            <p className="text-[12.5px] text-[var(--ink-soft)]">
              {current.organization}
            </p>
            <p className="mt-1 text-[11.5px] text-[var(--ink-faint)]">
              {current.dateLabel} · {current.location}
            </p>
          </Panel>

          <Panel>
            <SubHeading>Education</SubHeading>
            <p className="text-[13px] leading-snug font-semibold text-[var(--ink)]">
              {highestDegree.degree}, {highestDegree.program}
            </p>
            <p className="text-[12.5px] text-[var(--ink-soft)]">
              {highestDegree.school}
            </p>
            <p className="mt-1 text-[11.5px] text-[var(--ink-faint)]">
              {highestDegree.dateLabel}
            </p>
          </Panel>

          <Panel>
            <SubHeading>Certified</SubHeading>
            <ul className="space-y-1">
              {certifications.map((c) => (
                <li key={c.id} className="text-[12.5px] text-[var(--ink-soft)]">
                  {c.name}
                </li>
              ))}
            </ul>
          </Panel>

          <Panel>
            <SubHeading>Based In</SubHeading>
            <p className="text-[12.5px] text-[var(--ink-soft)]">
              {personal.location}
            </p>
          </Panel>
        </aside>
      </div>
    </Page>
  );
}
