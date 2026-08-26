import type { EducationEntry } from "./types";

export const education: EducationEntry[] = [
  {
    id: "njit-ms",
    school: "New Jersey Institute of Technology",
    degree: "Master of Science",
    program: "Cyber Security and Privacy",
    location: "Newark, NJ",
    dateLabel: "May 2025 - Aug 2026",
    gpa: "3.85 / 4.0",
    coursework: [
      "Security & Privacy in Computer Systems",
      "Internet & Higher-Layer Protocols",
      "Cloud Computing",
      "Data Mining",
      "Network Security",
    ],
    highlights: [
      "Configured and hardened enterprise networks and Cisco devices across Ubuntu, Kali, and Red Hat Linux environments.",
      "Built and deployed distributed data pipelines on AWS (EC2, S3, EMR) and containerized workloads with Docker.",
    ],
    activities: [],
  },
  {
    id: "njit-bs",
    school: "New Jersey Institute of Technology",
    degree: "Bachelor of Science",
    program: "Computer Engineering",
    location: "Newark, NJ",
    dateLabel: "Sep 2021 - May 2025",
    gpa: "3.62 / 4.0",
    coursework: [
      "Computer Networks",
      "Cybersecurity",
      "Operating Systems",
      "Computer Architecture & Design",
      "Digital Data Communications",
      "Microprocessor Systems Design",
    ],
    highlights: [
      "Coursework spanning the full stack of the machine: digital data communications, computer architecture and design, operating systems, and microprocessor systems design.",
    ],
    activities: [],
  },
  {
    id: "paramus-hs",
    school: "Paramus High School",
    degree: "High School Diploma",
    program: "",
    location: "Paramus, NJ",
    dateLabel: "Graduated 2021",
    gpa: "4.0 / 4.0",
    coursework: [],
    highlights: [],
    activities: [],
  },
];
