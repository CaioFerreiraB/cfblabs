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
| `src/data/blog.yml` | Blog banner and post categories |

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

## Blog

Posts are Markdown files in `src/content/blog/<locale>/<slug>.md`, where `<locale>` is `pt` or `en`. A translation uses the same file name in the other locale folder, so both versions share the slug and the language switch links them. A post that exists in only one language is fine; its language switch leads to the other blog index. The front matter is validated in `src/content.config.ts`:

```md
---
title: Welcome to the blog
description: Shown on the blog list and in search results.
pubDate: 2026-11-17
category: environment          # an id from src/data/blog.yml
tags: [Data, Climate]          # optional
cover: /images/blog/cover.webp # optional, must exist in public/
coverAlt: Describe the image   # optional
draft: false                   # true keeps the post off the published site
---
```

Drafts appear in `npm run dev` but are excluded from `npm run build`. Blog images live in `public/images/blog/`; a post without a cover shows a gradient in its category color.

`src/data/blog.yml` holds the blog banner (title, description, background image) and the categories (id, label in both languages, and a dark color used for the badge text). The blog index filters by category and searches titles, summaries, and tags in the browser. Reading time is estimated at 200 words per minute, the article sidebar lists its `##` headings, and each language has an RSS feed at `/rss.xml` and `/pt/rss.xml`.

### Online editor

The site ships [Sveltia CMS](https://sveltiacms.app/) at `https://cfblabs.com.br/admin/` (configured in `public/admin/config.yml`). Each save is a commit to `main`, so the deployment workflow builds, tests, and publishes the change in a few minutes. A failing build is not deployed.

Portuguese is the editor's default locale, which Sveltia always keeps enabled: every post created in the editor has a Portuguese version, and the English version can be switched off until it is translated. An English-only post has to be added as a file in `src/content/blog/en/`. The editor's preview links use `/{{locale}}/blog/<slug>/`; `astro.config.mjs` redirects `/en/blog/<slug>/` to the English post at `/blog/<slug>/`.

Sign-in uses a GitHub fine-grained personal access token:

1. Open GitHub → Settings → Developer settings → Fine-grained tokens → Generate new token.
2. Set **Repository access** to *Only select repositories* → `CaioFerreiraB/cfblabs`.
3. Under **Repository permissions**, set **Contents** to *Read and write* (Metadata read-only is added automatically).
4. Choose an expiration date, generate the token, and paste it into the editor's *Sign in with token* option.

The token stays in that browser's local storage; sign out on shared computers and revoke the token in GitHub if it leaks. The CMS script is pinned to an exact version with Subresource Integrity in `public/admin/index.html`; to upgrade, change the version and replace the `integrity` hash with the SHA-384 of the new `dist/sveltia-cms.js`.

The editor uses the site's brand theme: a `<style>` block in `public/admin/index.html` sets Manrope (served from `public/admin/manrope.woff2`), the brand blue, a navy dark mode, and a document-style writing surface for the post body. It overrides Sveltia UI's internal `--sui-*` design tokens and the `.lexical-root` editor class, which are not a public API, so open `/admin/` in both light and dark mode after every Sveltia upgrade.

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
