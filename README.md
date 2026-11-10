# Liliana Martinez portfolio · palette demo

A static, responsive portfolio with the final Cream & midnight palette: primary `#FFF9F1`, secondary `#16222D`, and accent `#9A694E`. This uses the last shortlisted scheme with the warm cream from the first scheme, then swaps the primary and secondary roles so the main surface is light.

## Run

Requires Node.js for the static build and Python for the local preview. No dependency installation is required for this build.

```powershell
npm run build
npm run preview
```

Open http://127.0.0.1:4177. Old palette URLs resolve to the final palette (`?palette=6`). Open a case study directly with `projects.html#suggestion` (also `#crop`, `#weather`, `#audit`).

## Edit

- Pages: `index.html`, `about.html`, `projects.html`, `blogs.html`.
- All styling: `css/styles.css`. Headings use Noto Serif; body text uses Inter, loaded from Google Fonts with local fallbacks.
- Palette definitions, shared navigation/footer, and native project dialogs: `js/site.js`.
- Color tokens: `--primary`, `--secondary`, `--accent`; readable derived tokens: `--on-accent`, `--accent-ink`, `--accent-on-secondary`, `--line`, `--soft`.
- Project-specific interface and workflow illustrations: `img/project-*-visual.svg`, described in `credits.html`. These are conceptual visuals, not screenshots.

Home introduces the development work and includes a dedicated Professional Experience section. The personal introduction, portrait, and supplied ACM event photos live on About. Projects features Suggestion Form Generator, followed by a responsive two-column grid for the remaining three projects. Blog content is intentionally empty. Project descriptions are grounded in the supplied resume and earlier portfolio material.

The build copies only the images referenced by the pages. Unused stock assets and recovered source screenshots stay out of the published output.

Publishing uses the existing Sites demo identity in a separate source checkout. The GitHub remote is not automatically pushed by the build.
