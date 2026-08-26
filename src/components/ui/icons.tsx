/**
 * Original icon set drawn for this project.
 * Deliberately geometric and pixel-aligned, no vendor or OS assets.
 * Every icon is decorative by default (`aria-hidden`); labels live in the
 * surrounding button or link.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 16, ...rest }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 16 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true,
    focusable: false,
    ...rest,
  } as SVGProps<SVGSVGElement>;
}

/* ---------------------------------------------------------------- chrome */

export function ChevronLeft(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M10 3 5 8l5 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function ChevronRight(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M6 3l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function ChevronDown(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M3 6l5 5 5-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="7" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m10.5 10.5 3 3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function GridIcon(props: IconProps) {
  return (
    <svg {...base(props)} shapeRendering="crispEdges">
      <path
        d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ListIcon(props: IconProps) {
  return (
    <svg {...base(props)} shapeRendering="crispEdges">
      <path
        d="M2 3h2v2H2zM6 3h8v2H6zM2 7h2v2H2zM6 7h8v2H6zM2 11h2v2H2zM6 11h8v2H6z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5 13 13M13 3l-1.5 1.5M4.5 11.5 3 13"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M13 9.5A5.5 5.5 0 0 1 6.5 3a5.5 5.5 0 1 0 6.5 6.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WifiIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M1.5 5.5a9 9 0 0 1 13 0M4 8.5a5.5 5.5 0 0 1 8 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="8" cy="12" r="1.3" fill="currentColor" />
    </svg>
  );
}

export function SpeakerIcon({
  muted,
  ...props
}: IconProps & { muted?: boolean }) {
  return (
    <svg {...base(props)}>
      <path
        d="M3 6h2l3-2.5v9L5 10H3z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {muted ? (
        <path
          d="m10.5 6 3 4M13.5 6l-3 4"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M10.5 5.5a3.5 3.5 0 0 1 0 5M12.5 3.5a6.5 6.5 0 0 1 0 9"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

/** The small machine glyph in the menu bar, a generic CRT box, not a Mac. */
export function ComputerGlyph({ size = 16, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      focusable="false"
      shapeRendering="crispEdges"
      {...rest}
    >
      <rect
        x="1.5"
        y="2.5"
        width="13"
        height="9"
        stroke="currentColor"
        strokeWidth="1"
      />
      <rect
        x="3"
        y="4"
        width="10"
        height="6"
        fill="currentColor"
        opacity="0.35"
      />
      <path d="M4 5h6v1H4zM4 7h4v1H4z" fill="currentColor" />
      <path d="M6 12h4v1H6zM4 13h8v1H4z" fill="currentColor" />
    </svg>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect
        x="5.5"
        y="5.5"
        width="8"
        height="8"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M10.5 3.5h-8v8"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="m3 8.5 3.5 3.5L13 5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function ExternalIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M6.5 3H3v10h10V9.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="square"
      />
      <path
        d="M9.5 2.5H13.5V6.5M13 3 8 8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M8 2v8M4.5 7 8 10.5 11.5 7M2.5 13h11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect
        x="1.5"
        y="3.5"
        width="13"
        height="9"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="m2 4.5 6 4.5 6-4.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Generic professional-network glyph, deliberately not a brand mark. */
export function NetworkPersonIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="8" cy="5" r="2.4" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M2.8 13.5c0-2.6 2.3-4.2 5.2-4.2s5.2 1.6 5.2 4.2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="square"
      />
    </svg>
  );
}

/** Generic source-control glyph, deliberately not a brand mark. */
export function BranchIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle
        cx="4.5"
        cy="3.5"
        r="1.8"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle
        cx="4.5"
        cy="12.5"
        r="1.8"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle
        cx="11.5"
        cy="5.5"
        r="1.8"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M4.5 5.3v5.4M11.5 7.3c0 2.2-2 2.8-4.2 3.2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TerminalIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect
        x="1.5"
        y="2.5"
        width="13"
        height="11"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="m4 6 2.2 2L4 10M8.5 10.5H12"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function ResizeGripIcon(props: IconProps) {
  return (
    <svg {...base(props)} shapeRendering="crispEdges">
      <path
        d="M11 13h2v-2h-2zM8 13h2v-2H8zM11 10h2V8h-2z"
        fill="currentColor"
        opacity="0.75"
      />
    </svg>
  );
}

/* ---------------------------------------------------- large desktop icons */

export type GlyphTone =
  | "folder"
  | "folder-alt"
  | "doc"
  | "pdf"
  | "cert"
  | "trash"
  | "person"
  | "chip";

const toneFill: Record<string, { body: string; edge: string; tab: string }> = {
  folder: { body: "#7fbde0", edge: "#245d80", tab: "#a5d4ee" },
  "folder-alt": { body: "#e0b27f", edge: "#8a5a24", tab: "#eecfa5" },
};

/** Classic tabbed folder, 48-unit grid, hard edges. */
export function FolderGlyph({
  size = 44,
  tone = "folder",
  open = false,
  ...rest
}: IconProps & { tone?: "folder" | "folder-alt"; open?: boolean }) {
  const c = toneFill[tone];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
      focusable="false"
      {...rest}
    >
      <path
        d="M4 12h14l3.5 4H44v25a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"
        fill={c.body}
        stroke={c.edge}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M4 12h14l3.5 4H4z"
        fill={c.tab}
        stroke={c.edge}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {open ? (
        <path
          d="M8 21h34l-4 19H4z"
          fill={c.tab}
          stroke={c.edge}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      ) : (
        <path d="M8 21h32v1.6H8z" fill={c.tab} opacity="0.8" />
      )}
    </svg>
  );
}

/** Page with a folded corner. `kind` swaps the badge in the lower half. */
export function DocumentGlyph({
  size = 44,
  kind = "doc",
  ...rest
}: IconProps & { kind?: "doc" | "pdf" | "cert" | "chip" }) {
  const accent =
    kind === "pdf" ? "#c0392b" : kind === "cert" ? "#b7791f" : "#3b6ea5";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
      focusable="false"
      {...rest}
    >
      <path
        d="M9 4h20l10 10v30H9z"
        fill="#fbfbf6"
        stroke="#3a3a34"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M29 4v10h10"
        fill="#e2e2d8"
        stroke="#3a3a34"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {kind === "doc" && (
        <path
          d="M14 20h20M14 25h20M14 30h14M14 35h18"
          stroke="#8a8a80"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      )}
      {kind === "pdf" && (
        <>
          <rect x="12" y="26" width="24" height="13" rx="1.5" fill={accent} />
          <path
            d="M16 30h2.4a1.6 1.6 0 0 1 0 3.2H16V36m6.5-6h2.6a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2.6zm8 0h4m-4 3h3m-3-3v6"
            stroke="#fff"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 18h20"
            stroke="#8a8a80"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </>
      )}
      {kind === "cert" && (
        <>
          <path
            d="M14 20h20M14 25h14"
            stroke="#8a8a80"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle
            cx="24"
            cy="33"
            r="6"
            fill={accent}
            stroke="#7a5410"
            strokeWidth="1.4"
          />
          <path
            d="m20.5 38 2 6 1.5-2 1.5 2 2-6"
            fill={accent}
            stroke="#7a5410"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <path
            d="m21.6 33 1.8 1.8 3-3.4"
            stroke="#fff"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
      {kind === "chip" && (
        <>
          <rect x="15" y="21" width="18" height="18" fill={accent} rx="1" />
          <path
            d="M19 25h10v10H19z"
            stroke="#fff"
            strokeWidth="1.4"
            fill="none"
          />
          <path
            d="M15 27h-3M15 31h-3M15 35h-3M33 27h3M33 31h3M33 35h3"
            stroke="#3a3a34"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}

/** Wire-mesh trash can. `full` adds a crumpled sheet on top. */
export function TrashGlyph({
  size = 44,
  full = false,
  ...rest
}: IconProps & { full?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
      focusable="false"
      {...rest}
    >
      <ellipse
        cx="24"
        cy="12"
        rx="13"
        ry="4"
        fill="#c9cbd2"
        stroke="#3f4149"
        strokeWidth="1.6"
      />
      <path
        d="M11 12v27c0 2.2 5.8 4 13 4s13-1.8 13-4V12"
        fill="#dcdee4"
        stroke="#3f4149"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M17 16v22M24 16v22M31 16v22"
        stroke="#9a9da6"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {full && (
        <path
          d="m18 9 3-5 3 3 4-4 2 5 3-2-1 4z"
          fill="#f2f2ea"
          stroke="#3f4149"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

/** Portrait card used for About Me. */
export function PersonGlyph({ size = 44, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
      focusable="false"
      {...rest}
    >
      <rect
        x="6"
        y="5"
        width="36"
        height="38"
        rx="2"
        fill="#fbfbf6"
        stroke="#3a3a34"
        strokeWidth="1.6"
      />
      <rect x="10" y="9" width="28" height="30" fill="#cfe0ee" />
      <circle cx="24" cy="21" r="6.5" fill="#3b6ea5" />
      <path d="M12 39c1.5-7 6-10.5 12-10.5S34.5 32 36 39z" fill="#3b6ea5" />
    </svg>
  );
}

/** Briefcase for Experience. */
export function BriefcaseGlyph({ size = 44, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
      focusable="false"
      {...rest}
    >
      <path
        d="M18 12V9a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3"
        stroke="#3a3a34"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect
        x="5"
        y="12"
        width="38"
        height="28"
        rx="2"
        fill="#a9846a"
        stroke="#5b4130"
        strokeWidth="1.6"
      />
      <rect x="5" y="22" width="38" height="5" fill="#8c6a53" />
      <rect
        x="20"
        y="20"
        width="8"
        height="9"
        rx="1"
        fill="#e8dccf"
        stroke="#5b4130"
        strokeWidth="1.4"
      />
    </svg>
  );
}

/** Flask for Research. */
export function FlaskGlyph({ size = 44, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
      focusable="false"
      {...rest}
    >
      <path
        d="M19 5h10v13l10 20a3 3 0 0 1-2.6 4.5H11.6A3 3 0 0 1 9 38L19 18z"
        fill="#e9f1f6"
        stroke="#3a3a34"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 30h21l4 8a3 3 0 0 1-2.6 4.5H12.1A3 3 0 0 1 9.5 38z"
        fill="#4fa3a3"
      />
      <path
        d="M17 4h14"
        stroke="#3a3a34"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="21" cy="36" r="2" fill="#e9f1f6" opacity="0.85" />
      <circle cx="28" cy="39" r="1.4" fill="#e9f1f6" opacity="0.85" />
    </svg>
  );
}

/** Mortarboard for Education. */
export function CapGlyph({ size = 44, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
      focusable="false"
      {...rest}
    >
      <path
        d="M24 9 3 18l21 9 21-9z"
        fill="#2f3a4a"
        stroke="#161b24"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M12 22v11c0 3.3 5.4 6 12 6s12-2.7 12-6V22"
        fill="#41506a"
        stroke="#161b24"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M42 19v11"
        stroke="#161b24"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle
        cx="42"
        cy="31.5"
        r="2.2"
        fill="#c8a33a"
        stroke="#161b24"
        strokeWidth="1.2"
      />
    </svg>
  );
}

/** App tile for the Music library, a sleeve with a note on it. */
export function MusicGlyph({ size = 44, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
      focusable="false"
      {...rest}
    >
      <defs>
        <linearGradient id="music-tile" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fc5c7d" />
          <stop offset="100%" stopColor="#6a82fb" />
        </linearGradient>
      </defs>
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="10"
        fill="url(#music-tile)"
      />
      <rect
        x="2.5"
        y="2.5"
        width="43"
        height="43"
        rx="9.5"
        stroke="rgba(0,0,0,0.16)"
      />
      <path
        d="M31 12.5v16.2a4.4 4.4 0 1 1-2.6-4V17l-9.8 2.4v13a4.4 4.4 0 1 1-2.6-4V16.2z"
        fill="#fff"
        opacity="0.95"
      />
    </svg>
  );
}
