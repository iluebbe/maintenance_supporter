/**
 * The clipping check on the faketime year (2026-11-01) with stress names:
 *   - a 53-letter word with no break ran out of its cell: over the due date
 *     at 1920 with the filter pane open, over the object's name on a phone.
 *     Names may break anywhere now.
 *   - the filter pane beside the list AND the empty task pane left the list a
 *     third of 1920 px; the empty task pane steps aside until a task is
 *     picked (beta, below 2200 px of panel).
 *   - from 2400 px the object column grows past 180 px (a long object name
 *     took four lines beside all that space).
 *   - the second check that evening: the docked task's seven figures ran
 *     5 px past their pane (seven fixed columns), and a group's head on a
 *     phone 8 px past its card (its buttons reached into the card's edge).
 */

import { expect } from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";
import { setBetaUi } from "../helpers/beta-ui";

for (const tag of ["ha-dropdown", "ha-dropdown-item", "wa-divider", "ha-adaptive-dialog", "ha-select", "ha-input", "ha-switch",
  "ha-checkbox", "ha-settings-row", "ha-expansion-panel", "ha-alert", "ha-tab-group", "ha-tab-group-tab"]) {
  if (!customElements.get(tag)) customElements.define(tag, class extends HTMLElement {});
}

const WORD = "Kondensatablaufschlauchreinigungsintervallüberprüfung";
const LONG_OBJECT = "Wärmepumpe Außeneinheit Garten Nordseite (Viessmann Vitocal 250-A AWO-E-AC 251.A13)";

type Panel = HTMLElement & { updateComplete: Promise<unknown>; requestUpdate: () => void };

async function settle(el: Panel) {
  await new Promise((r) => setTimeout(r, 60));
  await el.updateComplete;
}

async function list(width: number, beta: boolean, paneOpen = false, handlers: Parameters<typeof mountPanel>[1] = {}) {
  await setViewport({ width, height: 900 });
  localStorage.setItem("msp-overview-tab", "dashboard");
  if (paneOpen) localStorage.setItem("msp-filter-pane", "1");
  const { el } = await mountPanel([
    obj("e1", [task({ name: WORD, status: "overdue", days_until_due: -11 }), task({ name: "Filter" })], LONG_OBJECT),
    obj("e2", [task({ name: "Descale" })], "Kettle"),
  ], handlers);
  const p = el as unknown as Panel;
  setBetaUi(beta);
  p.requestUpdate();
  await settle(p);
  return p;
}

const rowOf = (p: Panel, name: string) =>
  [...sr(p).querySelectorAll(".task-row:not(.virt-sizer)")].find((r) => r.querySelector(".cell.task-name")?.textContent?.includes(name))!;
const textRight = (el: Element) => {
  const range = document.createRange();
  range.selectNodeContents(el);
  return Math.max(...[...range.getClientRects()].map((r) => r.right));
};

describe("clipping on the year's data (2026-11)", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
  });
  afterEach(async () => {
    setBetaUi(false);
    localStorage.clear();
    await setViewport({ width: 800, height: 600 });
  });

  for (const [width, beta, pane] of [[1440, true, true], [1920, true, false], [1440, false, false]] as const) {
    it(`${width} px${beta ? " beta" : " classic"}${pane ? " with the filter pane" : ""}: the long word stays left of the due date`, async () => {
      const p = await list(width, beta, pane);
      const row = rowOf(p, WORD);
      const name = row.querySelector(".cell.task-name")!;
      const due = row.querySelector(".due-cell")!.getBoundingClientRect();
      expect(textRight(name), "the name's text ends before the due date").to.be.at.most(due.left + 1);
    });
  }

  it("phone: the long word does not run over the object's name", async () => {
    const p = await list(390, true);
    const row = rowOf(p, WORD);
    const object = row.querySelector(".cell.object-name")!.getBoundingClientRect();
    expect(textRight(row.querySelector(".cell.task-name")!), "name ends left of the object").to.be.at.most(object.left + 1);
  });

  it("1920 with the filter pane: no empty task pane, a tapped task docks", async () => {
    const p = await list(1920, true, true);
    expect(sr(p).querySelector(".ms-filter-pane") !== null, "pane open").to.equal(true);
    expect(sr(p).querySelector(".split-pane") === null, "no empty task pane beside it").to.equal(true);
    (rowOf(p, "Descale").querySelector(".cell.task-name") as HTMLElement).click();
    await settle(p);
    expect(sr(p).querySelector(".split-pane .task-name-breadcrumb")?.textContent).to.contain("Descale");
    // the live failure: pane, list and docked task share 1920 px, and the
    // long word ran over the due date
    const row = rowOf(p, WORD);
    expect(textRight(row.querySelector(".cell.task-name")!), "the long word ends before the due date").to.be.at.most(row.querySelector(".due-cell")!.getBoundingClientRect().left + 1);
  });

  it("a docked task's figures fit their pane (1920 beside HA's sidebar, filter pane open)", async () => {
    // 1664 px of panel = a 1920 screen less HA's 256 px sidebar; a task with
    // its dates filled in, as the year's tasks have them.
    await setViewport({ width: 1664, height: 900 });
    localStorage.setItem("msp-overview-tab", "dashboard");
    localStorage.setItem("msp-filter-pane", "1");
    const { el } = await mountPanel([obj("e2", [task({
      name: "Descale", status: "overdue", days_until_due: -11, next_due: "2026-10-21", last_performed: "2026-09-21",
      interval_days: 30, warning_days: 7, average_duration: 25,
    })], "Kettle")]);
    const p = el as unknown as Panel;
    setBetaUi(true);
    p.requestUpdate();
    await settle(p);
    (rowOf(p, "Descale").querySelector(".cell.task-name") as HTMLElement).click();
    await settle(p);
    const kpi = sr(p).querySelector<HTMLElement>(".split-pane .kpi-bar");
    expect(kpi !== null, "the docked task's figures").to.equal(true);
    expect(kpi!.scrollWidth, "the figures fit the pane").to.be.at.most(kpi!.clientWidth + 1);
  });

  it("2560: the object column grows past 180 px for a long name", async () => {
    const p = await list(2560, true);
    const objectCell = rowOf(p, WORD).querySelector(".cell.object-name")!.getBoundingClientRect();
    expect(objectCell.width).to.be.greaterThan(250);
  });

  // Last: it gives ha-icon-button its size (the earlier tests measure rows
  // with HA's buttons absent, as before).
  it("phone: a group's head fits its card", async () => {
    // The real button sizes itself from --ha-icon-button-size (44 px here).
    if (!customElements.get("ha-icon-button")) {
      customElements.define("ha-icon-button", class extends HTMLElement {
        connectedCallback() {
          this.style.width = "var(--ha-icon-button-size, 48px)";
          this.style.height = "var(--ha-icon-button-size, 48px)";
        }
      });
    }
    const p = await list(390, true, false, {
      "maintenance_supporter/settings": () => ({ features: { groups: true } }),
      "maintenance_supporter/groups": () => ({ groups: { g1: { name: "Weekly chores", description: "", task_refs: [] } } }),
    });
    const head = sr(p).querySelector<HTMLElement>(".group-card-head");
    expect(head !== null, "the group's head").to.equal(true);
    expect(head!.querySelector("ha-icon-button")!.getBoundingClientRect().width, "the button has its size").to.equal(44);
    expect(head!.scrollWidth, "the head fits").to.be.at.most(head!.clientWidth + 1);
  });
});
