/**
 * Component test for the Lovelace card task sort (forum thread /995556 #7,
 * reported by brunkj — v2.3.7).
 *
 * Pins:
 *   - Tasks sort by status first (overdue, triggered, due_soon, ok)
 *   - Within a status, soonest-due-first (the bug: previously kept WS/creation
 *     order, so a task due in 3 days could sit above one due in 1 day)
 *   - Tasks without a numeric due date sort last within their status
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import "../maintenance-card.js";
import type { MaintenanceSupporterCard } from "../maintenance-card";

const T = (id: string, name: string, status: string, days: number | null) => ({
  id, name, status, days_until_due: days, type: "service",
});
const O = (entry_id: string, name: string, tasks: unknown[]) => ({
  entry_id, object: { id: entry_id, name }, tasks,
});

// Creation order deliberately NOT in due-date order, to prove the sort
// no longer falls back to insertion order for same-status ties.
function mockObjects() {
  return [
    O("e1", "Aqua Pool", [T("t1", "Check chlorine", "due_soon", 3)]),
    O("e2", "Hot Tub", [T("t2", "Check pH", "due_soon", 1)]),
    O("e3", "Furnace", [
      T("t3", "Replace filter", "overdue", -2),
      T("t4", "Deep service", "overdue", -10),
    ]),
    O("e4", "Garage", [T("t5", "Manual check", "due_soon", null)]),
    O("e5", "Lamp", [T("t6", "Dust", "ok", 40)]),
  ];
}

function mockHass() {
  return {
    language: "en",
    connection: {
      sendMessagePromise: async (msg: { type: string }) =>
        msg.type === "maintenance_supporter/objects"
          ? { objects: mockObjects() }
          : { overdue: 0, due_soon: 0, triggered: 0, ok: 0, total: 0 },
      subscribeMessage: async () => () => {},
    },
  };
}

async function mount(config: Record<string, unknown> = {}): Promise<MaintenanceSupporterCard> {
  const el = await fixture<MaintenanceSupporterCard>(
    html`<maintenance-supporter-card .hass=${mockHass() as never}></maintenance-supporter-card>`
  );
  el.setConfig({ type: "custom:maintenance-supporter-card", show_actions: false, ...config } as never);
  await waitUntil(
    () => el.shadowRoot!.querySelectorAll(".task-name").length > 0,
    "task rows render",
    { timeout: 2000 }
  );
  await el.updateComplete;
  return el;
}

const names = (el: MaintenanceSupporterCard) =>
  [...el.shadowRoot!.querySelectorAll(".task-name")].map((n) => n.textContent?.trim() || "");

describe("maintenance-card sort (forum #7 — due-date tiebreaker)", () => {
  it("orders by status, then soonest-due first within a status", async () => {
    const el = await mount();
    expect(names(el)).to.deep.equal([
      "Deep service",   // overdue -10 (most overdue first)
      "Replace filter", // overdue -2
      "Check pH",       // due_soon 1
      "Check chlorine", // due_soon 3
      "Manual check",   // due_soon null -> last within due_soon
      "Dust",           // ok 40
    ]);
  });

  it("reported case: due-in-1-day sorts before due-in-3-days (same status)", async () => {
    const el = await mount({ filter_status: ["due_soon"] });
    const n = names(el);
    expect(n.indexOf("Check pH")).to.be.lessThan(n.indexOf("Check chlorine"));
  });
});
