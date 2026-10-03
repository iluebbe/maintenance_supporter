/**
 * Document chips on the dashboard card's task rows in a narrow column.
 *
 * In a 480 px dashboard column the chips sat in their own column between the
 * task and its due label: three completion photos of one task wrapped into a
 * block that left the task's name one letter ("T…") and broke its object and
 * type over three lines, and the chip labels were cut mid-word without an
 * ellipsis. Completion photos are not reference documents — the object
 * history hides them under the tasks already — and a narrow card now moves
 * the chips onto their own line under the task, at most two and a "+N".
 */
import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";
import "../maintenance-card.js";
import type { MaintenanceSupporterCard } from "../maintenance-card";

const T = (id: string, name: string, days: number, extra: Record<string, unknown> = {}) => ({
  id, name, status: "overdue", days_until_due: days, type: "cleaning", ...extra,
});

const OBJECTS = [
  {
    entry_id: "e1",
    object: { id: "e1", name: "Garden pond" },
    tasks: [
      T("t1", "Clean the pond pump", -53, { document_count: 3 }),
      T("t2", "Replace the PTFE tubes", -40, { documentation_url: "https://example.invalid/ptfe" }),
      T("t3", "Replace filter", -33, { document_count: 1 }),
      T("t4", "Clean the print bed", -24, { document_count: 3 }),
      T("t5", "Check the tyre pressure", -114),
    ],
  },
];

const photo = (id: string) => ({ id, title: `photo-20260712-08${id.slice(-2)}.jpg`, kind: "file", tags: ["photo"], task_ids: ["t1"] });
const DOCUMENTS = [
  photo("p01"), photo("p02"), photo("p03"),
  { id: "d1", title: "Robot vacuum S6 MaxV manual.pdf", kind: "file", tags: ["manual"], task_ids: ["t3"] },
  { id: "d2", title: "Print bed cleaning guide.pdf", kind: "file", tags: ["manual"], task_ids: ["t4"] },
  { id: "d3", title: "Spare parts list.pdf", kind: "file", tags: ["spare_parts"], task_ids: ["t4"] },
  { id: "d4", title: "Warranty card.pdf", kind: "file", tags: ["warranty"], task_ids: ["t4"] },
];

function mockHass() {
  return {
    language: "en",
    user: { id: "u1", name: "Tester", is_admin: true, is_owner: true },
    connection: {
      sendMessagePromise: async (msg: { type: string }) => {
        if (msg.type === "maintenance_supporter/objects") return { objects: OBJECTS };
        if (msg.type === "maintenance_supporter/documents/list") return { documents: DOCUMENTS };
        return { overdue: 0, due_soon: 0, triggered: 0, ok: 0, total: 0 };
      },
      subscribeMessage: async () => () => {},
    },
  };
}

/** The card in a dashboard column `width` px wide, with labelled Complete
 *  buttons (the household default). */
async function mountInColumn(width: number): Promise<MaintenanceSupporterCard> {
  const box = await fixture<HTMLElement>(html`
    <div style="width: ${width}px"><maintenance-supporter-card></maintenance-supporter-card></div>
  `);
  const el = box.querySelector<MaintenanceSupporterCard>("maintenance-supporter-card")!;
  el.setConfig({ type: "custom:maintenance-supporter-card", show_actions: true, action_style: "buttons" } as never);
  el.hass = mockHass() as never;
  await waitUntil(() => el.shadowRoot!.querySelectorAll(".doc-chip").length > 0, "chips render", { timeout: 3000 });
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 50));
  return el;
}

const rows = (el: MaintenanceSupporterCard) => [...el.shadowRoot!.querySelectorAll<HTMLElement>(".task-item")];
const rowOf = (el: MaintenanceSupporterCard, name: string) =>
  rows(el).find((r) => r.querySelector(".task-name")?.textContent?.includes(name))!;
const chipTexts = (row: HTMLElement) =>
  [...row.querySelectorAll<HTMLElement>(".doc-chip")].map((c) => c.textContent?.trim() || "");

function overlaps(a: DOMRect, b: DOMRect): boolean {
  return a.width > 0 && b.width > 0 && a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1;
}

/** Every pair of row parts that draw over each other. */
function collisions(el: MaintenanceSupporterCard): string[] {
  const out: string[] = [];
  for (const row of rows(el)) {
    const name = row.querySelector(".task-name")?.textContent?.trim();
    const parts = [".task-info", ".doc-chips", ".task-due", ".complete-btn-text"]
      .map((sel) => [sel, row.querySelector<HTMLElement>(sel)] as const)
      .filter(([, node]) => node);
    for (let i = 0; i < parts.length; i++) {
      for (let j = i + 1; j < parts.length; j++) {
        if (overlaps(parts[i][1]!.getBoundingClientRect(), parts[j][1]!.getBoundingClientRect())) {
          out.push(`${name}: ${parts[i][0]} overlaps ${parts[j][0]}`);
        }
      }
    }
  }
  return out;
}

describe("card document chips in a narrow column", () => {
  for (const width of [360, 400, 480]) {
    it(`${width} px: no part of a row draws over another`, async () => {
      await setViewport({ width: 1440, height: 900 });
      try {
        const el = await mountInColumn(width);
        expect(collisions(el)).to.deep.equal([]);
      } finally {
        await setViewport({ width: 800, height: 600 });
      }
    });

    it(`${width} px: nothing sits between a task and its due label — the name keeps the room`, async () => {
      await setViewport({ width: 1440, height: 900 });
      try {
        const el = await mountInColumn(width);
        for (const name of ["Replace the PTFE tubes", "Replace filter", "Clean the print bed", "Check the tyre pressure"]) {
          const row = rowOf(el, name);
          const info = row.querySelector<HTMLElement>(".task-info")!.getBoundingClientRect();
          const due = row.querySelector<HTMLElement>(".task-due")!.getBoundingClientRect();
          // the row's own 10 px gap, no chip column in between
          expect(due.left - info.right, name).to.be.at.most(12);
        }
      } finally {
        await setViewport({ width: 800, height: 600 });
      }
    });
  }

  it("completion photos are no reference documents: no chips for them", async () => {
    const el = await mountInColumn(480);
    expect(chipTexts(rowOf(el, "Clean the pond pump"))).to.deep.equal([]);
  });

  it("shows at most two chips and counts the rest", async () => {
    const el = await mountInColumn(900);
    expect(chipTexts(rowOf(el, "Clean the print bed"))).to.deep.equal(["Print bed cleaning guide.pdf", "Spare parts list.pdf", "+1"]);
  });

  it("a long document name ends in an ellipsis", async () => {
    const el = await mountInColumn(360);
    const label = rowOf(el, "Replace filter").querySelector<HTMLElement>(".doc-chip span")!;
    const cs = getComputedStyle(label);
    expect(cs.textOverflow).to.equal("ellipsis");
    expect(cs.overflow).to.equal("hidden");
    expect(label.scrollWidth).to.be.greaterThan(label.clientWidth);
  });

  it("a wide card keeps the chips beside the task, on one line", async () => {
    await setViewport({ width: 1440, height: 900 });
    try {
      const el = await mountInColumn(900);
      const row = rowOf(el, "Replace filter");
      const name = row.querySelector<HTMLElement>(".task-name")!.getBoundingClientRect();
      const chip = row.querySelector<HTMLElement>(".doc-chip")!.getBoundingClientRect();
      expect(chip.left).to.be.greaterThan(name.left + 100);
      expect(chip.top).to.be.lessThan(name.bottom + 20);
      expect(collisions(el)).to.deep.equal([]);
    } finally {
      await setViewport({ width: 800, height: 600 });
    }
  });
});
