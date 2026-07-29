/** Explainer/onboarding GIFs — reproducible, like the docs screenshots.
 *
 * Records three key flows against the seeded ha-shots demo instance
 * (port 8131, dark mode, faketime-pinned dates; see shots-demo.mjs for the
 * seed) and converts them to looping GIFs under docs/images/gifs/:
 *
 *   create-from-template.gif   From template → gallery → object created
 *   complete-task.gif          overdue task → Complete → done
 *   calendar-object-filter.gif Calendar tab → filter to one object
 *
 * Prereqs: ha-shots + playwright-server running, demo seed present
 * (node e2e/shots-demo.mjs seeds a wiped instance). Re-run per release to
 * refresh the GIFs — never hand-record them.
 *
 * ffmpeg: uses Playwright's bundled build (ms-playwright/ffmpeg-*) or a
 * PATH ffmpeg; override with the FFMPEG env var.
 */

import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "@playwright/test";
import { watchdog } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8131";
const HA = "http://ha-shots:8123";
const PW_WS = "ws://127.0.0.1:3000/";
// The client_id must be the origin the BROWSER will use, not the host-side
// REST one: the frontend stores `clientId` alongside the token and bounces to
// /auth/authorize when the two disagree, which looks exactly like "the panel
// never mounted".
const CID = HA + "/";
const VIDEO_DIR = join(process.cwd(), "..", "docs", "images", "gifs", ".video-tmp");
const GIF_DIR = join(process.cwd(), "..", "docs", "images", "gifs");
const log = (...a) => console.log(...a);
watchdog(12 * 60e3, "gifs-demo");

// ── ffmpeg discovery ────────────────────────────────────────────────────────
// Playwright's bundled ffmpeg is a minimal build WITHOUT the gif muxer —
// use the full ffmpeg-static build (e2e devDependency) or FFMPEG env/PATH.
async function findFfmpeg() {
  if (process.env.FFMPEG) return process.env.FFMPEG;
  try {
    const mod = await import("ffmpeg-static");
    if (mod.default && existsSync(mod.default)) return mod.default;
  } catch {
    // fall through to PATH
  }
  return "ffmpeg";
}

async function toGif(videoPath, name, trimSeconds) {
  const out = join(GIF_DIR, `${name}.gif`);
  // Cut everything before the measured action start (login/loading), then
  // 9 fps, 960px wide, 128-color palette.
  const filters = "fps=9,scale=960:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3";
  execFileSync(await findFfmpeg(), ["-y", "-ss", trimSeconds.toFixed(1), "-i", videoPath, "-vf", filters, "-loop", "0", out], { stdio: "pipe" });
  log(`  gif -> ${out} (trim ${trimSeconds.toFixed(1)}s)`);
}

// ── demo login (same flow as shots-demo.mjs) ────────────────────────────────
const j = (r) => r.json();
async function login() {
  const f = await fetch(REST + "/auth/login_flow", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CID, handler: ["homeassistant", null], redirect_uri: CID }),
  }).then(j);
  const s = await fetch(REST + "/auth/login_flow/" + f.flow_id, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CID, username: "demo", password: "demo-pass-1" }),
  }).then(j);
  const t = await fetch(REST + "/auth/token", {
    method: "POST",
    body: new URLSearchParams({ grant_type: "authorization_code", code: s.result, client_id: CID }),
  }).then(j);
  if (!t.access_token) throw new Error("token exchange failed");
  return t.access_token;
}

const panelOf = () => document
  .querySelector("home-assistant")?.shadowRoot
  ?.querySelector("home-assistant-main")?.shadowRoot
  ?.querySelector("ha-drawer partial-panel-resolver ha-panel-custom maintenance-supporter-panel");

const tokensInit = ({ t, ha }) => {
  // Init scripts run on EVERY navigation — never overwrite the REAL tokens
  // the UI-login fallback stored, or the next goto bounces to /auth again.
  if (localStorage.getItem("hassTokens")) return;
  const tok = { access_token: t, token_type: "Bearer", expires_in: 1800, hassUrl: ha,
    clientId: ha + "/", expires: Date.now() + 1800e3, refresh_token: "x" };
  localStorage.setItem("hassTokens", JSON.stringify(tok));
};

async function openPanel(p) {
  await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded", timeout: 30000 });
  await p.waitForTimeout(3000);
  // Token injection can bounce to /auth/authorize on this instance (known
  // since the v2.37 docs run) — log in through the real UI then.
  if (p.url().includes("/auth/authorize")) {
    log("  UI login (token bounce)");
    await p.locator('input[name="username"]').first().fill("demo");
    await p.locator('input[name="password"]').first().fill("demo-pass-1");
    await p.locator("mwc-button, ha-button, button", { hasText: /log in/i }).first().click();
    await p.waitForTimeout(4000);
    if (!p.url().includes("maintenance-supporter")) {
      await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded", timeout: 30000 });
    }
  }
  // Poll until the panel's shadow root exists (cold instance can be slow).
  for (let i = 0; i < 25; i++) {
    const ready = await p.evaluate((fnStr) => !!eval(`(${fnStr})`)()?.shadowRoot, panelOf.toString());
    if (ready) break;
    await p.waitForTimeout(1000);
  }
  await p.waitForTimeout(2500); // settle data + first render
}

/** Click the first leaf element whose text matches, inside the panel shadow root. */
async function clickInPanel(p, regexSrc, scope = "") {
  const r = await p.evaluate(({ fnStr, regexSrc, scope }) => {
    const panel = eval(`(${fnStr})`)();
    if (!panel?.shadowRoot) return "no panel";
    const root = scope ? panel.shadowRoot.querySelector(scope) : panel.shadowRoot;
    if (!root) return "no scope " + scope;
    const re = new RegExp(regexSrc, "i");
    const nodes = [...root.querySelectorAll("ha-button, button, .tab, [class*='task'], .popup-menu-item, mwc-button")]
      .filter((el) => re.test(el.textContent || ""));
    if (!nodes.length) return "no match " + regexSrc;
    nodes[0].click();
    return "clicked";
  }, { fnStr: panelOf.toString(), regexSrc, scope });
  log(`  click /${regexSrc}/ -> ${r}`);
  return r === "clicked";
}

/** One flow = one fresh playwright-server connection + context (the dockered
 *  server wedges on long-lived connections / second pages — known since the
 *  docs-shots work). The login happens inside the recording and is trimmed
 *  away precisely: flows call mark() once the UI is ready, and ffmpeg cuts
 *  at that measured offset. */
async function record(token, name, flow) {
  try { execSync("docker restart playwright-server", { stdio: "pipe" }); } catch { /* not fatal */ }
  await new Promise((r) => setTimeout(r, 6000));
  const browser = await chromium.connect(PW_WS, { timeout: 20000 });
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    recordVideo: { dir: VIDEO_DIR, size: { width: 1280, height: 800 } },
  });
  const p = await ctx.newPage();
  await p.addInitScript(tokensInit, { t: token, ha: HA });
  const t0 = Date.now();
  let actionAt = 0;
  const mark = () => { actionAt = Date.now(); };
  log(`▶ ${name}`);
  try {
    await flow(p, mark);
    await p.waitForTimeout(1800); // hold the end frame
  } finally {
    const video = p.video();
    await ctx.close(); // flushes the webm
    if (video) {
      // saveAs streams through the live connection — close the browser AFTER.
      const local = join(VIDEO_DIR, `${name}.webm`);
      await video.saveAs(local);
      const trim = actionAt ? Math.max(0, (actionAt - t0) / 1000 - 0.7) : 2;
      await toGif(local, name, trim);
    }
    await browser.close().catch(() => {});
  }
}

// ── flows ─────────────────────────────────────────────────────────────────────────

/** Poll for a selector inside the panel shadow root. */
async function pollPanel(p, selector, tries = 12) {
  for (let i = 0; i < tries; i++) {
    const found = await p.evaluate(({ fnStr, selector }) => {
      const panel = eval(`(${fnStr})`)();
      return !!panel?.shadowRoot?.querySelector(selector);
    }, { fnStr: panelOf.toString(), selector });
    if (found) return true;
    await p.waitForTimeout(700);
  }
  return false;
}

const flowTemplate = async (p, mark) => {
  await openPanel(p);
  mark();
  await clickInPanel(p, "from template");
  await pollPanel(p, ".template-grid .template-card");
  await p.waitForTimeout(1200); // let the gallery render fully
  const picked = await p.evaluate((fnStr) => {
    const panel = eval(`(${fnStr})`)();
    const cards = [...panel.shadowRoot.querySelectorAll(".template-grid .template-card")];
    const target = cards.find((c) => /bicycle/i.test(c.textContent || "")) || cards[0];
    if (!target) return "no cards";
    target.scrollIntoView({ block: "center" });
    target.click();
    return "picked " + (target.textContent || "").trim().slice(0, 30);
  }, panelOf.toString());
  log("  " + picked);
  await p.waitForTimeout(4000); // object created → panel jumps to it
};

const flowComplete = async (p, mark) => {
  await openPanel(p);
  mark();
  const r = await p.evaluate((fnStr) => {
    const panel = eval(`(${fnStr})`)();
    const rows = [...panel.shadowRoot.querySelectorAll(".task-row")];
    const row = rows.find((el) => /overdue/i.test(el.textContent || ""));
    if (!row) return "no overdue row";
    row.scrollIntoView({ block: "center" });
    const name = row.querySelector(".task-name") || row;
    name.click();
    return "opened " + (name.textContent || "").trim().slice(0, 30);
  }, panelOf.toString());
  log("  " + r);
  await p.waitForTimeout(2500);
  await clickInPanel(p, "^complete");
  await p.waitForTimeout(2200);
  const submitted = await p.evaluate((fnStr) => {
    const panel = eval(`(${fnStr})`)();
    const dlg = panel.shadowRoot.querySelector("maintenance-complete-dialog");
    const root = dlg?.shadowRoot || panel.shadowRoot;
    const btn = [...root.querySelectorAll("ha-button, button, mwc-button")]
      .find((b) => /^(complete|save|confirm)/i.test((b.textContent || "").trim()));
    if (!btn) return "no submit";
    btn.click();
    return "submitted";
  }, panelOf.toString());
  log("  " + submitted);
  await p.waitForTimeout(3200);
};

const flowCalendarFilter = async (p, mark) => {
  // The object filter lives on the standalone CALENDAR CARD (v2.40) — show
  // it on the demo dashboard rather than the panel tab. Panel first: its UI
  // login (token bounce) authenticates the session for the dashboard too.
  await openPanel(p);
  await p.goto(HA + "/demo-cards", { waitUntil: "domcontentloaded", timeout: 30000 });
  await p.waitForTimeout(6000);
  mark();
  const deepFindCard = () => {
    const stack = [document.documentElement];
    let n = 0;
    while (stack.length && n < 80000) {
      const el = stack.pop(); n++;
      if (!el) continue;
      if (el.tagName === "MAINTENANCE-SUPPORTER-CALENDAR-CARD") return el;
      if (el.shadowRoot) stack.push(...el.shadowRoot.children);
      stack.push(...el.children);
    }
    return null;
  };
  // The custom-card module loads lazily — poll until the element upgraded.
  let found = "no calendar card";
  for (let i = 0; i < 20; i++) {
    found = await p.evaluate((fnStr) => {
      const card = eval(`(${fnStr})`)();
      if (!card) return "no calendar card";
      card.scrollIntoView({ block: "center" });
      return "card found";
    }, deepFindCard.toString());
    if (found === "card found") break;
    await p.waitForTimeout(1000);
  }
  log("  " + found);
  await p.waitForTimeout(1800);
  const sel = await p.evaluate((fnStr) => {
    const card = eval(`(${fnStr})`)();
    const selects = [...(card?.shadowRoot?.querySelectorAll("select.cal-user-filter") || [])];
    const objSel = selects.find((s) => [...s.options].some((o) => /family car/i.test(o.textContent || "")));
    if (!objSel) return "no object dropdown (" + selects.length + " selects)";
    const opt = [...objSel.options].find((o) => /family car/i.test(o.textContent || ""));
    objSel.value = opt.value;
    objSel.dispatchEvent(new Event("change", { bubbles: true }));
    return "filtered to " + opt.textContent;
  }, deepFindCard.toString());
  log("  " + sel);
  await p.waitForTimeout(3000);
};

// ── demo-cards dashboard: ensure BOTH cards (task card + calendar card) ─────
async function ensureDemoCards(token) {
  const ws = new WebSocket(REST.replace("http", "ws") + "/api/websocket");
  await new Promise((res) => { ws.onopen = res; });
  let id = 1; const pend = new Map();
  await new Promise((res) => {
    ws.onmessage = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.type === "auth_required") ws.send(JSON.stringify({ type: "auth", access_token: token }));
      else if (m.type === "auth_ok") res();
      else if (m.type === "result") { const cb = pend.get(m.id); cb && cb(m); }
    };
  });
  const send = (msg) => new Promise((res) => { const i = id++; pend.set(i, res); ws.send(JSON.stringify({ ...msg, id: i })); });
  await send({ type: "lovelace/config/save", url_path: "demo-cards",
    config: { views: [{ title: "Cards", path: "cards", cards: [
      { type: "custom:maintenance-supporter-card", show_header: true, show_actions: true,
        filter_status: ["overdue", "triggered", "due_soon"], max_items: 8 },
      { type: "custom:maintenance-supporter-calendar-card", window_days: 30 },
    ] } ] } });
  ws.close();
}

// ── main ────────────────────────────────────────────────────────────────────
mkdirSync(GIF_DIR, { recursive: true });
mkdirSync(VIDEO_DIR, { recursive: true });
const token = await login();
await ensureDemoCards(token);
const FLOWS = {
  "create-from-template": flowTemplate,
  "complete-task": flowComplete,
  "calendar-object-filter": flowCalendarFilter,
};
const only = process.argv[2];
for (const [name, flow] of Object.entries(FLOWS)) {
  if (only && name !== only) continue;
  await record(token, name, flow);
}
log("GIFS DONE");
