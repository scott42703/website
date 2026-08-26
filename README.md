# Scott Alessio, Desktop Portfolio

An interactive portfolio that behaves like a desktop operating system. Folders
open into draggable Finder-style windows, several can be open at once, there is
a Music library for production work, and everything underneath is a
straightforward, recruiter-friendly portfolio.

Built with Next.js 16, React 19, TypeScript (strict), Tailwind CSS 4 and
Framer Motion. No database, no backend, no API routes, every page is
statically generated.

The look is Apple-adjacent rather than a macOS clone: traffic-light window
controls, rounded windows with layered shadows, translucent menu bar and dock,
Inter throughout, hairline borders, and one accent blue. Every colour pair
clears WCAG AA (4.5:1) in both light and dark.

---

## Running it

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build
```

---

## Where your content lives

**All portfolio content is in `src/data/`. You should never need to edit a
component to change what the site says.**

| File | What it holds |
|---|---|
| `personal.ts` | Name, title, email, LinkedIn, GitHub, bio, résumé path |
| `experience.ts` | Roles: organization, dates, responsibilities, technologies |
| `projects.ts` | Projects and the folder categories they are filed under |
| `research.ts` | Research programme summary and publications |
| `education.ts` | Degrees, coursework, highlights |
| `certifications.ts` | Certificates and credential details |
| `skills.ts` | Skill groups (the folders under Skills) |
| `music.ts` | Tracks and collections in the Music app |
| `highlights.ts` | The four metric tiles on the home screen |
| `types.ts` | TypeScript interfaces for all of the above |

Fields set to `null` are simply not rendered. No empty labels, no "N/A".

### Publications, and why the PDFs are not hosted

Both papers in `research.ts` are verified against the papers themselves:
titles, full author lists, venues, years and abstracts. Your own name is
picked out in bold in each byline.

`pdfPath` is `null` for both, deliberately:

- The **ICAIIC** paper links to its DOI
  (`10.1109/ICAIIC64266.2025.10920709`) rather than serving a file. The copy
  on disk is the IEEE Xplore *licensed download*, watermarked "Authorized
  licensed use limited to: New Jersey Institute of Technology… Restrictions
  apply." Re-hosting that file publicly would breach the licence.
- The **HPSR** paper has no DOI printed on it yet, the copy on disk is the
  un-watermarked camera-ready. IEEE's author policy generally allows posting
  an accepted version on your own site, but check the copyright form you
  signed. Add the Xplore link to `publicationUrl` once the proceedings are
  indexed.

To host either PDF: put it in `public/research/` and set `pdfPath`. A **Read
PDF** button appears on its own.

### Deliberate privacy defaults

- Your phone number is in `personal.ts` but **not published**
  (`showPhone: false`). Flip it to `true` if you want it public.
- The AWS project's `demoUrl` points at the Google Drive recording from your
  course submission. Set it to `null` if you would rather not have that link
  on a public site.

The home-screen metric tiles are **computed** from the data files, project
count, certification count, publication count and distinct technology count.
Nothing is typed in by hand, so the numbers cannot drift.

---

## The Music app

An iTunes-shaped library: transport and now-playing display across the top,
collections down the side, a track table with generated cover art. Four of
your own tracks ship with it: `lights`, `two-sides`, `wave` and `ambient`,
transcoded from the FL Studio exports to 160 kbps MP3. Nothing downloads until
you press play.

The volume slider drives both sinks: the local `<audio>` element for hosted
tracks, and SoundCloud's Widget API for the embeds. The slider hides itself on
iOS, where Safari ignores programmatic volume and only the hardware buttons
work, so there is never an inert control on screen.

Only one player ever sounds at a time. Starting an embed pauses the local
player, and starting a hosted track pauses the embed, in both directions and
whichever one you reach for.

Audio lives above the window layer, so closing the Music window does not stop
playback, reopen it and the track is still going, the way it would be on a
real machine.

### Adding tracks

Everything is `src/data/music.ts`. Two shapes:

- **Hosted here** - drop an MP3 in `public/music/` and set `src`. It plays
  through the app's own player, joins the play queue, and shows a duration.
- **Someone else's record** - leave `src` as `null` and set `embedUrl` and
  `sourceUrl`. The row expands into SoundCloud's official player, so the track
  streams from the artist's own account and keeps their play count.

The two tracks by imnotvrycreative and endri use the second shape. That is
deliberate: they are other people's recordings, and crediting someone is not
the same as being licensed to redistribute their master. If they send you the
files, or turn on downloads themselves, move them to `public/music/` and set
`src` and they will play natively like yours do.

`art` is a pair of hex colours used to generate the cover.

---

## Replaceable assets

- **Résumé**, `public/resume/Scott_Alessio_Resume.pdf`. Replace the file, and
  update `personal.resumePath` / `resumeFileName` if you rename it. If the PDF
  is missing, the Résumé window falls back to a clean text version generated
  from the data files rather than breaking.
- **Wallpapers**, four originals, defined purely in CSS at the bottom of
  `src/app/globals.css` (no image files). Add one by adding an entry to
  `wallpapers` in `src/lib/theme.tsx` and a matching
  `html[data-wallpaper="..."] .desk-wall` rule.
- **Icons**, all original SVGs in `src/components/ui/icons.tsx`. No operating
  system or vendor assets are used anywhere.
- **Screenshots**, drop files in `public/projects/` and reference them from a
  project's `screenshots` array; the cards switch from the generated
  placeholder to the real image automatically.

---

## The startup screen

A first visit lands on a startup dialog with your avatar, name and a **Log
In** button, then a short progress beat and the desktop. It is one click or one keypress
(Enter, Space or Escape), and the button is auto-focused, so a keyboard
visitor just presses Enter.

There is **no password field**. A portfolio has nothing to authenticate, and a
fake credential prompt would be both dishonest and annoying.

A startup chime plays on log in. It is a plain file at
`public/sounds/startup.mp3`, replace that file and you have replaced the
sound, no code change. The one shipped is a three-second slice of your own
track "ambient", faded and level-matched.

It only ever plays in response to the deliberate Log In gesture, never on page
load. The speaker icon on the login panel and in the menu bar mutes it, and
that choice is remembered.

The gate is scoped to the tab session (`sessionStorage`), so reloading or
following a deep link during the same visit goes straight to the desktop.
Only a genuinely new visit sees it. **File → Log Out** replays it and clears
the open windows. Under `prefers-reduced-motion` the progress beat is skipped
entirely.

---

## Architecture

```
src/
  app/                 routes, metadata, sitemap, robots, OG image
  data/                all portfolio content (see above)
  lib/
    window-manager.tsx  the window reducer: open/close/focus/minimize/zoom/drag
    store.ts            localStorage, matchMedia and clock as external stores
    theme.tsx           theme, wallpaper, desktop preferences
    apps.ts             app ids and Finder routes
    seo.ts              per-section metadata and JSON-LD
  components/
    desktop/           Desktop shell, MenuBar, Dock, icons, context menu
    windows/           Window shell, WindowManager, app registry, Finder
    portfolio/         one component per section
    ui/                RetroButton, Badge, icon set
    seo/               server-rendered semantic mirror of the content
```

**One window system.** Every window, Portfolio, Résumé, Contact, Trash,
Terminal, Notes, is the same `<Window>` shell driven by one reducer. Adding a
window means adding an entry to `src/components/windows/registry.tsx`; nothing
else changes.

**Windows never get lost.** Positions are clamped so at least 96px of title bar
stays on screen, and the reducer re-clamps every window whenever the viewport
changes. *View → Reset Window Positions* re-cascades everything.

**Drag costs zero React renders.** While the pointer is down, movement is
written straight to the DOM node; the reducer is only updated on release.

---

## Linkable sections

Each section has a real URL and its own metadata, and the address bar stays in
sync as you navigate inside the Finder:

`/about` · `/experience` · `/projects` · `/projects/<id>` · `/research` ·
`/education` · `/certifications` · `/skills` · `/contact` · `/resume`

A server-rendered, visually hidden mirror of the whole portfolio ships in the
HTML. That means search engines index real content rather than an empty
canvas, the page still means something with JavaScript disabled, and a
screen-reader user who does not care about the desktop metaphor can read the
portfolio straight through.

---

## Accessibility

- Every desktop icon is tab-reachable; Enter or Space opens it.
- Window title bars are focusable and can be moved with the arrow keys.
- All text meets WCAG AA contrast (4.5:1) in both light and dark themes.
- `prefers-reduced-motion` disables animation throughout.
- Minimized windows are `inert`, so they stay out of the tab order.
- The Finder sidebar is a plain list of sections for anyone who does not want
  to play along with the OS metaphor.

Keyboard: `⌘/Ctrl+W` closes the front window, `⌘/Ctrl+M` minimizes it, `Esc`
closes menus.

---

## Deploying

The site is fully static: every page is prerendered and there is no backend,
so it will run on any host that serves files.

### GitHub Pages

A workflow at `.github/workflows/deploy.yml` builds and publishes on every
push to `main`. To turn it on:

1. Push this folder to a GitHub repository.
2. In the repository, go to **Settings, Pages** and set **Source** to
   **GitHub Actions**.
3. Push to `main`, or run the workflow by hand from the **Actions** tab.

The workflow works out the correct URLs on its own, but the repository name
still matters:

- Name it **`<your-username>.github.io`** and the site is served from
  `https://<your-username>.github.io`, which is the tidier address.
- Name it anything else and the site is served from
  `https://<your-username>.github.io/<repo-name>/`. That works too: the build
  reads the subdirectory from the Pages configuration and prefixes every asset
  URL with it.

Two details the workflow handles that catch people out: GitHub Pages runs
output through Jekyll by default, which silently deletes the `_next`
directory, so the workflow writes a `.nojekyll` file; and a static export needs
`output: "export"`, which is switched on by the `NEXT_OUTPUT` environment
variable rather than being permanent, so a Node host still gets a normal build.

To check a subdirectory build locally before pushing, in PowerShell:

```bash
$env:NEXT_OUTPUT="export"; $env:NEXT_PUBLIC_BASE_PATH="/your-repo-name"; npm run build
```

That writes the site to `out/`. Serve the *parent* of a folder named after
your repo to reproduce the real URL shape.

### Vercel

Import the repository at [vercel.com/new](https://vercel.com/new). Next.js is
detected automatically and there is nothing to configure. Set
`NEXT_PUBLIC_SITE_URL` to your final domain for canonical URLs, Open Graph
tags, JSON-LD and the sitemap. Leave `NEXT_OUTPUT` unset.

---

## Easter eggs

Minor, and none of them get in the way: the Trash holds a few joke files,
*About This Computer* under the name menu, a Notes pad that persists in
`localStorage`, four switchable wallpapers, a right-click desktop menu, and a
small Terminal (`help`, `whoami`, `ls`, `open <section>`, `projects`,
`skills`, `contact`, `sudo`).
