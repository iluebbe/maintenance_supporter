/**
 * User story: a brand-new user installs the integration, adds the dashboard,
 * and sees the onboarding (empty) state with zero objects.
 *
 * This is the #69 surface: both onboarding shortcuts must work, and the page
 * must not reload itself.
 */
import { test, expect } from "@playwright/test";
import { STRATEGY_DASH, withAuthedPage, deleteAllObjects, gotoStrategyDashboard } from "../helpers";

test.describe("First-run onboarding — empty dashboard (#69)", () => {
  test.beforeAll(async ({ browser }) => {
    // Guarantee the empty state regardless of which spec ran first.
    await withAuthedPage(browser, (p) => deleteAllObjects(p));
  });

  test("renders the empty-state onboarding card", async ({ page }) => {
    await gotoStrategyDashboard(page, STRATEGY_DASH);
    await expect(page.locator("hui-empty-state-card")).toBeVisible();
    await expect(page.getByText(/no maintenance objects yet/i)).toBeVisible();
  });

  test('"Add object" opens the create-object dialog in place', async ({ page }) => {
    await gotoStrategyDashboard(page, STRATEGY_DASH);
    await page.locator("ha-button", { hasText: /add object/i }).click();

    // With the #69 bug the handler read `detail.type` (undefined) and nothing
    // mounted — so the dialog being attached AND open is the regression signal.
    const dialog = page.locator("maintenance-object-dialog");
    await expect(dialog).toBeAttached({ timeout: 15_000 });
    const open = await page.evaluate(() => {
      const d = document.querySelector("maintenance-object-dialog") as any;
      return !!d && (d._open === true || !!d.shadowRoot?.querySelector("ha-dialog, dialog, [role=dialog]"));
    });
    expect(open, "create-object dialog should be open").toBe(true);
  });

  test("does not self-heal-bounce the healthy one-card empty state", async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).__bounces = 0;
      const orig = history.pushState.bind(history);
      history.pushState = function (s: any, t: any, u: any) {
        if (typeof u === "string" && u.startsWith("/lovelace")) (window as any).__bounces++;
        return orig(s, t, u);
      };
    });
    await gotoStrategyDashboard(page, STRATEGY_DASH);
    // The self-heal arms at 6s and scans to ~21s; span that window.
    await page.waitForTimeout(15_000);
    const bounces = await page.evaluate(() => (window as any).__bounces || 0);
    expect(bounces, "self-heal must not reload the empty state").toBe(0);
    await expect(page.locator("hui-empty-state-card")).toBeVisible();
  });

  test('"Open Maintenance panel" navigates to the custom panel', async ({ page }) => {
    await gotoStrategyDashboard(page, STRATEGY_DASH);
    await page.locator("ha-button", { hasText: /open maintenance panel/i }).click();
    await expect(page).toHaveURL(/\/maintenance-supporter\b/, { timeout: 15_000 });
  });
});
