"use client";

import { useStoredState } from "@/lib/hooks";

/** A scratch pad that survives reloads. Stored locally, never uploaded. */
export function Notes() {
  const [text, setText] = useStoredState<string>("desk.notes", "");

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-[var(--hairline)] bg-[var(--chrome)] px-3 py-1.5">
        <p className="label-micro text-[10px] text-[var(--ink-soft)]">
          Saved in this browser only
        </p>
      </div>

      <label htmlFor="notes-area" className="sr-only-block">
        Scratch notes
      </label>
      <textarea
        id="notes-area"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Leave yourself a note. It stays on this device."
        spellCheck={false}
        className="retro-scroll min-h-0 flex-1 resize-none bg-[var(--surface)] p-4 font-[family-name:var(--font-mono)] text-[12.5px] leading-relaxed text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)]"
      />

      <div className="flex items-center justify-between border-t border-[var(--hairline)] bg-[var(--chrome)] px-3 py-1">
        <span className="label-micro text-[10px] text-[var(--ink-soft)]">
          {text.length} chars
        </span>
        <button
          type="button"
          onClick={() => setText("")}
          className="text-[11px] text-[var(--ink-soft)] underline hover:text-[var(--ink)]"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
