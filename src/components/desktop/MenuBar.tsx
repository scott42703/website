"use client";

import { useCallback, useRef, useState } from "react";
import { personal } from "@/data/personal";
import type { SectionId } from "@/data/types";
import { useClock, useDismissOnOutside } from "@/lib/hooks";
import { useDesktopPrefs, wallpapers } from "@/lib/theme";
import { useOpenApp } from "@/lib/use-open-app";
import { useWindows } from "@/lib/window-manager";
import {
  ComputerGlyph,
  MoonIcon,
  SpeakerIcon,
  SunIcon,
  WifiIcon,
} from "@/components/ui/icons";

interface MenuItem {
  label: string;
  onSelect?: () => void;
  shortcut?: string;
  divider?: boolean;
  checked?: boolean;
  disabled?: boolean;
}

interface Menu {
  id: string;
  label: string;
  /** Rendered in the bold "apple-position" slot at the far left. */
  emphasis?: boolean;
  items: MenuItem[];
}

export function MenuBar({ onLogOut }: { onLogOut: () => void }) {
  const [open, setOpen] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const openApp = useOpenApp();
  const api = useWindows();
  const prefs = useDesktopPrefs();
  const clock = useClock();

  const close = useCallback(() => setOpen(null), []);
  useDismissOnOutside(open !== null, close, barRef);

  const go = (section: SectionId) =>
    openApp("portfolio", { route: { section } });

  const menus: Menu[] = [
    {
      id: "system",
      label: personal.name,
      emphasis: true,
      items: [
        {
          label: "About This Computer",
          onSelect: () => openApp("about-computer"),
        },
        { label: "", divider: true },
        { label: "Music", onSelect: () => openApp("music") },
        { label: "Notes", onSelect: () => openApp("notes") },
        { label: "Terminal", onSelect: () => openApp("terminal") },
      ],
    },
    {
      id: "file",
      label: "File",
      items: [
        {
          label: "Open Portfolio",
          onSelect: () => openApp("portfolio", { route: { section: "home" } }),
        },
        { label: "Open Résumé", onSelect: () => openApp("resume") },
        { label: "Open Music", onSelect: () => openApp("music") },
        { label: "Contact Me", onSelect: () => openApp("contact") },
        { label: "", divider: true },
        {
          label: "Close Window",
          shortcut: "⌘W",
          disabled: !api.focusedId,
          onSelect: () => api.focusedId && api.close(api.focusedId),
        },
        { label: "", divider: true },
        { label: "Log Out", onSelect: onLogOut },
      ],
    },
    {
      id: "edit",
      label: "Edit",
      items: [
        {
          label: "Copy Email Address",
          onSelect: () => {
            navigator.clipboard?.writeText(personal.email).catch(() => {});
          },
        },
        {
          label: "Search Portfolio",
          onSelect: () => openApp("portfolio", { route: { section: "home" } }),
        },
        { label: "", divider: true },
        { label: "Scratch Notes", onSelect: () => openApp("notes") },
      ],
    },
    {
      id: "view",
      label: "View",
      items: [
        { label: "Reset Window Positions", onSelect: api.resetPositions },
        {
          label: "Close All Windows",
          disabled: api.windows.length === 0,
          onSelect: api.closeAll,
        },
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
          label: `Wallpaper: ${w.name}`,
          checked: prefs.wallpaper === w.id,
          onSelect: () => prefs.setWallpaper(w.id),
        })),
      ],
    },
    {
      id: "go",
      label: "Go",
      items: [
        { label: "About", onSelect: () => go("about") },
        { label: "Experience", onSelect: () => go("experience") },
        { label: "Projects", onSelect: () => go("projects") },
        { label: "Research", onSelect: () => go("research") },
        { label: "Education", onSelect: () => go("education") },
        { label: "Certifications", onSelect: () => go("certifications") },
        { label: "Skills", onSelect: () => go("skills") },
        { label: "Contact", onSelect: () => go("contact") },
      ],
    },
    {
      id: "help",
      label: "Help",
      items: [
        {
          label: "About This Portfolio",
          onSelect: () => openApp("about-portfolio"),
        },
        { label: "Keyboard Shortcuts", onSelect: () => openApp("shortcuts") },
      ],
    },
  ];

  return (
    <div
      ref={barRef}
      className="material-bar backdrop-blur-[20px] backdrop-saturate-[180%] hairline-b relative z-[9000] flex h-[28px] shrink-0 items-center justify-between pr-2.5 pl-2 select-none"
    >
      <nav aria-label="Main menu" className="flex min-w-0 items-center">
        <span className="mr-1 grid h-[22px] w-[22px] shrink-0 place-items-center text-[var(--menubar-ink)]">
          <ComputerGlyph size={15} />
        </span>

        {menus.map((menu) => (
          <MenuButton
            key={menu.id}
            menu={menu}
            open={open === menu.id}
            onOpen={() => setOpen(menu.id)}
            onHover={() => open !== null && setOpen(menu.id)}
            onClose={close}
          />
        ))}
      </nav>

      <div className="flex shrink-0 items-center gap-0.5">
        <IconToggle
          label={prefs.soundOn ? "Mute startup sound" : "Unmute startup sound"}
          onClick={prefs.toggleSound}
        >
          <SpeakerIcon size={14} muted={!prefs.soundOn} />
        </IconToggle>

        <span
          className="hidden h-[22px] w-[22px] place-items-center text-[var(--menubar-ink)] sm:grid"
          title="Connected"
          role="img"
          aria-label="Network connected"
        >
          <WifiIcon size={14} />
        </span>

        <IconToggle
          label={`Switch to ${prefs.theme === "dark" ? "light" : "dark"} mode`}
          onClick={prefs.toggleTheme}
        >
          {prefs.theme === "dark" ? (
            <SunIcon size={14} />
          ) : (
            <MoonIcon size={14} />
          )}
        </IconToggle>

        <span
          className="ml-2 hidden text-[13px] tracking-[-0.01em] text-[var(--menubar-ink)] sm:inline"
          suppressHydrationWarning
        >
          {clock.date}
        </span>
        <span
          className="tabular ml-2 min-w-[58px] text-right text-[13px] tracking-[-0.01em] text-[var(--menubar-ink)]"
          suppressHydrationWarning
        >
          {/* Empty until mounted, the server has no visitor timezone. */}
          {clock.ready ? clock.time : ""}
        </span>
      </div>
    </div>
  );
}

function MenuButton({
  menu,
  open,
  onOpen,
  onHover,
  onClose,
}: {
  menu: Menu;
  open: boolean;
  onOpen: () => void;
  onHover: () => void;
  onClose: () => void;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => (open ? onClose() : onOpen())}
        onPointerEnter={onHover}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`h-[20px] max-w-[150px] truncate rounded-[5px] px-2 text-[13px] leading-none tracking-[-0.01em] transition-colors ${
          open
            ? "bg-[var(--accent)] text-[var(--accent-ink)]"
            : "text-[var(--menubar-ink)] hover:bg-[color-mix(in_srgb,var(--ink)_10%,transparent)]"
        } ${menu.emphasis ? "font-semibold" : "font-normal"}`}
      >
        {menu.label}
      </button>

      {open && (
        <ul
          role="menu"
          aria-label={menu.label}
          className="material-bar backdrop-blur-[20px] backdrop-saturate-[180%] absolute top-full left-0 z-50 mt-1 min-w-[220px] rounded-[8px] p-1 shadow-[var(--shadow-menu)]"
        >
          {menu.items.map((item, i) =>
            item.divider ? (
              <li
                key={`div-${i}`}
                role="separator"
                className="mx-2 my-1 h-px bg-[var(--hairline)]"
              />
            ) : (
              <li key={item.label} role="none">
                <button
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  onClick={() => {
                    item.onSelect?.();
                    onClose();
                  }}
                  className="flex w-full items-center gap-2 rounded-[5px] px-2 py-[5px] text-left text-[13px] text-[var(--ink)] disabled:text-[var(--ink-faint)] disabled:opacity-50 enabled:hover:bg-[var(--accent)] enabled:hover:text-[var(--accent-ink)]"
                >
                  <span aria-hidden className="w-3 shrink-0 text-[11px]">
                    {item.checked ? "✓" : ""}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  {item.shortcut && (
                    <span className="shrink-0 text-[11px] opacity-70">
                      {item.shortcut}
                    </span>
                  )}
                </button>
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
}

function IconToggle({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid h-[22px] w-[22px] place-items-center rounded-[5px] text-[var(--menubar-ink)] transition-colors hover:bg-[color-mix(in_srgb,var(--ink)_10%,transparent)]"
    >
      {children}
    </button>
  );
}
