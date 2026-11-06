/**
 * Two card affordances that used to require a saved view or the panel:
 *
 *   - `filter_labels` — point one card at one subject ("garden", "car")
 *   - document chips  — the manual is one tap away from the task row
 *
 * Both follow the assignee-badge pattern: the card only asks the backend for
 * the extra data when a visible task actually has some, and the row renders
 * nothing when there is nothing to show.
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
    object: { id: "e1", name: "Garden shed" },
    tasks: [
      T("t1", "Sharpen blades", { labels: ["garden"], document_count: 1 }),
      T("t2", "Descale kettle", { labels: ["kitchen"] }),
      T("t3", "Check tyres", { labels: ["car", "garden"] }),
      T("t4", "Read the meter", { documentation_url: "https://example.invalid/manual" }),
    ],
  },
];

const DOCUMENTS = [
  { id: "d1", title: "Mower manual", kind: "file", task_ids: ["t1"], object_id: "e1" },
  { id: "d2", title: "Unrelated receipt", kind: "file", task_ids: [], object_id: "e1" },
];

function mockHass(calls: string[]) {
  return {
    language: "en",
    user: { id: "u1", name: "Tester", is_admin: true, is_owner: true },
    connection: {
      sendMessagePromise: async (msg: { type: string }) => {
        calls.push(msg.type);
        if (msg.type === "maintenance_supporter/objects") return { objects: OBJECTS };
        if (msg.type === "maintenance_supporter/documents/list") return { documents: DOCUMENTS };
        return { overdue: 0, due_soon: 0, triggered: 0, ok: 0, total: 0 };
      },
      subscribeMessage: async () => () => {},
    },
  };
}

/** Lovelace order: setConfig() first, then hass. */
async function mount(config: Record<string, unknown> = {}) {
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

const names = (el: MaintenanceSupporterCard) =>
  [...el.shadowRoot!.querySelectorAll(".task-name")].map((n) => n.textContent?.trim() || "");
const chips = (el: MaintenanceSupporterCard) =>
  [...el.shadowRoot!.querySelectorAll(".doc-chip")].map((c) => c.textContent?.trim() || "");

describe("maintenance-card label filter", () => {
  it("shows every task when no label filter is set", async () => {
    const { el } = await mount();
    expect(names(el)).to.have.lengthOf(4);
  });

  it("limits the card to one label", async () => {
    const { el } = await mount({ filter_labels: ["kitchen"] });
    expect(names(el)).to.deep.equal(["Descale kettle"]);
  });

  it("matches a task carrying ANY of several configured labels", async () => {
    const { el } = await mount({ filter_labels: ["garden", "car"] });
    expect(names(el)).to.deep.equal(["Sharpen blades", "Check tyres"]);
  });

  it("hides tasks without labels entirely when a filter is set", async () => {
    const { el } = await mount({ filter_labels: ["garden"] });
    expect(names(el)).to.not.contain("Read the meter");
  });
});

describe("maintenance-card document chips", () => {
  it("renders a chip for a linked document", async () => {
    const { el } = await mount();
    await waitUntil(() => chips(el).some((c) => c.includes("Mower manual")), "doc chip", { timeout: 2000 });
    expect(chips(el).filter((c) => c.includes("Mower manual"))).to.have.lengthOf(1);
  });

  it("renders a chip for the task's own documentation link", async () => {
    const { el } = await mount();
    await waitUntil(() => chips(el).length >= 2, "both chips", { timeout: 2000 });
    // t4 carries documentation_url and no linked document.
    expect(chips(el).length).to.equal(2);
  });

  it("does not attach a document to a task it is not linked to", async () => {
    const { el } = await mount();
    await waitUntil(() => chips(el).length >= 2, "chips", { timeout: 2000 });
    expect(chips(el).join(" ")).to.not.contain("Unrelated receipt");
  });

  it("show_documents: false hides them and never asks for the list", async () => {
    const { el, calls } = await mount({ show_documents: false });
    await el.updateComplete;
    expect(chips(el)).to.have.lengthOf(0);
    expect(calls).to.not.contain("maintenance_supporter/documents/list");
  });
});

describe("maintenance-card document chips across objects", () => {
  const TWO = [
    { entry_id: "e1", object: { id: "o1", name: "Garden shed" }, tasks: [T("t1", "Sharpen blades", { document_count: 1 })] },
    { entry_id: "e2", object: { id: "o2", name: "Boiler" }, tasks: [T("t2", "Bleed the radiators", { document_count: 1 })] },
    { entry_id: "e3", object: { id: "o3", name: "Car" }, tasks: [T("t3", "Check tyres")] },
  ];
  const DOCS: Record<string, Array<Record<string, unknown>>> = {
    e1: [{ id: "d1", title: "Mower manual", kind: "file", task_ids: ["t1"], object_id: "o1" }],
    e2: [{ id: "d2", title: "Boiler manual", kind: "file", task_ids: ["t2"], object_id: "o2" }],
  };

  async function mountTwo(acceptsEntryIds: boolean) {
    const asked: Array<Record<string, unknown>> = [];
    const el = await fixture<MaintenanceSupporterCard>(html`<maintenance-supporter-card></maintenance-supporter-card>`);
    el.setConfig({ type: "custom:maintenance-supporter-card", show_actions: false } as never);
    el.hass = {
      language: "en",
      user: { id: "u1", name: "Tester", is_admin: true, is_owner: true },
      connection: {
        sendMessagePromise: async (msg: Record<string, unknown>) => {
          if (msg.type === "maintenance_supporter/objects") return { objects: TWO };
          if (msg.type === "maintenance_supporter/documents/list") {
            asked.push(msg);
            if (msg.entry_ids) {
              if (!acceptsEntryIds) throw { code: "invalid_format", message: "extra keys not allowed" };
              return { documents: (msg.entry_ids as string[]).flatMap((id) => DOCS[id] || []) };
            }
            return { documents: DOCS[msg.entry_id as string] || [] };
          }
          return { overdue: 0, due_soon: 0, triggered: 0, ok: 0, total: 0 };
        },
        subscribeMessage: async () => () => {},
      },
    } as never;
    await waitUntil(() => chips(el).length >= 2, "chips on both objects", { timeout: 2000 });
    return { el, asked };
  }

  it("asks once for every object that has documents (perf 2026-11-05: once per object)", async () => {
    const { el, asked } = await mountTwo(true);
    expect(asked).to.deep.equal([{ type: "maintenance_supporter/documents/list", entry_ids: ["e1", "e2"] }]);
    expect(chips(el).sort()).to.deep.equal(["Boiler manual", "Mower manual"]);
  });

  it("a server from before entry_ids is asked once per object", async () => {
    const { el, asked } = await mountTwo(false);
    expect(asked.map((m) => m.entry_id ?? "batch")).to.deep.equal(["batch", "e1", "e2"]);
    expect(chips(el).sort()).to.deep.equal(["Boiler manual", "Mower manual"]);
  });
});
