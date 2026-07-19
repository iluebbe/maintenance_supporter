/** Remainder shots via REAL UI login (the token-injection path started
 *  bouncing to /auth/authorize; typing the login form sidesteps it). */
import { chromium } from "@playwright/test";
import { watchdog } from "./ws-client.mjs";

const HA = "http://ha-shots:8123";
const OUT = new URL("../docs/images/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const log = (...a) => console.log(...a);
watchdog(8 * 60e3, "shots remainder2");

const b = await chromium.connect("ws://127.0.0.1:3000/", { timeout: 20000 });
const ctx = await b.newContext({ viewport: { width: 1600, height: 1000 }, colorScheme: "dark" });
const p = await ctx.newPage();

// UI login: land on the login form, type credentials, submit.
await p.goto(HA + "/", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(4000);
await p.evaluate(() => {
  const deep = (pred) => { const st = [document.documentElement]; const o = []; let n = 0;
    while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
      if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
      for (const k of (el.children || [])) st.push(k); } return o; };
  const inputs = deep((el) => el.tagName === "INPUT" && ["text", "password"].includes(el.type));
  const user = inputs.find((i) => i.type === "text");
  const pass = inputs.find((i) => i.type === "password");
  const set = (el, v) => { el.focus(); el.value = v; el.dispatchEvent(new Event("input", { bubbles: true, composed: true })); };
  if (user) set(user, "demo");
  if (pass) set(pass, "demo-pass-1");
});
await p.waitForTimeout(500);
await p.keyboard.press("Enter");
await p.waitForTimeout(6000);
const where = await p.evaluate(() => location.pathname);
log("after login:", where);
if (where.includes("auth")) { log("LOGIN FAILED"); process.exit(2); }

const failures = [];
async function step(name, fn) {
  try { await fn(); log("OK", name); }
  catch (e) { failures.push(name); log("FAIL", name, String(e && e.message || e).slice(0, 250)); }
}

await step("calendar.png", async () => {
  await p.goto(HA + "/calendar", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(7000);
  await p.screenshot({ path: OUT + "calendar.png" });
});

await step("todo-list.png", async () => {
  await p.goto(HA + "/todo", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(7000);
  await p.screenshot({ path: OUT + "todo-list.png" });
});

await step("lovelace-card.png", async () => {
  await p.evaluate(async () => {
    const hass = document.querySelector("home-assistant").hass;
    const send = (m) => hass.connection.sendMessagePromise(m);
    const dashboards = await send({ type: "lovelace/dashboards/list" });
    if (!dashboards.some((d) => d.url_path === "demo-cards")) {
      await send({ type: "lovelace/dashboards/create", url_path: "demo-cards", title: "Demo",
        require_admin: false, show_in_sidebar: true, mode: "storage" });
    }
    await send({ type: "lovelace/config/save", url_path: "demo-cards",
      config: { views: [{ title: "Cards", path: "cards", cards: [
        { type: "custom:maintenance-supporter-card", show_header: true, show_actions: true,
          filter_status: ["overdue", "triggered", "due_soon"], max_items: 8 },
      ] }] } });
  });
  await p.goto(HA + "/demo-cards", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(9000);
  const rect = await p.evaluate(() => {
    const deep = (pred) => { const st = [document.documentElement]; const o = []; let n = 0;
      while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
        if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
        for (const k of (el.children || [])) st.push(k); } return o; };
    const card = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-CARD")[0];
    if (!card) return null;
    const r = card.getBoundingClientRect();
    return { x: Math.max(0, r.x - 16), y: Math.max(0, r.y - 16), width: Math.min(r.width + 32, 1600), height: Math.min(r.height + 32, 1000) };
  });
  if (!rect || rect.width < 100) throw new Error("card not rendered");
  await p.screenshot({ path: OUT + "lovelace-card.png", clip: rect });
});

await step("config-flow.png", async () => {
  await p.goto(HA + "/config/integrations/integration/maintenance_supporter", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(8000);
  const found = await p.evaluate(() => {
    const deep = (pred) => { const st = [document.documentElement]; const o = []; let n = 0;
      while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
        if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
        for (const k of (el.children || [])) st.push(k); } return o; };
    const label = (el) => ((el.getAttribute && (el.getAttribute("aria-label") || el.getAttribute("label") || el.title)) || "") + " " + (el.textContent || "");
    const cand = deep((el) => ["HA-BUTTON", "MWC-BUTTON", "HA-ICON-BUTTON"].includes(el.tagName) && /configur|options/i.test(label(el)));
    if (cand[0]) { cand[0].click(); return true; }
    return false;
  });
  if (!found) throw new Error("no configure control found");
  await p.waitForTimeout(3500);
  await p.screenshot({ path: OUT + "config-flow.png" });
});

await ctx.close();
await b.close().catch(() => {});
log(failures.length ? "DONE WITH FAILURES: " + failures.join(", ") : "ALL DONE");
