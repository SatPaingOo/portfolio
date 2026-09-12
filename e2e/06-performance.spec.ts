import { test, expect } from '@playwright/test';
import { gotoHome } from './helpers';

test.describe('Delivery weight', () => {
  test('the landing page does not eagerly ship three.js and recharts', async ({ page }) => {
    const js: { url: string; bytes: number }[] = [];
    page.on('response', async (res) => {
      const type = res.headers()['content-type'] || '';
      if (!type.includes('javascript')) return;
      try {
        js.push({ url: res.url().split('/').pop()!, bytes: (await res.body()).length });
      } catch { /* ignore */ }
    });

    await gotoHome(page);
    await page.waitForLoadState('networkidle');

    const total = js.reduce((s, f) => s + f.bytes, 0);
    const heavy = js.filter((f) => f.bytes > 150_000).map((f) => `${f.url} ${(f.bytes / 1024).toFixed(0)}kB`);

    test.info().annotations.push({ type: 'js-payload', description: `${(total / 1024).toFixed(0)} kB across ${js.length} files` });
    expect(heavy, 'heavy vendor chunks load before first paint; use React.lazy').toEqual([]);
    expect(total, 'landing JS payload').toBeLessThan(400_000);
  });

  test('the console stays clean', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(e.message));
    await gotoHome(page);
    await page.waitForLoadState('networkidle');
    expect(errors).toEqual([]);
  });

  test('no inline style carries an unparsed Tailwind prefix', async ({ page }) => {
    await gotoHome(page);
    const bad = await page.evaluate(() =>
      [...document.querySelectorAll('[style]')]
        .map((el) => el.getAttribute('style') || '')
        .filter((s) => /\b(sm|md|lg|xl):/.test(s))
    );
    expect(bad, 'responsive prefixes do not work inside inline style attributes').toEqual([]);
  });
});
