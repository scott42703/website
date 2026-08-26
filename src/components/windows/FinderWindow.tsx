"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { FinderRoute } from "@/lib/apps";
import { pathForRoute } from "@/lib/apps";
import { samePath } from "@/lib/asset";
import { useOpenApp } from "@/lib/use-open-app";
import { useStoredState } from "@/lib/hooks";
import { projectCategories, projectById } from "@/data/projects";
import type { SectionId } from "@/data/types";
import {
  ChevronLeft,
  ChevronRight,
  GridIcon,
  ListIcon,
  SearchIcon,
} from "@/components/ui/icons";
import { Home } from "@/components/portfolio/Home";
import { About } from "@/components/portfolio/About";
import { Experience } from "@/components/portfolio/Experience";
import { Projects } from "@/components/portfolio/Projects";
import { Research } from "@/components/portfolio/Research";
import { Education } from "@/components/portfolio/Education";
import { Certifications } from "@/components/portfolio/Certifications";
import { Skills } from "@/components/portfolio/Skills";
import { Contact } from "@/components/portfolio/Contact";
import { SearchResults } from "@/components/portfolio/SearchResults";

export type ViewMode = "grid" | "list";

interface FinderNav {
  route: FinderRoute;
  navigate: (route: FinderRoute) => void;
  viewMode: ViewMode;
}

const FinderNavContext = createContext<FinderNav | null>(null);

export function useFinderNav(): FinderNav {
  const ctx = useContext(FinderNavContext);
  if (!ctx) throw new Error("useFinderNav must be used inside the Finder");
  return ctx;
}

const SIDEBAR: { id: SectionId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Me" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "research", label: "Research" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certificates" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

const SECTION_LABEL: Record<SectionId, string> = {
  home: "Home",
  about: "About Me",
  experience: "Experience",
  projects: "Projects",
  research: "Research",
  education: "Education",
  certifications: "Certificates",
  skills: "Skills",
  contact: "Contact",
};

/** Sections whose content is a browsable collection get the view toggle. */
const VIEW_TOGGLE_SECTIONS: SectionId[] = ["projects", "certifications"];

function routeKey(r: FinderRoute): string {
  return [r.section, r.categoryId ?? "", r.itemId ?? "", r.query ?? ""].join(
    "|",
  );
}

export function FinderWindow(
  props: { windowId: string } & Record<string, unknown>,
) {
  const incoming = props.route as FinderRoute | undefined;
  const initial: FinderRoute = incoming ?? { section: "home" };

  // One object so the entry list and the cursor can never drift apart.
  const [nav, setNav] = useState<{ entries: FinderRoute[]; index: number }>({
    entries: [initial],
    index: 0,
  });
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useStoredState<ViewMode>(
    "finder.viewMode",
    "grid",
  );

  const route = nav.entries[nav.index];
  const contentRef = useRef<HTMLDivElement>(null);

  const navigate = useCallback((next: FinderRoute) => {
    setQuery("");
    setNav((prev) => {
      if (routeKey(prev.entries[prev.index]) === routeKey(next)) return prev;
      // Navigating after going back discards the forward entries, as a
      // browser or Finder would.
      const entries = [...prev.entries.slice(0, prev.index + 1), next];
      return { entries, index: entries.length - 1 };
    });
  }, []);

  const goBack = useCallback(
    () => setNav((p) => ({ ...p, index: Math.max(0, p.index - 1) })),
    [],
  );
  const goForward = useCallback(
    () =>
      setNav((p) => ({
        ...p,
        index: Math.min(p.entries.length - 1, p.index + 1),
      })),
    [],
  );

  // A desktop icon, dock item or menu entry can retarget an already-open
  // Finder by pushing new props. Adjusting state during render (rather than
  // in an effect) is the supported pattern for reacting to a changed prop:
  // React re-runs this component immediately, before touching the DOM.
  const incomingKey = incoming ? routeKey(incoming) : null;
  const [lastIncomingKey, setLastIncomingKey] = useState(incomingKey);
  if (incomingKey !== lastIncomingKey) {
    setLastIncomingKey(incomingKey);
    if (incoming) {
      setQuery("");
      setNav((prev) => {
        if (routeKey(prev.entries[prev.index]) === incomingKey) return prev;
        const entries = [...prev.entries.slice(0, prev.index + 1), incoming];
        return { entries, index: entries.length - 1 };
      });
    }
  }

  // Keep the address bar in step so any view is directly linkable.
  useEffect(() => {
    if (query) return;
    const path = pathForRoute(route);
    // Compared loosely: a static export is served with trailing slashes, so a
    // strict comparison would rewrite the address bar on every render.
    if (!samePath(window.location.pathname, path)) {
      window.history.replaceState(null, "", path);
    }
  }, [route, query]);

  // Reset scroll when the view changes, Finder behaviour, and it stops
  // a long Projects list from stranding you halfway down About.
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [route, query]);

  const canBack = nav.index > 0;
  const canForward = nav.index < nav.entries.length - 1;

  const crumbs = useMemo(() => {
    if (query) return ["Portfolio", `Search: ${query}`];
    const parts = ["Portfolio"];
    if (route.section !== "home") parts.push(SECTION_LABEL[route.section]);
    if (route.categoryId) {
      const cat = projectCategories.find((c) => c.id === route.categoryId);
      if (cat) parts.push(cat.name);
    }
    if (route.section === "projects" && route.itemId) {
      const project = projectById(route.itemId);
      if (project) parts.push(project.title);
    }
    return parts;
  }, [route, query]);

  const navContext = useMemo<FinderNav>(
    () => ({ route, navigate, viewMode }),
    [route, navigate, viewMode],
  );

  const showViewToggle =
    !query && VIEW_TOGGLE_SECTIONS.includes(route.section) && !route.itemId;

  return (
    <FinderNavContext.Provider value={navContext}>
      <div className="flex min-h-0 flex-1 flex-col">
        <FinderToolbar
          canBack={canBack}
          canForward={canForward}
          onBack={goBack}
          onForward={goForward}
          crumbs={crumbs}
          query={query}
          onQuery={setQuery}
          viewMode={viewMode}
          onViewMode={showViewToggle ? setViewMode : undefined}
        />

        <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
          <FinderSidebar
            active={query ? null : route.section}
            onSelect={(section) => navigate({ section })}
          />

          <div
            ref={contentRef}
            className="retro-scroll min-w-0 flex-1 overflow-y-auto bg-[var(--surface)]"
          >
            <FinderContent route={route} query={query} />
          </div>
        </div>
      </div>
    </FinderNavContext.Provider>
  );
}

/* ------------------------------------------------------------------ parts */

function FinderToolbar({
  canBack,
  canForward,
  onBack,
  onForward,
  crumbs,
  query,
  onQuery,
  viewMode,
  onViewMode,
}: {
  canBack: boolean;
  canForward: boolean;
  onBack: () => void;
  onForward: () => void;
  crumbs: string[];
  query: string;
  onQuery: (q: string) => void;
  viewMode: ViewMode;
  onViewMode?: (v: ViewMode) => void;
}) {
  const navBtn =
    "grid h-[22px] w-[26px] place-items-center surface-raised bg-[var(--chrome)] " +
    "text-[var(--ink)] disabled:text-[var(--ink-faint)] disabled:opacity-60 " +
    "enabled:hover:bg-[var(--chrome-alt)] enabled:active:bg-[var(--chrome-deep)]";

  return (
    <div className="shrink-0 border-b border-[var(--hairline)] bg-[var(--chrome)]">
      <div className="flex flex-wrap items-center gap-2 px-2 py-1.5">
        <div className="flex items-center gap-1">
          <button
            type="button"
            className={navBtn}
            onClick={onBack}
            disabled={!canBack}
            aria-label="Back"
            title="Back"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            className={navBtn}
            onClick={onForward}
            disabled={!canForward}
            aria-label="Forward"
            title="Forward"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        <nav
          aria-label="Location"
          className="surface-inset flex min-w-0 flex-1 items-center gap-1 overflow-hidden bg-[var(--surface-sunken)] px-2 py-[3px]"
        >
          {crumbs.map((c, i) => (
            <span key={`${c}-${i}`} className="flex min-w-0 items-center gap-1">
              {i > 0 && (
                <span aria-hidden className="text-[var(--ink-faint)]">
                  ▸
                </span>
              )}
              <span
                className={`truncate text-[11px] ${
                  i === crumbs.length - 1
                    ? "font-semibold text-[var(--ink)]"
                    : "text-[var(--ink-soft)]"
                }`}
              >
                {c}
              </span>
            </span>
          ))}
        </nav>

        {onViewMode && (
          <div
            className="flex items-center gap-1"
            role="group"
            aria-label="View"
          >
            <button
              type="button"
              className={`${navBtn} ${viewMode === "grid" ? "surface-inset bg-[var(--chrome-deep)]" : ""}`}
              onClick={() => onViewMode("grid")}
              aria-pressed={viewMode === "grid"}
              aria-label="Grid view"
              title="Grid view"
            >
              <GridIcon size={13} />
            </button>
            <button
              type="button"
              className={`${navBtn} ${viewMode === "list" ? "surface-inset bg-[var(--chrome-deep)]" : ""}`}
              onClick={() => onViewMode("list")}
              aria-pressed={viewMode === "list"}
              aria-label="List view"
              title="List view"
            >
              <ListIcon size={13} />
            </button>
          </div>
        )}

        <div className="surface-inset flex items-center gap-1.5 bg-[var(--surface)] px-2 py-[3px]">
          <SearchIcon size={13} className="shrink-0 text-[var(--ink-faint)]" />
          <input
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search portfolio"
            aria-label="Search portfolio"
            className="w-28 bg-transparent text-[12px] text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)] sm:w-40"
          />
        </div>
      </div>
    </div>
  );
}

function FinderSidebar({
  active,
  onSelect,
}: {
  active: SectionId | null;
  onSelect: (s: SectionId) => void;
}) {
  const openApp = useOpenApp();

  const itemClass = (isActive: boolean) =>
    `flex w-full shrink-0 items-center gap-2 px-3 py-[6px] text-left text-[12.5px] whitespace-nowrap transition-colors sm:whitespace-normal ${
      isActive
        ? "bg-[var(--highlight)] font-semibold text-[var(--highlight-ink)]"
        : "text-[var(--ink-soft)] hover:bg-[var(--surface-sunken)] hover:text-[var(--ink)]"
    }`;

  const bullet = (isActive: boolean) => (
    <span
      aria-hidden
      className={`hidden h-2 w-2 shrink-0 border sm:block ${
        isActive
          ? "border-[var(--highlight-ink)] bg-[var(--highlight-ink)]"
          : "border-[var(--ink-faint)]"
      }`}
    />
  );

  return (
    // Narrow screens get a horizontal strip instead of a column, so the
    // content pane keeps a readable width on a phone.
    <nav
      aria-label="Portfolio sections"
      className="retro-scroll w-full shrink-0 overflow-x-auto overflow-y-hidden border-b border-[var(--hairline)] bg-[var(--surface-alt)] sm:w-[168px] sm:overflow-x-hidden sm:overflow-y-auto sm:border-r sm:border-b-0 sm:py-2"
    >
      <p className="label-micro hidden px-3 pb-1.5 text-[10px] tracking-wide text-[var(--ink-faint)] uppercase sm:block">
        Favorites
      </p>

      <ul className="flex sm:mb-3 sm:block">
        {SIDEBAR.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id} className="shrink-0">
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                aria-current={isActive ? "page" : undefined}
                className={itemClass(isActive)}
              >
                {bullet(isActive)}
                <span className="truncate">{item.label}</span>
              </button>
            </li>
          );
        })}
        {/* Résumé and Music sit under an Apps heading on wide screens, and
            simply at the end of the strip on narrow ones. */}
        <li className="shrink-0 sm:hidden">
          <button
            type="button"
            onClick={() => openApp("resume")}
            className={itemClass(false)}
          >
            <span className="truncate">Résumé</span>
          </button>
        </li>
        <li className="shrink-0 sm:hidden">
          <button
            type="button"
            onClick={() => openApp("music")}
            className={itemClass(false)}
          >
            <span className="truncate">Music</span>
          </button>
        </li>
      </ul>

      <div className="hidden sm:block">
        <p className="label-micro px-3 pb-1.5 text-[10px] tracking-wide text-[var(--ink-faint)] uppercase">
          Apps
        </p>
        <ul>
          <li>
            <button
              type="button"
              onClick={() => openApp("resume")}
              className={itemClass(false)}
            >
              {bullet(false)}
              <span className="truncate">Résumé</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => openApp("music")}
              className={itemClass(false)}
            >
              {bullet(false)}
              <span className="truncate">Music</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

function FinderContent({
  route,
  query,
}: {
  route: FinderRoute;
  query: string;
}) {
  if (query.trim()) return <SearchResults query={query.trim()} />;

  switch (route.section) {
    case "home":
      return <Home />;
    case "about":
      return <About />;
    case "experience":
      return <Experience itemId={route.itemId} />;
    case "projects":
      return <Projects categoryId={route.categoryId} itemId={route.itemId} />;
    case "research":
      return <Research />;
    case "education":
      return <Education />;
    case "certifications":
      return <Certifications />;
    case "skills":
      return <Skills groupId={route.categoryId} />;
    case "contact":
      return <Contact />;
    default:
      return <Home />;
  }
}
