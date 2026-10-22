/** The docs pictures of 2.107/2.108 on the seeded demo, dark theme:
 *  sub-objects (#225) on the All objects cards, in the table and on an
 *  object's page with its breadcrumb; *Use* on a part outside a task (#226),
 *  and the part form's *Counts as spending* (#222). The hierarchy and the
 *  washer fluid come from demo-sub-objects.mjs and go again in the finally.
 *  Prereqs: seeded ha-shots (restarted after backend changes) +
 *  playwright-server running. One picture only: node shots-2-108.mjs part-use.png */
import { chromium } from "@playwright/test";
import { haLogin, watchdog, wsClient } from "./ws-client.mjs";
import { seedSubObjects, unseedSubObjects } from "./demo-sub-objects.mjs";

const REST = "http://127.0.0.1:8131", HA = "http://ha-shots:8123", PW_WS = "ws://127.0.0.1:3000/";
const OUT = new URL("../docs/images/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const log = (...a) => console.log(...a);
const only = process.argv[2];
const want = (name) => !only || only === name;
watchdog(10 * 60e3, "2.108 shots");

const DEEP = `const deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
  while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
    if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
    for (const k of (el.children || [])) st.push(k); } return o; };
  window.__deep = deep;
  window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
  window.__fluidUse = () => deep((el) => el.tagName === "MS-PART-USE" && el.sparePart && el.sparePart.name === "Washer fluid")[0];`;

const token = await haLogin(REST, { user: "demo", pass: "demo-pass-1", cid: HA + "/" });
const api = await wsClient(REST, token);
const failures = [];

// ── Seed, all before the browser (a WS call after the page opens hangs) ──
let ids = {};
try {
  await unseedSubObjects(api); // a crashed earlier run
  ids = await seedSubObjects(api, log);
  if (!ids.Garden || !ids["Charging Station"]) throw new Error("the hierarchy is incomplete");
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
    const ok = await p.evaluate(({ d, id }) => {
      eval(d);
      return !!window.__panel && Array.isArray(window.__panel._objects) && window.__panel._objects.some((o) => o.entry_id === id);
    }, { d: DEEP, id: ids["Charging Station"] }).catch(() => false);
    if (ok) break;
  }
  await p.waitForTimeout(1200);
}

/** The panel from its top, or one element of it with a margin. */
async function clipOf(height, selector) {
  return p.evaluate(({ d, height, selector }) => {
    eval(d);
    const panel = window.__panel;
    const r = panel.getBoundingClientRect();
    if (!selector) return { x: Math.max(0, r.x), y: 0, width: Math.min(r.width, 1600), height };
    const el = selector === "fluid-use"
      ? window.__fluidUse().getRootNode().host
      : window.__deep((x) => x.matches && x.matches(selector))[0];
    const e = el.getBoundingClientRect();
    const y = Math.max(0, e.y - 16);
    return { x: Math.max(0, r.x), y, width: Math.min(r.width, 1600), height: Math.min(e.height + 32, innerHeight - y) };
  }, { d: DEEP, height, selector });
}

async function shoot(name, prepare, { verify, height = 1000, clip } = {}) {
  if (!want(name) || !ids.Garden) return;
  log("STEP", name);
  try {
    await openPanel();
    await p.evaluate(prepare, { d: DEEP, ids });
    await p.waitForTimeout(2000);
    const ok = verify ? await p.evaluate(verify, { d: DEEP, ids }) : true;
    if (!ok) throw new Error("what the picture is about did not render");
    await p.screenshot({ path: OUT + name, clip: await clipOf(height, clip) });
    log("SHOT", name);
  } catch (e) {
    failures.push(name);
    log("FAIL", name, String(e && e.message || e).slice(0, 200));
  }
}

try {
  // 1. All objects as cards, by due date: Garden first for the pool pump
  // inside it, its sub-objects as chips, Utility Room counting its objects.
  await shoot("objects-sub-objects.png", ({ d }) => {
    eval(d);
    const panel = window.__panel;
    panel._view = "all_objects";
    panel._objectViewMode = "cards";
    panel._groupByMode = "none";
    panel._objectSortMode = "due_soonest";
    panel._showArchived = false;
  }, {
    height: 530,
    verify: ({ d }) => {
      eval(d);
      const sr = window.__panel.shadowRoot;
      const chips = [...sr.querySelectorAll(".object-child-chip")].map((c) => c.textContent);
      return chips.length >= 5 && chips.some((c) => /Lawn Mower/.test(c)) && chips.some((c) => /Washing Machine/.test(c));
    },
  });

  // 2. The table: Garden unfolded down to the Charging Station, Utility Room folded.
  await shoot("objects-table-tree.png", ({ d, ids }) => {
    eval(d);
    const panel = window.__panel;
    panel._view = "all_objects";
    panel._objectViewMode = "table";
    panel._objectSortMode = "alphabetical";
    panel._objTreeOpen = new Set([ids.Garden, ids["Lawn Mower"]]);
  }, {
    height: 900,
    verify: ({ d }) => {
      eval(d);
      const sr = window.__panel.shadowRoot;
      const toggles = [...sr.querySelectorAll(".object-tree-toggle")];
      return toggles.length >= 3 && toggles.some((x) => x.getAttribute("aria-expanded") === "false") &&
        /Charging Station/.test(sr.textContent);
    },
  });

  // 3. The mower's page: the breadcrumb through Garden, its sub-object first.
  await shoot("object-sub-objects.png", ({ d, ids }) => {
    eval(d);
    window.__panel._showObject(ids["Lawn Mower"]);
  }, {
    height: 712,
    verify: ({ d }) => {
      eval(d);
      const sr = window.__panel.shadowRoot;
      const head = sr.querySelector(".header");
      return !!sr.querySelector(".sub-objects-head") && !!head && /Garden/.test(head.textContent) &&
        /Charging Station/.test(sr.querySelector(".sub-objects")?.textContent || "");
    },
  });

  // 4. Use on the Family Car's washer fluid: a whole 5 l jug prefilled.
  await shoot("part-use.png", async ({ d, ids }) => {
    eval(d);
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    window.__panel._showObject(ids["Family Car"]);
    for (let i = 0; i < 20 && !window.__fluidUse(); i++) await sleep(300);
    const use = window.__fluidUse();
    use.getRootNode().host.scrollIntoView({ block: "center" });
    use.shadowRoot.querySelector(".use-pill").click();
  }, {
    clip: "fluid-use",
    verify: ({ d }) => {
      eval(d);
      const use = window.__fluidUse();
      const input = use && use.shadowRoot.querySelector("input");
      return !!input && input.value === "5" && use.hasAttribute("open");
    },
  });

  // 5. The part form: Counts as spending, set to When bought.
  await shoot("part-cost-mode.png", async ({ d, ids }) => {
    eval(d);
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    window.__panel._showObject(ids["Family Car"]);
    for (let i = 0; i < 20 && !window.__fluidUse(); i++) await sleep(300);
    const section = window.__fluidUse().getRootNode().host;
    const part = section.parts.find((x) => x.name === "Washer fluid");
    section._openEdit(part);
    await sleep(400);
    section._editing = { ...section._editing, cost_mode: "purchase" };
    await sleep(400);
    section.shadowRoot.querySelector(".part-form").scrollIntoView({ block: "start" });
  }, {
    clip: ".part-form",
    verify: ({ d }) => {
      eval(d);
      const section = window.__deep((x) => x.tagName === "MAINTENANCE-PARTS-SECTION")[0];
      const sel = section && section.shadowRoot.querySelector(".cost-mode-select");
      return !!sel && sel.value === "purchase";
    },
  });
} finally {
  await ctx.close().catch(() => {});
  await unseedSubObjects(api).catch((e) => log("FAIL unseed", String(e && e.message || e).slice(0, 200)));
}

api.close();
await b.close();
if (failures.length) {
  console.error("FAILED:", failures.join(", "));
  process.exit(1);
}
process.exit(0);
