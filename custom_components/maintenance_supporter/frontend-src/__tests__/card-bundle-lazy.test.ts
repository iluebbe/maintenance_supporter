/**
 * Perf 2026-11-05: Home Assistant loads the card and the calendar card on
 * every page (extra module urls), and both evaluated all seven dialogs, the
 * card editor and the battery section before anything was clicked: 90 ms of
 * every page load on a desktop, up to 235 ms on a phone. Each loads when it
 * is first used now; this file imports nothing else, so the module graph is
 * the bundles' own.
 */

import { expect, waitUntil } from "@open-wc/testing";
import "../maintenance-card.js";
import "../maintenance-calendar-card.js";
import { openTaskQuickActions } from "../dialog-mount";
import { createMockHass } from "./_test-utils.js";

/** A first dynamic import compiles the chunk's whole module graph in the
 *  test server; on a busy machine that took longer than waitUntil's 1 s. */
const COLD_IMPORT_MS = 4000;

const LOADED_ON_USE = [
  "maintenance-object-dialog",
  "maintenance-task-dialog",
  "maintenance-complete-dialog",
  "maintenance-history-edit-dialog",
  "maintenance-qr-dialog",
  "maintenance-task-quick-actions-dialog",
  "maintenance-object-quick-actions-dialog",
  "maintenance-supporter-card-editor",
  "maintenance-battery-fleet-section",
];

describe("perf 2026-11-05: what the card bundles load up front", () => {
  it("the cards, and none of what they open", () => {
    for (const tag of ["maintenance-supporter-card", "maintenance-supporter-calendar-card", "maintenance-battery-fleet-card"]) {
      expect(customElements.get(tag), tag).to.not.equal(undefined);
    }
    for (const tag of LOADED_ON_USE) expect(customElements.get(tag), tag).to.equal(undefined);
  });

  it("a dialog loads on its first open and opens the element mounted at once", async () => {
    const root = document.createElement("home-assistant") as HTMLElement & { hass?: unknown };
    root.attachShadow({ mode: "open" });
    root.hass = createMockHass().hass;
    document.body.appendChild(root);
    try {
      expect(openTaskQuickActions("e1", "t1")).to.equal(true);
      const el = root.shadowRoot!.querySelector("maintenance-task-quick-actions-dialog");
      expect(el, "mounted before its class is there").to.not.equal(null);
      await waitUntil(() => customElements.get("maintenance-task-quick-actions-dialog"), "the dialog loaded", { timeout: COLD_IMPORT_MS });
      expect(el instanceof customElements.get("maintenance-task-quick-actions-dialog")!, "the same element, upgraded").to.equal(true);
    } finally {
      root.remove();
    }
  });

  it("the card editor loads when Home Assistant asks for it", async () => {
    const card = customElements.get("maintenance-supporter-card") as unknown as { getConfigElement(): Promise<HTMLElement> };
    const editor = await card.getConfigElement();
    expect(editor.localName).to.equal("maintenance-supporter-card-editor");
    expect(customElements.get("maintenance-supporter-card-editor")).to.not.equal(undefined);
  });

  it("the battery section loads when a fleet card is shown", async () => {
    const card = document.createElement("maintenance-battery-fleet-card");
    document.body.appendChild(card);
    try {
      await waitUntil(() => customElements.get("maintenance-battery-fleet-section"), "the section loaded", { timeout: COLD_IMPORT_MS });
    } finally {
      card.remove();
    }
  });
});
