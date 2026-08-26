"use client";

import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  aside,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  aside?: ReactNode;
}) {
  return (
    <header className="mb-5 border-b border-[var(--hairline)] pb-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          {eyebrow && (
            <p className="label-micro mb-1.5 text-[10px] tracking-widest text-[var(--ink-faint)] uppercase">
              {eyebrow}
            </p>
          )}
          <h2 className="font-[family-name:var(--font-display)] text-[22px] leading-tight font-bold tracking-tight text-[var(--ink)]">
            {title}
          </h2>
        </div>
        {aside}
      </div>
      {description && (
        <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-[var(--ink-soft)]">
          {description}
        </p>
      )}
    </header>
  );
}

/** Standard padding for every Finder page. */
export function Page({ children }: { children: ReactNode }) {
  return <div className="px-5 py-4 sm:px-7 sm:py-6">{children}</div>;
}

/** A bevelled panel used for roles, projects, degrees, and certificates. */
export function Panel({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li" | "section";
}) {
  return (
    <Tag
      className={`surface-card bg-[var(--surface-alt)] p-4 transition-colors ${className}`}
    >
      {children}
    </Tag>
  );
}

/** Clickable version of Panel, for anything that navigates. */
export function PanelButton({
  children,
  onClick,
  label,
  className = "",
}: {
  children: ReactNode;
  onClick: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`surface-card block w-full cursor-pointer bg-[var(--surface-alt)] p-4 text-left transition-[background-color,transform] duration-75 hover:bg-[var(--surface-sunken)] active:translate-y-px ${className}`}
    >
      {children}
    </button>
  );
}

export function TechList({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <li
          key={t}
          className="border border-[var(--hairline)] bg-[var(--surface-sunken)] px-2 py-[3px] text-[11px] leading-none text-[var(--ink-soft)]"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

export function BulletList({
  items,
  className = "",
}: {
  items: string[];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <ul className={`space-y-1.5 ${className}`}>
      {items.map((item, i) => (
        <li
          key={i}
          className="relative pl-4 text-[13px] leading-relaxed text-[var(--ink-soft)]"
        >
          <span
            aria-hidden
            className="absolute top-[7px] left-0 block h-[5px] w-[5px] bg-[var(--accent)]"
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function SubHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="label-micro mb-2 text-[10px] tracking-widest text-[var(--ink-faint)] uppercase">
      {children}
    </h3>
  );
}

/** Shown when a collection is empty rather than rendering a blank pane. */
export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="surface-inset bg-[var(--surface-sunken)] px-4 py-6 text-center text-[13px] text-[var(--ink-faint)]">
      {children}
    </div>
  );
}

/**
 * Finder-style icon tile. Single click opens, inside a window that is what
 * people expect from a button, and it keeps the whole thing keyboard-usable.
 */
export function IconTile({
  glyph,
  label,
  sublabel,
  onOpen,
}: {
  glyph: ReactNode;
  label: string;
  sublabel?: string;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-full flex-col items-center gap-2 border border-transparent p-3 text-center transition-colors hover:border-[var(--hairline)] hover:bg-[var(--surface-sunken)] focus-visible:border-[var(--accent)]"
    >
      <span className="transition-transform duration-100 group-hover:-translate-y-0.5">
        {glyph}
      </span>
      <span className="text-[12.5px] leading-snug font-semibold text-[var(--ink)]">
        {label}
      </span>
      {sublabel && (
        <span className="text-[11px] leading-snug text-[var(--ink-faint)]">
          {sublabel}
        </span>
      )}
    </button>
  );
}
