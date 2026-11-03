/** D#85 (2.118): the object page says when its template has changed since,
 *  and the dialog takes the changes over. Changes the user made too start
 *  unticked; applying sends a yes or no for every offer. The idle warm-up's
 *  copy of the page asks nothing. */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/template-updates.js";
import { recurrenceText, type MaintenanceTemplateUpdates, type TemplateUpdates } from "../components/template-updates";
import { createMockHass, type SentMessage } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

const UPDATES: TemplateUpdates = {
  template_id: "garden_lawn",
  template_name: "Lawn",
  changes: [
    { task_id: "t1", task_name: "Mowing", field: "recurrence", conflict: false, before: { kind: "interval", every: 10 }, after: { kind: "interval", every: 10, season_months: [4, 5, 6, 7, 8, 9, 10] } },
    { task_id: "t1", task_name: "Mowing", field: "name", conflict: false, before: "Mowing", after: "Mow Lawn" },
    { task_id: "t2", task_name: "Weed it", field: "warning_days", conflict: true, before: 3, after: 14 },
  ],
  new_tasks: [{ key: "Edge Lawn", name: "Edge Lawn", schedule: { kind: "interval", every: 30 }, warning_days: 7 }],
};

async function mount(updates: TemplateUpdates | null, entryId = "e1") {
  const applied: SentMessage[] = [];
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/template_updates": () => updates ?? { template_id: null, template_name: null, changes: [], new_tasks: [] },
      "maintenance_supporter/template_updates/apply": (msg) => {
        applied.push(msg);
        return { applied: 2, declined: 2, added: 0 };
      },
    },
  });
  const el = await fixture<MaintenanceTemplateUpdates>(html`<maintenance-template-updates .hass=${hass} .entryId=${entryId}></maintenance-template-updates>`);
  await new Promise((r) => setTimeout(r, 20));
  await el.updateComplete;
  return { el, sent, applied };
}

const root = (el: MaintenanceTemplateUpdates) => el.shadowRoot!;
const boxes = (el: MaintenanceTemplateUpdates) =>
  [...root(el).querySelectorAll<HTMLInputElement>(".tpl-change input[type=checkbox], .tpl-change ha-checkbox")];

describe("template updates (D#85)", () => {
  it("says nothing without changes, and asks nothing for the warm-up copy", async () => {
    const none = await mount(null);
    expect(root(none.el).querySelector(".tpl-banner"), "no banner").to.equal(null);
    const warm = await mount(UPDATES, "");
    expect(warm.sent.some((m) => m.type === "maintenance_supporter/template_updates"), "no request").to.equal(false);
    expect(root(warm.el).querySelector(".tpl-banner")).to.equal(null);
  });

  it("names the template and counts every offer", async () => {
    const { el, sent } = await mount(UPDATES);
    expect(sent.find((m) => m.type === "maintenance_supporter/template_updates")?.entry_id).to.equal("e1");
    const banner = root(el).querySelector(".tpl-banner")!;
    expect(banner.textContent).to.contain("Lawn").and.contain("4");
  });

  it("ticks the template's changes, not the ones the user made too, and sends a decision for each", async () => {
    const { el, applied } = await mount(UPDATES);
    (root(el).querySelector(".tpl-review") as HTMLElement).click();
    await el.updateComplete;
    const items = boxes(el);
    expect(items.length, "three changes and the new task").to.equal(4);
    expect(items.map((b) => (b as HTMLInputElement).checked)).to.deep.equal([true, true, false, true]);
    const conflict = root(el).querySelector(".tpl-change.conflict")!;
    expect(conflict.textContent).to.contain("You changed this too");
    expect(root(el).textContent).to.contain("Apr").and.contain("Mow Lawn").and.contain("Edge Lawn");
    // untick the name change
    (items[1] as HTMLInputElement).click();
    await el.updateComplete;
    let fired = false;
    el.addEventListener("template-updates-applied", () => { fired = true; });
    (root(el).querySelector(".tpl-apply") as HTMLElement).click();
    await new Promise((r) => setTimeout(r, 20));
    expect(applied.length).to.equal(1);
    expect(applied[0].changes).to.deep.equal([
      { task_id: "t1", field: "recurrence", accept: true },
      { task_id: "t1", field: "name", accept: false },
      { task_id: "t2", field: "warning_days", accept: false },
    ]);
    expect(applied[0].new_tasks).to.deep.equal([{ key: "Edge Lawn", accept: true }]);
    expect(fired, "the panel reloads").to.equal(true);
  });

  it("writes a recurrence with its season window", () => {
    // The task page's own wording (formatRecurrence), the window after it.
    expect(recurrenceText({ kind: "interval", every: 10, season_months: [10, 4, 5] }, "en")).to.equal("10 Days · Apr, May, Oct");
    expect(recurrenceText({ kind: "interval", every: 7 }, "en")).to.equal("7 Days");
  });

  it("the object page asks for its template's changes, the warm-up copy does not", async () => {
    resetTaskSeq();
    const lawn = obj("e1", [task({ name: "Mowing" })], "Lawn");
    (lawn.object as Record<string, unknown>).template_id = "garden_lawn";
    const r = await mountPanel([lawn], { "maintenance_supporter/template_updates": () => UPDATES });
    const el = r.el as HTMLElement & { _warmUpObjectPage: () => void; _objectWarmedUp: boolean; _showObject: (id: string) => void; updateComplete: Promise<unknown> };
    el._objectWarmedUp = false;
    el._warmUpObjectPage();
    await new Promise((res) => setTimeout(res, 30));
    expect(r.sent.filter((m) => m.type === "maintenance_supporter/template_updates").length, "warm-up: none").to.equal(0);
    el._showObject("e1");
    await el.updateComplete;
    await new Promise((res) => setTimeout(res, 30));
    const asked = r.sent.filter((m) => m.type === "maintenance_supporter/template_updates");
    expect(asked.map((m) => m.entry_id)).to.deep.equal(["e1"]);
    const comp = sr(el).querySelector("maintenance-template-updates") as MaintenanceTemplateUpdates | null;
    expect(comp !== null && comp.shadowRoot!.querySelector(".tpl-banner") !== null, "the line on the page").to.equal(true);
  });
});
