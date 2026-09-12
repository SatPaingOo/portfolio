# UI/UX Audit — Aura Portfolio

Reviewed 2026-09-12 against the running app (`npm run dev`) at three viewports:
1440x900 desktop, 768x1024 tablet, 393x851 mobile (Pixel 5).

Automated coverage lives in `e2e/`. Run it with `npm test`.

**First baseline: 39 passed, 70 failed, 8 skipped** across the three viewport projects.
**After the first round of fixes: 78 passed, 71 failed, 10 skipped** of 159 tests.
Every failure below was reproduced in the browser, not inferred from the source.

Items marked **[fixed]** have been repaired and are held by a named test.

---

## P0 — Fix before showing this to a recruiter

### 1. The AURA chat panel buries the landing page

`isOpen` starts as `true` (`components/ChatInterface.tsx:98`), and the panel is
sized as a fraction of the viewport, so it lands on top of the hero instead of
beside it.

| Viewport | Panel height | Share of screen |
|---|---|---|
| 1440x900 desktop | 810px | 90% |
| 768x1024 tablet | 600px | 59% |
| 393x851 mobile | 650px | 80% |

Measured consequences on a phone: the `<h1>` carrying the name sits at y=264
inside the covered band, and both hero buttons report `elementFromPoint` hits
against the chat panel, so **"View Projects" and "Tech Stack" cannot be tapped
on arrival**. On desktop the summary paragraph is clipped mid-sentence on every
line, and the third column of the Projects grid is completely hidden.

The 90% desktop figure comes from `landscape:h-[90dvh]`
(`components/ChatInterface.tsx:169`). `(orientation: landscape)` matches every
desktop monitor, not just a phone held sideways, and Tailwind orders that
variant after `sm:`/`md:`, so it overrides the intended `sm:h-[600px]`.

Fix: start collapsed (`useState(false)`), drop the `landscape:` height, cap the
panel at roughly half the viewport, and on `md` and up either dock it in a
column the main content is padded around, or keep it as an overlay that opens on
demand.

### 2. There is no way to make contact

`constants.ts:9` holds the e-mail address, but grep confirms it is rendered in
exactly one place: the text of an AURA reply (`services/auraService.ts:80`). The
visual UI has no e-mail link, no contact section, and no "hire me" affordance.
`location` and `languagesSpoken` are likewise data-only.

Worse, `services/auraService.ts` has **no branch for "contact", "email",
"hire", or "resume"**. Asking *"how can I contact you?"* in the live app returns
the generic command menu, which does not include the address. A recruiter has to
guess the word "about" to find it.

Fix: put a persistent contact action in the nav and at the end of the hero, add
a `mailto:` link and a resume download, and add a contact intent to the
responder.

### 3. Views have no URL

All five views are a single `useState` in `App.tsx:13`. The URL stays
`/portfolio/` no matter what is on screen. That means no deep links, no
shareable project page, no browser back button, and nothing for Google to index
beyond the one entry in `public/sitemap.xml`.

Confirmed: after navigating to Projects and reloading, the app returns to Home.
Back button does the same.

Fix: React Router, or a small `useSyncExternalStore` over `history.pushState`
with `/projects`, `/skills`, `/history`, `/gallery`.

### 4. Keyboard focus is invisible everywhere

Focusing the first nav button returns `outline-style: none` and
`box-shadow: none`. The only focus rule in the codebase is `focus:outline-none`
on the chat input (`components/ChatInterface.tsx:237`), which removes the ring
and replaces it with a border at 4.79:1.

Fix: one global rule, e.g.
`*:focus-visible { outline: 2px solid #38dfff; outline-offset: 2px; }`.

### 5. Pinch-zoom is disabled

`index.html:7` ships `maximum-scale=1.0, user-scalable=no`. That blocks a
low-vision visitor from zooming, a direct WCAG 1.4.4 failure, and it is not
needed to prevent iOS input zoom (the chat input already uses a 16px font).

Fix: `content="width=device-width, initial-scale=1.0, viewport-fit=cover"`.

---

## P1 — Accessibility and semantics

### 6. Clickable `div`s are keyboard dead ends

Two elements handle `onClick` on a plain `div` with `cursor-pointer` and no
`role` or `tabindex`:

- the `SPO.SYS` logo / home link (`App.tsx:71`)
- every gallery photo tile (`components/views/GalleryView.tsx:51`)

Neither appears in the accessibility tree. **The gallery lightbox cannot be
opened by keyboard at all.**

### 7. The lightbox is not a dialog

`components/views/GalleryView.tsx:95` renders an overlay with none of the modal
contract:

- Escape does not close it (verified in the live app and by test)
- no `role="dialog"` / `aria-modal="true"`
- no focus move in, no focus trap, no focus restore on close
- the nav behind it stays focusable, so Tab walks out of the modal
- the close button has no accessible name

### 8. The closed mobile drawer stays in the tab order

`App.tsx:160` hides the drawer with `-translate-x-full` only. It keeps
`display: block`, so 7 controls sit at `x: -256` and remain focusable: the five
view buttons plus the LinkedIn and GitHub links. A keyboard or screen-reader
user on a phone tabs into an invisible menu.

Fix: add `invisible`/`pointer-events-none` when closed, or `inert`, or unmount
it.

### 9. The drawer is not announced as a disclosure

The hamburger (`App.tsx:86`) has `aria-label` but no `aria-expanded` and no
`aria-controls`. The drawer has no `role="dialog"`. Escape does not close it,
and focus is never moved into it (it stays on `body`).

### 10. Two buttons have no accessible name

The lightbox close button and the collapsed chat bubble
(`components/ChatInterface.tsx:251`) are icon-only with no `aria-label`. A
screen reader announces only "button".

### 11. 38 tap targets are under 44x44 on mobile

Worst offenders:

| Control | Size |
|---|---|
| Chat collapse chevron | 28 x 28 |
| Hamburger | 40 x 40 |
| "View Projects" | 168 x 34 |
| "Tech Stack" | 136 x 34 |
| Chat input | 309 x 37 |
| SEND | 43 x 37 |

### 12. Eight text styles fail the 4.5:1 contrast floor

Measured against the `#020617` page background:

| Token | Ratio | Used for |
|---|---|---|
| `holo-700` `#006b8a` | **3.33** | nav tagline (at 8px), input placeholder |
| `gray-500` `#6b7280` | **4.17** | inactive nav items, PRO/FAM skill tiers |
| `holo-600` `#0086aa` | 4.79 | "Challenge" / "Solution" labels at 10px |

The nav tagline is also set at **8px**, below any usable minimum regardless of
colour. Raise `holo-700` usage to `holo-400` or lighter, and lift the smallest
type to 11-12px.

### 13. No `prefers-reduced-motion` support

With reduced motion emulated, 9 animations keep running: `float`, `spin`,
`pulse`, and three staggered `bounce` dots, plus the continuous WebGL render
loop, the CSS scanline overlay, and the 15ms-per-character typewriter. Nothing
in the codebase references the media query.

### 14. No `h1` outside Home, and thin landmarks

Projects, Skills, History and Gallery each start at `h2`, so those views have no
level-1 heading. The document exposes only `nav` and `main`: no `header`, no
`footer`, no skip link.

---

## P2 — Layout and visual craft

### 15. Project card footers do not align — **[fixed]**

`components/views/ProjectsView.tsx:58` puts `mt-auto` on the link row, but the
card is not a flex column, so `mt-auto` is a no-op. Grid stretches each card to
the tallest in its row, so the Live Demo / GitHub buttons float at different
heights and short cards end in a large void. Card 2 has no links at all, which
leaves its bottom empty.

Fixed: the card is now an `article` with `flex h-full flex-col`, a `flex-1`
spacer absorbs the slack, long paragraphs are `line-clamp`ed, the tech chips
collapse into a `+n more` counter, and a card with no public links renders an
"Internal build" footer so the bottom rule stays put. Measured after the change:
every card in a row is the same height and every footer sits 21px off the card
bottom, at desktop, tablet and mobile widths.

### 16. The skills radar chart does not communicate anything

`levelMap` in `components/views/SkillsView.tsx:6` maps three labels to 50/75/100,
and most skills are Expert. The plotted polygon is therefore an almost perfect
circle at the outer edge. The chart also uses `outerRadius="70%"` inside a
`max-w-4xl` panel, so it occupies the middle third of a very wide box and wastes
the rest.

The legend is worse than useless. Three swatches labelled Expert / Proficient /
Familiar sit in the corner, but the chart draws **one** series called
"Proficiency", so those swatches map to nothing. The `Familiar (50)` swatch is
`bg-holo-500/10`, effectively invisible.

Fix: either drop to a grouped bar / segmented-meter layout that shows tiers
honestly, or plot a real second dimension (years of use, project count). The
chart also has no `aria-label`, `title` element, or table fallback.

### 17. Proficient and Familiar render identically

`components/views/SkillsView.tsx:136` colours both `PRO` and `FAM` with
`text-gray-500`, so two of the three tiers are indistinguishable. The tiers also
rely on colour alone, with unexplained three-letter codes.

### 18. The hero 3D object reads as a grey ball — **[fixed]**

`components/HolographicHead.tsx` is named "HolographicHead" but builds a
`SphereGeometry(1, 48, 48)` wireframe, plus a 40x40 inner wireframe, plus more
layers, all with `THREE.AdditiveBlending`. Roughly 7,000 line segments overlap
inside a 180-240px box, additive light saturates, and the result is a washed-out
white sphere with no structure and none of the cyan brand colour.

Fixed: rebuilt as a 20-face icosahedron cage with glowing vertex nodes, a
Fresnel rim-lit inner shell on normal blending, two thin orbital trails, and a
small cyan core. The four stacked additive wireframe spheres and the two white
emissive cores at intensity 8 and 10 are gone, so the interior stays dark and
only the silhouette glows.

One trap worth recording: the shell first rendered as a solid cyan disc because
the material was `DoubleSide`. On a back face the normal points away from the
camera, the Fresnel term saturates to 1, and the whole silhouette fills in.
`FrontSide` is required for a rim-lit shell.

### 19. Hover scale on the 3D object never applies — **[fixed]**

`components/HolographicHeadView.tsx:50` sets
`transform: isHovered ? 'scale(1.15) sm:scale(1.25)' : 'scale(1)'`. Tailwind
responsive prefixes are not CSS. The browser rejects the whole declaration, so
the hover scale silently does nothing.

Fixed: the scale moved to a real Tailwind class on the container.

### 20. The mouse tracker thrashes layout — **[fixed]**

`components/HolographicHeadView.tsx:11` attaches a `window` `mousemove` handler
that calls `getBoundingClientRect()` and `setState` on **every** mouse event,
anywhere on the page, re-rendering the Canvas host continuously. The cleanup
also reads `containerRef.current` at teardown, which is the stale-ref pattern
React warns about.

Fixed: the rect is cached and refreshed on resize, pointer moves coalesce into
one `requestAnimationFrame`, and the value is written to a ref that `useFrame`
reads, so pointer movement no longer re-renders the Canvas host at all.

### 21. Hero copy is centred and over-wide

The summary is a centred 8-line block. Centred text of that length forces the
eye to re-find the left edge on every line. It also uses `max-w-2xl` on desktop,
which runs past the comfortable 45-85 character measure. On mobile the two CTAs
wrap to separate rows at different widths, which reads as ragged.

### 22. The gallery is one placeholder image

`constants.ts:226` points at `https://picsum.photos/800/600?random=8` — a random
placeholder service — titled "Team Collaboration" and described as a
microservices architecture session. The live page shows a stock photo of someone
in a beanie. One item in a three-column grid leaves the page two-thirds empty.
No `loading="lazy"`, no `width`/`height`, so the image also causes layout shift.

Either fill the gallery with real project screenshots or remove the view.

### 23. Chat-driven navigation ignores negation

`components/ChatInterface.tsx:135` switches views on raw substring matches.
Verified live: *"I am not interested in your projects, tell me about yourself"*
navigates to **PROJECTS**. Any message containing the word "project" hijacks the
view.

### 24. The stage direction leaks while typing

`formatText` (`components/ChatInterface.tsx:5`) replaces the
`[Aura materializes as a semi-transparent cyan wireframe projection...]` line
only when it matches in full. The typewriter reveals one character at a time, so
the visitor watches the raw bracketed sentence type out, then sees it snap to
"Aura appears as a holographic guide."

Also: at 15ms per character a ~1,200 character reply takes about 18 seconds to
finish, re-rendering the message list on every character, with no way to skip.

---

## P3 — Payload, dead code, and metadata

### 25. 1.4 MB of JavaScript loads before the hero paints

Production build output:

| Chunk | Raw | Gzip |
|---|---|---|
| `three-vendor` | 1,062 kB | 299 kB |
| `chart-vendor` (recharts) | 314 kB | 94 kB |
| `index` | 69 kB | 20 kB |
| `react-vendor` | 12 kB | 4 kB |
| CSS | 33 kB | 6 kB |

Nothing is code-split at runtime — there is no `React.lazy` anywhere — so a
phone downloads about 416 kB gzipped before seeing anything. three.js is there
for one decorative sphere; recharts is there for one chart on a view most
visitors never open.

Fix: `React.lazy` plus `Suspense` for `HolographicHeadView` and `SkillsView`,
render a static SVG or CSS poster as the fallback, and consider replacing
recharts with a hand-rolled SVG radar (about 40 lines) to delete 314 kB.

### 26. Dead code and an unused dependency

- `SYSTEM_INSTRUCTION` (`services/auraService.ts:4`) is never referenced, and it
  interpolates `JSON.stringify(PORTFOLIO_DATA, null, 2)` — the entire dataset is
  duplicated into the bundle as a string.
- `initializeChat` and `isApiAvailable` are imported by `ChatInterface.tsx:2`
  and never called.
- `Legend` is imported from recharts in `SkillsView.tsx:2` and never used.
- `@react-three/drei` appears in `vite.config.ts:31` `manualChunks` but is never
  imported by any source file.

### 27. `GEMINI_API_KEY` would be inlined into the client bundle

`vite.config.ts:15` defines `process.env.API_KEY` and
`process.env.GEMINI_API_KEY` from the environment. Nothing reads them today, but
if a key is ever set in `.env` it ships to every visitor in plain text. Remove
both `define` entries.

### 28. Social previews and icons are missing

`index.html` declares `twitter:card content="summary_large_image"` but there is
**no `og:image` and no `twitter:image`**, so LinkedIn, X and Slack render this
portfolio as a bare text link. There is also no favicon, no `apple-touch-icon`,
no `theme-color`, and no `robots.txt`.

`metadata.json` still describes the app as "powered by Gemini" although
`isApiAvailable()` hard-returns `false` and all replies are local.

### 29. The home view scrolled with room to spare, and the buttons fell off — **[fixed]**

Reported separately and reproduced at 1280x620: `main.scrollHeight` was 680
against a `clientHeight` of 620, and "View Projects" sat 60px **below** the
bottom edge.

Cause: the hero was `h-full` with `justify-start`, so the box was pinned to the
container height while its children summed to more than that and spilled out of
the bottom. The 3D canvas was a fixed 240px regardless of window height, and the
column had no bottom padding.

Fixed: the hero is now `min-h-full` with `justify-center`, a gap-based vertical
rhythm, and explicit bottom padding that clears the collapsed AURA bubble. The
canvas size tracks viewport height through `clamp(96px,18vh,200px)`. The two
buttons share one width, stack full-width below `sm`, and are 44px tall.

Measured after the change:

| Viewport | Scroll overflow | Canvas | Lowest button clearance |
|---|---|---|---|
| 1440x900 | 0 | 180px | 163px |
| 1280x620 | 0 | 124px | 51px |
| 1024x768 | 0 | 154px | 110px |
| 375x812 | 0 | 162px | 100px |
| 393x727 | 30px | 131px | reachable by scroll |

A 393x727 phone still scrolls a little. That one is honest: the summary
paragraph alone runs 250px at that width, so the hero genuinely needs more than
the 671px available. Shortening the hero copy is the only further lever.

### 30. The hero canvas intermittently rendered nothing — **[fixed]**

Found while fixing the item above. On some loads react-three-fiber left the
canvas at its unsized 300x150 default and the scene never appeared.

Two causes, both fixed: `aspect-square` with an auto height lost to the canvas
element's intrinsic 150px height, so the container now sets both axes
explicitly; and the measure hook's scroll tracking, inside main's scroll box,
could land mid-resize, so the Canvas now takes `resize={{ scroll: false,
debounce: 0 }}`. Verified stable across repeated fresh loads at 1440x900 and
1280x620.

---

## Suggested order of work

1. Chat opens collapsed, `landscape:` height removed, panel capped (#1)
2. Global `:focus-visible` ring, restore pinch-zoom (#4, #5)
3. Contact link in the nav and hero, contact intent in the responder (#2)
4. Gallery tile and logo become real buttons; lightbox gets Escape,
   `role="dialog"` and a focus trap (#6, #7)
5. Drawer hidden properly when closed, `aria-expanded` wired up (#8, #9)
6. URL routing (#3)
7. `React.lazy` the three.js and recharts views (#25)
8. Contrast tokens, 44px targets, `prefers-reduced-motion` (#11, #12, #13)
9. Skills chart rework, hero typography (#16, #21)
10. Real gallery images, `og:image`, favicon (#22, #28)

Done so far: #15, #18, #19, #20, #29, #30.

Re-run `npm test` after each step; the suite is written so that a fix flips a
named test from red to green.
