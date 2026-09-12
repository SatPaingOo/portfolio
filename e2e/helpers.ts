import { Page, Locator, expect } from '@playwright/test';

/** WCAG 2.5.8 minimum target size (AA) is 24px; Apple HIG / Material ask for 44-48px. */
export const MIN_TARGET = 44;

export async function gotoHome(page: Page) {
  // './' resolves against baseURL and keeps the /portfolio/ base path; '/' goes
  // to the server root, which vite preview does not serve.
  await page.goto('./');
  await expect(page.getByRole('heading', { level: 1 })).toBeAttached();
  // Several tests measure layout. Until the web fonts arrive the fallback face
  // is much wider than Rajdhani, the summary wraps onto extra lines, and a short
  // window reports a scrollbar it does not really have. Capped, and resolved to
  // a boolean, so a stalled font request cannot hang the test.
  await page.evaluate(() =>
    Promise.race([
      document.fonts.ready.then(() => true),
      new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 4000)),
    ])
  );
}

/** The AURA chat panel that opens by default. */
export function chatPanel(page: Page): Locator {
  return page.locator('div.glass-panel').filter({ has: page.getByRole('textbox', { name: /Ask AURA/i }) });
}

/** Collapse the chat so the rest of the UI is reachable. */
export async function closeChat(page: Page) {
  const collapse = page.locator('button:has(svg path[d^="M19.5 8.25"])');
  if (await collapse.count()) {
    await collapse.first().click();
    await expect(page.getByRole('textbox', { name: /Ask AURA/i })).toBeHidden();
  }
}

export async function askAura(page: Page, question: string) {
  const box = page.getByRole('textbox', { name: /Ask AURA/i });
  await box.fill(question);
  await box.press('Enter');
  await expect(page.locator('text=/AURA RESPONSE/i').last()).toBeVisible();
}

/** Which top-nav item is marked current. */
export async function activeView(page: Page): Promise<string> {
  const active = page.locator('nav button.border-holo-400');
  return (await active.count()) ? (await active.first().innerText()).trim() : '';
}

/** True when `target`'s centre point is occluded by another element. */
export async function isOccluded(target: Locator): Promise<boolean> {
  return target.evaluate((el) => {
    const r = el.getBoundingClientRect();
    const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    return !(hit === el || el.contains(hit));
  });
}

/** Every keyboard-reachable control that is rendered outside the viewport. */
export async function focusableOffscreen(page: Page) {
  return page.evaluate(() => {
    const sel = 'a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])';
    return [...document.querySelectorAll(sel)]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        if (getComputedStyle(el).display === 'none' || r.width === 0) return false;
        return r.right < 0 || r.bottom < 0 || r.left > innerWidth || r.top > innerHeight;
      })
      .map((el) => (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 30));
  });
}
