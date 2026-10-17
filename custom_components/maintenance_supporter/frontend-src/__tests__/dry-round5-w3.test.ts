/**
 * DRY audit 2026-10-12, round 5, wave 3 — the frontend copies that differed.
 * Each rule now has one home; these pin what a copy got wrong:
 *
 * - Undo said "Action failed" for every refusal but two.
 * - The panel's budget tiles had no default alert threshold (never warned).
 * - The panel's count sentences and the fleet's waiting pile printed raw
 *   digits where the rest of the UI formats them.
 * - Two full-history loaders took a reply without a history list for an
 *   empty history, the object booklet fetched untruncated tasks too, and the
 *   task page's failed fetch cleared the history of the task opened since.
 * - The QR dialog's escaper left the apostrophe out; the strategy spelled
 *   the language rule out on its own.
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import "../components/object-history-section.js";
import type { MaintenanceObjectHistorySection } from "../components/object-history-section";
import { budgetLevel, DEFAULT_ALERT_THRESHOLD_PCT } from "../helpers/budget-level";
import { escapeHtml } from "../helpers/html-escape";
import { langOf } from "../helpers/locale-core";
import { reuseWaitingText } from "../helpers/part-reuse";
import { fetchTaskHistory } from "../helpers/task-history-fetch";
import { undoCompletion } from "../helpers/undo-completion";
import { countText, t } from "../styles";
import { createMockHass } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, task } from "./_panel-utils.js";

describe("wave 3: one rule per thing", () => {
  it("Undo names the server's reason, not 'Action failed'", async () => {
    const { hass } = createMockHass({
      handlers: { "maintenance_supporter/task/undo": () => { throw { code: "not_found", message: "Task not found" }; } },
    });
    const res = await undoCompletion(hass as never, "e1", "t1", "en");
    expect(res.ok).to.equal(false);
    expect(res.message).to.not.equal(t("action_error", "en"));
    expect(res.message).to.not.equal("");
  });

  it("a budget without a stored alert threshold warns at the default", () => {
    expect(DEFAULT_ALERT_THRESHOLD_PCT).to.equal(80);
    expect(budgetLevel(85, 100, undefined).level).to.equal("warning");
    expect(budgetLevel(50, 100, null).level).to.equal("ok");
    expect(budgetLevel(150, 100, 90)).to.deep.equal({ pct: 100, level: "danger" });
  });

  it("counts read in the viewer's number format", () => {
    expect(countText("templates_task_count", "templates_task_count_one", 1234, "de")).to.contain("1.234");
    expect(countText("templates_task_count", "templates_task_count_one", 1, "en")).to.equal(t("templates_task_count_one", "en"));
    expect(reuseWaitingText("charge", 1234, "de")).to.contain("1.234");
  });

  it("a reply without a history list is no answer", async () => {
    const reply = (history: unknown) => ({ connection: { sendMessagePromise: async () => history } });
    expect(await fetchTaskHistory(reply({}) as never, "e1", "t1")).to.equal(null);
    expect(await fetchTaskHistory(reply(null) as never, "e1", "t1")).to.equal(null);
    expect(await fetchTaskHistory(reply({ history: [{ type: "completed" }] }) as never, "e1", "t1")).to.deep.equal([{ type: "completed" }]);
  });

  it("the object booklet fetches truncated tasks only and keeps a window the reply did not answer", async () => {
    const { hass, sent } = createMockHass({ handlers: { "maintenance_supporter/task/history": () => ({}) } });
    const tasks = [
      { id: "t_whole", name: "Whole", history: [{ timestamp: "2026-09-01T10:00:00+00:00", type: "completed" }], history_count: 1 },
      { id: "t_cut", name: "Cut", history: [{ timestamp: "2026-08-01T10:00:00+00:00", type: "completed" }], history_count: 9 },
    ];
    const el = await fixture<MaintenanceObjectHistorySection>(html`
      <maintenance-object-history-section .hass=${hass as never} .entryId=${"e1"} .object=${{ name: "Car" } as never}
        .tasks=${tasks as never} .currencySymbol=${"€"}></maintenance-object-history-section>`);
    await waitUntil(() => el.shadowRoot!.querySelectorAll(".row").length === 2, "both windows render");
    const fetched = sent.filter((m) => m.type === "maintenance_supporter/task/history").map((m) => m.task_id);
    expect(fetched).to.deep.equal(["t_cut"]);
  });

  it("a failed fetch of the task left before keeps the history of the task open now", async () => {
    resetTaskSeq();
    const { el } = await mountPanel([obj("e1", [task(), task()])], {
      "maintenance_supporter/task/history": () => { throw { code: "unknown_error", message: "boom" }; },
    });
    const priv = el as unknown as {
      _selectedEntryId: string | null; _selectedTaskId: string | null;
      _fullHistory: { entryId: string; taskId: string; entries: unknown[] } | null;
      _fetchFullHistory(entryId: string, taskId: string): Promise<void>;
    };
    const open = { entryId: "e1", taskId: "t2", entries: [{ type: "completed" }] };
    priv._selectedEntryId = "e1";
    priv._selectedTaskId = "t2";
    priv._fullHistory = open;
    await priv._fetchFullHistory("e1", "t1");
    expect(priv._fullHistory).to.equal(open);
  });

  it("one escaper, apostrophe included; one language rule, in the lean core", () => {
    expect(escapeHtml(`<a href='x'>&"`)).to.equal("&lt;a href=&#39;x&#39;&gt;&amp;&quot;");
    expect(langOf({ language: "de" })).to.equal("de");
    expect(langOf(undefined)).to.equal("en");
  });
});
