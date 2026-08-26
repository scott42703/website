"use client";

import { useEffect, useState } from "react";
import { personal } from "@/data/personal";
import { RetroButton, RetroLink } from "@/components/ui/RetroButton";
import {
  BranchIcon,
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  ExternalIcon,
  MailIcon,
  NetworkPersonIcon,
} from "@/components/ui/icons";
import { Page, PageHeader, Panel } from "./shared";
import { assetPath } from "@/lib/asset";

/** Finder page version. */
export function Contact() {
  return (
    <Page>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        description={personal.availability}
      />
      <ContactBody />
    </Page>
  );
}

/** Standalone window version, same body, tighter padding. */
export function ContactWindow() {
  return (
    <div className="retro-scroll flex-1 overflow-y-auto px-5 py-5">
      <h2 className="font-[family-name:var(--font-display)] mb-1 text-[19px] font-bold text-[var(--ink)]">
        Get in touch
      </h2>
      <p className="mb-4 text-[12.5px] leading-relaxed text-[var(--ink-soft)]">
        {personal.availability}
      </p>
      <ContactBody />
    </div>
  );
}

function ContactBody() {
  return (
    <div className="space-y-2.5">
      <EmailRow />

      <ContactRow
        icon={<NetworkPersonIcon size={16} />}
        label="LinkedIn"
        value={personal.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
        href={personal.linkedin}
      />

      {personal.github && (
        <ContactRow
          icon={<BranchIcon size={16} />}
          label="GitHub"
          value={personal.github.replace(/^https?:\/\/(www\.)?/, "")}
          href={personal.github}
        />
      )}

      {personal.showPhone && (
        <ContactRow
          icon={<MailIcon size={16} />}
          label="Phone"
          value={personal.phone}
          href={`tel:${personal.phone.replace(/[^\d+]/g, "")}`}
          external={false}
        />
      )}

      <div className="pt-1">
        <RetroLink
          href={assetPath(personal.resumePath)}
          download={personal.resumeFileName}
          external={false}
        >
          <DownloadIcon size={13} />
          Download Résumé
        </RetroLink>
      </div>

      <p className="pt-1 text-[11.5px] leading-relaxed text-[var(--ink-faint)]">
        Based in {personal.location}. Email is the fastest way to reach me.
      </p>
    </div>
  );
}

function EmailRow() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(personal.email);
      setCopied(true);
    } catch {
      // Clipboard blocked, the mailto link below still works.
    }
  };

  return (
    <Panel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="shrink-0 text-[var(--accent)]">
            <MailIcon size={16} />
          </span>
          <div className="min-w-0">
            <p className="label-micro text-[10px] tracking-widest text-[var(--ink-faint)] uppercase">
              Email
            </p>
            <a
              href={`mailto:${personal.email}`}
              className="block truncate text-[13px] font-medium text-[var(--ink)] underline decoration-[var(--hairline)] underline-offset-2 hover:text-[var(--accent)]"
            >
              {personal.email}
            </a>
          </div>
        </div>
        <RetroButton size="sm" onClick={copy}>
          {copied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
          {copied ? "Copied" : "Copy"}
        </RetroButton>
      </div>
      {/* Announced to screen readers without stealing focus. */}
      <span role="status" aria-live="polite" className="sr-only-block">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </Panel>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
  external = true,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <Panel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="shrink-0 text-[var(--accent)]">{icon}</span>
          <div className="min-w-0">
            <p className="label-micro text-[10px] tracking-widest text-[var(--ink-faint)] uppercase">
              {label}
            </p>
            <p className="truncate text-[13px] font-medium text-[var(--ink)]">
              {value}
            </p>
          </div>
        </div>
        <RetroLink size="sm" href={href} external={external}>
          <ExternalIcon size={12} />
          Open
        </RetroLink>
      </div>
    </Panel>
  );
}
