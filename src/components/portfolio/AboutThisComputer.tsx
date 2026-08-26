"use client";

import { personal } from "@/data/personal";
import { Avatar } from "./Avatar";

const SPECS: [string, string][] = [
  ["Machine", "Alessio Workstation"],
  ["System", "PortfolioOS 1.0"],
  ["Processor", "Curiosity, 8 cores"],
  ["Memory", "Enough to hold the whole topology"],
  ["Startup Disk", "Coffee"],
  ["Uptime", "Since 2021"],
];

export function AboutThisComputer() {
  return (
    <div className="retro-scroll flex-1 overflow-y-auto px-6 py-6">
      <div className="flex items-start gap-5">
        <Avatar className="shrink-0" />
        <div className="min-w-0">
          <h2 className="font-[family-name:var(--font-display)] text-[20px] leading-tight font-bold text-[var(--ink)]">
            {personal.name}
          </h2>
          <p className="text-[12.5px] text-[var(--accent)]">{personal.title}</p>
          <p className="label-micro mt-2 text-[10px] text-[var(--ink-faint)]">
            {personal.disciplines.join("  •  ")}
          </p>
        </div>
      </div>

      <dl className="mt-5 divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
        {SPECS.map(([k, v]) => (
          <div key={k} className="flex gap-3 py-1.5">
            <dt className="w-[104px] shrink-0 text-[12px] text-[var(--ink-faint)]">
              {k}
            </dt>
            <dd className="min-w-0 flex-1 text-[12px] text-[var(--ink)]">
              {v}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 text-[11.5px] leading-relaxed text-[var(--ink-faint)]">
        Not a real machine, but the portfolio behind it is. Everything on this
        desktop is built from a single set of content files.
      </p>
    </div>
  );
}
