"use client";

import { useRef } from "react";
import type { DesktopItem } from "./desktop-items";

interface Props {
  item: DesktopItem;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
  /** Touch devices open on a single tap, double-tap is not discoverable. */
  singleTapOpens: boolean;
}

export function DesktopIcon({
  item,
  selected,
  onSelect,
  onOpen,
  singleTapOpens,
}: Props) {
  const lastTap = useRef(0);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (singleTapOpens) {
      onSelect();
      onOpen();
      return;
    }
    onSelect();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
          onOpen();
        }
      }}
      onTouchEnd={() => {
        // Belt and braces for touch devices that still emit dblclick oddly.
        const now = Date.now();
        if (!singleTapOpens && now - lastTap.current < 320) onOpen();
        lastTap.current = now;
      }}
      aria-label={`${item.label}. ${item.hint}`}
      title={item.hint}
      className="group flex w-[92px] flex-col items-center gap-1 rounded-[3px] p-1.5 text-center outline-offset-2 sm:w-[104px]"
    >
      <span
        className={`grid place-items-center rounded-[3px] p-1 transition-[background-color,transform] duration-100 ${
          selected
            ? "bg-[var(--highlight)]/85"
            : "group-hover:bg-white/12 group-active:scale-95"
        }`}
      >
        {item.glyph}
      </span>

      <span
        className={`label-micro max-w-full px-1 py-[2px] text-[10px] leading-[1.35] break-words hyphens-auto ${
          selected
            ? "bg-[var(--highlight)] text-[var(--highlight-ink)]"
            : // A translucent chip, so the label stays legible on light
              // wallpapers as well as dark ones.
              "bg-black/45 text-white text-shadow-crisp"
        }`}
      >
        {item.label}
      </span>
    </button>
  );
}
