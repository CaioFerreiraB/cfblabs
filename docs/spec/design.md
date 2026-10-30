# Design and technical decisions

- Use Astro static output, without a server or client framework. YAML is parsed at build time and validated with Zod.
- Use one shared view per route and a thin page wrapper per locale. Store all visitor-facing interface strings in the translation dictionary.
- Use a dark scenic hero, a restrained blue accent, light content surfaces, and compact project cards to follow the supplied mockup.
- Treat all current images as local placeholders under `public/images/`; replace them through YAML paths later.
- Use `@lucide/astro` icons from a fixed map of supported YAML names so configuration cannot inject arbitrary markup.
- Keep the temporary GitHub Pages project path configurable through `BASE_PATH`; switch it to `/` at custom-domain cutover.
- Use direct links for contact and project cards. Open project repositories in a new tab with a descriptive accessible label.
