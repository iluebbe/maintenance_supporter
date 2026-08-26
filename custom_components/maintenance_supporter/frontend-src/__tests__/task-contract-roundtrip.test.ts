/** CONTRACT ROUND-TRIP: the task dialog against the REAL backend summary.
 *
 * Consumes the committed fixture the backend test
 * (tests/test_task_contract_fixture.py) generates from the actual
 * `_build_task_summary` for a maximal task — every editable field populated.
 * The dialog hydrates from EXACTLY that payload, saves, and every fixture key
 * must be classified:
 *
 *   - EDITABLE:  the update payload carries the fixture value unchanged, OR
 *                omits the key entirely (absent = backend keeps the stored
 *                value). Present-but-different (especially null) = the #106
 *                wipe — FAIL.
 *   - READONLY:  computed/summary-only keys the dialog never writes.
 *
 * An UNCLASSIFIED key fails the closure check — a newly added summary field
 * must be consciously sorted into one of the two buckets here, which is what
 * keeps the #42/#50/#58/#88/#103/#106 class from re-opening.
 */

import { expect, fixture as mountFixture, html } from "@open-wc/testing";
import "../components/task-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import { createMockHass } from "./_test-utils.js";

// fixture key -> wire key in the update payload (identity unless noted).
const EDITABLE: Record<string, string> = {
  name: "name",
  type: "task_type", // envelope reserves "type" for WS routing
  enabled: "enabled",
  warning_days: "warning_days",
  earliest_completion_days: "earliest_completion_days",
  last_performed: "last_performed",
  notes: "notes",
  documentation_url: "documentation_url",
  custom_icon: "custom_icon",
  nfc_tag_id: "nfc_tag_id",
  reading_unit: "reading_unit",
  consumes_parts: "consumes_parts",
  priority: "priority",
  checklist: "checklist",
  labels: "labels",
  responsible_user_id: "responsible_user_id",
  assignee_pool: "assignee_pool",
  rotation_strategy: "rotation_strategy",
  required_completion_fields: "required_completion_fields",
  trigger_config: "trigger_config",
  // #139: cycle phases — the dialog round-trips defs + sequence (null clears).
  phases: "phases",
  phase_sequence: "phase_sequence",
  on_complete_action: "on_complete_action",
  quick_complete_defaults: "quick_complete_defaults",
  interval_days: "interval_days",
  interval_unit: "interval_unit",
  interval_anchor: "interval_anchor",
  due_date: "due_date",
  // Not editable in the DIALOG (config-flow / feature-gated surfaces own
  // them) — the contract for this payload: the dialog must OMIT the key so
  // the stored value survives. A null here would wipe it (#106 pattern).
  entity_slug: "entity_slug",
  schedule_time: "schedule_time",
};

const READONLY = new Set([
  "id",
  // Payload diet: total history entries beyond the truncated list window —
  // pure summary info; the detail fetches the full record via task/history.
  "history_count",
  // #73: in-cycle checklist ticks — written via task/checklist_progress,
  // never through the edit dialog.
  "checklist_progress",
  // #139: the cursor is DYNAMIC Store state (advanced by completions, moved
  // via task/set_phase), and current_phase is derived from it server-side —
  // the edit dialog writes neither.
  "phase_cursor",
  "current_phase",
  "schedule_type", // derived label (sensor_based when a trigger exists)
  "schedule", // canonical nested recurrence — rebuilt server-side from flat
  "adaptive_config",
  "archived",
  "archived_at",
  "archived_reason",
  "history",
  "battery_fleet_task",
  "part_ref",
  "last_planned_due",
  "due_override",
  "sensor_entity_id",
  "binary_sensor_entity_id",
  "trigger_entity_info",
  "trigger_entity_infos",
  "status",
  "is_done",
  "days_until_due",
  "next_due",
  "trigger_active",
  "trigger_current_value",
  "trigger_entity_state",
  "trigger_current_delta",
  "trigger_baseline_value",
  "times_performed",
  "total_cost",
  "average_duration",
  "suggested_interval",
  "interval_confidence",
  "interval_analysis",
  "seasonal_factor",
  "seasonal_factors",
  "degradation_rate",
  "degradation_trend",
  "degradation_r_squared",
  "days_until_threshold",
  "threshold_prediction_date",
  "threshold_prediction_confidence",
  "environmental_factor",
  "environmental_entity",
  "environmental_correlation",
  "sensor_prediction_urgency",
]);

describe("task contract round-trip (backend fixture -> dialog -> update payload)", () => {
  let contract: Record<string, unknown>;
  let update: Record<string, unknown>;

  before(async () => {
    const resp = await fetch("/__tests__/fixtures/task-summary-contract.txt");
    expect(resp.ok, "contract fixture served").to.be.true;
    contract = await resp.json();

    const { hass, sent } = createMockHass({
      states: {
        "sensor.contract_a": { state: "42" },
        "sensor.contract_b": { state: "7" },
      },
      handlers: {
        "maintenance_supporter/task/update": () => ({ success: true }),
        "maintenance_supporter/object": () => ({ parts: [{ id: "part_1", name: "Part One" }] }),
      },
    });
    const el = await mountFixture<MaintenanceTaskDialog>(html`
      <maintenance-task-dialog
        .hass=${hass}
        checklists-enabled
        completion-actions-enabled
      ></maintenance-task-dialog>
    `);
    await el.updateComplete;
    await el.openEdit("entry_contract", contract as never);
    await el.updateComplete;
    await (el as unknown as { _save: () => Promise<void> })._save();
    update = sent.find((m: { type: string }) => m.type === "maintenance_supporter/task/update") as unknown as Record<
      string,
      unknown
    >;
    expect(update, "update message sent").to.exist;
  });

  it("closure: every summary field is consciously classified", () => {
    const unclassified = Object.keys(contract).filter((k) => !(k in EDITABLE) && !READONLY.has(k));
    expect(unclassified, "new summary field(s) — classify as EDITABLE or READONLY in this test").to.deep.equal([]);
  });

  // Order-insensitive canonical form; keys starting with "_" are RUNTIME
  // state the summary reconstructs from the Store (e.g. trigger_config's
  // `_trigger_state`) — the dialog deliberately does not round-trip them
  // (the duplicate-task path even strips them), so they are outside the
  // editable contract.
  const canonical = (v: unknown): unknown => {
    if (Array.isArray(v)) return v.map(canonical);
    if (v && typeof v === "object") {
      return Object.fromEntries(
        Object.entries(v as Record<string, unknown>)
          .filter(([k]) => !k.startsWith("_"))
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([k, val]) => [k, canonical(val)]),
      );
    }
    return v;
  };

  it("no editable field is wiped or altered by a no-op save", () => {
    const problems: string[] = [];
    for (const [fixtureKey, wireKey] of Object.entries(EDITABLE)) {
      if (!(wireKey in update)) continue; // omitted = stored value survives
      const sentValue = JSON.stringify(canonical(update[wireKey]));
      const fixtureValue = JSON.stringify(canonical(contract[fixtureKey]));
      if (sentValue !== fixtureValue) {
        problems.push(`${fixtureKey}: fixture=${fixtureValue} sent=${sentValue}`);
      }
    }
    expect(problems, "fields altered by a no-op edit").to.deep.equal([]);
  });

  it("the load-bearing fields are actually SENT, not just un-wiped", () => {
    // Omission is legal for the contract, but these must round-trip actively —
    // they are the historic wipe victims (#42/#50/#58/#103/#106).
    for (const key of [
      "name",
      "task_type",
      "warning_days",
      "interval_days",
      "interval_unit",
      "trigger_config",
      "on_complete_action",
      "quick_complete_defaults",
      "consumes_parts",
      "checklist",
      "labels",
    ]) {
      expect(key in update, `${key} present in update payload`).to.be.true;
    }
  });

  it("fields the dialog does not own are omitted, not nulled", () => {
    // entity_slug + schedule_time (sensor-based task): present-as-null would
    // wipe the stored value on save — the #106 pattern.
    expect("entity_slug" in update, "entity_slug omitted").to.be.false;
    expect("schedule_time" in update, "schedule_time omitted for sensor-based").to.be.false;
  });
});
