"use client";

/**
 * Thin wrapper over SoundCloud's Widget API.
 *
 * An embed is a cross-origin iframe, so the page cannot touch its volume
 * directly. The widget API is the supported way in, and it is loaded lazily:
 * nothing is fetched from SoundCloud until a visitor actually opens a track
 * that needs it.
 */

export interface SoundCloudWidget {
  bind(event: string, listener: () => void): void;
  unbind(event: string): void;
  setVolume(percent: number): void;
  play(): void;
  pause(): void;
}

interface SoundCloudApi {
  Widget: ((iframe: HTMLIFrameElement) => SoundCloudWidget) & {
    Events?: Record<string, string>;
  };
}

declare global {
  interface Window {
    SC?: SoundCloudApi;
  }
}

const API_SRC = "https://w.soundcloud.com/player/api.js";

let pending: Promise<SoundCloudApi | null> | null = null;

export function loadSoundCloudApi(): Promise<SoundCloudApi | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.SC) return Promise.resolve(window.SC);
  if (pending) return pending;

  pending = new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${API_SRC}"]`,
    );
    const script = existing ?? document.createElement("script");

    const done = () => resolve(window.SC ?? null);
    script.addEventListener("load", done, { once: true });
    // A blocked or failed script must not leave callers hanging forever.
    script.addEventListener("error", () => resolve(null), { once: true });

    if (!existing) {
      script.src = API_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
  });

  return pending;
}

/** The widget reports volume on a 0 to 100 scale. */
export function widgetVolume(volume: number): number {
  return Math.round(Math.max(0, Math.min(1, volume)) * 100);
}

export const READY_EVENT = "ready";

/** Widget event names, used when SC.Widget.Events is unavailable. */
export const PLAY_EVENT = "play";
