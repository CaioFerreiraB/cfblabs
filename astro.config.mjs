import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://cfblabs.com.br',
  base: process.env.BASE_PATH ?? '/',
  output: 'static',
  trailingSlash: 'always',
  // English posts live at the site root; this gives the editor's /{{locale}}/ preview links a valid English target.
  redirects: { '/en/blog/[slug]': '/blog/[slug]' },
});
