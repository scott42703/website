import { certifications } from "./certifications";
import { projects } from "./projects";
import { publications } from "./research";
import { skillGroups, totalSkillCount } from "./skills";
import type { Highlight } from "./types";

/** Every metric is derived from the content files rather than typed in. */

export const highlights: Highlight[] = [
  {
    label: "Projects",
    value: String(projects.length),
    caption: "Built and documented",
  },
  {
    label: "Certifications",
    value: String(certifications.length),
    caption: "Industry credentials",
  },
  {
    label: "Publications",
    value: String(publications.length),
    caption: "Peer-reviewed papers",
  },
  {
    label: "Technologies",
    value: `${totalSkillCount}`,
    caption: `Across ${skillGroups.length} domains`,
  },
];
