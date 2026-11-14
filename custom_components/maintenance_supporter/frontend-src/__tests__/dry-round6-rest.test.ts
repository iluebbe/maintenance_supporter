/**
 * DRY audit round 6 (2026-10-30), the rest, done with round 7 (2026-11-07):
 *
 * FE6-A4  a quick completion the server could not undo closed the quick
 *         actions silently; the card said "Quickly marked complete".
 * FE6-A5  the quick actions named the task without its calendar events and
 *         its trigger detail, which the row that opened them showed.
 * FE6-A6  the battery fleet's dispose field did nothing on a bad count; the
 *         parts section marked it.
 * FE6-B4  who completed an entry through a shared device, written twice.
 * FE6-B7  six Enter / Space handlers beside clickOnActivationKey.
 * FE6-B8  Enter commits / Escape cancels, written into each inline field.
 * FE6-B11 the 40-character cut, written twice.
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import "../components/task-quick-actions-dialog.js";
import type { MaintenanceTaskQuickActionsDialog } from "../components/task-quick-actions-dialog";
import { taskTitleText } from "../helpers/event-titles.js";
import { commitOnEnter, onActivationKey, positiveCount } from "../helpers/keyboard.js";
import { completedByLabel } from "../helpers/object-history.js";
import { ellipsize, t } from "../styles.js";
import { DEFAULT_SETTINGS_RESPONSE, createMockHass } from "./_test-utils.js";

const TASK = {
  id: "t1", name: "Put the bins out", type: "custom", schedule_type: "time_based", interval_days: 7, warning_days: 1, enabled: true,
  status: "due_soon", days_until_due: 1, quick_complete_defaults: {}, next_event_titles: ["Paper", "Glass"], trigger_detail: null,
};

async function quickActions(quickAnswer: Record<string, unknown>) {
  const wire = {
    ...TASK, archived: false, is_done: false, next_due: "2026-11-10", last_performed: null, trigger_active: false,
    times_performed: 0, total_cost: 0, average_duration: null, history: [], checklist: [],
  };
  const mock = createMockHass({
    settingsResponse: DEFAULT_SETTINGS_RESPONSE as never,
    handlers: {
      "maintenance_supporter/object": () => ({ entry_id: "e1", object: { id: "o1", name: "Bins" }, tasks: [wire] }),
      "maintenance_supporter/task/quick_complete": () => quickAnswer,
    },
  });
  (mock.hass as Record<string, unknown>).user = { id: "admin", is_admin: true };
  const el = await fixture<MaintenanceTaskQuickActionsDialog>(html`<maintenance-task-quick-actions-dialog .hass=${mock.hass}></maintenance-task-quick-actions-dialog>`);
  await el.openFor("e1", "t1");
  await el.updateComplete;
  return el;
}

describe("FE6-A4 / FE6-A5: the quick actions", () => {
  it("say what a quick completion did when there is nothing to undo, as the card does", async () => {
    const el = await quickActions({ success: true, undo: false });
    const said: string[] = [];
    el.addEventListener("hass-notification", (e) => said.push((e as CustomEvent).detail.message));
    await (el as unknown as { _onQuickComplete(): Promise<void> })._onQuickComplete();
    expect(said).to.deep.equal([t("quick_complete_success", "en")]);
  });

  it("name the task with its calendar events, like the row that opened them", async () => {
    const el = await quickActions({ success: true, undo: true });
    await waitUntil(() => el.shadowRoot!.querySelector(".task-name"), "header", { timeout: 2000 });
    expect(el.shadowRoot!.querySelector(".task-name")!.textContent!.replace(/\s+/g, " ").trim()).to.equal("Put the bins out · Paper, Glass");
    expect(taskTitleText("Buy medicine", null, "Trulicity: 3 left")).to.equal("Buy medicine · Trulicity: 3 left");
    expect(taskTitleText("Bins", ["Paper", ""], "")).to.equal("Bins · Paper");
  });
});

describe("FE6-A6 / FE6-B7 / FE6-B8: the keyboard and the inline fields", () => {
  const key = (k: string) => new KeyboardEvent("keydown", { key: k, cancelable: true });

  it("Enter and Space act, other keys do not; the default is prevented", () => {
    let acted = 0;
    const handler = onActivationKey(() => acted++);
    const enter = key("Enter");
    handler(enter);
    handler(key(" "));
    handler(key("a"));
    expect(acted).to.equal(2);
    expect(enter.defaultPrevented).to.equal(true);
  });

  it("an inline field commits on Enter and cancels on Escape", () => {
    const seen: string[] = [];
    const handler = commitOnEnter(() => seen.push("commit"), () => seen.push("cancel"));
    handler(key("Enter"));
    handler(key("Escape"));
    handler(key("1"));
    expect(seen).to.deep.equal(["commit", "cancel"]);
  });

  it("a count is a number above zero", () => {
    expect(positiveCount("2")).to.equal(2);
    expect(positiveCount("0.5")).to.equal(0.5);
    for (const bad of ["", "0", "-1", "abc"]) expect(positiveCount(bad), bad).to.equal(null);
  });
});

describe("FE6-B4 / FE6-B11: two small texts", () => {
  it("who completed an entry, and through which shared device", () => {
    const names: Record<string, string> = { u1: "Anna", tab: "Kitchen tablet" };
    const name = (id: string) => names[id] ?? null;
    expect(completedByLabel({ completedBy: "u1", completedVia: null }, name, "en")).to.equal("Anna");
    expect(completedByLabel({ completedBy: "u1", completedVia: "tab" }, name, "en")).to.equal(
      t("completed_via", "en").replace("{person}", "Anna").replace("{device}", "Kitchen tablet"),
    );
    expect(completedByLabel({ completedBy: null, completedVia: "tab" }, name, "en")).to.equal(null);
  });

  it("a long text is cut to 40 characters, a short one is whole", () => {
    expect(ellipsize("short")).to.equal("short");
    const long = "x".repeat(50);
    expect(ellipsize(long)).to.equal(`${"x".repeat(39)}…`);
    expect(ellipsize(long).length).to.equal(40);
  });
});
