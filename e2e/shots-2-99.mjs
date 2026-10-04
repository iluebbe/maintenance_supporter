/** The docs pictures of Places (2.99): an object at the allotment garden on
 *  its page, the object dialog's place with "Remind only while somebody is
 *  there", and the dashboard filtered by place. Dark theme, on the seeded
 *  demo instance. Leaves it as it found it: the zone, the shed and the Places
 *  switch are put back in the finally.
 *  Prereqs: seeded ha-shots (restarted after backend changes) +
 *  playwright-server running. One picture only: node shots-2-99.mjs object-place.png */
import { chromium } from "@playwright/test";
import { haLogin, watchdog, wsClient } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8131", HA = "http://ha-shots:8123", PW_WS = "ws://127.0.0.1:3000/";
const OUT = new URL("../docs/images/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const log = (...a) => console.log(...a);
const only = process.argv[2];
const want = (name) => !only || only === name;
watchdog(10 * 60e3, "2.99 shots");

const DEEP = `const deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
  while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
    if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
    for (const k of (el.children || [])) st.push(k); } return o; };
  window.__deep = deep;
  window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];`;

const token = await haLogin(REST, { user: "demo", pass: "demo-pass-1", cid: HA + "/" });
const api = await wsClient(REST, token);
const headers = { Authorization: `Bearer ${token}` };
const failures = [];
const daysAgo = (n) => new Date(Date.now() - n * 86400e3).toISOString().slice(0, 10);

// ── Seed, all before the browser (a WS call after the page opens hangs) ──
const settings = await api.send({ type: "maintenance_supporter/settings" });
const placesWas = !!(settings.features || {}).places;
let zoneItemId = null, zoneEntity = null, entryId = null;
try {
  const states = await fetch(`${REST}/api/states`, { headers }).then((r) => r.json());
  const home = states.find((s) => s.entity_id === "zone.home")?.attributes || {};
  const zone = await api.send({
    type: "zone/create", name: "Allotment", icon: "mdi:flower", radius: 120, passive: false,
    latitude: (home.latitude || 52.52) + 0.012, longitude: (home.longitude || 13.4) + 0.008,
  });
  zoneItemId = zone.id;
  for (let i = 0; i < 20 && !zoneEntity; i++) {
    await new Promise((r) => setTimeout(r, 250));
    const all = await fetch(`${REST}/api/states`, { headers }).then((r) => r.json());
    zoneEntity = all.find((s) => s.entity_id.startsWith("zone.") && s.attributes.friendly_name === "Allotment")?.entity_id || null;
  }
  if (!zoneEntity) throw new Error("the zone did not appear");
  const areas = await api.send({ type: "config/area_registry/list" });
  const garden = (areas || []).find((a) => /garden/i.test(a.name));
  const obj = await api.send({
    type: "maintenance_supporter/object/create", name: "Garden Shed",
    place: zoneEntity, remind_on_site: true, ...(garden ? { area_id: garden.area_id } : {}),
  });
  entryId = obj.entry_id;
  for (const t of [
    { name: "Oil the gate lock", task_type: "service", interval_days: 180, last_performed: daysAgo(196) },
    { name: "Clean the rain barrel", task_type: "cleaning", interval_days: 90, last_performed: daysAgo(86) },
    { name: "Check the roof felt", task_type: "inspection", interval_days: 365, last_performed: daysAgo(40) },
  ]) {
    await api.send({ type: "maintenance_supporter/task/create", entry_id: entryId, schedule_type: "time_based", ...t });
  }
  await api.send({ type: "maintenance_supporter/global/update", settings: { advanced_places_visible: true } });
  log("SEED", zoneEntity, entryId);
} catch (e) {
  log("FAIL seed", String(e && e.message || e).slice(0, 200));
  failures.push("seed");
}

const b = await chromium.connect(PW_WS, { timeout: 20000 });
const ctx = await b.newContext({ viewport: { width: 1600, height: 1000 }, colorScheme: "dark" });
await ctx.addInitScript(({ t, ha }) => {
  localStorage.setItem("hassTokens", JSON.stringify({
    access_token: t, token_type: "Bearer", expires_in: 1800,
    hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
  }));
  localStorage.setItem("msp-overview-tab", '"dashboard"');
}, { t: token, ha: HA });
const p = await ctx.newPage();

async function openPanel() {
  await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
  for (let i = 0; i < 30; i++) {
    await p.waitForTimeout(1000);
    const ok = await p.evaluate(({ d, entry }) => {
      eval(d);
      return !!window.__panel && Array.isArray(window.__panel._objects) && window.__panel._objects.some((o) => o.entry_id === entry);
    }, { d: DEEP, entry: entryId }).catch(() => false);
    if (ok) break;
  }
  await p.waitForTimeout(1200);
}

async function panelClip(height = 1000) {
  return p.evaluate(({ d, height }) => {
    eval(d);
    const r = window.__panel.getBoundingClientRect();
    return { x: Math.max(0, r.x), y: 0, width: Math.min(r.width, 1600), height };
  }, { d: DEEP, height });
}

async function shoot(name, prepare, { verify, height } = {}) {
  if (!want(name) || !entryId) return;
  log("STEP", name);
  try {
    await openPanel();
    await p.evaluate(prepare, { d: DEEP, entry: entryId, zone: zoneEntity });
    await p.waitForTimeout(2000);
    const ok = verify ? await p.evaluate(verify, { d: DEEP, entry: entryId, zone: zoneEntity }) : true;
    if (!ok) throw new Error("what the picture is about did not render");
    await p.screenshot({ path: OUT + name, clip: await panelClip(height) });
    log("SHOT", name);
  } catch (e) {
    failures.push(name);
    log("FAIL", name, String(e && e.message || e).slice(0, 200));
  }
}

try {
  // 1. The object page: where it is maintained, and that it reminds only there.
  await shoot("object-place.png", ({ d, entry }) => {
    eval(d);
    window.__panel._showObject(entry);
  }, {
    height: 760,
    verify: ({ d }) => {
      eval(d);
      const meta = window.__panel.shadowRoot.querySelector(".place-meta");
      return !!meta && /Allotment/.test(meta.textContent) && /Remind only/.test(meta.textContent);
    },
  });

  // 2. The object dialog: the zone picker, the checkbox and its hint.
  await shoot("object-dialog-place.png", async ({ d, entry }) => {
    eval(d);
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const panel = window.__panel;
    panel._showObject(entry);
    await sleep(800);
    const obj = panel._objects.find((o) => o.entry_id === entry).object;
    const dlg = await panel._ui("maintenance-object-dialog");
    dlg.openEdit(entry, obj);
    await sleep(1500);
    const form = [...dlg.shadowRoot.querySelectorAll("ha-form")].find((f) => f.schema && f.schema[0] && f.schema[0].name === "place");
    if (form) form.scrollIntoView({ block: "center" });
  }, {
    verify: ({ d, zone }) => {
      eval(d);
      const dlg = window.__panel.shadowRoot.querySelector("maintenance-object-dialog");
      const sr = dlg && dlg.shadowRoot;
      if (!sr) return false;
      const form = [...sr.querySelectorAll("ha-form")].find((f) => f.schema && f.schema[0] && f.schema[0].name === "place");
      const box = sr.querySelector(".place-on-site input");
      return !!form && form.data.place === zone && !!box && box.checked && !!sr.querySelector(".place-hint");
    },
  });

  // 3. The dashboard filtered to the place: only what is done there.
  await shoot("dashboard-place-filter.png", ({ d, zone }) => {
    eval(d);
    const panel = window.__panel;
    panel._view = "overview";
    if (panel._setOverviewTab) panel._setOverviewTab("dashboard");
    panel._filterPlace = zone;
  }, {
    height: 620,
    verify: ({ d, zone }) => {
      eval(d);
      const sr = window.__panel.shadowRoot;
      const option = sr.querySelector(`option[value="${zone}"]`);
      const rows = [...sr.querySelectorAll("*")]
        .filter((el) => el.className && String(el.className).includes("task-name"))
        .map((el) => el.textContent.trim());
      return !!option && option.selected && rows.length === 3 && rows.every((r) => /gate|barrel|roof/i.test(r));
    },
  });
} finally {
  await ctx.close().catch(() => {});
  if (entryId) await api.send({ type: "maintenance_supporter/object/delete", entry_id: entryId }).catch(() => {});
  if (zoneItemId) await api.send({ type: "zone/delete", zone_id: zoneItemId }).catch(() => {});
  await api.send({ type: "maintenance_supporter/global/update", settings: { advanced_places_visible: placesWas } }).catch(() => {});
}

api.close();
await b.close();
if (failures.length) {
  console.error("FAILED:", failures.join(", "));
  process.exit(1);
}
process.exit(0);
