import { test, expect } from '@playwright/test';

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

test('home contains the hero and exactly three featured projects', async ({ page }) => {
  await page.goto(path('/'));
  await expect(page.locator('.hero h1')).toContainText('Data for people');
  await expect(page.locator('.project-grid--featured .project-card')).toHaveCount(3);
  await expect(page.locator('main')).not.toContainText('Blog');
  await page.getByRole('link', { name: 'Explore my projects' }).click();
  await expect(page).toHaveURL(/#featured-projects$/);
});

test('about index targets each YAML-backed section', async ({ page }) => {
  await page.goto(path('/about/'));
  for (const id of ['profile', 'focus', 'education', 'experience', 'volunteering', 'skills']) {
    await expect(page.locator(`.about-index a[href="#${id}"]`)).toHaveCount(1);
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
  await page.locator('.about-index a[href="#education"]').click();
  await expect(page).toHaveURL(/#education$/);
  await expect(page.locator('#education')).toContainText('Jun 2025');
  await expect(page.locator('#volunteering .timeline-item')).toHaveCount(4);
});

test('projects show four linked cards with covers and tags', async ({ page }) => {
  await page.goto(path('/projects/'));
  const cards = page.locator('.project-grid--all .project-card');
  await expect(cards).toHaveCount(4);
  for (const [index, name] of ['Maui', 'Mango', 'Gris', 'Axon'].entries()) {
    const card = cards.nth(index);
    await expect(card).toContainText(name);
    await expect(card).toHaveAttribute('href', /^https:\/\/github\.com\//);
    await expect(card.locator('img')).toHaveAttribute('src', /\/images\/projects\/.*\.svg$/);
    await expect(card.locator('.project-tags span').first()).toBeVisible();
  }
});

test('contact provides only the requested direct channels', async ({ page }) => {
  await page.goto(path('/contact/'));
  await expect(page.locator('.contact-list > a')).toHaveCount(3);
  await expect(page.locator('.contact-list > a').first()).toHaveAttribute('href', 'mailto:caiofbernardo@gmail.com');
  await expect(page.locator('form')).toHaveCount(0);
});

test('keyboard access and responsive widths work', async ({ page }) => {
  for (const width of [375, 768, 1440]) {
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
