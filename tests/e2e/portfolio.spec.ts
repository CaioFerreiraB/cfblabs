import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import YAML from 'yaml';

const base = (process.env.BASE_PATH ?? '').replace(/\/$/, '');
const path = (route: string) => `${base}${route}`;

test('all eight routes render and language switching preserves the page', async ({ page }) => {
  const routes = ['/', '/about/', '/projects/', '/contact/'];
  for (const route of routes) {
    await page.goto(path(route));
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main h1')).toBeVisible();
    await page.locator('.language-switch').click();
    await expect(page).toHaveURL(new RegExp(`${path(`/pt${route}`)}$`));
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt');
    await expect(page.locator('main h1')).toBeVisible();
  }
});

test('home shows configurable hero, about summary, and three featured projects', async ({ page }) => {
  await page.goto(path('/'));
  await expect(page.locator('.hero-eyebrow')).toHaveText("HI, I'M");
  const site = YAML.parse(readFileSync('src/data/site.yml', 'utf8'));
  await expect(page.locator('.hero h1')).toHaveText(site.hero.title.en.map((segment: { text: string }) => segment.text).join(''));
  await expect(page.locator('.hero-subtitle')).toContainText('impact.');
  await expect(page.locator('.hero-subtitle span').last()).toHaveCSS('color', 'rgb(82, 223, 177)');
  await expect(page.locator('.home-about-highlight')).toHaveCount(3);
  const profile = YAML.parse(readFileSync('src/data/profile.yml', 'utf8'));
  await expect(page.locator('.home-beyond strong')).toHaveText(profile.focusAreas.map((area: { label: { en: string } }) => area.label.en));
  await expect(page.locator('.home-beyond small')).toHaveText(profile.focusAreas.map((area: { detail: { en: string } }) => area.detail.en));
  await expect(page.locator('.hero-focus')).toHaveCount(0);
  await expect(page.locator('.project-grid--featured .project-card')).toHaveCount(3);
  await expect(page.locator('main')).not.toContainText('Blog');
  await page.getByRole('link', { name: 'Explore my projects' }).click();
  await expect(page).toHaveURL(/#featured-projects$/);
  await page.goto(path('/pt/'));
  await expect(page.locator('.hero-eyebrow')).toHaveText('OI! EU SOU');
  await expect(page.locator('.hero-subtitle')).toContainText('impacto.');
  await expect(page.locator('.home-beyond h3')).toHaveText('Além do trabalho');
  await expect(page.locator('.home-beyond strong')).toHaveText(profile.focusAreas.map((area: { label: { pt: string } }) => area.label.pt));
});

test('footer shows editable contact copy and direct social links', async ({ page }) => {
  await page.goto(path('/'));
  await expect(page.locator('.footer-call')).toHaveText("LET'S TALK?");
  await expect(page.locator('.footer-copy h2')).toHaveText('Ideas, projects, or opportunities?');
  await expect(page.locator('.footer-social a')).toHaveCount(3);
  await expect(page.locator('.footer-social a').first()).toHaveAttribute('href', 'mailto:caiofbernardo@gmail.com');
  await expect(page.locator('.site-footer')).toHaveCSS('background-color', 'rgb(6, 24, 43)');
  await expect(page.locator('.site-footer')).toHaveCSS('background-image', 'none');
  await expect(page.locator('.footer-contours')).toHaveCount(0);
  await expect(page.locator('.footer-social a[aria-label="LinkedIn"] img')).toHaveAttribute('src', /linkedin-in-white\.png$/);
  await expect.poll(() => page.locator('.footer-social a[aria-label="LinkedIn"] img').evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  const githubIcon = page.locator('.footer-social a[aria-label="GitHub"] img');
  await expect(githubIcon).toHaveAttribute('src', /github-invertocat-white\.svg$/);
  await expect.poll(() => githubIcon.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  const emailLink = page.locator('.footer-social a').first();
  await emailLink.hover();
  await expect(emailLink.locator('svg')).toHaveCSS('color', 'rgb(233, 242, 248)');
});

test('about index targets each YAML-backed section', async ({ page }) => {
  await page.goto(path('/about/'));
  for (const id of ['profile', 'focus', 'education', 'experience', 'research', 'volunteering', 'skills']) {
    await expect(page.locator(`.about-index a[href="#${id}"]`)).toHaveCount(1);
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
  await page.locator('.about-index a[href="#education"]').click();
  await expect(page).toHaveURL(/#education$/);
  await expect(page.locator('#education')).toContainText('Jun 2025');
  await expect(page.locator('#experience .timeline-item')).toHaveCount(5);
  await expect(page.locator('#research .timeline-item')).toHaveCount(2);
  await expect(page.locator('#research')).toContainText('Lancaster University');
  await expect(page.locator('#volunteering .timeline-item')).toHaveCount(4);
  await page.goto(path('/pt/about/'));
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator('#experience h2')).toHaveText('Experiência profissional');
  await expect(page.locator('#research h2')).toHaveText('Experiência em pesquisa');
  await expect(page.locator('#research .timeline-item')).toHaveCount(2);
  await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }));
  await expect(page.locator('.about-index p')).toHaveText('Nesta página');
  const indexTitleTop = await page.locator('.about-index p').evaluate((element) => element.getBoundingClientRect().top);
  const headerBottom = await page.locator('.site-header').evaluate((element) => element.getBoundingClientRect().bottom);
  expect(indexTitleTop).toBeGreaterThan(headerBottom);
});

test('projects show four linked cards with covers and tags', async ({ page }) => {
  await page.goto(path('/projects/'));
  const cards = page.locator('.project-grid--all .project-card');
  await expect(cards).toHaveCount(4);
  for (const [index, [name, logo, color]] of [
    ['Maui', 'maui.png', 'rgb(236, 250, 247)'],
    ['Mango', 'mango-logo.png', 'rgb(255, 246, 236)'],
    ['Gris', 'gris.png', 'rgb(255, 255, 255)'],
    ['Axon', 'axon-lockup-dark.svg', 'rgb(20, 32, 61)'],
  ].entries()) {
    const card = cards.nth(index);
    await expect(card).toContainText(name);
    await expect(card).toHaveAttribute('href', /^https:\/\/github\.com\//);
    await expect(card.locator('.project-card-image')).toHaveClass(/project-card-image--logo/);
    await expect(card.locator('.project-card-image')).toHaveCSS('background-color', color);
    await expect(card.locator('.project-card-image')).toHaveCSS('background-image', 'none');
    await expect(card.locator('img')).toHaveAttribute('src', new RegExp(`/images/logos/${logo.replace('.', '\\.')}$`));
    await expect.poll(() => card.locator('img').evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
    await expect(card.locator('.project-tags span').first()).toBeVisible();
  }
});

test('contact provides only the requested direct channels', async ({ page }) => {
  await page.goto(path('/contact/'));
  await expect(page.locator('.contact-list > a')).toHaveCount(3);
  await expect(page.locator('.contact-list > a').first()).toHaveAttribute('href', 'mailto:caiofbernardo@gmail.com');
  const linkedInIcon = page.locator('.contact-list > a').nth(1).locator('img');
  await expect(linkedInIcon).toHaveAttribute('src', /linkedin-in-blue\.png$/);
  await expect.poll(() => linkedInIcon.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  const githubIcon = page.locator('.contact-list > a').nth(2).locator('img');
  await expect(githubIcon).toHaveAttribute('src', /github-invertocat-black\.svg$/);
  await expect.poll(() => githubIcon.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  await expect(page.locator('form')).toHaveCount(0);
});

test('keyboard access and responsive widths work', async ({ page }) => {
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(path('/'));
    await expect(page.locator('.hero h1')).toBeVisible();
    const overflowing = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflowing, `Horizontal overflow at ${width}px`).toBe(false);
    if (width === 375) {
      await page.locator('.mobile-navigation summary').click();
      await expect(page.locator('.mobile-navigation nav a')).toHaveCount(4);
    }
  }
  await page.goto(path('/'));
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
});

test('navigation stays fixed while scrolling', async ({ page }) => {
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 400 });
    await page.goto(path('/'));
    const header = page.locator('.site-header');
    const boundary = await page.evaluate(() => document.querySelector('.hero')!.clientHeight - document.querySelector('.site-header')!.clientHeight);
    await expect(header).toHaveCSS('position', 'fixed');
    await expect(header).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(header).toHaveCSS('transition-property', /background-color/);
    await page.evaluate(() => window.scrollTo({ top: 20, behavior: 'instant' }));
    await expect(header).toHaveClass(/site-header--tinted/);
    await expect(header).toHaveCSS('background-color', 'rgba(6, 24, 43, 0.78)');
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), boundary - 20);
    await expect(header).not.toHaveClass(/site-header--scrolled/);
    await expect(header).toHaveCSS('background-color', 'rgba(6, 24, 43, 0.78)');
    await expect(header).toHaveCSS('backdrop-filter', 'blur(10px)');
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), boundary + 20);
    await expect(header).toHaveClass(/site-header--scrolled/);
    await expect(header).toHaveCSS('background-color', 'rgb(6, 24, 43)');
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await expect(header).not.toHaveClass(/site-header--tinted|site-header--scrolled/);
    await expect(header).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    expect(await header.evaluate((element) => element.getBoundingClientRect().top)).toBe(0);

    await page.goto(path('/about/'));
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
    expect(await page.locator('.site-header').evaluate((element) => element.getBoundingClientRect().top)).toBe(0);
  }
});

test('footer remains readable and profile photo responds to the pointer', async ({ page }) => {
  await page.goto(path('/about/'));
  await expect(page.locator('.site-footer')).toHaveCSS('font-size', '15px');
  const portrait = page.locator('.portrait-hitbox');
  const restingTransform = await portrait.locator('.portrait-wrap').evaluate((element) => getComputedStyle(element).transform);
  await page.evaluate(() => window.scrollTo({ top: 80, behavior: 'instant' }));
  await expect(portrait.locator('.portrait-wrap')).toHaveCSS('transform', restingTransform);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  const bounds = await portrait.boundingBox();
  expect(bounds).not.toBeNull();
  await page.mouse.move(bounds!.x + 8, bounds!.y + 8);
  await expect.poll(() => portrait.evaluate((element) => Number.parseFloat(element.style.getPropertyValue('--tilt-x')))).toBeGreaterThan(6);
  await expect.poll(() => portrait.evaluate((element) => Number.parseFloat(element.style.getPropertyValue('--tilt-y')))).toBeLessThan(-6);
  await page.mouse.move(bounds!.x + bounds!.width - 8, bounds!.y + bounds!.height - 8);
  await expect.poll(() => portrait.evaluate((element) => Number.parseFloat(element.style.getPropertyValue('--tilt-x')))).toBeLessThan(-6);
  await expect.poll(() => portrait.evaluate((element) => Number.parseFloat(element.style.getPropertyValue('--tilt-y')))).toBeGreaterThan(6);
  await page.mouse.move(0, 0);
  await expect.poll(() => portrait.evaluate((element) => element.style.getPropertyValue('--tilt-x'))).toBe('');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await portrait.hover();
  await expect(portrait.locator('.portrait-wrap')).toHaveCSS('transform', 'none');
});
