/** The docs pictures of 2.100: Plant Monitor's plants in Suggested setups
 *  (#204, the demo plant fixture: the Monstera reports a problem) and an
 *  object page whose tasks without a due date say when they were last done
 *  (D#203, the seeded Home Office PC). Dark theme, on the seeded demo
 *  instance (shots-demo.mjs seeds both in its 2.100 block). Nothing is
 *  saved: the dialog is photographed open and closed again.
 *  Prereqs: seeded ha-shots (with the plant fixture mount) + playwright-server.
 *  One picture only: node shots-2-100.mjs due-last-done.png */
import { chromium } from "@playwright/test";
import { haLogin, watchdog } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8131", HA = "http://ha-shots:8123", PW_WS = "ws://127.0.0.1:3000/";
const OUT = new URL("../docs/images/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const log = (...a) => console.log(...a);
const only = process.argv[2];
const want = (name) => !only || only === name;
watchdog(8 * 60e3, "2.100 shots");

const DEEP = `const deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
  while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
    if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
    for (const k of (el.children || [])) st.push(k); } return o; };
  window.__deep = deep;
  window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];`;

const token = await haLogin(REST, { user: "demo", pass: "demo-pass-1", cid: HA + "/" });
const b = await chromium.connect(PW_WS, { timeout: 20000 });
const ctx = await b.newContext({ viewport: { width: 1600, height: 1300 }, colorScheme: "dark" });
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

async function shoot(name, prepare, { verify, height, after } = {}) {
  if (!want(name)) return;
  log("STEP", name);
  try {
    await openPanel();
    await p.evaluate(prepare, { d: DEEP });
    await p.waitForTimeout(2500);
    const ok = verify ? await p.evaluate(verify, { d: DEEP }) : true;
    if (!ok) throw new Error("what the picture is about did not render");
    await p.screenshot({ path: OUT + name, clip: await panelClip(height) });
    log("SHOT", name);
  } catch (e) {
    failures.push(name);
    log("FAIL", name, String(e && e.message || e).slice(0, 200));
  } finally {
    if (after) await p.evaluate(after, { d: DEEP }).catch(() => {});
  }
}

// 1. #204: Suggested setups proposes "Check Plant" for both plants — scrolled
//    to the first of them (the Monstera's summary reports a problem).
await shoot("suggested-setups-plant.png", async ({ d }) => {
  eval(d);
  window.__panel._openSuggestedSetups();
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  for (let i = 0; i < 20; i++) {
    await sleep(500);
    const dlg = window.__deep((el) => el.tagName === "MAINTENANCE-SUGGESTED-SETUPS-DIALOG")[0];
    if (!dlg || !dlg.shadowRoot) continue;
    let hit = null;
    const roots = [dlg.shadowRoot];
    while (roots.length && !hit) {
      for (const el of roots.pop().querySelectorAll("*")) {
        if (!hit && el.children.length === 0 && /Fiddle-Leaf Fig/.test(el.textContent || "")) hit = el;
        if (el.shadowRoot) roots.push(el.shadowRoot);
      }
    }
    if (hit) { hit.scrollIntoView({ block: "start" }); break; }
  }
}, {
  height: 1300,
  verify: ({ d }) => {
    eval(d);
    const dlg = window.__deep((el) => el.tagName === "MAINTENANCE-SUGGESTED-SETUPS-DIALOG")[0];
    const text = dlg && dlg.shadowRoot ? dlg.shadowRoot.textContent : "";
    return /Monstera/.test(text) && /Fiddle-Leaf Fig/.test(text) && /Check Plant/.test(text);
  },
  after: ({ d }) => {
    eval(d);
    for (const el of window.__deep((x) => x.tagName === "MAINTENANCE-SUGGESTED-SETUPS-DIALOG")) el._close ? el._close() : (el._open = false);
  },
});

// 2. D#203: the PC's tasks without a due date say when they were last done.
await shoot("due-last-done.png", ({ d }) => {
  eval(d);
  const panel = window.__panel;
  const pc = panel._objects.find((o) => o.object.name === "Home Office PC");
  panel._showObject(pc.entry_id);
}, {
  height: 620,
  verify: ({ d }) => {
    eval(d);
    const texts = [...window.__panel.shadowRoot.querySelectorAll(".due-text.last-done")].map((x) => x.textContent.trim());
    return texts.some((x) => /done \d+ d ago/.test(x));
  },
});

await ctx.close();
await b.close();
if (failures.length) {
  console.error("FAILED:", failures.join(", "));
  process.exit(1);
}
process.exit(0);
