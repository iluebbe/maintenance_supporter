/**
 * User story: the full life of a maintenance object — create it, see its due
 * work surface on the dashboard, complete it (history recorded), then retire it
 * by archiving and finally deleting.
 *
 * The strategy's first view is the "due work" overview (overdue / triggered /
 * due-soon), so seeded tasks are made overdue to appear, and they correctly
 * drop off once completed / archived / deleted.
 *
 * Reliability notes:
 *  - These tests share ONE warm browser page (workers=1 runs serially). The
 *    first navigation registers the strategy element (recovering HA's one-shot
 *    whenDefined race once), so the rest are warm.
 *  - Each test navigates to the dashboard ONCE, then drives state over the
 *    WebSocket and asserts the card RE-RENDERS LIVE — which also exercises the
 *    card's live subscription, and avoids re-navigating (the main flake source).
 */
import { test, expect, type Page } from "@playwright/test";
import {
  STRATEGY_DASH, ws, gotoReady, gotoStrategyDashboard,
  seedObject, seedTask, getObject, deleteAllObjects,
} from "../helpers";

// last_performed far in the past + a short interval => the task is overdue now.
const OVERDUE = { schedule_type: "time_based", interval_days: 30, last_performed: "2024-01-01" };

let page: Page;

test.beforeAll(async ({ browser }) => {
  const ctx = await browser.newContext({ storageState: ".auth/state.json" });
  page = await ctx.newPage();
  await gotoStrategyDashboard(page, STRATEGY_DASH); // warm the strategy element registration once
});
test.afterAll(async () => {
  await page?.context().close();
});
test.beforeEach(async () => {
  await gotoReady(page, "/lovelace");
  await deleteAllObjects(page); // each test starts from a clean slate
});

test.describe("Maintenance object lifecycle", () => {
  test("a user creates an object through the Add-object dialog", async () => {
    await gotoStrategyDashboard(page, STRATEGY_DASH); // empty state
    await page.locator("ha-button", { hasText: /add object/i }).click();

    const dialog = page.locator("maintenance-object-dialog");
    await expect(dialog).toBeAttached();
    await dialog.locator("ms-textfield").first().locator("input").fill("Pool Pump");
    await dialog.locator("ha-button", { hasText: /save/i }).click();

    // The create flow persisted the object end-to-end (UI -> WS -> config entry).
    await expect
      .poll(async () => {
        const r = await ws<{ objects?: any[] }>(page, { type: "maintenance_supporter/objects" });
        return (r.objects || []).map((o: any) => o.object?.name ?? o.name);
      }, { timeout: 10_000 })
      .toContain("Pool Pump");
  });

  test("an overdue task surfaces on the dashboard with its object", async () => {
    const entry = await seedObject(page, "HVAC Unit");
    await seedTask(page, entry, { name: "Replace filter", ...OVERDUE });

    await gotoStrategyDashboard(page, STRATEGY_DASH);
    await expect(page.getByText("HVAC Unit")).toBeVisible();
    await expect(page.getByText("Replace filter")).toBeVisible();

    expect((await getObject(page, entry)).tasks.find((t: any) => t.name === "Replace filter").status).toBe("overdue");
  });

  test("completing the task records history and drops it off the due view (live)", async () => {
    const entry = await seedObject(page, "Water Softener");
    await seedTask(page, entry, { name: "Add salt", ...OVERDUE });
    await gotoStrategyDashboard(page, STRATEGY_DASH);
    await expect(page.getByText("Add salt")).toBeVisible();

    const taskId = (await getObject(page, entry)).tasks.find((t: any) => t.name === "Add salt").id;
    await ws(page, { type: "maintenance_supporter/task/complete", entry_id: entry, task_id: taskId });

    // History recorded + status no longer overdue (a completion resets the cycle).
    await expect
      .poll(async () => {
        const t = (await getObject(page, entry)).tasks.find((x: any) => x.id === taskId);
        return { completed: (t.history || []).some((h: any) => h.type === "completed"), overdue: t.status === "overdue" };
      }, { timeout: 10_000 })
      .toEqual({ completed: true, overdue: false });

    // The card re-renders live: the no-longer-overdue task drops off the overview.
    await expect(page.getByText("Add salt")).toHaveCount(0);
  });

  test("archiving an object removes it from the dashboard (live)", async () => {
    const entry = await seedObject(page, "Vehicle Brakes");
    await seedTask(page, entry, { name: "Inspect brakes", ...OVERDUE });
    await gotoStrategyDashboard(page, STRATEGY_DASH);
    await expect(page.getByText("Vehicle Brakes")).toBeVisible();

    await ws(page, { type: "maintenance_supporter/object/archive", entry_id: entry });
    await expect(page.getByText("Vehicle Brakes")).toHaveCount(0);
  });

  test("deleting an object removes it everywhere (live)", async () => {
    const entry = await seedObject(page, "Gutter Guards");
    await seedTask(page, entry, { name: "Clear debris", ...OVERDUE });
    await gotoStrategyDashboard(page, STRATEGY_DASH);
    await expect(page.getByText("Gutter Guards")).toBeVisible();

    await ws(page, { type: "maintenance_supporter/object/delete", entry_id: entry });
    await expect(page.getByText("Gutter Guards")).toHaveCount(0);
    const r = await ws<{ objects?: any[] }>(page, { type: "maintenance_supporter/objects" });
    expect((r.objects || []).map((o: any) => o.object?.name ?? o.name)).not.toContain("Gutter Guards");
  });
});
