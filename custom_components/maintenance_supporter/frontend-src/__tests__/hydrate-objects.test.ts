/** Compact-payload hydration (perf wave 2, item 3).
 *
 *  The server strips None/[]/{}-valued keys when the client passes
 *  `compact: true`; hydrateObjects restores the list/dict-typed keys the
 *  UI iterates. The key tables are pinned against the server builder by
 *  tests/test_ws_compact_mode.py.
 */

import { expect } from "@open-wc/testing";
import { hydrateObjects } from "../helpers/hydrate-objects.js";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

type AnyDict = Record<string, unknown>;

/** Client-side mirror of the server's compact strip, for building fixtures. */
function strip(d: AnyDict): AnyDict {
  const out: AnyDict = {};
  for (const [k, v] of Object.entries(d)) {
    const empty = v === null
      || (Array.isArray(v) && v.length === 0)
      || (typeof v === "object" && v !== null && !Array.isArray(v) && Object.keys(v).length === 0);
    if (!empty) out[k] = v;
  }
  return out;
}

function compactObject(o: AnyDict): AnyDict {
  return {
    ...strip(o),
    object: strip(o.object as AnyDict),
    tasks: (o.tasks as AnyDict[]).map(strip),
  };
}

describe("hydrateObjects", () => {
  beforeEach(() => resetTaskSeq());

  it("restores the iterated container keys on stripped tasks", () => {
    const full = obj("e1", [task({ name: "T", history: [], checklist: [], labels: [] })]) as unknown as AnyDict;
    const compact = compactObject(full);
    const t0 = (compact.tasks as AnyDict[])[0];
    expect(t0.history, "fixture really stripped").to.equal(undefined);

    hydrateObjects([compact]);
    expect(t0.history).to.deep.equal([]);
    expect(t0.checklist).to.deep.equal([]);
    expect(t0.labels).to.deep.equal([]);
    expect(t0.assignee_pool).to.deep.equal([]);
    expect(t0.required_completion_fields).to.deep.equal([]);
    expect(t0.checklist_progress).to.deep.equal({});
  });

  it("restores response/object level containers", () => {
    const bare: AnyDict = { entry_id: "e2", object: { id: "x", name: "N" } };
    hydrateObjects([bare]);
    expect(bare.tasks).to.deep.equal([]);
    expect(bare.parts).to.deep.equal([]);
    expect((bare.object as AnyDict).manual_docs).to.deep.equal([]);
  });

  it("leaves populated values untouched", () => {
    const full = obj("e3", [task({ name: "Keep", checklist: ["a"] })]) as unknown as AnyDict;
    const compact = compactObject(full);
    hydrateObjects([compact]);
    expect(((compact.tasks as AnyDict[])[0].checklist as string[])).to.deep.equal(["a"]);
  });
});

describe("panel on compact payloads", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
    localStorage.setItem("msp-overview-tab", "dashboard");
  });

  it("renders rows and opens the task detail from a stripped payload", async () => {
    const full = obj("e1", [task({ name: "Compact Task" })]) as unknown as AnyDict;
    const compact = compactObject(full);
    const { el, sent } = await mountPanel([], {
      "maintenance_supporter/objects": () => ({ objects: [compact] }),
    });
    // The panel opted in…
    const req = sent.find((m) => m.type === "maintenance_supporter/objects");
    expect(req?.compact, "panel requests compact payloads").to.equal(true);
    // …and the stripped payload renders like a full one.
    const names = [...sr(el).querySelectorAll(".task-name")].map((n) => n.textContent?.trim());
    expect(names).to.include("Compact Task");

    // Task detail (touches history/checklist and friends) survives.
    (el as unknown as { _showTask: (e: string, t: string) => void })._showTask(
      "e1",
      (compact.tasks as AnyDict[])[0].id as string,
    );
    await new Promise((r) => setTimeout(r, 30));
    await el.updateComplete;
    expect(sr(el).querySelector(".task-header"), "task detail rendered").to.exist;
  });
});
