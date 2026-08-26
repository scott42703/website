"use client";

export function AboutThisPortfolio() {
  return (
    <div className="retro-scroll flex-1 overflow-y-auto px-6 py-6">
      <h2 className="font-[family-name:var(--font-display)] text-[19px] font-bold text-[var(--ink)]">
        About This Portfolio
      </h2>

      <div className="mt-3 space-y-3 text-[12.5px] leading-relaxed text-[var(--ink-soft)]">
        <p>
          This site behaves like a desktop. Folders open into draggable windows,
          several can be open at once, and clicking one brings it to the front.
          The desktop is the packaging; the content underneath is a
          straightforward portfolio.
        </p>
        <p>
          If the desktop is not your thing, the sidebar inside the Portfolio
          window is a plain list of sections, every section has its own address,
          and the whole site works from the keyboard.
        </p>
      </div>

      <h3 className="label-micro mt-5 mb-2 text-[10px] tracking-widest text-[var(--ink-faint)] uppercase">
        Getting around
      </h3>
      <ul className="space-y-1.5 text-[12.5px] text-[var(--ink-soft)]">
        <li>Double-click a desktop icon, or select it and press Enter.</li>
        <li>Drag a window by its title bar; drag the corner grip to resize.</li>
        <li>Use the Dock at the bottom to jump straight to a section.</li>
        <li>Right-click the desktop for wallpaper and window options.</li>
      </ul>

      <p className="mt-5 border-t border-[var(--hairline)] pt-3 text-[11.5px] text-[var(--ink-faint)]">
        Not affiliated with any operating system vendor.
      </p>
    </div>
  );
}
