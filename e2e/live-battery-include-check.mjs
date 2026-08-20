/** Live check on ha-maint for the #135 battery-fleet round.
 *
 *   1. A heuristic-miss sensor (no device_class, no "battery" in the name)
 *      is NOT discovered on its own.
 *   2. battery_fleet/set_included adds it — it appears in the overview with
 *      its level.
 *   3. Excluding it lifts the include (gone from roster AND from the
 *      excluded chips).
 *   4. The fleet low sensor exposes batteries_due lines in the
 *      "<name> — replace (type)" / "<name> — recharge" format.
 *   5. Panel: the roster renders the add-battery picker.
 *   6. No raw locale keys leak into the section (v2.61.0 regression guard).
 *   7. battery_fleet/set_track_self_charging persists and survives a REAL
 *      page reload into the toggle's checked state.
 *   8. Clicking the toggle in the UI switches the option back off.
 *
 *  Uses the existing dev fleet; cleans up its own entity + include + option.
 */
import { chromium } from "@playwright/test";
import { hassTokensInit, loadToken, watchdog, wsClient } from "./ws-client.mjs";

const HA = "http://ha-maint:8123", REST = "http://127.0.0.1:8125", PW_WS = "ws://127.0.0.1:3000/";
const log = (...a) => console.log(...a);
const fail = (m) => { console.error("FAIL:", m); throw new Error(m); };
const assert = (cond, msg) => { if (!cond) fail(msg); log("  ok:", msg); };
watchdog(6 * 60e3, "battery include live check");

const token = loadToken();
const api = await wsClient(REST, token);
const stamp = Date.now() % 100000;
const EID = `sensor.sidegate_cell_${stamp}`;
let browser = null;
let included = false;
let trackSet = false;

try {
  // Seed a heuristic miss: % unit but no device_class and no "battery" name.
  await fetch(`${REST}/api/states/${EID}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ state: "37", attributes: { unit_of_measurement: "%", friendly_name: `Side Gate Cell ${stamp}` } }),
  });

  const ov1 = await api.send({ type: "maintenance_supporter/battery_fleet/overview" });
  assert((ov1.all || []).every((r) => r.entity_id !== EID), "heuristic miss is NOT auto-discovered");

  // 2. include -> appears
  await api.send({ type: "maintenance_supporter/battery_fleet/set_included", entity_id: EID, included: true });
  included = true;
  const ov2 = await api.send({ type: "maintenance_supporter/battery_fleet/overview" });
  const row = (ov2.all || []).find((r) => r.entity_id === EID);
  assert(row && row.level === 37, `manual include joins the roster with its level (${JSON.stringify(row || {}).slice(0, 120)})`);

  // 3. exclude lifts the include
  await api.send({ type: "maintenance_supporter/battery_fleet/set_excluded", entity_id: EID, excluded: true });
  included = false;
  const ov3 = await api.send({ type: "maintenance_supporter/battery_fleet/overview" });
  assert((ov3.all || []).every((r) => r.entity_id !== EID), "excluding a manual include removes it from the roster");
  assert((ov3.excluded || []).every((x) => x.entity_id !== EID), "…and it does NOT land in the excluded chips (include lifted)");

  // 4. batteries_due on the real fleet sensor
  const states = await fetch(`${REST}/api/states`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json());
  const fleet = states.find((s) => s.attributes && Array.isArray(s.attributes.batteries_due));
  assert(fleet, "fleet low sensor exposes batteries_due");
  const due = fleet.attributes.batteries_due;
  log("  batteries_due sample:", JSON.stringify(due.slice(0, 3)));
  assert(due.every((l) => / — (replace \(.+\)|recharge)$/.test(l)),
    `every due line is name — replace (type) | recharge (${due[0] || "empty"})`);

  // 5. Panel roster renders the picker — the section lives on the FLEET
  // task's detail page, so navigate there first (same as the roster check).
  const objs = await api.send({ type: "maintenance_supporter/objects" });
  let fleetEntry = null, fleetTaskId = null;
  for (const o of objs.objects || []) {
    const ft = (o.tasks || []).find((t2) => t2.battery_fleet_task);
    if (ft) { fleetEntry = o.entry_id; fleetTaskId = ft.id; break; }
  }
  assert(fleetEntry, "found the fleet task");

  browser = await chromium.connect(PW_WS, { timeout: 20000 });
  const ctx = await browser.newContext({ viewport: { width: 1360, height: 950 } });
  const p = await ctx.newPage();
  await p.addInitScript(hassTokensInit, { t: token, ha: HA });
  await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded", timeout: 30000 });
  let found = false;
  for (let i = 0; i < 30 && !found; i++) {
    await p.waitForTimeout(1000);
    found = await p.evaluate(({ e, t2 }) => {
      const deep = (pred) => { const st = [document.documentElement]; const o = []; let n = 0;
        while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
          if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
          for (const k of (el.children || [])) st.push(k); } return o; };
      const panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
      if (!panel || !panel.shadowRoot || !Array.isArray(panel._objects) || !panel._objects.length) return false;
      if (!window.__navigated) { panel._showTask(e, t2); window.__navigated = true; return false; }
      const sec = panel.shadowRoot.querySelector("maintenance-battery-fleet-section");
      if (!sec || !sec.shadowRoot) return false;
      const roster = sec.shadowRoot.querySelector("details.bf-roster");
      if (roster) roster.open = true;
      return !!sec.shadowRoot.querySelector(".bf-add ha-selector");
    }, { e: fleetEntry, t2: fleetTaskId }).catch(() => false);
  }
  assert(found, "fleet task detail renders the add-battery picker");

  // 7. WS toggle persists…
  await api.send({ type: "maintenance_supporter/battery_fleet/set_track_self_charging", enabled: true });
  trackSet = true;
  const ov4 = await api.send({ type: "maintenance_supporter/battery_fleet/overview" });
  assert(ov4.track_self_charging === true, "set_track_self_charging persists (overview reports true)");

  // …and survives a REAL reload into the checked toggle. Also scan the
  // section's rendered text for raw locale keys (check 6, the v2.61.0
  // BATTERY_FLEET_ADD regression).
  await p.reload({ waitUntil: "domcontentloaded", timeout: 30000 });
  let ui = null;
  for (let i = 0; i < 30 && !ui; i++) {
    await p.waitForTimeout(1000);
    ui = await p.evaluate(({ e, t2 }) => {
      const deep = (pred) => { const st = [document.documentElement]; const o = []; let n = 0;
        while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
          if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
          for (const k of (el.children || [])) st.push(k); } return o; };
      const panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
      if (!panel || !panel.shadowRoot || !Array.isArray(panel._objects) || !panel._objects.length) return null;
      if (!window.__navigated2) { panel._showTask(e, t2); window.__navigated2 = true; return null; }
      const sec = panel.shadowRoot.querySelector("maintenance-battery-fleet-section");
      if (!sec || !sec.shadowRoot) return null;
      const roster = sec.shadowRoot.querySelector("details.bf-roster");
      if (roster) roster.open = true;
      const input = sec.shadowRoot.querySelector(".bf-track-self input");
      if (!input) return null;
      const raw = (sec.shadowRoot.textContent || "").match(/battery_fleet_\w+/g) || [];
      return { checked: !!input.checked, raw };
    }, { e: fleetEntry, t2: fleetTaskId }).catch(() => null);
  }
  assert(ui, "roster renders the track-self-charging toggle");
  assert(ui.raw.length === 0, `no raw locale keys leak into the section (${ui.raw.join(",") || "clean"})`);
  assert(ui.checked === true, "toggle reflects the enabled option after a real reload");

  // 8. A real UI click switches it back off.
  await p.evaluate(() => {
    const deep = (pred) => { const st = [document.documentElement]; const o = []; let n = 0;
      while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
        if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
        for (const k of (el.children || [])) st.push(k); } return o; };
    const panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
    const sec = panel.shadowRoot.querySelector("maintenance-battery-fleet-section");
    sec.shadowRoot.querySelector(".bf-track-self input").click();
  });
  await p.waitForTimeout(2000);
  const ov5 = await api.send({ type: "maintenance_supporter/battery_fleet/overview" });
  assert(ov5.track_self_charging === false, "clicking the toggle in the UI switches the option off");
  trackSet = false;

  log("\nALL LIVE CHECKS PASSED");
  process.exitCode = 0;
} catch (err) {
  console.error("ERROR:", err && (err.stack || err.message || err));
  process.exitCode = 1;
} finally {
  try { if (included) await api.send({ type: "maintenance_supporter/battery_fleet/set_included", entity_id: EID, included: false }); } catch { /* ignore */ }
  try { if (trackSet) await api.send({ type: "maintenance_supporter/battery_fleet/set_track_self_charging", enabled: false }); } catch { /* ignore */ }
  try {
    await fetch(`${REST}/api/states/${EID}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
  } catch { /* ignore */ }
  try { if (browser) await browser.close(); } catch { /* ignore */ }
  try { api.close(); } catch { /* ignore */ }
  process.exit(process.exitCode ?? 1);
}
