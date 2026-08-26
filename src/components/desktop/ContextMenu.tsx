"use client";

import { useRef } from "react";
import { useDismissOnOutside } from "@/lib/hooks";

export interface ContextAction {
  label: string;
  onSelect?: () => void;
  divider?: boolean;
  checked?: boolean;
}

export function ContextMenu({
  x,
  y,
  actions,
  onClose,
}: {
  x: number;
  y: number;
  actions: ContextAction[];
  onClose: () => void;
}) {
  const ref = useRef<HTMLUListElement>(null);
  useDismissOnOutside(true, onClose, ref);

  // Keep the menu inside the viewport near the right and bottom edges.
  const left = Math.min(x, (globalThis.innerWidth ?? 1024) - 210);
  const top = Math.min(
    y,
    (globalThis.innerHeight ?? 768) - actions.length * 24 - 24,
  );

  return (
    <ul
      ref={ref}
      role="menu"
      aria-label="Desktop actions"
      style={{ left, top }}
      className="material-bar backdrop-blur-[20px] backdrop-saturate-[180%] fixed z-[9500] min-w-[220px] rounded-[8px] p-1 shadow-[var(--shadow-menu)]"
    >
      {actions.map((action, i) =>
        action.divider ? (
          <li
            key={`div-${i}`}
            role="separator"
            className="mx-2 my-1 h-px bg-[var(--hairline)]"
          />
        ) : (
          <li key={action.label} role="none">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                action.onSelect?.();
                onClose();
              }}
              className="flex w-full items-center gap-2 rounded-[5px] px-2 py-[5px] text-left text-[13px] text-[var(--ink)] hover:bg-[var(--accent)] hover:text-[var(--accent-ink)]"
            >
              <span aria-hidden className="w-3 shrink-0 text-[11px]">
                {action.checked ? "✓" : ""}
              </span>
              <span className="min-w-0 flex-1 truncate">{action.label}</span>
            </button>
          </li>
        ),
      )}
    </ul>
  );
}
