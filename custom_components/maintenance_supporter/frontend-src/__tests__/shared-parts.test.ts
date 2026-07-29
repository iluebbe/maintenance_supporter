/**
 * Shared spare-part pools (#111) across the surfaces that touch them.
 *
 * Three robot vacuums, one box of dust bags: a task's `consumes_parts` link may
 * carry an `entry_id` naming the object that OWNS the pool. Two things have to
 * hold everywhere, and both are failures you cannot see if you only test the
 * happy own-part path:
 *
 *   1. a foreign link renders with its owner's name — resolving `part_id`
 *      against the task's own object alone finds nothing and renders a blank,
 *      which reads as "consumes nothing";
 *   2. `entry_id` is written for foreign picks and ONLY for foreign picks —
 *      emitting it for own parts would rewrite every existing task, dropping it
 *      on a foreign one silently decrements the wrong inventory (or none).
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/complete-dialog.js";
import "../components/task-dialog.js";
import type { MaintenanceCompleteDialog } from "../components/complete-dialog";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import {
  describePartLink,
  partLinkKey,
  partsForCompletion,
  resolvePartLink,
} from "../helpers/shared-parts.js";
import { createMockHass } from "./_test-utils.js";

const VACUUM = "entry_vacuum";
const SHELF = "entry_shelf";

const BAGS = { id: "part_bags", name: "Dust bags", unit: "pcs", stock: 6, storage_location: "Rack 3" };
const BRUSH = { id: "part_brush", name: "Side brush", unit: "pcs", stock: 2 };

/** Two objects: the vacuum owns a brush, the shelf owns the shared bag box. */
const OBJECTS = [
  {
    entry_id: VACUUM,
    object: { name: "Vacuum" },
    parts: [BRUSH],
  },
  {
    entry_id: SHELF,
    object: { name: "Shelf" },
    parts: [BAGS],
  },
] as any;

const OWN_LINK = { part_id: BRUSH.id, quantity: 1 };
const FOREIGN_LINK = { part_id: BAGS.id, quantity: 2, entry_id: SHELF };

// ─── resolution: the layer every surface renders through ────────────────────

describe("shared-parts resolution", () => {
  it("names the owning object for a foreign link and leaves an own link alone", () => {
    const foreign = resolvePartLink(FOREIGN_LINK, VACUUM, OBJECTS, "en");
    expect(foreign.foreign, "recognised as foreign").to.be.true;
    expect(foreign.ownerName).to.equal("Shelf");
    expect(foreign.label).to.equal("Dust bags (Shelf)");

    const own = resolvePartLink(OWN_LINK, VACUUM, OBJECTS, "en");
    expect(own.foreign).to.be.false;
    expect(own.ownerName, "an own part names no owner").to.equal("");
    expect(own.label, "own label is untouched by the feature").to.equal("Side brush");
  });

  it("never renders a blank for a link that resolves to nothing", () => {
    // The regression this whole helper exists for: the old lookups searched the
    // task's own parts only, found nothing, and produced "".
    const gonePart = resolvePartLink({ part_id: "vanished", quantity: 1, entry_id: SHELF }, VACUUM, OBJECTS, "en");
    expect(gonePart.label).to.equal("Unknown part (Shelf)");

    const goneOwner = resolvePartLink({ part_id: BAGS.id, quantity: 1, entry_id: "deleted_entry" }, VACUUM, OBJECTS, "en");
    expect(goneOwner.label, "no owner left to name, but still not blank").to.equal("Unknown part");

    for (const link of [gonePart, goneOwner]) {
      expect(link.label.trim().length, "label is never empty").to.be.greaterThan(0);
    }
  });

  it("describes a foreign link with owner, stock and location on one line", () => {
    expect(describePartLink(FOREIGN_LINK, VACUUM, OBJECTS, "en"))
      .to.equal("2× Dust bags (Shelf) (6 pcs) — Rack 3");
    expect(describePartLink(OWN_LINK, VACUUM, OBJECTS, "en"))
      .to.equal("1× Side brush (2 pcs)");
  });

  it("keys a link by the (entry_id, part_id) pair, not the id alone", () => {
    // The battery fleet mints deterministic part ids (`batt_aa`), so the same
    // id genuinely exists on two objects — one key would merge two pools.
    expect(partLinkKey({ part_id: "batt_aa" })).to.not.equal(
      partLinkKey({ part_id: "batt_aa", entry_id: SHELF }),
    );
  });

  it("offers own parts plus only the shared pools the task actually links to", () => {
    const offered = partsForCompletion(
      { consumes_parts: [OWN_LINK, FOREIGN_LINK] },
      VACUUM,
      OBJECTS,
      "en",
    );
    expect(offered.map((p) => p.id)).to.deep.equal([BRUSH.id, BAGS.id]);
    expect(offered[0].entry_id, "own part carries no entry_id").to.equal(undefined);
    expect(offered[1].entry_id).to.equal(SHELF);
    expect(offered[1].owner_name).to.equal("Shelf");

    // A task with no foreign link sees exactly its own inventory — the shelf's
    // box is not dumped into every object's completion dialog.
    const ownOnly = partsForCompletion({ consumes_parts: [OWN_LINK] }, VACUUM, OBJECTS, "en");
    expect(ownOnly.map((p) => p.id)).to.deep.equal([BRUSH.id]);
  });
});

// ─── the completion dialog: the round trip that must not lose entry_id ──────

async function mountComplete(consumesParts: Array<Record<string, unknown>>) {
  const { hass, sent } = createMockHass({
    handlers: { "maintenance_supporter/task/complete": () => ({ success: true }) },
  });
  const el = await fixture<MaintenanceCompleteDialog>(html`
    <maintenance-complete-dialog
      .hass=${hass}
      .entryId=${VACUUM}
      .taskId=${"task1"}
      .taskName=${"Service"}
      .lang=${"en"}
      .parts=${partsForCompletion({ consumes_parts: consumesParts as any }, VACUUM, OBJECTS, "en")}
      .consumesParts=${consumesParts as any}
    ></maintenance-complete-dialog>
  `);
  el.open();
  await el.updateComplete;
  return { el, sent };
}

function complete(el: MaintenanceCompleteDialog) {
  const buttons = [...el.shadowRoot!.querySelectorAll(".dialog-actions ha-button")];
  (buttons[buttons.length - 1] as HTMLElement).click();
}

describe("complete-dialog with a shared pool", () => {
  it("shows the owning object on the foreign row and nothing extra on the own row", async () => {
    const { el } = await mountComplete([OWN_LINK, FOREIGN_LINK]);
    const rows = [...el.shadowRoot!.querySelectorAll(".used-part-row")];
    expect(rows.length, "own part + linked foreign pool").to.equal(2);

    expect(rows[0].textContent).to.contain("Side brush");
    expect(rows[0].querySelector(".used-part-owner"), "own row names no owner").to.be.null;

    expect(rows[1].textContent).to.contain("Dust bags");
    expect(rows[1].querySelector(".used-part-owner")?.textContent).to.contain("Shelf");
  });

  it("sends entry_id back for the foreign link and omits it for the own one", async () => {
    const { el, sent } = await mountComplete([OWN_LINK, FOREIGN_LINK]);
    complete(el);
    await new Promise((r) => setTimeout(r, 10));

    const msg = sent.find((m) => m.type === "maintenance_supporter/task/complete")!;
    const used = msg.used_parts as Array<Record<string, unknown>>;
    expect(used).to.have.lengthOf(2);
    const own = used.find((u) => u.part_id === BRUSH.id)!;
    const foreign = used.find((u) => u.part_id === BAGS.id)!;
    expect("entry_id" in own, "an own part must stay entry_id-free").to.be.false;
    expect(foreign.entry_id, "the pool's owner survived the round trip").to.equal(SHELF);
    expect(foreign.quantity).to.equal(2);
  });

  it("keeps the two pools apart when both carry the same part id", async () => {
    // Deterministic ids (battery fleet) — a part_id-keyed selection map would
    // collapse these into one checkbox and send a single link.
    const twins = [
      { entry_id: VACUUM, object: { name: "Vacuum" }, parts: [{ id: "batt_aa", name: "AA", unit: "pcs" }] },
      { entry_id: SHELF, object: { name: "Shelf" }, parts: [{ id: "batt_aa", name: "AA", unit: "pcs" }] },
    ] as any;
    const links = [
      { part_id: "batt_aa", quantity: 1 },
      { part_id: "batt_aa", quantity: 4, entry_id: SHELF },
    ];
    const { hass, sent } = createMockHass({
      handlers: { "maintenance_supporter/task/complete": () => ({ success: true }) },
    });
    const el = await fixture<MaintenanceCompleteDialog>(html`
      <maintenance-complete-dialog
        .hass=${hass}
        .entryId=${VACUUM}
        .taskId=${"task1"}
        .lang=${"en"}
        .parts=${partsForCompletion({ consumes_parts: links as any }, VACUUM, twins, "en")}
        .consumesParts=${links as any}
      ></maintenance-complete-dialog>
    `);
    el.open();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll(".used-part-row").length, "two distinct rows").to.equal(2);

    complete(el);
    await new Promise((r) => setTimeout(r, 10));
    const used = sent.find((m) => m.type === "maintenance_supporter/task/complete")!
      .used_parts as Array<Record<string, unknown>>;
    expect(used).to.have.lengthOf(2);
    expect(used.map((u) => u.entry_id)).to.have.members([undefined, SHELF]);
  });
});

// ─── the task dialog's picker ───────────────────────────────────────────────

async function mountTaskDialog() {
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/object": () => ({ parts: [BRUSH] }),
      "maintenance_supporter/objects": () => ({ objects: OBJECTS }),
      "maintenance_supporter/task/update": () => ({}),
      "maintenance_supporter/task/create": () => ({ task_id: "t_new" }),
    },
  });
  const el = await fixture<MaintenanceTaskDialog>(html`
    <maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>
  `);
  await el.updateComplete;
  return { el, sent };
}

const BASE_TASK = {
  id: "t1",
  name: "Service",
  type: "custom",
  schedule_type: "time_based",
  interval_days: 30,
  warning_days: 7,
  enabled: true,
};

function checkboxes(el: MaintenanceTaskDialog): HTMLInputElement[] {
  return [...el.shadowRoot!.querySelectorAll<HTMLInputElement>(".consumes-row input[type=checkbox]")];
}

describe("task-dialog shared-pool picker", () => {
  it("groups other objects' parts under the owning object's name", async () => {
    const { el } = await mountTaskDialog();
    await el.openEdit(VACUUM, { ...BASE_TASK } as any);
    await el.updateComplete;

    // Own parts stay the primary list, outside the disclosure.
    const details = el.shadowRoot!.querySelector<HTMLDetailsElement>("details.shared-pools")!;
    expect(details, "shared-pool section rendered").to.exist;
    expect(details.querySelector("summary")!.textContent).to.contain("other objects");
    expect(details.querySelector(".shared-pool-owner")!.textContent!.trim()).to.equal("Shelf");
    expect(details.textContent).to.contain("Dust bags");
    // The vacuum must not offer itself as a foreign pool.
    expect(details.textContent).to.not.contain("Side brush");
  });

  it("writes entry_id for a foreign pick and never for an own one", async () => {
    const { el, sent } = await mountTaskDialog();
    await el.openEdit(VACUUM, { ...BASE_TASK } as any);
    await el.updateComplete;

    const boxes = checkboxes(el);
    // [0] = the object's own brush, [1] = the shelf's shared bag box.
    boxes[0].checked = true;
    boxes[0].dispatchEvent(new Event("change"));
    boxes[1].checked = true;
    boxes[1].dispatchEvent(new Event("change"));
    await el.updateComplete;

    await (el as any)._save();
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/update") as any;
    const links: Array<Record<string, unknown>> = msg.consumes_parts;
    expect(links).to.have.lengthOf(2);

    const own = links.find((l) => l.part_id === BRUSH.id)!;
    const foreign = links.find((l) => l.part_id === BAGS.id)!;
    expect("entry_id" in own, "own picks stay byte-identical to pre-#111").to.be.false;
    expect(foreign.entry_id).to.equal(SHELF);
  });

  it("hydrates an existing foreign link, shows it expanded, and round-trips it", async () => {
    const { el, sent } = await mountTaskDialog();
    await el.openEdit(VACUUM, { ...BASE_TASK, consumes_parts: [FOREIGN_LINK] } as any);
    await el.updateComplete;

    const details = el.shadowRoot!.querySelector<HTMLDetailsElement>("details.shared-pools")!;
    expect(details.open, "an active shared link must not hide behind a collapsed section").to.be.true;

    const boxes = checkboxes(el);
    expect(boxes[0].checked, "own brush not linked").to.be.false;
    expect(boxes[1].checked, "the shelf's box is linked").to.be.true;

    // Save without touching anything: the link must come back unchanged.
    await (el as any)._save();
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/update") as any;
    expect(msg.consumes_parts).to.deep.equal([{ part_id: BAGS.id, quantity: 2, entry_id: SHELF }]);
  });

  it("still offers the shared pools when the object owns no parts of its own", async () => {
    const { hass, sent } = createMockHass({
      handlers: {
        "maintenance_supporter/object": () => ({ parts: [] }),
        "maintenance_supporter/objects": () => ({ objects: OBJECTS }),
        "maintenance_supporter/task/update": () => ({}),
      },
    });
    const el = await fixture<MaintenanceTaskDialog>(html`
      <maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>
    `);
    await el.openEdit(VACUUM, { ...BASE_TASK } as any);
    await el.updateComplete;

    const boxes = checkboxes(el);
    expect(boxes.length, "only the shelf's box is offered").to.equal(1);
    boxes[0].checked = true;
    boxes[0].dispatchEvent(new Event("change"));
    await el.updateComplete;

    await (el as any)._save();
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/update") as any;
    expect(msg.consumes_parts).to.deep.equal([{ part_id: BAGS.id, quantity: 1, entry_id: SHELF }]);
  });
});
