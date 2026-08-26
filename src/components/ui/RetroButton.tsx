"use client";

import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";

type Variant = "default" | "primary" | "ghost";
type Size = "sm" | "md";

const sizes: Record<Size, string> = {
  sm: "px-2.5 py-1 text-[11px]",
  md: "px-3.5 py-1.5 text-[13px]",
};

const base =
  "inline-flex items-center justify-center gap-1.5 font-medium select-none " +
  "transition-[transform,background-color] duration-75 active:translate-y-px " +
  "disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  default:
    "surface-raised bg-[var(--chrome)] text-[var(--ink)] hover:bg-[var(--chrome-alt)] active:bg-[var(--chrome-deep)]",
  primary:
    "surface-raised bg-[var(--accent)] text-[var(--accent-ink)] hover:brightness-110 active:brightness-95",
  ghost:
    "border border-transparent text-[var(--ink-soft)] hover:bg-[var(--surface-sunken)] hover:text-[var(--ink)]",
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  /** React 19 passes ref as an ordinary prop, no forwardRef needed. */
  ref?: Ref<HTMLButtonElement>;
}

export function RetroButton({
  variant = "default",
  size = "md",
  className = "",
  children,
  type = "button",
  ref,
  ...rest
}: Props) {
  return (
    <button
      ref={ref}
      type={type}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

/** Same styling, rendered as an anchor. */
export function RetroLink({
  variant = "default",
  size = "md",
  className = "",
  children,
  external = true,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  size?: Size;
  external?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}
