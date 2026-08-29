/**
 * <maintenance-task-dialog>: the object picker belongs to CREATE only.
 *
 * openCreate("", objects) exposes a dropdown so the card's "Add task" button
 * can target an object. openEdit never reset those choices, so
 * Create → Cancel → Edit rendered the dropdown in edit mode — and picking
 * another object re-pointed _entryId while _taskId kept the old task, i.e.
 * the save went to the wrong object (audit 2026-08-29).
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/task-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import { createMockHass } from "./_test-utils.js";

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

function objectOptions(el: MaintenanceTaskDialog): string[] {
  return [...el.shadowRoot!.querySelectorAll("option")]
    .map((o) => o.textContent?.trim() || "")
    .filter((txt) => txt === "Boiler" || txt === "Car");
}

async function mount(): Promise<MaintenanceTaskDialog> {
  const { hass } = createMockHass({});
  const el = await fixture<MaintenanceTaskDialog>(html`
    <maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>
  `);
  await el.updateComplete;
  return el;
}

describe("task-dialog object picker is create-only", () => {
  it("openCreate with objects renders the picker", async () => {
    const el = await mount();
    await el.openCreate("", OBJECTS);
    await el.updateComplete;
    expect(objectOptions(el)).to.deep.equal(["Boiler", "Car"]);
  });

  it("Create → Cancel → Edit shows NO object picker and keeps the edit target", async () => {
    const el = await mount();
    await el.openCreate("", OBJECTS);
    await el.updateComplete;
    (el as unknown as { _close: () => void })._close();
    await el.updateComplete;

    await el.openEdit("e2", TASK as never);
    await el.updateComplete;

    expect(objectOptions(el), "no object picker in edit mode").to.deep.equal([]);
    const priv = el as unknown as { _entryId: string; _taskId: string | null; _objectChoices: unknown[] };
    expect(priv._objectChoices).to.deep.equal([]);
    expect(priv._entryId).to.equal("e2");
    expect(priv._taskId).to.equal("t1");
  });

  it("Edit → Cancel → Create with objects shows the picker again", async () => {
    const el = await mount();
    await el.openEdit("e2", TASK as never);
    await el.updateComplete;
    (el as unknown as { _close: () => void })._close();
    await el.updateComplete;

    await el.openCreate("", OBJECTS);
    await el.updateComplete;
    expect(objectOptions(el)).to.deep.equal(["Boiler", "Car"]);
  });
});
