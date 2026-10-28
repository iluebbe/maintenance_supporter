/**
 * #234: a simpler task card for a shared kitchen tablet. Pins: the create
 * buttons have their own switch (unset follows show_actions, so a card
 * without completion buttons keeps none); compact rows put the person
 * before the task as their avatar, so a row stays one line; the editor's
 * title and max items are ms-textfields (HA's lazy ha-textfield could stay
 * an empty element there); the simple-list preset sets the options once.
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import "../maintenance-card.js";
import "../maintenance-card-editor.js";
import type { MaintenanceSupporterCard } from "../maintenance-card";

type Priv = HTMLElement & { updateComplete: Promise<unknown>; [k: string]: any }; // eslint-disable-line @typescript-eslint/no-explicit-any

const OBJECTS = [{
  entry_id: "e1",
  object: { id: "e1", name: "Kitchen" },
  tasks: [{ id: "t1", name: "Empty the filter", status: "overdue", days_until_due: -1, type: "cleaning", responsible_user_id: "u1" }],
}];
const USERS = [{ id: "u1", name: "Alice", is_admin: false, is_owner: false, initials: "AL", color: "#1565c0" }];

function hass() {
  return {
    language: "en",
    user: { id: "u1", name: "Alice", is_admin: true, is_owner: true },
    connection: {
      sendMessagePromise: async (msg: { type: string }) => {
        if (msg.type === "maintenance_supporter/objects") return { objects: OBJECTS };
        if (msg.type === "maintenance_supporter/users/list") return { users: USERS };
        return { overdue: 0, due_soon: 0, triggered: 0, ok: 0, total: 0 };
      },
      subscribeMessage: async () => () => {},
    },
  };
}

async function card(config: Record<string, unknown>) {
  const el = await fixture<MaintenanceSupporterCard & Priv>(html`<maintenance-supporter-card></maintenance-supporter-card>`);
  el.setConfig({ type: "custom:maintenance-supporter-card", ...config } as never);
  el.hass = hass() as never;
  await waitUntil(() => el.shadowRoot!.querySelector(".task-name"), "row renders", { timeout: 2000 });
  await el.updateComplete;
  return el;
}

const createButtons = (el: Priv) => el.shadowRoot!.querySelectorAll(".hdr-add").length;
const completeButtons = (el: Priv) => el.shadowRoot!.querySelectorAll(".complete-btn, .complete-btn-text").length;

describe("#234: a simpler card", () => {
  it("show_create hides the create buttons and keeps Complete", async () => {
    const plain = await card({});
    expect(createButtons(plain), "create buttons by default").to.be.greaterThan(0);
    const tablet = await card({ show_create: false });
    expect(createButtons(tablet)).to.equal(0);
    expect(completeButtons(tablet)).to.equal(1);
    // Unset follows show_actions: a card without completion buttons keeps none.
    const readOnly = await card({ show_actions: false });
    expect(createButtons(readOnly)).to.equal(0);
    expect(completeButtons(readOnly)).to.equal(0);
  });

  it("compact rows put the person before the task as their avatar", async () => {
    const el = await card({ compact: true });
    await waitUntil(() => el.shadowRoot!.querySelector(".task-name .compact-assignee"), "avatar inline", { timeout: 2000 });
    const name = el.shadowRoot!.querySelector(".task-name")!;
    const badge = name.querySelector<HTMLElement>(".compact-assignee")!;
    expect(badge.getAttribute("title")).to.equal("Alice");
    expect(name.firstElementChild, "before the task name").to.equal(badge);
    expect(el.shadowRoot!.querySelector(".task-meta"), "no second line").to.equal(null);
  });

  it("the editor's text fields are ms-textfields, and the preset sets a simple list", async () => {
    const editor = await fixture<Priv>(html`<maintenance-supporter-card-editor></maintenance-supporter-card-editor>`);
    editor.hass = hass() as never;
    editor.setConfig({ type: "custom:maintenance-supporter-card", title: "Kitchen" });
    await editor.updateComplete;
    expect(editor.shadowRoot!.querySelector("ha-textfield"), "no lazy ha-textfield").to.equal(null);
    expect((editor.shadowRoot!.querySelector("ms-textfield.card-title") as HTMLElement & { value: string }).value).to.equal("Kitchen");
    let config: Record<string, unknown> | null = null;
    editor.addEventListener("config-changed", (e) => { config = (e as CustomEvent).detail.config; });
    editor.shadowRoot!.querySelector<HTMLButtonElement>(".preset-btn")!.click();
    expect(config).to.deep.include({
      title: "Kitchen", compact: true, action_style: "icons", show_actions: true,
      show_create: false, show_assignee: true, show_documents: false,
    });
  });
});
