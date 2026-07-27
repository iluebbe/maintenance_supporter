/**
 * Component test for the Lovelace card's "whose turn is it" badge
 * (forum request, 2026-07-27: the card never showed the responsible user,
 * which is what a household reads off a rotation).
 *
 * Pins:
 *   - the assignee name renders on the row, resolved from `users/list`
 *   - a task with no responsible user renders no badge (no empty separator)
 *   - an id whose user cannot be resolved (deleted account) hides the badge
 *     rather than leaking a raw uuid
 *   - `show_assignee: false` turns the whole thing off — and then the card
 *     must not even ask the backend for the user list
 *   - compact rows still show it (that is the mode a phone dashboard uses)
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import "../maintenance-card.js";
import type { MaintenanceSupporterCard } from "../maintenance-card";

const T = (id: string, name: string, extra: Record<string, unknown> = {}) => ({
  id, name, status: "overdue", days_until_due: -1, type: "service", ...extra,
});

const OBJECTS = [
  {
    entry_id: "e1",
    object: { id: "e1", name: "Kitchen" },
    tasks: [
      T("t1", "Take out bins", { responsible_user_id: "u1" }),
      T("t2", "Water plants", { responsible_user_id: null }),
      T("t3", "Clean filter", { responsible_user_id: "ghost" }),
    ],
  },
];

const USERS = [
  { id: "u1", name: "Alice", is_admin: false, is_owner: false },
  { id: "u2", name: "Bob", is_admin: false, is_owner: false },
];

function mockHass(calls: string[]) {
  return {
    language: "en",
    user: { id: "u1", name: "Alice", is_admin: true, is_owner: true },
    connection: {
      sendMessagePromise: async (msg: { type: string }) => {
        calls.push(msg.type);
        if (msg.type === "maintenance_supporter/objects") return { objects: OBJECTS };
        if (msg.type === "maintenance_supporter/users/list") return { users: USERS };
        return { overdue: 0, due_soon: 0, triggered: 0, ok: 0, total: 0 };
      },
      subscribeMessage: async () => () => {},
    },
  };
}

/** Mounts the way Lovelace does: setConfig() FIRST, then hass. Handing the
 *  element hass before its config races the data load against the config and
 *  is what let a `show_assignee: false` card still fetch the user list. */
async function mount(
  config: Record<string, unknown> = {},
): Promise<{ el: MaintenanceSupporterCard; calls: string[] }> {
  const calls: string[] = [];
  const el = await fixture<MaintenanceSupporterCard>(
    html`<maintenance-supporter-card></maintenance-supporter-card>`
  );
  el.setConfig({ type: "custom:maintenance-supporter-card", show_actions: false, ...config } as never);
  el.hass = mockHass(calls) as never;
  await waitUntil(
    () => el.shadowRoot!.querySelectorAll(".task-name, .empty-card").length > 0,
    "card renders",
    { timeout: 2000 }
  );
  await el.updateComplete;
  return { el, calls };
}

const metaText = (el: MaintenanceSupporterCard) =>
  [...el.shadowRoot!.querySelectorAll(".task-meta")].map((n) => n.textContent?.replace(/\s+/g, " ").trim() || "");

describe("maintenance-card assignee badge", () => {
  it("shows the responsible user's name on the row", async () => {
    const { el } = await mount();
    await waitUntil(() => metaText(el).some((m) => m.includes("Alice")), "name resolved", { timeout: 2000 });
    const rows = metaText(el);
    expect(rows[0]).to.contain("Alice");
    expect(rows[0]).to.contain("Kitchen"); // object name still there
  });

  it("renders nothing for an unassigned task", async () => {
    const { el } = await mount();
    await waitUntil(() => metaText(el).some((m) => m.includes("Alice")), "name resolved", { timeout: 2000 });
    // t2 has no responsible user — its meta line must not gain a trailing separator.
    const watered = metaText(el).find((m) => m.startsWith("Kitchen") && !m.includes("Alice"));
    expect(watered).to.exist;
    expect(watered).to.not.contain("·  ");
  });

  it("hides the badge when the user id cannot be resolved", async () => {
    const { el } = await mount();
    await waitUntil(() => metaText(el).some((m) => m.includes("Alice")), "name resolved", { timeout: 2000 });
    expect(metaText(el).join(" ")).to.not.contain("ghost");
  });

  it("show_assignee: false hides it and never asks for the user list", async () => {
    const { el, calls } = await mount({ show_assignee: false });
    await el.updateComplete;
    expect(metaText(el).join(" ")).to.not.contain("Alice");
    expect(calls).to.not.contain("maintenance_supporter/users/list");
  });

  it("compact rows still show who is up", async () => {
    const { el } = await mount({ compact: true });
    await waitUntil(
      () => el.shadowRoot!.querySelectorAll(".compact-assignee").length > 0,
      "compact badge",
      { timeout: 2000 }
    );
    const badge = el.shadowRoot!.querySelector(".compact-assignee");
    expect(badge?.textContent?.trim()).to.contain("Alice");
  });
});
