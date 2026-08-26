"use client";

import { personal } from "@/data/personal";
import { publications, researchSummary } from "@/data/research";
import { DocumentGlyph, ExternalIcon, FlaskGlyph } from "@/components/ui/icons";
import { RetroLink } from "@/components/ui/RetroButton";
import { assetPath } from "@/lib/asset";
import {
  BulletList,
  Page,
  PageHeader,
  Panel,
  SubHeading,
  TechList,
} from "./shared";

/** Author byline with Scott's own name picked out of the list. */
function AuthorList({ authors }: { authors: string[] }) {
  return (
    <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--ink-soft)]">
      {authors.map((author, i) => {
        const isSelf = author === personal.name;
        return (
          <span key={author}>
            {i > 0 && ", "}
            <span
              className={
                isSelf
                  ? "font-bold text-[var(--ink)] underline decoration-[var(--accent)] decoration-2 underline-offset-2"
                  : undefined
              }
            >
              {author}
            </span>
          </span>
        );
      })}
    </p>
  );
}

export function Research() {
  return (
    <Page>
      <PageHeader
        eyebrow="Research"
        title="Network & AI Research"
        description={researchSummary.dateLabel}
      />

      <Panel className="mb-5">
        <div className="flex items-start gap-4">
          <FlaskGlyph size={42} className="mt-0.5 shrink-0" />
          <div className="min-w-0">
            <h3 className="text-[14.5px] font-semibold text-[var(--ink)]">
              {researchSummary.program}
            </h3>
            <p className="mt-2 text-[13.5px] leading-[1.75] text-[var(--ink-soft)]">
              {researchSummary.description}
            </p>
            <div className="mt-3">
              <SubHeading>Focus areas</SubHeading>
              <TechList items={researchSummary.focusAreas} />
            </div>
          </div>
        </div>
      </Panel>

      <h3 className="label-micro mb-3 text-[10px] tracking-widest text-[var(--ink-faint)] uppercase">
        Publications ({publications.length})
      </h3>

      <ul className="space-y-2.5">
        {publications.map((pub) => (
          <li key={pub.id}>
            <Panel as="article">
              <div className="flex items-start gap-3.5">
                <DocumentGlyph
                  size={38}
                  kind="pdf"
                  className="mt-0.5 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-[14px] leading-snug font-semibold text-[var(--ink)]">
                    {pub.title}
                  </h4>

                  {pub.authors.length > 0 && (
                    <AuthorList authors={pub.authors} />
                  )}

                  {(pub.venue || pub.year) && (
                    <p className="mt-1 text-[12px] text-[var(--ink)] italic">
                      {[pub.venue, pub.year].filter(Boolean).join(", ")}
                    </p>
                  )}
                  <p className="mt-0.5 text-[12px] text-[var(--ink-faint)]">
                    {pub.institution}
                  </p>

                  <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--ink-soft)]">
                    {pub.summary}
                  </p>

                  {pub.abstract && (
                    <details className="group mt-2">
                      <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-[11.5px] font-semibold text-[var(--accent)] hover:underline">
                        <span
                          aria-hidden
                          className="inline-block transition-transform group-open:rotate-90"
                        >
                          ▸
                        </span>
                        Abstract
                      </summary>
                      <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--ink-soft)]">
                        {pub.abstract}
                      </p>
                    </details>
                  )}

                  <div className="mt-2.5">
                    <TechList items={pub.topics} />
                  </div>

                  {(pub.publicationUrl || pub.pdfPath) && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {pub.publicationUrl && (
                        <RetroLink size="sm" href={pub.publicationUrl}>
                          <ExternalIcon size={12} />
                          Publication
                        </RetroLink>
                      )}
                      {pub.pdfPath && (
                        <RetroLink
                          size="sm"
                          href={assetPath(pub.pdfPath)}
                          external={false}
                        >
                          Read PDF
                        </RetroLink>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Panel>
          </li>
        ))}
      </ul>

      <div className="mt-5 border-t border-[var(--hairline)] pt-4">
        <SubHeading>What the team built</SubHeading>
        <BulletList
          items={[
            "A Linux-based, hardware-integrated LLM assistant for Cisco network device management.",
            "An evaluation methodology for measuring prompt efficacy against misconfiguration risk.",
            "Two peer-reviewed publications produced across an 8-person team.",
          ]}
        />
      </div>
    </Page>
  );
}
