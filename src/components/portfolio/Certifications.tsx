"use client";

import { certifications } from "@/data/certifications";
import { useFinderNav } from "@/components/windows/FinderWindow";
import { DocumentGlyph, ExternalIcon } from "@/components/ui/icons";
import { RetroLink } from "@/components/ui/RetroButton";
import { EmptyState, Page, PageHeader, Panel } from "./shared";
import { assetPath } from "@/lib/asset";

export function Certifications() {
  const { viewMode } = useFinderNav();

  if (certifications.length === 0) {
    return (
      <Page>
        <EmptyState>No certifications recorded yet.</EmptyState>
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader
        eyebrow="Certificates"
        title="Industry credentials"
        description="Fields left blank in the data file are omitted rather than shown empty."
      />

      <ul
        className={
          viewMode === "grid" ? "grid gap-2.5 sm:grid-cols-2" : "space-y-2.5"
        }
      >
        {certifications.map((c) => (
          <li key={c.id}>
            <Panel as="article" className="h-full">
              <div className="flex items-start gap-3.5">
                {c.badgeImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={assetPath(c.badgeImage)}
                    alt={`${c.name} badge`}
                    width={40}
                    height={40}
                    loading="lazy"
                    className="mt-0.5 shrink-0"
                  />
                ) : (
                  <DocumentGlyph
                    size={40}
                    kind="cert"
                    className="mt-0.5 shrink-0"
                  />
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="text-[14.5px] leading-snug font-semibold text-[var(--ink)]">
                      {c.name}
                    </h3>
                  </div>
                  <p className="text-[12.5px] font-medium text-[var(--accent)]">
                    {c.issuer}
                  </p>

                  {c.description && (
                    <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--ink-soft)]">
                      {c.description}
                    </p>
                  )}

                  <dl className="mt-3 space-y-1">
                    {c.issueDate && <Row label="Earned" value={c.issueDate} />}
                    {c.expirationDate && (
                      <Row label="Expires" value={c.expirationDate} />
                    )}
                    {c.credentialId && (
                      <Row label="Credential ID" value={c.credentialId} mono />
                    )}
                  </dl>

                  {c.verificationUrl && (
                    <div className="mt-3">
                      <RetroLink size="sm" href={c.verificationUrl}>
                        <ExternalIcon size={12} />
                        Verify
                      </RetroLink>
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

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex gap-2 text-[12px]">
      <dt className="shrink-0 text-[var(--ink-faint)]">{label}</dt>
      <dd
        className={`min-w-0 truncate text-[var(--ink-soft)] ${
          mono ? "font-[family-name:var(--font-mono)]" : ""
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
