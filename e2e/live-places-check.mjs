/** Live check on ha-maint for Places (2026-10).
 *
 *   1. object/create stores a place + "remind only on site"; the payload
 *      names the zone.
 *   2. The on_site gate: an overdue reminder of an object that reminds only
 *      on site waits while nobody is there; a control object at home is told.
 *   3. Arrival (person state with in_zones, as the companion apps report it):
 *      still no reminder inside the two-minute stay; after it, ONE
 *      place_arrival event for the arriving person, listing the due task;
 *      the held status reminder does not follow it.
 *   4. The calendar events of the object carry the place as location.
 *   5. Panel: the object page shows the place, the edit dialog has the zone
 *      picker and the checkbox (also at 360 px, nothing spills), the
 *      dashboard's Place filter narrows the list.
 *   6. A renamed zone entity moves the object's place; a deleted zone is
 *      reported as missing.
 *
 *  Event-only mode makes every notification an event to assert on. Seeds a
 *  throwaway zone + two objects; restores the settings and person state;
 *  cleans up. Takes about three minutes (the stay is real time).
 */
import { chromium } from "@playwright/test";
import { DEEP_SRC, hassTokensInit, loadToken, watchdog, wsClient } from "./ws-client.mjs";

const HA = "http://ha-maint:8123", REST = "http://127.0.0.1:8125", PW_WS = "ws://127.0.0.1:3000/";
const log = (...a) => console.log(...a);
const fail = (m) => { console.error("FAIL:", m); throw new Error(m); };
const assert = (cond, msg) => { if (!cond) fail(msg); log("  ok:", msg); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
watchdog(9 * 60e3, "places live check");

const token = loadToken();
const api = await wsClient(REST, token);
const stamp = Date.now() % 100000;
const zoneName = `Allotment ${stamp}`;
let zoneItemId = null;
let zoneEntity = null;
let entryA = null, entryB = null;
let browser = null;
let savedGlobals = null;
let personBefore = null;
let unsubscribe = null;
const events = [];

const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
const getState = async (entity) => {
  const r = await fetch(`${REST}/api/states/${entity}`, { headers });
  return r.ok ? r.json() : null;
};
const setState = (entity, state, attributes) =>
  fetch(`${REST}/api/states/${entity}`, { method: "POST", headers, body: JSON.stringify({ state, attributes }) });
const refresh = (entity) =>
  api.send({ type: "call_service", domain: "homeassistant", service: "update_entity", target: { entity_id: entity } });
const mine = (kind, entryId) => events.filter((e) => e.kind === kind && (!entryId || e.entry_id === entryId));

try {
  // ── Settings: event-only, no quiet hours, Places on ──
  const s = await api.send({ type: "maintenance_supporter/settings" });
  const n = s.notifications || {};
  savedGlobals = {
    notifications_enabled: !!(s.general || {}).notifications_enabled,
    notify_event_only: !!n.event_only,
    notify_scope_view_id: n.scope_view_id || "",
    notify_overdue_enabled: n.overdue_enabled ?? true,
    quiet_hours_enabled: n.quiet_hours_enabled ?? true,
    advanced_places_visible: !!(s.features || {}).places,
  };
  log("  saved settings:", JSON.stringify(savedGlobals));
  await api.send({
    type: "maintenance_supporter/global/update",
    settings: {
      notifications_enabled: true, notify_event_only: true, notify_scope_view_id: "",
      notify_overdue_enabled: true, quiet_hours_enabled: false, advanced_places_visible: true,
    },
  });
  unsubscribe = await api.subscribe(
    { type: "subscribe_events", event_type: "maintenance_supporter_notification" },
    (ev) => events.push(ev.data),
  );

  // ── Seed: a zone, an object there (only on site) and one at home ──
  const zone = await api.send({
    type: "zone/create", name: zoneName, latitude: 52.52, longitude: 13.405, radius: 150, passive: false, icon: "mdi:flower",
  });
  zoneItemId = zone.id;
  for (let i = 0; i < 20 && !zoneEntity; i++) {
    await sleep(250);
    const all = await fetch(`${REST}/api/states`, { headers }).then((r) => r.json());
    zoneEntity = all.find((s) => s.entity_id.startsWith("zone.") && s.attributes.friendly_name === zoneName)?.entity_id || null;
  }
  assert(!!zoneEntity, `zone created (${zoneEntity})`);

  const objA = await api.send({
    type: "maintenance_supporter/object/create", name: `placesa${stamp}`, place: zoneEntity, remind_on_site: true,
  });
  entryA = objA.entry_id;
  const objB = await api.send({ type: "maintenance_supporter/object/create", name: `placesb${stamp}` });
  entryB = objB.entry_id;
  const recent = new Date(Date.now() - 2 * 86400e3).toISOString().slice(0, 10);
  const tA = await api.send({
    type: "maintenance_supporter/task/create", entry_id: entryA, name: "oilgate",
    schedule_type: "time_based", interval_days: 30, last_performed: recent,
  });
  const tB = await api.send({
    type: "maintenance_supporter/task/create", entry_id: entryB, name: "descale",
    schedule_type: "time_based", interval_days: 30, last_performed: recent,
  });
  const sensorA = `sensor.placesa${stamp}_oilgate`;
  assert(!!(await getState(sensorA)), `task sensor ${sensorA} exists`);

  // 1. Payload
  const gotA = (await api.send({ type: "maintenance_supporter/object", entry_id: entryA })).object;
  assert(gotA.place === zoneEntity && gotA.place_name === zoneName && gotA.place_missing === false && gotA.remind_on_site === true,
    `object payload names the place (${JSON.stringify({ p: gotA.place, n: gotA.place_name, m: gotA.place_missing, r: gotA.remind_on_site })})`);
  const gotB = (await api.send({ type: "maintenance_supporter/object", entry_id: entryB })).object;
  assert(!gotB.place && gotB.remind_on_site === false, "an object at home has no place");

  // 2. Both tasks turn overdue on the running coordinators (task/reset writes
  //    the Store only, so the next refresh sees a live status change).
  const veryPast = new Date(Date.now() - 200 * 86400e3).toISOString().slice(0, 10);
  await api.send({ type: "maintenance_supporter/task/reset", entry_id: entryA, task_id: tA.task_id, date: veryPast });
  await api.send({ type: "maintenance_supporter/task/reset", entry_id: entryB, task_id: tB.task_id, date: veryPast });
  await sleep(13000);
  assert(mine("status", entryB).length === 1, `the object at home is reminded (${mine("status", entryB).length})`);
  assert(events.filter((e) => e.entry_id === entryA).length === 0, "the object at the place waits: nobody is there");

  // 3. Arrival. The person must have been seen somewhere first (a first
  //    position, as after a restart, is no arrival).
  personBefore = await getState("person.dev");
  assert(!!personBefore?.attributes?.user_id, "person.dev is linked to a user");
  const base = { ...personBefore.attributes };
  await setState("person.dev", "not_home", { ...base, in_zones: [] });
  await sleep(1000);
  const arrivedAt = Date.now();
  await setState("person.dev", zoneName, { ...base, in_zones: [zoneEntity] });
  await sleep(1500);
  assert((await getState(zoneEntity))?.state === "1", "the zone counts the person (in_zones)");
  await refresh(sensorA);
  await sleep(12000);
  assert(events.filter((e) => e.entry_id === entryA).length === 0, "inside the two-minute stay: still no reminder (a drive past is no stay)");
  assert(mine("place_arrival").length === 0, "no arrival message before the stay");

  // The stay is two minutes of real time; give it 50 s on top.
  while (mine("place_arrival").length === 0 && Date.now() - arrivedAt < 170e3) await sleep(2000);
  await sleep(3000); // a second message would show up now
  const waited = Math.round((Date.now() - arrivedAt) / 1000);
  const arrivals = mine("place_arrival");
  assert(arrivals.length === 1, `one arrival message after the stay (${waited}s)`);
  const a = arrivals[0];
  assert(a.place === zoneEntity && a.place_name === zoneName, "the message names the place");
  assert(a.responsible_user_id === personBefore.attributes.user_id, "it is for the arriving person");
  assert(Array.isArray(a.tasks) && a.tasks.length === 1 && a.tasks[0].task_id === tA.task_id, "it lists the task due there");
  assert(/oilgate/i.test(a.message || "") && (a.title || "").includes(zoneName), `title/message (${a.title} | ${a.message})`);
  assert(a.target === null, "event-only: the event is the delivery");

  await refresh(sensorA);
  await sleep(12000);
  assert(mine("status", entryA).length === 0, "the held reminder does not follow the arrival message");

  // 4. Calendar location
  const all = await fetch(`${REST}/api/states`, { headers }).then((r) => r.json());
  const cal = all.find((s) => s.entity_id.startsWith("calendar.") && /maintenance/.test(s.entity_id))?.entity_id;
  assert(!!cal, `maintenance calendar found (${cal})`);
  const start = new Date(Date.now() - 400 * 86400e3).toISOString(), end = new Date(Date.now() + 400 * 86400e3).toISOString();
  const calEvents = await fetch(`${REST}/api/calendars/${cal}?start=${start}&end=${end}`, { headers }).then((r) => r.json());
  const evA = calEvents.filter((e) => (e.summary || "").includes("oilgate"));
  const evB = calEvents.filter((e) => (e.summary || "").includes("descale"));
  assert(evA.length > 0 && evA.every((e) => e.location === zoneName), `calendar events at the place carry it (${evA.length})`);
  assert(evB.length > 0 && evB.every((e) => !e.location), "events at home have no location");

  // 5. Panel
  browser = await chromium.connect(PW_WS, { timeout: 20000 });
  for (const width of [1360, 360]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    const p = await ctx.newPage();
    await p.addInitScript(hassTokensInit, { t: token, ha: HA });
    await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded", timeout: 30000 });
    let up = false;
    for (let i = 0; i < 30 && !up; i++) {
      await p.waitForTimeout(1000);
      up = await p.evaluate(`(() => { ${DEEP_SRC}
        window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
        return !!window.__panel && Array.isArray(window.__panel._objects) && window.__panel._objects.some((o) => o.entry_id === ${JSON.stringify(entryA)});
      })()`).catch(() => false);
    }
    assert(up, `panel mounted (${width}px)`);
    const ui = await p.evaluate(async ({ entryA, zoneEntity, width }) => {
      const panel = window.__panel;
      const wait = (ms) => new Promise((r) => setTimeout(r, ms));
      const out = { width, features: panel._features && panel._features.places };
      panel._showObject(entryA);
      await wait(1500);
      out.meta = (panel.shadowRoot.querySelector(".place-meta")?.textContent || "").replace(/\s+/g, " ").trim();
      const dlg = panel.shadowRoot.querySelector("maintenance-object-dialog");
      const obj = panel._objects.find((o) => o.entry_id === entryA).object;
      dlg.openEdit(entryA, obj);
      await wait(2000);
      const sr = dlg.shadowRoot;
      const form = [...sr.querySelectorAll("ha-form")].find((f) => f.schema && f.schema[0] && f.schema[0].name === "place");
      out.pickerValue = form ? form.data.place : null;
      const box = sr.querySelector(".place-on-site");
      out.checked = box ? box.querySelector("input").checked : null;
      out.hint = !!sr.querySelector(".place-hint");
      // In-box spill: each place element stays inside its container.
      const spill = [];
      for (const el of [form, box, sr.querySelector(".place-hint")]) {
        if (!el) continue;
        const r = el.getBoundingClientRect(), pr = el.parentElement.getBoundingClientRect();
        if (r.right > pr.right + 1 || r.left < pr.left - 1 || r.right > window.innerWidth) spill.push(el.className || el.tagName);
      }
      out.spill = spill;
      dlg._open = false;
      if (typeof dlg.close === "function") dlg.close();
      await wait(500);
      if (width > 400) {
        panel._view = "overview";
        panel._setOverviewTab ? panel._setOverviewTab("dashboard") : (panel._overviewTab = "dashboard");
        await wait(800);
        out.option = !!panel.shadowRoot.querySelector(`option[value="${zoneEntity}"]`);
        const names = () => [...panel.shadowRoot.querySelectorAll("*")]
          .filter((el) => el.className && String(el.className).includes("task-name"))
          .map((el) => (el.textContent || "").trim())
          .filter((n) => /oilgate|descale/.test(n));
        panel._filterPlace = zoneEntity;
        await wait(1200);
        out.atPlace = names();
        panel._filterPlace = "home";
        await wait(1200);
        out.atHome = names();
        panel._filterPlace = "";
      }
      return out;
    }, { entryA, zoneEntity, width });
    log("  ui:", JSON.stringify(ui));
    assert(ui.features === true, `Places on in the panel (${width}px)`);
    assert(ui.meta.includes(zoneName), `object page shows the place (${width}px)`);
    assert(ui.pickerValue === zoneEntity && ui.checked === true && ui.hint, `edit dialog: zone picker + checkbox (${width}px)`);
    assert(ui.spill.length === 0, `nothing spills out of the dialog (${width}px: ${ui.spill.join(",")})`);
    if (width > 400) {
      assert(ui.option, "the dashboard offers the place in its Place filter");
      assert(ui.atPlace.length === 1 && /oilgate/.test(ui.atPlace[0]), `filter by the place (${JSON.stringify(ui.atPlace)})`);
      assert(ui.atHome.some((n) => /descale/.test(n)) && !ui.atHome.some((n) => /oilgate/.test(n)), `filter by home (${JSON.stringify(ui.atHome)})`);
    }
    await ctx.close();
  }

  // 6. Rename the zone's entity id, then delete the zone.
  const renamed = `${zoneEntity}_moved`;
  await api.send({ type: "config/entity_registry/update", entity_id: zoneEntity, new_entity_id: renamed });
  await sleep(2500);
  const moved = (await api.send({ type: "maintenance_supporter/object", entry_id: entryA })).object;
  assert(moved.place === renamed && moved.place_missing === false, `a renamed zone keeps its objects (${moved.place})`);
  await api.send({ type: "zone/delete", zone_id: zoneItemId });
  zoneItemId = null;
  await sleep(2000);
  const gone = (await api.send({ type: "maintenance_supporter/object", entry_id: entryA })).object;
  assert(gone.place === renamed && gone.place_missing === true && gone.place_name === null, "a deleted zone is reported as missing");

  log("\nALL LIVE CHECKS PASSED");
  process.exitCode = 0;
} catch (err) {
  console.error("ERROR:", err && (err.stack || err.message || err));
  process.exitCode = 1;
} finally {
  try { if (unsubscribe) await unsubscribe(); } catch { /* ignore */ }
  try { if (personBefore) await setState("person.dev", personBefore.state, personBefore.attributes); } catch { /* ignore */ }
  try { if (savedGlobals) await api.send({ type: "maintenance_supporter/global/update", settings: savedGlobals }); } catch { /* ignore */ }
  for (const id of [entryA, entryB]) {
    try { if (id) await api.send({ type: "maintenance_supporter/object/delete", entry_id: id }); } catch { /* ignore */ }
  }
  try { if (zoneItemId) await api.send({ type: "zone/delete", zone_id: zoneItemId }); } catch { /* ignore */ }
  try { if (browser) await browser.close(); } catch { /* ignore */ }
  api.close();
}
