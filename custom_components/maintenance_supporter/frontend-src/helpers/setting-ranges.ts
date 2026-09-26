/** Bounds of the integer global settings — the TS mirror of the Python
 *  registry (`helpers/settings_registry.py` INT_RANGES), keyed by the
 *  `global/update` setting key. Keep the tuples in lockstep with Python:
 *  tests/test_frontend_const_parity.py asserts key-for-key equality.
 *
 *  Why a mirror at all: the WS sanitiser DROPS an out-of-range value
 *  silently (the toast still said "saved"), so every number input in the
 *  settings view takes its min/max from here and rejects out-of-range
 *  entries client-side with a toast instead (DRY audit 2026-09-12 — the
 *  panel had hard-coded max=100 for max_notifications_per_day and min=1 for
 *  budget_alert_threshold against a backend of 1000 / 10). */
export const SETTING_INT_RANGES: Record<string, [number, number]> = {
  default_warning_days: [0, 365],
  default_consumable_threshold: [1, 90],
  battery_low_percent: [1, 90],
  battery_recovered_percent: [20, 100],
  archive_oneoff_days: [0, 3650],
  delete_archived_oneoff_days: [0, 3650],
  notify_due_soon_interval_hours: [0, 720],
  notify_overdue_interval_hours: [0, 720],
  notify_triggered_interval_hours: [0, 720],
  max_notifications_per_day: [0, 1000],
  notification_bundle_threshold: [2, 20],
  snooze_duration_hours: [1, 168],
  warranty_reminder_days: [1, 365],
  budget_alert_threshold: [10, 100],
  currency_decimals: [0, 3],
};

/** The (min, max) of an int setting; throws on a typo so a wrong key fails
 *  loudly at render time rather than silently binding no bounds. */
export function settingIntRange(key: string): [number, number] {
  const r = SETTING_INT_RANGES[key];
  if (!r) throw new Error(`not an int-ranged setting: ${key}`);
  return r;
}

/** Vacation buffer days (`vacation/update` buffer_days). Not a registry
 *  setting — the bound lives in the WS schema of websocket/vacation.py;
 *  tests/test_frontend_const_parity.py pins this tuple to it. The panel's
 *  settings view and the Lovelace vacation card both validate against it
 *  (the view dropped an out-of-range value silently, the card sent it). */
export const VACATION_BUFFER_DAYS_RANGE: readonly [number, number] = [0, 14];
