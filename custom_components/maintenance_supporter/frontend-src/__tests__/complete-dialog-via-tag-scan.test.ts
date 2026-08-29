/**
 * <maintenance-complete-dialog> as the fallback of a QR/NFC scan.
 *
 * quick_complete refuses with no_defaults / completion_details_required and
 * the panel opens this dialog instead. The scan already happened, so the
 * completion carries `via_tag_scan: true` (the backend's proof-of-presence
 * gate accepts it) and the "scan required" note is not shown. A plain open
 * sends neither.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/complete-dialog.js";
import type { MaintenanceCompleteDialog } from "../components/complete-dialog";
import { createMockHass } from "./_test-utils.js";

async function mount() {
  const { hass, sent } = createMockHass({
    handlers: { "maintenance_supporter/task/complete": () => ({ success: true }) },
  });
  const el = await fixture<MaintenanceCompleteDialog>(html`
    <maintenance-complete-dialog
      .hass=${hass}
      .entryId=${"entry1"}
      .taskId=${"task1"}
      .taskName=${"Gated"}
      .lang=${"en"}
      .requireTagScan=${true}
    ></maintenance-complete-dialog>
  `);
  return { el, sent };
}

function clickComplete(el: MaintenanceCompleteDialog) {
  const buttons = [...el.shadowRoot!.querySelectorAll(".dialog-actions ha-button")];
  (buttons[buttons.length - 1] as HTMLElement).click();
}

describe("complete-dialog via tag scan", () => {
  it("open({viaTagScan}) hides the scan note and sends via_tag_scan: true", async () => {
    const { el, sent } = await mount();
    el.open({ viaTagScan: true });
    await el.updateComplete;
    expect(el.viaTagScan).to.equal(true);
    expect(el.shadowRoot!.querySelector(".scan-required-note"), "note hidden").to.be.null;

    clickComplete(el);
    await new Promise((r) => setTimeout(r, 10));
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/complete")!;
    expect(msg, "task/complete sent").to.exist;
    expect(msg.via_tag_scan).to.equal(true);
  });

  it("a plain open shows the note and sends no via_tag_scan", async () => {
    const { el, sent } = await mount();
    el.open();
    await el.updateComplete;
    expect(el.viaTagScan).to.equal(false);
    expect(el.shadowRoot!.querySelector(".scan-required-note"), "note shown").to.exist;

    clickComplete(el);
    await new Promise((r) => setTimeout(r, 10));
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/complete")!;
    expect("via_tag_scan" in msg).to.equal(false);
  });

  it("the flag never survives into the next open", async () => {
    const { el } = await mount();
    el.open({ viaTagScan: true });
    await el.updateComplete;
    (el as unknown as { _close: () => void })._close();
    el.open();
    await el.updateComplete;
    expect(el.viaTagScan).to.equal(false);
  });
});
