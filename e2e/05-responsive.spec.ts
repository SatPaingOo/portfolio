import { test, expect } from '@playwright/test';
import { gotoHome, closeChat } from './helpers';

const VIEWS = ['PROJECTS', 'SKILLS', 'HISTORY', 'GALLERY'];

test.describe('Responsive layout', () => {
  test('no view scrolls sideways', async ({ page }) => {
    await gotoHome(page);
    await closeChat(page);
    for (const nav of VIEWS) {
      if (page.viewportSize()!.width < 768) {
        await page.getByRole('button', { name: 'Toggle navigation' }).click();
      }
      await page.getByRole('button', { name: nav, exact: true }).first().click();
      const overflow = await page.evaluate(() => {
        const de = document.documentElement;
        return de.scrollWidth - de.clientWidth;
      });
      expect(overflow, `${nav} overflows horizontally`).toBeLessThanOrEqual(1);
    }
  });

  test('hero text is never clipped mid-sentence', async ({ page }) => {
    await gotoHome(page);
    const clipped = await page.evaluate(() => {
      const out: string[] = [];
      for (const el of document.querySelectorAll('h1, main p, main div.glass-panel')) {
        const r = el.getBoundingClientRect();
        if (!r.width || r.top > innerHeight) continue;
        // sample the right edge of the text block
        const hit = document.elementFromPoint(Math.min(innerWidth - 2, r.right - 4), r.y + r.height / 2);
        if (hit && !el.contains(hit) && hit !== el) out.push((el.textContent || '').trim().slice(0, 30));
      }
      return out;
    });
    expect(clipped, 'the AURA panel truncates hero copy').toEqual([]);
  });

  test('the summary paragraph stays within a readable measure', async ({ page }) => {
    await gotoHome(page);
    await closeChat(page);
    const chars = await page.evaluate(() => {
      const p = [...document.querySelectorAll('main div.glass-panel')].find((d) => (d.textContent || '').length > 120);
      if (!p) return 0;
      const cs = getComputedStyle(p);
      const size = parseFloat(cs.fontSize);
      const inner = p.getBoundingClientRect().width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      return Math.round(inner / (size * 0.5)); // ~0.5em average glyph width
    });
    expect(chars, `line length is ~${chars} characters; 45-85 is the readable band`).toBeLessThanOrEqual(85);
  });

  test('the mobile drawer is removed from the layout when closed', async ({ page }) => {
    test.skip(page.viewportSize()!.width >= 768, 'mobile only');
    await gotoHome(page);
    await closeChat(page);
    const drawerVisible = await page.evaluate(() => {
      const d = [...document.querySelectorAll('div')].find((x) => x.className.includes('w-[280px]'));
      if (!d) return false;
      const cs = getComputedStyle(d);
      return cs.display !== 'none' && cs.visibility !== 'hidden';
    });
    expect(drawerVisible, 'the closed drawer stays in the accessibility tree off-screen').toBe(false);
  });
});
