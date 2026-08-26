import type { Project, ProjectCategory } from "./types";

export const projectCategories: ProjectCategory[] = [
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    description: "Hardening, segmentation, and defensive design work.",
  },
  {
    id: "cloud",
    name: "Cloud",
    description: "Distributed systems built on AWS and container platforms.",
  },
  {
    id: "networking",
    name: "Networking",
    description: "Routing, switching, segmentation, and network simulation.",
  },
  {
    id: "software",
    name: "Software",
    description: "Systems programming and embedded work.",
  },
  {
    id: "ai-data",
    name: "AI / Data",
    description: "Machine learning, data mining, and reproducibility studies.",
  },
];

export const projects: Project[] = [
  {
    id: "enterprise-network-security-design",
    title: "Enterprise Network Security Design",
    categoryIds: ["networking", "cybersecurity"],
    shortDescription:
      "A segmented enterprise network simulated end to end in Cisco Packet Tracer, hardened against Layer 2 attacks.",
    longDescription: [
      "Designed and simulated a segmented enterprise network of routers, switches, and hosts in Cisco Packet Tracer, modelling the access, distribution, and core layers of a realistic corporate topology.",
      "Implemented VLAN subnetting to isolate broadcast domains and applied port security on the access layer to mitigate MAC spoofing and CAM-table flooding, the two Layer 2 attacks that most reliably break a flat network.",
      "The exercise was as much about failure modes as design: each control was validated by attempting the attack it was meant to stop and confirming the switch behaved as configured.",
    ],
    dateLabel: "Individual Project",
    sortDate: "2024-05",
    technologies: [
      "Cisco Packet Tracer",
      "Cisco IOS",
      "VLANs",
      "Subnetting",
      "Port Security",
      "Routing & Switching",
    ],
    screenshots: [],
    githubUrl: null,
    demoUrl: null,
    architectureDiagram: null,
    accomplishments: [
      "Mitigated MAC spoofing and CAM-table flooding through access-layer port security.",
      "Segmented the network with VLAN subnetting to contain broadcast domains and limit lateral movement.",
    ],
    lessonsLearned: [
      "Layer 2 is where most nominally secure networks are actually soft. Segmentation without port security is a false sense of safety.",
    ],
    featured: true,
  },
  {
    id: "aws-image-recognition-pipeline",
    title: "AWS Image Recognition Pipeline",
    categoryIds: ["cloud", "ai-data"],
    shortDescription:
      "Two EC2 instances running in parallel, chained through SQS, performing object and text recognition on an S3 image set.",
    longDescription: [
      "A distributed image-recognition pipeline built on AWS with two EC2 instances working in parallel, written in Java against the AWS SDK v2.",
      "Instance A reads images from a public S3 bucket, runs object detection through Amazon Rekognition, and pushes the index of every image containing a car (above 80% confidence) onto an SQS queue, then pushes a sentinel value to close the stream. Instance B consumes indexes as they appear, downloads each image, runs text detection, and writes a report of every image containing both a car and readable text.",
      "The interesting constraints were ordering and start-order independence: a FIFO queue guarantees the sentinel arrives after every real index, and both applications create the queue idempotently on startup so either instance can be launched first.",
    ],
    dateLabel: "2026",
    sortDate: "2026-07",
    technologies: [
      "AWS EC2",
      "Amazon S3",
      "Amazon SQS (FIFO)",
      "Amazon Rekognition",
      "AWS IAM",
      "Java",
      "Maven",
      "Linux",
    ],
    screenshots: [],
    githubUrl: null,

    demoUrl:
      "https://drive.google.com/file/d/1RrQQz50AtNsk5ZjuIPslWD4Ie9uau4Z5/view?usp=sharing",

    architectureDiagram: null,
    accomplishments: [
      "Ran both instances in parallel with no start-order dependency by creating the SQS queue idempotently from either side.",
      "Guaranteed correct stream termination by using a FIFO queue so the end-of-stream sentinel could not overtake real work.",
      "Deployed and verified end to end on live EC2 instances rather than only locally.",
    ],
    lessonsLearned: [
      "Standard SQS queues do not preserve ordering, so a sentinel value is only safe on a FIFO queue.",
      "Distribution-packaged build tooling can silently ignore modern compiler flags; pinning plugin versions is not optional.",
    ],
    featured: true,
  },
  {
    id: "secure-serial-transmission",
    title: "Secure Serial Data Transmission System",
    categoryIds: ["software", "cybersecurity"],
    shortDescription:
      "A serial communication system in C with integrity checking, running on a co-designed RISC-V circuit network.",
    longDescription: [
      "Built and tested a serial communication system in C with integrity checking to detect and prevent data corruption in transit.",
      "Co-designed the supporting circuit network using RISC-V architecture, integrated circuits, and discrete transistors. The software and the hardware it ran on were developed together rather than one against a fixed spec.",
      "Presented the finished system to a formal technical review panel.",
    ],
    dateLabel: "Group Project",
    sortDate: "2024-12",
    technologies: [
      "C",
      "RISC-V",
      "Serial Communication",
      "Digital Logic",
      "Integrated Circuits",
      "Hardware Debugging",
    ],
    screenshots: [],
    githubUrl: null,
    demoUrl: null,
    architectureDiagram: null,
    accomplishments: [
      "Delivered a working hardware and software system and defended it before a formal judging panel.",
    ],
    lessonsLearned: [
      "Integrity checking is cheap to add early and expensive to retrofit once a protocol is in use.",
    ],
    featured: true,
  },
  {
    id: "clustering-from-scratch",
    title: "Clustering & Outlier Detection From Scratch",
    categoryIds: ["ai-data"],
    shortDescription:
      "K-means, hierarchical clustering across four linkage methods, k-NN outlier detection and Silhouette scoring, implemented in pure Python.",
    longDescription: [
      "A data-mining study implementing the core unsupervised algorithms from first principles in pure standard-library Python, with no numerical libraries in the implementation path.",
      "Covered k-nearest-neighbour outlier detection, K-means, agglomerative hierarchical clustering across four linkage strategies, and Silhouette coefficient evaluation, run against three synthetic three-dimensional datasets.",
      "Results were independently cross-checked against established library implementations to confirm the from-scratch versions produced equivalent clusterings.",
    ],
    dateLabel: "2026",
    sortDate: "2026-07",
    technologies: [
      "Python",
      "K-Means",
      "Hierarchical Clustering",
      "k-NN",
      "Silhouette Analysis",
      "Data Mining",
    ],
    screenshots: [],
    githubUrl: null,
    demoUrl: null,
    architectureDiagram: null,
    accomplishments: [
      "Validated every from-scratch implementation against reference library output.",
      "Compared four hierarchical linkage strategies on the same datasets rather than assuming a default.",
    ],
    lessonsLearned: [
      "Writing the algorithm yourself is the fastest way to find out which of its assumptions your data violates.",
    ],
    featured: false,
  },
  {
    id: "solar-ml-reproduction",
    title: "Solar Flare Prediction: ML Reproduction Study",
    categoryIds: ["ai-data"],
    shortDescription:
      "Reproduced ten published solar machine-learning tools on modern hardware and documented which ones still build.",
    longDescription: [
      "A reproducibility study covering ten published solar machine-learning tools, rebuilt and re-run from their original repositories against a single shared Python 3.10 and TensorFlow 2.10 environment.",
      "The result was as much negative as positive: several tools pinned to TensorFlow 1.x and Python 3.6 are effectively unbuildable on current systems, while the rest could be unified under one environment with a small number of compatibility patches.",
      "Paired with a close reading of an LSTM-based flare-prediction paper and presented as a full technical deck.",
    ],
    dateLabel: "2026",
    sortDate: "2026-07",
    technologies: [
      "Python",
      "TensorFlow",
      "Keras",
      "scikit-learn",
      "LSTM",
      "Reproducibility",
    ],
    screenshots: [],
    githubUrl: null,
    demoUrl: null,
    architectureDiagram: null,
    accomplishments: [
      "Unified ten separately-pinned research repositories under a single working environment.",
      "Documented exactly which tools are no longer reproducible on modern platforms, and why.",
    ],
    lessonsLearned: [
      "A published model is only as reproducible as its dependency pins, and most pins rot within a few years.",
    ],
    featured: false,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function projectsInCategory(categoryId: string): Project[] {
  return projects.filter((p) => p.categoryIds.includes(categoryId));
}

export function projectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
