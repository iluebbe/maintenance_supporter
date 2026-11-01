/**
 * A completion the server's double-tap guard dropped (the same task completed
 * seconds before, here or on another device) says so. The second tap was
 * answered with a plain success and read as done, though nothing was
 * recorded (lifecycle click test, 2026-11-01). The server now answers
 * `already_recorded_seconds`; the dialog closes with Home Assistant's toast
 * naming it and reports no completion, the one-tap path answers "already".
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/complete-dialog.js";
import type { MaintenanceCompleteDialog } from "../components/complete-dialog";
import { quickComplete } from "../helpers/quick-complete";
import { alreadyRecordedMessage } from "../helpers/undo-completion";
import { createMockHass } from "./_test-utils.js";

async function mount(answer: Record<string, unknown>) {
  const { hass } = createMockHass({ handlers: { "maintenance_supporter/task/complete": () => answer } });
  const el = await fixture<MaintenanceCompleteDialog>(html`
    <maintenance-complete-dialog .hass=${hass} .entryId=${"entry1"} .taskId=${"task1"} .taskName=${"Filter"} .lang=${"en"}></maintenance-complete-dialog>
  `);
  const toasts: string[] = [];
  const completed: unknown[] = [];
  el.addEventListener("hass-notification", (e) => toasts.push((e as CustomEvent<{ message: string }>).detail.message));
  el.addEventListener("task-completed", (e) => completed.push((e as CustomEvent).detail));
  el.open();
  await el.updateComplete;
  const buttons = [...el.shadowRoot!.querySelectorAll(".dialog-actions ha-button")];
  (buttons[buttons.length - 1] as HTMLElement).click();
  await new Promise((r) => setTimeout(r, 20));
  return { el, toasts, completed };
}

describe("a completion the double-tap guard dropped", () => {
  it("the dialog closes with the toast and reports no completion", async () => {
    const { el, toasts, completed } = await mount({ success: true, undo: false, already_recorded_seconds: 12 });
    expect(toasts).to.deep.equal(["Already recorded 12 s ago, not counted twice"]);
    expect(completed.length, "no task-completed, nothing new").to.equal(0);
    expect((el as unknown as { _open: boolean })._open).to.equal(false);
  });

  it("a recorded completion still reports itself, without that toast", async () => {
    const { toasts, completed } = await mount({ success: true, undo: true });
    expect(toasts).to.deep.equal([]);
    expect(completed.length).to.equal(1);
  });

  it("the one-tap path answers already, with the message", async () => {
    const { hass } = createMockHass({
      handlers: { "maintenance_supporter/task/quick_complete": () => ({ success: true, via: "quick", undo: false, already_recorded_seconds: 3 }) },
    });
    const outcome = await quickComplete(hass as never, "entry1", "task1", "en");
    expect(outcome).to.deep.equal({ result: "already", message: "Already recorded 3 s ago, not counted twice" });
  });

  it("alreadyRecordedMessage is null for a recorded completion", () => {
    expect(alreadyRecordedMessage({ success: true, undo: true }, "en")).to.equal(null);
    expect(alreadyRecordedMessage(null, "en")).to.equal(null);
  });
});
