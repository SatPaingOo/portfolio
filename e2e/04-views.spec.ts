import { test, expect } from '@playwright/test';
import { gotoHome, closeChat } from './helpers';

async function open(page: import('@playwright/test').Page, nav: string) {
  await gotoHome(page);
  await closeChat(page);
  if (page.viewportSize()!.width < 768) {
    await page.getByRole('button', { name: 'Toggle navigation' }).click();
  }
  await page.getByRole('button', { name: nav, exact: true }).first().click();
}

/** Group the cards by the grid row they render on. */
const cardRows = (page: import('@playwright/test').Page) =>
  page.evaluate(() => {
    const rows = new Map<number, { h: number; footerTop: number; title: string }[]>();
    for (const card of document.querySelectorAll('article')) {
      const r = card.getBoundingClientRect();
      const f = card.querySelector('footer')!.getBoundingClientRect();
      const key = Math.round(r.top / 5) * 5;
      const entry = { h: Math.round(r.height), footerTop: Math.round(f.top - r.top), title: card.querySelector('h3')!.textContent!.trim().slice(0, 32) };
      rows.set(key, [...(rows.get(key) ?? []), entry]);
    }
    return [...rows.values()];
  });

test.describe('Projects view', () => {
  test('cards in a row share one height', async ({ page }) => {
    await open(page, 'PROJECTS');
    const rows = await cardRows(page);
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      const spread = Math.max(...row.map((c) => c.h)) - Math.min(...row.map((c) => c.h));
      expect(spread, `ragged card heights in a row: ${JSON.stringify(row)}`).toBeLessThanOrEqual(1);
    }
  });

  test('card actions land on a common baseline', async ({ page }) => {
    await open(page, 'PROJECTS');
    const rows = await cardRows(page);
    for (const row of rows) {
      const spread = Math.max(...row.map((c) => c.footerTop)) - Math.min(...row.map((c) => c.footerTop));
      expect(spread, `footers float at different heights (mt-auto needs a flex column): ${JSON.stringify(row)}`).toBeLessThanOrEqual(1);
    }
  });

  test('every card ends with an action row, links or not', async ({ page }) => {
    await open(page, 'PROJECTS');
    const cards = page.locator('article');
    const n = await cards.count();
    expect(n).toBeGreaterThan(0);
    for (let i = 0; i < n; i++) {
      await expect(cards.nth(i).locator('footer'), `card ${i + 1} has no footer`).toHaveCount(1);
    }
  });

  test('long copy is clamped so one entry cannot stretch a row', async ({ page }) => {
    await open(page, 'PROJECTS');
    const unclamped = await page.evaluate(() =>
      [...document.querySelectorAll('article p')]
        .filter((p) => (p.textContent || '').length > 90)
        .filter((p) => !getComputedStyle(p).webkitLineClamp || getComputedStyle(p).webkitLineClamp === 'none')
        .map((p) => (p.textContent || '').slice(0, 40))
    );
    expect(unclamped, 'unclamped paragraphs will blow out the card grid').toEqual([]);
  });

  test('no project card is hidden behind the chat panel', async ({ page }) => {
    test.skip(page.viewportSize()!.width < 1024, 'single column below lg');
    await gotoHome(page);
    await page.getByRole('button', { name: 'PROJECTS', exact: true }).first().click();
    const hidden = await page.evaluate(() =>
      [...document.querySelectorAll('article')]
        .filter((c) => {
          const r = c.getBoundingClientRect();
          if (r.top > innerHeight || r.bottom < 0) return false;
          const hit = document.elementFromPoint(r.x + r.width / 2, Math.max(8, r.y + 20));
          return !(hit === c || c.contains(hit));
        })
        .map((c) => c.querySelector('h3')!.textContent!.trim().slice(0, 40))
    );
    expect(hidden, 'the AURA panel covers the third grid column').toEqual([]);
  });

  test('external project links open safely', async ({ page }) => {
    await open(page, 'PROJECTS');
    const links = page.locator('a[target="_blank"]');
    const n = await links.count();
    expect(n).toBeGreaterThan(0);
    for (let i = 0; i < n; i++) {
      await expect(links.nth(i)).toHaveAttribute('rel', /noopener/);
    }
  });
});

test.describe('Skills view', () => {
  test('the radar chart has a text alternative', async ({ page }) => {
    await open(page, 'SKILLS');
    const svg = page.locator('.recharts-surface');
    await expect(svg).toBeVisible();
    const described = await svg.evaluate((el) =>
      Boolean(el.getAttribute('aria-label') || el.getAttribute('role') === 'img' || el.querySelector('title, desc'))
    );
    expect(described, 'the chart conveys data with no accessible summary').toBe(true);
  });

  test('the legend describes something the chart actually plots', async ({ page }) => {
    await open(page, 'SKILLS');
    const plotted = await page.evaluate(() => document.querySelectorAll('.recharts-radar').length);
    const legendRows = await page.locator('text=/Expert \(100\)|Proficient \(75\)|Familiar \(50\)/').count();
    expect(plotted, 'only one series is drawn').toBe(1);
    expect(legendRows, `the legend shows ${legendRows} swatches for ${plotted} series`).toBeLessThanOrEqual(plotted);
  });

  test('proficiency tiers are distinguishable without colour alone', async ({ page }) => {
    await open(page, 'SKILLS');
    const tiers = await page.evaluate(() => {
      const out: Record<string, string> = {};
      for (const el of document.querySelectorAll('li span:last-child')) {
        const t = el.textContent!.trim();
        if (['EXP', 'PRO', 'FAM'].includes(t)) out[t] = getComputedStyle(el).color;
      }
      return out;
    });
    expect(tiers.PRO, 'Proficient and Familiar render in the same grey').not.toBe(tiers.FAM);
  });
});

test.describe('Gallery view', () => {
  test('a photo tile can be opened from the keyboard', async ({ page }) => {
    await open(page, 'GALLERY');
    const tile = page.locator('div.glass-panel.cursor-pointer').first();
    await expect(tile).toBeVisible();
    await expect(tile, 'the tile is a plain div, invisible to the tab order').toHaveAttribute('tabindex', '0');
  });

  test('the lightbox closes with Escape', async ({ page }) => {
    await open(page, 'GALLERY');
    await page.locator('div.glass-panel.cursor-pointer').first().click();
    const dialog = page.locator('img[class*="max-h-[70vh]"]');
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog, 'Escape is not wired up').toBeHidden();
  });

  test('the lightbox is announced as a modal dialog', async ({ page }) => {
    await open(page, 'GALLERY');
    await page.locator('div.glass-panel.cursor-pointer').first().click();
    await expect(page.getByRole('dialog'), 'no role=dialog / aria-modal on the lightbox').toHaveCount(1);
  });

  test('the page behind the lightbox is taken out of the tab order', async ({ page }) => {
    await open(page, 'GALLERY');
    await page.locator('div.glass-panel.cursor-pointer').first().click();
    const navReachable = await page.evaluate(() => {
      const nav = document.querySelector('nav')!;
      if (nav.hasAttribute('inert') || nav.getAttribute('aria-hidden') === 'true') return false;
      return nav.querySelectorAll('button, a[href]').length > 0;
    });
    expect(navReachable, 'no focus trap: the nav behind the modal is still focusable').toBe(false);
  });

  test('gallery images are local and lazy-loaded', async ({ page }) => {
    await open(page, 'GALLERY');
    const imgs = await page.evaluate(() =>
      [...document.querySelectorAll('img')].map((i) => ({ src: i.getAttribute('src') || '', loading: i.getAttribute('loading') }))
    );
    for (const img of imgs) {
      expect(img.src, 'gallery still points at the picsum.photos placeholder service').not.toContain('picsum.photos');
      expect(img.loading, 'images are not lazy-loaded').toBe('lazy');
    }
  });
});
