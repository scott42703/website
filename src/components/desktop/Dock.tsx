"use client";

import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { personal } from "@/data/personal";
import type { AppId, FinderRoute } from "@/lib/apps";
import { useIsCompact } from "@/lib/hooks";
import { useOpenApp } from "@/lib/use-open-app";
import { useWindows } from "@/lib/window-manager";
import {
  BranchIcon,
  DocumentGlyph,
  FolderGlyph,
  MailIcon,
  MusicGlyph,
  NetworkPersonIcon,
  PersonGlyph,
} from "@/components/ui/icons";

interface DockApp {
  id: string;
  label: string;
  glyph: ReactNode;
  app: AppId;
  route?: FinderRoute;
}

interface DockLink {
  id: string;
  label: string;
  glyph: ReactNode;
  href: string;
}

export function Dock() {
  const openApp = useOpenApp();
  const api = useWindows();
  const compact = useIsCompact();
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);

  const apps: DockApp[] = [
    {
      id: "portfolio",
      label: "Portfolio",
      glyph: <PersonGlyph size={34} />,
      app: "portfolio",
      route: { section: "home" },
    },
    {
      id: "projects",
      label: "Projects",
      glyph: <FolderGlyph size={34} />,
      app: "portfolio",
      route: { section: "projects" },
    },
    {
      id: "music",
      label: "Music",
      glyph: <MusicGlyph size={34} />,
      app: "music",
    },
    {
      id: "resume",
      label: "Résumé",
      glyph: <DocumentGlyph size={34} kind="pdf" />,
      app: "resume",
    },
    {
      id: "contact",
      label: "Contact",
      glyph: (
        <span className="grid h-[34px] w-[34px] place-items-center rounded-[8px] bg-[var(--chrome)] text-[var(--ink)] shadow-[inset_0_0_0_1px_var(--hairline)]">
          <MailIcon size={18} />
        </span>
      ),
      app: "contact",
    },
  ];

  const links: DockLink[] = [
    {
      id: "linkedin",
      label: "LinkedIn",
      glyph: (
        <span className="grid h-[34px] w-[34px] place-items-center rounded-[8px] bg-[var(--chrome)] text-[var(--ink)] shadow-[inset_0_0_0_1px_var(--hairline)]">
          <NetworkPersonIcon size={18} />
        </span>
      ),
      href: personal.linkedin,
    },
  ];

  // The GitHub tile appears the moment a URL exists in the data file.
  if (personal.github) {
    links.push({
      id: "github",
      label: "GitHub",
      glyph: (
        <span className="grid h-[34px] w-[34px] place-items-center rounded-[8px] bg-[var(--chrome)] text-[var(--ink)] shadow-[inset_0_0_0_1px_var(--hairline)]">
          <BranchIcon size={18} />
        </span>
      ),
      href: personal.github,
    });
  }

  const minimized = api.windows.filter((w) => w.minimized);

  const scaleFor = (id: string) =>
    reduceMotion || compact ? 1 : hovered === id ? 1.22 : 1;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[8000] flex justify-center pb-2 sm:pb-3">
      <nav
        aria-label="Dock"
        onPointerLeave={() => setHovered(null)}
        className="material-dock backdrop-blur-[24px] backdrop-saturate-[180%] pointer-events-auto flex max-w-[calc(100vw-16px)] items-end gap-1.5 overflow-x-auto rounded-[18px] px-2.5 py-2 shadow-[var(--shadow-window)]"
      >
        {apps.map((item) => (
          <DockTile
            key={item.id}
            label={item.label}
            scale={scaleFor(item.id)}
            hovered={hovered === item.id}
            onHover={() => setHovered(item.id)}
            onClick={() =>
              openApp(item.app, item.route ? { route: item.route } : undefined)
            }
            running={api.windows.some(
              (w) => w.appId === item.app && !w.minimized,
            )}
          >
            {item.glyph}
          </DockTile>
        ))}

        <span
          aria-hidden
          className="mx-1 h-[34px] w-px shrink-0 self-center bg-[var(--hairline)]"
        />

        {links.map((item) => (
          <DockTile
            key={item.id}
            label={item.label}
            scale={scaleFor(item.id)}
            hovered={hovered === item.id}
            onHover={() => setHovered(item.id)}
            href={item.href}
          >
            {item.glyph}
          </DockTile>
        ))}

        {minimized.length > 0 && (
          <>
            <span
              aria-hidden
              className="mx-1 h-[34px] w-px shrink-0 self-center bg-[var(--hairline)]"
            />
            {minimized.map((w) => (
              <DockTile
                key={w.id}
                label={`${w.title} (minimized)`}
                scale={scaleFor(w.id)}
                hovered={hovered === w.id}
                onHover={() => setHovered(w.id)}
                onClick={() => api.restore(w.id)}
                minimizedTile
              >
                <span className="grid h-[34px] w-[34px] place-items-center rounded-[8px] bg-[var(--surface-sunken)] text-[10px] font-semibold text-[var(--ink-soft)] shadow-[inset_0_0_0_1px_var(--hairline)]">
                  <span className="truncate px-0.5">{w.title.slice(0, 2)}</span>
                </span>
              </DockTile>
            ))}
          </>
        )}
      </nav>
    </div>
  );
}

function DockTile({
  label,
  children,
  scale,
  hovered,
  onHover,
  onClick,
  href,
  running,
  minimizedTile,
}: {
  label: string;
  children: ReactNode;
  scale: number;
  hovered: boolean;
  onHover: () => void;
  onClick?: () => void;
  href?: string;
  running?: boolean;
  minimizedTile?: boolean;
}) {
  const inner = (
    <>
      {hovered && (
        <span className="material-bar backdrop-blur-[20px] backdrop-saturate-[180%] pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 rounded-[6px] px-2 py-1 text-[12px] font-medium whitespace-nowrap text-[var(--ink)] shadow-[var(--shadow-menu)]">
          {label}
        </span>
      )}
      <motion.span
        animate={{ scale }}
        transition={{ type: "spring", stiffness: 420, damping: 26 }}
        className="block origin-bottom"
      >
        {children}
      </motion.span>
      <span
        aria-hidden
        className={`mt-1.5 block h-[4px] w-[4px] rounded-full transition-opacity ${
          running || minimizedTile
            ? "bg-[var(--ink-soft)] opacity-80"
            : "bg-transparent opacity-0"
        }`}
      />
    </>
  );

  const className =
    "relative flex shrink-0 flex-col items-center px-1 pb-0.5 outline-offset-2";

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`${label} (opens in a new tab)`}
        onPointerEnter={onHover}
        onFocus={onHover}
        className={className}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      onPointerEnter={onHover}
      onFocus={onHover}
      className={className}
    >
      {inner}
    </button>
  );
}
