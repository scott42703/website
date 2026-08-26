"use client";

import { useEffect } from "react";
import type { AppId, FinderRoute } from "@/lib/apps";
import { useSessionFlag } from "@/lib/store";
import { MusicProvider } from "@/lib/music-player";
import { DesktopPrefsProvider } from "@/lib/theme";
import { WindowProvider } from "@/lib/window-manager";
import { Desktop } from "./Desktop";
import { LoginScreen } from "./LoginScreen";

const SESSION_KEY = "desk.session";

/**
 * Client boundary for the whole desktop. Everything above this is server
 * rendered, so the crawler-visible content in page.tsx costs no JavaScript.
 *
 * The login gate is scoped to the tab session: a first visit gets the startup
 * screen, but reloading or following a deep link during the same visit goes
 * straight through.
 */
export function DesktopShell({
  initialRoute,
  initialApp,
}: {
  initialRoute?: FinderRoute;
  initialApp?: AppId;
}) {
  const [loggedIn, setLoggedIn] = useSessionFlag(SESSION_KEY);

  // The desktop owns the viewport; make sure nothing behind it scrolls.
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <DesktopPrefsProvider>
      <WindowProvider>
        <MusicProvider>
          {loggedIn ? (
            <Desktop
              initialRoute={initialRoute}
              initialApp={initialApp}
              onLogOut={() => setLoggedIn(false)}
            />
          ) : (
            <LoginScreen onLogin={() => setLoggedIn(true)} />
          )}
        </MusicProvider>
      </WindowProvider>
    </DesktopPrefsProvider>
  );
}
