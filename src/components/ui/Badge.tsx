import type { ReactNode } from "react";

export function Badge({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "accent" | "muted";
}) {
  const tones = {
    default:
      "bg-[var(--surface-sunken)] text-[var(--ink-soft)] border-[var(--hairline)]",
    accent:
      "bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)]",
    muted:
      "bg-transparent text-[var(--ink-faint)] border-[var(--hairline)] border-dashed",
  };
  return (
    <span
      className={`inline-flex items-center border px-2 py-[3px] text-[11px] leading-none font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
