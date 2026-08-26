"use client";

import { isCompactViewport, useWindows } from "@/lib/window-manager";
import { appRegistry } from "./registry";
import { Window } from "./Window";

/**
 * Renders every open window. The only place window content is mounted.
 *
 * Deliberately no AnimatePresence: closing unmounts immediately, the way a
 * real window manager behaves. An exit animation would also mean a window
 * whose animation cannot run (a background tab gets no animation frames)
 * stays in the DOM, still clickable, after being closed.
 */
export function WindowManager() {
  const { windows, focusedId, viewport } = useWindows();
  const compact = isCompactViewport(viewport);

  return (
    <>
      {windows.map((win) => {
        const { Component } = appRegistry[win.appId];
        return (
          <Window
            key={win.id}
            win={win}
            focused={focusedId === win.id}
            compact={compact}
          >
            <Component windowId={win.id} {...win.props} />
          </Window>
        );
      })}
    </>
  );
}
