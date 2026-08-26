"use client";

import { useCallback } from "react";
import type { AppId } from "./apps";
import { useWindows } from "./window-manager";
import { appRegistry } from "@/components/windows/registry";

/**
 * Opens an app using its registry defaults.
 *
 * Whether a window ends up full-screen is decided by the window manager from
 * the current viewport, not here, that keeps one source of truth and avoids
 * depending on a media-query hook that has not settled yet at first paint.
 */
export function useOpenApp() {
  const api = useWindows();

  return useCallback(
    (appId: AppId, props?: Record<string, unknown>, titleOverride?: string) => {
      const def = appRegistry[appId];
      api.open({
        appId,
        title: titleOverride ?? def.title,
        props,
        width: def.width,
        height: def.height,
        resizable: def.resizable,
        singleton: def.singleton,
      });
    },
    [api],
  );
}
