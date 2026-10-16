/**
 * D#203: a task without a due date (manual planning, sensor-only, paused)
 * showed a bare "—" in the due column. It now says when it was last done,
 * "done 23 d ago", muted so it never reads as a status; the dash stays for a
 * task never done, the ⚡ for a triggered one on the card.
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import { render } from "lit";
import { addDaysIso, haToday } from "../helpers/ha-time";
import { renderDueText } from "../renderers/progress";
import { formatLastDone } from "../styles";
import { NO_DUE_COLOR, renderStatusBadge, statusColor, statusKey } from "../renderers/status";
import "../maintenance-card.js";
import type { MaintenanceSupporterCard } from "../maintenance-card";

const daysAgo = (n: number) => addDaysIso(haToday(), -n);

describe("formatLastDone", () => {
  it("counts the days since the last completion on HA's calendar", () => {
    expect(formatLastDone(daysAgo(23), "en")).to.equal("done 23 d ago");
    expect(formatLastDone(daysAgo(1), "en")).to.equal("done 1 d ago");
    expect(formatLastDone(haToday(), "en")).to.equal("done today");
  });

  it("reads a full timestamp too", () => {
    expect(formatLastDone(`${daysAgo(5)}T10:30:00`, "en")).to.equal("done 5 d ago");
  });

  it("is nothing for a task never done", () => {
    expect(formatLastDone(null, "en")).to.equal(null);
    expect(formatLastDone(undefined, "en")).to.equal(null);
    expect(formatLastDone("", "en")).to.equal(null);
  });
});

describe("renderDueText", () => {
  const textOf = (tpl: unknown) => {
    const host = document.createElement("div");
    render(tpl, host);
    const span = host.querySelector("span")!;
    return { text: span.textContent!.trim(), cls: span.className };
  };

  it("keeps the days until due when there is a due date", () => {
    expect(textOf(renderDueText(4, daysAgo(10), "en"))).to.deep.equal({ text: "4 days", cls: "due-text" });
    expect(textOf(renderDueText(-3, daysAgo(40), "en")).text).to.equal("3 d overdue");
  });

  it("shows the last completion, muted, when there is none", () => {
    expect(textOf(renderDueText(null, daysAgo(23), "en"))).to.deep.equal({ text: "done 23 d ago", cls: "due-text last-done" });
  });

  it("keeps the dash for a task never done", () => {
    expect(textOf(renderDueText(null, null, "en"))).to.deep.equal({ text: "—", cls: "due-text" });
  });
});

describe("maintenance card", () => {
  const T = (id: string, name: string, extra: Record<string, unknown>) => ({
    id, name, status: "ok", days_until_due: null, type: "cleaning", ...extra,
  });
  const OBJECTS = [
    {
      entry_id: "e1",
      object: { id: "e1", name: "PC" },
      tasks: [
        T("t1", "Dust the case", { schedule_type: "manual", last_performed: daysAgo(23) }),
        T("t2", "Replace thermal paste", { schedule_type: "manual", last_performed: null }),
        T("t3", "Clean the fan", { status: "triggered", schedule_type: "sensor_based", trigger_active: true, last_performed: daysAgo(9) }),
      ],
    },
  ];

  it("shows when a task without a due date was last done", async () => {
    const el = await fixture<MaintenanceSupporterCard>(html`<maintenance-supporter-card></maintenance-supporter-card>`);
    el.setConfig({ type: "custom:maintenance-supporter-card", show_actions: false } as never);
    el.hass = {
      language: "en",
      user: { id: "u1", name: "A", is_admin: true, is_owner: true },
      connection: {
        sendMessagePromise: async (msg: { type: string }) =>
          msg.type === "maintenance_supporter/objects" ? { objects: OBJECTS } : { users: [] },
        subscribeMessage: async () => () => {},
      },
    } as never;
    await waitUntil(() => el.shadowRoot!.querySelectorAll(".task-name").length === 3, "card renders", { timeout: 2000 });
    await el.updateComplete;
    const due: Record<string, string> = {};
    for (const row of el.shadowRoot!.querySelectorAll(".task-item")) {
      const name = row.querySelector(".task-name")!.textContent!.trim();
      due[name] = row.querySelector(".task-due")!.textContent!.trim();
    }
    expect(due["Dust the case"]).to.equal("done 23 d ago");
    expect(due["Replace thermal paste"]).to.equal("—");
    expect(due["Clean the fan"]).to.equal("⚡", "a triggered task keeps its mark");
    expect(el.shadowRoot!.querySelector(".task-due .last-done")).to.exist;
    // The status dot follows the shared derivation: grey for the manual task
    // without a due date, not the green of an on-schedule OK.
    const dot = [...el.shadowRoot!.querySelectorAll(".task-item")]
      .find((r) => r.querySelector(".task-name")!.textContent!.includes("Dust the case"))!
      .querySelector<HTMLElement>(".status-dot")!;
    expect(dot.getAttribute("style")).to.contain(NO_DUE_COLOR);
  });
});

describe("status of a task without a due date (D#203 follow-up)", () => {
  // The green OK pill of a manual task that only records when it was last
  // done looked like every task on schedule; it reads "No due date" instead.
  it("is no_due for a manual task without a due date", () => {
    expect(statusKey({ status: "ok", schedule_type: "manual", days_until_due: null })).to.equal("no_due");
  });

  it("keeps the real status otherwise", () => {
    // postponed to a date: the task has a due date and its real status
    expect(statusKey({ status: "ok", schedule_type: "manual", days_until_due: 5 })).to.equal("ok");
    expect(statusKey({ status: "due_soon", schedule_type: "manual", days_until_due: 1 })).to.equal("due_soon");
    // a sensor task without a schedule: its OK means "not triggered"
    expect(statusKey({ status: "ok", schedule_type: "sensor_based", days_until_due: null })).to.equal("ok");
    expect(statusKey({ status: "paused", schedule_type: "manual", days_until_due: null })).to.equal("paused");
    expect(statusKey({ status: "ok", schedule_type: "manual", days_until_due: null, archived: true })).to.equal("archived");
  });

  it("renders a grey pill and chip labelled No due date", () => {
    const host = document.createElement("div");
    const task = { status: "ok", schedule_type: "manual", days_until_due: null };
    render(renderStatusBadge(task, "en"), host);
    const pill = host.querySelector(".status-badge")!;
    expect(pill.classList.contains("no_due")).to.equal(true);
    expect(pill.textContent!.trim()).to.equal("No due date");
    expect(pill.querySelector("ha-icon")!.getAttribute("icon")).to.equal("mdi:calendar-blank-outline");
    render(renderStatusBadge(task, "en", "chip"), host);
    expect(host.querySelector(".status-chip.no_due")!.textContent).to.equal("No due date");
    expect(statusColor(task)).to.equal(NO_DUE_COLOR);
  });
});
