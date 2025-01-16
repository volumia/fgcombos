import type { Page } from '@playwright/test';

type GotoOptions = {
    referer?: string;
    timeout?: number;
    waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit';
};

export async function gotoAndWaitForHydration(page: Page, url: string, options?: GotoOptions) {
    await page.goto(url, options);
    await page.locator('body[hydrated]').waitFor({ timeout: 5000 });
}
