import { test, expect } from '@playwright/test';
import { gotoHome, chatPanel, closeChat, openChat, isOccluded } from './helpers';

test.describe('Landing experience', () => {
  test('the visitor name is visible on arrival, not hidden behind the chat', async ({ page }) => {
    await gotoHome(page);
    const name = page.getByRole('heading', { level: 1 });
    await expect(name).toBeVisible();
    expect(await isOccluded(name), 'the <h1> name is covered by the AURA panel').toBe(false);
  });

  test('both hero calls to action are tappable on arrival', async ({ page }) => {
    await gotoHome(page);
    for (const label of ['View Projects', 'Tech Stack']) {
      const cta = page.getByRole('button', { name: label });
      expect(await isOccluded(cta), `"${label}" is covered by the AURA panel`).toBe(false);
    }
  });

  test('the opened chat runs up to the header and stops there', async ({ page }, info) => {
    await gotoHome(page);
    // Collapsed on arrival, so the landing page cannot be buried at all - the
    // two tests above cover that. What matters once it is opened is that the
    // conversation has room to be read without taking the header with it.
    await openChat(page);
    const panel = chatPanel(page);
    await expect(panel).toBeVisible();

    const box = (await panel.boundingBox())!;
    const nav = (await page.locator('nav').boundingBox())!;
    const vh = page.viewportSize()!.height;
    const below = vh - (nav.y + nav.height);
    info.annotations.push({
      type: 'panel',
      description: `${Math.round(box.height)}px, ${((box.height / vh) * 100).toFixed(0)}% of the viewport`,
    });

    expect(Math.round(box.y), 'the panel covers the top navigation').toBeGreaterThanOrEqual(
      Math.round(nav.y + nav.height) - 1,
    );
    expect(box.height, 'the panel is too short to hold a conversation').toBeGreaterThanOrEqual(
      Math.min(below * 0.8, 560),
    );

    // A phone sheet is meant to fill what is under the nav. A corner window is
    // not: something of the page stays visible above it however tall the
    // screen is.
    if (page.viewportSize()!.width >= 640) {
      expect(box.height, 'the panel runs the whole height of the page').toBeLessThan(below);
      expect(box.width, 'the panel is too narrow to hold a conversation').toBeGreaterThanOrEqual(400);
      expect(box.width, 'the panel has grown from a column into a sidebar').toBeLessThanOrEqual(560);
    }
  });

  test('the hero exposes a contact route without asking the chatbot', async ({ page }) => {
    await gotoHome(page);
    await closeChat(page);
    const mailto = page.locator('a[href^="mailto:"]');
    await expect(mailto, 'no e-mail / contact link anywhere in the UI').toHaveCount(1);
  });
});
