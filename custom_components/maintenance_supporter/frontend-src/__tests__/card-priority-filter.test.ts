/**
 * `filter_priority` (#134) — point one card at the urgent stuff only.
 *
 * OR semantics over the configured levels, like filter_labels; a task
 * without an explicit priority counts as "normal" (the model default).
 * Saved-view scoping (`view_id`) gains the same dimension.
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
    object: { id: "e1", name: "Robot vac" },
    tasks: [
      T("t1", "Refill water", { priority: "high" }),
      T("t2", "Replace brush", { priority: "low" }),
      T("t3", "Empty dustbin"), // no explicit priority -> "normal"
    ],
  },
];

const VIEWS = [
  { id: "v-high", name: "Urgent", filters: { status: "", user_id: null, label: null, priority: "high", archived: false, sort_mode: "due_date", group_by: "none" } },
];

function mockHass() {
  return {
    language: "en",
    user: { id: "u1", name: "Tester", is_admin: true, is_owner: true },
    connection: {
      sendMessagePromise: async (msg: { type: string }) => {
        if (msg.type === "maintenance_supporter/objects") return { objects: OBJECTS };
        if (msg.type === "maintenance_supporter/views/list") return { views: VIEWS };
        return { overdue: 0, due_soon: 0, triggered: 0, ok: 0, total: 0 };
      },
      subscribeMessage: async () => () => {},
    },
  };
}

async function mount(config: Record<string, unknown> = {}) {
  const el = await fixture<MaintenanceSupporterCard>(
    html`<maintenance-supporter-card></maintenance-supporter-card>`
  );
  el.setConfig({ type: "custom:maintenance-supporter-card", show_actions: false, ...config } as never);
  el.hass = mockHass() as never;
  await waitUntil(
    () => el.shadowRoot!.querySelectorAll(".task-name, .empty-card").length > 0,
    "card renders",
    { timeout: 2000 }
  );
  await el.updateComplete;
  return el;
}

const names = (el: MaintenanceSupporterCard) =>
  [...el.shadowRoot!.querySelectorAll(".task-name")].map((n) => n.textContent?.trim() || "");

describe("maintenance-card priority filter (#134)", () => {
  it("shows every task when no priority filter is set", async () => {
    const el = await mount();
    expect(names(el)).to.have.lengthOf(3);
  });

  it("filter_priority: ['high'] keeps only the high task", async () => {
    const el = await mount({ filter_priority: ["high"] });
    expect(names(el)).to.deep.equal(["Refill water"]);
  });

  it("a task without explicit priority matches 'normal'", async () => {
    const el = await mount({ filter_priority: ["normal"] });
    expect(names(el)).to.deep.equal(["Empty dustbin"]);
  });

  it("OR semantics: ['high', 'low'] keeps both", async () => {
    const el = await mount({ filter_priority: ["high", "low"] });
    expect(names(el)).to.have.lengthOf(2);
  });

  it("a saved view's priority dimension scopes the card via view_id", async () => {
    const el = await mount({ view_id: "v-high" });
    expect(names(el)).to.deep.equal(["Refill water"]);
  });
});
