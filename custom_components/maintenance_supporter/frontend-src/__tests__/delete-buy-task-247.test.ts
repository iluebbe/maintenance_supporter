/** #247: deleting a buy task asks whether to turn the part's buy reminder off.
 *
 *  A buy task belongs to its part; deleted on its own it came straight back
 *  while the part stayed low. The question says so and offers the reminder's
 *  switch (ticked at first); `task/delete` then carries
 *  `disable_auto_buy_task`. A plain task is asked as before.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/confirm-dialog.js";
import "../components/task-quick-actions-dialog.js";
import type { MaintenanceConfirmDialog } from "../components/confirm-dialog";
import type { MaintenanceTaskQuickActionsDialog } from "../components/task-quick-actions-dialog";
import { askDeleteTask } from "../helpers/delete-task.js";
import { invalidateSettingsCache } from "../helpers/settings-cache.js";
import { t } from "../styles.js";
import { DEFAULT_SETTINGS_RESPONSE, createMockHass } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

const tick = (ms = 20) => new Promise((r) => setTimeout(r, ms));
const BUY = { part_ref: { part_id: "p1" } };

async function dialog(): Promise<MaintenanceConfirmDialog> {
  const { hass } = createMockHass({});
  return fixture<MaintenanceConfirmDialog>(html`<maintenance-confirm-dialog .hass=${hass}></maintenance-confirm-dialog>`);
}
const content = (dlg: MaintenanceConfirmDialog) => dlg.shadowRoot!.querySelector(".content")!;
const box = (dlg: MaintenanceConfirmDialog) => dlg.shadowRoot!.querySelector<HTMLInputElement>(".confirm-check input[type=checkbox]");
const buttons = (dlg: MaintenanceConfirmDialog) => [...dlg.shadowRoot!.querySelectorAll<HTMLElement>(".dialog-actions ha-button")];
const confirmBtn = (dlg: MaintenanceConfirmDialog) => buttons(dlg)[buttons(dlg).length - 1];

describe("#247 deleting a buy task", () => {
  it("says why it would come back and offers the reminder's switch, ticked", async () => {
    const dlg = await dialog();
    const answer = askDeleteTask(dlg, BUY, "en");
    await dlg.updateComplete;
    expect(content(dlg).textContent).to.contain(t("delete_buy_task_confirm", "en"));
    expect(content(dlg).textContent).to.contain(t("delete_buy_task_off", "en"));
    expect(box(dlg)?.checked, "ticked at first").to.equal(true);
    confirmBtn(dlg).click();
    expect(await answer).to.deep.equal({ disable_auto_buy_task: true });
  });

  it("unticked, the task goes alone", async () => {
    const dlg = await dialog();
    const answer = askDeleteTask(dlg, BUY, "en");
    await dlg.updateComplete;
    box(dlg)!.click();
    await dlg.updateComplete;
    confirmBtn(dlg).click();
    expect(await answer).to.deep.equal({});
  });

  it("Cancel deletes nothing", async () => {
    const dlg = await dialog();
    const answer = askDeleteTask(dlg, BUY, "en");
    await dlg.updateComplete;
    buttons(dlg)[0].click();
    expect(await answer).to.equal(null);
  });

  it("the next question starts ticked again, and a plain task gets no switch", async () => {
    const dlg = await dialog();
    let answer = askDeleteTask(dlg, BUY, "en");
    await dlg.updateComplete;
    box(dlg)!.click();
    confirmBtn(dlg).click();
    await answer;
    answer = askDeleteTask(dlg, BUY, "en");
    await dlg.updateComplete;
    expect(box(dlg)?.checked).to.equal(true);
    buttons(dlg)[0].click();
    await answer;

    const plain = askDeleteTask(dlg, { part_ref: null }, "en");
    await dlg.updateComplete;
    expect(content(dlg).textContent).to.contain(t("delete_task_confirm", "en"));
    expect(box(dlg) === null, "no switch").to.equal(true);
    confirmBtn(dlg).click();
    expect(await plain).to.deep.equal({});
  });

  it("the card's quick actions send the switch with the delete", async () => {
    invalidateSettingsCache();
    const { hass, sent } = createMockHass({
      settingsResponse: DEFAULT_SETTINGS_RESPONSE as never,
      handlers: {
        "maintenance_supporter/object": () => ({
          entry_id: "e1", object: { id: "o1", name: "Roborock" },
          tasks: [{
            id: "t1", name: "Buy: Side brush", type: "custom", schedule_type: "one_time", warning_days: 7,
            status: "due_soon", enabled: true, archived: false, is_done: false, days_until_due: 1, history: [], checklist: [],
            ...BUY,
          }],
        }),
        "maintenance_supporter/task/delete": () => ({ success: true }),
      },
    });
    (hass as Record<string, unknown>).user = { id: "admin", is_admin: true };
    const el = await fixture<MaintenanceTaskQuickActionsDialog>(html`
      <maintenance-task-quick-actions-dialog .hass=${hass}></maintenance-task-quick-actions-dialog>`);
    try {
      await el.openFor("e1", "t1");
      await el.updateComplete;
      (el.shadowRoot!.querySelector(".qa-delete") as HTMLElement).click();
      await tick();
      const dlg = document.querySelector<MaintenanceConfirmDialog>("maintenance-confirm-dialog[data-ms-lovelace-confirm]")!;
      await dlg.updateComplete;
      expect(box(dlg)?.checked).to.equal(true);
      confirmBtn(dlg).click();
      await tick();
      const del = sent.find((m) => m.type === "maintenance_supporter/task/delete");
      expect(del?.disable_auto_buy_task).to.equal(true);
    } finally {
      document.querySelectorAll("maintenance-confirm-dialog[data-ms-lovelace-confirm]").forEach((d) => d.remove());
    }
  });

  it("the panel sends it too, and nothing extra for a plain task", async () => {
    resetTaskSeq();
    const { el, sent } = await mountPanel(
      [obj("e1", [task({ name: "Buy: Side brush", ...BUY }), task({ name: "Clean the sensors" })], "Roborock")],
      { "maintenance_supporter/task/delete": () => ({ success: true }) },
    );
    const panel = el as unknown as { _deleteTask: (e: string, t: string) => Promise<void>; _objects: { tasks: { id: string; name: string }[] }[] };
    const [buy, plain] = panel._objects[0].tasks;
    const dlg = sr(el).querySelector<MaintenanceConfirmDialog>("maintenance-confirm-dialog")!;

    let done = panel._deleteTask("e1", buy.id);
    await dlg.updateComplete;
    expect(box(dlg)?.checked).to.equal(true);
    confirmBtn(dlg).click();
    await done;
    done = panel._deleteTask("e1", plain.id);
    await dlg.updateComplete;
    expect(box(dlg) === null).to.equal(true);
    confirmBtn(dlg).click();
    await done;

    const dels = sent.filter((m) => m.type === "maintenance_supporter/task/delete");
    expect(dels.map((m) => [m.task_id, m.disable_auto_buy_task ?? null])).to.deep.equal([[buy.id, true], [plain.id, null]]);
  });
});
