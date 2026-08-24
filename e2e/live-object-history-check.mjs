/** Live check + docs shots for the object lifecycle history (#138).
 *
 *  On the seeded demo: opens an object detail page, asserts the cross-task
 *  history section renders merged rows with working task filter, opens the
 *  printable service record (popup) and asserts its content. Writes
 *  docs/images/object-history.png (section) and service-record.png (sheet).
 */
import { chromium } from "@playwright/test";
import { haLogin, watchdog, wsClient } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8131";
const HA = "http://ha-shots:8123";
const PW_WS = "ws://127.0.0.1:3000/";
const OUT = new URL("../docs/images/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const log = (...a) => console.log(...a);
const fail = (m) => { console.error("FAIL:", m); throw new Error(m); };
const assert = (cond, msg) => { if (!cond) fail(msg); log("  ok:", msg); };
watchdog(6 * 60e3, "object history check");

const token = await haLogin(REST, { user: "demo", pass: "demo-pass-1", cid: HA + "/" });
const api = await wsClient(REST, token);
// Pick the object with the most lifecycle entries in its (windowed) history.
const objs = (await api.send({ type: "maintenance_supporter/objects" })).objects;
const score = (o) => o.tasks.reduce((s, t) => s + (t.history || []).filter((h) => ["completed", "skipped", "reset", "missed"].includes(h.type)).length, 0);
const target = [...objs].sort((a, b) => score(b) - score(a))[0];
if (!target || score(target) < 3) fail("seed has no object with enough history");
log("target object:", target.object.name, "entries≥", score(target), "tasks:", target.tasks.length);
api.close();

const browser = await chromium.connect(PW_WS);
try {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 950 } });
  const page = await ctx.newPage();
  await page.addInitScript(({ t, ha }) => {
    localStorage.setItem("hassTokens", JSON.stringify({
      access_token: t, token_type: "Bearer", expires_in: 1800,
      hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
    }));
  }, { t: token, ha: HA });
  await page.goto(`${HA}/maintenance-supporter?entry_id=${encodeURIComponent(target.entry_id)}`, { waitUntil: "domcontentloaded", timeout: 30000 });

  const sectionInfo = async () => page.evaluate(() => {
    const sr = (el) => el && el.shadowRoot;
    const panel = (() => {
      const st = [document.documentElement]; let n = 0;
      while (st.length && n++ < 5000) {
        const el = st.pop();
        if (el.tagName === "MAINTENANCE-SUPPORTER-PANEL") return el;
        const r = sr(el); if (r) st.push(...r.querySelectorAll("*"));
        else if (el.children) st.push(...el.children);
      }
      return null;
    })();
    const sec = panel && sr(panel)?.querySelector("maintenance-object-history-section");
    if (!sec || !sr(sec)) return null;
    const root = sr(sec);
    return {
      rows: root.querySelectorAll(".row").length,
      taskLinks: [...root.querySelectorAll(".task-link")].slice(0, 3).map((b) => b.textContent.trim()),
      totals: root.querySelector(".totals")?.textContent?.trim() ?? "",
      hasFilters: !!root.querySelector(".filters select"),
      options: root.querySelectorAll(".filters select option").length,
    };
  });

  let info = null;
  for (let i = 0; i < 30 && (!info || !info.rows); i++) {
    await page.waitForTimeout(1000);
    info = await sectionInfo();
  }
  assert(info && info.rows > 0, `history section renders rows (${info && info.rows})`);
  assert(info.hasFilters && info.options > 1, "task filter present with options");
  assert(/\d/.test(info.totals), `totals footer (${info.totals})`);
  log("  first rows:", info.taskLinks.join(" | "));

  // Task filter narrows the list.
  const filtered = await page.evaluate(() => {
    const sr = (el) => el && el.shadowRoot;
    const st = [document.documentElement]; let sec = null; let n = 0;
    while (st.length && n++ < 5000) {
      const el = st.pop();
      if (el.tagName === "MAINTENANCE-OBJECT-HISTORY-SECTION") { sec = el; break; }
      const r = sr(el); if (r) st.push(...r.querySelectorAll("*"));
      else if (el.children) st.push(...el.children);
    }
    const root = sr(sec);
    const before = root.querySelectorAll(".row").length;
    const select = root.querySelector(".filters select");
    const firstTask = select.querySelectorAll("option")[1].value;
    select.value = firstTask;
    select.dispatchEvent(new Event("change"));
    return new Promise((resolve) => setTimeout(() => {
      resolve({ before, after: root.querySelectorAll(".row").length });
    }, 400));
  });
  assert(filtered.after <= filtered.before, `task filter narrows (${filtered.before} → ${filtered.after})`);
  // reset filter for the docs shot
  await page.evaluate(() => {
    const sr = (el) => el && el.shadowRoot;
    const st = [document.documentElement]; let sec = null; let n = 0;
    while (st.length && n++ < 5000) {
      const el = st.pop();
      if (el.tagName === "MAINTENANCE-OBJECT-HISTORY-SECTION") { sec = el; break; }
      const r = sr(el); if (r) st.push(...r.querySelectorAll("*"));
      else if (el.children) st.push(...el.children);
    }
    const root = sr(sec);
    const select = root.querySelector(".filters select");
    select.value = "";
    select.dispatchEvent(new Event("change"));
    sec.scrollIntoView({ block: "center" });
  });
  await page.waitForTimeout(600);

  const secBox = await page.evaluate(() => {
    const sr = (el) => el && el.shadowRoot;
    const st = [document.documentElement]; let sec = null; let n = 0;
    while (st.length && n++ < 5000) {
      const el = st.pop();
      if (el.tagName === "MAINTENANCE-OBJECT-HISTORY-SECTION") { sec = el; break; }
      const r = sr(el); if (r) st.push(...r.querySelectorAll("*"));
      else if (el.children) st.push(...el.children);
    }
    const b = sec.getBoundingClientRect();
    return { x: b.x, y: b.y, w: b.width, h: Math.min(b.height, 700) };
  });
  await page.screenshot({
    path: OUT + "object-history.png",
    clip: { x: Math.max(0, secBox.x - 8), y: Math.max(0, secBox.y - 8), width: secBox.w + 16, height: secBox.h + 16 },
  });
  log("  wrote docs/images/object-history.png");

  // Printable service record opens as a popup with content + total.
  const [popup] = await Promise.all([
    page.waitForEvent("popup", { timeout: 15000 }),
    page.evaluate(() => {
      const sr = (el) => el && el.shadowRoot;
      const st = [document.documentElement]; let sec = null; let n = 0;
      while (st.length && n++ < 5000) {
        const el = st.pop();
        if (el.tagName === "MAINTENANCE-OBJECT-HISTORY-SECTION") { sec = el; break; }
        const r = sr(el); if (r) st.push(...r.querySelectorAll("*"));
        else if (el.children) st.push(...el.children);
      }
      sr(sec).querySelector(".print-btn").click();
    }),
  ]);
  await popup.waitForLoadState("domcontentloaded");
  const sheet = await popup.evaluate(() => ({
    title: document.title,
    hasTable: !!document.querySelector("table tbody tr"),
    scheme: document.querySelector('meta[name="color-scheme"]')?.content ?? "",
    text: document.body.innerText.slice(0, 200),
  }));
  assert(sheet.hasTable, "service record has completion rows");
  assert(sheet.scheme === "light", "sheet declares light color-scheme");
  log("  sheet title:", sheet.title);
  await popup.setViewportSize({ width: 900, height: 1100 });
  await popup.screenshot({ path: OUT + "service-record.png", fullPage: false });
  log("  wrote docs/images/service-record.png");

  log("PASS: object lifecycle history live check");
} finally {
  await browser.close().catch(() => {});
}
