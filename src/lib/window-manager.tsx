"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { AppId } from "./apps";

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  /** Passed straight through to the window's content component. */
  props: Record<string, unknown>;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  /** Rect to restore to when un-maximizing. */
  restoreRect: Rect | null;
  resizable: boolean;
  /**
   * Maximized because the viewport is narrow rather than because the visitor
   * asked for it, so widening the window back out can undo it automatically.
   */
  autoMaximized: boolean;
  /**
   * The size this app wants, before being fitted to any particular viewport.
   * Restoring from an automatic full-screen goes back to this rather than to
   * whatever cramped rect the window happened to have on a phone.
   */
  naturalWidth: number;
  naturalHeight: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OpenOptions {
  appId: AppId;
  title: string;
  props?: Record<string, unknown>;
  width: number;
  height: number;
  resizable?: boolean;
  /** Only one instance may exist; opening again focuses and updates it. */
  singleton?: boolean;
  /** Open maximized (used on small screens). */
  maximized?: boolean;
}

interface State {
  windows: WindowState[];
  nextZ: number;
  /** Instance counter, so ids never collide after close/reopen. */
  seq: number;
  focusedId: string | null;
  /** Viewport the layout engine cascades and clamps against. */
  viewport: { width: number; height: number };
}

type Action =
  | { type: "open"; options: OpenOptions }
  | { type: "close"; id: string }
  | { type: "closeAll" }
  | { type: "focus"; id: string }
  | { type: "minimize"; id: string }
  | { type: "restore"; id: string }
  | { type: "toggleMaximize"; id: string }
  | { type: "move"; id: string; x: number; y: number }
  | { type: "resize"; id: string; width: number; height: number }
  | { type: "setProps"; id: string; props: Record<string, unknown> }
  | { type: "setTitle"; id: string; title: string }
  | { type: "resetPositions" }
  | { type: "viewport"; width: number; height: number };

export const MENUBAR_HEIGHT = 28;
/** Below this width windows are always full-screen and never draggable. */
export const COMPACT_BREAKPOINT = 768;
const DOCK_RESERVE = 96;
/** Keep at least this much title bar on screen so a window is never lost. */
const MIN_VISIBLE = 96;
const CASCADE_STEP = 26;

function clampPosition(
  x: number,
  y: number,
  width: number,
  viewport: { width: number; height: number },
): { x: number; y: number } {
  const maxX = viewport.width - MIN_VISIBLE;
  const minX = MIN_VISIBLE - width;
  const maxY = viewport.height - MIN_VISIBLE;
  return {
    x: Math.min(Math.max(x, minX), maxX),
    y: Math.min(Math.max(y, MENUBAR_HEIGHT), Math.max(maxY, MENUBAR_HEIGHT)),
  };
}

function fitSize(
  width: number,
  height: number,
  viewport: { width: number; height: number },
) {
  const available = viewport.height - MENUBAR_HEIGHT - 24;
  return {
    width: Math.min(width, Math.max(320, viewport.width - 32)),
    height: Math.min(height, Math.max(280, available)),
  };
}

export function isCompactViewport(viewport: { width: number }): boolean {
  return viewport.width < COMPACT_BREAKPOINT;
}

function maximizedRect(viewport: { width: number; height: number }): Rect {
  const isCompact = isCompactViewport(viewport);
  const margin = isCompact ? 0 : 12;
  const bottom = isCompact ? DOCK_RESERVE - 24 : DOCK_RESERVE;
  return {
    x: margin,
    y: MENUBAR_HEIGHT + margin,
    width: viewport.width - margin * 2,
    height: viewport.height - MENUBAR_HEIGHT - margin - bottom,
  };
}

/** Where a window sits when nothing better is known: slightly left of centre. */
function defaultOrigin(
  viewport: { width: number; height: number },
  size: { width: number; height: number },
  step = 0,
): { x: number; y: number } {
  const baseX = Math.max(
    16,
    Math.round((viewport.width - size.width) / 2) - 60,
  );
  return clampPosition(
    baseX + step * CASCADE_STEP,
    MENUBAR_HEIGHT + 24 + step * CASCADE_STEP,
    size.width,
    viewport,
  );
}

/** Cascade new windows off the last one so they never stack exactly. */
function nextOrigin(
  state: State,
  size: { width: number; height: number },
): { x: number; y: number } {
  return defaultOrigin(state.viewport, size, state.windows.length % 6);
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "viewport": {
      // A zero-sized viewport would collapse every window to nothing. Keep
      // the last known-good size instead.
      if (action.width <= 0 || action.height <= 0) return state;

      const viewport = { width: action.width, height: action.height };
      const compact = isCompactViewport(viewport);

      // Re-clamp everything so a resize can never orphan a window.
      const windows = state.windows.map((w) => {
        // Narrow viewports are always full-screen.
        if (compact) {
          return {
            ...w,
            maximized: true,
            autoMaximized: true,
            restoreRect:
              w.restoreRect ??
              (w.maximized
                ? null
                : { x: w.x, y: w.y, width: w.width, height: w.height }),
            ...maximizedRect(viewport),
          };
        }

        // Coming back to a wide viewport undoes only the automatic ones, and
        // does it at the app's natural size rather than the phone-sized rect
        // the window was squeezed into.
        if (w.autoMaximized) {
          const size = fitSize(w.naturalWidth, w.naturalHeight, viewport);
          return {
            ...w,
            maximized: false,
            autoMaximized: false,
            restoreRect: null,
            ...size,
            ...defaultOrigin(viewport, size),
          };
        }

        if (w.maximized) return { ...w, ...maximizedRect(viewport) };

        const size = fitSize(w.width, w.height, viewport);
        const pos = clampPosition(w.x, w.y, size.width, viewport);
        return { ...w, ...size, ...pos };
      });

      return { ...state, viewport, windows };
    }

    case "open": {
      const { options } = action;
      const existing = options.singleton
        ? state.windows.find((w) => w.appId === options.appId)
        : undefined;

      if (existing) {
        const z = state.nextZ + 1;
        return {
          ...state,
          nextZ: z,
          focusedId: existing.id,
          windows: state.windows.map((w) =>
            w.id === existing.id
              ? {
                  ...w,
                  zIndex: z,
                  minimized: false,
                  props: { ...w.props, ...(options.props ?? {}) },
                  title: options.title || w.title,
                }
              : w,
          ),
        };
      }

      const size = fitSize(options.width, options.height, state.viewport);
      const origin = nextOrigin(state, size);
      const z = state.nextZ + 1;
      const seq = state.seq + 1;
      const id = `${options.appId}-${seq}`;
      // A narrow viewport always opens full-screen, whatever the caller asked.
      const autoMaximized = isCompactViewport(state.viewport);
      const shouldMaximize = autoMaximized || (options.maximized ?? false);

      const win: WindowState = {
        id,
        appId: options.appId,
        title: options.title,
        props: options.props ?? {},
        ...size,
        ...origin,
        zIndex: z,
        minimized: false,
        maximized: shouldMaximize,
        autoMaximized,
        restoreRect: shouldMaximize ? { ...size, ...origin } : null,
        resizable: options.resizable ?? true,
        naturalWidth: options.width,
        naturalHeight: options.height,
        ...(shouldMaximize ? maximizedRect(state.viewport) : {}),
      };

      return {
        ...state,
        seq,
        nextZ: z,
        focusedId: id,
        windows: [...state.windows, win],
      };
    }

    case "close": {
      const windows = state.windows.filter((w) => w.id !== action.id);
      const focusedId =
        state.focusedId === action.id ? topmostId(windows) : state.focusedId;
      return { ...state, windows, focusedId };
    }

    case "closeAll":
      return { ...state, windows: [], focusedId: null };

    case "focus": {
      const target = state.windows.find((w) => w.id === action.id);
      if (!target) return state;
      if (state.focusedId === action.id && !target.minimized) return state;
      const z = state.nextZ + 1;
      return {
        ...state,
        nextZ: z,
        focusedId: action.id,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, zIndex: z, minimized: false } : w,
        ),
      };
    }

    case "minimize": {
      const windows = state.windows.map((w) =>
        w.id === action.id ? { ...w, minimized: true } : w,
      );
      return {
        ...state,
        windows,
        focusedId: topmostId(windows.filter((w) => !w.minimized)),
      };
    }

    case "restore": {
      const z = state.nextZ + 1;
      return {
        ...state,
        nextZ: z,
        focusedId: action.id,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, minimized: false, zIndex: z } : w,
        ),
      };
    }

    case "toggleMaximize": {
      // No zoom control exists on a narrow viewport; ignore it there.
      if (isCompactViewport(state.viewport)) return state;
      return {
        ...state,
        windows: state.windows.map((w) => {
          if (w.id !== action.id) return w;
          if (w.maximized) {
            const r = w.restoreRect ?? {
              x: w.x,
              y: w.y,
              width: w.width,
              height: w.height,
            };
            const size = fitSize(r.width, r.height, state.viewport);
            const pos = clampPosition(r.x, r.y, size.width, state.viewport);
            return {
              ...w,
              maximized: false,
              autoMaximized: false,
              ...size,
              ...pos,
            };
          }
          return {
            ...w,
            maximized: true,
            autoMaximized: false,
            restoreRect: {
              x: w.x,
              y: w.y,
              width: w.width,
              height: w.height,
            },
            ...maximizedRect(state.viewport),
          };
        }),
      };
    }

    case "move": {
      const target = state.windows.find((w) => w.id === action.id);
      if (!target) return state;
      const pos = clampPosition(
        action.x,
        action.y,
        target.width,
        state.viewport,
      );
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, ...pos } : w,
        ),
      };
    }

    case "resize": {
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id
            ? {
                ...w,
                width: Math.max(
                  320,
                  Math.min(action.width, state.viewport.width - w.x - 8),
                ),
                height: Math.max(
                  220,
                  Math.min(action.height, state.viewport.height - w.y - 8),
                ),
              }
            : w,
        ),
      };
    }

    case "setProps":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id
            ? { ...w, props: { ...w.props, ...action.props } }
            : w,
        ),
      };

    case "setTitle":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, title: action.title } : w,
        ),
      };

    case "resetPositions": {
      let i = 0;
      const compact = isCompactViewport(state.viewport);
      return {
        ...state,
        windows: state.windows.map((w) => {
          if (compact) {
            return { ...w, minimized: false, ...maximizedRect(state.viewport) };
          }
          const size = fitSize(w.naturalWidth, w.naturalHeight, state.viewport);
          const pos = defaultOrigin(state.viewport, size, i++ % 6);
          return {
            ...w,
            ...size,
            ...pos,
            minimized: false,
            maximized: false,
            autoMaximized: false,
          };
        }),
      };
    }

    default:
      return state;
  }
}

function topmostId(windows: WindowState[]): string | null {
  if (windows.length === 0) return null;
  return windows.reduce((a, b) => (a.zIndex > b.zIndex ? a : b)).id;
}

interface WindowApi {
  windows: WindowState[];
  focusedId: string | null;
  viewport: { width: number; height: number };
  open: (options: OpenOptions) => void;
  close: (id: string) => void;
  closeAll: () => void;
  focus: (id: string) => void;
  minimize: (id: string) => void;
  restore: (id: string) => void;
  toggleMaximize: (id: string) => void;
  move: (id: string, x: number, y: number) => void;
  resize: (id: string, width: number, height: number) => void;
  setProps: (id: string, props: Record<string, unknown>) => void;
  resetPositions: () => void;
  setViewport: (width: number, height: number) => void;
}

const WindowContext = createContext<WindowApi | null>(null);

export function WindowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    windows: [],
    nextZ: 10,
    seq: 0,
    focusedId: null,
    // Deterministic on the server; corrected on mount by setViewport.
    viewport: { width: 1440, height: 900 },
  });

  const api = useMemo<WindowApi>(
    () => ({
      windows: state.windows,
      focusedId: state.focusedId,
      viewport: state.viewport,
      open: (options) => dispatch({ type: "open", options }),
      close: (id) => dispatch({ type: "close", id }),
      closeAll: () => dispatch({ type: "closeAll" }),
      focus: (id) => dispatch({ type: "focus", id }),
      minimize: (id) => dispatch({ type: "minimize", id }),
      restore: (id) => dispatch({ type: "restore", id }),
      toggleMaximize: (id) => dispatch({ type: "toggleMaximize", id }),
      move: (id, x, y) => dispatch({ type: "move", id, x, y }),
      resize: (id, width, height) =>
        dispatch({ type: "resize", id, width, height }),
      setProps: (id, props) => dispatch({ type: "setProps", id, props }),
      resetPositions: () => dispatch({ type: "resetPositions" }),
      setViewport: (width, height) =>
        dispatch({ type: "viewport", width, height }),
    }),
    [state.windows, state.focusedId, state.viewport],
  );

  return (
    <WindowContext.Provider value={api}>{children}</WindowContext.Provider>
  );
}

export function useWindows(): WindowApi {
  const ctx = useContext(WindowContext);
  if (!ctx) {
    throw new Error("useWindows must be used inside <WindowProvider>");
  }
  return ctx;
}

/** Convenience for the window content components. */
export function useWindowSelf(id: string) {
  const api = useWindows();
  const self = api.windows.find((w) => w.id === id);
  const setProps = useCallback(
    (props: Record<string, unknown>) => api.setProps(id, props),
    [api, id],
  );
  return { self, setProps, close: () => api.close(id) };
}
