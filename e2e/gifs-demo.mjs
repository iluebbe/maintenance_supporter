/** Explainer/onboarding GIFs — reproducible, like the docs screenshots.
 *
 * Records the key flows against the seeded ha-shots demo instance (port 8131,
 * dark mode, faketime-pinned dates; see shots-demo.mjs for the seed) and
 * converts them to looping GIFs under docs/images/gifs/:
 *
 *   create-from-template.gif   From template → gallery → object created
 *   complete-task.gif          overdue task → Complete → done
 *   calendar-object-filter.gif Calendar tab → filter to one object
 *   sensor-trigger.gif         WHY a task is due: the threshold behind it
 *   schedule-preview.gif       change the cadence, next dates recompute live
 *   object-report.gif          the printable report, hidden in the ⋮ menu
 *   required-details.gif       Complete stays disabled until details are given
 *   parts-auto-buy.gif         stock crosses its threshold → "Buy ..." appears
 *   duty-rotation.gif          a shared chore hands over to the next person
 *   battery-fleet.gif          the fleet roster: typed rows, sparklines, ~dates
 *   qr-quick-complete.gif      scanned QR deep link → silent complete + toast
 *
 * Still open: suggested-setups needs a signature-matching integration on the
 * demo instance (the shots seed is template-sensor-only, so discovery finds
 * nothing) — a dev_battery_fixtures-style fixture would unlock it.
 *
 * A clip earns its place by showing a CAUSAL CHAIN or a hiding place — not by
 * filming a form being filled in, which a screenshot says better.
 *
 * Two of these need seed ingredients from shots-demo.mjs that exist only for
 * them: a part stocked ONE above its reorder threshold (so a single completion
 * crosses it) and a task with required_completion_fields.
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
// Anchored to THIS FILE, not cwd: run from the repo root or from e2e/, the
// GIFs land in <repo>/docs/images/gifs either way (a cwd-relative path once
// wrote them a directory ABOVE the repo).
const REPO_ROOT = join(new URL(".", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"), "..");
const VIDEO_DIR = join(REPO_ROOT, "docs", "images", "gifs", ".video-tmp");
const GIF_DIR = join(REPO_ROOT, "docs", "images", "gifs");
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
  // 8 fps and a 100-colour palette; the width stays 960 because these are
  // documentation clips and the UI text must stay readable — the saving has to
  // come from frame rate and palette, not from scaling the text down.
  const filters = "fps=8,scale=960:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=100[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3";
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
  // Docker's port proxy ACCEPTS before the npx run-server inside is actually
  // listening ("socket hang up" on connect), and the startup time varies —
  // retry the connect instead of trusting a fixed wait.
  let browser = null;
  for (let i = 0; i < 12 && !browser; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    browser = await chromium.connect(PW_WS, { timeout: 15000 }).catch(() => null);
  }
  if (!browser) throw new Error("playwright-server never came back after restart");
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    // Every flow gets a FRESH browser profile, and HA's default theme mode is
    // "auto" — it follows the OS. Without this the recordings came out light
    // while all 30 screenshots are dark, because shots-demo.mjs sets
    // colorScheme on its contexts and this one did not.
    colorScheme: "dark",
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
  // #125: the template gallery lives in the "Add" menu now.
  await clickInPanel(p, "add", ".new-menu-wrapper");
  await p.waitForTimeout(700);
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

// ── helpers shared by the flows below ──────────────────────────────────────

/** Scroll a task row into view by name; optionally press its row action. */
async function onRow(p, nameRe, action = "show") {
  const r = await p.evaluate(({ fnStr, nameRe, action }) => {
    const panel = eval(`(${fnStr})`)();
    const re = new RegExp(nameRe, "i");
    const row = [...panel.shadowRoot.querySelectorAll(".task-row")]
      .find((el) => re.test(el.querySelector(".task-name")?.textContent || ""));
    if (!row) return "no row " + nameRe;
    row.scrollIntoView({ block: "center" });
    if (action === "show") return "showed";
    const btn = row.querySelector(action === "complete" ? ".btn-complete" : ".btn-skip");
    if (!btn) return "no " + action + " button";
    btn.click();
    return action + "d";
  }, { fnStr: panelOf.toString(), nameRe, action });
  log(`  row /${nameRe}/ ${action} -> ${r}`);
  return r;
}

/** Open a task's EDIT dialog through the panel's own dialog API.
 *  Clicking through detail views is far more brittle, and shots-demo.mjs
 *  already drives the panel this way. */
async function openTaskEditor(p, objectRe, taskRe) {
  const r = await p.evaluate(async ({ fnStr, objectRe, taskRe }) => {
    const panel = eval(`(${fnStr})`)();
    const oRe = new RegExp(objectRe, "i"), tRe = new RegExp(taskRe, "i");
    const obj = (panel._objects || []).find((o) => oRe.test(o.object?.name || ""));
    if (!obj) return "no object " + objectRe;
    const task = (obj.tasks || []).find((t) => tRe.test(t.name || ""));
    if (!task) return "no task " + taskRe;
    const dlg = panel.shadowRoot.querySelector("maintenance-task-dialog");
    if (!dlg) return "no task dialog";
    await dlg.openEdit(obj.entry_id, task);
    return "opened " + task.name;
  }, { fnStr: panelOf.toString(), objectRe, taskRe });
  log("  " + r);
  return r.startsWith("opened");
}

/** Scroll something inside the task dialog's shadow root into view. */
async function revealInTaskDialog(p, selector) {
  const r = await p.evaluate(({ fnStr, selector }) => {
    const panel = eval(`(${fnStr})`)();
    const dlg = panel.shadowRoot.querySelector("maintenance-task-dialog");
    const el = dlg?.shadowRoot?.querySelector(selector);
    if (!el) return "not found " + selector;
    el.scrollIntoView({ block: "center" });
    return "revealed " + selector;
  }, { fnStr: panelOf.toString(), selector });
  log("  " + r);
  return r.startsWith("revealed");
}

/** Scroll the trigger CONFIGURATION into view — the entity and the threshold
 *  that make a sensor-based task come due. Anchored on the heading text so it
 *  cannot land on an unrelated select row. */
async function revealTriggerConfig(p) {
  const r = await p.evaluate((fnStr) => {
    const panel = eval(`(${fnStr})`)();
    const root = panel.shadowRoot.querySelector("maintenance-task-dialog")?.shadowRoot;
    if (!root) return "no dialog";
    const head = [...root.querySelectorAll("h3")]
      .find((h) => /trigger/i.test(h.textContent || ""));
    const target = head || root.querySelector(".trigger-live-hint");
    if (!target) return "no trigger section";
    target.scrollIntoView({ block: "start" });
    return "revealed " + (target.textContent || "").trim().slice(0, 40);
  }, panelOf.toString());
  log("  " + r);
  return r.startsWith("revealed");
}

/** Type into the complete dialog's Nth native input (notes=0, cost=1). */
async function fillCompleteField(p, index, value) {
  const r = await p.evaluate(({ fnStr, index, value }) => {
    const panel = eval(`(${fnStr})`)();
    const dlg = panel.shadowRoot.querySelector("maintenance-complete-dialog");
    const inputs = [...(dlg?.shadowRoot?.querySelectorAll("input.field-input") || [])];
    const el = inputs[index];
    if (!el) return "no input " + index;
    el.scrollIntoView({ block: "center" });
    el.focus();
    el.value = value;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    return "filled " + index;
  }, { fnStr: panelOf.toString(), index, value });
  log("  " + r);
  return r.startsWith("filled");
}

/** Is the complete dialog's submit button currently disabled? */
async function completeDisabled(p) {
  return p.evaluate((fnStr) => {
    const panel = eval(`(${fnStr})`)();
    const dlg = panel.shadowRoot.querySelector("maintenance-complete-dialog");
    const btn = [...(dlg?.shadowRoot?.querySelectorAll("ha-button, button, mwc-button") || [])]
      .find((b) => /^(complete|save|confirm)/i.test((b.textContent || "").trim()));
    return btn ? !!(btn.disabled || btn.hasAttribute("disabled")) : null;
  }, panelOf.toString());
}

async function submitComplete(p) {
  const r = await p.evaluate((fnStr) => {
    const panel = eval(`(${fnStr})`)();
    const dlg = panel.shadowRoot.querySelector("maintenance-complete-dialog");
    const btn = [...(dlg?.shadowRoot?.querySelectorAll("ha-button, button, mwc-button") || [])]
      .find((b) => /^(complete|save|confirm)/i.test((b.textContent || "").trim()));
    if (!btn) return "no submit";
    btn.click();
    return "submitted";
  }, panelOf.toString());
  log("  " + r);
  return r === "submitted";
}

// ── the five flows added for the v2.44 docs round ──────────────────────────

/** WHY is this task due? Because a sensor says so. The differentiator that
 *  text explains worst: start on the triggered row, then reveal the threshold
 *  that produced it. */
const flowSensorTrigger = async (p, mark) => {
  await openPanel(p);
  // These flows reach the panel through the UI-login fallback, and a dialog
  // opened too soon after that renders before the theme has settled — it came
  // out light against a dark panel. Give it a moment.
  await p.waitForTimeout(4000);
  mark();
  await onRow(p, "filter replacement");
  await p.waitForTimeout(2200);           // let the reader see "Triggered"
  await openTaskEditor(p, "HVAC", "filter replacement");
  await p.waitForTimeout(2500);
  // The trigger configuration is what explains the Triggered badge. Anchor on
  // its heading, NOT on .select-row — that matched "Maintenance type", the
  // first select in the dialog, and the payoff never came into frame.
  await revealTriggerConfig(p);
  await p.waitForTimeout(3400);
};

/** The best causal chain in the product: completing a task eats a part, the
 *  stock crosses its reorder threshold, and the "Buy ..." reminder appears by
 *  itself. Seeded at stock 2 / threshold 1 so one completion crosses it. */
const flowPartsAutoBuy = async (p, mark) => {
  await openPanel(p);
  mark();
  await onRow(p, "impeller cleaning");
  await p.waitForTimeout(1400);
  await onRow(p, "impeller cleaning", "complete");
  await p.waitForTimeout(2200);
  await submitComplete(p);
  await p.waitForTimeout(4500);           // reconcile + list refresh
  await onRow(p, "buy pump filter");      // the reminder that created itself
  await p.waitForTimeout(3000);
};

/** A task can demand details before it counts as done (2.44). The Complete
 *  button stays disabled until they are there — that is the whole story. */
const flowRequiredDetails = async (p, mark) => {
  await openPanel(p);
  mark();
  await onRow(p, "descaling", "complete");
  await p.waitForTimeout(2400);
  log("  complete disabled before filling: " + (await completeDisabled(p)));
  await fillCompleteField(p, 0, "Ran two descaling cycles, rinsed twice");
  await p.waitForTimeout(1200);
  await fillCompleteField(p, 1, "8.90");
  await p.waitForTimeout(1400);
  log("  complete disabled after filling: " + (await completeDisabled(p)));
  await submitComplete(p);
  await p.waitForTimeout(3000);
};

/** Changing the cadence recomputes the next dates live — the moment people
 *  get wrong when setting a schedule up. */
const flowSchedulePreview = async (p, mark) => {
  await openPanel(p);
  await p.waitForTimeout(4000);           // theme settle — see flowSensorTrigger
  mark();
  await openTaskEditor(p, "Family Car", "oil change");
  await p.waitForTimeout(2500);
  await revealInTaskDialog(p, ".schedule-preview");
  await p.waitForTimeout(1800);
  const changed = await p.evaluate((fnStr) => {
    const panel = eval(`(${fnStr})`)();
    const dlg = panel.shadowRoot.querySelector("maintenance-task-dialog");
    const root = dlg?.shadowRoot;
    // The interval box is an <ms-textfield> — a custom element with its OWN
    // shadow root, so a plain input[type=number] query on the dialog finds
    // nothing. Drive the inner input: its event is composed, so it reaches
    // the @input listener bound on the host.
    const host = [...(root?.querySelectorAll("ms-textfield") || [])]
      .find((el) => /interval/i.test(el.getAttribute("label") || ""));
    if (!host) return "no interval field";
    const el = host.shadowRoot?.querySelector("input");
    if (!el) return "interval field has no inner input";
    host.scrollIntoView({ block: "center" });
    el.focus();
    el.value = "90";
    el.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    el.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    return "interval -> 90";
  }, panelOf.toString());
  log("  " + changed);
  // Bring the recomputed dates back into frame — the interval box and the
  // preview line are far enough apart that typing scrolled the payoff away,
  // and the payoff IS the point of this clip.
  await p.waitForTimeout(900);
  await revealInTaskDialog(p, ".schedule-preview");
  await p.waitForTimeout(3400);           // hold on the recomputed dates
};

/** The printable per-object report — a feature nobody finds, because it sits
 *  in the object's ⋮ menu. window.open is redirected into THIS tab so the
 *  sheet lands in the recording (Playwright videos are per page). */
const flowObjectReport = async (p, mark) => {
  await openPanel(p);
  mark();
  const shown = await p.evaluate((fnStr) => {
    const panel = eval(`(${fnStr})`)();
    const obj = (panel._objects || []).find((o) => /family car/i.test(o.object?.name || ""));
    if (!obj) return "no object";
    panel._showObject(obj.entry_id);
    return "opened " + obj.object.name;
  }, panelOf.toString());
  log("  " + shown);
  await p.waitForTimeout(2600);
  await p.evaluate(() => { window.open = (url) => { window.location.href = url; return null; }; });
  const menu = await p.evaluate((fnStr) => {
    const panel = eval(`(${fnStr})`)();
    const btn = panel.shadowRoot.querySelector(".more-menu-wrapper ha-icon-button");
    if (!btn) return "no ⋮";
    btn.scrollIntoView({ block: "center" });
    btn.click();
    return "menu open";
  }, panelOf.toString());
  log("  " + menu);
  await p.waitForTimeout(1600);
  await clickInPanel(p, "^report$");
  await p.waitForTimeout(4000);           // the sheet renders in this tab
};

/** Shared chores rotate: completing one hands the duty to the next person. */
const flowDutyRotation = async (p, mark) => {
  await openPanel(p);
  mark();
  await onRow(p, "door seal wipe");
  await p.waitForTimeout(2400);           // the current duty badge is readable
  await onRow(p, "door seal wipe", "complete");
  await p.waitForTimeout(2000);
  await submitComplete(p);
  await p.waitForTimeout(4000);
  await onRow(p, "door seal wipe");       // badge now names the next person
  await p.waitForTimeout(3000);
};

/** ONE task for the whole battery fleet: the shopping list groups what to
 *  buy ("2× AA"), and the collapsed roster hides every tracked battery with
 *  its level bar and predicted date. */
const flowBatteryFleet = async (p, mark) => {
  await openPanel(p);
  mark();
  const r = await p.evaluate((fnStr) => {
    const panel = eval(`(${fnStr})`)();
    const rows = [...panel.shadowRoot.querySelectorAll(".task-row")];
    const row = rows.find((el) => /replace low batteries/i.test(el.textContent || ""));
    if (!row) return "no fleet task row";
    row.scrollIntoView({ block: "center" });
    (row.querySelector(".task-name") || row).click();
    return "opened fleet task";
  }, panelOf.toString());
  log("  " + r);
  await p.waitForTimeout(3500);            // overview + trends load
  const expanded = await p.evaluate((fnStr) => {
    const panel = eval(`(${fnStr})`)();
    const section = panel.shadowRoot.querySelector("maintenance-battery-fleet-section");
    const details = section?.shadowRoot?.querySelector("details.bf-roster");
    if (!details) return "no roster";
    details.scrollIntoView({ block: "center" });
    details.open = true;
    details.dispatchEvent(new Event("toggle"));
    return "roster expanded";
  }, panelOf.toString());
  log("  " + expanded);
  await p.waitForTimeout(2500);
  await p.evaluate((fnStr) => {            // let the roster's tail scroll by
    const panel = eval(`(${fnStr})`)();
    const section = panel.shadowRoot.querySelector("maintenance-battery-fleet-section");
    const rows = section?.shadowRoot?.querySelectorAll(".bf-roster [class*=bf-]");
    rows?.[rows.length - 1]?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, panelOf.toString());
  await p.waitForTimeout(2500);
};

/** A scanned QR code completes the task hands-free: the deep link carries
 *  entry+task+action, the stored quick-complete defaults fill cost/duration/
 *  notes, and the only UI is the confirmation toast. MUTATES (completes the
 *  HVAC filter task) — keep it last. */
const flowQrQuickComplete = async (p, mark) => {
  await openPanel(p);
  // Resolve the deep link the printed QR encodes (the HVAC filter task ships
  // quick_complete_defaults in the demo seed).
  const target = await p.evaluate(async (fnStr) => {
    const panel = eval(`(${fnStr})`)();
    for (const ob of panel?._objects || []) {
      for (const tk of ob.tasks || []) {
        if (tk.quick_complete_defaults) return { entry: ob.entry_id, task: tk.id };
      }
    }
    return null;
  }, panelOf.toString()).catch(() => null);
  if (!target) { log("  no quick-complete task"); return; }
  mark();
  await p.goto(
    `${HA}/maintenance-supporter?entry_id=${target.entry}&task_id=${target.task}&action=quick_complete`,
    { waitUntil: "domcontentloaded", timeout: 30000 },
  );
  // The panel routes to the task, fires task/quick_complete silently and
  // confirms with a toast — hold long enough to read it.
  await p.waitForTimeout(6000);
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
  // Order matters: parts-auto-buy and duty-rotation COMPLETE tasks, which
  // changes the state the other flows record against. Each flow gets a fresh
  // browser but the same HA instance, so the mutating ones go last.
  "sensor-trigger": flowSensorTrigger,
  "schedule-preview": flowSchedulePreview,
  "object-report": flowObjectReport,
  "required-details": flowRequiredDetails,
  "battery-fleet": flowBatteryFleet,
  "parts-auto-buy": flowPartsAutoBuy,
  "duty-rotation": flowDutyRotation,
  // Completes the HVAC filter task via the QR deep link — the most mutating
  // flow of all, so it records dead last.
  "qr-quick-complete": flowQrQuickComplete,
};
const only = process.argv[2];
for (const [name, flow] of Object.entries(FLOWS)) {
  if (only && name !== only) continue;
  await record(token, name, flow);
}
log("GIFS DONE");
