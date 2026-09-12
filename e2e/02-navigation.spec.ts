import { test, expect } from '@playwright/test';
import { gotoHome, closeChat, askAura, activeView } from './helpers';

const VIEWS = [
  { nav: 'PROJECTS', heading: 'PROJECT NODES' },
  { nav: 'SKILLS', heading: 'SKILL MATRIX PROJECTION' },
  { nav: 'HISTORY', heading: 'TEMPORAL LOGS' },
  { nav: 'GALLERY', heading: 'IMAGE ARCHIVE' },
];

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await gotoHome(page);
    await closeChat(page);
  });

  for (const { nav, heading } of VIEWS) {
    test(`${nav} opens its view`, async ({ page }) => {
      const isMobile = page.viewportSize()!.width < 768;
      if (isMobile) await page.getByRole('button', { name: 'Toggle navigation' }).click();
      await page.getByRole('button', { name: nav, exact: true }).first().click();
      await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    });
  }

  test('each view is deep-linkable and survives a reload', async ({ page }) => {
    const isMobile = page.viewportSize()!.width < 768;
    if (isMobile) await page.getByRole('button', { name: 'Toggle navigation' }).click();
    await page.getByRole('button', { name: 'PROJECTS', exact: true }).first().click();
    await expect(page.getByRole('heading', { name: 'PROJECT NODES' })).toBeVisible();

    const url = page.url();
    expect(url, 'the URL never changes, so views cannot be shared or bookmarked').toContain('projects');

    await page.reload();
    await expect(page.getByRole('heading', { name: 'PROJECT NODES' })).toBeVisible();
  });

  test('the browser back button returns to the previous view', async ({ page }) => {
    const isMobile = page.viewportSize()!.width < 768;
    if (isMobile) await page.getByRole('button', { name: 'Toggle navigation' }).click();
    await page.getByRole('button', { name: 'SKILLS', exact: true }).first().click();
    await expect(page.getByRole('heading', { name: 'SKILL MATRIX PROJECTION' })).toBeVisible();
    await page.goBack();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('every view exposes exactly one level-1 heading', async ({ page }) => {
    const isMobile = page.viewportSize()!.width < 768;
    for (const { nav, heading } of VIEWS) {
      if (isMobile) await page.getByRole('button', { name: 'Toggle navigation' }).click();
      await page.getByRole('button', { name: nav, exact: true }).first().click();
      await expect(page.getByRole('heading', { name: heading })).toBeVisible();
      await expect(page.getByRole('heading', { level: 1 }), `${nav} has no <h1>`).toHaveCount(1);
    }
  });
});

test.describe('Chat-driven navigation', () => {
  test('a negated request does not hijack the view', async ({ page }) => {
    await gotoHome(page);
    await askAura(page, 'I am not interested in your projects, tell me about yourself');
    expect(await activeView(page), 'substring matching ignores negation').not.toBe('PROJECTS');
  });

  test('asking how to get in touch surfaces the e-mail address', async ({ page }) => {
    await gotoHome(page);
    await askAura(page, 'how can I contact you?');
    await expect(page.locator('text=satpaingoo777@gmail.com')).toBeVisible();
  });
});
