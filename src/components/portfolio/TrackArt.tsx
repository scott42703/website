import type { Track } from "@/data/music";

/**
 * Generated cover art. The two colours come from the track's own data, and
 * the geometry is derived from its id, so every cover is stable, distinct,
 * and looks composed rather than random. Swap in real artwork by rendering
 * an <img> here instead.
 */
export function TrackArt({
  track,
  size = 40,
  className = "",
}: {
  track: Track;
  size?: number;
  className?: string;
}) {
  const [from, to] = track.art;
  const seed = [...track.id].reduce((a, c) => a + c.charCodeAt(0), 0);
  const angle = seed % 90;
  const cx = 30 + (seed % 40);
  const cy = 34 + ((seed * 7) % 34);
  const gradientId = `art-${track.id}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={`Cover art for ${track.title}`}
      className={`shrink-0 rounded-[5px] ${className}`}
      style={{ boxShadow: "inset 0 0 0 1px var(--hairline)" }}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          y1="0"
          x2="1"
          y2="1"
          gradientTransform={`rotate(${angle} 0.5 0.5)`}
        >
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>

      <rect width="100" height="100" fill={`url(#${gradientId})`} />

      {/* A soft bloom and two arcs, enough shape to read as a sleeve. */}
      <circle cx={cx} cy={cy} r="30" fill="#fff" opacity="0.16" />
      <circle
        cx={cx}
        cy={cy}
        r="46"
        fill="none"
        stroke="#fff"
        strokeWidth="1.5"
        opacity="0.22"
      />
      <circle
        cx={100 - cx}
        cy={100 - cy}
        r="26"
        fill="none"
        stroke="#000"
        strokeWidth="1.5"
        opacity="0.14"
      />
    </svg>
  );
}
