import Link from "next/link";
import { personal } from "@/data/personal";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { education } from "@/data/education";
import { certifications } from "@/data/certifications";
import { skillGroups } from "@/data/skills";
import { publications, researchSummary } from "@/data/research";
import { tracks } from "@/data/music";
import { assetPath } from "@/lib/asset";

const SECTION_LINKS: [string, string][] = [
  ["/about", "About"],
  ["/experience", "Experience"],
  ["/projects", "Projects"],
  ["/research", "Research"],
  ["/education", "Education"],
  ["/certifications", "Certifications"],
  ["/skills", "Skills"],
  ["/contact", "Contact"],
];

/**
 * A server-rendered, semantic mirror of the portfolio.
 *
 * It is visually hidden but present in the DOM and in the accessibility
 * tree, which does three things at once: search engines index real content
 * instead of an empty canvas, the page means something with JavaScript
 * disabled, and a screen-reader user who does not care about the desktop
 * metaphor can read the whole portfolio top to bottom.
 */
export function StaticContent() {
  return (
    <div className="sr-only-block">
      <h1>
        {personal.name}, {personal.title}
      </h1>
      <p>{personal.summary}</p>
      <p>{personal.availability}</p>
      <p>Location: {personal.location}</p>
      <p>
        Email: <a href={`mailto:${personal.email}`}>{personal.email}</a>
      </p>
      <p>
        LinkedIn: <a href={personal.linkedin}>{personal.linkedin}</a>
      </p>
      <p>
        <a href={assetPath(personal.resumePath)}>Download résumé (PDF)</a>
      </p>

      <nav aria-label="Portfolio sections, text version">
        <ul>
          {SECTION_LINKS.map(([href, label]) => (
            <li key={href}>
              <Link href={href}>{label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <section>
        <h2>About</h2>
        {personal.bio.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </section>

      <section>
        <h2>Experience</h2>
        {experience.map((role) => (
          <article key={role.id}>
            <h3>
              {role.position} at {role.organization}
            </h3>
            <p>
              {role.dateLabel} · {role.location}
            </p>
            <p>{role.summary}</p>
            <ul>
              {role.responsibilities.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
            <p>Technologies: {role.technologies.join(", ")}</p>
          </article>
        ))}
      </section>

      <section>
        <h2>Projects</h2>
        {projects.map((project) => (
          <article key={project.id}>
            <h3>{project.title}</h3>
            <p>{project.shortDescription}</p>
            {project.longDescription.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p>Technologies: {project.technologies.join(", ")}</p>
            {project.demoUrl && <a href={project.demoUrl}>Project demo</a>}
            {project.githubUrl && <a href={project.githubUrl}>Source code</a>}
          </article>
        ))}
      </section>

      <section>
        <h2>Research</h2>
        <h3>{researchSummary.program}</h3>
        <p>{researchSummary.dateLabel}</p>
        <p>{researchSummary.description}</p>
        {publications.map((pub) => (
          <article key={pub.id}>
            <h4>{pub.title}</h4>
            <p>{pub.summary}</p>
          </article>
        ))}
      </section>

      <section>
        <h2>Education</h2>
        {education.map((e) => (
          <article key={e.id}>
            <h3>
              {e.degree}
              {e.program ? `, ${e.program}` : ""}, {e.school}
            </h3>
            <p>
              {e.dateLabel}
              {e.gpa ? ` · GPA ${e.gpa}` : ""}
            </p>
            {e.coursework.length > 0 && (
              <p>Coursework: {e.coursework.join(", ")}</p>
            )}
          </article>
        ))}
      </section>

      <section>
        <h2>Certifications</h2>
        <ul>
          {certifications.map((c) => (
            <li key={c.id}>
              {c.name}, {c.issuer}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Music</h2>
        <p>Music produced by {personal.name}, plus records by collaborators.</p>
        <ul>
          {tracks.map((t) => (
            <li key={t.id}>
              {t.title} by {t.artist}
              {t.year ? ` (${t.year})` : ""}. {t.credit}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Skills</h2>
        {skillGroups.map((g) => (
          <div key={g.id}>
            <h3>{g.name}</h3>
            <p>{g.skills.join(", ")}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
