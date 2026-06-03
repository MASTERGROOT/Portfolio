import { test, expect } from '@playwright/test';

test('homepage loads with intro section', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('section[data-scene="0"]')).toBeVisible();
  await expect(page.locator('canvas')).toBeVisible();
});

test('all 8 sections are in the DOM', async ({ page }) => {
  await page.goto('/');
  for (let i = 0; i <= 7; i++) {
    await expect(page.locator(`section[data-scene="${i}"]`)).toBeAttached();
  }
});

test('lang toggle switches html[lang] to th', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.locator('button[aria-label="Toggle language"]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'th');
  await expect(page.locator('body')).toHaveClass(/lang-th/);
});

test('lang persists after reload', async ({ page }) => {
  await page.goto('/');
  await page.locator('button[aria-label="Toggle language"]').click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'th');
});

test('scrolling to About section triggers scene 1', async ({ page }) => {
  await page.goto('/');
  await page.locator('section[data-scene="1"]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await expect(page.locator('section[data-scene="1"]')).toBeInViewport();
});

test('mobile viewport adds body.mobile class', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await expect(page.locator('body')).toHaveClass(/mobile/);
});

test('CV download link has correct href', async ({ page }) => {
  await page.goto('/');
  const href = await page.locator('a[download]').first().getAttribute('href');
  expect(href).toContain('Vivitthachai_Goody_CV.pdf');
});
