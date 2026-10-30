# Caio Ferreira portfolio

A bilingual, static portfolio built with Astro and deployed to GitHub Pages.

## Development

Use Node.js 24 (`nvm use`), then run:

```sh
npm ci
npm run dev
```

Content lives in `src/data/*.yml`. All code, configuration keys, test names, and technical documentation are written in English. Portuguese appears only in visitor-facing translations.

## Content and images

| File | What it controls |
| --- | --- |
| `src/data/site.yml` | Brand, contact links, hero content, and Home about summary |
| `src/data/footer.yml` | Footer call, title, subtitle, and contact button label |
| `src/data/profile.yml` | About page introduction, portrait, location, and focus areas |
| `src/data/education.yml` | Education entries |
| `src/data/experience.yml` | Professional experience entries |
| `src/data/research.yml` | Research experience entries |
| `src/data/volunteering.yml` | Volunteer work entries |
| `src/data/skills.yml` | Skill groups and items |
| `src/data/projects.yml` | Project cards, links, photo or logo covers, tags, and featured status |

Place images in `public/images/hero/`, `public/images/profile/`, `public/images/projects/`, or `public/images/logos/`. The current project SVG files are placeholders. Reference a file from YAML with its public URL path, for example `image: /images/hero/my-photo.webp`, `photo: /images/profile/portrait.jpg`, or `logo: /images/logos/institution.svg`. Project entries marked `featured: true` appear on Home.

For a project cover, choose one of these shapes in `projects.yml`:

```yml
cover:
  type: photo
  photo: /images/projects/my-photo.webp
```

```yml
cover:
  type: logo
  logo: /images/logos/my-project.svg
  backgroundColor: '#123456'
```

Keep both `en` and `pt` values for translated fields. Image paths must point to existing local SVG, PNG, JPEG, or WebP files. Run `npm run check` and `npm run build` after content changes.

The hero title and subtitle are lists of text segments in each language. Add `color: '#52dfb1'` to any segment to color that word or phrase; omit `color` for the default white. Keep spaces inside segment text where words meet. The Home summary, education/experience/interests highlights, and Beyond work heading and link are editable in `site.yml`. Beyond work entries come from `profile.yml` focus areas. Their `icon` values use the available names in `src/components/Icon.astro`.

## Validation

```sh
npm run check
npm run build
npx playwright install chromium
npm run test:e2e
```

The YAML parser validates required fields, dates, URLs, locale strings, and local image paths during the build.

## Development tools

Playwright Test is a project dependency. Install Graphify and run `graphify codex install` to enable its project guidance; run `graphify update .` after code changes. Install Ponytail as a Codex plugin with `codex plugin marketplace add DietrichGebert/ponytail` and `codex plugin add ponytail@ponytail`. Both tools are for development and are excluded from the published site.

## Deployment

The GitHub Actions workflow builds and tests every pull request targeting `main`, but does not deploy it. A successful push to `main`, including a merged pull request, automatically deploys `dist/` to GitHub Pages. Manual `workflow_dispatch` runs also deploy. The site uses `https://cfblabs.com.br` with HTTPS enforcement enabled.

See [the custom-domain cutover guide](docs/domain-cutover.md) for the exact DNS records and verification sequence.
