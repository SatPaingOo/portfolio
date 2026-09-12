import { test, expect } from '@playwright/test';
import { gotoHome, chatPanel, closeChat, isOccluded } from './helpers';

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

  test('the chat panel covers at most half of the viewport height', async ({ page }, info) => {
    await gotoHome(page);
    const panel = chatPanel(page);
    await expect(panel).toBeVisible();
    const box = (await panel.boundingBox())!;
    const vh = page.viewportSize()!.height;
    const share = box.height / vh;
    info.annotations.push({ type: 'coverage', description: `${(share * 100).toFixed(0)}% of viewport height` });
    expect(share, 'chat panel swallows the landing page').toBeLessThanOrEqual(0.5);
  });

  test('the hero exposes a contact route without asking the chatbot', async ({ page }) => {
    await gotoHome(page);
    await closeChat(page);
    const mailto = page.locator('a[href^="mailto:"]');
    await expect(mailto, 'no e-mail / contact link anywhere in the UI').toHaveCount(1);
  });
});
