/**
 * Bug audit 2026-10-17, tranche 3 — the frontend low findings and the
 * frontend halves of C-5 and W-13. Every test fails on the code before the
 * fix.
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import "../components/task-dialog.js";
import "../components/object-history-section.js";
import "../components/object-quick-actions-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import type { MaintenanceObjectHistorySection } from "../components/object-history-section";
import type { MaintenanceObjectQuickActionsDialog } from "../components/object-quick-actions-dialog";
import { clickOnActivationKey } from "../helpers/keyboard";
import { describeWsError } from "../ws-errors";
import { type SentMessage, createMockHass } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

const tick = (ms = 20) => new Promise((r) => setTimeout(r, ms));

function deferred<T>() {
  let resolve!: (v: T) => void;
  const promise = new Promise<T>((r) => { resolve = r; });
  return { promise, resolve };
}

const OBJECTS = [
  { entry_id: "e1", object: { name: "Boiler" } },
  { entry_id: "e2", object: { name: "Car" } },
];

const TASK = {
  id: "t1",
  name: "Filter",
  type: "custom",
  schedule_type: "time_based",
  interval_days: 30,
  warning_days: 7,
  enabled: true,
};

async function dialog(handlers: Record<string, (msg: SentMessage) => unknown>) {
  const { hass, sent } = createMockHass({ handlers });
  const el = await fixture<MaintenanceTaskDialog>(html`<maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>`);
  await el.updateComplete;
  return { el, sent };
}

type Priv = Record<string, unknown> & {
  _loadParts(): Promise<void>;
  _fetchEntityAttributes(id: string): Promise<void>;
  _fetchSchedulePreview(): Promise<void>;
};

describe("P-8 task dialog: parts of the object picked before", () => {
  it("a late answer for the previous object does not land", async () => {
    const slowE1 = deferred<unknown>();
    const { el } = await dialog({
      "maintenance_supporter/object": (msg) =>
        msg.entry_id === "e1" ? slowE1.promise : { parts: [{ id: "p2", name: "Wiper" }] },
    });
    const priv = el as unknown as Priv;
    const opening = el.openCreate("", OBJECTS); // loads e1's parts (slow)
    await tick();
    priv._entryId = "e2";
    await priv._loadParts();
    slowE1.resolve({ parts: [{ id: "p1", name: "Burner nozzle" }] });
    await opening;
    expect((el.parts as Array<{ id: string }>).map((p) => p.id), "e1's parts under e2").to.deep.equal(["p2"]);
  });
});

describe("P-9 task dialog: the preview after switching to manual", () => {
  it("a request still in flight paints no dates", async () => {
    const slow = deferred<unknown>();
    const { el } = await dialog({ "maintenance_supporter/schedule/preview": () => slow.promise });
    await el.openCreate("e1", []);
    const priv = el as unknown as Priv;
    priv._scheduleType = "time_based";
    priv._intervalDays = "30";
    const inFlight = priv._fetchSchedulePreview();
    priv._scheduleType = "manual";
    await priv._fetchSchedulePreview();
    slow.resolve({ occurrences: ["2026-11-19"], series_ended: false });
    await inFlight;
    expect(priv._schedulePreview).to.deep.equal([]);
  });
});

describe("P-10 task dialog: attributes of another entity", () => {
  it("only the newest request fills the dropdown", async () => {
    const slowA = deferred<unknown>();
    const { el } = await dialog({
      "maintenance_supporter/entity/attributes": (msg) =>
        msg.entity_id === "sensor.a"
          ? slowA.promise
          : { domain: "sensor", suggested_attributes: ["b_level"], available_attributes: [] },
    });
    const priv = el as unknown as Priv;
    const first = priv._fetchEntityAttributes("sensor.a");
    await priv._fetchEntityAttributes("sensor.b");
    slowA.resolve({ domain: "sensor", suggested_attributes: ["a_level"], available_attributes: [] });
    await first;
    expect(priv._suggestedAttributes).to.deep.equal(["b_level"]);
  });
});

describe("C-5 task dialog: the preview of a task being edited", () => {
  it("names the task so its postpone and planned anchor count", async () => {
    const { el, sent } = await dialog({
      "maintenance_supporter/schedule/preview": () => ({ occurrences: [], series_ended: false }),
    });
    await el.openEdit("e1", TASK as never);
    await (el as unknown as Priv)._fetchSchedulePreview();
    const req = sent.filter((m) => m.type === "maintenance_supporter/schedule/preview").pop() as SentMessage;
    expect(req.entry_id).to.equal("e1");
    expect(req.task_id).to.equal("t1");
  });
});

describe("P-12 task dialog: every control has a name", () => {
  it("the selects carry their row's label, the phase controls theirs", async () => {
    const { el } = await dialog({
      "maintenance_supporter/object": () => ({ parts: [{ id: "p1", name: "Blade" }] }),
    });
    await el.openCreate("e1", []);
    const priv = el as unknown as Priv;
    priv._phaseDefs = [
      { id: "ph1", name: "Sharpen", checklistText: "", partId: "p1", partQty: "1", reqOverride: false, reqFields: [] },
    ];
    priv._readings = [{ id: "r1", name: "Hours", unit: "h" }];
    priv._scheduleType = "time_based";
    await el.updateComplete;
    const root = el.shadowRoot!;
    const unnamed = [...root.querySelectorAll("select")].filter((s) => !s.getAttribute("aria-label") && !s.closest("label"));
    expect(unnamed.map((u) => u.outerHTML.slice(0, 120)), "selects without a name").to.deep.equal([]);
    expect(root.querySelector(".phase-part")!.getAttribute("aria-label")).to.equal("Spare part");
    expect(root.querySelector(".phase-qty")!.getAttribute("aria-label")).to.equal("Quantity");
    const removers = [...root.querySelectorAll("ha-icon-button.phase-remove")] as Array<HTMLElement & { label?: string }>;
    expect(removers.length).to.be.greaterThan(0);
    expect(removers.every((b) => b.label === "Remove")).to.equal(true);
  });
});

describe("P-11 object booklet: printed with the full histories", () => {
  it("waits for the histories still loading", async () => {
    const slowOil = deferred<unknown>();
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/task/history": (msg) =>
          msg.task_id === "t_oil"
            ? slowOil.promise
            : { history: [{ timestamp: "2026-04-02T14:30:00+00:00", type: "completed", cost: 20 }] },
      },
    });
    const el = await fixture<MaintenanceObjectHistorySection>(html`
      <maintenance-object-history-section
        .hass=${hass as never}
        .entryId=${"e1"}
        .object=${{ name: "Family Car" } as never}
        .tasks=${[{ id: "t_oil", name: "Oil change", history: [] }, { id: "t_tires", name: "Tires", history: [] }] as never}
        .currencySymbol=${"€"}
      ></maintenance-object-history-section>
    `);
    await el.updateComplete;
    await tick();
    const printed: unknown[][] = [];
    const priv = el as unknown as {
      _print(): Promise<void>;
      _bookletData(filtered: unknown[]): Promise<{ tasks: never[]; photos: Record<string, never> }>;
    };
    priv._bookletData = async (filtered) => {
      printed.push(filtered);
      return { tasks: [], photos: {} };
    };
    const original = window.open;
    window.open = () => null;
    try {
      const printing = priv._print();
      await tick();
      expect(printed.length, "printed before the oil history was in").to.equal(0);
      slowOil.resolve({ history: [{ timestamp: "2026-03-10T09:00:00+00:00", type: "completed", cost: 89.5 }] });
      await printing;
    } finally {
      window.open = original;
    }
    expect(printed[0].length).to.equal(2);
  });
});

describe("P-13 keyboard: menus and task rows", () => {
  beforeEach(() => resetTaskSeq());

  it("the object ⋮ menu items are menu items a key activates", async () => {
    const { el } = await mountPanel([obj("e1", [task()])]);
    const panel = el as unknown as { _toggleObjMenu(): void; _showObject(id: string): void; updateComplete: Promise<boolean> };
    panel._showObject("e1");
    await panel.updateComplete;
    await waitUntil(() => !!sr(el).querySelector(".more-menu-wrapper ha-icon-button"), "object page rendered");
    const more = el.shadowRoot!.querySelector(".more-menu-wrapper ha-icon-button") as HTMLElement & { label?: string };
    expect(more.label).to.equal("More actions");
    panel._toggleObjMenu();
    await panel.updateComplete;
    const menu = el.shadowRoot!.querySelector(".popup-menu") as HTMLElement;
    expect(menu.getAttribute("role")).to.equal("menu");
    const items = [...menu.querySelectorAll(".popup-menu-item")] as HTMLElement[];
    expect(items.length).to.be.greaterThan(2);
    expect(items.every((i) => i.getAttribute("role") === "menuitem" && i.tabIndex === 0)).to.equal(true);
    (el as unknown as { _showAllObjects(): void })._showAllObjects();
    await waitUntil(() => !!sr(el).querySelector(".breadcrumb ha-icon-button"), "objects list rendered");
    const back = sr(el).querySelector(".breadcrumb ha-icon-button") as HTMLElement & { label?: string };
    expect(back.label).to.equal("Back");
  });

  it("Enter and Space click the focused item; other keys do not", () => {
    const menu = document.createElement("div");
    const item = document.createElement("div");
    item.setAttribute("role", "menuitem");
    const label = document.createElement("span");
    item.append(label);
    menu.append(item);
    let clicks = 0;
    item.addEventListener("click", () => { clicks++; });
    menu.addEventListener("keydown", clickOnActivationKey);
    document.body.append(menu);
    try {
      for (const key of ["Enter", " ", "a", "Tab"]) {
        label.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
      }
      expect(clicks).to.equal(2);
      item.setAttribute("aria-disabled", "true");
      label.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
      expect(clicks).to.equal(2);
    } finally {
      menu.remove();
    }
  });

  it("the object quick-actions task rows are buttons", async () => {
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/object": () => ({
          entry_id: "e1",
          object: { id: "o1", name: "Boiler" },
          tasks: [{ id: "t1", name: "Service", status: "ok" }],
        }),
      },
    });
    (hass as Record<string, unknown>).user = { id: "admin", is_admin: true };
    const el = await fixture<MaintenanceObjectQuickActionsDialog>(html`
      <maintenance-object-quick-actions-dialog .hass=${hass}></maintenance-object-quick-actions-dialog>
    `);
    await el.openFor("e1");
    await el.updateComplete;
    const row = el.shadowRoot!.querySelector(".task-row") as HTMLElement;
    expect(row.getAttribute("role")).to.equal("button");
    expect(row.tabIndex).to.equal(0);
  });
});

describe("W-13 settings errors read in the user's language", () => {
  it("maps the three codes global/update returns", () => {
    // The message restates the code, so only the translated headline shows.
    expect(describeWsError({ code: "notify_service_not_found", message: "notify service not found" }, "en")).to.equal(
      "This notification service was not found in Home Assistant. Please verify the service name.",
    );
    expect(describeWsError({ code: "invalid_notify_service", message: "invalid notify service" }, "en")).to.equal(
      "Invalid notification service format. Use 'notify.service_name' (e.g., notify.mobile_app_phone).",
    );
    expect(describeWsError({ code: "invalid_shopping_list_entity", message: "invalid shopping list entity" }, "en")).to.equal(
      "The shopping list must be a to-do entity (todo.…).",
    );
  });
});
