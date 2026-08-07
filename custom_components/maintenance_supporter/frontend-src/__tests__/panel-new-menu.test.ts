/** #125: the "New ▾" menu and the getting-started chips.
 *
 *  The six action buttons collapsed into one primary menu; young installs
 *  additionally get dismissible discovery chips. Pins: menu contents and
 *  action wiring, the young/mature gate (incl. that MATURE installs never
 *  pay the discovery calls), and dismissal persistence.
 */

import { expect } from "@open-wc/testing";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

const openMenu = async (el: HTMLElement & { updateComplete: Promise<unknown> }) => {
  sr(el).querySelector<HTMLElement>(".new-menu-button")!.click();
  await el.updateComplete;
};
const menuItems = (el: HTMLElement) =>
  [...sr(el).querySelectorAll(".new-menu-popup .popup-menu-item")].map((i) => i.textContent?.trim() || "");

function manyObjects(n: number) {
  return Array.from({ length: n }, (_, i) => obj(`e${i}`, [task({ name: `T${i}` })], `Obj ${i}`));
}

const DISCOVERY = {
  "maintenance_supporter/integration_setups/discover": () => ({ setups: [{}, {}, {}] }),
  "maintenance_supporter/problem_sensors/discover": () => ({ sensors: [{}, {}] }),
};

describe("the New menu (#125)", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.removeItem("msp-overview-tab");
    localStorage.removeItem("msp-gs-dismissed");
  });

  it("carries the five standing entries and wires the task dialog", async () => {
    const { el } = await mountPanel([obj("e1", [task()])]);
    await openMenu(el);
    const items = menuItems(el);
    expect(items.some((i) => /new .*task/i.test(i)), "new task").to.equal(true);
    expect(items.some((i) => /new object/i.test(i)), "new object").to.equal(true);
    expect(items.some((i) => /template/i.test(i)), "from template").to.equal(true);
    expect(items.some((i) => /problem sensor/i.test(i)), "adopt").to.equal(true);
    expect(items.some((i) => /suggested/i.test(i)), "suggested setups").to.equal(true);

    // Clicking "New task" closes the menu and opens the (lazy) task dialog.
    const newTask = [...sr(el).querySelectorAll(".new-menu-popup .popup-menu-item")]
      .find((i) => /new .*task/i.test(i.textContent || ""))! as HTMLElement;
    newTask.click();
    await customElements.whenDefined("maintenance-task-dialog");
    for (let i = 0; i < 50; i++) {
      const dlg = sr(el).querySelector("maintenance-task-dialog") as (HTMLElement & { shadowRoot: ShadowRoot }) | null;
      if (dlg?.shadowRoot?.querySelector("ha-dialog, .dialog-backdrop, form, .dialog")) break;
      await new Promise((r) => setTimeout(r, 20));
    }
    await el.updateComplete;
    expect(sr(el).querySelector(".new-menu-popup"), "menu closed after click").to.equal(null);
  });
});

describe("getting-started chips (#125)", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.removeItem("msp-overview-tab");
    localStorage.removeItem("msp-gs-dismissed");
  });

  it("young install: discovery chips render with counts", async () => {
    const { el } = await mountPanel([obj("e1", [task()])], DISCOVERY);
    await new Promise((r) => setTimeout(r, 30));
    await el.updateComplete;
    const chips = [...sr(el).querySelectorAll(".gs-chip")].map((c) => c.textContent || "");
    expect(chips.some((c) => c.includes("3")), "setups chip with count").to.equal(true);
    expect(chips.some((c) => c.includes("2")), "adopt chip with count").to.equal(true);
  });

  it("dismissing a chip persists and only hides that chip", async () => {
    const { el } = await mountPanel([obj("e1", [task()])], DISCOVERY);
    await new Promise((r) => setTimeout(r, 30));
    await el.updateComplete;
    const first = sr(el).querySelector(".gs-chip .gs-chip-x") as HTMLElement;
    first.click();
    await el.updateComplete;
    expect(sr(el).querySelectorAll(".gs-chip").length).to.equal(1);
    const stored = JSON.parse(localStorage.getItem("msp-gs-dismissed") || "[]");
    expect(stored.length).to.equal(1);
  });

  it("mature install: no chips, and the discovery calls are never made", async () => {
    const discoverCalls: string[] = [];
    const { el } = await mountPanel(manyObjects(5), {
      "maintenance_supporter/integration_setups/discover": () => { discoverCalls.push("setups"); return { setups: [{}] }; },
      "maintenance_supporter/problem_sensors/discover": () => { discoverCalls.push("adopt"); return { sensors: [{}] }; },
    });
    await new Promise((r) => setTimeout(r, 30));
    await el.updateComplete;
    expect(sr(el).querySelectorAll(".gs-chip").length).to.equal(0);
    expect(discoverCalls, "mature installs must not pay discovery").to.deep.equal([]);
  });
});
