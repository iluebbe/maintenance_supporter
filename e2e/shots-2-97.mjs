/** The docs pictures of the 2.97 features: a credit (#200) in the complete
 *  dialog — next to a note over two lines (#202) — and in the task's cost
 *  chart and history, and several tasks changed at once (D#199). Dark theme,
 *  on the seeded demo instance (shots-demo.mjs seeds the credit in its 2.97
 *  block). Nothing is saved: the dialogs are photographed open.
 *  Prereqs: seeded ha-shots + playwright-server running. */
import { chromium } from "@playwright/test";
import { haLogin, watchdog } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8131", HA = "http://ha-shots:8123", PW_WS = "ws://127.0.0.1:3000/";
const OUT = new URL("../docs/images/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const log = (...a) => console.log(...a);
watchdog(8 * 60e3, "2.97 shots");

const DEEP = `const deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
  while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
    if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
    for (const k of (el.children || [])) st.push(k); } return o; };
  window.__deep = deep;
  window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];`;

const token = await haLogin(REST, { user: "demo", pass: "demo-pass-1", cid: HA + "/" });
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
const failures = [];

async function openPanel() {
  await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
  for (let i = 0; i < 30; i++) {
    await p.waitForTimeout(1000);
    const ok = await p.evaluate(({ d }) => { eval(d); return !!window.__panel && Array.isArray(window.__panel._objects) && window.__panel._objects.length > 0; }, { d: DEEP }).catch(() => false);
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
  log("STEP", name);
  try {
    await openPanel();
    await p.evaluate(prepare, { d: DEEP });
    await p.waitForTimeout(2000);
    if (verify) {
      const ok = await p.evaluate(verify, { d: DEEP });
      if (!ok) throw new Error("what the picture is about did not render");
    }
    await p.screenshot({ path: OUT + name, clip: await panelClip(height) });
    log("SHOT", name);
  } catch (e) {
    failures.push(name);
    log("FAIL", name, String(e && e.message || e).slice(0, 200));
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 1. The complete dialog: a note over two lines and a credit — the old
//    summer tyres sold. Photographed open, never submitted.
await shoot("complete-dialog-credit.png", async ({ d }) => {
  eval(d);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const panel = window.__panel;
  const o = panel._objects.find((x) => x.object.name === "Family Car");
  const t = o.tasks.find((x) => x.name === "Tire Rotation");
  panel._openCompleteDialog(o.entry_id, t.id, t.name, undefined, false);
  let dlg = null;
  for (let i = 0; i < 20 && !dlg?.shadowRoot?.querySelector("ms-cost-input"); i++) {
    await sleep(250);
    dlg = panel.shadowRoot.querySelector("maintenance-complete-dialog");
  }
  const notes = dlg.shadowRoot.querySelector("textarea.field-input");
  notes.value = "Old summer set sold\n4 × 205/55 R16, 6 mm tread left";
  notes.dispatchEvent(new Event("input", { bubbles: true }));
  const cost = dlg.shadowRoot.querySelector("ms-cost-input");
  await cost.updateComplete;
  cost.shadowRoot.querySelector(".kind.credit").click();
  await cost.updateComplete;
  const amount = cost.shadowRoot.querySelector("input.amount");
  amount.value = "90";
  amount.dispatchEvent(new Event("input", { bubbles: true }));
  await cost.updateComplete;
  await dlg.updateComplete;
}, { verify: ({ d }) => {
  eval(d);
  const dlg = window.__panel.shadowRoot.querySelector("maintenance-complete-dialog");
  const cost = dlg?.shadowRoot?.querySelector("ms-cost-input");
  const notes = dlg?.shadowRoot?.querySelector("textarea.field-input");
  return cost?.value === "-90" && !!cost.shadowRoot.querySelector(".hint") && (notes?.value || "").includes("\n");
} });

// 2. The task page: the credit hangs below the zero line of the cost chart,
//    and the history says "Credit" with the two-line note of the sale.
await shoot("task-history-credit.png", async ({ d }) => {
  eval(d);
  const panel = window.__panel;
  const o = panel._objects.find((x) => x.object.name === "Family Car");
  const t = o.tasks.find((x) => x.name === "Tire Rotation");
  panel._showTask(o.entry_id, t.id);
  await new Promise((r) => setTimeout(r, 1500));
  const card = panel.shadowRoot.querySelector(".cost-duration-card");
  card?.scrollIntoView({ block: "start" });
}, { verify: ({ d }) => {
  eval(d);
  const root = window.__panel.shadowRoot;
  return !!root.querySelector("rect.credit-bar") && !!root.querySelector(".history-credit");
} });

// 3. Several tasks at once: three selected in the task list, the bulk
//    Edit… dialog with the warning days and the priority ticked.
await shoot("bulk-edit.png", async ({ d }) => {
  eval(d);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const panel = window.__panel;
  const root = panel.shadowRoot;
  root.querySelector(".bulk-toggle").click();
  await panel.updateComplete;
  await sleep(300);
  for (const box of [...root.querySelectorAll("label.cell.bulk-check input")].slice(0, 3)) {
    box.click();
    await panel.updateComplete;
  }
  root.querySelector(".bulk-more").click();
  await panel.updateComplete;
  root.querySelector(".popup-menu-item.bulk-edit").click();
  let dlg = null;
  for (let i = 0; i < 20 && !dlg?.shadowRoot?.querySelector("input.set-priority"); i++) {
    await sleep(250);
    dlg = root.querySelector("maintenance-bulk-edit-dialog");
  }
  const sr = dlg.shadowRoot;
  sr.querySelector("input.set-warning").click();
  await dlg.updateComplete;
  const days = sr.querySelector("input.warning");
  days.value = "7";
  days.dispatchEvent(new Event("change"));
  sr.querySelector("input.set-priority").click();
  await dlg.updateComplete;
  const prio = sr.querySelector("select.priority");
  prio.value = "high";
  prio.dispatchEvent(new Event("change"));
  await dlg.updateComplete;
}, { verify: ({ d }) => {
  eval(d);
  const root = window.__panel.shadowRoot;
  const dlg = root.querySelector("maintenance-bulk-edit-dialog");
  return window.__panel._bulkSelected.size === 3 && dlg?.shadowRoot?.querySelector("select.priority")?.value === "high";
} });

await ctx.close();
await b.close();
if (failures.length) {
  console.error("FAILED:", failures.join(", "));
  process.exit(1);
}
process.exit(0);
