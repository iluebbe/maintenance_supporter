/** The docs picture of the panel's groups on a phone (#206), one
 *  group per row with the edit and delete buttons set apart. Dark theme,
 *  400 px, on the seeded demo instance. Next to the seeded "Weekly chores" it
 *  adds two groups for the picture and removes them again in the finally.
 *  Prereqs: seeded ha-shots + playwright-server running.
 *  node shots-groups-mobile.mjs [groups-mobile.png] */
import { chromium } from "@playwright/test";
import { haLogin, watchdog, wsClient } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8131", HA = "http://ha-shots:8123", PW_WS = "ws://127.0.0.1:3000/";
const OUT = new URL("../docs/images/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const log = (...a) => console.log(...a);
const only = process.argv[2];
const want = (name) => !only || only === name;
watchdog(6 * 60e3, "groups-mobile shot");

const DEEP = `const deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
  while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
    if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
    for (const k of (el.children || [])) st.push(k); } return o; };
  window.__deep = deep;
  window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];`;

const token = await haLogin(REST, { user: "demo", pass: "demo-pass-1", cid: HA + "/" });
const api = await wsClient(REST, token);
const failures = [];
const added = [];

// ── Seed, all before the browser (a WS call after the page opens hangs) ──
try {
  const { objects } = await api.send({ type: "maintenance_supporter/objects" });
  const ref = (objName, taskName) => {
    const o = objects.find((x) => x.object.name === objName);
    const t = o && (o.tasks || []).find((x) => x.name === taskName && !x.archived);
    return t ? { entry_id: o.entry_id, task_id: t.id } : null;
  };
  const groups = [
    {
      name: "Before winter",
      description: "Everything that has to be done before the first frost",
      task_refs: [ref("Pool Pump", "Pump Service"), ref("Lawn Mower", "Clean the deck"), ref("Lawn Mower", "Mower blades"), ref("Bicycle", "Annual Service")],
    },
    {
      name: "Safety checks",
      description: "",
      task_refs: [ref("Smoke Detectors", "Test Buttons"), ref("Smoke Detectors", "Battery Replacement"), ref("Family Car", "Annual Inspection (TUV)")],
    },
  ];
  for (const g of groups) {
    g.task_refs = g.task_refs.filter(Boolean);
    added.push((await api.send({ type: "maintenance_supporter/group/create", ...g })).group_id);
  }
  log("SEED", added.length, "groups");
} catch (e) {
  log("FAIL seed", String(e && e.message || e).slice(0, 200));
  failures.push("seed");
}

const b = await chromium.connect(PW_WS, { timeout: 20000 });
const ctx = await b.newContext({ viewport: { width: 400, height: 860 }, colorScheme: "dark", isMobile: true, hasTouch: true });
await ctx.addInitScript(({ t, ha }) => {
  localStorage.setItem("hassTokens", JSON.stringify({
    access_token: t, token_type: "Bearer", expires_in: 1800,
    hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
  }));
  localStorage.setItem("msp-overview-tab", '"dashboard"');
}, { t: token, ha: HA });
const p = await ctx.newPage();

try {
  if (want("groups-mobile.png") && !failures.length) {
    log("STEP groups-mobile.png");
    try {
      await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
      let ready = false;
      for (let i = 0; i < 30 && !ready; i++) {
        await p.waitForTimeout(1000);
        ready = await p.evaluate(({ d }) => { eval(d); return !!window.__panel?.shadowRoot?.querySelectorAll(".group-card").length; }, { d: DEEP }).catch(() => false);
      }
      if (!ready) throw new Error("no group cards rendered");
      await p.waitForTimeout(1500);
      // One group per row, every button inside its own card, 44 px targets.
      const check = await p.evaluate(({ d }) => {
        eval(d);
        const cards = [...window.__panel.shadowRoot.querySelectorAll(".group-card")];
        const boxes = cards.map((c) => c.getBoundingClientRect());
        const rows = new Set(boxes.map((r) => Math.round(r.top))).size;
        const ok = cards.every((c, i) => [...c.querySelectorAll(".group-card-actions ha-icon-button")].every((btn) => {
          const r = btn.getBoundingClientRect();
          return Math.round(r.width) === 44 && r.left >= boxes[i].left && r.right <= boxes[i].right && r.top >= boxes[i].top && r.bottom <= boxes[i].bottom;
        }));
        return { cards: cards.length, rows, ok };
      }, { d: DEEP });
      log("  check", JSON.stringify(check));
      if (check.cards < 3 || check.rows !== check.cards || !check.ok) throw new Error("the groups are not one per row");
      const section = await p.evaluateHandle(({ d }) => { eval(d); return window.__panel.shadowRoot.querySelector(".groups-section"); }, { d: DEEP });
      await section.scrollIntoViewIfNeeded();
      await p.waitForTimeout(500);
      const box = await section.boundingBox();
      await p.screenshot({ path: OUT + "groups-mobile.png", clip: { x: 0, y: Math.max(0, box.y - 12), width: 400, height: Math.min(860, box.height + 28) } });
      log("SHOT groups-mobile.png");
    } catch (e) {
      failures.push("groups-mobile.png");
      log("FAIL groups-mobile.png", String(e && e.message || e).slice(0, 200));
    }
  }
} finally {
  await ctx.close();
  await b.close();
  for (const id of added) await api.send({ type: "maintenance_supporter/group/delete", group_id: id }).catch((e) => log("cleanup:", e.message));
  api.close();
}
if (failures.length) {
  console.error("FAILED:", failures.join(", "));
  process.exit(1);
}
process.exit(0);
