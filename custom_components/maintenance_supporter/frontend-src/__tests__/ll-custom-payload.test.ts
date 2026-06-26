/**
 * Tripwire: the strategy's document-level `ll-custom` handler must accept BOTH
 * payload shapes that reach it in production.
 *
 *   1. HA's `tap_action: { action: "fire-dom-event", ll_custom: {...} }` path
 *      (the empty-state "Add object" button) dispatches `ll-custom` with the
 *      WHOLE action config as the event detail — our payload nests under
 *      `.ll_custom`. This is the shape that broke in issue #69: the handler
 *      read `detail.type` (undefined) and silently did nothing.
 *
 *   2. Direct dispatchers — the calendar card and the panel — put the payload
 *      at the TOP level of the detail (`{ type, entry_id, task_id }`).
 *
 * Both must open the create-object dialog. The pre-#69 verifier only exercised
 * shape 2, which is why the regression shipped. If you change how the handler
 * reads the payload, keep both green.
 */

import { expect } from "@open-wc/testing";
import { createMockHass } from "./_test-utils.js";

const OBJECT_DIALOG_TAG = "maintenance-object-dialog";
const tick = (ms: number) => new Promise((r) => setTimeout(r, ms));

// A fake <home-assistant> with a mock hass so dialog-mount's getHass() succeeds
// and openCreateObjectDialog() returns true (no deep-link fallback / no URL
// mutation of the test page).
let haRoot: HTMLElement & { hass?: unknown };

before(async () => {
  const { hass } = createMockHass();
  haRoot = document.createElement("home-assistant") as HTMLElement & { hass?: unknown };
  haRoot.hass = hass;
  document.body.appendChild(haRoot);
  // Import for its side effect: registers the document-level ll-custom handler.
  await import("../maintenance-dashboard-strategy.js");
});

after(() => {
  haRoot?.remove();
});

afterEach(() => {
  document.body.querySelector(OBJECT_DIALOG_TAG)?.remove();
});

async function fireAndWait(detail: unknown): Promise<HTMLElement | null> {
  document.dispatchEvent(
    new CustomEvent("ll-custom", { detail, bubbles: true, composed: true }),
  );
  // handler imports dialog-mount.ts dynamically, then mounts the dialog
  for (let i = 0; i < 40; i++) {
    const dlg = document.body.querySelector<HTMLElement>(OBJECT_DIALOG_TAG);
    if (dlg) return dlg;
    await tick(25);
  }
  return null;
}

describe("ll-custom handler payload shape (#69)", () => {
  it("opens the object dialog for HA's nested fire-dom-event shape", async () => {
    const dlg = await fireAndWait({
      action: "fire-dom-event",
      ll_custom: { type: "maintenance-supporter:add-object" },
    });
    expect(dlg, "nested ll_custom payload must reach the add-object handler").to.not.equal(null);
  });

  it("opens the object dialog for the top-level (calendar/panel) shape", async () => {
    const dlg = await fireAndWait({ type: "maintenance-supporter:add-object" });
    expect(dlg, "top-level payload must still work (calendar card / panel)").to.not.equal(null);
  });

  it("ignores ll-custom events for other namespaces", async () => {
    document.dispatchEvent(
      new CustomEvent("ll-custom", {
        detail: { action: "fire-dom-event", ll_custom: { type: "browser_mod:foo" } },
        bubbles: true,
        composed: true,
      }),
    );
    await tick(150);
    expect(document.body.querySelector(OBJECT_DIALOG_TAG)).to.equal(null);
  });
});
