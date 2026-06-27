/**
 * User story: the full life of a maintenance object — create it, see it (and a
 * due task) on the Maintenance panel, complete the task (history recorded),
 * then retire it by archiving and finally deleting.
 *
 * Driven through the **sidebar panel** (`/maintenance-supporter`) — a registered
 * custom panel with no lovelace-strategy `whenDefined` race, so navigation and
 * rendering are reliable. The panel is enabled (panel_enabled) in global-setup.
 *
 * Each test loads the panel ONCE (in beforeEach) and then seeds/mutates over the
 * WebSocket, asserting the panel renders/re-renders LIVE (it subscribes to
 * updates) — fewer heavy page loads (lower renderer memory) and it exercises the
 * live subscription.
 */
import { test, expect } from "@playwright/test";
import { ws, gotoPanel, seedObject, seedTask, getObject, deleteAllObjects } from "../helpers";

// last_performed far in the past + a short interval => the task is overdue now.
const OVERDUE = { schedule_type: "time_based", interval_days: 30, last_performed: "2024-01-01" };

test.describe("Maintenance object lifecycle (panel)", () => {
  test.beforeEach(async ({ page }) => {
    await gotoPanel(page);          // one heavy load; hass ready + panel rendered
    await deleteAllObjects(page);   // clean slate (panel live-updates to empty)
  });

  test("a user creates an object via the create dialog", async ({ page }) => {
    // Open the panel's create dialog — exactly what its "+ New Object" button
    // does (`object-dialog.openCreate()`). We trigger it directly because the
    // button lives in a panel view that isn't reliably hit-testable in headless;
    // the dialog itself (fill + save + persist) is the real surface under test.
    const nameInput = page.locator("maintenance-object-dialog ms-textfield").first().locator("input");
    await expect(async () => {
      await page.evaluate(() => {
        const stack: any[] = [document.documentElement];
        let n = 0;
        while (stack.length && n < 16000) {
          const el = stack.pop(); n++; if (!el) continue;
          if (el.tagName?.toLowerCase() === "maintenance-supporter-panel") {
            (el.shadowRoot?.querySelector("maintenance-object-dialog") as any)?.openCreate();
            return;
          }
          if (el.shadowRoot) stack.push(el.shadowRoot);
          const k = el.children; if (k) for (const c of k) stack.push(c);
        }
      });
      await expect(nameInput).toBeVisible({ timeout: 3000 });
    }).toPass({ timeout: 30_000 });

    await nameInput.fill("Pool Pump");
    await page.locator("maintenance-object-dialog ha-button", { hasText: /save/i }).click();

    await expect
      .poll(async () => {
        const r = await ws<{ objects?: any[] }>(page, { type: "maintenance_supporter/objects" });
        return (r.objects || []).map((o: any) => o.object?.name ?? o.name);
      }, { timeout: 10_000 })
      .toContain("Pool Pump");
  });

  test("a seeded object and its overdue task render on the panel", async ({ page }) => {
    const entry = await seedObject(page, "HVAC Unit");
    await seedTask(page, entry, { name: "Replace filter", ...OVERDUE });

    // The panel updates live as the object/task are created.
    await expect(page.getByText("HVAC Unit").first()).toBeVisible();
    await expect(page.getByText("Replace filter").first()).toBeVisible();
    expect((await getObject(page, entry)).tasks.find((t: any) => t.name === "Replace filter").status).toBe("overdue");
  });

  test("completing a task records history and resets the cycle", async ({ page }) => {
    const entry = await seedObject(page, "Water Softener");
    await seedTask(page, entry, { name: "Add salt", ...OVERDUE });
    await expect(page.getByText("Water Softener").first()).toBeVisible();

    const taskId = (await getObject(page, entry)).tasks.find((t: any) => t.name === "Add salt").id;
    await ws(page, { type: "maintenance_supporter/task/complete", entry_id: entry, task_id: taskId });

    // A completion records a COMPLETED history entry and clears the overdue
    // status (the panel is the surface; the effect is asserted over WS).
    await expect
      .poll(async () => {
        const t = (await getObject(page, entry)).tasks.find((x: any) => x.id === taskId);
        return { completed: (t.history || []).some((h: any) => h.type === "completed"), overdue: t.status === "overdue" };
      }, { timeout: 10_000 })
      .toEqual({ completed: true, overdue: false });

    await expect(page.getByText("Water Softener").first()).toBeVisible(); // panel survived the live update
  });

  test("archiving hides an object from the panel, deleting removes it", async ({ page }) => {
    const entry = await seedObject(page, "Vehicle Brakes");
    await seedTask(page, entry, { name: "Inspect brakes", ...OVERDUE });
    await expect(page.getByText("Vehicle Brakes").first()).toBeVisible();

    // Archive: the panel hides archived items by default -> drops off the view.
    await ws(page, { type: "maintenance_supporter/object/archive", entry_id: entry });
    await expect(page.getByText("Vehicle Brakes")).toHaveCount(0);

    // Delete: gone for good.
    await ws(page, { type: "maintenance_supporter/object/delete", entry_id: entry });
    const r = await ws<{ objects?: any[] }>(page, { type: "maintenance_supporter/objects" });
    expect((r.objects || []).map((o: any) => o.object?.name ?? o.name)).not.toContain("Vehicle Brakes");
  });
});
