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

/** Create a maintenance object; returns its entry_id. */
export async function seedObject(page: Page, name: string): Promise<string> {
  const r = await ws<{ entry_id: string }>(page, { type: "maintenance_supporter/object/create", name });
  return r.entry_id;
}

/** Create a task on an object. */
export async function seedTask(
  page: Page,
  entryId: string,
  opts: Record<string, unknown>,
): Promise<void> {
  await ws(page, { type: "maintenance_supporter/task/create", entry_id: entryId, ...opts });
}

/** Full object snapshot (entry + tasks) from the WS read API. */
export async function getObject(page: Page, entryId: string): Promise<any> {
  return ws(page, { type: "maintenance_supporter/object", entry_id: entryId });
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
