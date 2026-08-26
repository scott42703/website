import type { Personal } from "./types";

export const personal: Personal = {
  name: "Scott Alessio",
  shortName: "Scott",
  title: "Computer Engineer",
  disciplines: ["Cybersecurity", "Cloud", "Infrastructure", "Networking"],
  location: "Paramus, NJ",
  email: "scott42703@gmail.com",

  phone: "(201) 615-0018",
  showPhone: false,

  linkedin: "https://www.linkedin.com/in/scott-alessio-4b1743287",
  github: null,
  website: null,

  resumePath: "/resume/Scott_Alessio_Resume.pdf",
  resumeFileName: "Scott_Alessio_Resume.pdf",

  summary:
    "Engineer with an M.S. in Cyber Security and Privacy, a B.S. in Computer Engineering, and CompTIA Security+, most recently supporting a 40,000+ server global data center fleet at Bloomberg.",

  bio: [
    "I work on the physical and logical layers most people never see: the servers, switches, and network paths that everything else runs on top of. At Bloomberg I supported a global, high-availability data center fleet of more than 40,000 multi-vendor x86 servers and enterprise routers and switches across paired production sites.",
    "My background is deliberately full-stack in the infrastructure sense. A B.S. in Computer Engineering gave me the hardware and architecture side, and an M.S. in Cyber Security and Privacy gave me the threat model. In between, I led an eight-person research team at NJIT that built an LLM-driven assistant for Cisco network device operations and published two peer-reviewed papers on prompt efficacy for network environments.",
    "Day to day I am most at home tracing a fault to its root cause, whether that is a bad DIMM, a Calico policy denial, a firmware regression, or a misconfigured ACL, and then writing the runbook so nobody has to solve it twice.",
  ],

  availability:
    "Available now for systems, infrastructure, network, and security engineering roles across New York City and Northern New Jersey.",
};
