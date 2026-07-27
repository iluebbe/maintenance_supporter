/**
 * The completion dialog must not let a user hit Complete while the task's
 * required details are still empty.
 *
 * The backend rejects such a completion at every surface anyway; blocking the
 * button here is what keeps a user from ever meeting that rejection. These
 * tests pin the two halves: the marker on the required field's label, and the
 * disabled action until the value is there.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/complete-dialog.js";
import type { MaintenanceCompleteDialog } from "../components/complete-dialog";

const hass = {
  language: "en",
  connection: { sendMessagePromise: async () => ({}) },
} as never;

async function openDialog(required: string[]): Promise<MaintenanceCompleteDialog> {
  const el = await fixture<MaintenanceCompleteDialog>(
    html`<maintenance-complete-dialog .hass=${hass}></maintenance-complete-dialog>`
  );
  el.entryId = "e1";
  el.taskId = "t1";
  el.taskName = "Descale the boiler";
  el.requiredFields = required;
  el.open();
  await el.updateComplete;
  return el;
}

const completeButton = (el: MaintenanceCompleteDialog) =>
  [...el.shadowRoot!.querySelectorAll("ha-button")].at(-1) as HTMLElement & { disabled?: boolean };

const setField = async (el: MaintenanceCompleteDialog, selector: string, value: string) => {
  const field = el.shadowRoot!.querySelector(selector) as HTMLInputElement;
  expect(field, `field ${selector} exists`).to.exist;
  field.value = value;
  field.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
  await el.updateComplete;
};

describe("complete dialog — required details", () => {
  it("completes freely when the task demands nothing", async () => {
    const el = await openDialog([]);
    expect(completeButton(el).disabled).to.not.equal(true);
    expect(el.shadowRoot!.querySelector(".req-mark")).to.not.exist;
  });

  it("marks the required field and blocks Complete until it is filled", async () => {
    const el = await openDialog(["notes"]);
    expect(el.shadowRoot!.querySelectorAll(".req-mark").length).to.equal(1);
    expect(completeButton(el).disabled).to.equal(true);

    await setField(el, "input.field-input[type='text']", "descaled with citric acid");
    expect(completeButton(el).disabled).to.not.equal(true);
  });

  it("keeps blocking while only one of two requirements is met", async () => {
    const el = await openDialog(["notes", "cost"]);
    expect(el.shadowRoot!.querySelectorAll(".req-mark").length).to.equal(2);

    await setField(el, "input.field-input[type='text']", "done");
    expect(completeButton(el).disabled, "cost is still missing").to.equal(true);
  });

  it("does not demand a photo it was not asked for", async () => {
    const el = await openDialog(["cost"]);
    const marks = [...el.shadowRoot!.querySelectorAll(".req-mark")];
    expect(marks.length).to.equal(1);
  });
});
