# Alex Lynn Buntrock — Portfolio

Next.js 15 (App Router) + Tailwind CSS 4 + TypeScript. A single-page portfolio in English, Brazilian
Portuguese and Spanish, with a bright Chile-inspired design system.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Structure

```
app/                 layout (fonts, i18n provider), page, globals.css (tokens, textures, shapes, motion)
components/
  layout/            Navbar (active-section pill, progress bar, mobile sheet), Footer
  sections/          Hero, About, Expertise, Experience, Work, Reel, Toolkit, Credentials
  canvas/            useCanvas loop + AndesCanvas, TopoCanvas, ProjectCover, TimelineCanvas, ToolGlobe
  motion/            RevealObserver, Counter, Tilt
  ui/                Icons, Flag, Logo, LanguageSwitcher, SectionHeading
lib/                 dictionaries (all copy, 3 languages), i18n context, data (tools, credits), random/noise helpers
public/images/       Alex's portraits      public/media/  licensed Chilean photos & video (see CREDITS.md)
```

## Editing content

- **Copy:** `lib/dictionaries.ts` — every string exists in `en`, `pt` and `es` (TypeScript enforces matching keys).
- **Tools:** `lib/data.ts` → `TOOL_GROUPS`.
- **Case-study imagery:** each case currently opens on generative Canvas art (`components/canvas/ProjectCover.tsx`).
  To show real project screens, replace `<ProjectCover>` in `components/sections/Work.tsx` with a `next/image`.
- **Language flags:** English → United States, Português → Brasil, Español → Chile (`lib/locales.ts`).

## Notes

- Canvas pieces pause off-screen and render a still frame for `prefers-reduced-motion`.
- The Motion section's video is fetched separately: `powershell -File scripts/fetch-video.ps1`.
  Until then the program monitor shows the clip's poster frame.
