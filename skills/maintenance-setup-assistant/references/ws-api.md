# WebSocket API contract — Maintenance Supporter

Authoritative command reference for the setup assistant. All command `type`
strings are namespaced `maintenance_supporter/…`. They ride Home Assistant's
core WebSocket API — there is **no custom auth**; authenticate with the standard
HA handshake and a Long-Lived Access Token.

## Envelope

Every request carries a client-assigned integer `id`.
- Success → `{"id", "type":"result", "success":true, "result": <payload>}`
- Error → `{"id", "type":"result", "success":false, "error":{"code","message"}}`

Payloads below are the `result` object.

## Length caps (silently enforced server-side)

`name ≤200`, free text (`notes`, `feedback`, `reason`) `≤2000`, URL `≤2048`,
icon `≤100`, meta strings (`area_id`, `manufacturer`, `model`, `serial_number`,
`responsible_user_id`) `≤200`, `type`/`schedule_type` `≤50`, id `≤64`, date
`≤20`, `entity_slug ≤64` (regex `[a-z0-9_]+`), `entity_id ≤255`,
`interval_days` `1..3650`, checklist ≤100 items each `≤500`. Over-length values
are trimmed/dropped by the sanitize layer even if the schema would accept them.

---

## Authorization

- `@require_write` (admin **or** allowlisted operator): all object/task
  create/update/delete/duplicate/archive/unarchive, `object/from_template`,
  `task/assign_user`, `task/history/update`.
- `@require_admin` (admin only): `global/update`, `global/test_notification`,
  bulk import, vacation writes. **The escalation boundary** — an operator can
  never enable `operator_write_enabled` or edit `admin_panel_user_ids`.
- No gate (any authenticated user): all read commands + `task/complete`,
  `task/quick_complete`, `task/skip`, `task/reset`.

Operator writes require: admin set `operator_write_enabled: true` **and** added
the user to `admin_panel_user_ids`. Otherwise non-admins are denied.

---

## Objects

An object has **no cost and no icon** field. Stored fields: `id` (server-set),
`name`, `area_id`, `manufacturer`, `model`, `serial_number`,
`installation_date`, `warranty_expiry`, `documentation_url`, `notes`,
`task_ids`, `archived_at?`.

### `object/create` — `@require_write`
```json
{ "type": "maintenance_supporter/object/create", "id": 1,
  "name": "Heating pump",              // REQUIRED, 1..200
  "area_id": "basement",               // optional | null
  "manufacturer": "Grundfos",          // optional | null
  "model": "UPS2 25-60",               // optional | null
  "serial_number": "…",                // optional | null
  "installation_date": "2021-03-15",   // optional, YYYY-MM-DD, else err invalid_date
  "warranty_expiry": "2026-03-15",     // optional, YYYY-MM-DD
  "documentation_url": "https://…",    // optional, http/https only, else invalid_url
  "notes": "…",                        // optional | null
  "dry_run": true }                    // optional; true = validate only
```
Result: `{"entry_id": "<config_entry_id>"}`. Dry-run: `{"valid": true, "entry_id": null}`.
Errors: `invalid_input` (empty name), `invalid_date`, `invalid_url`, `create_failed`.

**Uniqueness:** the name is slugified (lowercase, non-alphanumeric → `_`) into a
`unique_id`; a duplicate (case-insensitive) name aborts as `create_failed`.
Read `maintenance_supporter/objects` first to avoid collisions.

### `object/update` — `@require_write`
`{entry_id (req), + any create field}`. Partial: only present keys change.
Result: `{"success": true}`.

### `object/delete` — `@require_write`
`{entry_id}`. Result `{"success": true}`.

### `object/archive` / `object/unarchive` — `@require_write`
`{entry_id}`. Archive cascades `archived_reason:"object"` onto active tasks;
result `{"success": true, "archived_at": "<iso>"}`. Unarchive restores those
tasks (recurring ones re-anchored). Errors: `already_archived` / `not_archived`.

### Meter readings (v2.20, #83)
`reading`-type tasks accept `reading_unit` (str ≤32, e.g. "kWh") on
`task/create`/`task/update`, and `task/complete` accepts `reading_value`
(float) which is stored on the completion history entry. The panel derives
the delta between consecutive readings client-side.

### `object/pause` / `object/resume` — `@require_write` (v2.20)
Seasonal pause. Pause: `{entry_id, until?}` (`until` = ISO date, must be in the
future; omit for an open-ended pause) → `{"success": true, "paused_at",
"paused_until"}`. Tasks read status `paused` (frozen, nothing fires); the
coordinator auto-resumes on `until`. Resume: `{entry_id}` → `{"success": true}`;
recurring tasks re-anchor to a fresh cycle from today. Errors: `archived` /
`already_paused` / `not_paused` / `invalid_date`.

### `object/replace` — `@require_write` (v2.20)
`{entry_id, name?}` → `{entry_id: "<successor>"}`. Retires the old object
(archive cascade + `replaced_by_entry_id`) and creates a successor pre-filled
from it: task configs with fresh ids/counters, documents carried over
(refcounted), `installation_date` = today, serial/warranty cleared,
`predecessor_entry_id` set. Error: `archived` (already retired).

### Spare parts (2.23) — `part/*` — `@require_write`
`part/create` `{entry_id, name (req), vendor?, mpn?, gtin?  (EAN/UPC digits,
GS1 check-digit validated), storage_location?, product_url?, unit?, cost?,
stock? (int — omit for a catalog-only part), reorder_threshold?,
restock_quantity?, auto_buy_task?, notes?}` → `{part_id}`.
`part/update` `{entry_id, part_id, ...same fields}` (omitted fields keep their
stored values; `stock: null` untracks). `part/delete` `{entry_id, part_id}`
(also prunes task links + any open buy reminder). `part/restock`
`{entry_id, part_id, delta | absolute}` → `{stock}`.
Link consumption on the task: `task/create|update` accept
`consumes_parts: [{part_id, quantity}]`. Parts ride the `objects` payload
(each with merged `stock`, `is_low`, `shopping_url`). While a part with
`auto_buy_task` is at/below its threshold, a one-off "Buy {part}" task exists
(marker `part_ref`); completing it restocks (`task/complete` accepts
`restock_quantity`).

### `object/from_template` — `@require_write`
`{template_id (req), name?}` → `{entry_id}`. `object/duplicate` `{entry_id}` → `{entry_id}`.

---

## Tasks

### `task/create` — `@require_write`
```json
{ "type": "maintenance_supporter/task/create", "id": 2,
  "entry_id": "<object entry_id>",     // REQUIRED
  "name": "Replace filter",            // REQUIRED, 1..200
  "task_type": "replacement",          // wire key; stored as "type". default "custom".
                                       //   enum: cleaning|inspection|replacement|calibration|service|custom
  "schedule_type": "time_based",       // default. time_based|sensor_based|manual|one_time
  "interval_days": 90,                 // 1..3650 | null (time interval)
  "interval_unit": "days",             // days|weeks|months|years (default days)
  "interval_anchor": "completion",     // completion|planned
  "due_date": "2026-08-01",            // for one_time
  "warning_days": 7,                   // 0..365, default 7 (lead time before due)
  "last_performed": "2026-05-01",      // YYYY-MM-DD | null; seeds a completed history entry
  "trigger_config": { … },             // sensor trigger, see below | null
  "notes": "…",                        // ≤2000
  "documentation_url": "https://…",    // http/https
  "responsible_user_id": "<ha_user_id>",
  "entity_slug": "filter_replace",     // [a-z0-9_]+, ≤64, else invalid_entity_slug
  "custom_icon": "mdi:air-filter",     // per-task icon
  "nfc_tag_id": "…",                   // duplicate = warning, not error
  "checklist": ["Turn off power", "…"],// ≤100 items, each ≤500
  "schedule_time": "08:00",            // strict HH:MM
  "enabled": true,
  "dry_run": true }
```
Result: `{"task_id": "<uuid>"}` (+ `"warnings"` maybe). Dry-run:
`{"valid": true, "task_id": null}`. Errors: `invalid_input`,
`invalid_trigger_config`, `invalid_url`, `invalid_entity_slug`, `invalid_format`.

> **Time interval vs sensor trigger are orthogonal.** A calendar task uses
> `interval_days`/`interval_unit`. A sensor task uses `trigger_config`. A task
> may carry **both** (a sensor trigger plus a safety calendar interval).
> Time/calendar recurrence is **never** expressed inside `trigger_config`.

### `task/update` / `task/delete` / `task/duplicate` / `task/archive` / `task/unarchive` — `@require_write`
`update`: `{entry_id, task_id, + any task field}` (partial). `delete`:
`{entry_id, task_id}`. Recurrence edit: an explicit nested `schedule` wins; a
flat interval edit rebuilds from flat and drops the nested schedule.

### Task actions (no write gate)
- `task/complete` `{entry_id, task_id, notes?, cost? (0..1e6), duration? (min, 0..525600), checklist_state? {str:bool}, feedback? (needed|not_needed|not_sure)}` → `{"success": true}`
- `task/quick_complete` `{entry_id, task_id}` → `{"success": true, "via": "quick"}` (needs stored `quick_complete_defaults`, else `no_defaults`)
- `task/skip` `{entry_id, task_id, reason?}`
- `task/reset` `{entry_id, task_id, date?}` (ISO)
- `task/assign_user` `{entry_id, task_id, user_id|null}` — `@require_write`; `null` unassigns; unknown user → `invalid_user`

---

## trigger_config (sensor triggers only)

Free-form dict, whitelisted + validated server-side. Types:
`threshold` (default), `counter`, `state_change`, `runtime`, `compound`.
Any key outside the whitelist is stripped.

**Common keys** (all non-compound types):
- `entity_ids`: `list[str]` — canonical, ≥1 entity required. (`entity_id` single
  is legacy; auto-filled from `entity_ids[0]`.) Non-existent entity → warning.
- `entity_logic`: `"any"` | `"all"` (multi-entity aggregation; default `any`)
- `attribute`: `str|null` — monitor an attribute instead of the state value
- `auto_complete_on_recovery`: `bool` — auto-record completion when trigger clears

### `threshold`
`{"type":"threshold","entity_ids":["sensor.pressure"],"trigger_above":3.0,"trigger_below":1.2,"trigger_for_minutes":0}`
At least one of `trigger_above`/`trigger_below` required. Fires when value
crosses; `trigger_for_minutes` requires it to stay crossed that long.

### `counter`
`{"type":"counter","entity_ids":["sensor.odometer"],"trigger_target_value":15000,"trigger_delta_mode":true}`
`trigger_target_value` **required**. `trigger_delta_mode:false` (absolute) →
fires at `value ≥ target`. `true` (delta) → fires when `value − baseline ≥
target`; baseline captured at setup (best for odometers / ever-increasing meters).

### `state_change`
`{"type":"state_change","entity_ids":["sensor.dishwasher"],"trigger_from_state":"running","trigger_to_state":"clean","trigger_target_changes":30}`
Fires after `trigger_target_changes` matching transitions (default 1). Null/empty
`from`/`to` match any state (lowercased on save).

### `runtime`
`{"type":"runtime","entity_ids":["switch.pump"],"trigger_runtime_hours":500,"trigger_on_states":["on"]}`
`trigger_runtime_hours` **required**. Accumulates "on" time; default on-states
`{"on","1","true"}`. `trigger_on_states`, if given, must be a non-empty list.

### `compound`
`{"type":"compound","compound_logic":"OR","conditions":[ {…}, {…} ]}`
`compound_logic`: `"AND"`|`"OR"` (default AND). `conditions`: ≥2 non-compound
trigger dicts (threshold/counter/state_change/runtime), each validated
recursively and may carry its own `entity_ids`+`entity_logic`. **No nested
compound.** Two-level aggregation: within a condition (`entity_logic`), across
conditions (`compound_logic`). UI caps at 5 conditions.

---

## Time / calendar recurrence (NOT trigger_config)

Send flat fields (`interval_days` + `interval_unit` + `interval_anchor`, or
`due_date` for one-time). On persist they normalize into a canonical nested
`schedule` and the flat keys are dropped — reads echo BOTH forms back. Advanced
calendar kinds (only expressible via the nested `schedule` object):
- `{"kind":"interval","every":N,"unit":"days|weeks|months|years","anchor":"completion|planned"}`
- `{"kind":"one_time","due_date":"YYYY-MM-DD"}`
- `{"kind":"manual"}`
- `{"kind":"weekdays","weekdays":[0..6]}`  (0=Mon … 6=Sun)
- `{"kind":"nth_weekday","nth":1..5 or -1,"weekday":0..6,"months":[1..12]?}`  (-1 = last)
- `{"kind":"day_of_month","day":1..31,"months":[1..12]?}`

For most setup work, `interval_days` + `interval_unit` is all you need.

---

## Read & settings

### `statistics`
→ `{total_objects,total_tasks,overdue,due_soon,triggered,total_cost}`. Use to
verify counts before/after.

### `objects` / `object`
`objects` → `{objects:[{entry_id, object:{…}, tasks:[…]}]}`. `object`
`{entry_id}` → one such record. Task summaries include the computed
`status,is_done,days_until_due,next_due,trigger_active,trigger_current_value,
trigger_entity_info` plus both flat and nested schedule views — use these in
Phase 5 to confirm triggers resolved to real entities.

### `users/list`
→ `{users:[{id,name}]}` (admins also get `is_admin`,`is_owner`). Use to map a
person to `responsible_user_id`.

### `settings` (read) / `global/update` (admin-only write)
`settings` → full nested settings. `global/update` `{settings:{key:value}}`
accepts only whitelisted keys (unknown silently ignored); out-of-range/typed
values dropped. Keys relevant to setup:
- `notifications_enabled` (bool), `notify_service` (str; validated `notify.*`),
  `default_warning_days` (1..365), `panel_enabled` (bool), `panel_title` (str)
- `weekly_digest_enabled` (bool) — opt-in Monday summary
- `notify_{due_soon,overdue,triggered}_enabled` (bool) + `_interval_hours` (0..720)
- `quiet_hours_enabled`, `quiet_hours_start`/`end` ("HH:MM")
- `budget_monthly`/`budget_yearly` (float), `budget_currency` (EUR,USD,GBP,…),
  `budget_alerts_enabled`, `budget_alert_threshold` (10..100)
- `operator_write_enabled` (bool), `admin_panel_user_ids` (list[str]) — governance

Propose settings changes separately and only after the user opts in; they need
an admin token.

## Backup / migration — export & import

### `export` — admin — JSON/YAML backup
`{format:"json"|"yaml", include_history:bool, entry_ids?:[...]}` → `{format, data}`
(serialized string). `entry_ids` (optional) narrows to a selection of object
entries — a **selective** export to move one asset between installs; omit for
all. Carries every persisted field incl. parts+stock, consumes_parts, nested
schedule (season/ends/due_override), archived_at/created_at. Document file
*contents* are NOT here (see the documents archive below) — only metadata.

### `csv/export` — admin — flat CSV
`{entry_ids?:[...]}` → `{csv}`. One row per task, object columns repeated. A
reduced view: no parts / history / nested-schedule extras (tabular by design).

### `objects/csv` — one row per object (#67)
`{entry_ids?:[...]}` → `{csv}`. Asset table download (no cost/history), so not
admin-gated.

### `json/import` — admin — restore JSON **or YAML**
`{json_content:str}` (accepts JSON and YAML) → `{created, errors, ...}`. New ids
are generated; parts/consumes links are remapped. Selective because it restores
exactly the objects present in the payload.

### `csv/import` — admin — restore flat CSV
`{csv_content:str}` → `{created, ...}`.

### Documents archive (ZIP with file contents) — HTTP, admin
Not WebSocket — the blobs are binary. `GET /api/maintenance_supporter/documents/archive`
(optional `?entry_ids=a,b`) streams a ZIP (`manifest.json` + `blobs/<sha256>`);
fetch via a signed path (`auth/sign_path`). `POST` the same URL with multipart
`file=<zip>` restores blobs and re-attaches metadata (matches objects by id,
then by name for a cross-instance restore; idempotent). This is the one export
that carries uploaded file *contents* — pair it with a JSON export for a
complete, portable backup.


## Problem sensors — adopt HA `device_class: problem` binary sensors

### `problem_sensors/discover` — read
`{}` → `{sensors:[{entity_id,name,state,device_id,device_name,area_name,
suggested_entry_id,suggested_object_name}]}`. Lists adoptable problem sensors
NOT already watched by a task (`state:"on"` = problem active now).

### `problem_sensors/adopt` — @require_write
`{selections:[{entity_id,name,entry_id?,object_name?,device_id?}]}` →
`{tasks_created,objects_created,total,errors?}`. Each selection becomes a task
that triggers while the sensor is on and auto-completes on recovery
(`state_change` → `on` + `auto_complete_on_recovery`). With `entry_id` it
attaches to that object; otherwise a fresh object (`object_name`, bound to
`device_id`) is created — two selections sharing a `device_id` reuse one object.
