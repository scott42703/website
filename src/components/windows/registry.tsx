"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { AppId } from "@/lib/apps";
import { FinderWindow } from "./FinderWindow";

export type WindowComponentProps = { windowId: string } & Record<
  string,
  unknown
>;

export interface AppDefinition {
  title: string;
  width: number;
  height: number;
  resizable: boolean;
  /** Only one instance of this app may exist at a time. */
  singleton: boolean;
  Component: ComponentType<WindowComponentProps>;
}

/** Small windows load on demand, they are not part of the first paint. */
const lazyWindow = (
  loader: () => Promise<{ default: ComponentType<WindowComponentProps> }>,
) =>
  dynamic(loader, {
    loading: () => (
      <div className="flex flex-1 items-center justify-center text-[12px] text-[var(--ink-faint)]">
        Loading…
      </div>
    ),
  });

const ResumeWindow = lazyWindow(() =>
  import("@/components/portfolio/Resume").then((m) => ({ default: m.Resume })),
);
const ContactWindow = lazyWindow(() =>
  import("@/components/portfolio/Contact").then((m) => ({
    default: m.ContactWindow,
  })),
);
const TrashWindow = lazyWindow(() =>
  import("@/components/portfolio/Trash").then((m) => ({ default: m.Trash })),
);
const AboutComputerWindow = lazyWindow(() =>
  import("@/components/portfolio/AboutThisComputer").then((m) => ({
    default: m.AboutThisComputer,
  })),
);
const AboutPortfolioWindow = lazyWindow(() =>
  import("@/components/portfolio/AboutThisPortfolio").then((m) => ({
    default: m.AboutThisPortfolio,
  })),
);
const ShortcutsWindow = lazyWindow(() =>
  import("@/components/portfolio/Shortcuts").then((m) => ({
    default: m.Shortcuts,
  })),
);
const NotesWindow = lazyWindow(() =>
  import("@/components/portfolio/Notes").then((m) => ({ default: m.Notes })),
);
const MusicWindow = lazyWindow(() =>
  import("@/components/portfolio/Music").then((m) => ({ default: m.Music })),
);
const TerminalWindow = lazyWindow(() =>
  import("@/components/portfolio/Terminal").then((m) => ({
    default: m.Terminal,
  })),
);

export const appRegistry: Record<AppId, AppDefinition> = {
  portfolio: {
    title: "Portfolio",
    width: 980,
    height: 640,
    resizable: true,
    singleton: true,
    Component: FinderWindow as ComponentType<WindowComponentProps>,
  },
  resume: {
    title: "Scott_Alessio_Resume.pdf",
    width: 760,
    height: 640,
    resizable: true,
    singleton: true,
    Component: ResumeWindow,
  },
  contact: {
    title: "Contact",
    width: 480,
    height: 430,
    resizable: true,
    singleton: true,
    Component: ContactWindow,
  },
  trash: {
    title: "Trash",
    width: 520,
    height: 380,
    resizable: true,
    singleton: true,
    Component: TrashWindow,
  },
  "about-computer": {
    title: "About This Computer",
    width: 460,
    height: 400,
    resizable: false,
    singleton: true,
    Component: AboutComputerWindow,
  },
  "about-portfolio": {
    title: "About This Portfolio",
    width: 520,
    height: 460,
    resizable: true,
    singleton: true,
    Component: AboutPortfolioWindow,
  },
  shortcuts: {
    title: "Keyboard Shortcuts",
    width: 460,
    height: 420,
    resizable: true,
    singleton: true,
    Component: ShortcutsWindow,
  },
  notes: {
    title: "Notes",
    width: 420,
    height: 400,
    resizable: true,
    singleton: true,
    Component: NotesWindow,
  },
  music: {
    title: "Music",
    width: 820,
    height: 540,
    resizable: true,
    singleton: true,
    Component: MusicWindow,
  },
  terminal: {
    title: "Terminal",
    width: 620,
    height: 400,
    resizable: true,
    singleton: true,
    Component: TerminalWindow,
  },
};
