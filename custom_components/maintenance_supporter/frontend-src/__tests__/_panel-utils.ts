/** Shared mount helper + data factories for full-panel tests.
 *
 * Mounting <maintenance-supporter-panel> needs a hass mock with `user` set
 * (no user → the panel renders read-only "operator" mode) plus handlers for
 * the five _loadData calls. Used by panel-shell.test.ts (bulk / palette /
 * Today / virtual table) and panel-deeplink.test.ts (QR scan routing).
 */

import { fixture, html } from "@open-wc/testing";
import "../maintenance-panel.js";
import { createMockHass, type WsHandler } from "./_test-utils.js";

let taskSeq = 0;

export function resetTaskSeq(): void {
  taskSeq = 0;
}

export function task(over: Record<string, unknown> = {}) {
  taskSeq++;
  return {
    id: `t${taskSeq}`,
    name: `Task ${String(taskSeq).padStart(3, "0")}`,
    type: "custom",
    schedule_type: "time_based",
    interval_days: 30,
    warning_days: 7,
    status: "ok",
    days_until_due: 10,
    next_due: "2026-07-15",
    last_performed: null,
    trigger_active: false,
    trigger_current_value: null,
    trigger_config: null,
    times_performed: 0,
    total_cost: 0,
    average_duration: null,
    history: [],
    checklist: [],
    labels: [],
    priority: "normal",
    enabled: true,
    archived: false,
    is_done: false,
    responsible_user_id: null,
    nfc_tag_id: null,
    entity_slug: null,
    ...over,
  };
}

export function obj(entryId: string, tasks: unknown[], name = "Pool Pump") {
  return {
    entry_id: entryId,
    object_id: `obj_${entryId}`,
    object: {
      id: `obj_${entryId}`, name, area_id: null, manufacturer: null,
      model: null, serial_number: null, task_ids: [],
    },
    tasks,
    document_count: 0,
  };
}

export async function mountPanel(
  objects: unknown[],
  extraHandlers: Record<string, WsHandler> = {},
) {
  const { hass, sent, subscriptions } = createMockHass({
    handlers: {
      "maintenance_supporter/objects": () => ({ objects }),
      "maintenance_supporter/statistics": () => ({
        total_objects: objects.length, total_tasks: 0,
        overdue: 0, due_soon: 0, triggered: 0, ok: 0,
      }),
      "maintenance_supporter/budget_status": () => ({}),
      "maintenance_supporter/groups": () => ({ groups: {} }),
      "maintenance_supporter/documents/list": () => ({ documents: [] }),
      "maintenance_supporter/task/complete": () => ({ success: true }),
      "maintenance_supporter/task/archive": () => ({ success: true }),
      "maintenance_supporter/task/unarchive": () => ({ success: true }),
      ...extraHandlers,
    },
  });
  // The panel derives write access from hass.user (no user → read-only).
  (hass as Record<string, unknown>).user = { id: "admin-1", is_admin: true };
  (hass as Record<string, unknown>).areas = {};

  const el = await fixture<HTMLElement & { updateComplete: Promise<unknown> }>(html`
    <maintenance-supporter-panel
      .hass=${hass}
      style="display:block; height: 600px;"
    ></maintenance-supporter-panel>
  `);
  // _loadData is async; give it a beat, then settle renders.
  await new Promise((r) => setTimeout(r, 40));
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 10));
  await el.updateComplete;
  return { el, sent, subscriptions };
}

export function sr(el: HTMLElement): ShadowRoot {
  return el.shadowRoot!;
}
