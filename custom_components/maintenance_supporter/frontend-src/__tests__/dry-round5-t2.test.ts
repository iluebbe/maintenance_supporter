/**
 * DRY audit 2026-10-12, round 5, tranche 2 — frontend drift. Every test fails
 * on the code before the fix.
 *
 * - FE5-A1: the complete dialog a card row or the calendar card opens offered
 *   no Undo (nobody listened to its task-completed event).
 * - FE5-A2: an object's area read as its name, its raw id, "Unassigned" or
 *   nothing, depending on the surface.
 * - FE5-A4: a saved view had no place, and the card ignored one.
 * - FE5-A5: each history list kept its own type colours; "missed" had none.
 * - FE5-A6: a vacation whose window had passed read "Ended" in the settings
 *   and "Scheduled" on the card.
 * - FE5-A7: the work sheet printed the raw priority key.
 * - FE5-A8: the object history and the area view printed a credit as "-50".
 * - BI5-A5: Save sent a one-time task without its date (now refused).
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import "../components/task-dialog.js";
import "../components/vacation-section-card.js";
import "../maintenance-card.js";
import type { MaintenanceCompleteDialog } from "../components/complete-dialog";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import type { MaintenanceVacationSectionCard } from "../components/vacation-section-card";
import type { MaintenanceSupporterCard } from "../maintenance-card";
import { openCompleteDialog } from "../dialog-mount";
import { areaLabel } from "../helpers/area-history";
import { vacationPhase } from "../helpers/vacation-phase";
import { buildTaskWorksheetHtml, type WorksheetLabels } from "../helpers/worksheet";
import { STATUS_COLORS, formatCost, formatEntryCost, historyTypeColor } from "../styles";
import { createMockHass } from "./_test-utils.js";

const COMPLETE_TAG = "maintenance-complete-dialog";

describe("FE5-A1: the mounted complete dialog offers Undo", () => {
  afterEach(() => {
    document.querySelector("home-assistant")?.remove();
  });

  function haRoot(): HTMLElement {
    const root = document.createElement("home-assistant");
    root.attachShadow({ mode: "open" });
    (root as HTMLElement & { hass?: object }).hass = {
      language: "en",
      connection: { sendMessagePromise: () => Promise.reject(new Error("offline")) },
    };
    document.body.appendChild(root);
    return root;
  }

  it("a completion with an undo record raises the toast with an Undo action, once", () => {
    const ha = haRoot();
    const toasts: Array<{ message: string; action?: { text: string } }> = [];
    ha.addEventListener("hass-notification", (e) => toasts.push((e as CustomEvent).detail));

    openCompleteDialog({ entry_id: "e1", task_id: "t1", task_name: "Descale" });
    // Opened again (another row): the listener is not wired a second time.
    openCompleteDialog({ entry_id: "e1", task_id: "t1", task_name: "Descale" });
    const dlg = ha.shadowRoot!.querySelector(COMPLETE_TAG) as MaintenanceCompleteDialog;
    const fire = (undo: boolean) =>
      dlg.dispatchEvent(new CustomEvent("task-completed", { detail: { entryId: "e1", taskId: "t1", taskName: "Descale", undo } }));

    fire(true);
    expect(toasts).to.have.length(1);
    expect(toasts[0].message).to.contain("Descale");
    expect(toasts[0].action?.text).to.equal("Undo");

    // Nothing to take back (a double tap the backend swallowed): no toast.
    fire(false);
    expect(toasts).to.have.length(1);
  });
});

describe("FE5-A2: an object's area reads the same everywhere", () => {
  it("its name; the no-area label for none and for an area HA forgot", () => {
    const areas = { kitchen: { area_id: "kitchen", name: "Kitchen" } } as never;
    expect(areaLabel("kitchen", areas, "No area")).to.equal("Kitchen");
    expect(areaLabel("deleted_area", areas, "No area")).to.equal("No area");
    expect(areaLabel(null, areas, "No area")).to.equal("No area");
    expect(areaLabel("kitchen", undefined as never, "—")).to.equal("—");
  });
});

describe("FE5-A4: the card applies a view's place", () => {
  const O = (entry_id: string, name: string, place: string | null) => ({
    entry_id,
    object: { id: entry_id, name, ...(place ? { place } : {}) },
    tasks: [{ id: `${entry_id}_t`, name: `${name} task`, status: "overdue", days_until_due: -1, type: "service" }],
  });
  const VIEWS = [
    { id: "vcabin", name: "Cabin", filters: { status: "", user_id: null, label: null, place: "zone.cabin", archived: false, sort_mode: "due_date", group_by: "none" } },
    { id: "vhome", name: "Home", filters: { status: "", user_id: null, label: null, place: "home", archived: false, sort_mode: "due_date", group_by: "none" } },
  ];

  async function mount(viewId: string): Promise<string[]> {
    const hass = {
      language: "en",
      user: { id: "u1", name: "Tester", is_admin: true, is_owner: true },
      connection: {
        sendMessagePromise: async (msg: { type: string }) => {
          if (msg.type === "maintenance_supporter/objects") return { objects: [O("e1", "Boat", "zone.cabin"), O("e2", "Boiler", null)] };
          if (msg.type === "maintenance_supporter/views/list") return { views: VIEWS };
          return { overdue: 0, due_soon: 0, triggered: 0, ok: 0, total: 0 };
        },
        subscribeMessage: async () => () => {},
      },
    };
    const el = await fixture<MaintenanceSupporterCard>(html`<maintenance-supporter-card .hass=${hass as never}></maintenance-supporter-card>`);
    el.setConfig({ type: "custom:maintenance-supporter-card", show_actions: false, view_id: viewId } as never);
    const names = () => [...el.shadowRoot!.querySelectorAll(".task-name")].map((n) => n.textContent?.trim() || "");
    await waitUntil(() => names().length === 1, `view ${viewId} narrows to one object`, { timeout: 2000 });
    return names();
  }

  it("a zone view keeps the objects there; a home view the ones without a place", async () => {
    expect(await mount("vcabin")).to.deep.equal(["Boat task"]);
    expect(await mount("vhome")).to.deep.equal(["Boiler task"]);
  });
});

describe("FE5-A5: one colour per history type", () => {
  it("missed is overdue red, a replaced trigger triggered orange, an unknown type grey", () => {
    expect(historyTypeColor("completed")).to.equal(STATUS_COLORS.ok);
    expect(historyTypeColor("missed")).to.equal(STATUS_COLORS.overdue);
    expect(historyTypeColor("trigger_replaced")).to.equal(STATUS_COLORS.triggered);
    expect(historyTypeColor("something_new")).to.equal("var(--secondary-text-color)");
  });
});

describe("FE5-A6: a passed vacation reads Ended on the card too", () => {
  it("vacationPhase compares Home Assistant's day", () => {
    expect(vacationPhase({ enabled: true, is_active: true, window_end: "2026-01-01" }, "2026-10-16")).to.equal("active");
    expect(vacationPhase({ enabled: true, is_active: false, window_end: "2026-10-15" }, "2026-10-16")).to.equal("ended");
    // The last day still belongs to the window.
    expect(vacationPhase({ enabled: true, is_active: false, window_end: "2026-10-16" }, "2026-10-16")).to.equal("scheduled");
    expect(vacationPhase({ enabled: false, window_end: "2026-10-15" }, "2026-10-16")).to.equal("inactive");
  });

  it("the card's pill", async () => {
    const state = { enabled: true, is_active: false, start: "2020-01-01", end: "2020-01-10", buffer_days: 3, window_end: "2020-01-10", exempt_task_ids: [] };
    const { hass } = createMockHass({ handlers: { "maintenance_supporter/vacation/state": () => state } });
    (hass as Record<string, unknown>).user = { id: "u1", is_admin: true };
    const el = await fixture<MaintenanceVacationSectionCard>(html`<maintenance-vacation-section-card .hass=${hass}></maintenance-vacation-section-card>`);
    await waitUntil(() => el.shadowRoot!.querySelector(".status-pill"), "pill rendered", { timeout: 2000 });
    expect(el.shadowRoot!.querySelector(".status-pill")!.textContent?.trim()).to.equal("Ended");
  });
});

describe("FE5-A7: the work sheet names the priority", () => {
  it("High, not high", () => {
    const L = new Proxy({} as WorksheetLabels, {
      get: (_t, k) => {
        if (k === "typeLabel" || k === "statusLabel") return (v: string) => v;
        if (k === "priorityLabel") return (p: string) => (p === "high" ? "High" : p);
        return typeof k === "string" ? k : "";
      },
    });
    const sheet = buildTaskWorksheetHtml(
      { name: "Filter change", type: "service", priority: "high", notes: "", checklist: [] } as never,
      "Pool Pump", L, (iso: string) => iso, () => "every 30 days", null, null, null, "2026-10-16T12:00:00Z",
    );
    expect(sheet).to.contain(">High<");
    expect(sheet).to.not.contain(">high<");
  });
});

describe("FE5-A8: a credit is named a credit wherever an entry is listed", () => {
  it("formatEntryCost", () => {
    expect(formatEntryCost(-50, "€", "en")).to.equal(`Credit: ${formatCost(50, "€", "en")}`);
    expect(formatEntryCost(20, "€", "en")).to.equal(formatCost(20, "€", "en"));
  });
});

describe("BI5-A5: Save waits for a one-time task's date", () => {
  it("disabled without the date; no create is sent", async () => {
    const { hass, sent } = createMockHass();
    const el = await fixture<MaintenanceTaskDialog>(html`<maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>`);
    await el.openCreate("e1", []);
    const priv = el as unknown as Record<string, unknown> & { _save(): Promise<void> };
    priv._name = "Renew passport";
    priv._scheduleType = "one_time";
    priv._dueDate = "";
    await el.updateComplete;
    const save = () => [...el.shadowRoot!.querySelectorAll(".dialog-actions ha-button")].at(-1) as HTMLElement & { disabled: boolean };
    expect(save().disabled).to.equal(true);
    await priv._save();
    expect(sent.filter((m) => m.type === "maintenance_supporter/task/create")).to.have.length(0);

    priv._dueDate = "2026-12-01";
    await el.updateComplete;
    expect(save().disabled).to.equal(false);
  });
});
