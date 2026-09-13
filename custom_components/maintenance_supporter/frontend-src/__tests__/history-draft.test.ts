/**
 * helpers/history-draft — the ONE builder behind the history-edit dialog's
 * draft (DRY round 2026-09: the panel, the quick-actions dialog, the
 * calendar card and the strategy shim each copied the field list, and every
 * new field had to land in all four).
 */

import { expect } from "@open-wc/testing";
import { buildHistoryEntryDraft, loadHistoryEntryDraft } from "../helpers/history-draft.js";
import type { HistoryEntry } from "../types";
import { createMockHass } from "./_test-utils.js";

const SLOTS = [{ id: "cold", name: "Water cold", unit: "m³" }];

describe("buildHistoryEntryDraft", () => {
  it("copies every editable field and folds the legacy photo scalar in", () => {
    const entry: HistoryEntry = {
      timestamp: "2026-03-01T10:00:00",
      type: "completed",
      notes: "done",
      cost: 12.5,
      duration: 30,
      completed_by: "u1",
      used_parts: [{ part_id: "p1", quantity: 2 }],
      photo_doc_id: "legacy",
      photo_doc_ids: ["ph1"],
      reading_value: 42,
      reading_values: [{ id: "cold", name: "Water cold", unit: "m³", value: 125 }],
    };
    const task = { type: "reading", reading_unit: "kWh", readings: SLOTS };
    expect(buildHistoryEntryDraft("e1", "t1", entry, task)).to.deep.equal({
      entry_id: "e1",
      task_id: "t1",
      original_timestamp: "2026-03-01T10:00:00",
      type: "completed",
      timestamp: "2026-03-01T10:00:00",
      notes: "done",
      cost: 12.5,
      duration: 30,
      completed_by: "u1",
      used_parts: [{ part_id: "p1", quantity: 2 }],
      photo_doc_ids: ["legacy", "ph1"],
      reading_value: 42,
      reading_values: [{ id: "cold", name: "Water cold", unit: "m³", value: 125 }],
      readings: SLOTS,
      task_type: "reading",
      reading_unit: "kWh",
    });
  });

  it("nulls what the entry does not carry and tolerates a raw record / missing task", () => {
    const draft = buildHistoryEntryDraft("e1", "t1", { timestamp: "2026-01-01T00:00:00", type: "skipped" }, null);
    expect(draft.notes).to.equal(null);
    expect(draft.cost).to.equal(null);
    expect(draft.duration).to.equal(null);
    expect(draft.completed_by).to.equal(null);
    expect(draft.used_parts).to.equal(null);
    expect(draft.photo_doc_ids).to.deep.equal([]);
    expect(draft.reading_value).to.equal(null);
    expect(draft.reading_values).to.deep.equal([]);
    expect(draft.readings).to.deep.equal([]);
    expect(draft.task_type).to.equal(null);
    expect(draft.reading_unit).to.equal(null);
    // A record without a type still opens as a completion.
    expect(buildHistoryEntryDraft("e1", "t1", { timestamp: "x" }, undefined).type).to.equal("completed");
  });
});

describe("loadHistoryEntryDraft", () => {
  const object = {
    object: { name: "Flat" },
    tasks: [
      {
        id: "t1",
        type: "reading",
        reading_unit: "kWh",
        readings: SLOTS,
        history: [
          { timestamp: "2026-01-01T10:00:00", type: "completed", notes: "first" },
          { timestamp: "2026-02-01T10:00:00", type: "completed", notes: "second", cost: 3 },
        ],
      },
    ],
  };

  it("fetches the object and builds the draft of the entry stamped with the timestamp", async () => {
    const { hass, sent } = createMockHass({ handlers: { "maintenance_supporter/object": () => object } });
    const draft = await loadHistoryEntryDraft(hass, "e1", "t1", "2026-02-01T10:00:00");
    expect(sent.map((m) => m.type)).to.deep.equal(["maintenance_supporter/object"]);
    expect(sent[0].entry_id).to.equal("e1");
    expect(draft?.notes).to.equal("second");
    expect(draft?.cost).to.equal(3);
    expect(draft?.original_timestamp).to.equal("2026-02-01T10:00:00");
    expect(draft?.task_type).to.equal("reading");
    expect(draft?.readings).to.deep.equal(SLOTS);
  });

  it("resolves null when the task or the entry is gone, and rejects on a WS failure", async () => {
    const { hass } = createMockHass({ handlers: { "maintenance_supporter/object": () => object } });
    expect(await loadHistoryEntryDraft(hass, "e1", "t1", "2030-01-01T00:00:00")).to.equal(null);
    expect(await loadHistoryEntryDraft(hass, "e1", "nope", "2026-02-01T10:00:00")).to.equal(null);
    const failing = createMockHass({ handlers: { "maintenance_supporter/object": () => { throw { code: "not_found", message: "Object not found" }; } } });
    let rejected = false;
    try {
      await loadHistoryEntryDraft(failing.hass, "e1", "t1", "2026-02-01T10:00:00");
    } catch {
      rejected = true;
    }
    expect(rejected, "a WS failure propagates so the caller can fall back").to.be.true;
  });
});
