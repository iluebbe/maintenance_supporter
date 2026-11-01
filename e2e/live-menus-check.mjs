/** Every menu of the panel and of the dashboard card, live: each item is
 * tapped like a user does and what it opens or does is checked.
 *
 * Menus: the task's ⋮ menu, the object's ⋮ menu with its "Add sub-object"
 * menu, the "+ Add" menu, the select mode's ⋮ menu and the card's task
 * quick actions. Per item:
 *   - the menu lies inside the window and the item takes a tap;
 *   - tapping it does something: a dialog, a question, a top-layer window,
 *     a toast, a new browser window or a page change (nothing = FAIL);
 *   - what opened lies on top: its last button takes a tap (a window that
 *     opens UNDER another one — a toast under a dialog, a dialog under the
 *     quick actions — fails here);
 *   - it closes again.
 * The paths that change data are followed through and undone: Reset
 * confirmed, Pause with the toast's Undo, Archive with Undo, Duplicate,
 * Delete cancelled and Delete confirmed on a copy.
 *
 * Usage (restart playwright-server first, wedge prevention):
 *   HA_REST=http://127.0.0.1:8133 HA_BROWSER=http://ha-212:8123 HA_USER=demo HA_PASS=… \
 *     node e2e/live-menus-check.mjs
 *   BROWSERS=chromium VIEWPORTS=desktop-1440 SHOTS_DIR=… KEEP=1
 *   MODE=classic  the classic look (the switch off). Unset or MODE=beta is the
 *                 new look: HA's ha-dropdown menus, ha-adaptive-dialog, HA's
 *                 toast with Undo, the sub-object choices in the menu
 */
import { createRequire } from "module";
import { hassTokensInit, loadToken, onboardOrLogin, watchdog, wsClient } from "./ws-client.mjs";
import { contextOptions, pickDevices, tapLands } from "./layout-sweep-kit.mjs";

const require = createRequire(new URL("../custom_components/maintenance_supporter/frontend-src/package.json", import.meta.url));
const pw = require("playwright");

const REST = process.env.HA_REST || "http://127.0.0.1:8125";
const HA = process.env.HA_BROWSER || "http://ha-maint:8123";
const D = "maintenance_supporter";
const SHOTS = process.env.SHOTS_DIR || "";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log(...a);
watchdog(Number(process.env.WATCHDOG_MS || 7_200_000), "menus check");

const VIEWPORTS = pickDevices(process.env.VIEWPORTS || "desktop-1440,ipad-air-landscape,phone-390");
const BROWSERS = (process.env.BROWSERS || "chromium,webkit").split(",");
const BETA = process.env.MODE !== "classic";
const ADVANCED = ["adaptive", "checklists", "completion_actions", "schedule_time", "seasonal"].map((k) => `advanced_${k}_visible`);

const token = process.env.HA_USER
  ? await onboardOrLogin(REST, { user: process.env.HA_USER, pass: process.env.HA_PASS, cid: REST + "/" })
  : loadToken();
const api = await wsClient(REST, token);
const before = (await api.send({ type: `${D}/settings` })).features || {};
await api.send({ type: `${D}/global/update`, settings: { ...Object.fromEntries(ADVANCED.map((k) => [k, true])), advanced_beta_editor_visible: BETA } });

// ── data ───────────────────────────────────────────────────────────────────
const NAME = "Menu check washer";
const NAME2 = "Menu check dryer";
for (const o of ((await api.send({ type: `${D}/objects` })).objects || []).filter((o) => [NAME, NAME2].includes(o.object?.name) || /^Menu check washer \(/.test(o.object?.name || ""))) {
  await api.send({ type: `${D}/object/delete`, entry_id: o.entry_id });
}
const OBJ = (await api.send({ type: `${D}/object/create`, name: NAME })).entry_id;
const OBJ2 = (await api.send({ type: `${D}/object/create`, name: NAME2 })).entry_id;
await sleep(2000);
const TASK_NAME = "Clean the menu check filter";
const longAgo = new Date(Date.now() - 40 * 864e5).toISOString().slice(0, 10);
const TASK = (await api.send({
  type: `${D}/task/create`, entry_id: OBJ, task_type: "cleaning", name: TASK_NAME, schedule_type: "time_based",
  interval_days: 30, last_performed: longAgo, quick_complete_defaults: {},
})).task_id;
await api.send({ type: `${D}/task/set_adaptive`, entry_id: OBJ, task_id: TASK, enabled: true }).catch(() => {});
await api.send({ type: `${D}/task/create`, entry_id: OBJ2, task_type: "inspection", name: "Dryer lint", schedule_type: "time_based", interval_days: 30 });

// A dashboard with the card, for its quick actions.
const DASH = "ms-menu-check";
const dashboards = await api.send({ type: "lovelace/dashboards/list" });
if (!dashboards.some((d) => d.url_path === DASH)) {
  await api.send({ type: "lovelace/dashboards/create", url_path: DASH, title: "Menu check", mode: "storage", require_admin: false, show_in_sidebar: false });
}
await api.send({ type: "lovelace/config/save", url_path: DASH, config: { views: [{ title: "Menu check", cards: [{ type: "custom:maintenance-supporter-card" }] }] } });

const tasksOf = async (entryId) => ((await api.send({ type: `${D}/object`, entry_id: entryId })).tasks || []);
const taskNow = async () => (await tasksOf(OBJ)).find((t) => t.id === TASK);
// "Today" as HA counts it: a run across midnight sees the machine's date
// change before (or after) the date in HA's time zone.
const TZ = (await fetch(`${REST}/api/config`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json())).time_zone;
const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());
log(`setup: object ${OBJ}, task ${TASK}, dashboard /${DASH}`);

const results = [];
const failures = [];
const notes = [];
const record = (combo, what, problem, note = "") => {
  results.push({ combo, what, ok: !problem });
  if (problem) failures.push(`${combo} ${what}: ${problem}`);
  if (note) notes.push(`${combo} ${what}: ${note}`);
  log(`${problem ? "FAIL" : "ok  "} ${combo.padEnd(30)} ${what}${problem ? "  — " + problem : ""}${note ? `  (${note})` : ""}`);
};

/** A tap where a user taps (see live-beta-editor-pickers: WebKit's hit test
 *  cannot see into HA's top-layer dialogs, so the deep one decides). */
async function tap(loc) {
  try {
    await loc.click({ timeout: 3000 });
    return true;
  } catch {
    if (!(await tapLands(loc))) return false;
    await loc.click({ force: true });
    return true;
  }
}

/** What lies open on the page: top-layer dialogs and popovers by the
 *  element that owns them, and the panel's toast. */
const layers = (page) => page.evaluate(() => {
  const out = [];
  const owner = (n) => {
    for (let x = n; x; x = x.parentElement || x.getRootNode()?.host || null) {
      if (x.classList?.contains("palette-backdrop")) return `panel:${x.querySelector(".template-preview") ? "template-preview" : x.querySelector(".template-gallery") ? "template-gallery" : "search"}`;
      if (/^(maintenance-|dialog-|ha-dialog-|ha-more-info)/.test(x.localName) && x.localName !== "maintenance-supporter-panel") return x.localName;
    }
    return "?";
  };
  const walk = (root) => {
    for (const el of root.querySelectorAll("*")) {
      if (el.shadowRoot) walk(el.shadowRoot);
      const open = (el.localName === "dialog" && el.open) || el.matches?.(":popover-open");
      if (!open) continue;
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) out.push(owner(el));
    }
  };
  walk(document);
  const panel = document.querySelector("home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot
    ?.querySelector("ha-drawer partial-panel-resolver ha-panel-custom maintenance-supporter-panel");
  // HA's toast (beta UI): ha-toast under <home-assistant>. Its host has no
  // box and no text; the message is its labelText, shown while the inner
  // .toast is visible.
  let haToast = null;
  const findToast = (root) => {
    for (const el of root.querySelectorAll("*")) {
      if (el.localName === "ha-toast" && el.labelText && el.shadowRoot?.querySelector(".toast.visible")) haToast = el.labelText;
      if (el.shadowRoot) findToast(el.shadowRoot);
    }
  };
  findToast(document);
  const ours = panel?.shadowRoot?.querySelector(".toast");
  const toast = ours ? ours.textContent : haToast;
  return { open: [...new Set(out)], toast: toast ? toast.trim().replace(/\s+/g, " ").slice(0, 60) : null, view: panel ? `${panel._view}:${panel._selectedTaskId || panel._selectedEntryId || ""}` : null };
});

/** The last enabled control of what opened (Save, OK, Close …): does a
 *  tap land on it, i.e. is it on top? Controls inside another control's
 *  shadow root (the native button inside an ha-button) and disabled ones
 *  (nothing ticked yet) do not count. */
const topButtonLands = (page, ownerTag) => page.evaluate((tag) => {
  const deepFind = (pred) => {
    const out = [];
    const walk = (root) => {
      for (const el of root.querySelectorAll("*")) {
        if (pred(el)) out.push(el);
        if (el.shadowRoot) walk(el.shadowRoot);
      }
    };
    walk(document);
    return out;
  };
  let owner;
  if (tag.startsWith("panel:")) owner = deepFind((el) => el.classList?.contains("palette-backdrop"))[0];
  else owner = deepFind((el) => el.localName === tag).pop();
  if (!owner) return null;
  const CONTROL = /^(ha-button|ha-icon-button|button|mwc-button)$/;
  const controls = [];
  const collect = (root) => {
    for (const el of root.children) {
      if (CONTROL.test(el.localName) || el.classList?.contains("template-card") || el.classList?.contains("palette-input")) {
        controls.push(el);
        continue;
      }
      if (el.shadowRoot) collect(el.shadowRoot);
      collect(el);
    }
  };
  collect(owner.shadowRoot || owner);
  const usable = controls.filter((el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && !el.disabled && el.getAttribute("aria-disabled") !== "true";
  });
  const b = usable.pop();
  if (!b) return null;
  b.scrollIntoView({ block: "nearest" });
  const r = b.getBoundingClientRect();
  const x = r.left + r.width / 2, y = r.top + r.height / 2;
  if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) return false;
  let t = document.elementFromPoint(x, y);
  while (t?.shadowRoot) {
    const i = t.shadowRoot.elementFromPoint(x, y);
    if (!i || i === t) break;
    t = i;
  }
  for (let n = t; n; n = n.assignedSlot || n.parentElement || n.getRootNode()?.host || null) if (n === b) return true;
  return false;
}, ownerTag);

/** Inputs shown in a container: an item that opens a form inline (the
 *  quick actions' Skip / Reset / Postpone) changes them. */
const formState = async (page, sel) => !(await page.locator(sel).count()) ? "" : page.locator(sel).first().evaluate((c) => {
  const seen = [];
  const walk = (root) => {
    for (const el of root.querySelectorAll("input, select, textarea, ms-date-field, ms-textfield")) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) seen.push(el.localName);
    }
  };
  walk(c);
  return seen.join(",");
}, null, { timeout: 2000 }).catch(() => "");

/** Close what opened: Escape for dialogs (HA's and ours), the panel's own
 *  switches for its gallery. */
async function closeAll(page) {
  for (let i = 0; i < 4; i++) {
    const l = await layers(page);
    const open = l.open.filter((o) => o !== "?");
    if (!open.length) return true;
    if (open.some((o) => o.startsWith("panel:template"))) {
      await page.locator("maintenance-supporter-panel").evaluate((p) => { p._templateGalleryOpen = false; p._templatePreview = null; });
    } else if (i >= 2) {
      // A field with focus may keep Escape (a date field leaving its
      // typing mode): a hand-built dialog closes on its backdrop too.
      await page.evaluate(() => {
        const walk = (root) => {
          for (const el of root.querySelectorAll("*")) {
            if (el.classList?.contains("backdrop") && el.closest?.(".modal-layer")) el.click();
            if (el.shadowRoot) walk(el.shadowRoot);
          }
        };
        walk(document);
      });
    } else {
      await page.keyboard.press("Escape");
    }
    await sleep(600);
  }
  return !(await layers(page)).open.filter((o) => o !== "?").length;
}

async function runCombo(browserName, vp) {
  const combo = `${browserName}/${vp.name}`;
  const browser = await pw[browserName].connect("ws://127.0.0.1:3000/");
  const ctx = await browser.newContext(contextOptions(browserName, vp, "en"));
  const shot = async (page, name) => { if (SHOTS) await page.screenshot({ path: `${SHOTS}/${combo.replaceAll("/", "-")}-${name.replace(/[^a-z0-9]+/gi, "-")}.png` }).catch(() => {}); };
  try {
    await ctx.addInitScript(hassTokensInit, { t: token, ha: HA });
    const page = await ctx.newPage();
    const panel = page.locator("maintenance-supporter-panel");
    const go = async (url, ready) => {
      // A goto to the address already open is a reload in Chrome and keeps
      // the history state, and the panel goes back to the page that state
      // names (F5 keeps the page since 2026-11-01): start without it.
      await page.evaluate(() => history.replaceState(null, "")).catch(() => {});
      await page.goto(`${HA}${url}`);
      await ready().waitFor({ timeout: 60_000 });
      await sleep(1800);
    };
    const goTask = () => go(`/maintenance-supporter?entry_id=${OBJ}&task_id=${TASK}`, () => panel.locator(".task-header-actions .more-menu-wrapper ha-icon-button"));
    const goObject = () => go(`/maintenance-supporter?entry_id=${OBJ}`, () => panel.locator(".more-menu-wrapper ha-icon-button").first());
    const goOverview = () => go("/maintenance-supporter", () => panel.locator(".new-menu-button").first());

    /** One menu item: open the menu fresh, check, tap, see what happens. */
    const item = async (menuName, open, menuSel, itemRe, opts = {}) => {
      const what = `${menuName} › ${itemRe.source.replace(/\\/g, "").replace(/[\^$]/g, "")}`;
      try {
        await open();
        const menu = page.locator(menuSel).first();
        await menu.waitFor({ timeout: 8000 });
        const box = await menu.boundingBox();
        const inWindow = BETA || (box && box.x >= -1 && box.x + box.width <= vp.width + 1);
        const it = menu.locator("ha-dropdown-item, [role=menuitem], ha-button, button").filter({ hasText: itemRe }).first();
        if (!(await it.count())) return record(combo, what, opts.optional ? null : "item not in the menu", opts.optional ? "not offered here" : "");
        if (!(await tapLands(it))) return record(combo, what, "the item takes no tap");
        const popup = page.waitForEvent("popup", { timeout: 6000 }).catch(() => null);
        const was = await layers(page);
        const formWas = await formState(page, menuSel);
        await tap(it);
        await sleep(opts.wait ?? 1600);
        const now = await layers(page);
        const opened = now.open.filter((o) => o !== "?" && !was.open.includes(o));
        const toast = now.toast && now.toast !== was.toast ? now.toast : null;
        const nav = now.view !== was.view ? now.view : null;
        const formNow = await formState(page, menuSel);
        const inline = formNow !== formWas ? formNow : null;
        const win = opened.length || toast || nav || inline ? null : await popup;
        let problem = null;
        let note = [opened.length ? `opened ${opened.join(", ")}` : "", toast ? `toast "${toast}"` : "", nav ? `went to ${nav}` : "", inline ? `form inline (${inline})` : "", win ? "new window" : ""].filter(Boolean).join("; ");
        if (!note) problem = "nothing happened";
        for (const o of opened) {
          const lands = await topButtonLands(page, o);
          if (lands === false) problem = `${o} opened but lies under something (its buttons take no tap)`;
        }
        if (toast && opts.toastUndo) {
          const undo = BETA ? page.locator("ha-toast").locator("ha-button, mwc-button, button").filter({ hasText: /Undo/ }).first() : panel.locator(".toast .toast-undo");
          if (!(await undo.count())) problem = problem ?? "no Undo in the toast";
          else if (!(await tapLands(undo))) problem = problem ?? "the toast's Undo takes no tap";
          else {
            await tap(undo);
            await sleep(1500);
            const p = await opts.toastUndo();
            if (p) problem = problem ?? p;
            else note += "; Undo worked";
          }
        }
        if (opts.then) {
          const p = await opts.then(opened);
          if (p) problem = problem ?? p;
        }
        if (problem) await shot(page, what);
        if (win) await win.close().catch(() => {});
        if (!(await closeAll(page))) problem = problem ?? `could not close ${JSON.stringify((await layers(page)).open)}`;
        if (!inWindow && !problem) note += `; menu ${Math.round(box.x)}..${Math.round(box.x + box.width)} past the window edge`;
        record(combo, what, problem, note);
      } catch (e) {
        await shot(page, what);
        record(combo, what, `error: ${e.message.split("\n")[0]}`);
        await closeAll(page).catch(() => {});
      }
    };

    // ── the card's quick actions (first: the task is still overdue) ──
    const QA = BETA ? "maintenance-task-quick-actions-dialog ha-adaptive-dialog .ha-shell-body" : "maintenance-task-quick-actions-dialog .dialog";
    const openQuick = async () => {
      await go(`/${DASH}`, () => page.locator("maintenance-supporter-card .task-item.clickable").filter({ hasText: TASK_NAME }).first());
      await tap(page.locator("maintenance-supporter-card .task-item.clickable").filter({ hasText: TASK_NAME }).first());
      await page.locator(QA).waitFor({ timeout: 10_000 });
      await sleep(600);
    };

    for (const [re, opt] of [
      [/^\s*Complete\s*$/, { optional: true, then: async () => null, skip: true }],
      [/with details/i, {}],
      [/^\s*Edit\s*$/, {}],
      [/QR/, {}],
      [/^\s*Skip\s*$/, {}],
      [/^\s*Reset\s*$/, {}],
      [/Postpone/, {}],
      [/^\s*Delete\s*$/, { then: async () => ((await taskNow()) ? null : "the task is gone although the question was cancelled") }],
    ]) {
      if (opt.skip) continue;
      await item("card quick actions", openQuick, QA, re, opt);
    }

    // ── the task's ⋮ menu ──
    const openTaskMenu = async () => {
      await goTask();
      await tap(panel.locator(".task-header-actions .more-menu-wrapper ha-icon-button"));
      await sleep(400);
    };
    const TM = BETA ? "maintenance-supporter-panel .task-header-actions ha-dropdown" : "maintenance-supporter-panel .task-header-actions .popup-menu";
    await item("task menu", openTaskMenu, TM, /^\s*Edit\s*$/);
    await item("task menu", openTaskMenu, TM, /with details/i);
    await item("task menu", openTaskMenu, TM, /QR/);
    await item("task menu", openTaskMenu, TM, /Work ?sheet/i);
    await item("task menu", openTaskMenu, TM, /Re-?analy/i, { optional: true });
    await item("task menu", openTaskMenu, TM, /Move/);
    await item("task menu", openTaskMenu, TM, /Postpone/);
    await item("task menu", openTaskMenu, TM, /^\s*Snooze\s*$/);
    await item("task menu", openTaskMenu, TM, /^\s*Archive\s*$/, {
      toastUndo: async () => ((await taskNow())?.archived ? "Undo left the task archived" : null),
    });
    if ((await taskNow())?.archived) await api.send({ type: `${D}/task/unarchive`, entry_id: OBJ, task_id: TASK }).catch(() => {});
    await api.send({ type: `${D}/task/unarchive`, entry_id: OBJ, task_id: TASK }).catch(() => {});
    // Pause, confirmed in its question, then undone from the toast.
    await item("task menu", openTaskMenu, TM, /Pause/, {
      then: async (opened) => {
        if (!opened.includes("maintenance-confirm-dialog")) return "no question asked";
        const ok = page.locator("maintenance-supporter-panel maintenance-confirm-dialog ha-button").filter({ hasText: /Pause/ }).last();
        await tap(ok);
        await sleep(1500);
        if (!(await taskNow())?.paused) return "confirmed, but the task is not paused";
        const undo = BETA ? page.locator("ha-toast").locator("ha-button, mwc-button, button").filter({ hasText: /Undo/ }).first() : panel.locator(".toast .toast-undo");
        if (!(await undo.count()) || !(await tapLands(undo))) return "paused, but the toast's Undo is not tappable";
        await tap(undo);
        await sleep(1500);
        return (await taskNow())?.paused ? "Undo left the task paused" : null;
      },
    });
    // Reset, confirmed: last performed is today.
    await item("task menu", openTaskMenu, TM, /^\s*Reset\s*$/, {
      then: async (opened) => {
        if (!opened.includes("maintenance-confirm-dialog")) return "no question asked";
        await tap(page.locator("maintenance-supporter-panel maintenance-confirm-dialog ha-button").filter({ hasText: /Reset/ }).last());
        await sleep(1800);
        const lp = String((await taskNow())?.last_performed || "");
        await api.send({ type: `${D}/task/update`, entry_id: OBJ, task_id: TASK, last_performed: longAgo }).catch(() => {});
        return lp.startsWith(today()) ? null : `confirmed, but last performed is ${lp}`;
      },
    });
    // Duplicate, and the copy deleted again through ITS menu, confirmed.
    const countBefore = (await tasksOf(OBJ)).length;
    await item("task menu", openTaskMenu, TM, /Duplicate/, {
      then: async () => ((await tasksOf(OBJ)).length === countBefore + 1 ? null : "no copy made"),
    });
    const copy = (await tasksOf(OBJ)).find((t) => t.id !== TASK && t.name.startsWith(TASK_NAME));
    if (copy) {
      await item("task menu (copy)", async () => {
        await go(`/maintenance-supporter?entry_id=${OBJ}&task_id=${copy.id}`, () => panel.locator(".task-header-actions .more-menu-wrapper ha-icon-button"));
        await tap(panel.locator(".task-header-actions .more-menu-wrapper ha-icon-button"));
        await sleep(400);
      }, TM, /^\s*Delete\s*$/, {
        then: async (opened) => {
          if (!opened.includes("maintenance-confirm-dialog")) return "no question asked";
          await tap(page.locator("maintenance-supporter-panel maintenance-confirm-dialog ha-button").filter({ hasText: /Delete/ }).last());
          await sleep(1800);
          return (await tasksOf(OBJ)).some((t) => t.id === copy.id) ? "confirmed, but the copy still exists" : null;
        },
      });
    }
    await item("task menu", openTaskMenu, TM, /^\s*Delete\s*$/, {
      then: async () => ((await taskNow()) ? null : "the task is gone although the question was only opened"),
    });

    // ── the object's ⋮ menu and its sub-object menu ──
    const openObjMenu = async () => {
      await goObject();
      await tap(panel.locator(".more-menu-wrapper ha-icon-button").first());
      await sleep(400);
    };
    const OM = BETA ? "maintenance-supporter-panel .more-menu-wrapper ha-dropdown" : "maintenance-supporter-panel .more-menu-wrapper .popup-menu";
    await item("object menu", openObjMenu, OM, /QR/);
    await item("object menu", openObjMenu, OM, /record|report|PDF/i);
    const objsBefore = ((await api.send({ type: `${D}/objects` })).objects || []).length;
    await item("object menu", openObjMenu, OM, /Duplicate/, {
      then: async () => {
        const after = (await api.send({ type: `${D}/objects` })).objects || [];
        const dup = after.find((o) => o.entry_id !== OBJ && /^Menu check washer \(|^Menu check washer 2/.test(o.object?.name || ""));
        if (dup) await api.send({ type: `${D}/object/delete`, entry_id: dup.entry_id }).catch(() => {});
        return after.length === objsBefore + 1 ? null : "no copy made";
      },
    });
    await item("object menu", openObjMenu, OM, /Pause|Resume/);
    await item("object menu", openObjMenu, OM, /Replace/, { optional: true });
    await item("object menu", openObjMenu, OM, /^\s*Archive/, {
      toastUndo: async () => {
        const o = ((await api.send({ type: `${D}/objects` })).objects || []).find((x) => x.entry_id === OBJ);
        return o?.object?.archived || o?.object?.archived_at ? "Undo left the object archived" : null;
      },
    });
    await api.send({ type: `${D}/object/unarchive`, entry_id: OBJ }).catch(() => {});
    await item("object menu", openObjMenu, OM, /^\s*Delete\s*$/, {
      then: async () => (((await api.send({ type: `${D}/objects` })).objects || []).some((o) => o.entry_id === OBJ) ? null : "the object is gone although the question was only opened"),
    });
    const openSubMenu = async () => {
      await openObjMenu();
      await tap(page.locator(OM).locator("[role=menuitem]").filter({ hasText: /sub-object/i }).first());
      await sleep(500);
    };
    if (BETA) {
      await item("object menu", openObjMenu, OM, /sub-object: (New|Create)/i);
      await item("object menu", openObjMenu, OM, /sub-object: .*template/i);
      await item("object menu", openObjMenu, OM, /sub-object: .*(Move|existing)/i, { optional: true });
    } else {
      const SM = "maintenance-supporter-panel .sub-object-menu";
      await item("sub-object menu", openSubMenu, SM, /New|Create/i);
      await item("sub-object menu", openSubMenu, SM, /template/i);
      await item("sub-object menu", openSubMenu, SM, /Move|existing/i, { optional: true });
    }

    // ── the "+ Add" menu ──
    const openAddMenu = async () => {
      await goOverview();
      await tap(panel.locator(".new-menu-button").first());
      await sleep(400);
    };
    const AM = BETA ? "maintenance-supporter-panel .new-menu-wrapper ha-dropdown" : "maintenance-supporter-panel .new-menu-popup";
    await item("add menu", openAddMenu, AM, /New (Maintenance )?Task/i);
    await item("add menu", openAddMenu, AM, /object/i);
    await item("add menu", openAddMenu, AM, /template/i);
    await item("add menu", openAddMenu, AM, /problem/i);
    await item("add menu", openAddMenu, AM, /setup|suggest/i);
    await item("add menu", openAddMenu, AM, /battery|fleet/i, { optional: true });

    // ── the select mode's ⋮ menu ──
    const openBulkMenu = async () => {
      await goOverview();
      await panel.evaluate((p) => { p._view = "overview"; p._setOverviewTab("dashboard"); });
      await sleep(900);
      // On a phone the select toggle sits in the filter bar, folded away
      // behind the Filters button.
      if (await panel.locator(".filter-bar.collapsed").count()) {
        await tap(panel.locator(".mobile-toggle").first());
        await sleep(400);
      }
      // The new look: the selection chip in the list's toolbar (HA's list pages).
      await tap(panel.locator(BETA ? ".ms-toolbar .ms-chip.icon-only" : ".bulk-toggle").first());
      await sleep(600);
      const box = panel.locator(".task-row, tr, .row").filter({ hasText: TASK_NAME }).locator('input[type="checkbox"]').first();
      await tap(box);
      await sleep(400);
      await tap(panel.locator(".bulk-more").first());
      await sleep(400);
    };
    const BM = BETA ? "maintenance-supporter-panel .bulk-more-wrapper ha-dropdown" : "maintenance-supporter-panel .bulk-more-wrapper .popup-menu";
    await item("select menu", openBulkMenu, BM, /Move/);
    await item("select menu", openBulkMenu, BM, /Assign/i);
    await item("select menu", openBulkMenu, BM, /Label/i);
    await item("select menu", openBulkMenu, BM, /Edit/i);
    await item("select menu", openBulkMenu, BM, /Pause/i);
    // Resume acts on the paused ones of the selection only: pause first.
    await api.send({ type: `${D}/task/pause`, entry_id: OBJ, task_id: TASK }).catch(() => {});
    await item("select menu", openBulkMenu, BM, /Resume/i, {
      then: async () => ((await taskNow())?.paused ? "the selected paused task is still paused" : null),
    });
    if ((await taskNow())?.paused) await api.send({ type: `${D}/task/resume`, entry_id: OBJ, task_id: TASK }).catch(() => {});
  } catch (e) {
    record(combo, "run", `error: ${e.message.split("\n")[0]}`);
  } finally {
    await ctx.close().catch(() => {});
    await browser.close().catch(() => {});
  }
}

for (const browserName of BROWSERS) {
  for (const vp of VIEWPORTS) await runCombo(browserName, vp);
}

await api.send({ type: `${D}/global/update`, settings: { ...Object.fromEntries(ADVANCED.map((k) => [k, !!before[k.replace(/^advanced_/, "").replace(/_visible$/, "")]])), advanced_beta_editor_visible: !!before.beta_editor } });
if (!process.env.KEEP) {
  await api.send({ type: `${D}/object/delete`, entry_id: OBJ }).catch(() => {});
  await api.send({ type: `${D}/object/delete`, entry_id: OBJ2 }).catch(() => {});
}
api.close();
log(`\n${results.length - failures.length}/${results.length} checks passed`);
if (failures.length) log("FAILURES:\n  " + failures.join("\n  "));
if (notes.length) log("NOTES:\n  " + notes.filter((n) => /past the window|not offered/.test(n)).join("\n  "));
process.exit(failures.length ? 1 : 0);
