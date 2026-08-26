import type { Metadata } from "next";
import { personal } from "@/data/personal";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://scottalessio.vercel.app";

const baseDescription = `${personal.name}, ${personal.title}. ${personal.disciplines.join(", ")}. ${personal.summary}`;

export const sectionMeta: Record<
  string,
  { title: string; description: string }
> = {
  about: {
    title: "About",
    description: `About ${personal.name}, ${personal.title} based in ${personal.location}.`,
  },
  experience: {
    title: "Experience",
    description: `Professional experience for ${personal.name}: data center operations, IT infrastructure support, and network and AI research.`,
  },
  projects: {
    title: "Projects",
    description: `Projects by ${personal.name} across cybersecurity, cloud, networking, infrastructure, software, and AI or data.`,
  },
  research: {
    title: "Research",
    description: `Peer-reviewed research on prompt efficacy for network automation, led by ${personal.name} at NJIT.`,
  },
  education: {
    title: "Education",
    description: `Education for ${personal.name}: M.S. Cyber Security and Privacy and B.S. Computer Engineering, NJIT.`,
  },
  certifications: {
    title: "Certifications",
    description: `Industry certifications held by ${personal.name}, including CompTIA Security+.`,
  },
  skills: {
    title: "Skills",
    description: `Technical skills for ${personal.name} across cybersecurity, networking, cloud, operating systems, programming, infrastructure, hardware, and tools.`,
  },
  contact: {
    title: "Contact",
    description: `Get in touch with ${personal.name}. Email, LinkedIn, and résumé download.`,
  },
  resume: {
    title: "Résumé",
    description: `Download or read the résumé of ${personal.name}, ${personal.title}.`,
  },
};

export function buildMetadata(section?: string): Metadata {
  const meta = section ? sectionMeta[section] : undefined;
  const title = meta
    ? `${meta.title} | ${personal.name}`
    : `${personal.name} | ${personal.title}`;
  const description = meta?.description ?? baseDescription;
  const path = section ? `/${section}` : "/";

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    applicationName: `${personal.name} Portfolio`,
    authors: [{ name: personal.name }],
    creator: personal.name,
    keywords: [
      personal.name,
      personal.title,
      ...personal.disciplines,
      "data center engineer",
      "systems engineer",
      "network engineer",
      "portfolio",
      "New Jersey",
    ],
    alternates: { canonical: path },
    openGraph: {
      type: "profile",
      siteName: `${personal.name} Portfolio`,
      title,
      description,
      url: path,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/** JSON-LD so search engines can read the person, not just the pixels. */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: personal.name,
    jobTitle: personal.title,
    email: `mailto:${personal.email}`,
    url: siteUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: personal.location,
    },
    sameAs: [personal.linkedin, personal.github].filter(Boolean),
    knowsAbout: personal.disciplines,
  };
}
