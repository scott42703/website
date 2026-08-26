"use client";

import { useMemo } from "react";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";
import { skillGroups } from "@/data/skills";
import { education } from "@/data/education";
import { certifications } from "@/data/certifications";
import { publications } from "@/data/research";
import type { FinderRoute } from "@/lib/apps";
import { useFinderNav } from "@/components/windows/FinderWindow";
import { EmptyState, Page, PageHeader } from "./shared";

interface Hit {
  id: string;
  kind: string;
  title: string;
  detail: string;
  route: FinderRoute;
  haystack: string;
}

/** One flat index over every content file, rebuilt only when data changes. */
function buildIndex(): Hit[] {
  const hits: Hit[] = [];

  for (const p of projects) {
    hits.push({
      id: `project-${p.id}`,
      kind: "Project",
      title: p.title,
      detail: p.shortDescription,
      route: { section: "projects", itemId: p.id },
      haystack: [
        p.title,
        p.shortDescription,
        p.longDescription.join(" "),
        p.technologies.join(" "),
        p.accomplishments.join(" "),
      ]
        .join(" ")
        .toLowerCase(),
    });
  }

  for (const r of experience) {
    hits.push({
      id: `role-${r.id}`,
      kind: "Experience",
      title: `${r.position} at ${r.organization}`,
      detail: r.summary,
      route: { section: "experience", itemId: r.id },
      haystack: [
        r.position,
        r.organization,
        r.summary,
        r.responsibilities.join(" "),
        r.technologies.join(" "),
      ]
        .join(" ")
        .toLowerCase(),
    });
  }

  for (const g of skillGroups) {
    for (const skill of g.skills) {
      hits.push({
        id: `skill-${g.id}-${skill}`,
        kind: "Skill",
        title: skill,
        detail: g.name,
        route: { section: "skills", categoryId: g.id },
        haystack: `${skill} ${g.name}`.toLowerCase(),
      });
    }
  }

  for (const e of education) {
    hits.push({
      id: `edu-${e.id}`,
      kind: "Education",
      title: `${e.degree}${e.program ? `, ${e.program}` : ""}`,
      detail: e.school,
      route: { section: "education" },
      haystack: [e.degree, e.program, e.school, e.coursework.join(" ")]
        .join(" ")
        .toLowerCase(),
    });
  }

  for (const c of certifications) {
    hits.push({
      id: `cert-${c.id}`,
      kind: "Certificate",
      title: c.name,
      detail: c.issuer,
      route: { section: "certifications" },
      haystack: `${c.name} ${c.issuer} ${c.description ?? ""}`.toLowerCase(),
    });
  }

  for (const pub of publications) {
    hits.push({
      id: `pub-${pub.id}`,
      kind: "Research",
      title: pub.title,
      detail: pub.summary,
      route: { section: "research" },
      haystack:
        `${pub.title} ${pub.summary} ${pub.topics.join(" ")}`.toLowerCase(),
    });
  }

  return hits;
}

const INDEX = buildIndex();

export function SearchResults({ query }: { query: string }) {
  const { navigate } = useFinderNav();

  const results = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return [];
    return INDEX.filter((hit) =>
      terms.every((t) => hit.haystack.includes(t)),
    ).slice(0, 40);
  }, [query]);

  return (
    <Page>
      <PageHeader
        eyebrow="Search"
        title={`“${query}”`}
        description={`${results.length} ${results.length === 1 ? "match" : "matches"} across the portfolio.`}
      />

      {results.length === 0 ? (
        <EmptyState>
          Nothing matched. Try a technology name, an employer, or a project.
        </EmptyState>
      ) : (
        <ul className="divide-y divide-[var(--hairline)]">
          {results.map((hit) => (
            <li key={hit.id}>
              <button
                type="button"
                onClick={() => navigate(hit.route)}
                className="flex w-full items-center gap-3 px-2 py-2.5 text-left hover:bg-[var(--surface-sunken)]"
              >
                <span className="label-micro w-[68px] shrink-0 text-[9px] tracking-wide text-[var(--ink-faint)] uppercase">
                  {hit.kind}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold text-[var(--ink)]">
                    {hit.title}
                  </span>
                  <span className="block truncate text-[11.5px] text-[var(--ink-soft)]">
                    {hit.detail}
                  </span>
                </span>
                <span aria-hidden className="shrink-0 text-[var(--ink-faint)]">
                  ▸
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Page>
  );
}
