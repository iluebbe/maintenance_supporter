/**
 * The beta task editor offers every setting of the classic dialog (no
 * regression, 2026-10-31). For tasks that use every field — each schedule
 * kind, each sensor rule, reading tasks, phases, parts of this and of other
 * objects, a completion action, adaptive scheduling, people and rotation,
 * to-do lists with and without household defaults, a new task — with every
 * feature switched on:
 *
 *   - every control of the classic form (input, select, picker, button, link)
 *     is in one of the beta's row sections, as often as the classic shows it;
 *   - clicking through every row (and the rule picker) and saving sends
 *     exactly what saving the classic form sends: looking changes nothing.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/task-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import { createMockHass } from "./_test-utils.js";

const USERS = [{ id: "u1", name: "Ann" }, { id: "u2", name: "Ben" }, { id: "u3", name: "Cy" }];
const OBJECTS = [
  { entry_id: "e1", object: { name: "Washer" } },
  { entry_id: "e3", object: { name: "Dryer" } },
];

interface Opts { beta: boolean; tags?: boolean; parts?: boolean; mirrorDefault?: string[]; create?: boolean }

const settle = async (el: MaintenanceTaskDialog) => {
  for (let i = 0; i < 3; i++) {
    await new Promise((r) => setTimeout(r, 20));
    await el.updateComplete;
  }
};

async function open(task: Record<string, unknown>, opts: Opts) {
  const mock = createMockHass({
    handlers: {
      "maintenance_supporter/users/list": () => ({ users: USERS }),
      "maintenance_supporter/tags/list": () => ({ tags: opts.tags === false ? [] : [{ id: "tag1", name: "Washer tag" }] }),
      "maintenance_supporter/object": () => ({ parts: opts.parts === false ? [] : [{ id: "p1", name: "Filter", unit: "pcs" }] }),
      "maintenance_supporter/objects": () => ({
        objects: [
          { entry_id: "e1", object: { name: "Washer" }, parts: [{ id: "p1", name: "Filter" }], tasks: [] },
          ...(opts.parts === false ? [] : [{ entry_id: "e2", object: { name: "Shed" }, parts: [{ id: "p9", name: "Shared filter" }], tasks: [] }]),
        ],
      }),
    },
  });
  const el = await fixture<MaintenanceTaskDialog>(html`
    <maintenance-task-dialog .hass=${mock.hass} .betaEditor=${opts.beta}
      .checklistsEnabled=${true} .scheduleTimeEnabled=${true} .completionActionsEnabled=${true}
      .adaptiveFeature=${true} .seasonalFeature=${true} .environmentalFeature=${true}
      .mirrorTodoDefault=${opts.mirrorDefault ?? []}></maintenance-task-dialog>`);
  if (opts.create) await el.openCreate("", OBJECTS as never);
  else await el.openEdit("e1", { id: "t1", name: "Filter", type: "cleaning", warning_days: 7, enabled: true, ...task } as never);
  await settle(el);
  return { el, root: el.shadowRoot!, sent: mock.sent as Array<Record<string, unknown>>, save: () => (el as unknown as { _save(): Promise<void> })._save() };
}

const CONTROLS = "input, select, textarea, button, ms-textfield, ms-date-field, ha-icon-picker, ha-form, ha-selector, ha-entity-picker, ha-button, ha-icon-button, ha-switch, ha-service-picker, ha-textfield, a[href]";

/** A control as the user meets it: what it is and what it is labelled. */
function keyOf(el: Element): string {
  const attr = (n: string) => el.getAttribute(n) ?? "";
  const tag = el.localName;
  const text = tag === "button" || tag === "ha-button" || tag === "a" ? el.textContent ?? "" : "";
  const label = attr("label") || attr("aria-label") || el.closest("label")?.textContent || text || attr("helper") || attr("placeholder") || attr("title");
  const schema = tag === "ha-form"
    ? JSON.stringify(((el as unknown as { schema?: Array<{ name: string }> }).schema ?? []).map((s) => s.name))
    : "";
  const cls = (el.getAttribute("class") ?? "").split(/\s+/).filter((c) => c && c !== "selected").sort().join(".");
  return [tag, attr("type"), attr("kind"), cls, label.replace(/\s+/g, " ").trim(), schema, attr("type") === "radio" ? attr("value") : ""].join(" | ");
}

function inventory(container: Element | null | undefined, into = new Map<string, number>()): Map<string, number> {
  for (const el of container?.querySelectorAll(CONTROLS) ?? []) {
    const k = keyOf(el);
    into.set(k, (into.get(k) ?? 0) + 1);
  }
  return into;
}

/** Opens every row's section in turn (and the rule picker), collecting the
 *  controls of each. */
async function clickThrough(el: MaintenanceTaskDialog, root: ShadowRoot): Promise<Map<string, number>> {
  const total = new Map<string, number>();
  const ids = [...root.querySelectorAll(".rule-row")].map((r) => r.getAttribute("data-row")!);
  for (const id of ids) {
    const main = root.querySelector<HTMLElement>(`.rule-row[data-row="${id}"] .rule-main`)!;
    // A new task from scratch opens with its first row open: a click would close it.
    if (main.getAttribute("aria-expanded") !== "true") main.click();
    await settle(el);
    inventory(root.querySelector(".rules-sidebar.open .sidebar-body"), total);
    main.click();
    await el.updateComplete;
  }
  const add = root.querySelector<HTMLElement>(".rule-add");
  if (add) {
    add.click();
    await settle(el);
    root.querySelector<HTMLElement>(".add-tab-device")?.click();
    await settle(el);
    add.click();
    await el.updateComplete;
  }
  return total;
}

const missingIn = (classic: Map<string, number>, beta: Map<string, number>) =>
  [...classic].filter(([k, n]) => (beta.get(k) ?? 0) < n).map(([k, n]) => `${k}  (classic ${n}, beta ${beta.get(k) ?? 0})`);

const sensor = (tc: Record<string, unknown>, extra: Record<string, unknown> = {}) => ({ schedule_type: "sensor_based", trigger_config: tc, ...extra });

const EVERYTHING = {
  schedule_type: "time_based", interval_days: 2, interval_unit: "weeks", interval_anchor: "planned",
  last_performed: "2026-09-27", warning_days: 10, earliest_completion_days: 3, schedule_time: "08:30",
  notes: "Use the soft brush", labels: ["outdoor", "ladder"], priority: "high",
  documentation_url: "https://example.com/manual", custom_icon: "mdi:air-filter", notify_icon: "mdi:bell", enabled: false,
  checklist: ["Switch off", "Brush the fins"], required_completion_fields: ["notes", "cost"],
  nfc_tag_id: "tag1", require_tag_scan: true, allow_skip: false,
  quick_complete_defaults: { notes: "Done", cost: 5, feedback: "not_needed" },
  complete_when: { entity_id: "binary_sensor.door", to_state: "on", for_minutes: 2 },
  consumes_parts: [{ part_id: "p1", quantity: 1 }, { part_id: "p9", entry_id: "e2", quantity: 2 }],
  responsible_user_id: "u1", assignee_pool: ["u1", "u2"], rotation_strategy: "round_robin",
  notify_enabled: false, mirror_todo_entities: ["todo.house"],
  on_complete_action: { service: "counter.reset", target: { entity_id: "counter.washes" }, data: {} },
  phases: { ph1: { name: "Prepare", checklist: ["Get the brush"], consumes_parts: [{ part_id: "p1", quantity: 1 }], required_completion_fields: ["photo"] } },
  phase_sequence: ["ph1"],
  adaptive_config: { enabled: true, ewa_alpha: 0.3, min_interval_days: 7, max_interval_days: 90, seasonal_enabled: false },
};

const FIXTURES: Array<{ name: string; task: Record<string, unknown>; opts?: Partial<Opts> }> = [
  { name: "every field on a time-based task", task: EVERYTHING },
  { name: "household to-do defaults, this task on none", task: { ...EVERYTHING, mirror_todo_entities: [], mirror_todo_use_default: false }, opts: { mirrorDefault: ["todo.default"] } },
  { name: "household to-do defaults, this task on its own lists", task: EVERYTHING, opts: { mirrorDefault: ["todo.default"] } },
  { name: "no NFC tags in HA, no parts anywhere", task: { ...EVERYTHING, consumes_parts: [], phases: {}, phase_sequence: [] }, opts: { tags: false, parts: false } },
  { name: "sensor: threshold on two entities with an attribute, recovery and environment", task: sensor({
    type: "threshold", entity_id: "sensor.temp", entity_ids: ["sensor.temp", "sensor.temp2"], entity_logic: "all",
    trigger_attribute: "current_temperature", trigger_above: 30, trigger_below: 5, trigger_for_minutes: 10,
    auto_complete_on_recovery: true, detail_attribute: "friendly_name",
  }, { interval_days: 60, adaptive_config: { environmental_entity: "sensor.outdoor", environmental_attribute: "temperature" } }) },
  { name: "sensor: counter with delta and baseline", task: sensor({
    type: "counter", entity_id: "sensor.washes", entity_ids: ["sensor.washes"], trigger_target_value: 25, trigger_delta_mode: true,
    trigger_baseline_value: 100, trigger_combinator: "all",
  }, { interval_days: 90 }) },
  { name: "sensor: state change held until done", task: sensor({
    type: "state_change", entity_id: "binary_sensor.door", entity_ids: ["binary_sensor.door"], trigger_from_state: "off",
    trigger_to_state: "on", trigger_target_changes: 5, trigger_hold_until_done: true,
  }) },
  { name: "sensor: runtime with a longest session", task: sensor({
    type: "runtime", entity_id: "switch.pump", entity_ids: ["switch.pump"], trigger_runtime_hours: 100, trigger_runtime_max_session_seconds: 7200,
  }) },
  { name: "sensor: a date sensor", task: sensor({ type: "due_date", entity_id: "sensor.next_service", entity_ids: ["sensor.next_service"], trigger_days_before: 14 }) },
  { name: "sensor: a compound of three", task: sensor({
    type: "compound", compound_logic: "AND", conditions: [
      { type: "threshold", entity_id: "sensor.a", entity_ids: ["sensor.a"], trigger_above: 3, trigger_attribute: "level" },
      { type: "counter", entity_id: "sensor.b", entity_ids: ["sensor.b"], trigger_target_value: 10, trigger_delta_mode: true },
      { type: "state_change", entity_id: "binary_sensor.c", entity_ids: ["binary_sensor.c"], trigger_to_state: "on", trigger_target_changes: 2 },
    ],
  }) },
  { name: "one-time with a due date and a time", task: { schedule_type: "one_time", due_date: "2026-12-01", schedule_time: "09:00" } },
  { name: "weekdays in a season, ending after 10", task: { schedule_type: "weekdays", schedule: { kind: "weekdays", weekdays: [0, 3], season_months: [4, 5, 6], ends: { count: 10 } } } },
  { name: "nth weekday in some months, ending on a date", task: { schedule_type: "nth_weekday", schedule: { kind: "nth_weekday", nth: 2, weekday: 5, months: [1, 7], ends: { until: "2027-06-30" } } } },
  { name: "last business day of the month, shifted", task: { schedule_type: "day_of_month", schedule: { kind: "day_of_month", day: -1, business: true, offset: 2 } } },
  { name: "from a calendar, a day before", task: { schedule_type: "calendar", schedule: { kind: "calendar", entity_id: "calendar.bins", offset: -1 } } },
  { name: "a manual meter reading", task: { schedule_type: "manual", type: "reading", reading_unit: "kWh", readings: [{ id: "r1", name: "Meter", unit: "kWh" }] } },
];

describe("beta task editor: every setting of the classic dialog", () => {
  for (const fx of FIXTURES) {
    it(`${fx.name}: the same controls`, async () => {
      const classic = await open(fx.task, { beta: false, ...fx.opts });
      const want = inventory(classic.root.querySelector(".content"));
      expect([...want.values()].reduce((a, b) => a + b, 0), "the classic form rendered").to.be.above(15);
      const beta = await open(fx.task, { beta: true, ...fx.opts });
      const got = await clickThrough(beta.el, beta.root);
      const missing = missingIn(want, got);
      expect(missing, `missing in the beta:\n${missing.join("\n")}`).to.deep.equal([]);
    });

    it(`${fx.name}: looking through every row saves what the classic saves`, async () => {
      const runs: Array<Array<Record<string, unknown>>> = [];
      for (const beta of [false, true]) {
        const m = await open(fx.task, { beta, ...fx.opts });
        if (beta) await clickThrough(m.el, m.root);
        const from = m.sent.length;
        await m.save();
        runs.push(m.sent.slice(from));
      }
      expect(runs[0].length, "the save sent something").to.be.above(0);
      expect(runs[1]).to.deep.equal(runs[0]);
    });
  }

  it("a new task: the object, the name and every other field (after the start screen)", async () => {
    const classic = await open({}, { beta: false, create: true });
    const want = inventory(classic.root.querySelector(".content"));
    const beta = await open({}, { beta: true, create: true });
    expect(beta.root.querySelector(".chooser"), "the start screen first").to.exist;
    expect(!!beta.root.querySelector(".beta-content select"), "the object picker on the start screen").to.equal(true);
    beta.root.querySelector<HTMLElement>(".chooser-scratch")!.click();
    await settle(beta.el);
    const got = await clickThrough(beta.el, beta.root);
    const missing = missingIn(want, got);
    expect(missing, `missing in the beta:\n${missing.join("\n")}`).to.deep.equal([]);
  });
});
