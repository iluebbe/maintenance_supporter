/** A pushed object change (subscription delta) must also move what the
 *  delta does NOT carry (audit 2026-08-29):
 *
 *   - the KPI row + budget card (`_stats` / `_budget`) come from their own
 *     endpoints and were only refreshed by _loadData — a completion pushed
 *     from the Lovelace card left the overview counts frozen;
 *   - the open task's FULL history is a separate fetch, and the truncated
 *     list payload never wins the "longer list" comparison, so a pushed
 *     completion stayed invisible on the task's timeline.
 */

import { expect, waitUntil } from "@open-wc/testing";
import { DEFAULT_SETTINGS_RESPONSE } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, task } from "./_panel-utils.js";

type PanelPriv = HTMLElement & {
  updateComplete: Promise<unknown>;
  _stats: { overdue: number } | null;
  _budget: { monthly_spent: number } | null;
  _fullHistory: { entryId: string; taskId: string; entries: unknown[] } | null;
};

function hist(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    timestamp: `2026-01-${String(i + 1).padStart(2, "0")}T10:00:00`,
    type: "completed",
  }));
}

async function settle(el: { updateComplete: Promise<unknown> }) {
  await new Promise((r) => setTimeout(r, 30));
  await el.updateComplete;
}

describe("panel push refresh (KPIs + open-task history)", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
    localStorage.setItem("msp-overview-tab", "dashboard");
  });
  afterEach(() => {
    localStorage.clear();
    history.replaceState(null, "", window.location.pathname);
  });

  it("a delta refetches statistics + budget so the KPI row moves", async () => {
    let statsCalls = 0;
    let budgetCalls = 0;
    const { el: raw, subscriptions } = await mountPanel(
      [obj("e1", [task({ name: "Alpha" })])],
      {
        "maintenance_supporter/statistics": () => {
          statsCalls++;
          return { total_objects: 1, total_tasks: 1, overdue: statsCalls, due_soon: 0, triggered: 0, total_cost: 0 };
        },
        "maintenance_supporter/budget_status": () => {
          budgetCalls++;
          return {
            monthly_budget: 100, monthly_spent: budgetCalls * 10, yearly_budget: 0, yearly_spent: 0,
            alert_threshold_pct: 80, currency_symbol: "€",
          };
        },
      },
    );
    const el = raw as PanelPriv;
    const sub = subscriptions.find((s) => s.msg.type === "maintenance_supporter/subscribe")!;
    const statsBefore = statsCalls;
    const budgetBefore = budgetCalls;

    // A no-op event changes nothing and must not hit the endpoints.
    sub.push({ delta: [], removed: [] });
    await settle(el);
    expect(statsCalls).to.equal(statsBefore);
    expect(budgetCalls).to.equal(budgetBefore);

    sub.push({ delta: [obj("e1", [task({ id: "t1", name: "Alpha", status: "overdue" })])], removed: [] });
    await waitUntil(() => statsCalls > statsBefore, "statistics refetched after the delta");
    await waitUntil(() => budgetCalls > budgetBefore, "budget refetched after the delta");
    await waitUntil(() => el._stats?.overdue === statsCalls, "KPI state carries the new numbers");
    expect(el._budget?.monthly_spent).to.equal(budgetCalls * 10);
  });

  it("a delta for the open task's object refetches its full history", async () => {
    let historyLen = 3;
    history.replaceState(null, "", `${window.location.pathname}?entry_id=e1&task_id=t1`);
    const { el: raw, subscriptions, sent } = await mountPanel(
      [obj("e1", [task({ name: "Alpha", history: hist(1) })])],
      { "maintenance_supporter/task/history": () => ({ history: hist(historyLen) }) },
    );
    const el = raw as PanelPriv;
    await waitUntil(() => el._fullHistory?.entries.length === 3, "full history loaded on open");
    const sub = subscriptions.find((s) => s.msg.type === "maintenance_supporter/subscribe")!;
    const countHistory = () => sent.filter((m) => m.type === "maintenance_supporter/task/history").length;

    // Another object changes — the open task's history is untouched.
    const before = countHistory();
    sub.push({ delta: [obj("e2", [task({ name: "Elsewhere" })], "Other")], removed: [] });
    await settle(el);
    expect(countHistory()).to.equal(before);

    // The open task's object changes (a pushed completion): refetch.
    historyLen = 4;
    sub.push({ delta: [obj("e1", [task({ id: "t1", name: "Alpha", history: hist(2) })])], removed: [] });
    await waitUntil(() => countHistory() > before, "task/history refetched after the delta");
    await waitUntil(() => el._fullHistory?.entries.length === 4, "full history carries the pushed completion");
    expect(el._fullHistory?.taskId).to.equal("t1");
  });

  // Bug review 2026-09-04: both refetch gates keyed on `_view === "task"`.
  // A task docked in the wide-dashboard split pane (the view stays
  // "overview") kept its FIRST full history for as long as it was docked —
  // a pushed completion moved the row on the left but not the timeline on
  // the right, and a plain data refresh did not help either.
  describe("docked split-pane detail", () => {
    async function dock(historyLen: () => number) {
      const r = await mountPanel(
        [obj("e1", [task({ name: "Alpha", history: hist(1) })])],
        {
          "maintenance_supporter/settings": () => DEFAULT_SETTINGS_RESPONSE,
          "maintenance_supporter/task/history": () => ({ history: hist(historyLen()) }),
        },
      );
      const el = r.el as PanelPriv & { _view: string; _loadData: () => Promise<void> };
      el.style.width = "1700px";
      await new Promise((res) => setTimeout(res, 120));
      await el.updateComplete;
      const sr = el.shadowRoot!;
      await waitUntil(() => !!sr.querySelector(".split-pane"), "split pane rendered");
      (sr.querySelector(".task-row .cell.task-name") as HTMLElement).click();
      await el.updateComplete;
      await waitUntil(() => !!sr.querySelector(".split-pane maintenance-task-detail-view"), "detail docked");
      expect(el._view, "docked, not navigated").to.equal("overview");
      await waitUntil(() => el._fullHistory?.entries.length === historyLen(), "full history loaded on dock");
      const countHistory = () => r.sent.filter((m) => m.type === "maintenance_supporter/task/history").length;
      return { el, subscriptions: r.subscriptions, countHistory };
    }

    it("a delta for the docked task's object refetches its full history", async () => {
      let historyLen = 3;
      const { el, subscriptions, countHistory } = await dock(() => historyLen);
      const sub = subscriptions.find((s) => s.msg.type === "maintenance_supporter/subscribe")!;

      const before = countHistory();
      sub.push({ delta: [obj("e2", [task({ name: "Elsewhere" })], "Other")], removed: [] });
      await settle(el);
      expect(countHistory(), "another object: untouched").to.equal(before);

      historyLen = 4;
      sub.push({ delta: [obj("e1", [task({ id: "t1", name: "Alpha", history: hist(2) })])], removed: [] });
      await waitUntil(() => countHistory() > before, "task/history refetched for the docked task");
      await waitUntil(() => el._fullHistory?.entries.length === 4, "docked timeline carries the pushed completion");
      expect(el._fullHistory?.taskId).to.equal("t1");
    });

    it("a data refresh refetches the docked task's full history", async () => {
      let historyLen = 3;
      const { el, countHistory } = await dock(() => historyLen);
      const before = countHistory();
      historyLen = 5;
      await el._loadData();
      await waitUntil(() => countHistory() > before, "task/history refetched by _loadData");
      await waitUntil(() => el._fullHistory?.entries.length === 5, "docked timeline follows the refresh");
    });
  });
});
