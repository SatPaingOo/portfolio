import { test, expect } from '@playwright/test';
import { gotoHome, closeChat, focusableOffscreen, MIN_TARGET } from './helpers';

test.describe('Accessibility', () => {
  test('every button carries an accessible name', async ({ page }) => {
    await gotoHome(page);
    const unnamed = await page.evaluate(() =>
      [...document.querySelectorAll('button')]
        .filter((b) => !b.textContent?.trim() && !b.getAttribute('aria-label'))
        .map((b) => b.className.slice(0, 60))
    );
    expect(unnamed, 'buttons with no name are unusable with a screen reader').toEqual([]);
  });

  test('keyboard focus is always visible', async ({ page }) => {
    await gotoHome(page);
    await closeChat(page);
    const ring = await page.evaluate(() => {
      const btn = document.querySelector('nav button') as HTMLElement;
      btn.focus();
      const cs = getComputedStyle(btn);
      return { outline: cs.outlineStyle, width: cs.outlineWidth, shadow: cs.boxShadow };
    });
    const visible = ring.outline !== 'none' || ring.shadow !== 'none';
    expect(visible, `no focus indicator (outline: ${ring.outline}, box-shadow: ${ring.shadow})`).toBe(true);
  });

  test('no keyboard-reachable control sits outside the viewport', async ({ page }) => {
    await gotoHome(page);
    await closeChat(page);
    const stray = await focusableOffscreen(page);
    expect(stray, 'the closed mobile drawer keeps its links in the tab order').toEqual([]);
  });

  test('interactive tiles are real controls, not click-handling divs', async ({ page }) => {
    await gotoHome(page);
    const divs = await page.evaluate(() =>
      [...document.querySelectorAll('div[class*="cursor-pointer"]')]
        .filter((d) => !d.getAttribute('role') && !d.hasAttribute('tabindex'))
        .map((d) => d.className.slice(0, 55))
    );
    expect(divs, 'clickable <div>s cannot be reached or activated by keyboard').toEqual([]);
  });

  test('tap targets meet the 44px minimum', async ({ page }) => {
    await gotoHome(page);
    const small = await page.evaluate((min) => {
      const sel = 'a[href],button,input,select,textarea';
      return [...document.querySelectorAll(sel)]
        .map((el) => {
          const r = el.getBoundingClientRect();
          const name = (el.getAttribute('aria-label') || el.textContent || (el as HTMLInputElement).placeholder || '?').trim().slice(0, 24);
          return { name, w: Math.round(r.width), h: Math.round(r.height), visible: r.width > 0 && r.left >= 0 && r.top >= 0 };
        })
        .filter((t) => t.visible && (t.w < min || t.h < min));
    }, MIN_TARGET);
    expect(small, 'targets below 44x44 are hard to hit on a phone').toEqual([]);
  });

  test('the mobile drawer behaves like a dialog', async ({ page }) => {
    test.skip(page.viewportSize()!.width >= 768, 'drawer is mobile-only');
    await gotoHome(page);
    await closeChat(page);
    const toggle = page.getByRole('button', { name: 'Toggle navigation' });

    await expect(toggle, 'toggle does not announce its state').toHaveAttribute('aria-expanded', 'false');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused, 'focus is not moved into the drawer').toBe('BUTTON');

    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'PROJECTS', exact: true }).first(),
      'Escape does not close the drawer').toBeHidden();
  });

  test('animation respects prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await gotoHome(page);
    const moving = await page.evaluate(() =>
      [...document.querySelectorAll('*')]
        .filter((el) => {
          const a = getComputedStyle(el).animationName;
          return a && a !== 'none';
        })
        .map((el) => getComputedStyle(el).animationName)
    );
    expect(moving, 'animations keep running for motion-sensitive visitors').toEqual([]);
  });

  test('body text clears the 4.5:1 contrast floor', async ({ page }) => {
    await gotoHome(page);
    await closeChat(page);
    const failures = await page.evaluate(() => {
      const L = (c: number[]) => {
        const [r, g, b] = c.map((v) => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      const rgb = (s: string) => (s.match(/\d+(\.\d+)?/g) || []).slice(0, 3).map(Number);
      const ratio = (a: number[], b: number[]) => {
        const [x, y] = [L(a), L(b)].sort((m, n) => n - m);
        return (x + 0.05) / (y + 0.05);
      };
      const page_bg = [2, 6, 23];
      const out: { text: string; color: string; ratio: string; size: string }[] = [];
      for (const el of document.querySelectorAll('p,span,li,a,button,h1,h2,h3,h4')) {
        const r = el.getBoundingClientRect();
        if (!r.width || r.left < 0 || !el.textContent?.trim()) continue;
        if (el.children.length) continue;
        const cs = getComputedStyle(el);
        const size = parseFloat(cs.fontSize);
        const bold = parseInt(cs.fontWeight, 10) >= 700;
        const floor = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5;
        const cr = ratio(rgb(cs.color), page_bg);
        if (cr < floor) out.push({ text: el.textContent.trim().slice(0, 28), color: cs.color, ratio: cr.toFixed(2), size: cs.fontSize });
      }
      return out;
    });
    expect(failures, 'text below the WCAG AA contrast floor').toEqual([]);
  });
});
