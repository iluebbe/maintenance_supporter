/** Live check: does the Lovelace card show WHOSE TURN it is?
 *
 * Forum request (2026-07-27): the card never rendered the responsible user,
 * so a household could not read a rotation off the card. This drives the
 * real card in a real dashboard against the dev instance and asserts:
 *
 *   1. an assigned task shows the user's NAME on the row
 *   2. an unassigned task shows no badge (and no dangling separator)
 *   3. `show_assignee: false` hides it again
 *
 * Run from the repo root (playwright-server must be up):
 *   docker restart playwright-server
 *   node e2e/live-card-assignee-check.mjs
 */

import { chromium } from "@playwright/test";
import { loadToken, wsClient, watchdog, hassTokensInit } from "./ws-client.mjs";

const HA = "http://ha-maint:8123";
const REST = "http://127.0.0.1:8125";
const PW_WS = "ws://127.0.0.1:3000/";
const log = (...a) => console.log(...a);
watchdog(8 * 60e3, "card assignee check");

const stamp = process.env.MS_STAMP || "cardassignee";
const token = loadToken();
const api = await wsClient(REST, token);

const cleanup = { entryId: null, dashboardId: null, probeUserId: null };

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
        meta: (it.querySelector(".task-meta")?.textContent || "").replace(/\s+/g, " ").trim(),
        hasBadge: !!it.querySelector(".assignee, .compact-assignee"),
      }));
    }).catch(() => null);
    if (rows) return rows;
  }
  return null;
}

const results = [];
const check = (ok, line) => { results.push({ ok, line }); log(`  ${ok ? "PASS" : "FAIL"} ${line}`); };

const browser = await chromium.connect(PW_WS, { timeout: 20000 });
try {
  // A real HA user to assign — reuse an existing non-system one, else create.
  const users = await api.send({ type: "config/auth/list" });
  let user = users.find((u) => !u.system_generated && u.name);
  if (!user) {
    const created = await api.send({
      type: "config/auth/create", name: "Card Probe", group_ids: ["system-users"],
    });
    user = created.user; cleanup.probeUserId = user.id;
  }
  log(`assignee under test: ${user.name}`);

  // Fresh object with two tasks: one assigned, one not.
  const obj = await api.send({
    type: "maintenance_supporter/object/create", name: `Card assignee ${stamp}`,
  });
  cleanup.entryId = obj.entry_id;
  await api.send({
    type: "maintenance_supporter/task/create", entry_id: obj.entry_id,
    name: "Assigned chore", task_type: "cleaning", interval_days: 1,
    last_performed: "2020-01-01", responsible_user_id: user.id,
  });
  await api.send({
    type: "maintenance_supporter/task/create", entry_id: obj.entry_id,
    name: "Nobody's chore", task_type: "cleaning", interval_days: 1,
    last_performed: "2020-01-01",
  });

  const dash = await api.send({
    type: "lovelace/dashboards/create", url_path: `card-assignee-${stamp}`,
    title: `Card assignee ${stamp}`, mode: "storage", show_in_sidebar: false, require_admin: false,
  });
  cleanup.dashboardId = dash.id;

  const ctx = await browser.newContext({ viewport: { width: 900, height: 900 } });
  const p = await ctx.newPage();
  await p.addInitScript(hassTokensInit, { t: token, ha: HA });

  // ── default config: badge expected ───────────────────────────────────────
  await api.send({
    type: "lovelace/config/save", url_path: `card-assignee-${stamp}`,
    config: { views: [{ title: "T", cards: [{
      type: "custom:maintenance-supporter-card",
      filter_objects: [`Card assignee ${stamp}`], show_actions: false,
    }] }] },
  });
  const rows = await readCard(p, `card-assignee-${stamp}`);
  if (!rows) {
    check(false, "card rendered rows");
  } else {
    const assigned = rows.find((r) => r.name.includes("Assigned"));
    const nobody = rows.find((r) => r.name.includes("Nobody"));
    check(!!assigned?.meta.includes(user.name), `assigned row shows "${user.name}" (meta: ${assigned?.meta})`);
    check(!!assigned?.hasBadge, "assigned row has an assignee badge");
    check(!nobody?.hasBadge, `unassigned row has no badge (meta: ${nobody?.meta})`);
  }

  // ── show_assignee: false ────────────────────────────────────────────────
  await api.send({
    type: "lovelace/config/save", url_path: `card-assignee-${stamp}`,
    config: { views: [{ title: "T", cards: [{
      type: "custom:maintenance-supporter-card",
      filter_objects: [`Card assignee ${stamp}`], show_actions: false, show_assignee: false,
    }] }] },
  });
  const off = await readCard(p, `card-assignee-${stamp}`);
  check(!!off && off.every((r) => !r.hasBadge), "show_assignee:false hides the badge everywhere");

  await ctx.close();
} finally {
  if (cleanup.dashboardId != null) {
    await api.send({ type: "lovelace/dashboards/delete", dashboard_id: cleanup.dashboardId }).catch(() => {});
  }
  if (cleanup.entryId) {
    await api.send({ type: "maintenance_supporter/object/delete", entry_id: cleanup.entryId }).catch(() => {});
  }
  if (cleanup.probeUserId) {
    await api.send({ type: "config/auth/delete", user_id: cleanup.probeUserId }).catch(() => {});
  }
  await browser.close().catch(() => {});
  api.close();
}

const fails = results.filter((r) => !r.ok);
log(fails.length ? `\n${fails.length} FAILURES` : "\nCARD ASSIGNEE: ALL PASS");
process.exit(fails.length ? 1 : 0);
