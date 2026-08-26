"use client";

import { useState } from "react";
import { personal } from "@/data/personal";
import { experience } from "@/data/experience";
import { education } from "@/data/education";
import { certifications } from "@/data/certifications";
import { skillGroups } from "@/data/skills";
import { RetroLink } from "@/components/ui/RetroButton";
import { DownloadIcon, ExternalIcon } from "@/components/ui/icons";
import { assetPath } from "@/lib/asset";

type Tab = "pdf" | "preview";

export function Resume() {
  const [tab, setTab] = useState<Tab>("pdf");

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--hairline)] bg-[var(--chrome)] px-2 py-1.5">
        <div className="flex" role="tablist" aria-label="Résumé view">
          <TabButton
            active={tab === "pdf"}
            onClick={() => setTab("pdf")}
            label="Document"
          />
          <TabButton
            active={tab === "preview"}
            onClick={() => setTab("preview")}
            label="Text preview"
          />
        </div>

        <div className="ml-auto flex gap-2">
          <RetroLink
            size="sm"
            href={assetPath(personal.resumePath)}
            download={personal.resumeFileName}
            external={false}
          >
            <DownloadIcon size={12} />
            Download
          </RetroLink>
          <RetroLink size="sm" href={assetPath(personal.resumePath)}>
            <ExternalIcon size={12} />
            Fullscreen
          </RetroLink>
        </div>
      </div>

      {tab === "pdf" ? (
        <div className="min-h-0 flex-1 bg-[var(--surface-sunken)] p-1">
          {/*
            <object> degrades on its own: browsers without an inline PDF
            viewer, and a missing file, fall through to the children.
          */}
          <object
            data={`${assetPath(personal.resumePath)}#view=FitH`}
            type="application/pdf"
            className="h-full w-full"
            aria-label={`${personal.name} résumé, PDF document`}
          >
            <ResumeFallback />
          </object>
        </div>
      ) : (
        <div className="retro-scroll min-h-0 flex-1 overflow-y-auto bg-[var(--surface)]">
          <ResumePreview />
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`px-3 py-[3px] text-[11.5px] font-medium ${
        active
          ? "surface-inset bg-[var(--chrome-deep)] text-[var(--ink)]"
          : "surface-raised bg-[var(--chrome)] text-[var(--ink-soft)] hover:bg-[var(--chrome-alt)]"
      }`}
    >
      {label}
    </button>
  );
}

function ResumeFallback() {
  return (
    <div className="grid h-full place-items-center p-6 text-center">
      <div className="max-w-sm">
        <p className="text-[13.5px] font-semibold text-[var(--ink)]">
          This browser cannot display the PDF inline.
        </p>
        <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--ink-soft)]">
          Download it, open it in a new tab, or switch to the text preview. The
          full résumé is readable either way.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <RetroLink
            variant="primary"
            href={assetPath(personal.resumePath)}
            download={personal.resumeFileName}
            external={false}
          >
            <DownloadIcon size={13} />
            Download PDF
          </RetroLink>
          <RetroLink href={assetPath(personal.resumePath)}>
            <ExternalIcon size={13} />
            Open in new tab
          </RetroLink>
        </div>
      </div>
    </div>
  );
}

/** Structured résumé rendered from the same data files as the rest of the site. */
function ResumePreview() {
  return (
    <article className="px-6 py-6 text-[var(--ink)]">
      <header className="border-b-2 border-[var(--ink)] pb-3">
        <h2 className="font-[family-name:var(--font-display)] text-[24px] leading-none font-bold tracking-tight">
          {personal.name}
        </h2>
        <p className="label-micro mt-2 text-[10px] tracking-wide text-[var(--ink-faint)] uppercase">
          {personal.disciplines.join("  •  ")}
        </p>
        <p className="mt-2 text-[12px] text-[var(--ink-soft)]">
          {personal.location} ·{" "}
          <a href={`mailto:${personal.email}`} className="underline">
            {personal.email}
          </a>
        </p>
      </header>

      <Section title="Summary">
        <p className="text-[12.5px] leading-relaxed text-[var(--ink-soft)]">
          {personal.summary}
        </p>
      </Section>

      <Section title="Experience">
        <ul className="space-y-3.5">
          {experience.map((r) => (
            <li key={r.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h4 className="text-[13px] font-semibold">{r.position}</h4>
                <span className="text-[11.5px] text-[var(--ink-faint)]">
                  {r.dateLabel}
                </span>
              </div>
              <p className="text-[12px] text-[var(--accent)]">
                {r.organization} · {r.location}
              </p>
              <ul className="mt-1.5 space-y-1">
                {r.responsibilities.slice(0, 4).map((item, i) => (
                  <li
                    key={i}
                    className="relative pl-3.5 text-[12px] leading-relaxed text-[var(--ink-soft)]"
                  >
                    <span
                      aria-hidden
                      className="absolute top-[7px] left-0 h-[4px] w-[4px] bg-[var(--ink-faint)]"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Education">
        <ul className="space-y-2">
          {education.map((e) => (
            <li key={e.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h4 className="text-[13px] font-semibold">
                  {e.degree}
                  {e.program ? `, ${e.program}` : ""}
                </h4>
                <span className="text-[11.5px] text-[var(--ink-faint)]">
                  {e.dateLabel}
                </span>
              </div>
              <p className="text-[12px] text-[var(--ink-soft)]">
                {e.school}
                {e.gpa ? ` · GPA ${e.gpa}` : ""}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Certifications">
        <ul className="space-y-1">
          {certifications.map((c) => (
            <li key={c.id} className="text-[12.5px] text-[var(--ink-soft)]">
              {c.name}, {c.issuer}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Technical Skills">
        <ul className="space-y-1.5">
          {skillGroups.map((g) => (
            <li key={g.id} className="text-[12px] leading-relaxed">
              <span className="font-semibold text-[var(--ink)]">
                {g.name}:{" "}
              </span>
              <span className="text-[var(--ink-soft)]">
                {g.skills.join(", ")}
              </span>
            </li>
          ))}
        </ul>
      </Section>
    </article>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-5">
      <h3 className="label-micro mb-2 border-b border-[var(--hairline)] pb-1 text-[10px] tracking-widest text-[var(--ink-faint)] uppercase">
        {title}
      </h3>
      {children}
    </section>
  );
}
