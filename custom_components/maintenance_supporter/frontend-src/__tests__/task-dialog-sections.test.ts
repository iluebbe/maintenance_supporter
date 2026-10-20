/**
 * #216: the task dialog is grouped by question. The fields had grown in the
 * order they were added: the schedule type at the top, the last-done date a
 * third down, the trigger halfway, the tag requirement at the bottom; labels
 * in two sizes and a browser-default input for the labels.
 *
 * Pins: the section order (the trigger section only for sensor tasks), which
 * section holds which field, one label style, the labels field as a styled
 * text field, cycle phases behind a disclosure.
 *
 * Follow-up (pkolbus): people and notifications are two sections, the notes
 * follow the name and type, priority / labels / link / icon fold into
 * Details below them, and the earliest completion is part of the schedule.
 */

import { expect, fixture, html } from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";
import "../components/task-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import { createMockHass } from "./_test-utils.js";

async function open(task: Record<string, unknown>): Promise<ShadowRoot> {
  const { hass } = createMockHass();
  const el = await fixture<MaintenanceTaskDialog>(html`<maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>`);
  await el.openEdit("e1", { id: "t1", name: "Filter", type: "custom", warning_days: 7, enabled: true, ...task } as never);
  await el.updateComplete;
  return el.shadowRoot!;
}

const sections = (root: ShadowRoot) =>
  [...root.querySelectorAll(".content > section.form-section")].map((s) => [...s.classList].find((c) => c !== "form-section"));

const labelsIn = (root: ShadowRoot, cls: string) =>
  [...root.querySelectorAll(`.${cls} ms-textfield, .${cls} ms-date-field, .${cls} .select-row > label, .${cls} .field-label`)].map(
    (n) => (n.getAttribute("label") || n.textContent || "").trim(),
  );

describe("task dialog sections (#216)", () => {
  it("orders the sections by question; the trigger only for sensor tasks", async () => {
    expect(sections(await open({ schedule_type: "time_based", interval_days: 30 }))).to.deep.equal([
      "schedule-section", "completion-section", "people-section", "notifications-section",
    ]);
    expect(sections(await open({ schedule_type: "sensor_based", trigger_config: { type: "threshold", entity_id: "sensor.x", trigger_above: 5 } }))).to.deep.equal([
      "schedule-section", "trigger-section", "completion-section", "people-section", "notifications-section",
    ]);
  });

  it("keeps the schedule, the completion rules, the people and the details together", async () => {
    const root = await open({ schedule_type: "time_based", interval_days: 30 });
    const schedule = labelsIn(root, "schedule-section");
    expect(schedule.some((l) => /schedule type/i.test(l)), "schedule type").to.equal(true);
    expect(schedule.some((l) => /last performed/i.test(l)), "last performed").to.equal(true);
    expect(schedule.some((l) => /warning/i.test(l)), "warning days").to.equal(true);
    expect(root.querySelector(".completion-section .required-completion"), "required fields").to.exist;
    expect(root.querySelector(".completion-section .phases-section"), "cycle phases").to.exist;
    expect(schedule.some((l) => /earliest/i.test(l)), "earliest completion is a schedule rule").to.equal(true);
    expect(labelsIn(root, "completion-section").some((l) => /earliest/i.test(l))).to.equal(false);
    expect(root.querySelector(".notifications-section .mirror-todo-field"), "to-do mirror").to.exist;
    expect(labelsIn(root, "people-section").some((l) => /responsible/i.test(l)), "responsible user").to.equal(true);
    const mute = [...root.querySelectorAll(".req-option")].find((n) => /no notifications/i.test(n.textContent || ""));
    expect(mute?.closest("section")?.classList.contains("notifications-section"), "no notifications").to.equal(true);
    expect(root.querySelector(".content > .toggle-row"), "enabled stays in sight, with the name").to.exist;
    // The tag scan rule sits with the completion, not at the dialog's end.
    const scan = [...root.querySelectorAll(".req-option")].find((n) => /scanning the tag/i.test(n.textContent || ""));
    expect(scan?.closest("section")?.classList.contains("completion-section")).to.equal(true);
  });

  it("one label style; labels in a styled text field; phases folded until defined", async () => {
    const root = await open({ schedule_type: "time_based", interval_days: 30 });
    const styles = new Set(
      [...root.querySelectorAll(".select-row > label, .field > label, .field-label")].map((n) => {
        const cs = getComputedStyle(n);
        return `${cs.fontSize}/${cs.fontWeight}`;
      }),
    );
    expect([...styles]).to.deep.equal(["12px/500"]);
    const labels = [...root.querySelectorAll(".details-section ms-textfield")].find((n) => n.getAttribute("label") === "Labels");
    expect(labels, "labels as ms-textfield").to.exist;
    expect(root.querySelector('.content input[type="text"]'), "no browser-default text input").to.equal(null);
    expect((root.querySelector(".phases-section") as HTMLDetailsElement).open).to.equal(false);
    const withPhases = await open({ schedule_type: "time_based", interval_days: 30, phases: { p1: { name: "Flip" } }, phase_sequence: ["p1"] });
    expect((withPhases.querySelector(".phases-section") as HTMLDetailsElement).open).to.equal(true);
  });

  it("the notes follow the name; the rest of the details folds below them", async () => {
    const root = await open({ schedule_type: "time_based", interval_days: 30 });
    const ids = [...root.querySelectorAll(".content > *")].map((n) =>
      n.getAttribute("label") || (n.classList.contains("details-section") ? "details" : n.classList.contains("toggle-row") ? "enabled" : n.className || n.tagName));
    const name = ids.indexOf("Task name");
    const notes = ids.findIndex((i) => /^Notes/.test(i));
    expect(name, "name field").to.be.greaterThan(-1);
    expect(notes, "notes right after name and type").to.equal(name + 2);
    expect(ids[notes + 1]).to.equal("details");
    expect(ids[notes + 2]).to.equal("enabled");
    const details = root.querySelector<HTMLDetailsElement>(".details-section")!;
    expect(details.open, "folded when nothing in it is set").to.equal(false);
    const select = details.querySelector<HTMLSelectElement>("select")!;
    expect(select.getAttribute("aria-label")).to.equal("Priority");
    for (const label of ["Labels", "Documentation URL (optional)"]) {
      expect([...details.querySelectorAll("ms-textfield")].some((n) => n.getAttribute("label") === label), label).to.equal(true);
    }
    expect(details.querySelector("ha-icon-picker"), "icon").to.exist;
    for (const set of [{ priority: "high" }, { labels: ["garden"] }, { documentation_url: "https://x" }, { custom_icon: "mdi:leaf" }]) {
      const r = await open({ schedule_type: "time_based", interval_days: 30, ...set });
      expect(r.querySelector<HTMLDetailsElement>(".details-section")!.open, JSON.stringify(set)).to.equal(true);
    }
  });

  it("a cleared detail does not fold the disclosure while typing", async () => {
    const { hass } = createMockHass();
    const el = await fixture<MaintenanceTaskDialog>(html`<maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>`);
    await el.openEdit("e1", { id: "t1", name: "Filter", type: "custom", warning_days: 7, enabled: true, schedule_type: "time_based", interval_days: 30, labels: ["a"] } as never);
    await el.updateComplete;
    const details = el.shadowRoot!.querySelector<HTMLDetailsElement>(".details-section")!;
    expect(details.open).to.equal(true);
    (el as unknown as { _labels: string })._labels = "";
    await el.updateComplete;
    expect(details.open).to.equal(true);
    // A new task starts folded again.
    await el.openCreate("e1");
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector<HTMLDetailsElement>(".details-section")!.open).to.equal(false);
  });

  it("a phase with a part keeps its name readable on a phone", async () => {
    // Beside the part and its quantity the name field was squeezed to
    // nothing at 360 px (audit 2026-10-17): it gets its own line there.
    await setViewport({ width: 360, height: 740 });
    try {
      const { hass } = createMockHass({
        handlers: { "maintenance_supporter/object": () => ({ parts: [{ id: "p1", name: "Water filter cartridge" }] }) },
      });
      const el = await fixture<MaintenanceTaskDialog>(html`<maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>`);
      await el.openEdit("e1", {
        id: "t1", name: "Filter", type: "custom", warning_days: 7, enabled: true, schedule_type: "time_based", interval_days: 30,
        phases: { p1: { name: "Flip", consumes_parts: [{ part_id: "p1", quantity: 2 }] } }, phase_sequence: ["p1"],
      } as never);
      await new Promise((r) => setTimeout(r, 0));
      await el.updateComplete;
      const root = el.shadowRoot!;
      expect(root.querySelector(".phase-def-head .phase-qty"), "the part and its quantity are shown").to.exist;
      const name = root.querySelector<HTMLElement>(".phase-def-head ms-textfield")!;
      expect(name.getBoundingClientRect().width).to.be.closeTo(name.parentElement!.getBoundingClientRect().width, 1);
    } finally {
      await setViewport({ width: 800, height: 600 });
    }
  });
});

// #216 follow-up (pkolbus): the open list of a select was grey with the
// chosen entry in the system blue — the entries carry the card's colours,
// and where a select can be styled it is drawn like HA's own menus.
describe("task dialog selects", () => {
  it("lists their entries in the card's colours", async () => {
    const root = await open({ schedule_type: "time_based", interval_days: 30 });
    const host = root.host as HTMLElement;
    host.style.setProperty("--card-background-color", "rgb(1, 2, 3)");
    host.style.setProperty("--primary-text-color", "rgb(250, 251, 252)");
    host.style.setProperty("--primary-color", "rgb(0, 128, 255)");
    const select = root.querySelector<HTMLSelectElement>(".select-row select")!;
    const option = select.querySelector("option")!;
    expect(getComputedStyle(option).backgroundColor).to.equal("rgb(1, 2, 3)");
    expect(getComputedStyle(option).color).to.equal("rgb(250, 251, 252)");
    if (CSS.supports("appearance", "base-select")) {
      expect(getComputedStyle(select).appearance).to.equal("base-select");
      const chosen = select.querySelector<HTMLOptionElement>("option:checked")!;
      expect(getComputedStyle(chosen).color, "the chosen entry in the theme's colour").to.equal("rgb(0, 128, 255)");
    }
  });
});
