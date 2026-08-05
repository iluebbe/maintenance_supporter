/**
 * QR deep-link routing tests (audit gap #9).
 *
 * A scanned QR code lands on the panel URL with ?entry_id&task_id&action=…
 * — until now only the URL *building* was tested, never the handling. These
 * tests pin the scan-to-complete story at the routing layer:
 *  - action=complete opens the pre-targeted complete dialog on the task view
 *  - action=quick_complete fires task/quick_complete silently
 *  - a no_defaults refusal falls back to the normal complete dialog
 *  - params are consumed once (cleaned from the URL)
 *  - an unknown entry_id lands safely on the overview
 */

import { expect } from "@open-wc/testing";
import type { MaintenanceCompleteDialog } from "../components/complete-dialog";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

function setDeepLink(query: string) {
  history.replaceState(null, "", `${window.location.pathname}?${query}`);
}

async function settleRaf(el: { updateComplete: Promise<unknown> }) {
  // Deep-link dialog opens behind a requestAnimationFrame — and since the
  // dialogs became lazy code-split chunks, behind their dynamic import too.
  await customElements.whenDefined("maintenance-complete-dialog");
  await new Promise((r) => requestAnimationFrame(() => r(null)));
  await new Promise((r) => setTimeout(r, 20));
  await (el as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
}

function completeDialog(el: HTMLElement): MaintenanceCompleteDialog | null {
  return sr(el).querySelector<MaintenanceCompleteDialog>("maintenance-complete-dialog");
}

/** The dialogs are lazy code-split chunks — the open lands whenever the
 *  whole lazy-UI group has loaded, so poll instead of guessing a delay. */
async function waitForOpenCompleteDialog(el: HTMLElement): Promise<void> {
  for (let i = 0; i < 100; i++) {
    if (completeDialog(el)?.shadowRoot?.querySelector("ha-dialog")) return;
    await new Promise((r) => setTimeout(r, 20));
  }
}

describe("panel deep links (QR scan routing)", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
    localStorage.setItem("msp-overview-tab", "dashboard");
  });
  afterEach(() => {
    localStorage.clear();
    history.replaceState(null, "", window.location.pathname);
  });

  it("?action=complete lands on the task and opens the pre-targeted dialog", async () => {
    setDeepLink("entry_id=e1&task_id=t1&action=complete");
    const { el } = await mountPanel([
      obj("e1", [task({ name: "Scan Me" })]),
    ]);
    await settleRaf(el);

    // Landed on the task detail…
    expect(sr(el).querySelector(".task-header"), "task detail rendered").to.exist;
    expect(sr(el).querySelector(".task-name-breadcrumb")!.textContent).to.include("Scan Me");
    // …with the complete dialog open and targeted at the scanned task.
    await waitForOpenCompleteDialog(el);
    const dlg = completeDialog(el)!;
    expect(dlg.shadowRoot!.querySelector("ha-dialog"), "complete dialog open").to.exist;
    expect(dlg.entryId).to.equal("e1");
    expect(dlg.taskId).to.equal("t1");
    expect(dlg.taskName).to.equal("Scan Me");
    // Params are consumed once: the URL is cleaned.
    expect(window.location.search).to.equal("");
  });

  it("?action=quick_complete fires task/quick_complete silently", async () => {
    setDeepLink("entry_id=e1&task_id=t1&action=quick_complete");
    const { el, sent } = await mountPanel(
      [obj("e1", [task({ name: "Quick" })])],
      { "maintenance_supporter/task/quick_complete": () => ({ success: true, via: "quick" }) },
    );
    await settleRaf(el);

    const quick = sent.filter((m) => m.type === "maintenance_supporter/task/quick_complete");
    expect(quick.length).to.equal(1);
    expect(quick[0].entry_id).to.equal("e1");
    expect(quick[0].task_id).to.equal("t1");
    // Silent path: no dialog opened.
    const dlg = completeDialog(el);
    expect(dlg?.shadowRoot?.querySelector("ha-dialog") ?? null).to.be.null;
  });

  it("quick_complete without defaults falls back to the complete dialog", async () => {
    setDeepLink("entry_id=e1&task_id=t1&action=quick_complete");
    const { el, sent } = await mountPanel(
      [obj("e1", [task({ name: "No Defaults" })])],
      {
        "maintenance_supporter/task/quick_complete": () => {
          throw { code: "no_defaults", message: "open the dialog instead" };
        },
      },
    );
    await settleRaf(el);
    await settleRaf(el); // fallback opens after the rejected promise settles

    expect(
      sent.filter((m) => m.type === "maintenance_supporter/task/quick_complete").length,
    ).to.equal(1);
    await waitForOpenCompleteDialog(el);
    const dlg = completeDialog(el)!;
    expect(dlg.shadowRoot!.querySelector("ha-dialog"), "fallback dialog open").to.exist;
    expect(dlg.taskName).to.equal("No Defaults");
  });

  it("an unknown entry_id lands safely on the overview", async () => {
    setDeepLink("entry_id=does-not-exist&task_id=t1&action=complete");
    const { el } = await mountPanel([obj("e1", [task({ name: "Real" })])]);
    await settleRaf(el);

    expect(sr(el).querySelector(".task-header")).to.be.null;
    expect(sr(el).querySelector(".task-table"), "overview dashboard rendered").to.exist;
    expect(window.location.search).to.equal("");
  });
});
