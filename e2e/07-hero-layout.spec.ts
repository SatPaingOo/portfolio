import { test, expect } from '@playwright/test';
import { gotoHome, closeChat } from './helpers';

/**
 * Regression cover for three reported defects:
 *  - the home view demanded a scroll even when the window had room to spare
 *  - the hero buttons fell past the bottom edge of the viewport
 *  - the hero head failed to render (first a canvas left at its unsized
 *    300x150 default, now the hologram SVG served from public/)
 */
const overflowOf = (page: import('@playwright/test').Page) =>
  page.evaluate(() => {
    const m = document.querySelector('main')!;
    return m.scrollHeight - m.clientHeight;
  });

test.describe('Hero layout', () => {
  // Layout checks do not need the 3D head animating. Under reduced motion it
  // renders on demand, which keeps several headless browsers running software
  // WebGL from starving each other of CPU and timing tests out.
  test.use({ reducedMotion: 'reduce' });

  /**
   * Sizes chosen because each one has room for the hero. A 393x727 phone does
   * not: the summary alone runs 250px there, so a short scroll is honest and is
   * covered by the reachability test below instead.
   */
  const ROOMY = [
    { w: 1440, h: 900, label: 'desktop' },
    { w: 1280, h: 620, label: 'short laptop' },
    { w: 1024, h: 768, label: 'small laptop' },
    { w: 375, h: 812, label: 'iPhone X' },
  ];

  for (const { w, h, label } of ROOMY) {
    test(`home fits a ${label} window with no vertical scroll`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      await gotoHome(page);
      await closeChat(page);
      expect(await overflowOf(page), `${w}x${h} is forced into a scrollbar`).toBeLessThanOrEqual(0);
    });
  }

  test('a short phone scrolls, and both buttons stay reachable', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 727 });
    await gotoHome(page);
    await closeChat(page);
    for (const label of ['View Projects', 'Tech Stack']) {
      const btn = page.getByRole('button', { name: label });
      await btn.scrollIntoViewIfNeeded();
      await expect(btn).toBeInViewport();
    }
  });

  test('both hero buttons sit fully inside the viewport', async ({ page }) => {
    test.skip(page.viewportSize()!.height < 760, 'covered by the short-phone reachability test');
    await gotoHome(page);
    await closeChat(page);
    const vh = page.viewportSize()!.height;
    for (const label of ['View Projects', 'Tech Stack']) {
      const box = (await page.getByRole('button', { name: label }).boundingBox())!;
      expect(box.y + box.height, `"${label}" extends past the bottom edge`).toBeLessThanOrEqual(vh);
    }
  });

  test('the lower hero button clears the collapsed chat bubble', async ({ page }) => {
    test.skip(page.viewportSize()!.height < 760, 'the hero scrolls on a short phone');
    await gotoHome(page);
    await closeChat(page);
    // The wrapper animates from full-height panel to bubble over 500ms; measure
    // once it has landed or the bubble is still caught near the top of the page.
    await page.waitForTimeout(900);
    const clearance = await page.evaluate(() => {
      const btns = [...document.querySelectorAll('button')].filter((b) => /View Projects|Tech Stack/.test(b.textContent || ''));
      const lowest = Math.max(...btns.map((b) => b.getBoundingClientRect().bottom));
      const bubble = [...document.querySelectorAll('button')].find((b) => b.className.includes('rounded-full glass-panel'));
      const top = bubble ? bubble.getBoundingClientRect().top : innerHeight;
      return Math.round(top - lowest);
    });
    expect(clearance, 'the buttons run into the AURA bubble').toBeGreaterThan(0);
  });

  test('the hero buttons share one width', async ({ page }) => {
    test.skip(page.viewportSize()!.width >= 640, 'stacked full-width only below sm');
    await gotoHome(page);
    await closeChat(page);
    const widths = await page.evaluate(() =>
      [...document.querySelectorAll('button')]
        .filter((b) => /View Projects|Tech Stack/.test(b.textContent || ''))
        .map((b) => Math.round(b.getBoundingClientRect().width))
    );
    expect(new Set(widths).size, `ragged button widths: ${widths}`).toBe(1);
  });

  test('the hero head box renders square', async ({ page }) => {
    await gotoHome(page);
    const head = page.getByTestId('hero-head');
    await expect(head).toBeVisible();
    const box = (await head.boundingBox())!;
    expect(Math.round(box.width), 'the head box is not square').toBe(Math.round(box.height));
    expect(box.width).toBeGreaterThanOrEqual(90);
  });

  test('the 3D head takes over from the SVG placeholder and fills the box', async ({ page }) => {
    await gotoHome(page);
    const head = page.getByTestId('hero-head');
    const canvas = head.locator('canvas');
    await expect(canvas, 'three.js never mounted; the SVG placeholder is still showing').toBeVisible({ timeout: 15000 });

    // Compare against the head box rather than "not 300": the box is capped at
    // exactly 300px on tablet, the same width as the unsized canvas default.
    // Height is the real signal (150 unsized, square when sized). Poll, because
    // react-three-fiber sizes the canvas from a ResizeObserver callback that
    // lands a frame or two after mount.
    const hb = (await head.boundingBox())!;
    const want = `${Math.round(hb.width)}x${Math.round(hb.height)}`;
    await expect
      .poll(
        async () => {
          const b = (await canvas.boundingBox())!;
          return `${Math.round(b.width)}x${Math.round(b.height)}`;
        },
        { message: 'react-three-fiber never sized the canvas to the head box', timeout: 5000 }
      )
      .toBe(want);
  });

  test('the hero head shrinks with viewport height', async ({ page }) => {
    const measure = async () => {
      await gotoHome(page);
      const box = (await page.getByTestId('hero-head').boundingBox())!;
      return Math.round(box.height);
    };
    await page.setViewportSize({ width: 1280, height: 900 });
    const tall = await measure();
    await page.setViewportSize({ width: 1280, height: 560 });
    const short = await measure();
    expect(short, `head stayed at ${short}px on a short window (${tall}px on a tall one)`).toBeLessThan(tall);
  });

  test('the hero renders without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(e.message));
    await gotoHome(page);
    await page.waitForTimeout(2000);
    expect(errors).toEqual([]);
  });
});
