/**
 * <maintenance-task-dialog>: the to-do mirror field (D#183) — hydration from
 * `mirror_todo_entities`, the entity multi-picker's value-changed round-trip,
 * and the outgoing WS payload (always sent; [] clears the lists).
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/task-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import { type SentMessage, createMockHass } from "./_test-utils.js";

async function mountDialog(): Promise<{ el: MaintenanceTaskDialog; sent: SentMessage[] }> {
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/task/create": () => ({ task_id: "new1" }),
      "maintenance_supporter/task/update": () => ({}),
    },
  });
  const el = await fixture<MaintenanceTaskDialog>(html`
    <maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>
  `);
  await el.updateComplete;
  return { el, sent };
}

const baseTask = {
  id: "t1", name: "Filter", type: "custom",
  schedule_type: "time_based", interval_days: 30, warning_days: 7, enabled: true,
};

describe("task-dialog to-do mirror field (D#183)", () => {
  it("hydrates the lists on openEdit and re-sends them on save", async () => {
    const { el, sent } = await mountDialog();
    await el.openEdit("e", { ...baseTask, mirror_todo_entities: ["todo.family", "todo.kids"] } as any);
    await el.updateComplete;
    expect((el as any)._mirrorTodoEntities).to.deep.equal(["todo.family", "todo.kids"]);
    await (el as any)._save();
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/update") as any;
    expect(msg, "update message sent").to.exist;
    expect(msg.mirror_todo_entities).to.deep.equal(["todo.family", "todo.kids"]);
  });

  it("renders a todo-domain entity multi-picker with the hint and takes value-changed", async () => {
    const { el, sent } = await mountDialog();
    await el.openCreate("e");
    (el as any)._name = "Filter";
    await el.updateComplete;
    const field = el.shadowRoot!.querySelector(".mirror-todo-field");
    expect(field, "mirror field rendered").to.exist;
    const form = field!.querySelector("ha-form") as any;
    expect(form, "ha-form picker rendered").to.exist;
    expect(form.schema[0].selector.entity.domain).to.deep.equal(["todo"]);
    expect(form.schema[0].selector.entity.multiple).to.be.true;
    expect(field!.querySelector(".field-help")!.textContent).to.contain("completes it here");

    form.dispatchEvent(new CustomEvent("value-changed", {
      bubbles: true, composed: true, detail: { value: { mirror_todo_entities: ["todo.family", ""] } },
    }));
    await el.updateComplete;
    expect((el as any)._mirrorTodoEntities).to.deep.equal(["todo.family"]);

    await (el as any)._save();
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/create") as any;
    expect(msg.mirror_todo_entities).to.deep.equal(["todo.family"]);
  });

  it("sends an empty list when nothing is picked (clears the mirror) and resets between opens", async () => {
    const { el, sent } = await mountDialog();
    await el.openEdit("e", { ...baseTask, mirror_todo_entities: ["todo.family"] } as any);
    await el.updateComplete;
    (el as any)._close();
    await el.openCreate("e");
    (el as any)._name = "Fresh";
    expect((el as any)._mirrorTodoEntities).to.deep.equal([]);
    await (el as any)._save();
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/create") as any;
    expect(msg.mirror_todo_entities).to.deep.equal([]);
  });

  it("falls back to a comma-separated text field when the picker context is broken", async () => {
    const { el } = await mountDialog();
    await el.openCreate("e");
    (el as any)._entityPickerFallback = true;
    await el.updateComplete;
    const field = el.shadowRoot!.querySelector(".mirror-todo-field")!;
    expect(field.querySelector("ha-form")).to.not.exist;
    const tf = field.querySelector("ms-textfield") as any;
    expect(tf, "text fallback rendered").to.exist;
    tf.value = "todo.family, todo.kids";
    tf.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    await el.updateComplete;
    expect((el as any)._mirrorTodoEntities).to.deep.equal(["todo.family", "todo.kids"]);
  });
});
