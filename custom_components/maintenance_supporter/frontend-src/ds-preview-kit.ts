/** design-sync preview kit: a demo household behind a mock `hass`.
 *
 * Every component in this library reads live data through `hass` (WS calls
 * against the integration's backend). Outside Home Assistant — DS previews
 * and designs built with this bundle — there is no backend, so this module
 * provides one in miniature: `dsDemoHass()` returns a `hass` look-alike whose
 * `sendMessagePromise` answers the library's read endpoints from a small,
 * realistic demo household (3 objects, 9 tasks across every status, parts,
 * history, users, budget). Mutations resolve `{success: true}` without
 * changing anything.
 *
 * Response shapes mirror the backend handlers 1:1 (same source of truth as
 * `__tests__/_test-utils.ts` / `_panel-utils.ts`); when the backend grows a
 * field the previews depend on, extend DEMO below.
 *
 * `dsProps(obj)` is a React-ref helper for setting element PROPERTIES from
 * JSX (custom elements only get attributes from JSX props):
 *   <maintenance-complete-dialog ref={dsProps({ hass: dsDemoHass(), taskName: "Filter" })} />
 */

export type DsWsHandler = (msg: Record<string, unknown>) => unknown;

// ── demo household ─────────────────────────────────────────────────────────

const T = (over: Record<string, unknown>) => ({
  type: "custom",
  schedule_type: "time_based",
  interval_days: 30,
  interval_unit: "days",
  warning_days: 7,
  status: "ok",
  days_until_due: 12,
  next_due: "2026-09-05",
  last_performed: "2026-08-06",
  trigger_active: false,
  trigger_current_value: null,
  trigger_config: null,
  times_performed: 4,
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
});

const HISTORY = [
  { timestamp: "2026-08-06T09:12:00+00:00", type: "completed", notes: "Rinsed and dried the filter", cost: 0, duration: 15, completed_by: "admin-1" },
  { timestamp: "2026-07-05T16:40:00+00:00", type: "completed", cost: 24.9, duration: 20 },
  { timestamp: "2026-06-07T10:05:00+00:00", type: "skipped", notes: "On vacation" },
  { timestamp: "2026-05-04T08:30:00+00:00", type: "completed", duration: 15 },
];

const OBJECTS = [
  {
    entry_id: "demo_hvac",
    object_id: "obj_demo_hvac",
    object: { id: "obj_demo_hvac", name: "HVAC Unit", area_id: "living_room", manufacturer: "Daikin", model: "FTXM35", serial_number: "DK-2231-88", task_ids: [] },
    document_count: 2,
    tasks: [
      T({ id: "t_filter", name: "Clean air filter", status: "overdue", days_until_due: -6, next_due: "2026-08-18", history: HISTORY, times_performed: 12, total_cost: 74.7, average_duration: 17, checklist: ["Remove front cover", "Vacuum filter", "Rinse and dry", "Reinsert"], labels: ["filters"], priority: "high" }),
      T({ id: "t_coils", name: "Inspect condenser coils", status: "due_soon", days_until_due: 3, next_due: "2026-08-27", interval_days: 180 }),
      T({ id: "t_refrigerant", name: "Professional service", status: "ok", days_until_due: 122, next_due: "2026-12-24", interval_days: 365, priority: "low" }),
    ],
  },
  {
    entry_id: "demo_vacuum",
    object_id: "obj_demo_vacuum",
    object: { id: "obj_demo_vacuum", name: "Robot Vacuum", area_id: "hallway", manufacturer: "Roborock", model: "S8 Pro", serial_number: null, task_ids: [] },
    document_count: 1,
    tasks: [
      T({
        id: "t_brush", name: "Replace main brush", status: "triggered", trigger_active: true, trigger_current_value: 312.4,
        schedule_type: "sensor_based", interval_days: null, days_until_due: null, next_due: null,
        trigger_config: { type: "runtime", entity_id: "sensor.vacuum_brush_hours", trigger_runtime_hours: 300 },
      }),
      T({ id: "t_dustbin", name: "Empty dust bin", status: "ok", days_until_due: 2, next_due: "2026-08-26", interval_days: 3, warning_days: 1, times_performed: 89 }),
      T({ id: "t_sensor_wipe", name: "Wipe cliff sensors", status: "due_soon", days_until_due: 1, next_due: "2026-08-25", interval_days: 14 }),
    ],
  },
  {
    entry_id: "demo_pool",
    object_id: "obj_demo_pool",
    object: { id: "obj_demo_pool", name: "Pool Pump", area_id: "garden", manufacturer: "Intex", model: "SX2100", serial_number: "IX-9034", task_ids: [] },
    document_count: 0,
    tasks: [
      T({ id: "t_backwash", name: "Backwash sand filter", status: "ok", days_until_due: 9, next_due: "2026-09-02", interval_days: 21, responsible_user_id: "user-2" }),
      T({ id: "t_ph", name: "Test water chemistry", status: "overdue", days_until_due: -2, next_due: "2026-08-22", interval_days: 7, type: "reading", priority: "high" }),
      T({ id: "t_winterize", name: "Winterize pump", status: "ok", schedule_type: "one_time", interval_days: null, days_until_due: 68, next_due: "2026-10-31" }),
    ],
  },
];

const PARTS = [
  { id: "p_filter", name: "HEPA filter", stock: 2, min_stock: 1, unit: "pcs", storage_location: "Utility shelf", cost: 12.5 },
  { id: "p_brush", name: "Main brush", stock: 0, min_stock: 1, unit: "pcs", storage_location: "Utility shelf", cost: 18.9 },
  { id: "p_chlorine", name: "Chlorine tabs", stock: 14, min_stock: 5, unit: "tabs", storage_location: "Garden shed", cost: 0.8 },
];

const USERS = [
  { id: "admin-1", name: "Alex", is_admin: true },
  { id: "user-2", name: "Sam", is_admin: false },
];

const BATTERY_ROSTER = [
  { device_id: "bat_smoke", name: "Smoke Detector Hall", battery_type: "9V", level: 12, status: "due", source: "battery_notes", predicted_date: "2026-08-30", last_replaced: "2025-11-02" },
  { device_id: "bat_door", name: "Front Door Sensor", battery_type: "CR2032", level: 34, status: "soon", source: "battery_notes", predicted_date: "2026-10-12", last_replaced: "2026-01-15" },
  { device_id: "bat_remote", name: "Bedroom Remote", battery_type: "AAA", level: 81, status: "ok", source: "native", predicted_date: null, last_replaced: null },
  { device_id: "bat_ring", name: "Fitness Ring", battery_type: "Rechargeable", level: 64, status: "ok", source: "battery_notes", self_charging: true, predicted_date: null, last_replaced: null },
];

const SETTINGS = {
  features: {
    adaptive: true, predictions: true, seasonal: true, environmental: false,
    budget: true, groups: true, checklists: true, schedule_time: true,
    completion_actions: true,
  },
  admin_panel_user_ids: [] as string[],
  operator_write_enabled: false,
  general: { default_warning_days: 7, notifications_enabled: true, notify_service: "notify.mobile_app_demo", notify_targets: [] as string[], panel_enabled: true },
  notifications: {
    due_soon_enabled: true, due_soon_interval_hours: 24,
    overdue_enabled: true, overdue_interval_hours: 12,
    triggered_enabled: true, triggered_interval_hours: 0,
    quiet_hours_enabled: true, quiet_hours_start: "22:00", quiet_hours_end: "08:00",
    max_per_day: 0, bundling_enabled: false, bundle_threshold: 2,
    title_style: "default",
  },
  actions: { complete_enabled: true, skip_enabled: true, snooze_enabled: false, snooze_duration_hours: 4 },
  budget: { monthly: 150, yearly: 1500, alerts_enabled: true, alert_threshold_pct: 80, currency: "EUR", currency_symbol: "€" },
  vacation: { enabled: false, start: null as string | null, end: null as string | null, buffer_days: 3, exempt_task_ids: [] as string[], is_active: false, window_end: null as string | null },
};

// ── read-endpoint handlers ─────────────────────────────────────────────────

const READS: Record<string, DsWsHandler> = {
  "maintenance_supporter/objects": () => ({ objects: OBJECTS }),
  "maintenance_supporter/object": (msg) => OBJECTS.find((o) => o.entry_id === msg.entry_id) ?? OBJECTS[0],
  "maintenance_supporter/statistics": () => ({
    total_objects: 3, total_tasks: 9, overdue: 2, due_soon: 2, triggered: 1, ok: 4,
    total_cost: 214.6, completions_this_month: 5,
  }),
  "maintenance_supporter/budget_status": () => ({
    monthly_budget: 150, monthly_spent: 37.4, yearly_budget: 1500, yearly_spent: 812.55,
    alert_threshold_pct: 80, currency_symbol: "€",
  }),
  "maintenance_supporter/settings": () => SETTINGS,
  "maintenance_supporter/users/list": () => ({ users: USERS }),
  "maintenance_supporter/tags/list": () => ({ tags: ["filters", "outdoor", "safety"] }),
  "maintenance_supporter/groups": () => ({
    groups: {
      g_seasonal: { name: "Seasonal", task_refs: [{ entry_id: "demo_pool", task_id: "t_winterize" }], color: "#43a047" },
      g_weekly: { name: "Weekly routine", task_refs: [{ entry_id: "demo_vacuum", task_id: "t_dustbin" }, { entry_id: "demo_pool", task_id: "t_ph" }], color: "#03a9f4" },
    },
  }),
  "maintenance_supporter/documents/list": () => ({
    documents: [
      { id: "doc_manual", title: "FTXM35 owner's manual", kind: "file", file_name: "ftxm35-manual.pdf", mime: "application/pdf", size: 2400000, task_ids: ["t_filter"], part_ids: [] },
      { id: "doc_link", title: "Filter cleaning guide", kind: "weblink", url: "https://example.com/filter-guide", task_ids: ["t_filter"], part_ids: ["p_filter"] },
    ],
  }),
  "maintenance_supporter/documents/storage": () => ({ used_bytes: 5100000, max_bytes: 52428800, document_count: 3 }),
  "maintenance_supporter/views/list": () => ({ views: [{ id: "v_mine", name: "My tasks", filters: { responsible: "admin-1" } }] }),
  "maintenance_supporter/vacation/state": () => ({ enabled: false, is_active: false, start: null, end: null, buffer_days: 3, exempt_task_ids: [] }),
  "maintenance_supporter/parts/overview": () => ({ parts: PARTS.map((p) => ({ ...p, object_name: "HVAC Unit", entry_id: "demo_hvac" })) }),
  "maintenance_supporter/task/history": () => ({ history: HISTORY }),
  "maintenance_supporter/battery_fleet/status": () => ({ configured: true, entry_id: "demo_hvac", task_id: "t_batteries" }),
  "maintenance_supporter/battery_fleet/overview": () => ({
    batteries: BATTERY_ROSTER, due: 1, soon: 1, total: 4,
    shopping: [{ battery_type: "9V", count: 1 }, { battery_type: "CR2032", count: 1 }],
  }),
  "maintenance_supporter/battery_fleet/overview_history": () => ({
    history: [
      { timestamp: "2026-07-30T10:00:00+00:00", type: "completed", notes: "Replaced: Smoke Detector Hall (9V)" },
      { timestamp: "2026-05-14T18:20:00+00:00", type: "completed", notes: "Replaced: Front Door Sensor (CR2032)" },
    ],
  }),
  "maintenance_supporter/templates": () => ({ templates: [] }),
  "maintenance_supporter/version": () => ({ version: "2.63.1" }),
  "maintenance_supporter/notify/user_targets": () => ({ targets: [] }),
  "maintenance_supporter/entity/attributes": () => ({ attributes: {} }),
  "maintenance_supporter/schedule/preview": () => ({ occurrences: ["2026-09-05", "2026-10-05", "2026-11-05"], series_ended: false }),
  "maintenance_supporter/task/seasonal_overrides": () => ({ overrides: [] }),
};

// ── the mock hass ──────────────────────────────────────────────────────────

export interface DsDemoHassOptions {
  /** Per-type overrides — win over the built-in demo handlers. */
  handlers?: Record<string, DsWsHandler>;
  language?: string;
}

export function dsDemoHass(opts: DsDemoHassOptions = {}) {
  const sendMessagePromise = async (msg: Record<string, unknown>): Promise<unknown> => {
    const t = String(msg.type ?? "");
    const h = opts.handlers?.[t] ?? READS[t];
    if (h) return h(msg);
    return { success: true };
  };
  return {
    language: opts.language ?? "en",
    user: { id: "admin-1", name: "Alex", is_admin: true },
    areas: { living_room: { name: "Living Room" }, hallway: { name: "Hallway" }, garden: { name: "Garden" } },
    states: {},
    services: {},
    connection: {
      sendMessagePromise,
      subscribeMessage: async () => () => undefined,
    },
    callService: async () => undefined,
  };
}

/** React ref-callback that assigns PROPERTIES on a custom element. */
export function dsProps(props: Record<string, unknown>) {
  return (el: unknown): void => {
    if (el) Object.assign(el as Record<string, unknown>, props);
  };
}

export const DS_DEMO = { OBJECTS, PARTS, USERS, HISTORY, BATTERY_ROSTER, SETTINGS };
