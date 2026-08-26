import type { SectionId } from "@/data/types";
import { assetPath } from "./asset";

/** Every window kind the desktop knows how to open. */
export type AppId =
  | "portfolio"
  | "resume"
  | "contact"
  | "trash"
  | "about-computer"
  | "about-portfolio"
  | "shortcuts"
  | "notes"
  | "terminal"
  | "music";

/** A location inside the Portfolio Finder window. */
export interface FinderRoute {
  section: SectionId;
  /** Project category, when inside Projects. */
  categoryId?: string;
  /** A specific project, role, or publication. */
  itemId?: string;
  /** Free-text search results view. */
  query?: string;
}

export interface PortfolioWindowProps {
  route?: FinderRoute;
}

/** Sections that get their own URL and their own metadata. */
export const linkableSections: SectionId[] = [
  "about",
  "experience",
  "projects",
  "research",
  "education",
  "certifications",
  "skills",
  "contact",
];

export function pathForRoute(route: FinderRoute): string {
  const path =
    route.section === "home"
      ? "/"
      : route.section === "projects" && route.itemId
        ? `/projects/${route.itemId}`
        : `/${route.section}`;
  // The address bar shows the deployed path, base path included.
  return assetPath(path);
}
