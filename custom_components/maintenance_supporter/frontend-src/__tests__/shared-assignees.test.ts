/**
 * Who a task is meant for (helpers/assignees.ts, the twin of
 * helpers/assignees.py) and the person filters that read it.
 *
 * Discussion #110: a chore "Shared with" two people and no rotation matched
 * neither person's filter (and notified neither phone). Pins:
 *   - the rule: the responsible person, else everyone it is shared with
 *   - the panel's person filter offers and matches the people it is shared with
 *   - the calendar's user filter, upcoming and past
 *   - the card's "my tasks" saved view
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import { taskIsFor, taskUserIds } from "../helpers/assignees";
import { buildCalendarBuckets, buildPastBuckets } from "../helpers/calendar-bucket";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";
import "../maintenance-card.js";
import type { MaintenanceSupporterCard } from "../maintenance-card";

describe("assignees: who a task is meant for", () => {
  it("is the responsible person, else everyone it is shared with", () => {
    expect(taskUserIds({ responsible_user_id: "ben", assignee_pool: ["ann", "ben"] })).to.deep.equal(["ben"]);
    expect(taskUserIds({ responsible_user_id: null, assignee_pool: ["ann", "ben", "ann", ""] })).to.deep.equal(["ann", "ben"]);
    expect(taskUserIds({})).to.deep.equal([]);
    expect(taskIsFor({ assignee_pool: ["ann", "ben"] }, "ann")).to.equal(true);
    expect(taskIsFor({ responsible_user_id: "ben", assignee_pool: ["ann", "ben"] }, "ann")).to.equal(false);
    expect(taskIsFor({ assignee_pool: ["ann"] }, null)).to.equal(false);
  });
});

describe("calendar: the user filter includes shared tasks", () => {
  const TODAY = "2026-05-01";
  const calTask = (over: Record<string, unknown>) => ({
    id: "t", name: "Task", enabled: true, schedule_type: "time_based", interval_days: 30,
    status: "ok", next_due: "2026-05-02", days_until_due: 1, history: [],
    responsible_user_id: null, ...over,
  });
  const objs = (tasks: unknown[]) =>
    [{ entry_id: "e1", object: { id: "o1", name: "House" }, tasks }] as never;

  it("upcoming: shared with nobody on duty shows for each member, a rotation only for whose turn it is", () => {
    const tasks = [
      calTask({ id: "shared", assignee_pool: ["ann", "ben"] }),
      calTask({ id: "rota", assignee_pool: ["ann", "ben"], rotation_strategy: "round_robin", responsible_user_id: "ben" }),
      calTask({ id: "house" }),
    ];
    const ids = (user: string) =>
      buildCalendarBuckets(objs(tasks), TODAY, 7, user).flatMap((b) => b.events).map((e) => e.task_id).sort();
    expect([...new Set(ids("ann"))]).to.deep.equal(["shared"]);
    expect([...new Set(ids("ben"))]).to.deep.equal(["rota", "shared"]);
  });

  it("past: the same rule", () => {
    const done = [{ type: "completed", timestamp: "2026-04-28T10:00:00" }];
    const tasks = [
      calTask({ id: "shared", assignee_pool: ["ann", "ben"], history: done }),
      calTask({ id: "bens", responsible_user_id: "ben", history: done }),
    ];
    const ids = buildPastBuckets(objs(tasks), TODAY, 30, "ann").flatMap((b) => b.events).map((e) => e.task_id);
    expect(ids).to.deep.equal(["shared"]);
  });
});

describe("panel: the person filter includes shared tasks", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
    localStorage.setItem("msp-overview-tab", "dashboard");
  });
  afterEach(() => localStorage.clear());

  it("offers the people a task is shared with and lists the shared task under each", async () => {
    const { el } = await mountPanel(
      [
        obj("e1", [
          task({ name: "Clean gutters", assignee_pool: ["u-ann", "u-ben"] }),
          task({ name: "Descale kettle", responsible_user_id: "u-ann" }),
          task({ name: "Service boiler" }),
        ]),
      ],
      { "maintenance_supporter/users/list": () => ({ users: [{ id: "u-ann", name: "Ann" }, { id: "u-ben", name: "Ben" }] }) },
    );
    await new Promise((r) => setTimeout(r, 30));
    await el.updateComplete;
    const userSelect = () =>
      [...sr(el).querySelectorAll<HTMLSelectElement>("select")].find((s) => s.querySelector('option[value="current_user"]'))!;
    // Ben is responsible for nothing, but the gutters are shared with him.
    expect([...userSelect().options].map((o) => o.textContent!.trim()).slice(2)).to.deep.equal(["Ann", "Ben"]);

    const rowsFor = async (userId: string) => {
      const sel = userSelect();
      sel.value = userId;
      sel.dispatchEvent(new Event("change"));
      await el.updateComplete;
      return [...sr(el).querySelectorAll(".task-name")].map((n) => n.textContent!.trim());
    };
    const anns = await rowsFor("u-ann");
    expect(anns.some((r) => r.includes("Clean gutters"))).to.equal(true);
    expect(anns.some((r) => r.includes("Descale kettle"))).to.equal(true);
    expect(anns.some((r) => r.includes("Service boiler"))).to.equal(false);
    const bens = await rowsFor("u-ben");
    expect(bens.some((r) => r.includes("Clean gutters"))).to.equal(true);
    expect(bens.some((r) => r.includes("Descale kettle"))).to.equal(false);
  });
});

describe("card: a 'my tasks' view includes shared tasks", () => {
  it("lists a task shared with the viewer while nobody is responsible", async () => {
    const T = (id: string, name: string, extra: Record<string, unknown> = {}) =>
      ({ id, name, status: "overdue", days_until_due: -1, type: "service", ...extra });
    const objects = [{
      entry_id: "e1", object: { id: "e1", name: "House" },
      tasks: [
        T("t1", "Clean gutters", { responsible_user_id: null, assignee_pool: ["u1", "u2"] }),
        T("t2", "Mow lawn", { responsible_user_id: "u2", assignee_pool: ["u1", "u2"], rotation_strategy: "round_robin" }),
        T("t3", "Service boiler", { responsible_user_id: null }),
      ],
    }];
    const views = [{ id: "vmine", name: "Mine", filters: { status: "", user_id: "current_user", label: null, archived: false, sort_mode: "due_date", group_by: "none" } }];
    const hass = {
      language: "en",
      user: { id: "u1", name: "Ann", is_admin: true, is_owner: true },
      connection: {
        sendMessagePromise: async (msg: { type: string }) => {
          if (msg.type === "maintenance_supporter/objects") return { objects };
          if (msg.type === "maintenance_supporter/views/list") return { views };
          return { overdue: 0, due_soon: 0, triggered: 0, ok: 0, total: 0 };
        },
        subscribeMessage: async () => () => {},
      },
    };
    const el = await fixture<MaintenanceSupporterCard>(
      html`<maintenance-supporter-card .hass=${hass as never}></maintenance-supporter-card>`,
    );
    el.setConfig({ type: "custom:maintenance-supporter-card", show_actions: false, view_id: "vmine" } as never);
    const names = () => [...el.shadowRoot!.querySelectorAll(".task-name")].map((n) => n.textContent?.trim() || "");
    await waitUntil(() => names().length === 1, "view filter applied", { timeout: 2000 });
    expect(names()).to.deep.equal(["Clean gutters"]);
  });
});
