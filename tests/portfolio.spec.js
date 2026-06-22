import { test, expect } from '@playwright/test';

test.describe('Portfolio 3D Experience', () => {
  test('canvas and overlay both mount', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('canvas')).toBeVisible();
    await expect(page.locator('[data-testid="overlay"]')).toBeVisible();
  });

  test('overlay shows zone 0 text on load', async ({ page }) => {
    await page.goto('/');
    const title = page.locator('[data-testid="zone-title"]');
    await expect(title).toBeVisible();
    await expect(title).toContainText('Goody');
  });

  test('lang toggle switches to Thai', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await page.locator('button[aria-label="Switch to Thai"]').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'th');
    await expect(page.locator('body')).toHaveClass(/lang-th/);
  });

  test('lang persists after reload', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[aria-label="Switch to Thai"]').click();
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'th');
  });

  test('dot nav has 8 buttons', async ({ page }) => {
    await page.goto('/');
    const dots = page.locator('nav[aria-label="Section navigation"] button');
    await expect(dots).toHaveCount(8);
  });

  test('scroll wheel advances progress counter', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
    const before = await page.locator('[data-testid="progress"]').textContent();
    await page.mouse.wheel(0, 3000);
    await page.waitForTimeout(300);
    const after = await page.locator('[data-testid="progress"]').textContent();
    expect(before).not.toBe(after);
  });
});
