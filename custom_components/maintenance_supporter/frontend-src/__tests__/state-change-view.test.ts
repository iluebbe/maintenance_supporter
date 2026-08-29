/**
 * #141 round 2: the recorder fallback series re-expressed in the trigger's
 * own terms — a latch draws "alert held" (0/1), a counter draws the stepped
 * change count since the last service, both honouring the #136 hold time.
 */

import { expect } from "@open-wc/testing";
import { stateChangeView, binaryLevel } from "../renderers/sparkline.js";
import type { ChartPoint } from "../components/trigger-chart";

const H = 3600_000;
const NOW = 100 * H;

/** Held segments → the doubled step series the history fallback produces. */
function steps(segs: [number, number][]): ChartPoint[] {
  const out: ChartPoint[] = [];
  for (const [ts, val] of segs) {
    const last = out[out.length - 1];
    if (last && last.val !== val) out.push({ ts, val: last.val });
    out.push({ ts, val });
  }
  return out;
}

describe("binaryLevel", () => {
  it("maps HA binary states and rejects the rest", () => {
    expect(binaryLevel("on")).to.equal(1);
    expect(binaryLevel(" OFF ")).to.equal(0);
    expect(binaryLevel("open")).to.equal(1);
    expect(binaryLevel("heat")).to.equal(null);
    expect(binaryLevel(undefined)).to.equal(null);
  });
});

describe("stateChangeView — latch (target 1 + to-state)", () => {
  it("a switch watched for OFF that is on all week with short off blips reads as flat 0", () => {
    // on from t=0, off for 2 minutes at t=10h and t=40h, on otherwise
    const pts = steps([[0, 1], [10 * H, 0], [10 * H + 120_000, 1], [40 * H, 0], [40 * H + 120_000, 1]]);
    const view = stateChangeView(pts, { trigger_to_state: "off", trigger_target_changes: 1, trigger_for_minutes: 5 }, { since: null, current: 0, now: NOW });
    expect(view!.mode).to.equal("alarm");
    expect(view!.points.every((p) => p.val === 0)).to.equal(true);
    expect(view!.points[view!.points.length - 1].ts).to.equal(NOW);
  });

  it("an OFF period longer than the hold time shows as alert = 1", () => {
    const pts = steps([[0, 1], [10 * H, 0], [20 * H, 1]]);
    const view = stateChangeView(pts, { trigger_to_state: "off", trigger_target_changes: 1, trigger_for_minutes: 5 }, { since: null, current: 0, now: NOW });
    const vals = view!.points.map((p) => p.val);
    expect(vals).to.include(1);
    expect(view!.points.find((p) => p.ts === 10 * H && p.val === 1)).to.exist;
    expect(view!.points[view!.points.length - 1].val).to.equal(0);
  });

  it("a problem sensor (to-state on) equals the raw line", () => {
    const pts = steps([[0, 0], [5 * H, 1], [30 * H, 0]]);
    const view = stateChangeView(pts, { trigger_to_state: "on", trigger_target_changes: 1 }, { since: null, current: 0, now: NOW });
    expect(view!.points.map((p) => p.val)).to.deep.equal([0, 0, 1, 1, 0, 0]);
  });
});

describe("stateChangeView — counter", () => {
  it("steps up once per held matching transition since the last service", () => {
    // off→on at 2h, 4h (blip 1 min), 6h, 8h; service at 3h
    const pts = steps([[0, 0], [2 * H, 1], [3 * H, 0], [4 * H, 1], [4 * H + 60_000, 0], [6 * H, 1], [7 * H, 0], [8 * H, 1]]);
    const view = stateChangeView(
      pts,
      { trigger_from_state: "off", trigger_to_state: "on", trigger_target_changes: 10, trigger_for_minutes: 5 },
      { since: 3 * H, current: 2, now: NOW },
    );
    expect(view!.mode).to.equal("count");
    const last = view!.points[view!.points.length - 1];
    expect(last.val).to.equal(2); // 6h and 8h count; the 4h blip and the pre-service 2h do not
    expect(view!.points[0]).to.deep.equal({ ts: 3 * H, val: 0 });
  });

  it("anchors to the live count when earlier transitions predate the window", () => {
    const pts = steps([[50 * H, 0], [60 * H, 1], [70 * H, 0], [80 * H, 1]]);
    const view = stateChangeView(pts, { trigger_target_changes: 10 }, { since: 10 * H, current: 7, now: NOW });
    expect(view!.points[0].val).to.equal(4); // 7 live − 3 seen in the window
    expect(view!.points[view!.points.length - 1].val).to.equal(7);
  });

  it("gives up on from/to states the fallback cannot express", () => {
    const pts = steps([[0, 0], [1 * H, 1]]);
    expect(stateChangeView(pts, { trigger_to_state: "heat", trigger_target_changes: 3 }, { since: null, current: 0, now: NOW })).to.equal(null);
  });
});
