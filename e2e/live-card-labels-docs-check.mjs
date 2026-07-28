/** Live check: the card's label filter and document chips, in a real dashboard.
 *
 *   1. `filter_labels` limits the card to tasks carrying that label
 *   2. a task with a linked document renders a chip with the document's title
 *   3. a task with only a documentation link renders a chip too
 *   4. `show_documents: false` removes the chips again
 *
 * Run from the repo root (playwright-server must be up):
 *   docker restart playwright-server
 *   node e2e/live-card-labels-docs-check.mjs
 */

import { chromium } from "@playwright/test";
import { loadToken, wsClient, watchdog, hassTokensInit } from "./ws-client.mjs";

const HA = "http://ha-maint:8123";
const REST = "http://127.0.0.1:8125";
const PW_WS = "ws://127.0.0.1:3000/";
const log = (...a) => console.log(...a);
watchdog(8 * 60e3, "card labels/docs check");

const stamp = process.env.MS_STAMP || String(Date.now()).slice(-6);
const token = loadToken();
const api = await wsClient(REST, token);

const results = [];
const check = (ok, line) => { results.push({ ok, line }); log(`  ${ok ? "PASS" : "FAIL"} ${line}`); };
const cleanup = { entryId: null, dashboardId: null };

async function readCard(p, urlPath) {
  await p.goto(`${HA}/${urlPath}`, { waitUntil: "domcontentloaded" });
  for (let i = 0; i < 30; i++) {
    await p.waitForTimeout(1000);
    const rows = await p.evaluate(() => {
      const deep = (pred) => {
        const st = [document.documentElement]; const o = []; let n = 0;
        while (st.length && n < 80000) {
          const el = st.pop(); n++; if (!el) continue;
          if (pred(el)) o.push(el);
          if (el.shadowRoot) st.push(el.shadowRoot);
          for (const k of (el.children || [])) st.push(k);
        }
        return o;
      };
      const card = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-CARD")[0];
      if (!card || !card.shadowRoot) return null;
      const items = [...card.shadowRoot.querySelectorAll(".task-item")];
      if (!items.length) return null;
      return items.map((it) => ({
        name: it.querySelector(".task-name")?.textContent.trim() || "",
        chips: [...it.querySelectorAll(".doc-chip")].map((c) => c.textContent.trim()),
      }));
    }).catch(() => null);
    if (rows) return rows;
  }
  return null;
}

async function saveCard(urlPath, cardConfig) {
  await api.send({
    type: "lovelace/config/save", url_path: urlPath,
    config: { views: [{ title: "T", cards: [{
      type: "custom:maintenance-supporter-card",
      filter_objects: [`Card labels ${stamp}`], show_actions: false, ...cardConfig,
    }] }] },
  });
}

const browser = await chromium.connect(PW_WS, { timeout: 20000 });
try {
  const obj = await api.send({
    type: "maintenance_supporter/object/create", name: `Card labels ${stamp}`,
  });
  cleanup.entryId = obj.entry_id;

  const withDoc = await api.send({
    type: "maintenance_supporter/task/create", entry_id: obj.entry_id,
    name: "Garden chore", task_type: "cleaning", interval_days: 1,
    last_performed: "2020-01-01", labels: ["garden"],
  });
  await api.send({
    type: "maintenance_supporter/task/create", entry_id: obj.entry_id,
    name: "Kitchen chore", task_type: "cleaning", interval_days: 1,
    last_performed: "2020-01-01", labels: ["kitchen"],
  });
  await api.send({
    type: "maintenance_supporter/task/create", entry_id: obj.entry_id,
    name: "Manual chore", task_type: "cleaning", interval_days: 1,
    last_performed: "2020-01-01",
    documentation_url: "https://example.invalid/handbook",
  });

  // A real web-link document, linked to the garden task.
  const doc = await api.send({
    type: "maintenance_supporter/documents/add_link", entry_id: obj.entry_id,
    url: "https://example.invalid/mower.pdf", title: "Mower manual",
  });
  // documents/update is keyed by doc_id alone (no entry_id in its schema).
  await api.send({
    type: "maintenance_supporter/documents/update",
    doc_id: doc.id, task_ids: [withDoc.task_id],
  });
  log(`seeded object ${obj.entry_id}`);

  const dash = await api.send({
    type: "lovelace/dashboards/create", url_path: `card-labels-${stamp}`,
    title: `Card labels ${stamp}`, mode: "storage", show_in_sidebar: false, require_admin: false,
  });
  cleanup.dashboardId = dash.id;

  const ctx = await browser.newContext({ viewport: { width: 900, height: 900 } });
  const p = await ctx.newPage();
  await p.addInitScript(hassTokensInit, { t: token, ha: HA });

  // 1 — unfiltered: three rows, chips where there is something to show
  await saveCard(`card-labels-${stamp}`, {});
  let rows = await readCard(p, `card-labels-${stamp}`);
  check(!!rows && rows.length === 3, `all three tasks render (${rows?.length})`);
  const garden = rows?.find((r) => r.name.includes("Garden"));
  const manual = rows?.find((r) => r.name.includes("Manual"));
  const kitchen = rows?.find((r) => r.name.includes("Kitchen"));
  check(!!garden?.chips.some((c) => c.includes("Mower manual")), `linked document chip (${garden?.chips})`);
  check(!!manual?.chips.length, `documentation-link chip (${manual?.chips})`);
  check(kitchen?.chips.length === 0, "a task without documents has no chips");

  // 2 — label filter
  await saveCard(`card-labels-${stamp}`, { filter_labels: ["kitchen"] });
  rows = await readCard(p, `card-labels-${stamp}`);
  check(!!rows && rows.length === 1 && rows[0].name.includes("Kitchen"),
    `filter_labels limits the card (${rows?.map((r) => r.name)})`);

  // 3 — chips off
  await saveCard(`card-labels-${stamp}`, { show_documents: false });
  rows = await readCard(p, `card-labels-${stamp}`);
  check(!!rows && rows.every((r) => r.chips.length === 0), "show_documents:false removes every chip");

  await ctx.close();
} finally {
  if (cleanup.dashboardId != null) {
    await api.send({ type: "lovelace/dashboards/delete", dashboard_id: cleanup.dashboardId }).catch(() => {});
  }
  if (cleanup.entryId) {
    await api.send({ type: "maintenance_supporter/object/delete", entry_id: cleanup.entryId }).catch(() => {});
  }
  await browser.close().catch(() => {});
  api.close();
}

const fails = results.filter((r) => !r.ok);
log(fails.length ? `\n${fails.length} FAILURES` : "\nCARD LABELS + DOCS: ALL PASS");
process.exit(fails.length ? 1 : 0);
