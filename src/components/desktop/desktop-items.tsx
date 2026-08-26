"use client";

import type { ReactNode } from "react";
import type { AppId, FinderRoute } from "@/lib/apps";
import {
  BriefcaseGlyph,
  CapGlyph,
  DocumentGlyph,
  FlaskGlyph,
  FolderGlyph,
  MailIcon,
  MusicGlyph,
  PersonGlyph,
  TrashGlyph,
} from "@/components/ui/icons";
import { personal } from "@/data/personal";

export interface DesktopItem {
  id: string;
  label: string;
  glyph: ReactNode;
  /** Which window this opens, and where it lands inside it. */
  app: AppId;
  route?: FinderRoute;
  /** Description used for the screen-reader hint and the tooltip. */
  hint: string;
}

/**
 * The desktop layout. Order here is the visual order and the tab order.
 * Positions are handled by the grid in Desktop.tsx, which keeps the door
 * open for free-positioned, draggable icons later.
 */
export const desktopItems: DesktopItem[] = [
  {
    id: "about",
    label: "About Me",
    glyph: <PersonGlyph size={46} />,
    app: "portfolio",
    route: { section: "about" },
    hint: "Who I am and what I work on",
  },
  {
    id: "experience",
    label: "Experience",
    glyph: <BriefcaseGlyph size={46} />,
    app: "portfolio",
    route: { section: "experience" },
    hint: "Roles, responsibilities and technologies",
  },
  {
    id: "projects",
    label: "Projects",
    glyph: <FolderGlyph size={46} />,
    app: "portfolio",
    route: { section: "projects" },
    hint: "Projects sorted into folders",
  },
  {
    id: "research",
    label: "Research",
    glyph: <FlaskGlyph size={46} />,
    app: "portfolio",
    route: { section: "research" },
    hint: "Publications and research work",
  },
  {
    id: "education",
    label: "Education",
    glyph: <CapGlyph size={46} />,
    app: "portfolio",
    route: { section: "education" },
    hint: "Degrees and coursework",
  },
  {
    id: "certifications",
    label: "Certifications",
    glyph: <DocumentGlyph size={46} kind="cert" />,
    app: "portfolio",
    route: { section: "certifications" },
    hint: "Industry credentials",
  },
  {
    id: "skills",
    label: "Skills",
    glyph: <FolderGlyph size={46} tone="folder-alt" />,
    app: "portfolio",
    route: { section: "skills" },
    hint: "Technical skills by domain",
  },
  {
    id: "music",
    label: "Music",
    glyph: <MusicGlyph size={46} />,
    app: "music",
    hint: "Tracks I produced, and records by people I work with",
  },
  {
    id: "resume",
    label: personal.resumeFileName,
    glyph: <DocumentGlyph size={46} kind="pdf" />,
    app: "resume",
    hint: "Open the résumé",
  },
  {
    id: "contact",
    label: "Contact",
    glyph: (
      <span className="grid h-[46px] w-[46px] place-items-center surface-raised bg-[var(--chrome)] text-[var(--ink)]">
        <MailIcon size={24} />
      </span>
    ),
    app: "contact",
    hint: "Email, LinkedIn and résumé download",
  },
  {
    id: "trash",
    label: "Trash",
    glyph: <TrashGlyph size={46} full />,
    app: "trash",
    hint: "Nothing important",
  },
];
