"use client";

import { useEffect, useRef, useState } from "react";
import { personal } from "@/data/personal";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { useOpenApp } from "@/lib/use-open-app";
import type { SectionId } from "@/data/types";

const SECTIONS: SectionId[] = [
  "about",
  "experience",
  "projects",
  "research",
  "education",
  "certifications",
  "skills",
  "contact",
];

const BANNER = ["PortfolioOS 1.0. Type `help` for a list of commands.", ""];

export function Terminal() {
  const [lines, setLines] = useState<string[]>(BANNER);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const openApp = useOpenApp();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const print = (out: string[]) => setLines((prev) => [...prev, ...out, ""]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    setLines((prev) => [...prev, `> ${cmd}`]);
    if (!cmd) return;

    const [name, ...args] = cmd.split(/\s+/);

    switch (name.toLowerCase()) {
      case "help":
        print([
          "help              this list",
          "whoami            who you are talking to",
          "ls                list portfolio sections",
          "open <section>    open a section in the Finder",
          "experience        summarise roles",
          "projects          list projects",
          "skills            list skill domains",
          "contact           how to reach me",
          "clear             clear the screen",
        ]);
        break;

      case "whoami":
        print([
          `${personal.name}, ${personal.title}`,
          personal.disciplines.join(" / "),
          personal.location,
        ]);
        break;

      case "ls":
        print([SECTIONS.join("  ")]);
        break;

      case "open": {
        const target = args[0]?.toLowerCase() as SectionId | undefined;
        if (!target || !SECTIONS.includes(target)) {
          print([
            `open: unknown section "${args[0] ?? ""}"`,
            `try: ${SECTIONS.join(", ")}`,
          ]);
          break;
        }
        openApp("portfolio", { route: { section: target } });
        print([`opening ${target}…`]);
        break;
      }

      case "experience":
        print(
          experience.map(
            (r) =>
              `${r.dateLabel.padEnd(20)} ${r.position} at ${r.organization}`,
          ),
        );
        break;

      case "projects":
        print(projects.map((p) => `- ${p.title}`));
        break;

      case "skills":
        print(skillGroups.map((g) => `${g.name} (${g.skills.length})`));
        break;

      case "contact":
        print([personal.email, personal.linkedin]);
        break;

      case "clear":
        setLines([]);
        break;

      case "sudo":
        print(["Nice try."]);
        break;

      default:
        print([`${name}: command not found`]);
    }
  };

  return (
    // Clicking anywhere in the pane focuses the prompt, the way a real
    // terminal behaves. The input itself carries the keyboard affordance.
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex min-h-0 flex-1 cursor-text flex-col bg-[#0d1512] text-left"
    >
      <div
        ref={scrollRef}
        className="retro-scroll min-h-0 flex-1 overflow-y-auto p-3 font-[family-name:var(--font-mono)] text-[12px] leading-[1.6] text-[#7ef3b0]"
      >
        {lines.map((line, i) => (
          <p key={i} className="whitespace-pre-wrap">
            {line || " "}
          </p>
        ))}

        <div className="flex items-center gap-1.5">
          <span aria-hidden>&gt;</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              run(input);
              setInput("");
            }}
            aria-label="Terminal input"
            spellCheck={false}
            autoComplete="off"
            className="flex-1 bg-transparent font-[family-name:var(--font-mono)] text-[12px] text-[#7ef3b0] caret-[#7ef3b0] outline-none"
          />
        </div>
      </div>
    </div>
  );
}
