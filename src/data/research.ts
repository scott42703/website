import type { Publication } from "./types";

/**
 * Research programme summary and the two peer-reviewed publications, both
 * verified against the papers themselves.
 *
 * On hosting the PDFs: `pdfPath` is deliberately null for both.
 *   - The ICAIIC paper is published by IEEE and the copy on file is the
 *     Xplore licensed download, watermarked for NJIT use only. Re-hosting it
 *     publicly would breach that licence, so it links to the DOI instead.
 *   - The HPSR paper on file is the un-watermarked camera-ready. IEEE's author
 *     policy generally permits posting an accepted version on a personal site,
 *     but check the copyright form you signed before enabling it.
 * To host either one: drop the file in `public/research/` and set `pdfPath`.
 */
export const researchSummary = {
  program: "Network & AI Research at New Jersey Institute of Technology",
  dateLabel: "May 2024 - Jun 2025",
  description:
    "Led an 8-person research team building LLM-driven automation for Cisco network device operations, from prompt design through hardware integration and evaluation. The work produced two peer-reviewed IEEE publications on prompt efficacy for network design and configuration, and a Linux-based, hardware-integrated assistant that automated device management tasks and cut emergency staffing costs 12% in internal testing.",
  focusAreas: [
    "Prompt engineering efficacy for network configuration",
    "Automated troubleshooting of Cisco network devices",
    "Hardware-integrated LLM assistants on Linux",
    "Evaluation methodology and misconfiguration risk",
  ],
};

export const publications: Publication[] = [
  {
    id: "hpsr-2025-partitioning",
    title:
      "Partitioning Prompts for Higher Efficacy in Network Design with Large Language Model",
    authors: [
      "Vishnu Komanduri",
      "Scott Alessio",
      "Sebastian Estropia",
      "Gokhan Yerdelen",
      "Tyler Ferreira",
      "Murali Gunti",
      "Ziqian Dong",
      "Roberto Rojas-Cessa",
    ],
    institution: "New Jersey Institute of Technology",
    year: "2025",
    venue:
      "IEEE International Conference on High Performance Switching and Routing (HPSR)",
    summary:
      "Proposes breaking a dense network-configuration prompt into a sequence of smaller, focused tasks, and shows that this partitioned approach yields more accurate and consistent LLM responses than asking for everything at once.",
    abstract:
      "In this paper, we propose deliverable partitioning in prompt design to assist Large Language Models (LLMs) in improving response correctness for network design and configuration. While recent research has explored the use of LLMs to enhance network management efficiency, their responses often remain inconsistent, incomplete, or inaccurate. Often, LLM-generated configurations contain missing or erroneous configuration commands, which can lead to operational failures. Our proposed partitioning methodology aims to mitigate these issues by decomposing complex network configuration tasks into simplified and focused tasks. To evaluate the effectiveness of this approach, we introduce a scoring policy and conduct extensive experiments across three levels of network complexity and varying degrees of design choice ambiguity. We also compare the performance of leading LLMs, including ChatGPT, Copilot, and DeepSeek. Our findings indicate that partitioning the inquiry process leads to more accurate and consistent responses than non-partitioned approaches, especially in scenarios where design parameters are explicitly defined and leave some but small room, as ambiguity, for inference.",

    // No DOI printed on the camera-ready copy. Add the Xplore link once the
    // proceedings are indexed.
    publicationUrl: null,
    pdfPath: null,

    topics: [
      "Prompt Engineering",
      "Prompt Partitioning",
      "Network Design",
      "Large Language Models",
      "Router Configuration",
      "ChatGPT / Copilot / DeepSeek",
    ],
  },
  {
    id: "icaiic-2025-optimizing-prompts",
    title:
      "Optimizing LLM Prompts for Automation of Network Management: A User's Perspective",
    authors: [
      "Vishnu Komanduri",
      "Sebastian Estropia",
      "Scott Alessio",
      "Gokhan Yerdelen",
      "Tyler Ferreira",
      "Geovanny Palomino Roldan",
      "Ziqian Dong",
      "Roberto Rojas-Cessa",
    ],
    institution: "New Jersey Institute of Technology",
    year: "2025",
    // Year lives in `year`; leaving it out of the venue avoids "…(ICAIIC), 2025, 2025".
    venue:
      "International Conference on Artificial Intelligence in Information and Communication (ICAIIC)",
    summary:
      "Introduces a scoring policy for grading LLM-generated network designs and router configurations, then measures how prompt specificity, and schematic rather than text prompting, affects error rates across three levels of network complexity.",
    abstract:
      "Although being linguistic assemblers and decomposers, large language models (LLMs) have found their use in analysis and generation of code, art, and design of electronic circuitry, industrial parts, and network design. However, the probabilistic nature of generative LLMs makes network design and implementation scenarios prone to errors. The complexity levels of design may exacerbate the number of inaccuracies included in an LLM's response. Therefore, it is necessary to identify the features that make prompts generate effective and error-free responses as users. To reduce the error rate of the responses, we test prompt specificity in text and schematic descriptions. As various degrees of specificity, we compare highly intuitive to highly specific prompting. The responses are expressed as network schematics and router configuration commands that are evaluated with our proposed scoring policy. Our tests include networks with three levels of complexity and multiple levels of specificity in text and graphic prompts. The results show the trade-offs on the text and graphic modes and the degrees of specificity.",

    publicationUrl: "https://doi.org/10.1109/ICAIIC64266.2025.10920709",
    pdfPath: null,

    topics: [
      "Prompt Engineering",
      "Schematic Prompting",
      "Network Management",
      "Large Language Models",
      "Cisco IOS",
      "Response Scoring",
    ],
  },
];
