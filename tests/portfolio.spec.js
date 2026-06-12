// tests/portfolio.spec.js
import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

test.describe('Portfolio EN/TH', () => {
  test('hero renders EN headline', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.getByText('Turning Complex Systems')).toBeVisible();
  });

  test('lang toggle switches to TH', async ({ page }) => {
    await page.goto(BASE);
    // Scroll past 55vh to reveal navbar
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.6));
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /switch to thai/i }).click();
    await expect(page.getByText('เปลี่ยนระบบที่ซับซ้อน')).toBeVisible();
  });

  test('CV download link exists with correct href', async ({ page }) => {
    await page.goto(BASE);
    const links = page.getByRole('link', { name: /download cv/i });
    await expect(links.first()).toHaveAttribute('href', '/assets/Vivitthachai_Goody_CV.pdf');
  });

  test('all 8 section IDs exist in DOM', async ({ page }) => {
    await page.goto(BASE);
    for (const id of ['hero','about','experience','skills','work','education','certs','contact']) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
  });

  test('navbar appears after scrolling 55vh', async ({ page }) => {
    await page.goto(BASE);
    const nav = page.locator('nav');
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.6));
    await page.waitForTimeout(400);
    await expect(nav).toHaveClass(/visible/);
  });

  test('prefers-reduced-motion: page loads without animation errors', async ({ page }) => {
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(BASE);
    await page.waitForTimeout(500);
    const animErrors = errors.filter(e =>
      !e.includes('favicon') &&
      !e.includes('hydration') &&
      !e.includes('Hydration')
    );
    expect(animErrors).toHaveLength(0);
  });
});
