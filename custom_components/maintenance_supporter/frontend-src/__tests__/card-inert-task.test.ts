/**
 * Lovelace card: a task nothing may be done to (paused on its own or with its
 * object, switched off) shows why in place of the Complete action. The card
 * showed a paused task with a live Complete button, and the dialog then
 * failed on the server's refusal (live 2026-11-01).
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import "../maintenance-card.js";
import type { MaintenanceSupporterCard } from "../maintenance-card";
import { __resetSettingsCacheForTests } from "../dialog-mount.js";
import { isInertTask } from "../status-constants.js";

const TASKS = [
  { id: "t1", name: "Clean filter", status: "overdue", enabled: true, days_until_due: -1, type: "service" },
  { id: "t2", name: "Winter cover", status: "paused", enabled: true, paused: true, days_until_due: null, type: "service" },
  { id: "t3", name: "Old pump", status: "ok", enabled: false, days_until_due: 4, type: "service" },
];

function mockHass(rowActionStyle: string) {
  return {
    language: "en",
    user: { id: "u1", name: "Tester", is_admin: true, is_owner: true },
    areas: {},
    connection: {
      sendMessagePromise: async (msg: { type: string }) => {
        if (msg.type === "maintenance_supporter/objects") return { objects: [{ entry_id: "e1", object: { id: "e1", name: "Pool" }, tasks: TASKS }] };
        if (msg.type === "maintenance_supporter/settings") return { general: { row_action_style: rowActionStyle } };
        return { overdue: 0, due_soon: 0, triggered: 0, ok: 0, total: 0 };
      },
      subscribeMessage: async () => () => {},
    },
  };
}

async function mount(rowActionStyle: string) {
  const el = await fixture<MaintenanceSupporterCard>(html`<maintenance-supporter-card></maintenance-supporter-card>`);
  el.setConfig({ type: "custom:maintenance-supporter-card", show_actions: true, show_documents: false, filter_status: [] } as never);
  el.hass = mockHass(rowActionStyle) as never;
  await waitUntil(() => el.shadowRoot!.querySelectorAll(".task-name").length === 3, "card renders all three", { timeout: 2000 });
  await new Promise((r) => setTimeout(r, 40));
  await el.updateComplete;
  return el;
}

function row(el: MaintenanceSupporterCard, name: string): HTMLElement {
  const item = [...el.shadowRoot!.querySelectorAll<HTMLElement>(".task-item")].find((i) => i.querySelector(".task-name")?.textContent?.includes(name));
  if (!item) throw new Error(`no row ${name}`);
  return item;
}

describe("card: no Complete on a paused or switched-off task", () => {
  beforeEach(() => __resetSettingsCacheForTests());

  for (const style of ["icons", "buttons_compact"]) {
    it(`${style}: the live task keeps its action, the others say why`, async () => {
      const el = await mount(style);
      const action = (r: HTMLElement) => r.querySelector(".complete-btn, .complete-btn-text");
      expect(action(row(el, "Clean filter")), "live task").to.not.equal(null);
      expect(action(row(el, "Winter cover")) === null, "paused task has no Complete").to.equal(true);
      expect(action(row(el, "Old pump")) === null, "switched-off task has no Complete").to.equal(true);
      expect(row(el, "Winter cover").querySelector(".inert-label")?.textContent?.trim()).to.equal("Paused");
      expect(row(el, "Old pump").querySelector(".inert-label")?.textContent?.trim()).to.equal("Disabled");
    });
  }

  it("isInertTask: the server's rule (archived, off, paused alone or with the object)", () => {
    expect(isInertTask({ status: "overdue", enabled: true })).to.equal(false);
    expect(isInertTask({ status: "ok", enabled: true, archived: true })).to.equal(true);
    expect(isInertTask({ status: "ok", enabled: false })).to.equal(true);
    expect(isInertTask({ status: "paused" })).to.equal(true); // the object's pause
    expect(isInertTask({ status: "ok", paused: true })).to.equal(true);
  });
});
