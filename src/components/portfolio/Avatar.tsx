/**
 * Original retro-computer portrait. Drawn rather than photographed so the
 * site ships with no image payload, swap in a real photo whenever you like.
 */
export function Avatar({ className = "" }: { className?: string }) {
  return (
    <svg
      width="132"
      height="132"
      viewBox="0 0 132 132"
      role="img"
      aria-label="A retro desktop computer displaying the initials S A"
      className={className}
    >
      <rect
        x="2"
        y="2"
        width="128"
        height="128"
        fill="var(--surface-sunken)"
        stroke="var(--hairline-strong)"
        strokeWidth="2"
      />
      {/* dot grid backdrop */}
      <pattern
        id="avatar-dots"
        width="8"
        height="8"
        patternUnits="userSpaceOnUse"
      >
        <circle cx="1" cy="1" r="1" fill="var(--ink-faint)" opacity="0.35" />
      </pattern>
      <rect x="2" y="2" width="128" height="128" fill="url(#avatar-dots)" />

      {/* monitor body */}
      <rect
        x="20"
        y="24"
        width="92"
        height="72"
        rx="4"
        fill="var(--chrome)"
        stroke="var(--hairline-strong)"
        strokeWidth="2"
      />
      {/* screen */}
      <rect
        x="29"
        y="33"
        width="74"
        height="48"
        rx="2"
        fill="#0e2a1f"
        stroke="var(--hairline-strong)"
        strokeWidth="1.5"
      />
      {/* scanlines */}
      <g opacity="0.35">
        {Array.from({ length: 12 }, (_, i) => (
          <rect
            key={i}
            x="30"
            y={35 + i * 4}
            width="72"
            height="1"
            fill="#4fd18a"
            opacity="0.25"
          />
        ))}
      </g>
      <text
        x="66"
        y="65"
        textAnchor="middle"
        fill="#7ef3b0"
        fontSize="27"
        fontWeight="700"
        fontFamily="var(--font-display), sans-serif"
        letterSpacing="3"
      >
        SA
      </text>
      {/* power light + vents */}
      <circle cx="103" cy="89" r="2.6" fill="#4fd18a" />
      <path
        d="M30 87h34"
        stroke="var(--hairline)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* stand */}
      <path
        d="M54 96h24v8h10v6H44v-6h10z"
        fill="var(--chrome-alt)"
        stroke="var(--hairline-strong)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
