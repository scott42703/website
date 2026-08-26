"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Small external-store layer over localStorage, matchMedia and the clock.
 *
 * These are all client-only sources that do not exist during SSR, so they are
 * read through useSyncExternalStore rather than by setting state in an
 * effect: React renders the server snapshot during hydration and swaps in the
 * real value immediately afterwards, with no mismatch and no cascading render.
 */

type Listener = () => void;

const listeners = new Map<string, Set<Listener>>();

/** Cached parsed values, so getSnapshot stays referentially stable. */
const snapshots = new Map<string, { raw: string | null; value: unknown }>();

function subscribeKey(key: string, cb: Listener): () => void {
  let set = listeners.get(key);
  if (!set) {
    set = new Set();
    listeners.set(key, set);
  }
  set.add(cb);

  // Keep other tabs of the same portfolio in step.
  const onStorage = (e: StorageEvent) => {
    if (e.key === key) cb();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    set.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function notify(key: string) {
  listeners.get(key)?.forEach((cb) => cb());
}

function getLocalSnapshot<T>(key: string, fallback: T): T {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    // Storage blocked (private mode, embedded context), use the fallback.
  }

  const cached = snapshots.get(key);
  if (cached && cached.raw === raw) return cached.value as T;

  let value = fallback;
  if (raw !== null) {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      value = fallback;
    }
  }
  snapshots.set(key, { raw, value });
  return value;
}

export function writeLocal<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Not writable, hold the value in the snapshot cache anyway so the UI
    // still responds for the rest of the session.
  }
  snapshots.set(key, { raw: JSON.stringify(value), value });
  notify(key);
}

/**
 * localStorage-backed state. `fallback` must be a primitive or a stable
 * reference, it is returned as-is during server rendering.
 */
export function useLocalState<T>(
  key: string,
  fallback: T,
): [T, (next: T | ((prev: T) => T)) => void] {
  const value = useSyncExternalStore(
    useCallback((cb: Listener) => subscribeKey(key, cb), [key]),
    useCallback(() => getLocalSnapshot(key, fallback), [key, fallback]),
    useCallback(() => fallback, [fallback]),
  );

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved =
        typeof next === "function"
          ? (next as (prev: T) => T)(getLocalSnapshot(key, fallback))
          : next;
      writeLocal(key, resolved);
    },
    [key, fallback],
  );

  return [value, set];
}

/* ------------------------------------------------------------- matchMedia */

const mediaCache = new Map<string, MediaQueryList>();

function getMediaList(query: string): MediaQueryList {
  let mql = mediaCache.get(query);
  if (!mql) {
    mql = window.matchMedia(query);
    mediaCache.set(query, mql);
  }
  return mql;
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    useCallback(
      (cb: Listener) => {
        const mql = getMediaList(query);
        mql.addEventListener("change", cb);
        return () => mql.removeEventListener("change", cb);
      },
      [query],
    ),
    useCallback(() => getMediaList(query).matches, [query]),
    // The server has no viewport; assume the desktop layout and let the
    // client correct it on the first commit.
    () => false,
  );
}

/* ------------------------------------------------------------------ clock */

let minuteBucket = 0;
const clockListeners = new Set<Listener>();
let clockTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleTick() {
  // Fire just after each minute boundary rather than every second.
  const delay = 60_000 - (Date.now() % 60_000) + 30;
  clockTimer = setTimeout(() => {
    minuteBucket = Math.floor(Date.now() / 60_000);
    clockListeners.forEach((cb) => cb());
    scheduleTick();
  }, delay);
}

function subscribeClock(cb: Listener): () => void {
  if (clockListeners.size === 0) {
    minuteBucket = Math.floor(Date.now() / 60_000);
    scheduleTick();
  }
  clockListeners.add(cb);
  return () => {
    clockListeners.delete(cb);
    if (clockListeners.size === 0 && clockTimer) {
      clearTimeout(clockTimer);
      clockTimer = null;
    }
  };
}

/** Minutes since the epoch, or 0 before the clock has started. */
export function useMinuteBucket(): number {
  return useSyncExternalStore(
    subscribeClock,
    () => minuteBucket,
    () => 0,
  );
}

/* ---------------------------------------------------------------- session */

/**
 * A boolean that lives for one tab session. Used for the login gate, so a
 * reload or a deep link during the same visit does not ask again, but a new
 * visit gets the full startup.
 *
 * Read through useSyncExternalStore rather than an effect: the server
 * snapshot is always false, and React swaps in the real value as part of
 * hydration, so a returning visitor never sees the login screen flash.
 */
export function useSessionFlag(key: string): [boolean, (v: boolean) => void] {
  const value = useSyncExternalStore(
    useCallback((cb: Listener) => subscribeKey(key, cb), [key]),
    useCallback(() => {
      try {
        return window.sessionStorage.getItem(key) === "1";
      } catch {
        return false;
      }
    }, [key]),
    () => false,
  );

  const set = useCallback(
    (next: boolean) => {
      try {
        if (next) window.sessionStorage.setItem(key, "1");
        else window.sessionStorage.removeItem(key);
      } catch {
        // Storage unavailable, the flag just will not survive a reload.
      }
      notify(key);
    },
    [key],
  );

  return [value, set];
}

/* ------------------------------------------------- audio capability probe */

let volumeControlSupported: boolean | null = null;

/**
 * iOS refuses programmatic volume on media elements: the hardware buttons are
 * the only control. A feature probe rather than user-agent sniffing, which
 * also catches iPadOS (it reports itself as a Mac).
 */
function probeVolumeControl(): boolean {
  if (volumeControlSupported !== null) return volumeControlSupported;
  try {
    const el = new Audio();
    el.volume = 0.5;
    volumeControlSupported = el.volume === 0.5;
  } catch {
    volumeControlSupported = false;
  }
  return volumeControlSupported;
}

/** Stable no-op: the answer cannot change during a session. */
const noSubscribe = () => () => {};

export function useVolumeControlSupported(): boolean {
  return useSyncExternalStore(
    noSubscribe,
    probeVolumeControl,
    // Assume supported while rendering on the server, which is right for
    // every platform except iOS.
    () => true,
  );
}
