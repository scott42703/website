"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AppId, FinderRoute } from "@/lib/apps";
import { useIsCompact } from "@/lib/hooks";
import { useDesktopPrefs, wallpapers } from "@/lib/theme";
import { useOpenApp } from "@/lib/use-open-app";
import { useWindows } from "@/lib/window-manager";
import { WindowManager } from "@/components/windows/WindowManager";
import { ContextMenu, type ContextAction } from "./ContextMenu";
import { DesktopIcon } from "./DesktopIcon";
import { desktopItems } from "./desktop-items";
import { Dock } from "./Dock";
import { MenuBar } from "./MenuBar";

export function Desktop({
  initialRoute,
  initialApp,
  onLogOut,
}: {
  initialRoute?: FinderRoute;
  initialApp?: AppId;
  onLogOut: () => void;
}) {
  const api = useWindows();
  const openApp = useOpenApp();
  const prefs = useDesktopPrefs();
  const compact = useIsCompact();
  const surfaceRef = useRef<HTMLDivElement>(null);

  const [selected, setSelected] = useState<string | null>(null);
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const bootedRef = useRef(false);

  // Keep the reducer's idea of the viewport in step with the real one.
  //
  // A ResizeObserver rather than just a resize listener: at mount the window
  // can still report 0×0 (a background tab, a not-yet-laid-out embed), and a
  // resize event never arrives to correct it, which would leave every window
  // sized to nothing. The observer fires as soon as layout actually happens.
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => {
      const width = window.innerWidth || root.clientWidth;
      const height = window.innerHeight || root.clientHeight;
      if (width > 0 && height > 0) api.setViewport(width, height);
    };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(root);
    window.addEventListener("resize", sync);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", sync);
    };
    // setViewport dispatches to a stable reducer, so this never needs to
    // re-subscribe, and re-subscribing on every window move would be wasteful.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Open the Portfolio window once, on first paint, at the requested route.
  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;
    openApp("portfolio", {
      route: initialRoute ?? { section: "home" },
    });
    // A direct link to /resume opens the document on top of the Finder.
    if (initialApp && initialApp !== "portfolio") openApp(initialApp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Global window shortcuts.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod || !api.focusedId) return;
      const key = e.key.toLowerCase();
      if (key === "w") {
        e.preventDefault();
        api.close(api.focusedId);
      } else if (key === "m") {
        e.preventDefault();
        api.minimize(api.focusedId);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [api]);

  const openItem = useCallback(
    (id: string) => {
      const item = desktopItems.find((i) => i.id === id);
      if (!item) return;
      openApp(item.app, item.route ? { route: item.route } : undefined);
    },
    [openApp],
  );

  const contextActions: ContextAction[] = [
    {
      label: "Open Portfolio",
      onSelect: () => openApp("portfolio", { route: { section: "home" } }),
    },
    { label: "Open Résumé", onSelect: () => openApp("resume") },
    { label: "", divider: true },
    { label: "Reset Window Positions", onSelect: api.resetPositions },
    { label: "Close All Windows", onSelect: api.closeAll },
    { label: "", divider: true },
    {
      label: "Show Desktop Icons",
      checked: prefs.showIcons,
      onSelect: prefs.toggleIcons,
    },
    {
      label: prefs.theme === "dark" ? "Light Mode" : "Dark Mode",
      onSelect: prefs.toggleTheme,
    },
    { label: "", divider: true },
    ...wallpapers.map((w) => ({
      label: w.name,
      checked: prefs.wallpaper === w.id,
      onSelect: () => prefs.setWallpaper(w.id),
    })),
  ];

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden">
      <span aria-hidden className="desk-wall" />

      <MenuBar
        onLogOut={() => {
          // Start the next session from a clean desktop.
          api.closeAll();
          onLogOut();
        }}
      />

      <main
        ref={surfaceRef}
        className="relative min-h-0 flex-1"
        onPointerDown={(e) => {
          if (e.target === surfaceRef.current) setSelected(null);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setSelected(null);
          setMenu({ x: e.clientX, y: e.clientY });
        }}
      >
        {prefs.showIcons && (
          <div
            className="pointer-events-none absolute inset-0 p-2 sm:p-3"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <ul
              aria-label="Desktop items"
              className="pointer-events-auto grid max-h-full grid-flow-row grid-cols-[repeat(auto-fill,minmax(92px,1fr))] content-start justify-items-center gap-y-1 sm:absolute sm:top-3 sm:right-3 sm:grid-flow-col sm:grid-cols-none sm:grid-rows-[repeat(auto-fill,minmax(96px,auto))] sm:justify-items-end sm:gap-x-1"
            >
              {desktopItems.map((item) => (
                <li key={item.id}>
                  <DesktopIcon
                    item={item}
                    selected={selected === item.id}
                    singleTapOpens={compact}
                    onSelect={() => setSelected(item.id)}
                    onOpen={() => openItem(item.id)}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      {/*
        Windows live in a fixed, viewport-sized layer so their x/y are true
        viewport coordinates, the same space the reducer clamps against.
        The layer ignores pointer events; each window opts back in.
      */}
      <div className="pointer-events-none fixed inset-0 z-[100]">
        <WindowManager />
      </div>

      <Dock />

      {menu && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          actions={contextActions}
          onClose={() => setMenu(null)}
        />
      )}
    </div>
  );
}
