"use client";

import { personal } from "@/data/personal";
import { highlights } from "@/data/highlights";
import { useFinderNav } from "@/components/windows/FinderWindow";
import { useOpenApp } from "@/lib/use-open-app";
import { RetroButton, RetroLink } from "@/components/ui/RetroButton";
import { DownloadIcon, MailIcon } from "@/components/ui/icons";
import { Page } from "./shared";
import { Avatar } from "./Avatar";
import { assetPath } from "@/lib/asset";

export function Home() {
  const { navigate } = useFinderNav();
  const openApp = useOpenApp();

  return (
    <Page>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-7">
        <Avatar className="mx-auto shrink-0 sm:mx-0" />

        <div className="min-w-0 flex-1">
          <h2 className="font-[family-name:var(--font-display)] text-[30px] leading-[1.05] font-bold tracking-tight text-[var(--ink)] sm:text-[36px]">
            {personal.name}
          </h2>
          <p className="mt-1 text-[15px] font-semibold text-[var(--accent)]">
            {personal.title}
          </p>
          <p className="label-micro mt-2 text-[10px] tracking-wide text-[var(--ink-faint)]">
            {personal.disciplines.join("  •  ")}
          </p>
          <p className="mt-3 max-w-2xl text-[13.5px] leading-relaxed text-[var(--ink-soft)]">
            {personal.summary}
          </p>
          <p className="mt-2 max-w-2xl text-[12.5px] leading-relaxed text-[var(--ink-faint)]">
            {personal.availability}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <RetroButton
              variant="primary"
              onClick={() => navigate({ section: "projects" })}
            >
              View Projects
            </RetroButton>
            <RetroButton onClick={() => navigate({ section: "experience" })}>
              Experience
            </RetroButton>
            <RetroLink
              href={assetPath(personal.resumePath)}
              download={personal.resumeFileName}
              external={false}
            >
              <DownloadIcon size={13} />
              Download Résumé
            </RetroLink>
            <RetroButton onClick={() => openApp("contact")}>
              <MailIcon size={13} />
              Contact Me
            </RetroButton>
          </div>
        </div>
      </div>

      <ul className="mt-7 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {highlights.map((h) => (
          <li
            key={h.label}
            className="surface-card bg-[var(--surface-alt)] px-3 py-3"
          >
            <p className="font-[family-name:var(--font-display)] text-[26px] leading-none font-bold text-[var(--ink)]">
              {h.value}
            </p>
            <p className="label-micro mt-1.5 text-[10px] tracking-wide text-[var(--accent)] uppercase">
              {h.label}
            </p>
            <p className="mt-1 text-[11px] leading-snug text-[var(--ink-faint)]">
              {h.caption}
            </p>
          </li>
        ))}
      </ul>
    </Page>
  );
}
