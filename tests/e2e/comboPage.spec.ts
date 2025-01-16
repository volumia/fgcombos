import { expect, test } from '@playwright/test';
import { gotoAndWaitForHydration } from '../lib/utils';

test.beforeEach(async ({ page }) => {
    await gotoAndWaitForHydration(page, '/combo/ryu-sf3ts');
});

test(`Should open modal when clicking open modal button, then add row to table when clicking add move button`, async ({
    page
}) => {
    await expect(page.getByTestId('move-row')).not.toBeVisible();
    await page.getByTestId('open-add-modal').click();
    await page.getByTestId('add-move').first().click();
    await expect(page.getByTestId('move-row')).toBeVisible();
});

test(`Should open modal when pressing open modal hotkey, then add move row to table when pressing confirm hotkey`, async ({
    page
}) => {
    await expect(page.getByTestId('move-row')).not.toBeVisible();
    await page.keyboard.down('a');
    await page.keyboard.down('Enter');
    await expect(page.getByTestId('move-row')).toBeVisible();
});
