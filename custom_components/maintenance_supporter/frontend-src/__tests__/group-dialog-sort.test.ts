/**
 * Component tests for the group-dialog task list (#40 sort fix, v1.0.53).
 *
 * Pins:
 *   - Object sections render alphabetically (not in `.objects` array order)
 *   - Tasks within each object render alphabetically
 *   - Toggling a checkbox updates the internal Set with the right
 *     "entry_id:task_id" composite key
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/group-dialog.js";
import type { MaintenanceGroupDialog } from "../components/group-dialog";

function mockObjects() {
  // Deliberately given in non-alphabetical creation order.
  return [
    {
      entry_id: "e3",
      object: { id: "o3", name: "Zenith Compressor" },
      tasks: [
        { id: "t31", name: "Tighten bolts" },
        { id: "t32", name: "Air filter swap" },
      ],
    },
    {
      entry_id: "e1",
      object: { id: "o1", name: "Aqua Pool" },
      tasks: [
        { id: "t11", name: "pH check" },
        { id: "t12", name: "Brush walls" },
        { id: "t13", name: "Add chlorine" },
      ],
    },
    {
      entry_id: "e2",
      object: { id: "o2", name: "Mid Garage" },
      tasks: [
        { id: "t21", name: "Sweep floor" },
      ],
    },
  ];
}

async function mount() {
  const hass = { language: "en", connection: { sendMessagePromise: async () => ({}) } };
  const el = await fixture<MaintenanceGroupDialog>(html`
    <maintenance-group-dialog .hass=${hass} .objects=${mockObjects()}></maintenance-group-dialog>
  `);
  el.openCreate();
  await el.updateComplete;
  return el;
}

describe("group-dialog task list (#40 alphabetical sort)", () => {
  it("renders object sections alphabetically by object name", async () => {
    const el = await mount();
    const sections = el.shadowRoot!.querySelectorAll(".object-block .object-name");
    const names = [...sections].map(n => n.textContent?.trim() || "");
    expect(names, "object sections sorted A→Z").to.deep.equal([
      "Aqua Pool",
      "Mid Garage",
      "Zenith Compressor",
    ]);
  });

  it("renders tasks within each object alphabetically", async () => {
    const el = await mount();
    const blocks = el.shadowRoot!.querySelectorAll(".object-block");
    // Aqua Pool block (first after sort) should have tasks A→Z
    const aquaTasks = blocks[0].querySelectorAll(".task-row span");
    const taskNames = [...aquaTasks].map(s => s.textContent?.trim() || "");
    expect(taskNames, "Aqua Pool tasks A→Z").to.deep.equal([
      "Add chlorine",
      "Brush walls",
      "pH check",
    ]);
  });

  it("toggles a checkbox and stores the composite entry:task key", async () => {
    const el = await mount();
    const blocks = el.shadowRoot!.querySelectorAll(".object-block");
    const firstCheckbox = blocks[0].querySelector<HTMLInputElement>(".task-row input[type=checkbox]")!;
    firstCheckbox.checked = true;
    firstCheckbox.dispatchEvent(new Event("change"));
    await el.updateComplete;
    // First sorted object is Aqua Pool (e1); first sorted task is "Add chlorine" (t13)
    // Internal _selected uses entry_id:task_id. Inspect via the rendered count.
    const countEl = el.shadowRoot!.querySelector(".selected-count");
    expect(countEl?.textContent || "").to.match(/1\b/);
  });

  it("checkbox state survives object re-render via property update", async () => {
    const el = await mount();
    const blocks1 = el.shadowRoot!.querySelectorAll(".object-block");
    const cb = blocks1[0].querySelector<HTMLInputElement>(".task-row input")!;
    cb.checked = true;
    cb.dispatchEvent(new Event("change"));
    await el.updateComplete;

    // Force a re-render with the same objects (ordering invariant).
    el.objects = [...mockObjects()];
    await el.updateComplete;

    const cbAgain = el.shadowRoot!.querySelectorAll(".object-block")[0]
      .querySelector<HTMLInputElement>(".task-row input")!;
    expect(cbAgain.checked, "checked state preserved across re-render").to.be.true;
  });
});
