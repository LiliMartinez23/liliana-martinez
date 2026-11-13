# Liliana Martinez portfolio

A responsive personal portfolio with fixed left side navigation on desktop and selected bordered sections inspired by the SMARTER layout. On small screens, the Menu button opens a slide-out sidebar and the content columns stack. The home introduction, home experience section, About hero, and Blog are unboxed. Project summaries lead to native case-study dialogs.

The dark palette uses charcoal `#211F20` for the page background, cream `#E3DAC7` for text, and terracotta `#C56D3F` for accents. DM Sans is used throughout, loaded from Google Fonts with local system fallbacks.

## Preview

Requires Python and Node.js/npm to run the preview command. No dependency installation or build is needed.

```powershell
npm run preview
```

Open http://127.0.0.1:4177. The preview serves this repository's root source files directly, so edits appear after refreshing the page. Work in the existing files; no additional project folders or source copies are needed during editing.

Old `?palette=` URLs resolve to the current scheme and the palette query parameter is removed from the URL and local navigation links. Open a case study directly with `projects.html#suggestion` (also `#crop`, `#weather`, `#audit`).

## Edit

- Pages: `index.html`, `about.html`, `projects.html`, `blogs.html`, and `credits.html`.
- All styling: `css/styles.css`, including side navigation, bordered sections, project rows, dialogs, and responsive layouts.
- Shared navigation/footer, palette initialization, community event tabs, and native project dialogs: `js/site.js`.
- Project-specific interface and workflow illustrations: `img/project-*-visual.svg`, described in `credits.html`. These are conceptual visuals, not screenshots.

Shared CSS tokens define the page spacing:

- Desktop: 24px page gutters, 96px vertical and 32px horizontal section padding, and 64px between sections.
- Mobile: 16px page gutters, 64px vertical and 24px horizontal section padding, and 48px between sections. At widths of 380px or less, every section uses 16px horizontal padding.

The nine designated boxed panels use the shared `.compact-section` variant with 32px vertical padding at every screen size: Home’s Latest Project and contact panels, About’s beginning and growth panels, the four project cards, and the Projects contact panel. Their shared horizontal padding and outer section gaps stay unchanged.

Use one inner padding layer: `.panel`, the direct Home intro/experience section, or `.section-inner`. The projects collection adds no padding and uses only the shared section gap. Component spacing follows an 8px scale; sidebar dimensions are preserved independently.

About’s community event viewer places the selected event photo, title, and description on the left and clickable event titles on the right on desktop. JagHacks is selected initially; arrow keys, Home, and End switch events. Without JavaScript, all three events remain readable.

Home introduces the development work and professional experience. Its only project is Suggestion Form Generator, presented under the heading “Latest Project”. The personal introduction, portrait, and supplied ACM event photos live on About. Projects presents all four projects and their full case-study dialogs. Blog content is intentionally empty. Project descriptions are grounded in the supplied resume and earlier portfolio material.

The Web Dev Portal is an internal Web Services team portal for links, documentation, website audit reports, and other team resources. Its main developer brought Liliana into the project to develop two generators: the Audit Form for reports on team-managed websites and the Suggestion Form for team ideas about internal changes and updates. Voter Data Integrity & Audit System is an independent database project.

Liliana proposed and built the faculty image crop tool after noticing inconsistent profile image dimensions in HB2504 department listings. Its adjustable crop preserves a fixed 1:1 aspect ratio so faculty profiles have uniform dimensions.

## Optional export

The existing `npm run build` command uses Node.js to create a static export in `dist/`. It copies the five pages, shared CSS and JavaScript, the resume, and only the images referenced by the pages. This export is optional and is not used by the source preview. The build does not push the GitHub remote or publish the site.
