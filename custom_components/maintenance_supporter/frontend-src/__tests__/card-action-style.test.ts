/**
 * Lovelace card: the Complete action follows `action_style` when the card
 * sets it, otherwise the household's "Task row actions" setting (#145).
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import "../maintenance-card.js";
import type { MaintenanceSupporterCard } from "../maintenance-card";
import { __resetSettingsCacheForTests } from "../dialog-mount.js";

const OBJECTS = [
  {
    entry_id: "e1",
    object: { id: "e1", name: "Dishwasher" },
    tasks: [{ id: "t1", name: "Clean filter", status: "overdue", days_until_due: -1, type: "service" }],
  },
];

function mockHass(rowActionStyle: string) {
  return {
    language: "en",
    user: { id: "u1", name: "Tester", is_admin: true, is_owner: true },
    areas: {},
    connection: {
      sendMessagePromise: async (msg: { type: string }) => {
        if (msg.type === "maintenance_supporter/objects") return { objects: OBJECTS };
        if (msg.type === "maintenance_supporter/settings") return { general: { row_action_style: rowActionStyle } };
        return { overdue: 0, due_soon: 0, triggered: 0, ok: 0, total: 0 };
      },
      subscribeMessage: async () => () => {},
    },
  };
}

async function mount(config: Record<string, unknown>, rowActionStyle: string) {
  const el = await fixture<MaintenanceSupporterCard>(html`<maintenance-supporter-card></maintenance-supporter-card>`);
  el.setConfig({ type: "custom:maintenance-supporter-card", show_actions: true, show_documents: false, ...config } as never);
  el.hass = mockHass(rowActionStyle) as never;
  await waitUntil(() => el.shadowRoot!.querySelectorAll(".task-name").length > 0, "card renders", { timeout: 2000 });
  await new Promise((r) => setTimeout(r, 40));
  await el.updateComplete;
  return el;
}

const haButtons = (el: MaintenanceSupporterCard) => el.shadowRoot!.querySelectorAll("ha-button.complete-btn-text").length;
const iconButtons = (el: MaintenanceSupporterCard) => el.shadowRoot!.querySelectorAll("mwc-icon-button.complete-btn").length;

describe("card action_style (#145)", () => {
  beforeEach(() => __resetSettingsCacheForTests());

  it("follows the household setting: buttons_compact → labelled HA button", async () => {
    const el = await mount({}, "buttons_compact");
    await waitUntil(() => haButtons(el) === 1, "ha-button rendered");
    expect(iconButtons(el)).to.equal(0);
  });

  it("follows the household setting: icons → classic check icon", async () => {
    const el = await mount({}, "icons");
    expect(iconButtons(el)).to.equal(1);
    expect(haButtons(el)).to.equal(0);
  });

  it("the card's own action_style wins over the household setting", async () => {
    const icons = await mount({ action_style: "icons" }, "buttons_compact");
    await new Promise((r) => setTimeout(r, 40));
    expect(iconButtons(icons)).to.equal(1);
    expect(haButtons(icons)).to.equal(0);

    const buttons = await mount({ action_style: "buttons" }, "icons");
    await new Promise((r) => setTimeout(r, 40));
    expect(haButtons(buttons)).to.equal(1);
    expect(iconButtons(buttons)).to.equal(0);
  });

  it("show_actions: false hides both forms", async () => {
    const el = await mount({ show_actions: false }, "buttons_compact");
    expect(haButtons(el) + iconButtons(el)).to.equal(0);
  });
});
