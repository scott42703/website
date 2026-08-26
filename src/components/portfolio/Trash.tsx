"use client";

import { useState } from "react";
import { DocumentGlyph } from "@/components/ui/icons";
import { RetroButton } from "@/components/ui/RetroButton";

/** Harmless joke files. Deleting them is a no-op the page can undo. */
const JUNK = [
  {
    name: "final_FINAL_v3_actually_final.docx",
    note: "Every résumé revision, immortalised.",
  },
  {
    name: "it_works_on_my_machine.log",
    note: "Filed after a firmware mismatch. Reopened twice.",
  },
  {
    name: "turn_it_off_and_on_again.sh",
    note: "Solved more incidents than it should have.",
  },
  {
    name: "802.11_curse_words.txt",
    note: "Compiled during a wireless survey.",
  },
  {
    name: "dns_was_not_the_problem.pdf",
    note: "It was, in fact, DNS.",
  },
];

export function Trash() {
  const [emptied, setEmptied] = useState(false);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-[var(--hairline)] bg-[var(--chrome)] px-3 py-1.5">
        <p className="label-micro text-[10px] text-[var(--ink-soft)]">
          {emptied ? "0 items" : `${JUNK.length} items`}
        </p>
        <RetroButton
          size="sm"
          onClick={() => setEmptied((v) => !v)}
          disabled={false}
        >
          {emptied ? "Put Back" : "Empty Trash"}
        </RetroButton>
      </div>

      <div className="retro-scroll min-h-0 flex-1 overflow-y-auto p-3">
        {emptied ? (
          <div className="grid h-full place-items-center px-6 text-center">
            <div>
              <p className="text-[13px] font-semibold text-[var(--ink)]">
                The Trash is empty.
              </p>
              <p className="mt-1.5 text-[12px] text-[var(--ink-soft)]">
                Nothing important was in there. Probably.
              </p>
            </div>
          </div>
        ) : (
          <ul className="space-y-1">
            {JUNK.map((f) => (
              <li
                key={f.name}
                className="flex items-center gap-3 border border-transparent px-2 py-1.5 hover:border-[var(--hairline)] hover:bg-[var(--surface-sunken)]"
              >
                <DocumentGlyph size={26} className="shrink-0 opacity-70" />
                <span className="min-w-0">
                  <span className="block truncate font-[family-name:var(--font-mono)] text-[12px] text-[var(--ink)]">
                    {f.name}
                  </span>
                  <span className="block truncate text-[11.5px] text-[var(--ink-faint)]">
                    {f.note}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
