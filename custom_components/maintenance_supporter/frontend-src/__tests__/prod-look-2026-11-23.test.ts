/**
 * Prod look 2026-11-23: what moved after the first draw, and what read wrong.
 *
 *   - a list was drawn with the default labelled buttons and changed to the
 *     household's icons when the settings arrived: the panel and the card
 *     start with the style this browser last read;
 *   - the two budget tiles joined the strip a few frames after the counts:
 *     the skeleton cache keeps what stood around the rows;
 *   - the due date jumped when a "completes itself" row scrolled into a
 *     long list, and the chips track followed the longest name on screen:
 *     the hidden sizer row carries the widest of both;
 *   - "484,512 / 0 s", "lubrication", "0 pcs", "+7d" beside "7T", emoji as
 *     status icons, the same count line twice on the strategy dashboard.
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import "../maintenance-card.js";
import "../maintenance-calendar-card.js";
import { fetchSettingsOnce, invalidateSettingsCache, rememberRowActionStyle, rememberedRowActionStyle } from "../helpers/settings-cache";
import { readObjectsCache, writeObjectsCache } from "../helpers/objects-cache";
import { LS_KEYS } from "../helpers/storage-keys";
import { glanceUnits } from "../renderers/progress";
import { formatQty, setLocale, taskTypeLabel, unitLabel } from "../styles";
import { MaintenanceDashboardStrategy, kpiMarkdownCard } from "../maintenance-dashboard-strategy";
import { createMockHass } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

type Panel = HTMLElement & {
  updateComplete: Promise<unknown>;
  requestUpdate(): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any;
};

const forget = () => {
  localStorage.removeItem(LS_KEYS.rowActionStyle);
  localStorage.removeItem(LS_KEYS.objectsCache);
  invalidateSettingsCache();
};

describe("prod look 2026-11-23: the first draw wears the household's row style", () => {
  beforeEach(forget);
  afterEach(forget);

  it("a browser that never read a style starts with icons and keeps what the server said", () => {
    expect(rememberedRowActionStyle()).to.equal("icons");
    rememberRowActionStyle("buttons");
    expect(rememberedRowActionStyle()).to.equal("buttons");
    rememberRowActionStyle("no such style");
    expect(rememberedRowActionStyle(), "an unknown style is not kept").to.equal("buttons");
    localStorage.setItem(LS_KEYS.rowActionStyle, "garbage");
    expect(rememberedRowActionStyle(), "a stored value that is no style").to.equal("icons");
  });

  it("a settings read remembers the style; a failed read does not", async () => {
    const ok = createMockHass({
      handlers: { "maintenance_supporter/settings": () => ({ features: {}, general: { row_action_style: "buttons", row_action_style_set: true } }) },
    });
    expect((await fetchSettingsOnce(ok.hass as never)).rowActionStyle).to.equal("buttons");
    expect(localStorage.getItem(LS_KEYS.rowActionStyle)).to.equal("buttons");

    forget();
    const down = createMockHass({ handlers: { "maintenance_supporter/settings": () => { throw new Error("not loaded yet"); } } });
    await fetchSettingsOnce(down.hass as never);
    expect(localStorage.getItem(LS_KEYS.rowActionStyle), "the fallback of a failed read").to.equal(null);
  });

  it("the panel draws its rows in the remembered style before the settings answer", async () => {
    resetTaskSeq();
    for (const [style, selector] of [["buttons", ".row-actions.as-buttons ha-button"], ["icons", ".row-actions button.row-icon-btn"]] as const) {
      forget();
      localStorage.setItem(LS_KEYS.rowActionStyle, style);
      // The settings never answer: what the rows wear is the first draw.
      const { el } = await mountPanel([obj("e1", [task({ status: "overdue", days_until_due: -3 })])], {
        "maintenance_supporter/settings": () => new Promise(() => undefined),
      });
      const p = el as Panel;
      expect(p._rowActionStyle).to.equal(style);
      // The load batch waits for the settings; the rows come from the cache
      // or, as here, are drawn once the objects are assigned by hand.
      p._objects = [obj("e1", [task({ status: "overdue", days_until_due: -3 })])];
      p._overviewTab = "dashboard";
      await p.updateComplete;
      await waitUntil(() => !!sr(p).querySelector(".task-row:not(.virt-sizer)"), "a row is drawn");
      expect(sr(p).querySelector(`.task-row:not(.virt-sizer) ${selector}`), `${style}: ${selector}`).to.not.equal(null);
      p.remove();
    }
  });

  it("the card starts with it too", () => {
    localStorage.setItem(LS_KEYS.rowActionStyle, "buttons");
    const card = document.createElement("maintenance-supporter-card") as HTMLElement & { _globalRowStyle: string };
    expect(card._globalRowStyle).to.equal("buttons");
    forget();
    const fresh = document.createElement("maintenance-supporter-card") as HTMLElement & { _globalRowStyle: string };
    expect(fresh._globalRowStyle).to.equal("icons");
  });
});

describe("prod look 2026-11-23: the skeleton cache keeps what stood around the rows", () => {
  beforeEach(forget);
  afterEach(forget);

  it("the extras travel with the entry; an entry without them reads as before", () => {
    writeObjectsCache([{ entry_id: "e1" }], null, true);
    expect(readObjectsCache()!.extras).to.equal(undefined);
    writeObjectsCache([{ entry_id: "e1" }], null, true, { refsInLists: true, budget: { monthly_spent: 12 } });
    expect(readObjectsCache<unknown, unknown, { refsInLists: boolean }>()!.extras).to.deep.equal({ refsInLists: true, budget: { monthly_spent: 12 } });
  });

  it("the panel's first draw has the budget tiles of the last visit", async () => {
    resetTaskSeq();
    const objects = [obj("e1", [task()])];
    writeObjectsCache(objects, { total_objects: 1, total_tasks: 1, overdue: 0, due_soon: 0, triggered: 0, ok: 1 }, true, {
      features: { budget: true },
      budget: { monthly_spent: 12, monthly_budget: 0, yearly_spent: 345, yearly_budget: 0, alert_threshold_pct: 80 },
      refsInLists: true,
    });
    // Nothing answers: what is on screen is what the cache gave.
    const never = () => new Promise(() => undefined);
    const { el } = await mountPanel(objects, {
      "maintenance_supporter/objects": never, "maintenance_supporter/statistics": never, "maintenance_supporter/budget_status": never,
      "maintenance_supporter/groups": never, "maintenance_supporter/settings": never, "maintenance_supporter/views/list": never,
    });
    const p = el as Panel;
    expect(p._features.budget).to.equal(true);
    expect(p._refsInLists).to.equal(true);
    expect(sr(p).querySelectorAll(".stat-item.budget-tile").length, "both budget tiles in the first draw").to.equal(2);
    expect(sr(p).querySelector(".stat-item.budget-tile")!.textContent).to.contain("12");
  });

  it("a load writes them, so the next visit starts with them", async () => {
    resetTaskSeq();
    const { el } = await mountPanel([obj("e1", [task()])], {
      "maintenance_supporter/settings": () => ({ features: { budget: true }, general: { ref_numbers_in_lists: true } }),
      "maintenance_supporter/budget_status": () => ({ monthly_spent: 7, monthly_budget: 0, yearly_spent: 70, yearly_budget: 0, alert_threshold_pct: 80 }),
    });
    await (el as Panel).updateComplete;
    const extras = readObjectsCache<unknown, unknown, { features: { budget: boolean }; budget: { monthly_spent: number }; refsInLists: boolean }>()!.extras!;
    expect(extras.features.budget).to.equal(true);
    expect(extras.budget.monthly_spent).to.equal(7);
    expect(extras.refsInLists).to.equal(true);
  });
});

describe("prod look 2026-11-23: a long list keeps its columns while it scrolls", () => {
  beforeEach(forget);
  afterEach(forget);

  it("the sizer row carries the longest names and both kinds of row action", async () => {
    resetTaskSeq();
    localStorage.setItem(LS_KEYS.rowActionStyle, "icons");
    const tasks = Array.from({ length: 139 }, () => task());
    tasks.push(task({ name: "The one task with by far the longest name of this whole list" }));
    // Its sensor completes it: the row says so instead of buttons.
    tasks.push(task({
      name: "Completes itself", status: "triggered", trigger_active: true,
      trigger_config: { type: "threshold", entity_id: "sensor.x", entity_ids: ["sensor.x"], trigger_above: 5, auto_complete_on_recovery: true },
    }));
    const { el } = await mountPanel([obj("e1", tasks, "Workshop compressor")]);
    const p = el as Panel;
    p._overviewTab = "dashboard";
    p._rowActionStyle = "icons";
    await p.updateComplete;
    await waitUntil(() => !!sr(p).querySelector(".task-row.virt-sizer"), "the list is virtual");
    const sizer = sr(p).querySelector(".task-row.virt-sizer")!;
    expect(sizer.getAttribute("aria-hidden")).to.equal("true");
    if (!p.narrow && !p.tight) {
      expect(sizer.querySelector(".cell.object-name")!.textContent).to.equal("Workshop compressor");
      expect(sizer.querySelector(".cell.task-name")!.textContent).to.contain("by far the longest name");
      expect(sizer.querySelectorAll(".cell.task-name > span").length).to.equal(3);
    }
    const actions = sizer.querySelector(".row-actions.virt-actions")!;
    expect(actions.querySelector("button.row-icon-btn.btn-complete"), "the buttons a plain row has").to.not.equal(null);
    expect(actions.querySelector("button.row-icon-btn.btn-skip")).to.not.equal(null);
    expect(actions.querySelector(".self-completing"), "the words of a row that completes itself").to.not.equal(null);
    // The same number of cells as a data row, or the tracks would not match.
    const row = sr(p).querySelector(".task-row:not(.virt-sizer)")!;
    const cells = (r: Element) => [...r.children].reduce((n, c) => n + (c.classList.contains("row-head") ? c.children.length : 1), 0);
    expect(cells(sizer)).to.equal(cells(row));
  });

  it("grouped by object, the rows' object column closes", async () => {
    resetTaskSeq();
    const { el } = await mountPanel([obj("e1", [task(), task()], "Dishwasher"), obj("e2", [task()], "Dryer")]);
    const p = el as Panel;
    p._overviewTab = "dashboard";
    p._groupByMode = "object";
    await p.updateComplete;
    await waitUntil(() => !!sr(p).querySelector(".task-table.grouped"), "the grouped table");
    expect(sr(p).querySelector(".task-table.grouped")!.classList.contains("no-object")).to.equal(true);
    p._groupByMode = "area";
    await p.updateComplete;
    expect(sr(p).querySelector(".task-table.grouped")!.classList.contains("no-object")).to.equal(false);
  });
});

describe("prod look 2026-11-23: figures and words that read at a glance", () => {
  it("a big reading in a small unit reads in the next one up", () => {
    expect(glanceUnits(484512, 0, "s")).to.deep.equal({ a: 484512 / 3600, b: 0, unit: "h" });
    expect(glanceUnits(0, 300000, "m")).to.deep.equal({ a: 0, b: 300, unit: "km" });
    expect(glanceUnits(90, 240, "min")).to.deep.equal({ a: 1.5, b: 4, unit: "h" });
    // Small figures and other units stay as the sensor reports them.
    expect(glanceUnits(40, 600, "s")).to.deep.equal({ a: 40, b: 600, unit: "s" });
    expect(glanceUnits(120, 800, "m")).to.deep.equal({ a: 120, b: 800, unit: "m" });
    expect(glanceUnits(168, 300, "h")).to.deep.equal({ a: 168, b: 300, unit: "h" });
    expect(glanceUnits(78472, 140000, "km")).to.deep.equal({ a: 78472, b: 140000, unit: "km" });
  });

  it("a type of the household's own reads as typed, with a capital", () => {
    expect(taskTypeLabel("cleaning", "en")).to.equal("Cleaning");
    expect(taskTypeLabel("lubrication", "en")).to.equal("Lubrication");
    expect(taskTypeLabel("oil_change", "en")).to.equal("Oil change");
    expect(taskTypeLabel("", "en")).to.equal("");
    expect(taskTypeLabel(null, "en")).to.equal("");
  });

  it("the battery list's \"pcs\" reads in the profile's language", () => {
    expect(formatQty(0, "pcs", "en")).to.equal("0 pcs");
    setLocale("de", { unit_pieces: "Stk." });
    expect(formatQty(0, "pcs", "de")).to.equal("0 Stk.");
    expect(unitLabel("bags", "de"), "any other unit is the household's own word").to.equal("bags");
    expect(unitLabel(null, "de")).to.equal(null);
  });
});

describe("prod look 2026-11-23: the calendar", () => {
  type Cal = HTMLElement & { updateComplete: Promise<unknown>; hass: unknown; setConfig(c: unknown): void };

  async function mountCalendar(language: string): Promise<Cal> {
    const { hass } = createMockHass({
      language,
      handlers: {
        "maintenance_supporter/objects": () => ({ objects: [
          { entry_id: "e1", object: { id: "o1", name: "Dishwasher" }, tasks: [
            { id: "t1", name: "Clean the sieves", status: "overdue", days_until_due: -4, next_due: "2020-01-01", type: "cleaning", schedule_type: "time_based", interval_days: 30, enabled: true },
          ] },
          { entry_id: "e2", object: { id: "o2", name: "Dryer" }, tasks: [] },
        ] }),
        "maintenance_supporter/statistics": () => ({}),
      },
    });
    const el = await fixture<Cal>(html`<maintenance-supporter-calendar-card></maintenance-supporter-calendar-card>`);
    el.setConfig({ type: "custom:maintenance-supporter-calendar-card" });
    el.hass = hass;
    await waitUntil(() => !!el.shadowRoot!.querySelector(".cal-window-chip"), "the chips");
    await el.updateComplete;
    return el;
  }

  it("the window chips use the charts' range labels", async () => {
    setLocale("de", { chart_range_7d: "7T", chart_range_30d: "30T", chart_range_90d: "90T", chart_range_1y: "1J" });
    const el = await mountCalendar("de");
    const chips = [...el.shadowRoot!.querySelectorAll(".cal-window-chip")].map((c) => c.textContent!.trim());
    expect(chips).to.deep.equal(["−30T", "−90T", "+7T", "+14T", "+30T", "+1J"]);
    const separator = el.shadowRoot!.querySelector(".cal-chip-separator")!;
    expect(separator.textContent, "a hairline, not a dot").to.equal("");
  });

  it("an entry's task, object and overdue days are parts of their own", async () => {
    const el = await mountCalendar("en");
    await waitUntil(() => !!el.shadowRoot!.querySelector(".cal-event-title"), "an entry");
    const title = el.shadowRoot!.querySelector(".cal-event-title")!;
    expect(title.querySelector(".cal-event-object")!.textContent).to.equal("Dishwasher");
    expect(title.querySelector(".cal-event-task")!.textContent).to.equal("Clean the sieves");
    expect(title.querySelector(".cal-event-due")!.textContent).to.contain("overdue");
    // One line on a wide card reads as it always did.
    expect(title.textContent!.startsWith("Dishwasher · Clean the sieves (")).to.equal(true);
  });
});

describe("prod look 2026-11-23: the strategy dashboard", () => {
  it("the counts wear the panel's status icons, not emoji", () => {
    const content = kpiMarkdownCard({}, { overdue: 2, triggered: 1, due_soon: 3, ok: 4 }).content as string;
    expect(content).to.contain('<ha-icon icon="mdi:alert-octagon"></ha-icon>');
    expect(content).to.contain('<ha-icon icon="mdi:check-circle"></ha-icon>');
    expect(content).to.contain("**2** Overdue");
    expect(/\p{Extended_Pictographic}/u.test(content), "no emoji").to.equal(false);
  });

  it("the overview shows the counts once: a section on a phone, the sidebar on a wide screen", async () => {
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/objects": () => ({ objects: [{ entry_id: "e1", object: { id: "o1", name: "Dishwasher", area_id: null }, tasks: [{ id: "t1", name: "Clean", status: "ok", days_until_due: 5, type: "cleaning" }] }] }),
        "maintenance_supporter/statistics": () => ({ overdue: 0, due_soon: 0, triggered: 0, ok: 1 }),
      },
    });
    (hass as Record<string, unknown>).areas = {};
    (hass as Record<string, unknown>).user = { id: "u1", is_admin: true };
    const dash = (await MaintenanceDashboardStrategy.generate({ type: "custom:maintenance-supporter" }, hass as never)) as {
      views: Array<{ path?: string; header?: unknown; sidebar?: { visibility?: unknown[] }; sections?: Array<{ cards: Array<{ type: string }>; visibility?: Array<{ condition: string; max?: number }> }> }>;
    };
    const overview = dash.views.find((v) => v.path === "overview")!;
    expect(overview.header, "no second copy in the header").to.equal(undefined);
    expect(overview.sidebar!.visibility).to.deep.equal([{ condition: "view_columns", min: 2 }]);
    const [counts, list] = overview.sections!;
    expect(counts.cards[0].type).to.equal("markdown");
    expect(counts.visibility).to.deep.equal([{ condition: "view_columns", max: 1 }]);
    expect(list.cards[0].type).to.equal("custom:maintenance-supporter-card");
  });
});
