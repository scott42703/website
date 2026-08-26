/** Content types for the portfolio. */

export type SectionId =
  | "home"
  | "about"
  | "experience"
  | "projects"
  | "research"
  | "education"
  | "certifications"
  | "skills"
  | "contact";

export interface Personal {
  name: string;
  shortName: string;
  title: string;
  disciplines: string[];
  location: string;
  email: string;
  /** Rendered only when `showPhone` is true. Off by default, public sites. */
  phone: string;
  showPhone: boolean;
  linkedin: string;
  /** Null until a public profile exists. Links render only when present. */
  github: string | null;
  website: string | null;
  resumePath: string;
  resumeFileName: string;
  summary: string;
  /** Longer narrative used by the About window. */
  bio: string[];
  availability: string;
}

export interface Role {
  id: string;
  organization: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string | null;
  /** Human label shown in the UI, e.g. "Jan 2026 - Present". */
  dateLabel: string;
  employmentType?: string;
  summary: string;
  responsibilities: string[];
  technologies: string[];
  accomplishments: string[];
}

export interface ProjectCategory {
  id: string;
  name: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  categoryIds: string[];
  shortDescription: string;
  longDescription: string[];
  dateLabel: string;
  /** Sortable key, ISO-ish `YYYY-MM`. */
  sortDate: string;
  technologies: string[];
  screenshots: { src: string; alt: string }[];
  githubUrl: string | null;
  demoUrl: string | null;
  architectureDiagram: { src: string; alt: string } | null;
  accomplishments: string[];
  lessonsLearned: string[];
  featured: boolean;
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  institution: string;
  year: string | null;
  venue: string | null;
  summary: string;
  abstract: string | null;
  publicationUrl: string | null;
  pdfPath: string | null;
  topics: string[];
}

export interface EducationEntry {
  id: string;
  school: string;
  degree: string;
  program: string;
  location: string;
  dateLabel: string;
  gpa: string | null;
  coursework: string[];
  highlights: string[];
  activities: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string | null;
  expirationDate: string | null;
  credentialId: string | null;
  verificationUrl: string | null;
  badgeImage: string | null;
  description: string | null;
}

export interface SkillGroup {
  id: string;
  name: string;
  /** Short line shown under the group heading in the Finder list view. */
  description: string;
  skills: string[];
}

export interface Highlight {
  label: string;
  value: string;
  caption: string;
}
