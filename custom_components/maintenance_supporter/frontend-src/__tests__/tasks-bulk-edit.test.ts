/**
 * Several tasks changed at once (discussion #199). After a large template
 * import every task had to be opened to assign it, label it or tune its
 * warning days; the selection bar could only complete, archive and move.
 *
 * The dialog collects one change (assign / labels / edit); the panel sends it
 * with tasks/update_many for every selected task and offers the undo the
 * backend answered with. Pause / Resume and the objects' Area… use the
 * existing single commands per item.
 */
import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import "../components/bulk-edit-dialog.js";
import type { MaintenanceBulkEditDialog } from "../components/bulk-edit-dialog";
import { createMockHass } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

type Panel = HTMLElement & {
  updateComplete: Promise<unknown>;
  _bulkMode: boolean;
  _bulkSelected: Set<string>;
  _objBulkMode: boolean;
  _showAllObjects: () => void;
  _undoAction?: (() => void) | null;
};

const USERS = [
  { id: "u_bob", name: "Bob" },
  { id: "u_alice", name: "Alice" },
];

async function dialog() {
  const { hass } = createMockHass();
  const el = await fixture<MaintenanceBulkEditDialog>(html`<maintenance-bulk-edit-dialog .hass=${hass}></maintenance-bulk-edit-dialog>`);
  return el;
}

const rows = (labels: string[][]) => labels.map((l, i) => ({ entry_id: "e1", task_id: `t${i}`, labels: l })) as never[];
const q = <T extends Element>(el: Element, s: string) => el.shadowRoot!.querySelector<T>(s)!;

async function save(el: MaintenanceBulkEditDialog) {
  await el.updateComplete;
  q<HTMLElement>(el, "ha-button.apply").click();
}

describe("bulk edit dialog (D#199)", () => {
  it("one person replaces any rotation; nobody unassigns", async () => {
    const el = await dialog();
    const pending = el.open("assign", rows([[]]), USERS as never[]);
    await el.updateComplete;
    // Our own title: Home Assistant's dialog draws no `heading` (the live
    // docs shot came out without one).
    expect(q(el, ".dialog-title").textContent!.trim()).to.equal("Assign");
    const select = q<HTMLSelectElement>(el, "select.person");
    expect([...select.options].map((o) => o.textContent?.trim())).to.deep.equal(["Unassigned", "Alice", "Bob"]);
    select.value = "u_alice";
    select.dispatchEvent(new Event("change"));
    await save(el);
    expect(await pending).to.deep.equal({ responsible_user_id: "u_alice", assignee_pool: null, rotation_strategy: null });
  });

  it("a rotation needs two people and sends the pool with its strategy", async () => {
    const el = await dialog();
    const pending = el.open("assign", rows([[]]), USERS as never[]);
    await el.updateComplete;
    const radios = el.shadowRoot!.querySelectorAll<HTMLInputElement>("input[type=radio]");
    radios[1].click();
    await el.updateComplete;
    const boxes = el.shadowRoot!.querySelectorAll<HTMLInputElement>(".pool input[type=checkbox]");
    boxes[0].click();
    await el.updateComplete;
    expect(el.changes(), "one person is not a rotation").to.equal(null);
    boxes[1].click();
    await save(el);
    expect(await pending).to.deep.equal({ assignee_pool: ["u_alice", "u_bob"], rotation_strategy: "round_robin", responsible_user_id: null });
  });

  it("labels: adds what is typed, removes what is ticked from the labels the selection carries", async () => {
    const el = await dialog();
    const pending = el.open("labels", rows([["kitchen"], ["kitchen", "safety"]]), []);
    await el.updateComplete;
    const removable = [...el.shadowRoot!.querySelectorAll(".pool .row")].map((r) => r.textContent?.trim());
    expect(removable).to.deep.equal(["kitchen", "safety"]);
    const field = q<HTMLElement & { value: string }>(el, "ms-textfield.labels-add");
    field.value = "monthly, garden, monthly";
    field.dispatchEvent(new Event("input"));
    el.shadowRoot!.querySelector<HTMLInputElement>(".pool input[type=checkbox]")!.click();
    await save(el);
    expect(await pending).to.deep.equal({ labels_add: ["monthly", "garden"], labels_remove: ["kitchen"] });
  });

  it("edit: only the ticked settings travel; nothing ticked cannot be saved", async () => {
    const el = await dialog();
    const pending = el.open("edit", rows([[]]), []);
    await el.updateComplete;
    expect(q(el, ".dialog-title").textContent!.trim()).to.equal("Edit");
    // Several tasks: the reminders row speaks in the plural.
    expect(el.shadowRoot!.textContent).to.include("No notifications for these tasks");
    expect(el.changes()).to.equal(null);
    expect(q<HTMLElement & { disabled: boolean }>(el, "ha-button.apply").disabled).to.equal(true);
    q<HTMLInputElement>(el, "input.set-warning").click();
    const days = q<HTMLInputElement>(el, "input.warning");
    days.value = "3";
    days.dispatchEvent(new Event("change"));
    q<HTMLInputElement>(el, "input.set-mute").click();
    await el.updateComplete;
    q<HTMLInputElement>(el, "input.mute").click();
    await save(el);
    expect(await pending).to.deep.equal({ warning_days: 3, notify_enabled: false });
  });

  it("cancel answers null", async () => {
    const el = await dialog();
    const pending = el.open("edit", rows([[]]), []);
    await el.updateComplete;
    el.shadowRoot!.querySelector<HTMLElement>(".dialog-actions ha-button")!.click();
    expect(await pending).to.equal(null);
  });
});

describe("selection bar: bulk edit, pause and area (D#199)", () => {
  beforeEach(() => resetTaskSeq());

  async function selecting(extra: Record<string, (m: Record<string, unknown>) => unknown> = {}) {
    const { el, sent } = await mountPanel(
      [obj("e1", [task({ name: "Descale" }), task({ name: "Filter", status: "paused" })], "Boiler"), obj("e2", [task({ name: "Wax" })], "Car")],
      {
        "maintenance_supporter/users/list": () => ({ users: USERS }),
        "maintenance_supporter/tasks/update_many": (m: Record<string, unknown>) => {
          const items = m.items as Array<Record<string, unknown>>;
          return {
            updated: items.map(({ entry_id, task_id }) => ({ entry_id, task_id })),
            failed: [],
            previous: items.map(({ entry_id, task_id }) => ({ entry_id, task_id, changes: { labels: null } })),
          };
        },
        "maintenance_supporter/task/pause": () => ({ success: true }),
        "maintenance_supporter/task/resume": () => ({ success: true }),
        ...extra,
      },
    );
    const panel = el as unknown as Panel;
    sr(panel).querySelector<HTMLElement>(".bulk-toggle")!.click();
    await panel.updateComplete;
    sr(panel).querySelector<HTMLInputElement>(".bulk-bar .bulk-selectall input")!.click();
    await panel.updateComplete;
    sr(panel).querySelector<HTMLElement>(".bulk-more")!.click();
    await panel.updateComplete;
    return { el: panel, sent: sent as Array<Record<string, unknown>> };
  }

  const settle = async (el: Panel) => { await new Promise((r) => setTimeout(r, 80)); await el.updateComplete; };

  it("Labels… sends one tasks/update_many for every selected task and the undo sends back what it replaced", async () => {
    const { el, sent } = await selecting();
    const dlg = sr(el).querySelector("maintenance-bulk-edit-dialog") as unknown as MaintenanceBulkEditDialog;
    let asked: unknown[] = [];
    dlg.open = async (mode, picked) => { asked = [mode, picked.length]; return { labels_add: ["garden"], labels_remove: [] }; };
    sr(el).querySelector<HTMLElement>(".popup-menu-item.bulk-labels")!.click();
    // The dialog lives in the lazily loaded UI chunk group.
    await waitUntil(() => sent.some((m) => m.type === "maintenance_supporter/tasks/update_many"), "update_many sent", { timeout: 4000 });
    await settle(el);
    expect(asked).to.deep.equal(["labels", 3]);
    const calls = sent.filter((m) => m.type === "maintenance_supporter/tasks/update_many");
    expect(calls.length, "one call, not one per task").to.equal(1);
    expect((calls[0].items as unknown[]).length).to.equal(3);
    expect(calls[0].changes).to.deep.equal({ labels_add: ["garden"], labels_remove: [] });
    expect(el._bulkMode, "selection ends").to.equal(false);

    const undo = sr(el).querySelector<HTMLElement>(".toast-undo, .undo-button, .toast button");
    expect(undo, "an undo is offered").to.exist;
    undo!.click();
    await settle(el);
    const undoCall = sent.filter((m) => m.type === "maintenance_supporter/tasks/update_many")[1];
    expect(undoCall.changes, "the undo carries per-task values only").to.equal(undefined);
    expect((undoCall.items as Array<Record<string, unknown>>)[0].changes).to.deep.equal({ labels: null });
  });

  it("Pause… pauses the running tasks with one date; Resume resumes the paused one", async () => {
    const { el, sent } = await selecting();
    const confirm = sr(el).querySelector("maintenance-confirm-dialog") as unknown as { prompt: () => Promise<unknown> };
    confirm.prompt = async () => ({ confirmed: true, value: "2027-03-01" });
    sr(el).querySelector<HTMLElement>(".popup-menu-item.bulk-pause")!.click();
    await settle(el);
    const pauses = sent.filter((m) => m.type === "maintenance_supporter/task/pause");
    expect(pauses.length, "the paused task is left out").to.equal(2);
    expect(pauses.every((m) => m.until === "2027-03-01")).to.equal(true);

    const again = await selecting();
    again.el.shadowRoot!.querySelector<HTMLElement>(".popup-menu-item.bulk-resume")!.click();
    await settle(again.el);
    expect(again.sent.filter((m) => m.type === "maintenance_supporter/task/resume").length).to.equal(1);
  });

  it("objects: Area… sets one area on every selected object", async () => {
    const { el, sent } = await mountPanel([obj("e1", [task()], "Boiler"), obj("e2", [task()], "Car")], {
      "maintenance_supporter/object/update": () => ({ success: true }),
    });
    const panel = el as unknown as Panel;
    (panel as unknown as { hass: { areas: Record<string, unknown> } }).hass.areas = {
      garage: { area_id: "garage", name: "Garage" },
    };
    panel._showAllObjects();
    await panel.updateComplete;
    sr(panel).querySelector<HTMLElement>(".obj-bulk-toggle")!.click();
    await panel.updateComplete;
    for (const card of sr(panel).querySelectorAll<HTMLElement>(".object-card")) card.click();
    await panel.updateComplete;
    const confirm = sr(panel).querySelector("maintenance-confirm-dialog") as unknown as { prompt: (o: { options: Array<{ value: string }> }) => Promise<unknown> };
    let offered: string[] = [];
    confirm.prompt = async (o) => { offered = o.options.map((x) => x.value); return { confirmed: true, value: "garage" }; };
    sr(panel).querySelector<HTMLElement>(".obj-bulk-area")!.click();
    await settle(panel);
    expect(offered).to.deep.equal(["", "garage"]);
    const updates = (sent as Array<Record<string, unknown>>).filter((m) => m.type === "maintenance_supporter/object/update");
    expect(updates.map((m) => [m.entry_id, m.area_id])).to.deep.equal([["e1", "garage"], ["e2", "garage"]]);
  });
});
