/** The docs pictures of 2.121 on the seeded demo, dark theme:
 *
 *  - part-order.png (#261, #265): the Family Car's shelf with a cabin air
 *    filter on order (ordered by e-mail, expected in four days) and wiper
 *    blades that offer *Ordered…*.
 *  - part-move.png (#262): the part form with *Move to another object*.
 *  - task-hold-days.png (#255): a sensor rule that holds for 15 days, the
 *    minutes said in days below the field.
 *
 *  Two parts on the Family Car, a "Garden Tap" object and an outdoor
 *  temperature state are put on the demo before the browser opens and taken
 *  off again in the finally, so the other scripts keep the demo they know.
 *  Prereqs: seeded ha-shots (restarted after backend changes) +
 *  playwright-server running. Some pictures only: node shots-2-121.mjs part-order.png,part-move.png */
import { chromium } from "@playwright/test";
import { haLogin, watchdog, wsClient } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8131", HA = "http://ha-shots:8123", PW_WS = "ws://127.0.0.1:3000/";
const OUT = new URL("../docs/images/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const D = "maintenance_supporter";
const FILTER = "Cabin air filter", BLADES = "Wiper blades", TAP = "Garden Tap", TEMP = "sensor.outdoor_temperature";
const log = (...a) => console.log(...a);
const only = process.argv[2];
const want = (name) => !only || only.split(",").includes(name);
watchdog(10 * 60e3, "2.121 shots");

const DEEP = `const deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
  while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
    if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
    for (const k of (el.children || [])) st.push(k); } return o; };
  window.__deep = deep;
  window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
  window.__parts = () => deep((el) => el.tagName === "MAINTENANCE-PARTS-SECTION")[0];
  window.__dialog = () => deep((el) => el.tagName === "MAINTENANCE-TASK-DIALOG")[0];`;

const token = await haLogin(REST, { user: "demo", pass: "demo-pass-1", cid: HA + "/" });
const api = await wsClient(REST, token);
const failures = [];
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
const inDays = (n) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);
const objects = async () => (await api.send({ type: `${D}/objects` })).objects || [];
const partsOf = async (entryId) => ((await api.send({ type: `${D}/object`, entry_id: entryId }).catch(() => ({}))).parts || []);

async function unseed() {
  const objs = await objects();
  const car = objs.find((o) => o.object?.name === "Family Car");
  if (car) {
    for (const part of await partsOf(car.entry_id)) {
      if (part.name === FILTER || part.name === BLADES) await api.send({ type: `${D}/part/delete`, entry_id: car.entry_id, part_id: part.id });
    }
  }
  for (const o of objs.filter((x) => x.object?.name === TAP)) await api.send({ type: `${D}/object/delete`, entry_id: o.entry_id });
}

// ── Seed, all before the browser (a WS call after the page opens hangs) ──
const ids = {};
try {
  await unseed(); // a crashed earlier run
  await pause(1500);
  const car = (await objects()).find((o) => o.object?.name === "Family Car");
  if (!car) throw new Error("no Family Car on the demo");
  ids.car = car.entry_id;
  const filter = (await api.send({
    type: `${D}/part/create`, entry_id: ids.car, name: FILTER, vendor: "Mann-Filter", mpn: "CUK 2939",
    product_url: "orders@carparts.example", storage_location: "Garage shelf", cost: 24.9, stock: 0,
    reorder_threshold: 1, restock_quantity: 2, auto_buy_task: true,
  })).part_id;
  await pause(2500);
  await api.send({
    type: `${D}/part/create`, entry_id: ids.car, name: BLADES, vendor: "Bosch", mpn: "A 297 S",
    storage_location: "Garage shelf", cost: 31.5, stock: 2, reorder_threshold: 1, restock_quantity: 1, auto_buy_task: true,
  });
  await pause(2500);
  await api.send({ type: `${D}/part/order`, entry_id: ids.car, part_id: filter, quantity: 2, expected_date: inDays(4) });
  await pause(2500);

  await fetch(`${REST}/api/states/${TEMP}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ state: "6.4", attributes: { unit_of_measurement: "°C", device_class: "temperature", friendly_name: "Outdoor temperature" } }),
  });
  ids.tap = (await api.send({ type: `${D}/object/create`, name: TAP })).entry_id;
  await pause(1500);
  await api.send({
    type: `${D}/task/create`, entry_id: ids.tap, name: "Open the irrigation", task_type: "service", schedule_type: "sensor_based",
    trigger_config: { type: "threshold", entity_id: TEMP, entity_ids: [TEMP], trigger_above: 3, trigger_for_minutes: 21600 },
  });
  await pause(2500);
  ids.tapTask = (await objects()).find((o) => o.entry_id === ids.tap)?.tasks?.[0]?.id;
  if (!ids.tapTask) throw new Error("the Garden Tap has no task");
} catch (e) {
  log("FAIL seed", String(e && e.message || e).slice(0, 200));
  failures.push("seed");
}

const b = await chromium.connect(PW_WS, { timeout: 20000 });
const ctx = await b.newContext({ viewport: { width: 1600, height: 1000 }, colorScheme: "dark" });
// F5 keeps the panel's page since 2.116 (history state); every visit here starts fresh.
await ctx.addInitScript(() => { try { history.replaceState(null, ""); } catch { /* ignore */ } });
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
    const ok = await p.evaluate(({ d, id }) => {
      eval(d);
      return !!window.__panel && Array.isArray(window.__panel._objects) && window.__panel._objects.some((o) => o.entry_id === id);
    }, { d: DEEP, id: ids.tap }).catch(() => false);
    if (ok) break;
  }
  await p.waitForTimeout(1200);
}

/** One element with a margin, across the panel's width. */
async function clipOf(finder) {
  return p.evaluate(({ d, finder }) => {
    eval(d);
    const r = window.__panel.getBoundingClientRect();
    // eslint-disable-next-line no-new-func
    const el = new Function("return (" + finder + ")()")();
    const e = el.getBoundingClientRect();
    const y = Math.max(0, e.y - 16);
    return { x: Math.max(0, r.x), y, width: Math.min(r.width, 1600), height: Math.min(e.height + 32, innerHeight - y) };
  }, { d: DEEP, finder });
}

async function shoot(name, prepare, { verify, clip } = {}) {
  if (!want(name) || !ids.tapTask) return;
  log("STEP", name);
  try {
    await openPanel();
    await p.evaluate(prepare, { d: DEEP, ids });
    await p.waitForTimeout(2000);
    const ok = verify ? await p.evaluate(verify, { d: DEEP, ids }) : true;
    if (!ok) throw new Error("what the picture is about did not render");
    await p.screenshot({ path: OUT + name, ...(clip ? { clip: await clipOf(clip) } : {}) });
    log("SHOT", name);
  } catch (e) {
    failures.push(name);
    log("FAIL", name, String(e && e.message || e).slice(0, 200));
  }
}

const showCarParts = async ({ d, ids }) => {
  eval(d);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  window.__panel._showObject(ids.car);
  for (let i = 0; i < 30 && !(window.__parts() && window.__parts().parts.some((x) => x.name === "Wiper blades")); i++) await sleep(300);
  window.__parts().scrollIntoView({ block: "center" });
};

try {
  // 1. On order, and the pill that records an order.
  await shoot("part-order.png", showCarParts, {
    clip: "() => window.__parts()",
    verify: ({ d }) => {
      eval(d);
      const sr = window.__parts()?.shadowRoot;
      const badge = sr?.querySelector(".order-badge")?.textContent || "";
      console.log("order badge:", badge.trim());
      return /On order: 2/.test(badge) && !!sr.querySelector(".order-open") && !!sr.querySelector('a[href^="mailto:"]');
    },
  });

  // 2. The part form: Move to another object, an object chosen.
  await shoot("part-move.png", async ({ d, ids }) => {
    eval(d);
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    window.__panel._showObject(ids.car);
    for (let i = 0; i < 30 && !(window.__parts() && window.__parts().parts.some((x) => x.name === "Wiper blades")); i++) await sleep(300);
    const section = window.__parts();
    section._openEdit(section.parts.find((x) => x.name === "Wiper blades"));
    await sleep(400);
    const target = section.moveTargets.find((o) => /lawn mower/i.test(o.name)) || section.moveTargets[0];
    section._moveTo = target.entry_id;
    await sleep(400);
    section.shadowRoot.querySelector(".part-move").scrollIntoView({ block: "center" });
  }, {
    clip: "() => window.__parts().shadowRoot.querySelector('.part-form')",
    verify: ({ d }) => {
      eval(d);
      const sel = window.__parts()?.shadowRoot?.querySelector(".move-select");
      return !!sel && !!sel.value && sel.options.length > 2;
    },
  });

  // 3. A rule that holds for 15 days: 21600 minutes, said in days.
  await shoot("task-hold-days.png", async ({ d, ids }) => {
    eval(d);
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const panel = window.__panel;
    const obj = panel._objects.find((o) => o.entry_id === ids.tap);
    const dlg = panel.shadowRoot.querySelector("maintenance-task-dialog") || (await panel._ui("maintenance-task-dialog"));
    await dlg.openEdit(ids.tap, obj.tasks[0]);
    // The new look shows a rule as a sentence; its fields open with the row.
    await sleep(600);
    dlg._ruleSel = "trigger";
    for (let i = 0; i < 30 && !dlg.shadowRoot.querySelector(".hold-readable"); i++) await sleep(300);
    dlg.shadowRoot.querySelector(".hold-readable")?.scrollIntoView({ block: "center" });
  }, {
    verify: ({ d }) => {
      eval(d);
      const dlg = window.__dialog();
      const hint = dlg?.shadowRoot?.querySelector(".hold-readable")?.textContent || "";
      console.log("hold hint:", hint.trim());
      return dlg && dlg._open !== false && /15 days/.test(hint);
    },
  });
} finally {
  await ctx.close().catch(() => {});
  await unseed().catch((e) => log("FAIL unseed", String(e && e.message || e).slice(0, 200)));
}

api.close();
await b.close();
if (failures.length) {
  console.error("FAILED:", failures.join(", "));
  process.exit(1);
}
process.exit(0);
