import type { Role } from "./types";

export const experience: Role[] = [
  {
    id: "bloomberg",
    organization: "Bloomberg L.P.",
    position: "Data Center Operations Engineer",
    employmentType: "Contract",
    location: "New York, NY & Northern New Jersey",
    startDate: "2026-01",
    endDate: "2026-08",
    dateLabel: "Jan 2026 - Aug 2026",
    summary:
      "Supported the physical and logical lifecycle of a global, high-availability data center fleet of 40,000+ multi-vendor x86 servers, enterprise routers, and switches across paired production sites.",
    responsibilities: [
      "Investigated infrastructure and hardware faults in Splunk, building searches across system and network logs to isolate root cause and surface recurring failure patterns across the fleet.",
      "Performed hardware and OS-level troubleshooting across a multi-vendor server fleet, isolating faults at the component, firmware, and network layer to restore availability within service-level targets.",
      "Troubleshot pod-to-pod connectivity failures across Kubernetes clusters, tracing east-west traffic paths and inspecting Calico network policy to separate policy denials from node and upstream network faults.",
      "Executed server and network device installations, migrations, and secure decommissioning under formal change management, maintaining access controls and authoring the runbooks that standardized recurring work.",
      "Partnered with network, systems, and facilities teams to sustain redundancy and high-availability targets across the fleet.",
    ],
    technologies: [
      "Splunk",
      "Kubernetes",
      "Calico",
      "Linux",
      "x86 Server Hardware",
      "Out-of-Band Management",
      "Change Management",
      "Enterprise Routing & Switching",
    ],
    accomplishments: [
      "Authored runbooks that standardized recurring fleet work and fed the internal knowledge base.",
      "Isolated recurring failure patterns across a 40,000+ server fleet using Splunk log analysis.",
    ],
  },
  {
    id: "ridgewood-country-club",
    organization: "Ridgewood Country Club",
    position: "Information Technology Support Assistant",
    location: "Paramus, NJ",
    startDate: "2022-05",
    endDate: "2025-12",
    dateLabel: "May 2022 - Dec 2025",
    summary:
      "Delivered end-to-end IT support for staff endpoints, network infrastructure, and connected systems across a multi-building campus.",
    responsibilities: [
      "Deployed and hardened an OpenVPN server on a cloud-hosted Linux environment, enabling encrypted remote access for staff and eliminating unsecured remote connection methods.",
      "Administered user accounts, endpoint configuration, and Microsoft 365 services, handling onboarding, offboarding, and access provisioning.",
      "Diagnosed network, wireless, and IoT faults across the campus and applied operating system and firmware patches, sustaining uptime while reducing exposure to known vulnerabilities.",
      "Delivered comprehensive IT support for host devices, keeping staff operations running across a multi-building campus.",
    ],
    technologies: [
      "OpenVPN",
      "Linux",
      "Microsoft 365",
      "Windows",
      "802.11 Wireless",
      "IoT",
      "Patch Management",
      "Endpoint Hardening",
    ],
    accomplishments: [
      "Replaced ad-hoc remote access with a hardened OpenVPN deployment, removing unsecured connection methods.",
      "Owned onboarding, offboarding, and access provisioning across Microsoft 365 for club staff.",
    ],
  },
  {
    id: "njit-research",
    organization: "New Jersey Institute of Technology",
    position: "Network & AI Research Lead",
    location: "Newark, NJ",
    startDate: "2024-05",
    endDate: "2025-06",
    dateLabel: "May 2024 - Jun 2025",
    summary:
      "Led an 8-person research team building LLM-driven automation for Cisco network device operations, from prompt design through hardware integration and evaluation.",
    responsibilities: [
      "Co-authored and published 2 peer-reviewed papers on prompt engineering efficacy for automated network configuration and troubleshooting.",
      "Engineered a Linux-based, hardware-integrated LLM assistant that automated device management tasks, cutting emergency staffing costs 12% in internal testing.",
      "Directed evaluation methodology, code review, and publication timelines across the team, analyzing results to raise accuracy and reduce misconfiguration risk.",
      "Curated and analyzed key findings to optimize LLM prompts for network configuration tasks.",
    ],
    technologies: [
      "Python",
      "Linux",
      "Cisco IOS",
      "Large Language Models",
      "Prompt Engineering",
      "Network Automation",
    ],
    accomplishments: [
      "Reduced emergency staffing costs by 12% through automated network issue resolution (internal testing).",
      "Published 2 peer-reviewed papers with an 8-person research team.",
    ],
  },
];
