/**
 * #185: the task dialog's "Notification icon" picker writes `notify_icon`
 * (null when empty, so the update path clears an override), hydrates from the
 * stored value and tells the user which type default applies.
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
type Priv = { _save: () => Promise<void>; _notifyIcon: string };

describe("task dialog: notification icon (#185)", () => {
  it("sends null when empty and names the type default in the hint", async () => {
    const { el, sent } = await mountDialog();
    await el.openEdit("e1", baseTask as never);
    await el.updateComplete;
    const help = el.shadowRoot!.querySelector(".notify-icon-help")!;
    expect(help.textContent).to.contain("mdi:broom");
    expect(help.querySelector("ha-icon")!.getAttribute("icon")).to.equal("mdi:broom");
    await (el as unknown as Priv)._save();
    const update = sent.find((m) => m.type === "maintenance_supporter/task/update") as unknown as Record<string, unknown>;
    expect(update.notify_icon).to.equal(null);
  });

  it("hydrates a stored override and sends it back trimmed; the preview follows it", async () => {
    const { el, sent } = await mountDialog();
    await el.openEdit("e1", { ...baseTask, notify_icon: "mdi:air-filter" } as never);
    await el.updateComplete;
    expect((el as unknown as Priv)._notifyIcon).to.equal("mdi:air-filter");
    expect(el.shadowRoot!.querySelector(".notify-icon-help ha-icon")!.getAttribute("icon")).to.equal("mdi:air-filter");
    (el as unknown as Priv)._notifyIcon = " mdi:leaf ";
    await el.updateComplete;
    await (el as unknown as Priv)._save();
    const update = sent.find((m) => m.type === "maintenance_supporter/task/update") as unknown as Record<string, unknown>;
    expect(update.notify_icon).to.equal("mdi:leaf");
  });
});
