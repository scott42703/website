"use client";

interface Props {
  title: string;
  maximized: boolean;
  canMaximize: boolean;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onClose: () => void;
}

/**
 * Traffic lights. Glyphs stay hidden until the group is hovered or a button
 * is focused, which is the behaviour people expect and keeps the title bar
 * quiet the rest of the time.
 */
const dot =
  "group/dot relative grid h-[12px] w-[12px] place-items-center rounded-full " +
  "transition-[filter,opacity] duration-150 hover:brightness-105 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "after:absolute after:inset-0 after:rounded-full after:shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.2)]";

const glyph =
  "relative z-10 opacity-0 transition-opacity duration-100 " +
  "group-hover/lights:opacity-70 group-focus-within/lights:opacity-70";

export function WindowControls({
  title,
  maximized,
  canMaximize,
  onMinimize,
  onToggleMaximize,
  onClose,
}: Props) {
  return (
    <div className="group/lights flex items-center gap-[8px]">
      <button
        type="button"
        onClick={onClose}
        aria-label={`Close ${title}`}
        title="Close"
        className={`${dot} bg-[#ff5f57]`}
      >
        <svg
          width="7"
          height="7"
          viewBox="0 0 8 8"
          aria-hidden
          className={glyph}
        >
          <path
            d="M1.5 1.5l5 5M6.5 1.5l-5 5"
            stroke="#4d0000"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <button
        type="button"
        onClick={onMinimize}
        aria-label={`Minimize ${title}`}
        title="Minimize"
        className={`${dot} bg-[#febc2e]`}
      >
        <svg
          width="7"
          height="7"
          viewBox="0 0 8 8"
          aria-hidden
          className={glyph}
        >
          <path
            d="M1.2 4h5.6"
            stroke="#5a3600"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {canMaximize ? (
        <button
          type="button"
          onClick={onToggleMaximize}
          aria-label={`${maximized ? "Restore" : "Zoom"} ${title}`}
          title={maximized ? "Restore" : "Zoom"}
          className={`${dot} bg-[#28c840]`}
        >
          <svg
            width="7"
            height="7"
            viewBox="0 0 8 8"
            aria-hidden
            className={glyph}
          >
            {maximized ? (
              <path
                d="M2.4 5.6h3.2v-3.2z M5.6 2.4H2.4v3.2z"
                fill="#0b3d12"
                opacity="0.9"
              />
            ) : (
              <path
                d="M1.6 3.1V1.6h1.5M6.4 4.9v1.5H4.9"
                stroke="#0b3d12"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            )}
          </svg>
        </button>
      ) : (
        // Keep the row width stable when zoom is unavailable.
        <span
          aria-hidden
          className="h-[12px] w-[12px] rounded-full bg-[var(--hairline)] opacity-50"
        />
      )}
    </div>
  );
}
