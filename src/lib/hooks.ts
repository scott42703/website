"use client";

import { useEffect } from "react";
import { useLocalState, useMediaQuery, useMinuteBucket } from "./store";

export { useLocalState, useMediaQuery };

/** True on phones and small tablets, where dragging is disabled. */
export function useIsCompact(): boolean {
  return useMediaQuery("(max-width: 767px)");
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** Alias kept for readability at call sites that store a preference. */
export const useStoredState = useLocalState;

/**
 * Live clock in the visitor's own timezone. Empty strings until the client
 * has mounted, because the server has no idea where the visitor is.
 */
export function useClock(): { time: string; date: string; ready: boolean } {
  const bucket = useMinuteBucket();
  if (bucket === 0) return { time: "", date: "", ready: false };

  const now = new Date(bucket * 60_000);
  return {
    time: now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    date: now.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
    ready: true,
  };
}

/** Fires when a pointer press lands outside the given element, or on Escape. */
export function useDismissOnOutside(
  active: boolean,
  onDismiss: () => void,
  ref: React.RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!active) return;
    const onPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onDismiss();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [active, onDismiss, ref]);
}
