import { expect, test } from "@playwright/test";
import { gotoAndWaitForHydration } from "../lib/utils";

test(`Should open modal after pressing open hotkey, then should add move row after pressing confirm hotkey`, async ({ page }) => {
	await gotoAndWaitForHydration(page, "/combo/ryu-sf3ts");
	await expect(page.getByTestId("move-row")).not.toBeVisible();
	await page.keyboard.down("a");
	await page.keyboard.down("Enter");
	await expect(page.getByTestId("move-row")).toBeVisible();
});
