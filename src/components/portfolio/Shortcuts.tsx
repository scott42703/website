"use client";

const GROUPS: { title: string; rows: [string, string][] }[] = [
  {
    title: "Windows",
    rows: [
      ["⌘ / Ctrl + W", "Close the front window"],
      ["⌘ / Ctrl + M", "Minimize the front window"],
      ["Esc", "Close an open menu"],
      ["Arrow keys", "Nudge a focused title bar"],
      ["Shift + Arrows", "Nudge further"],
    ],
  },
  {
    title: "Desktop",
    rows: [
      ["Tab", "Move between desktop icons"],
      ["Enter / Space", "Open the selected icon"],
      ["Double-click", "Open an icon"],
      ["Right-click", "Desktop context menu"],
    ],
  },
  {
    title: "Navigation",
    rows: [
      ["⌘ / Ctrl + K", "Jump to search"],
      ["Back / Forward", "Move through Finder history"],
    ],
  },
];

export function Shortcuts() {
  return (
    <div className="retro-scroll flex-1 overflow-y-auto px-6 py-5">
      <h2 className="font-[family-name:var(--font-display)] mb-1 text-[19px] font-bold text-[var(--ink)]">
        Keyboard Shortcuts
      </h2>
      <p className="mb-4 text-[12.5px] text-[var(--ink-soft)]">
        Everything on this desktop is reachable without a mouse.
      </p>

      {GROUPS.map((g) => (
        <section key={g.title} className="mb-5">
          <h3 className="label-micro mb-2 text-[10px] tracking-widest text-[var(--ink-faint)] uppercase">
            {g.title}
          </h3>
          <dl className="divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
            {g.rows.map(([keys, action]) => (
              <div key={keys} className="flex items-center gap-3 py-1.5">
                <dt className="w-[124px] shrink-0">
                  <kbd className="surface-raised inline-block bg-[var(--chrome)] px-1.5 py-[2px] font-[family-name:var(--font-mono)] text-[11px] text-[var(--ink)]">
                    {keys}
                  </kbd>
                </dt>
                <dd className="min-w-0 flex-1 text-[12.5px] text-[var(--ink-soft)]">
                  {action}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
