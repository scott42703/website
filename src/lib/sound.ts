"use client";

/**
 * Startup chime.
 *
 * A plain audio file rather than anything synthesised, so it can be swapped
 * by dropping a new file at this path, no code change required.
 *
 * The one shipped here is a 3-second slice of Scott's own track "ambient",
 * faded and level-matched. Using his own music sidesteps the stock-sound
 * problem entirely and is, conveniently, the only sound on the internet he
 * definitely has the rights to.
 */
import { assetPath } from "./asset";

export const STARTUP_SOUND_SRC = "/sounds/startup.mp3";

const VOLUME = 0.45;

let element: HTMLAudioElement | null = null;

function getElement(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (element) return element;
  try {
    element = new Audio(assetPath(STARTUP_SOUND_SRC));
    element.preload = "auto";
    element.volume = VOLUME;
  } catch {
    return null;
  }
  return element;
}

/**
 * Warm the file up so the chime is not late. Safe to call on mount: loading
 * audio is not playing it, and nothing is audible until playStartupChime.
 */
export function preloadStartupChime(): void {
  const el = getElement();
  try {
    el?.load();
  } catch {
    // Preloading is an optimisation, never a requirement.
  }
}

/** Only ever called from a real user gesture, which is what browsers require. */
export function playStartupChime(): void {
  const el = getElement();
  if (!el) return;
  try {
    el.currentTime = 0;
    // Older browsers return undefined rather than a promise.
    void el.play()?.catch(() => {
      // Blocked or unsupported, audio is decoration, never a blocker.
    });
  } catch {
    // Ignore.
  }
}
