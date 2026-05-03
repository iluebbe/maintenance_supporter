/**
 * Tripwire: NO dialog mounted via dialog-mount may use HA's lazy-loaded
 * elements (`ha-textfield`, `ha-textarea`, `ha-entity-picker`) in its
 * shadow DOM. These elements aren't reliably registered in the panel-
 * custom or Lovelace contexts, render as HTMLUnknownElement with
 * offsetHeight=0, and look like an empty form to the user.
 *
 * History:
 *   - #50: complete-dialog notes/cost/duration invisible
 *     → Fix: native <input> with field-input class
 *   - #50 follow-up: task-dialog target-entity invisible
 *     → Fix: <ha-form> with entity selector schema
 *   - #46 follow-up: object-dialog name/manufacturer/model/serial/url/notes
 *     invisible (only ha-area-picker rendered → user could "only change
 *     the area")
 *     → Fix: <ms-textfield> wrapper + native <textarea> for notes
 *
 * Allowed elements (verified to lazy-load reliably or wrappable):
 *   - ha-area-picker, ha-form, ha-service-picker, ha-icon, ha-svg-icon,
 *     ha-button, ha-dialog, ha-icon-button, ha-switch, mwc-button,
 *     mwc-icon-button, ha-list-item, mwc-list-item
 *
 * If you need a textfield, use <ms-textfield> (components/ms-textfield.ts).
 * If you need an entity picker, use <ha-form> with
 *   `selector: { entity: {...} }` schema — ha-form lazy-loads its child
 *   pickers internally + IS itself reliably registered.
 *
 * This test mounts each dialog component and walks its shadow DOM
 * looking for any banned tag. If you add a new dialog, import + mount
 * it here too.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/object-dialog.js";
import "../components/task-dialog.js";
import "../components/group-dialog.js";
import "../components/complete-dialog.js";
import "../components/history-edit-dialog.js";
import "../components/qr-dialog.js";
import "../components/seasonal-overrides-dialog.js";
import "../components/object-quick-actions-dialog.js";
import "../components/task-quick-actions-dialog.js";
import "../components/confirm-dialog.js";
import { createMockHass } from "./_test-utils.js";

const BANNED_TAGS = ["ha-textfield", "ha-textarea", "ha-entity-picker"];

function findBannedTags(root: ShadowRoot | Element): string[] {
  const banned: string[] = [];
  for (const tag of BANNED_TAGS) {
    const matches = root.querySelectorAll(tag);
    matches.forEach((el) => {
      banned.push(`<${tag}> at depth ${depthOf(el, root)} (label="${el.getAttribute("label") || ""}")`);
    });
  }
  return banned;
}

function depthOf(el: Element, root: ShadowRoot | Element): number {
  let depth = 0;
  let cur: ParentNode | null = el.parentNode;
  while (cur && cur !== root) {
    depth++;
    cur = cur.parentNode;
  }
  return depth;
}

describe("dialog tripwire: no lazy-loaded HA elements", () => {
  it("object-dialog", async () => {
    const { hass } = createMockHass();
    const el = await fixture<HTMLElement & { hass: unknown; openEdit: (e: string, o: unknown) => void }>(
      html`<maintenance-object-dialog .hass=${hass}></maintenance-object-dialog>`,
    );
    el.openEdit("entry_x", {
      id: "obj_1", name: "Test", area_id: "garage",
      manufacturer: "ACME", model: "X1", serial_number: "SN1",
      installation_date: "2025-01-01", documentation_url: "https://x.test/",
      notes: "test notes",
    });
    await (el as HTMLElement & { updateComplete: Promise<void> }).updateComplete;
    const banned = findBannedTags(el.shadowRoot!);
    expect(banned, `object-dialog has banned lazy-load elements: ${banned.join(", ")}`)
      .to.have.lengthOf(0);
  });

  it("task-dialog with all feature flags on (worst case = most fields rendered)", async () => {
    const { hass } = createMockHass({
      services: { button: { press: {} } },
    });
    const el = await fixture<HTMLElement & {
      hass: unknown; openEdit: (e: string, t: unknown) => Promise<void>;
      checklistsEnabled: boolean; scheduleTimeEnabled: boolean; completionActionsEnabled: boolean;
    }>(
      html`<maintenance-task-dialog
        .hass=${hass}
        .checklistsEnabled=${true}
        .scheduleTimeEnabled=${true}
        .completionActionsEnabled=${true}
      ></maintenance-task-dialog>`,
    );
    await el.openEdit("entry_x", {
      id: "t1", name: "Test Task", type: "custom", schedule_type: "time_based",
      interval_days: 30, warning_days: 7, enabled: true,
      checklist: ["step 1"],
      schedule_time: "09:00",
      on_complete_action: { service: "button.press", target: { entity_id: "button.x" } },
    });
    await (el as HTMLElement & { updateComplete: Promise<void> }).updateComplete;
    // Expand <details> sections so action UI is in the DOM
    el.shadowRoot!.querySelectorAll<HTMLDetailsElement>("details").forEach((d) => { d.open = true; });
    await (el as HTMLElement & { updateComplete: Promise<void> }).updateComplete;
    const banned = findBannedTags(el.shadowRoot!);
    expect(banned, `task-dialog has banned lazy-load elements: ${banned.join(", ")}`)
      .to.have.lengthOf(0);
  });

  it("group-dialog", async () => {
    const { hass } = createMockHass({
      handlers: { "maintenance_supporter/objects": () => ({ objects: [] }) },
    });
    const el = await fixture<HTMLElement & { hass: unknown; openCreate: () => void }>(
      html`<maintenance-group-dialog .hass=${hass}></maintenance-group-dialog>`,
    );
    el.openCreate();
    await (el as HTMLElement & { updateComplete: Promise<void> }).updateComplete;
    const banned = findBannedTags(el.shadowRoot!);
    expect(banned, `group-dialog has banned lazy-load elements: ${banned.join(", ")}`)
      .to.have.lengthOf(0);
  });

  it("complete-dialog", async () => {
    const { hass } = createMockHass();
    const el = await fixture<HTMLElement & {
      hass: unknown; entryId: string; taskId: string; taskName: string; open: () => void;
    }>(
      html`<maintenance-complete-dialog .hass=${hass}></maintenance-complete-dialog>`,
    );
    el.entryId = "entry_x"; el.taskId = "t1"; el.taskName = "Test";
    el.open();
    await (el as HTMLElement & { updateComplete: Promise<void> }).updateComplete;
    const banned = findBannedTags(el.shadowRoot!);
    expect(banned, `complete-dialog has banned lazy-load elements: ${banned.join(", ")}`)
      .to.have.lengthOf(0);
  });

  it("history-edit-dialog", async () => {
    const { hass } = createMockHass();
    const el = await fixture<HTMLElement & {
      hass: unknown; openEdit: (d: unknown) => void;
    }>(
      html`<maintenance-history-edit-dialog .hass=${hass}></maintenance-history-edit-dialog>`,
    );
    el.openEdit({
      entry_id: "e", task_id: "t", original_timestamp: "2025-01-01T00:00:00",
      type: "completed", timestamp: "2025-01-01T00:00:00",
      notes: null, cost: null, duration: null, completed_by: null,
    });
    await (el as HTMLElement & { updateComplete: Promise<void> }).updateComplete;
    const banned = findBannedTags(el.shadowRoot!);
    expect(banned, `history-edit-dialog has banned lazy-load elements: ${banned.join(", ")}`)
      .to.have.lengthOf(0);
  });
});
