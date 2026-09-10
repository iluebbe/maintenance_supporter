/**
 * #173: the task dialog's "No notifications for this task" checkbox writes
 * `notify_enabled` (false when ticked, true otherwise) and hydrates from the
 * stored flag; the task-detail header shows a bell-off badge for a muted task.
 */
import { expect, fixture, html } from "@open-wc/testing";
import "../components/task-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import { type SentMessage, createMockHass } from "./_test-utils.js";

async function mountDialog(): Promise<{ el: MaintenanceTaskDialog; sent: SentMessage[] }> {
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/task/update": () => ({ success: true }),
      "maintenance_supporter/object": () => ({ parts: [] }),
    },
  });
  const el = await fixture<MaintenanceTaskDialog>(html`<maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>`);
  await el.updateComplete;
  return { el, sent };
}

const baseTask = { id: "t1", name: "Filter", type: "cleaning", enabled: true, schedule_type: "time_based", interval_days: 30, warning_days: 7, priority: "normal" };

const muteBox = (el: MaintenanceTaskDialog): HTMLInputElement =>
  [...el.shadowRoot!.querySelectorAll<HTMLLabelElement>("label.req-option")]
    .find((l) => /No notifications for this task/.test(l.textContent || ""))!
    .querySelector("input")!;

describe("task dialog: no notifications for this task (#173)", () => {
  it("hydrates unticked for a task without the flag and sends notify_enabled=true", async () => {
    const { el, sent } = await mountDialog();
    await el.openEdit("e1", baseTask as never);
    await el.updateComplete;
    expect(muteBox(el).checked).to.equal(false);
    await (el as unknown as { _save: () => Promise<void> })._save();
    const update = sent.find((m) => m.type === "maintenance_supporter/task/update") as unknown as Record<string, unknown>;
    expect(update.notify_enabled).to.equal(true);
  });

  it("ticking the box sends notify_enabled=false and shows the help text", async () => {
    const { el, sent } = await mountDialog();
    await el.openEdit("e1", baseTask as never);
    await el.updateComplete;
    muteBox(el).click();
    await el.updateComplete;
    expect(el.shadowRoot!.textContent).to.contain("No reminders for this task");
    await (el as unknown as { _save: () => Promise<void> })._save();
    const update = sent.find((m) => m.type === "maintenance_supporter/task/update") as unknown as Record<string, unknown>;
    expect(update.notify_enabled).to.equal(false);
  });

  it("hydrates ticked for a muted task", async () => {
    const { el } = await mountDialog();
    await el.openEdit("e1", { ...baseTask, notify_enabled: false } as never);
    await el.updateComplete;
    expect(muteBox(el).checked).to.equal(true);
  });
});
