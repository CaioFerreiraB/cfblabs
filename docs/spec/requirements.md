# Portfolio requirements

## Scope

- R1: Publish a responsive English and Portuguese static portfolio with Home, About, Projects, and Contact routes. English is the default locale.
- R2: Keep Home limited to the hero and three featured projects.
- R3: Generate each About section from its own YAML file and provide an anchor index.
- R4: Render all projects from one YAML list. Each card includes a cover, name, short description, tags, and a working destination link.
- R5: Show email, LinkedIn, and GitHub on Contact. No form or blog is included in version one.
- R6: Maintain the brand, contact details, hero text, and hero image path in `site.yml`.
- R7: Validate source content during the build and report the file and field on failure.
- R8: Prepare GitHub Pages deployment and a later custom-domain cutover.
- R9: Keep source code and technical documentation in English; Portuguese is limited to visitor-facing translations.

## Acceptance criteria

- A1: All eight routes build and their navigation and language switches resolve to the corresponding pages.
- A2: Home shows exactly three featured cards; Projects shows exactly four linked cards.
- A3: Every About index link targets a visible section generated from the matching YAML file.
- A4: Required translation, date, URL, and image errors fail the build with an actionable location.
- A5: Keyboard navigation, focus indicators, readable text, and mobile/tablet/desktop layouts work.
- A6: GitHub Actions runs content validation, build, and Playwright tests before deployment.
