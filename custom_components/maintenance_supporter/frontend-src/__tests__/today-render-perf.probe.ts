/** MEASUREMENT PROBE (not a suite — .probe.ts is outside the *.test.ts glob;
 *  run explicitly). Times the Today view's full-bucket render at 150 / 500
 *  due rows to decide whether roadmap item "Today-view virtualization" needs
 *  DOM windowing or is already carried by content-visibility.
 */
import { mountPanel, obj, resetTaskSeq, task } from "./_panel-utils.js";

function dueTasks(n: number) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const bucket = i % 3;
    out.push(task({
      name: `Task ${i}`,
      status: bucket === 0 ? "overdue" : bucket === 1 ? "due_soon" : "ok",
      days_until_due: bucket === 0 ? -3 : bucket === 1 ? 0 : 1 + (i % 7),
    }));
  }
  return out;
}

describe("today render probe", () => {
  beforeEach(() => resetTaskSeq());

  for (const N of [150, 500]) {
    it(`times tab switch + delta re-render at ${N} rows`, async () => {
      localStorage.setItem("msp-overview-tab", "dashboard");
      const objs = [];
      const PER = 25;
      for (let o = 0; o < Math.ceil(N / PER); o++) {
        objs.push(obj(`e${o}`, dueTasks(Math.min(PER, N - o * PER)), `Obj ${o}`));
      }
      const { el, subscriptions } = await mountPanel(objs);
      await el.updateComplete;

      // Tab switch: dashboard -> today (fresh bucket build + full DOM render).
      const t0 = performance.now();
      (el as any)._setOverviewTab("today");
      await el.updateComplete;
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      const switchMs = performance.now() - t0;

      // Re-render: one object's rows change via a subscription delta.
      const sub = subscriptions.find((s) => s.msg.type === "maintenance_supporter/subscribe");
      const changed = obj("e0", dueTasks(PER), "Obj 0 renamed");
      const t1 = performance.now();
      sub!.push({ delta: [changed], removed: [] });
      await el.updateComplete;
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      const deltaMs = performance.now() - t1;

      const rows = (el.shadowRoot!.querySelectorAll(".today-row") || []).length;
      console.log(`PROBE N=${N} rows=${rows} switch=${switchMs.toFixed(1)}ms delta=${deltaMs.toFixed(1)}ms`);
    });
  }
});
