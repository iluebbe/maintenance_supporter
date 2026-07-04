import { type Page, type Browser, expect } from "@playwright/test";

/** The shared strategy dashboard created in global-setup. Specs navigate here.
 *  HA requires a hyphen in dashboard url_path, hence "ms-e2e". */
export const STRATEGY_DASH = "ms-e2e";

/** Run `fn` with a throwaway authenticated page (for beforeAll/afterAll setup,
 *  which don't receive the test-scoped `page`). */
export async function withAuthedPage<T>(browser: Browser, fn: (page: Page) => Promise<T>): Promise<T> {
  const ctx = await browser.newContext({ storageState: ".auth/state.json" });
  try {
    const page = await ctx.newPage();
    await gotoReady(page, "/lovelace");
    return await fn(page);
  } finally {
    await ctx.close();
  }
}

/** Remove every maintenance object so a spec starts from a known slate. */
export async function deleteAllObjects(page: Page): Promise<void> {
  const r = await ws<{ objects?: any[] }>(page, { type: "maintenance_supporter/objects" }).catch(() => ({ objects: [] }));
  for (const o of r.objects || []) {
    const entryId = o.object?.entry_id ?? o.entry_id;
    if (entryId) await ws(page, { type: "maintenance_supporter/object/delete", entry_id: entryId }).catch(() => {});
  }
}

/** Send a WebSocket command through the page's authenticated hass connection. */
export async function ws<T = any>(page: Page, msg: Record<string, unknown>): Promise<T> {
  return page.evaluate(async (m) => {
    const hass = (document.querySelector("home-assistant") as any).hass;
    try {
      return await hass.connection.sendMessagePromise(m);
    } catch (e: any) {
      throw new Error(`WS ${m.type} failed: ${e?.message ?? e?.code ?? JSON.stringify(e)}`);
    }
  }, msg);
}

/** Wait until <home-assistant>.hass has a live connection (frontend booted + authed). */
export async function waitForHass(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    const h = document.querySelector("home-assistant") as any;
    return !!(h && h.hass && h.hass.connection && h.hass.states);
  }, { timeout: 45_000 });
}

/** Navigate and wait for hass to be ready. */
export async function gotoReady(page: Page, urlPath: string): Promise<void> {
  await page.goto(urlPath, { waitUntil: "domcontentloaded" });
  await waitForHass(page);
}

/** Create a storage-mode dashboard rendered by our dashboard strategy. */
export async function createStrategyDashboard(page: Page, urlPath: string): Promise<void> {
  await ws(page, {
    type: "lovelace/dashboards/create", url_path: urlPath, mode: "storage",
    title: "E2E " + urlPath, show_in_sidebar: false, require_admin: false,
  }).catch(() => {}); // ignore "already exists" on retry
  await ws(page, {
    type: "lovelace/config/save", url_path: urlPath,
    config: { strategy: { type: "custom:maintenance-supporter" } },
  });
}

export async function deleteDashboard(page: Page, urlPath: string): Promise<void> {
  const list = await ws<any[]>(page, { type: "lovelace/dashboards/list" }).catch(() => []);
  const d = (list || []).find((x) => x.url_path === urlPath);
  if (d) await ws(page, { type: "lovelace/dashboards/delete", dashboard_id: d.id }).catch(() => {});
}

/** Create a maintenance object; returns its entry_id once it is actually
 *  queryable. Creating an object is a config-entry whose runtime setup is
 *  async — if we navigate before it's queryable, the panel's initial fetch
 *  misses it (a flaky empty render), so we poll until it appears. */
export async function seedObject(page: Page, name: string): Promise<string> {
  const r = await ws<{ entry_id: string }>(page, { type: "maintenance_supporter/object/create", name });
  for (let i = 0; i < 50; i++) {
    const o = await ws<{ objects?: any[] }>(page, { type: "maintenance_supporter/objects" }).catch(() => ({ objects: [] }));
    if ((o.objects || []).some((x) => (x.object?.entry_id ?? x.entry_id) === r.entry_id)) return r.entry_id;
    await page.waitForTimeout(200);
  }
  return r.entry_id;
}

/** Create a task on an object; waits until the task is queryable. */
export async function seedTask(
  page: Page,
  entryId: string,
  opts: Record<string, unknown>,
): Promise<void> {
  await ws(page, { type: "maintenance_supporter/task/create", entry_id: entryId, ...opts });
  const name = opts.name as string | undefined;
  if (!name) return;
  for (let i = 0; i < 50; i++) {
    const obj = await getObject(page, entryId).catch(() => ({ tasks: [] }));
    if ((obj.tasks || []).some((t: any) => t.name === name)) return;
    await page.waitForTimeout(200);
  }
}

/** Full object snapshot (entry + tasks) from the WS read API. */
export async function getObject(page: Page, entryId: string): Promise<any> {
  return ws(page, { type: "maintenance_supporter/object", entry_id: entryId });
}

/** Navigate to the sidebar panel (/maintenance-supporter) and wait for it to
 *  render. The panel is a registered custom panel (no lovelace-strategy
 *  whenDefined race), so this is reliable — but it is off by default; the
 *  global-setup enables it (panel_enabled). */
export async function gotoPanel(page: Page): Promise<void> {
  const panel = page.locator("maintenance-supporter-panel");
  await page.goto("/maintenance-supporter", { waitUntil: "domcontentloaded" });
  await waitForHass(page).catch(() => {});
  // The panel's custom-element module occasionally doesn't load/define in time
  // on a cold page load (much rarer than the lovelace-strategy race, but real).
  // A reload re-fetches the (now-cached) module so it defines promptly. Retry a
  // couple of times before giving up.
  for (let attempt = 0; attempt < 3; attempt++) {
    if (await panel.isVisible().catch(() => false)) return;
    try {
      await expect(panel).toBeVisible({ timeout: 12_000 });
      return;
    } catch {
      if (attempt < 2) {
        await page.reload({ waitUntil: "domcontentloaded" }).catch(() => {});
        await waitForHass(page).catch(() => {});
      }
    }
  }
  await expect(panel, "maintenance panel should render (is panel_enabled set?)").toBeVisible({ timeout: 12_000 });
}

/**
 * Navigate to a strategy dashboard and wait for the strategy to actually render
 * something — either the empty-state card or a maintenance card. Tolerates HA's
 * one-shot whenDefined registration race: if nothing renders in time, reload
 * once (the same recovery the shim's self-heal performs) and wait again.
 */
export async function gotoStrategyDashboard(page: Page, urlPath: string): Promise<void> {
  const content = page.locator("hui-empty-state-card, maintenance-supporter-card");
  const target = "/" + urlPath;
  // Cold loads can lose HA's one-shot whenDefined race. The shim's self-heal
  // recovers within ~6–21s by bouncing the view (/lovelace -> back), which can
  // ABORT the goto and sometimes leave us parked on /lovelace. Strategy:
  //   - goto once (a full reload restarts the self-heal, so we do it ONCE),
  //   - then poll for the content; if the self-heal bounced us off-target,
  //     nav back CLIENT-SIDE (keeps the strategy bundle loaded so the self-heal
  //     keeps making progress) rather than reloading.
  await page.goto(target, { waitUntil: "domcontentloaded" }).catch(() => {});
  await waitForHass(page).catch(() => {});
  const deadline = Date.now() + 45_000;
  while (Date.now() < deadline) {
    if (await content.first().isVisible().catch(() => false)) return;
    if (!page.url().includes(target)) {
      await page
        .evaluate((t) => {
          history.pushState(null, "", t);
          window.dispatchEvent(new CustomEvent("location-changed"));
        }, target)
        .catch(() => {});
    }
    await page.waitForTimeout(700);
  }
  await expect(content.first(), `strategy dashboard ${target} never rendered`).toBeVisible({ timeout: 5_000 });
}
