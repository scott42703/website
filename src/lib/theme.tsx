"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useLocalState } from "./store";

export type Theme = "light" | "dark";

const STORAGE_KEY = "desk.theme";
const WALLPAPER_KEY = "desk.wallpaper";
const ICONS_KEY = "desk.showIcons";
const SOUND_KEY = "desk.sound";

export const wallpapers = [
  { id: "aurora", name: "Aurora" },
  { id: "dusk", name: "Dusk" },
  { id: "graphite", name: "Graphite" },
  { id: "tide", name: "Tide" },
] as const;

const WALLPAPER_IDS = wallpapers.map((w) => w.id) as readonly string[];

export type WallpaperId = (typeof wallpapers)[number]["id"];

/**
 * Runs before first paint so the desktop never flashes the wrong theme.
 * Kept as a string because it has to be inlined into <head>.
 */
const list = ["aurora", "dusk", "graphite", "tide"];

export const themeInitScript = `
(function(){
  try {
    var t = localStorage.getItem(${JSON.stringify(STORAGE_KEY)});
    var theme = t ? JSON.parse(t) : null;
    if (theme !== 'light' && theme !== 'dark') {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      localStorage.setItem(${JSON.stringify(STORAGE_KEY)}, JSON.stringify(theme));
    }
    document.documentElement.classList.toggle('theme-dark', theme === 'dark');
    var w = localStorage.getItem(${JSON.stringify(WALLPAPER_KEY)});
    var wall = w ? JSON.parse(w) : null;
    // A value stored before the wallpapers were renamed would match no rule
    // and leave a flat background, so fall back when it is unrecognised.
    if (${JSON.stringify(list)}.indexOf(wall) === -1) wall = 'aurora';
    document.documentElement.setAttribute('data-wallpaper', wall);
  } catch (e) {}
})();
`;

interface DesktopPrefs {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  wallpaper: WallpaperId;
  setWallpaper: (w: WallpaperId) => void;
  showIcons: boolean;
  toggleIcons: () => void;
  soundOn: boolean;
  toggleSound: () => void;
}

const PrefsContext = createContext<DesktopPrefs | null>(null);

export function DesktopPrefsProvider({ children }: { children: ReactNode }) {
  // The init script has already written a concrete theme to storage, so the
  // stored value is authoritative from the first client render onwards.
  const [theme, setThemeState] = useLocalState<Theme>(STORAGE_KEY, "light");
  const [storedWallpaper, setWallpaperState] = useLocalState<WallpaperId>(
    WALLPAPER_KEY,
    "aurora",
  );
  // Same guard as the pre-paint script, for the React side.
  const wallpaper: WallpaperId = WALLPAPER_IDS.includes(storedWallpaper)
    ? storedWallpaper
    : "aurora";
  const [showIcons, setShowIcons] = useLocalState<boolean>(ICONS_KEY, true);

  // Persisted, so muting sticks. The chime only ever plays in response to a
  // deliberate Log In, never on page load, so defaulting it on is safe.
  const [soundOn, setSoundOn] = useLocalState<boolean>(SOUND_KEY, true);

  // Mirror the two persisted display prefs onto <html> for the CSS to read.
  useEffect(() => {
    document.documentElement.classList.toggle("theme-dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-wallpaper", wallpaper);
  }, [wallpaper]);

  const setTheme = useCallback(
    (next: Theme) => setThemeState(next),
    [setThemeState],
  );

  const value = useMemo<DesktopPrefs>(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
      wallpaper,
      setWallpaper: setWallpaperState,
      showIcons,
      toggleIcons: () => setShowIcons((prev) => !prev),
      soundOn,
      toggleSound: () => setSoundOn(!soundOn),
    }),
    [
      theme,
      setTheme,
      wallpaper,
      setWallpaperState,
      showIcons,
      setShowIcons,
      soundOn,
      setSoundOn,
    ],
  );

  return (
    <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>
  );
}

export function useDesktopPrefs(): DesktopPrefs {
  const ctx = useContext(PrefsContext);
  if (!ctx) {
    throw new Error(
      "useDesktopPrefs must be used inside <DesktopPrefsProvider>",
    );
  }
  return ctx;
}
