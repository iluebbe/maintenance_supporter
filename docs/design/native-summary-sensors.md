# Design: Native summary sensors (aggregate counts)

> **Status:** Implemented (PR #57). The open questions below were resolved during implementation — see "Resolved decisions" at the end.
> Tracking discussion: [#49 "UI ideas — panel and Lovelace card"](https://github.com/iluebbe/maintenance_supporter/discussions/49)

## Problem

Users want the panel's KPI numbers (overdue / due-soon / upcoming / total) **as Home Assistant entities** so they can bind them to chips, badges, and custom pop-up dashboards *outside* the panel — without writing template sensors.

Today the integration exposes **one sensor per task** (`sensor.<object>_<task>`, state = `ok`/`due_soon`/`overdue`/`triggered`) and **nothing on the global entry** (`sensor.py` returns early when `entry.unique_id == GLOBAL_UNIQUE_ID`). To get a count, users must hand-roll a template sensor:

```yaml
{{ integration_entities('maintenance_supporter')
   | select('match', 'sensor.') | select('is_state', 'overdue') | list | count }}
```

That works (see README → *Template Sensor: Count Overdue Tasks*) but is boilerplate every user re-discovers.

## Motivation / signal

- **#49** — @Neflhiem (migrating from ChoreOps): wants the upcoming + due/overdue counts as chips on his own dashboards; can't pull them out of the panel.
- **#49** — @byoung79: already built a template sensor for his chips section ("really all that I was missing").
- **Competitive parity** — ChoreOps' core strength is "rich state exposed as HA **sensors** + actions as **button entities**", which is exactly what lets users build custom dashboards/pop-ups there. This closes half that gap (the sensor half; action buttons are a separate future item — see Out of scope).
- Related: #56 showed the docs over-promised a `sensor.maintenance_*` namespace that never existed. Native summary sensors would *create* a real `sensor.maintenance_supporter_*` namespace for aggregates.

## Proposed entities

Created on the **global entry** (the hub), grouped under a single device named **"Maintenance Supporter"**. With `has_entity_name = True` the entity IDs become a clean, documentable namespace:

| Entity ID | Meaning | State class |
|---|---|---|
| `sensor.maintenance_supporter_overdue` | count of tasks in `overdue` | measurement |
| `sensor.maintenance_supporter_due_soon` | count of tasks in `due_soon` | measurement |
| `sensor.maintenance_supporter_triggered` | count of tasks in `triggered` | measurement |
| `sensor.maintenance_supporter_needs_attention` | overdue + due_soon + triggered (one chip number) | measurement |
| `sensor.maintenance_supporter_ok` | count of tasks in `ok` | measurement |
| `sensor.maintenance_supporter_total_tasks` | all configured tasks (disabled count as `ok`) | measurement |

> The table above shows the **as-shipped** entity IDs (on an English-language Home Assistant — `has_entity_name` derives the slug from the translated entity name, so a non-English *system* language localizes it). The original open decisions are recorded under **Resolved decisions** at the end: `ok` was added (six sensors, not four), disabled tasks are reported as `ok` rather than excluded, and no list attribute ships (the per-task sensors cover drill-down).

## Implementation plan (file-by-file)

1. **`sensor.py`**
   - Remove the early `return` for the global entry; instead add the summary sensors there.
   - New class `MaintenanceSummarySensor(SensorEntity)` parameterized by which status it counts (or one class per metric). `native_value` = computed count.
   - `device_info` for the global device: `identifiers={(DOMAIN, GLOBAL_UNIQUE_ID)}`, `name="Maintenance Supporter"`, `entry_type=DeviceEntryType.SERVICE`.
   - `_attr_has_entity_name = True`, `_attr_translation_key = "summary_overdue"` etc., `_attr_state_class = SensorStateClass.MEASUREMENT`.

2. **Aggregation source** — reuse the existing cross-entry pattern from `websocket/objects.py`:
   - `_get_object_entries(hass)` (all non-global `DOMAIN` entries) + `_get_runtime_data(hass, entry_id).coordinator.data` → `tasks` dict where each task has `_status` and `enabled`.
   - Lift `_get_object_entries` / `_get_runtime_data` into a shared helper (e.g. `helpers/aggregate.py`) so both the WS layer and the summary sensors call one implementation. Add `count_by_status(hass) -> dict[str, int]`.
   - Status values come straight from `_status` (already computed by the coordinator / `MaintenanceSensor._compute_live_status`). **Do not** re-derive — single source of truth.

3. **Update mechanism** — the summary sensors must refresh when *any* object's tasks change:
   - A `CoordinatorEntity` follows only one coordinator, so instead register a listener on **every** object coordinator (`coordinator.async_add_listener`) in `async_added_to_hass`, and re-subscribe on entry add/remove.
   - Simpler alternative to evaluate: listen to a single global dispatcher signal fired whenever any task status changes (extend the existing `SIGNAL_TASK_RESET` dispatch, or add `SIGNAL_SUMMARY_CHANGED`). Pick whichever avoids missed updates on the 5-min poll path.
   - Must handle the **empty / startup** case (no object entries yet → all counts 0, entity available).

4. **i18n** — new translation keys for the entity names (Overdue / Due soon / Triggered / Needs attention / Total tasks) across all **12** language files under `translations/` + `strings.json`.

5. **README / docs**
   - Add the new entities under a "Summary sensors" subsection near *Entity naming*.
   - Update the *Count Overdue Tasks* template section to say "or just use `sensor.maintenance_supporter_overdue`".

6. **Tests** (`tests/`)
   - `test_summary_sensors.py`: build N object entries with known statuses across multiple entries → assert each summary count matches. Include disabled-task exclusion and the zero-objects case.
   - Tripwire: adding a new status to `MaintenanceStatus` should force a decision about whether it gets a summary sensor (parametrize over the enum).

## Verification

- Dev HA already has ~59 task sensors with a known overdue/due_soon mix (overdue=2, due_soon=2 at time of writing). After implementing, `sensor.maintenance_supporter_overdue` should read `2`, `due_soon` `2`, `attention` `4` — matching the verified template results from #56.
- Manual: add the new sensors to a chip / Tile card and confirm they update live when a task is completed or a trigger fires (≤ coordinator poll interval).

## Out of scope (separate future work)

- **Action button entities** (`button.*` for complete / skip per task) — the other half of ChoreOps parity; lets users build fully native custom dashboards/pop-ups. Bigger surface, own PR.
- **Per-area / per-object summary sensors** — start global-only; revisit if requested.
- **Cost / budget summary sensors** — budget already has its own surface; don't duplicate here.

## Open questions

1. `attention` only, or also expose `ok`? (Lean: `attention` only.)
2. Listener-per-coordinator vs. single global signal — which is robust against the poll path without double-counting?
3. Any value in a `task_entity_ids` list attribute, or do the per-task sensors already cover drill-down? (Lean: omit.)
4. Should vacation-mode-paused tasks be excluded like disabled ones?

## Resolved decisions (as implemented)

1. **Both** `needs_attention` *and* `ok` are exposed — six sensors total: overdue / due_soon / triggered / needs_attention / ok / total_tasks. `ok` was added because the dashboard-strategy headline shows it (and now reads it from the entity).
2. **Listener-per-coordinator + `SIGNAL_NEW_OBJECT_ENTRY` + trigger bus events**, mirroring `ws_subscribe`. `_async_update_data` re-scans entries fresh, so add/remove is self-healing; trigger activation/deactivation is caught via `EVENT_TRIGGER_*` since it doesn't notify coordinator listeners.
3. **Omitted** the list attribute — the per-task sensors cover drill-down; keeps the recorder lean.
4. **Not excluded** — vacation only suppresses notifications, not status; counts reflect reality. Disabled tasks are already forced to OK by the coordinator, so they land in `ok`, never in attention.

## DRY: single source of truth

`helpers/aggregate.py::compute_status_counts` is the only place statuses are counted. It feeds **both** `ws_get_statistics` (panel KPI chips + Lovelace card header) **and** the summary coordinator (entities). The dashboard-strategy headline renders the summary entities via a markdown template instead of counting client-side. Verified live: entities == `/statistics` == task-sensor ground truth.
