/**
 * #235: the toast after adopting problem sensors offers Configure, and it
 * opened only the first of the tasks just created. Pins: the task dialog
 * edits a series one after another ("2 of 3"), Save stores each task once and
 * moves on, Skip moves on without saving, the last one closes with a plain
 * Save, a refused save stays on its task, Cancel ends the series and a plain
 * openEdit is no series; the panel's Configure hands every created task it
 * finds to the dialog.
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import "../components/task-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import type { MaintenanceTask } from "../types";
import { type SentMessage, createMockHass } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

type Dialog = HTMLElement & {
  updateComplete: Promise<unknown>;
  openEdit: MaintenanceTaskDialog["openEdit"];
  openEditSeries: MaintenanceTaskDialog["openEditSeries"];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any;
};

const base = { type: "custom", schedule_type: "time_based", interval_days: 30, warning_days: 7, enabled: true };
const ITEMS = [
  { entryId: "e1", task: { ...base, id: "a", name: "Dryer filter" } },
  { entryId: "e1", task: { ...base, id: "b", name: "Dryer door" } },
  { entryId: "e2", task: { ...base, id: "c", name: "Leak under the sink" } },
] as unknown as Array<{ entryId: string; task: MaintenanceTask }>;

async function mountDialog(refuse: string[] = []): Promise<{ el: Dialog; sent: SentMessage[] }> {
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/task/update": (msg) => {
        if (refuse.includes(String(msg.task_id))) throw { code: "invalid", message: "Refused" };
        return {};
      },
    },
  });
  const el = await fixture<Dialog>(html`<maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>`);
  await el.updateComplete;
  return { el, sent };
}

const text = (el: Element | null | undefined) => (el?.textContent || "").replace(/\s+/g, " ").trim();
const position = (el: Dialog) => text(el.shadowRoot!.querySelector(".series-position"));
const buttons = (el: Dialog) => [...el.shadowRoot!.querySelectorAll<HTMLElement>(".dialog-actions ha-button")];
const updates = (sent: SentMessage[]) => sent.filter((m) => m.type === "maintenance_supporter/task/update");

describe("#235: the task dialog edits a series", () => {
  it("saves each task once and moves on; Skip saves nothing; the last one closes", async () => {
    const { el, sent } = await mountDialog();
    await el.openEditSeries(ITEMS);
    await el.updateComplete;
    expect(position(el)).to.equal("1 of 3");
    expect(el._name).to.equal("Dryer filter");
    expect(buttons(el).map(text)).to.deep.equal(["Cancel", "Skip", "Save & next"]);

    buttons(el)[2].click();
    await waitUntil(() => position(el) === "2 of 3", "the second task opens");
    expect(el._open).to.equal(true);
    expect(el._name).to.equal("Dryer door");
    expect(updates(sent).map((m) => [m.entry_id, m.task_id])).to.deep.equal([["e1", "a"]]);

    buttons(el)[1].click();
    await waitUntil(() => position(el) === "3 of 3", "Skip opens the third task");
    expect(el._name).to.equal("Leak under the sink");
    expect(updates(sent)).to.have.length(1);
    expect(buttons(el).map(text)).to.deep.equal(["Cancel", "Save"]);

    buttons(el)[1].click();
    await waitUntil(() => !el._open, "the last Save closes the dialog");
    expect(updates(sent).map((m) => [m.entry_id, m.task_id])).to.deep.equal([["e1", "a"], ["e2", "c"]]);
    expect(el._series).to.deep.equal([]);
  });

  it("stays on a task whose save is refused", async () => {
    const { el, sent } = await mountDialog(["a"]);
    await el.openEditSeries(ITEMS);
    await el.updateComplete;
    buttons(el)[2].click();
    await waitUntil(() => el._error !== "", "the refusal is shown");
    await el.updateComplete;
    expect(position(el)).to.equal("1 of 3");
    expect(el._name).to.equal("Dryer filter");
    expect(updates(sent)).to.have.length(1);
  });

  it("ends with Cancel, and a plain edit is no series", async () => {
    const { el } = await mountDialog();
    await el.openEditSeries(ITEMS);
    await el.updateComplete;
    buttons(el)[0].click();
    await el.updateComplete;
    expect(el._open).to.equal(false);
    expect(el._series).to.deep.equal([]);

    await el.openEdit("e1", ITEMS[1].task);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".series-position")).to.equal(null);
    expect(buttons(el).map(text)).to.deep.equal(["Cancel", "Save"]);
  });

  it("is no series with a single task", async () => {
    const { el } = await mountDialog();
    await el.openEditSeries(ITEMS.slice(0, 1));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".series-position")).to.equal(null);
    expect(buttons(el).map(text)).to.deep.equal(["Cancel", "Save"]);
  });
});

describe("#235: Configure after adopting problem sensors", () => {
  it("hands every created task the panel finds to the dialog, in order", async () => {
    resetTaskSeq();
    const filter = task({ name: "Dryer filter" });
    const door = task({ name: "Dryer door" });
    const leak = task({ name: "Leak" });
    const { el } = await mountPanel([obj("e1", [filter, door], "Dryer"), obj("e2", [leak], "Sink")]);
    const proto = customElements.get("maintenance-task-dialog")!.prototype as Dialog;
    const original = proto.openEditSeries;
    const opened: Array<Array<{ entryId: string; task: { id: string } }>> = [];
    proto.openEditSeries = async function (items: Array<{ entryId: string; task: { id: string } }>) {
      opened.push(items);
    } as never;
    try {
      await (el as unknown as { _onProblemSensorsAdopted(e: CustomEvent): Promise<void> })._onProblemSensorsAdopted(
        new CustomEvent("problem-sensors-adopted", {
          detail: {
            tasks_created: 4,
            created: [
              { entry_id: "e1", task_id: filter.id, name: "Dryer filter" },
              { entry_id: "e2", task_id: leak.id, name: "Leak" },
              { entry_id: "e1", task_id: "gone", name: "Removed meanwhile" },
              { entry_id: "e1", task_id: door.id, name: "Dryer door" },
            ],
          },
        }),
      );
      await el.updateComplete;
      sr(el).querySelector<HTMLElement>(".toast-undo")!.click();
      // The first open fetches the panel's lazy dialog chunks (over 2 s cold).
      await waitUntil(() => opened.length === 1, "the series opens", { timeout: 10000 });
      expect(opened[0].map((i) => [i.entryId, i.task.id])).to.deep.equal([
        ["e1", filter.id], ["e2", leak.id], ["e1", door.id],
      ]);
    } finally {
      proto.openEditSeries = original;
    }
  });
});
