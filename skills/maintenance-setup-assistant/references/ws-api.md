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

All **81** registered commands are covered here. Their authorization tiers are
frozen in `tests/test_ws_permission_matrix.py` — that test is the inventory of
record; this file is its prose companion.

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
  `task/assign_user`, `task/history/update`, `task/apply_suggestion`,
  `task/seasonal_overrides`, `task/set_environmental_entity`, `part/*`,
  `documents/{add_link,update,delete}`, `group/{create,update,delete}`,
  `views/{save,delete}`, `problem_sensors/adopt`,
  `integration_setups/adopt`, `battery_fleet/{setup,mark_replaced,set_excluded}`.
- `@require_admin` (admin only): `global/update`, `global/test_notification`,
  `notify/user_targets`,
  bulk import **and export** (`export`, `csv/export`, `json/import`,
  `csv/import`), vacation writes (`vacation/update`, `vacation/end_now`).
  **The escalation boundary** — an operator can never enable
  `operator_write_enabled` or edit `admin_panel_user_ids`.
- No gate (any authenticated user): all read commands + `task/complete`,
  `task/quick_complete`, `task/skip`, `task/reset`, `task/postpone`,
  `task/snooze`, `task/checklist_progress`.

Operator writes require: admin set `operator_write_enabled: true` **and** added
the user to `admin_panel_user_ids`. Otherwise non-admins are denied.

---

## Objects

An object has **no cost and no icon** field. Stored fields: `id` (server-set),
`name`, `area_id`, `manufacturer`, `model`, `serial_number`,
`installation_date`, `warranty_expiry`, `documentation_url`, `notes`,
`ha_device_id` (bind the object to an EXISTING HA device — its entities then
land on that device's page; also what makes suggested setups recognise the
object), `parent_entry_id` (nest under another maintenance object — written to the
device registry as `via_device_id` after setup),
`task_ids`, `archived_at?`, `paused_at?`/`paused_until?` (seasonal pause),
`predecessor_entry_id?`/`replaced_by_entry_id?` (the `object/replace` chain),
and `parts` (spare parts, see below). The `objects` / `object` responses add
two computed (never stored) fields: `document_count` and `manual_docs`
(attached documents tagged "manual" as `{id, title, kind, url?}` — the panel's
manual-column fallback when `documentation_url` is empty).

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
  "ha_device_id": "<device_id>",       // optional; bind to an existing HA device
  "parent_entry_id": "<entry_id>",     // optional; nest under another object
  "dry_run": true }                    // optional; true = validate only
```
Result: `{"entry_id": "<config_entry_id>"}`. Dry-run: `{"valid": true, "entry_id": null}`.
Errors: `invalid_input` (empty name), `invalid_date`, `invalid_url`, `create_failed`,
`invalid_device` (unknown `ha_device_id`), `self_link_device` (the device belongs
to Maintenance Supporter itself — the object's own twin or a sibling object's
device; pick the appliance integration's device, for hierarchy use
`parent_entry_id`).

**Uniqueness:** the name is slugified (lowercase, non-alphanumeric → `_`) into a
`unique_id`; a duplicate (case-insensitive) name aborts as `create_failed`.
Read `maintenance_supporter/objects` first to avoid collisions.

### `object/update` — `@require_write`
`{entry_id (req), + any create field}`. Partial: only present keys change.
Result: `{"success": true}`. Same field errors as create, incl.
`invalid_device` / `self_link_device` for `ha_device_id`.

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
`consumes_parts: [{part_id, quantity, entry_id?}]`. **`entry_id` (2.44+, #111)
names another object that owns the pool** — several appliances sharing one box
of filters; omit it for a part of the task's own object. Both write paths
validate the reference and drop a link whose object or part does not exist, and
`task/complete`'s `used_parts` takes the same shape. Deleting an object that
owns a shared pool moves the part and its stock to the longest-standing
borrower and repoints the other links. Parts ride the `objects` payload
(each with merged `stock`, `is_low`, `shopping_url`). While a part with
`auto_buy_task` is at/below its threshold, a one-off "Buy {part}" task exists
(marker `part_ref`); completing it restocks (`task/complete` accepts
`restock_quantity`).

### `templates` — read — **the shipped object catalog**
`{language?}` (BCP-47-ish, ≤10 chars; defaults to the server language) →
```json
{ "categories": {"<cat_id>": {…}},
  "templates": [ { "id": "coffee_machine", "name": "Espresso Machine",
                   "category": "kitchen", "disabled": false,
                   "tasks": [ {"name":"Descale","type":"cleaning",
                               "schedule_type":"time_based",
                               "interval_days":90,"warning_days":7} ] } ] }
```
**Call this before hand-building anything.** The integration ships **45**
curated object templates (kitchen, heating, garden, vehicle, health, …), each
with its tasks, types and interval defaults already chosen and localized. It is
the only way to enumerate the `template_id` values `object/from_template`
consumes. `disabled: true` = the admin hid it from the pickers in Settings —
don't propose those. Everything a template creates stays fully editable
afterwards, so "template + edits" beats a hand-built object nearly every time.

### `object/from_template` — `@require_write`
`{template_id (req), name?}` → `{entry_id}`. Creates the object **and all of the
template's tasks** in one call. `object/duplicate` `{entry_id}` → `{entry_id}`.

---

## Tasks

### `task/create` — `@require_write`
```json
{ "type": "maintenance_supporter/task/create", "id": 2,
  "entry_id": "<object entry_id>",     // REQUIRED
  "name": "Replace filter",            // REQUIRED, 1..200
  "task_type": "replacement",          // wire key; stored as "type". default "custom".
                                       //   enum: cleaning|inspection|replacement|calibration|service|reading|custom
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
- `task/checklist_progress` `{entry_id, task_id, checklist_state (req, {item text: bool})}` →
  `{"success": true, "checklist_state": {...}}` — persists in-cycle ticks WITHOUT
  completing (#73). The dict REPLACES the stored progress; unknown items are
  dropped; completing or skipping clears it. Echoed on every task as
  `checklist_progress`.
- `task/skip` `{entry_id, task_id, reason?}`
- `task/reset` `{entry_id, task_id, date?}` (ISO)
- `task/postpone` `{entry_id, task_id, until (req, YYYY-MM-DD)}` → `{"success": true}` —
  defers **this occurrence only** to a chosen date; the recurrence itself is untouched.
  Bad date → `invalid_date`.
- `task/snooze` `{entry_id, task_id}` → `{"success": true}` — silences due-soon /
  overdue / triggered reminders for the configured `snooze_duration_hours`.
  Changes neither schedule nor status, and is in-memory only (a full HA restart
  forgets it). Without a configured notifier → `unavailable`.
- `task/assign_user` `{entry_id, task_id, user_id|null}` — `@require_write`; `null` unassigns; unknown user → `invalid_user`

### `task/list` — read
`{entry_id?}` → `{tasks:[…]}`. Every task across all objects (or one object's),
each summary carrying `task_id`, `entry_id`, `object_name` plus the computed
status fields. The flat counterpart to `objects` when you only care about tasks.

### `tasks/by_user` — read (self) / write (others)
`{user_id (req)}` → `{tasks:[…]}` — the tasks assigned to that user, with
`object_name`+`entry_id` on each. A plain user may query **their own** id only;
another user's assignments need write permission, else `unauthorized`.

### Adaptive scheduling & analysis
- `task/analyze_interval` — read — `{entry_id, task_id}` →
  `{current_interval, average_actual_interval, interval_std_dev, ewa_prediction,
  weibull_prediction, weibull_beta, weibull_eta, weibull_r_squared,
  recommended_interval, confidence, confidence_interval_low/high, feedback_count,
  data_points, recommendation_reason, seasonal_factor, seasonal_factors,
  seasonal_reason}`. Pure analysis of the completion history — nothing is written.
  Unknown task → `not_found`.
- `task/apply_suggestion` — `@require_write` — `{entry_id, task_id, interval
  (1..3650)}` → `{"success": true}`. Writes an analysed interval onto the task.
- `task/seasonal_overrides` — `@require_write` — `{entry_id, task_id, overrides:
  {"<month 1..12>": factor 0.1..5.0}}` (≤12 keys; `{}` clears them) →
  `{"success": true, "overrides": {…}}`. Manual per-month interval multipliers.
- `task/set_environmental_entity` — `@require_write` — `{entry_id, task_id,
  environmental_entity?, environmental_attribute?}` → `{"success": true,
  environmental_entity, environmental_attribute}`. Correlates an outside signal
  (outdoor temperature…) with the interval; `environmental_entity: null` clears
  the binding (and drops the attribute with it).

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

### `version`
→ `{version:"2.42.1"}` — the installed integration (manifest) version. The
panel uses it for the stale-bundle handshake; useful for the assistant to
report/verify what is running.

### `statistics`
→ `{total_objects,total_tasks,overdue,due_soon,triggered,total_cost}`. Use to
verify counts before/after.

### `subscribe` — read — live push
`{}` → an immediate empty result, then a stream of `event` messages
`{objects:[…]}` in the same shape as the `objects` read, pushed on every
coordinator update (and when a new object entry appears). Unsubscribe with HA's
standard `unsubscribe_events` on the same message id. Useful to watch a trigger
flip during verification; a plain `objects` re-read is enough for one-shot checks.

### `schedule/preview` — read — "your next three dates"
`{schedule (req, nested Schedule dict), last_performed?, times_performed?
(0..100000, default 0), count? (1..10, default 3)}` →
`{occurrences:["YYYY-MM-DD", …], series_ended: bool}`. Runs a **draft**
recurrence through the real scheduling engine (nothing is stored), simulating an
on-time completion per step — so completion-anchored intervals, calendar kinds,
season windows and finite series all advance exactly as they will in production.
Use it to show the user concrete dates before `task/create`. Bad
`last_performed` → `invalid_date`; an unusable schedule → `invalid_input`.

### `budget_status` — read
`{}` → `{monthly_budget, monthly_spent, yearly_budget, yearly_spent,
alert_threshold_pct, currency_symbol}` — spend summed from completion history
costs in the current month/year against the configured budgets.

### `entity/attributes` — read
`{entity_id}` → the attributes worth monitoring on that entity (domain mapping
merged with the live state). Call it before putting `attribute` into a
`trigger_config` so you offer real keys instead of guessing.

### `tags/list` — read
`{}` → `{tags:[{id,name}]}` — the HA NFC tag registry, for filling a task's
`nfc_tag_id`. Names are resolved from the entity registry (tags read back as
bare UUIDs otherwise after a restart).

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

### `global/test_notification` / `notify/user_targets` — admin
- `global/test_notification` `{user_id?}` → `{success, result, message}`.
  Without `user_id` the household service is tested. With one, the send is
  resolved exactly like a real reminder for that person, so a green result
  actually proves their phone is reachable. `result` is `success`,
  `no_service`, `invalid_service`, `failed`, or `user_no_device` (that member
  has no Companion device, so nothing was sent and their reminders fall back
  to the household service).
- `notify/user_targets` `{}` → `{targets:[{user_id,name,services}]}` — which
  notify services each household member resolves to, empty list meaning the
  fallback applies. Admin-only because the service names carry device names.

### `groups` / `group/create` / `group/update` / `group/delete`
Groups bundle tasks from **different objects** under one name ("Spring
service"), for grouped panel lists and grouped notifications.
- `groups` — read — `{}` → `{groups:{"<group_id>":{name,description,task_refs:[{entry_id,task_id}]}}}`.
- `group/create` — `@require_write` — `{name (req), description?, task_refs?}` → `{group_id}`.
- `group/update` — `@require_write` — `{group_id (req), name?, description?, task_refs?}` (partial) → `{"success": true}`.
- `group/delete` — `@require_write` — `{group_id}` → `{"success": true}`. Unknown id → `not_found`.

### QR codes — `qr/generate` / `qr/batch_generate` — read
- `qr/generate` `{entry_id (req), task_id?, action? (view|complete|quick_complete,
  default view), url_mode? (server|local|companion, default server), base_url?}`
  → `{svg_data_uri, url, label:{object_name,manufacturer,model,task_name}}`.
  A sticker for an object or one task. No HA URL configured → `no_url`.
- `qr/batch_generate` `{entry_ids?, task_ids?, actions (req, ≥1 of
  view|complete|skip|quick_complete), url_mode?, base_url?}` →
  `{qrs:[{entry_id,task_id,object_name,task_name,action,svg}], total}`. Omitted
  filters mean "all" at that level. Capped at 200 QRs per call (`too_many`).

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

## Documents — manuals, invoices, web-links

Everything JSON rides the WebSocket; binary **upload/download** goes through the
authenticated HTTP views (a websocket frame is a poor fit for a 20 MB PDF). Reads
are open, mutations are `@require_write` — documents are object content, not
global config.

### `documents/list` — read
`{entry_id}` → `{documents:[…]}` — one object's documents, newest first.

### `documents/search` — read
`{query (req, ≤200)}` → `{results:[{id,entry_id,object_name,kind,title,filename,
url,size,tags}]}`. Substring match over title / filename / url / mime / tags
across **all** objects; ≤50 hits. The fastest way to answer "do we already have
the manual for X?".

### `documents/storage` — read
`{}` → the global storage summary (physical vs logical bytes, per object and
category). Blobs are refcounted — the same file on two objects costs bytes once.

### `documents/add_link` — `@require_write`
`{entry_id (req), url (req, absolute http/https), title?, tags? (≤20 × ≤64)}` →
the created document. Costs 0 storage and is not carried in backups (it's a
reference, not a file). A relative or non-http(s) URL → `invalid_url`. This is
the right home for a manufacturer manual you found in Phase 3.

### `documents/update` — `@require_write`
`{doc_id (req), title?, tags?, task_ids? (≤100), task_pages? {task_id: page},
part_ids? (≤100)}` → the updated document. Only present keys change; a present
but empty `title` clears it. `task_pages` makes "open the manual at the right
page" work per task (PDF `#page=N`). Unknown id → `not_found`.

### `documents/delete` — `@require_write`
`{doc_id}` → `{"success": true, "bytes_freed": N}`. Bytes come back only when
the **last** reference to a blob goes.

## Suggested setups — the shipped signature catalog

**Use this before hand-rolling discovery.** The integration ships a catalog of
**123 integrations / 229 verified signatures** (`helpers/signatures/`, every
entry read against the integration's own source) that maps consumable and wear
entities onto maintenance duties. Discovery runs **server-side**: it walks the
entity registry, applies the model/sibling/unit gates, hides duties already
watched by an existing task, and hands back devices with their triggers already
chosen. You get better wiring than any state heuristic can infer, and adoption
never trusts client-supplied thresholds.

### `integration_setups/discover` — read
`{}` → `{setups:[{device_id, device_name, area_name, integration,
integration_name, suggested_entry_id, suggested_object_name,
tasks:[{task_name, task_name_localized, entity_ids, threshold, direction}]}]}`.

`suggested_entry_id` is the maintenance object already bound to that device
(adopt extends it instead of creating a duplicate); it is `null` when the device
is new to us, and `suggested_object_name` then falls back to the device name.
`direction` says which shape the duty is (`percent_left`, `duration_left`,
`usage_above`, `usage_delta`, `runtime_hours`, `event_present`, `alert_above`,
`value_below`, `cycle_count`) and `threshold` is the adoption-time default in the
entity's own display unit. `task_name` is the **English catalog key** — adopt
selections match on it; `task_name_localized` is what you show the user.

### `integration_setups/adopt` — `@require_write`
`{selections:[{device_id (req), entry_id?, object_name?, task_names?,
baselines? {task_name: number}}]}` (1..50 selections) →
`{tasks_created, objects_created, total, errors?}`.

Discovery is re-run server-side on adopt, so the entities and thresholds always
come from the catalog. Omit `task_names` to adopt every suggested duty. Without
`entry_id` the suggested/new object is created and bound to the device (an
existing object picked by `entry_id` gets bound too, so future discovery
recognises it). `baselines` is the "#102 last service was at reading X" input —
only meaningful for `usage_delta` duties, where the delta then counts from X, so
an already-elapsed interval comes due immediately.

## Problem sensors — adopt HA `device_class: problem` binary sensors

### `problem_sensors/discover` — read
`{}` → `{sensors:[{entity_id,name,state,device_id,device_name,area_name,
suggested_entry_id,suggested_object_name,suggested_part_id,suggested_part_name}]}`.
Lists adoptable problem sensors NOT already watched by a task (`state:"on"` =
problem active now). When the suggested existing object owns a spare part whose
name matches the sensor's (toner-low ↔ "Toner cartridge"), `suggested_part_*`
carry it so adoption can pre-link it.

### `problem_sensors/adopt` — @require_write
`{selections:[{entity_id,name,entry_id?,object_name?,device_id?,part_id?}]}` →
`{tasks_created,objects_created,total,errors?}`. Each selection becomes a task
that triggers while the sensor is on and auto-completes on recovery
(`state_change` → `on` + `auto_complete_on_recovery`). With `entry_id` it
attaches to that object; otherwise a fresh object (`object_name`, bound to
`device_id`) is created — two selections sharing a `device_id` reuse one object.
A `part_id` (from discovery's suggestion) links the part as the task's
`consumes_parts` (qty 1) — completing the task then consumes/restocks it;
unknown ids are silently dropped.

## Battery Fleet — one task for every battery in the house

Instead of one threshold task per battery, the integration aggregates all
**Battery Notes** devices into a SINGLE maintenance task plus a per-type
shopping list (AA, AAA, CR2032 …). Do not propose per-battery threshold tasks —
offer the fleet.

### `battery_fleet/overview` — read
`{}` → `{available` (any batteries at all)`, has_battery_notes, configured`
(the fleet object exists)`, task_ok` (its task + trigger are intact)`, entry_id,
total, low, soon, needs_now:{type:count}, needs_soon:{…}, types,
excluded:[{entity_id,device_name}]}`.

### `battery_fleet/setup` — `@require_write`
`{language?}` → creates (or idempotently reconciles) the fleet object, its
per-type parts and the one task, with names localized to `language`. Also the
one-click repair when `task_ok` is false. No batteries found → `not_available`.

### `battery_fleet/mark_replaced` — `@require_write`
`{entity_ids?}` → marks those batteries replaced (presses their Battery Notes
button and consumes the matching type-parts). Omit `entity_ids` to mark
everything currently low.

### `battery_fleet/set_excluded` — `@require_write`
`{entity_id (req), excluded (req, bool)}` → `{"success": true}`. Keeps a
self-charging or retired device out of the fleet (and puts it back). Fleet not
set up → `not_configured`.

## Saved filter views — shared named panel-list filter combinations

Views bundle the task-list filters (`status`, `user_id`, `label`, `archived`)
plus `sort_mode` + `group_by` under a name. One shared list on the global entry;
everything is re-sanitised on read/save (unknown values coerce to the permissive
default). Note the field is `view_id`, not `id` — `id` is the WS message id.

Views are not display-only: the global setting `notify_scope_view_id` scopes
**notifications** to one view, and that routing honours the task-selecting
filters (`label`, `user_id`) while ignoring the display ones (status, archived,
sort/group). So "only notify about the garden tasks" is a view + that setting.

### `views/list` — read
`{}` → `{views:[{id,name,filters:{status,user_id,label,archived,sort_mode,group_by}}]}`.

### `views/save` — @require_write
`{name, view_id?, filters?}` → `{views:[...], saved_id}`. Omit `view_id` to
create; include it to update in place. Rejects past 50 views (`too_many_views`).

### `views/delete` — @require_write
`{view_id}` → `{views:[...]}`. No-op if the id doesn't exist.

## Vacation mode — pause reminders for a date window

One global window with a buffer and an exemption list; exempt tasks keep
notifying (the cat's medication doesn't care that you're away).

### `vacation/state` — read
`{}` → the current config + `active` flag.

### `vacation/preview` — read
`{}` → `{rows:[…], window_end}` — the projected impact of the **currently
stored** dates, even while the toggle is off (that's the "Preview impact"
button). No start/end stored → `{rows: [], window_end: null}`, so patch the
dates via `vacation/update` first if you want a live preview.

### `vacation/update` — **admin**
`{enabled?, start?, end? (YYYY-MM-DD | null), buffer_days? (0..14),
exempt_task_ids? (≤2000)}` (partial) → the new state. Errors: `invalid_date`,
`invalid_range` (end before start).

### `vacation/end_now` — **admin**
`{}` → the new state. Switches vacation off immediately and clamps the end date
to today, keeping the dates for reuse.
