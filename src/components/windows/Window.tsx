"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useRef, type ReactNode } from "react";
import { useWindows, type WindowState } from "@/lib/window-manager";
import { ResizeGripIcon } from "@/components/ui/icons";
import { WindowControls } from "./WindowControls";

interface Props {
  win: WindowState;
  focused: boolean;
  compact: boolean;
  children: ReactNode;
}

const MIN_W = 320;
const MIN_H = 240;

/**
 * The one window shell every app renders inside. Drag and resize are applied
 * straight to the DOM node while the pointer is down and committed to the
 * reducer on release, so a drag costs zero React renders.
 */
export function Window({ win, focused, compact, children }: Props) {
  const api = useWindows();
  const reduceMotion = useReducedMotion();
  const nodeRef = useRef<HTMLDivElement>(null);
  const gesture = useRef<{
    mode: "move" | "resize";
    pointerId: number;
    startX: number;
    startY: number;
  } | null>(null);

  const draggable = !compact && !win.maximized;
  const resizable = !compact && !win.maximized && win.resizable;

  const endGesture = useCallback(
    (e: React.PointerEvent) => {
      const g = gesture.current;
      const node = nodeRef.current;
      if (!g || !node) return;

      const dx = e.clientX - g.startX;
      const dy = e.clientY - g.startY;

      if (g.mode === "move") {
        node.style.transform = "";
        api.move(win.id, win.x + dx, win.y + dy);
      } else {
        node.style.width = "";
        node.style.height = "";
        api.resize(
          win.id,
          Math.max(MIN_W, win.width + dx),
          Math.max(MIN_H, win.height + dy),
        );
      }

      gesture.current = null;
      document.body.classList.remove("is-dragging");
      try {
        e.currentTarget.releasePointerCapture(g.pointerId);
      } catch {
        // Capture may already have been released.
      }
    },
    [api, win.id, win.x, win.y, win.width, win.height],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const g = gesture.current;
      const node = nodeRef.current;
      if (!g || !node) return;
      const dx = e.clientX - g.startX;
      const dy = e.clientY - g.startY;
      if (g.mode === "move") {
        node.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      } else {
        node.style.width = `${Math.max(MIN_W, win.width + dx)}px`;
        node.style.height = `${Math.max(MIN_H, win.height + dy)}px`;
      }
    },
    [win.width, win.height],
  );

  const startGesture = useCallback(
    (mode: "move" | "resize", e: React.PointerEvent) => {
      if (e.button !== 0) return;
      if (mode === "move" && !draggable) return;
      if (mode === "resize" && !resizable) return;
      e.preventDefault();
      api.focus(win.id);
      gesture.current = {
        mode,
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
      };
      document.body.classList.add("is-dragging");
      // Capture on the handler's own element, not on whichever child was
      // pressed, so every move event lands back here for the whole gesture.
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [api, win.id, draggable, resizable],
  );

  const onMoveStart = useCallback(
    (e: React.PointerEvent) => startGesture("move", e),
    [startGesture],
  );
  const onResizeStart = useCallback(
    (e: React.PointerEvent) => startGesture("resize", e),
    [startGesture],
  );

  /** Arrow-key nudging so a window can be repositioned without a pointer. */
  const onTitleKeyDown = (e: React.KeyboardEvent) => {
    if (!draggable) return;
    const step = e.shiftKey ? 24 : 8;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const delta = moves[e.key];
    if (!delta) return;
    e.preventDefault();
    api.move(win.id, win.x + delta[0], win.y + delta[1]);
  };

  const titleId = `${win.id}-title`;

  // A hidden tab gets no animation frames, so an opacity-0 entrance would
  // leave the window invisible until the visitor switches to it. Windows are
  // only ever mounted on the client, so reading visibilityState here is safe.
  const canAnimateIn =
    typeof document === "undefined" || document.visibilityState === "visible";
  const enterFrom =
    reduceMotion || !canAnimateIn ? false : { opacity: 0, scale: 0.97 };

  return (
    <motion.div
      ref={nodeRef}
      role="dialog"
      aria-labelledby={titleId}
      aria-hidden={win.minimized || undefined}
      inert={win.minimized}
      initial={enterFrom}
      animate={{
        opacity: win.minimized ? 0 : 1,
        scale: win.minimized ? 0.85 : 1,
        y: win.minimized ? 48 : 0,
      }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 520, damping: 38, mass: 0.7 }
      }
      style={{
        position: "absolute",
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
        pointerEvents: win.minimized ? "none" : "auto",
        transformOrigin: "50% 100%",
      }}
      className={`flex flex-col overflow-hidden rounded-[var(--radius-window)] bg-[var(--window)] ${
        focused
          ? "shadow-[var(--shadow-window)]"
          : "shadow-[var(--shadow-window-idle)]"
      }`}
      onPointerDownCapture={() => {
        if (!focused) api.focus(win.id);
      }}
    >
      {/* Title bar, lights on the left, title centred, as on a Mac. */}
      <div
        className={`relative flex h-[38px] shrink-0 items-center gap-2 px-3 hairline-b ${
          draggable ? "cursor-default" : ""
        } bg-[var(--titlebar)] ${focused ? "" : "opacity-95"}`}
        onPointerDown={onMoveStart}
        onPointerMove={onPointerMove}
        onPointerUp={endGesture}
        onPointerCancel={endGesture}
        onDoubleClick={() => win.resizable && api.toggleMaximize(win.id)}
        // Without this a touch drag scrolls the page instead of moving the
        // window on any touch device wide enough to allow dragging.
        style={draggable ? { touchAction: "none" } : undefined}
      >
        <div
          className="relative z-10 flex items-center"
          onPointerDown={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
        >
          <WindowControls
            title={win.title}
            maximized={win.maximized}
            canMaximize={win.resizable && !compact}
            onMinimize={() => api.minimize(win.id)}
            onToggleMaximize={() => api.toggleMaximize(win.id)}
            onClose={() => api.close(win.id)}
          />
        </div>

        {/* Centred over the full bar, so the lights do not shift it. */}
        <h2
          id={titleId}
          tabIndex={draggable ? 0 : -1}
          onKeyDown={onTitleKeyDown}
          aria-describedby={draggable ? `${win.id}-draghint` : undefined}
          className={`pointer-events-none absolute inset-x-0 mx-auto max-w-[60%] truncate text-center text-[13px] font-semibold tracking-[-0.01em] ${
            focused ? "text-[var(--ink)]" : "text-[var(--ink-faint)]"
          }`}
        >
          {win.title}
        </h2>
        {draggable && (
          <span id={`${win.id}-draghint`} className="sr-only-block">
            Drag to move, or press the arrow keys to reposition this window.
          </span>
        )}
      </div>

      {/* Content */}
      <div className="relative flex min-h-0 flex-1 flex-col bg-[var(--window)] text-[var(--ink)]">
        {children}
      </div>

      {resizable && (
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label={`Resize ${win.title}`}
          className="absolute right-0 bottom-0 z-20 h-4 w-4 cursor-nwse-resize opacity-0 transition-opacity hover:opacity-100"
          style={{ touchAction: "none" }}
          onPointerDown={onResizeStart}
          onPointerMove={onPointerMove}
          onPointerUp={endGesture}
          onPointerCancel={endGesture}
        >
          <ResizeGripIcon size={16} />
        </div>
      )}
    </motion.div>
  );
}
