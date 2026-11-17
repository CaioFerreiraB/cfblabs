# Portfolio requirements

## Scope

- R1: Publish a responsive English and Portuguese static portfolio with Home, About, Projects, and Contact routes. English is the default locale.
- R2: Show the hero, an About summary, and three featured projects on Home.
- R3: Generate each About section from its own YAML file and provide an anchor index. Professional and research experience use separate files and sections.
- R4: Render all projects from one YAML list. Each card includes a cover, name, short description, tags, and a working destination link.
- R5: Show email, LinkedIn, and GitHub on Contact. No contact form is included.
- R6: Maintain the brand, contact details, hero text, and hero image path in `site.yml`.
- R7: Validate source content during the build and report the file and field on failure.
- R8: Prepare GitHub Pages deployment and a later custom-domain cutover.
- R9: Keep source code and technical documentation in English; Portuguese is limited to visitor-facing translations.
- R10: Publish a bilingual blog from Markdown files in `src/content/blog/<locale>/`. A post may exist in one or both languages; translations share a slug. Drafts are not published. The index has a banner, category filters, search, and an RSS feed; articles show the author, reading time, share links, and a table of contents.
- R11: Provide a browser-based editor at `/admin/` (Sveltia CMS) that commits posts and images to `main` after signing in with a GitHub personal access token.

## Acceptance criteria

- A1: All Home, About, Projects, Blog, and Contact routes build in both languages, and their navigation and language switches resolve to the corresponding pages.
- A2: Home shows exactly three featured cards; Projects shows exactly four linked cards.
- A3: Every About index link targets a visible section generated from the matching YAML file.
- A4: Required translation, date, URL, and image errors fail the build with an actionable location.
- A5: Keyboard navigation, focus indicators, readable text, and mobile/tablet/desktop layouts work.
- A6: GitHub Actions runs content validation, build, and Playwright tests before deployment.
- A7: The blog lists published posts newest first, each post links to its translation when one exists, and otherwise the language switch leads to the other blog index.
