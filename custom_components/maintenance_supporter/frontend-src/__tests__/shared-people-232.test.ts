/**
 * #232: a task shared with several people and nobody responsible is meant
 * for each of them (helpers/assignees), but no surface named them: every
 * badge read the responsible person only. Pins: the badge on the task page
 * and in the object's task list, the card's assignee line and the shared
 * chip name everyone the task is for; bulk edit can share without a
 * rotation; the task dialog says when a responsible person outranks the
 * people it is shared with.
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import { render } from "lit";
import "../components/bulk-edit-dialog.js";
import "../components/task-dialog.js";
import "../maintenance-card.js";
import type { MaintenanceBulkEditDialog } from "../components/bulk-edit-dialog";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import type { MaintenanceSupporterCard } from "../maintenance-card";
import { renderPeopleChip, type PersonDisplay } from "../helpers/person";
import { renderUserBadge } from "../renderers/task-detail";
import { createMockHass } from "./_test-utils.js";

const ANN: PersonDisplay = { id: "u_ann", name: "Ann", initials: "AN", color: "#1565c0" };
const BEN: PersonDisplay = { id: "u_ben", name: "Ben", initials: "BE", color: "#2e7d32" };
const PEOPLE: Record<string, PersonDisplay> = { u_ann: ANN, u_ben: BEN };

const text = (el: Element | null | undefined) => (el?.textContent || "").replace(/\s+/g, " ").trim();

function mountTemplate(tpl: unknown): HTMLElement {
  const host = document.createElement("div");
  render(tpl, host);
  return host;
}

describe("#232: everyone a shared task is for is named", () => {
  it("the badge names the people it is shared with, or the responsible person alone", () => {
    const badge = (task: Record<string, unknown>) =>
      mountTemplate(renderUserBadge(task as never, (id) => PEOPLE[id]?.name ?? null, (id) => PEOPLE[id] ?? null));
    const shared = badge({ responsible_user_id: null, assignee_pool: ["u_ann", "u_ben"] });
    expect(text(shared.querySelector(".user-badge"))).to.equal("ANBEAnn, Ben");
    expect(shared.querySelectorAll(".people-avatars .person-avatar")).to.have.length(2);
    const rotation = badge({ responsible_user_id: "u_ben", assignee_pool: ["u_ann", "u_ben"], rotation_strategy: "round_robin" });
    expect(text(rotation.querySelector(".user-badge"))).to.equal("BEBen");
    expect(badge({ responsible_user_id: null, assignee_pool: [] }).querySelector(".user-badge")).to.equal(null);
  });

  it("the chip shows every circle and the names", () => {
    const chip = mountTemplate(renderPeopleChip([ANN, null, BEN], "sub-chip")).querySelector(".person-chip")!;
    expect(chip.getAttribute("title")).to.equal("Ann, Ben");
    expect(text(chip.querySelector(".person-name"))).to.equal("Ann, Ben");
    expect(chip.querySelectorAll(".person-avatar")).to.have.length(2);
    const one = mountTemplate(renderPeopleChip([ANN])).querySelector(".person-chip")!;
    expect(one.querySelector(".people-avatars")).to.equal(null);
  });

  it("the card's assignee line names both people", async () => {
    const objects = [{
      entry_id: "e1",
      object: { id: "e1", name: "Kitchen" },
      tasks: [{ id: "t1", name: "Clean gutters", status: "overdue", days_until_due: -1, type: "service", responsible_user_id: null, assignee_pool: ["u_ann", "u_ben"] }],
    }];
    const users = [
      { id: "u_ann", name: "Ann", is_admin: false, is_owner: false, initials: "AN", color: "#1565c0" },
      { id: "u_ben", name: "Ben", is_admin: false, is_owner: false, initials: "BE", color: "#2e7d32" },
    ];
    const el = await fixture<MaintenanceSupporterCard>(html`<maintenance-supporter-card></maintenance-supporter-card>`);
    el.setConfig({ type: "custom:maintenance-supporter-card", show_actions: false } as never);
    el.hass = {
      language: "en",
      user: { id: "u_ann", name: "Ann", is_admin: true, is_owner: true },
      connection: {
        sendMessagePromise: async (msg: { type: string }) => {
          if (msg.type === "maintenance_supporter/objects") return { objects };
          if (msg.type === "maintenance_supporter/users/list") return { users };
          return { overdue: 0, due_soon: 0, triggered: 0, ok: 0, total: 0 };
        },
        subscribeMessage: async () => () => {},
      },
    } as never;
    await waitUntil(() => text(el.shadowRoot!.querySelector(".assignee")).includes("Ben"), "names resolved", { timeout: 2000 });
    expect(text(el.shadowRoot!.querySelector(".assignee"))).to.equal("ANBEAnn, Ben");
  });
});

describe("#232: sharing in bulk edit and the task dialog", () => {
  it("bulk edit shares with several people without a rotation", async () => {
    const { hass } = createMockHass();
    const el = await fixture<MaintenanceBulkEditDialog>(html`<maintenance-bulk-edit-dialog .hass=${hass}></maintenance-bulk-edit-dialog>`);
    const pending = el.open("assign", [{ entry_id: "e1", task_id: "t1", labels: [] }] as never[], [
      { id: "u_ben", name: "Ben" }, { id: "u_ann", name: "Ann" },
    ] as never[]);
    await el.updateComplete;
    const radios = el.shadowRoot!.querySelectorAll<HTMLInputElement>("input[type=radio]");
    expect([...radios].map((r) => text(r.parentElement))).to.deep.equal([
      "One person", "Several people, each of them", "Several people, in turns",
    ]);
    radios[1].click();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector("select.rotation"), "no rotation to pick").to.equal(null);
    const boxes = el.shadowRoot!.querySelectorAll<HTMLInputElement>(".pool input[type=checkbox]");
    boxes[0].click();
    await el.updateComplete;
    expect(el.changes(), "one person is not sharing").to.equal(null);
    boxes[1].click();
    await el.updateComplete;
    el.shadowRoot!.querySelector<HTMLElement>("ha-button.apply")!.click();
    expect(await pending).to.deep.equal({ assignee_pool: ["u_ann", "u_ben"], rotation_strategy: null, responsible_user_id: null });
  });

  it("the task dialog says when a responsible person outranks the people it is shared with", async () => {
    const { hass } = createMockHass({
      handlers: { "maintenance_supporter/users/list": () => ({ users: [{ id: "u_ann", name: "Ann" }, { id: "u_ben", name: "Ben" }] }) },
    });
    const el = await fixture<MaintenanceTaskDialog>(html`<maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>`);
    const base = { id: "t1", name: "Clean gutters", type: "custom", schedule_type: "time_based", interval_days: 30, warning_days: 7, enabled: true };
    const hint = () => el.shadowRoot!.querySelector(".shared-responsible-wins");
    await el.openEdit("e1", { ...base, responsible_user_id: null, assignee_pool: ["u_ann", "u_ben"] } as never);
    await el.updateComplete;
    expect(text(el.shadowRoot!.querySelector(".assignee-pool")?.parentElement?.querySelector("label"))).to.equal("Shared with");
    expect(hint(), "nobody responsible: shared").to.equal(null);
    await el.openEdit("e1", { ...base, responsible_user_id: "u_ann", assignee_pool: ["u_ann", "u_ben"] } as never);
    await el.updateComplete;
    expect(text(hint())).to.contain("meant for them alone");
    await el.openEdit("e1", { ...base, responsible_user_id: "u_ann", assignee_pool: ["u_ann", "u_ben"], rotation_strategy: "round_robin" } as never);
    await el.updateComplete;
    expect(hint(), "a rotation's person on duty").to.equal(null);
  });
});
