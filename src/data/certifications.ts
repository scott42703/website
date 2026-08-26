import type { Certification } from "./types";

export const certifications: Certification[] = [
  {
    id: "comptia-security-plus",
    name: "CompTIA Security+",
    issuer: "CompTIA",

    // PLACEHOLDER, fill these in and they render automatically.
    // Anything left null is omitted from the UI rather than shown empty.
    issueDate: null,
    expirationDate: null,
    credentialId: null,
    verificationUrl: null,
    badgeImage: null,

    description:
      "Exam SY0-701. Covers threats and vulnerabilities, security architecture, secure operations, incident response, and governance and compliance.",
  },
];
