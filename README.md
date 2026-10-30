# Caio Ferreira portfolio

A bilingual, static portfolio built with Astro and deployed to GitHub Pages.

## Development

Use Node.js 24 (`nvm use`), then run:

```sh
npm ci
npm run dev
```

Content lives in `src/data/*.yml`. All code, configuration keys, test names, and technical documentation are written in English. Portuguese appears only in visitor-facing translations.

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

The GitHub Actions workflow builds and tests before deploying the `dist/` directory. It now targets `https://cfblabs.com.br` at the domain root. GitHub Pages has the custom domain configured; Cloudflare DNS and HTTPS certificate issuance are the remaining cutover steps.

See [the custom-domain cutover guide](docs/domain-cutover.md) for the exact DNS records and verification sequence.
