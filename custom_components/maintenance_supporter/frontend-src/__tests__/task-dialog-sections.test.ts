/**
 * #216: the task dialog is grouped by question. The fields had grown in the
 * order they were added: the schedule type at the top, the last-done date a
 * third down, the trigger halfway, the tag requirement at the bottom; labels
 * in two sizes and a browser-default input for the labels.
 *
 * Pins: the section order (the trigger section only for sensor tasks), which
 * section holds which field, one label style, the labels field as a styled
 * text field, cycle phases behind a disclosure.
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
      "schedule-section", "completion-section", "people-section", "details-section",
    ]);
    expect(sections(await open({ schedule_type: "sensor_based", trigger_config: { type: "threshold", entity_id: "sensor.x", trigger_above: 5 } }))).to.deep.equal([
      "schedule-section", "trigger-section", "completion-section", "people-section", "details-section",
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
    expect(root.querySelector(".people-section .mirror-todo-field"), "to-do mirror").to.exist;
    expect(labelsIn(root, "people-section").some((l) => /responsible/i.test(l)), "responsible user").to.equal(true);
    expect(root.querySelector(".details-section .toggle-row"), "enabled").to.exist;
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
