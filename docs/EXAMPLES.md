# Use Cases & Examples

Real-world recipes: what to configure for common maintenance scenarios, plus
copy-paste YAML for automations, cards, and dashboards. Feature background in
[FEATURES.md](FEATURES.md); every parameter in [CONFIGURATION.md](CONFIGURATION.md).

## Use Cases

### Car Maintenance — Oil Change by Mileage

Track oil changes using a **counter trigger** in delta mode. Connect to an odometer entity (e.g., from an OBD-II integration) and set a target of 15,000 km. Each time you complete the task, the counter resets and begins accumulating from the current reading. A time-based interval of 365 days runs in parallel as a fallback.

### HVAC Filter Replacement — Airflow Drop Detection

Monitor a filter airflow sensor with a **threshold trigger** set to activate below 60%. Enable **adaptive scheduling** so the integration learns your actual replacement intervals. After 5+ replacements, Weibull analysis provides a reliability-based recommendation — replacing the filter before it degrades enough to trigger.

### Pool Pump — Weekly Pressure Check with Threshold Alert

Combine a time-based schedule (7-day interval for manual pressure checks) with a **threshold trigger** on a pressure sensor that activates above 1.5 bar. The time-based schedule handles routine inspections, while the trigger catches sudden pressure spikes between checks.

### Washing Machine — Descaling Every 50 Cycles

Use a **state change trigger** monitoring a binary sensor that tracks wash cycles (on → off transitions). Set the target to 50 changes. Each completion resets the counter. A parallel time-based interval of 180 days ensures descaling happens even if the machine is used less frequently than expected.

### On-Complete Actions (1.3.0+) — close the loop with the device

When you complete a maintenance task in HA, your *device* often still thinks it's overdue: the Roborock app keeps nagging that the filter needs replacing, the HVAC controller still has the "filter dirty" flag set, the printer's hour counter keeps climbing. With an **on-complete action** the integration can call the device-side reset for you the moment you mark the task done.

Enable the feature under **Settings → Features → Completion actions** (default OFF). Each task then exposes a *Service* picker (autocomplete over your full HA service registry) and a data form that renders from the service schema — no YAML, no copy-pasting from automations.

#### Roborock vacuum — reset filter consumable counter

The Roborock integration exposes `vacuum.send_command` for sending raw RoboROCK commands. To reset the filter consumable counter when you complete the *Replace HEPA filter* task:

| Field | Value |
|---|---|
| **Service** | `vacuum.send_command` |
| **Target** | `vacuum.s7_max_ultra` *(your vacuum entity)* |
| **Command** | `reset_consumable` |
| **Params** | `["filter_work_time"]` |

The mobile-app reset and the HA-side completion now stay in sync. Click *Test* in the dialog before saving to confirm the device responds.

> **Same pattern works for** `["main_brush_work_time"]`, `["side_brush_work_time"]`, `["sensor_dirty_time"]` — one task per consumable, each with its own reset. Or use an HA `script:` that resets all four if you want a single task for "full deep clean".

#### HVAC filter — reset the controller's "filter dirty" button

If your HVAC integration exposes a button entity for the filter-life reset (the original example from issue #41):

| Field | Value |
|---|---|
| **Service** | `button.press` |
| **Target** | `button.lscontrol_dk_reset_filter` *(your HVAC reset button)* |
| **Data** | *(empty — `button.press` takes no params)* |

The data section auto-falls-back to an empty JSON field for `button.press` since the service has no schema.

#### 3D Printer — reset the runtime counter on nozzle replacement

For OctoPrint / Bambu / Klipper users tracking print hours via `counter` or `input_number`:

| Field | Value |
|---|---|
| **Service** | `counter.reset` |
| **Target** | `counter.printer_nozzle_hours` |

When you complete the *Replace nozzle every 500h* task, the counter resets so the next 500h cycle starts cleanly.

#### Water filter — toggle the "fresh filter" status indicator

If you've wired a `light` or `switch` (e.g. an LED ring) as a visual status indicator:

| Field | Value |
|---|---|
| **Service** | `light.turn_on` |
| **Target** | `light.water_filter_status_ring` |
| **Data** *(rendered from schema)* | `brightness_pct: 80`, `rgb_color: [0, 255, 0]` *(fresh-green)* |

After 30 days another automation flips the same light to red — and now your physical indicator and the HA task status agree.

#### Pure event-driven — for power users who prefer YAML automations

You don't *have* to set `on_complete_action`. Every completion (panel button, complete-QR, quick-complete-QR, mobile action) fires the integration event `maintenance_supporter_task_completed`. Wire your own automation:

```yaml
automation:
  - alias: "Reset Roborock filter on task complete"
    trigger:
      - platform: event
        event_type: maintenance_supporter_task_completed
        event_data:
          task_name: "Replace HEPA filter"
    action:
      - service: vacuum.send_command
        target:
          entity_id: vacuum.s7_max_ultra
        data:
          command: reset_consumable
          params: ["filter_work_time"]
```

The event approach is more flexible (template conditions, multiple actions, delay/wait, etc.); the per-task field is the no-YAML shortcut for the common case.

### Quick-Complete QR (1.3.0+) — record completion in one tap

For tasks where the *act* of doing the maintenance is the input (no notes to type, no cost to enter), pre-fill the values once on the task and print a **lightning-bolt QR code** instead of the regular check-mark one.

Example for a **filter swap on the Roborock vacuum**: stick the lightning-bolt QR inside the dust-bin lid. Each filter replacement is just *swap → close lid → scan QR with phone* and the completion is recorded with your pre-set notes / cost / duration / *needed* feedback. No dialog, no typing. Great for high-frequency manual chores (litter-box scoop log, plant-watering log, espresso-machine-descale, HVAC quick-vacuum).

If you forget to pre-fill the defaults, the QR scan falls back to the normal complete dialog so you're never stuck.

### Object documentation URL (1.4.0+) — keep the manual within reach

Each object can carry a link to its PDF manual / vendor page / setup guide. Set it once via *Edit Object → Manual / documentation URL* (right under *Serial number*). The link then renders as a clickable line in:

- **the object detail page** (between the serial number and installation date)
- **every task detail page** belonging to that object (1.4.1+, distinguished by the book icon and the object name in parentheses, e.g. *Manual (Roborock S7)*)

Real-world fit: you're staring at the *Filter replacement* task on your phone, ready to do the work — one click and the actual PDF (or Roborock support article) opens in your browser. No more "where did I save that link" search. Combine with **Per-object NFC tag scan** for full hands-free flow: scan tag → task page opens → tap manual.

URL safety: only `http://` and `https://` URLs are accepted; `javascript:`, `data:`, and protocol-relative URLs are silently rejected.

### Warranty tracking + objects table (#67) — see what's still covered at a glance

Give each object a **warranty expiry date** (*Edit Object → Warranty expiry*, next to *Installed*). The object detail and the objects table then show a colour-coded chip — green *"valid until 2027-05-01"*, amber *"expires in 30 days"* once it's within 60 days, or red *"expired"* — so one glance tells you what's still under warranty before you pay for a repair.

The **All Objects** view has a cards/table toggle. The table lists every object in columns; choose which columns under **Settings → Objects table columns** (Name, Manufacturer, Model, Serial, Installed, Warranty, Area, Manual, Notes, Tasks, actions — defaults to all but Manual/Notes). On a phone it falls back to cards. A **CSV export** button downloads the whole list — one row per object, including ones with no tasks yet — for an asset spreadsheet.

### Notification title style (1.4.0+) — distinguish stacked notifications at a glance

When your phone stacks multiple HA notifications, only the title is visible without expanding the stack. The default per-status title (*"Maintenance overdue!"*) makes a stack of overdue alerts collapse to one indistinguishable line — you can't tell which device needs attention without tapping.

**Settings → Notification settings → Notification title style** offers three options:

| Choice | Title shown on the phone | Best for |
|---|---|---|
| `default` | "Maintenance overdue!" / "Maintenance triggered" / etc. | Backwards-compatible — keep this if any of your HA automations filter on the existing title strings |
| `object_name` | The maintenance object's name (e.g. *Pool Pump*) | Most users — at a glance you know *which device* needs work |
| `task_name` | The task's name (e.g. *Filter cleaning*) | Useful when one object has many distinct tasks and you want to know what kind of maintenance |

Bundled notifications (multiple due tasks for the same object) honour `object_name`. `task_name` doesn't map cleanly for multi-task bundles, so those keep the count-based default.


## Examples

### Automation: Notify on Overdue Task

```yaml
automation:
  - alias: "Notify when maintenance is overdue"
    trigger:
      - platform: state
        entity_id: sensor.family_car_oil_change
        to: "overdue"
    action:
      - service: notify.mobile_app_phone
        data:
          title: "Maintenance Overdue"
          message: >
            {{ state_attr('sensor.family_car_oil_change', 'friendly_name') }}
            is overdue by {{ state_attr('sensor.family_car_oil_change', 'days_until_due') | abs }} days.
```

### Service Call: Complete a Task with Details

```yaml
service: maintenance_supporter.complete
data:
  entity_id: sensor.hvac_system_filter_replacement
  notes: "Replaced with HEPA filter model XYZ-400"
  cost: 45.99
  duration: 30
```

### Automation: Handle Mobile Notification Actions

```yaml
automation:
  - alias: "Handle maintenance notification actions"
    trigger:
      - platform: event
        event_type: mobile_app_notification_action
    condition:
      - condition: template
        value_template: "{{ trigger.event.data.action.startswith('MS_') }}"
    action:
      - service: notify.mobile_app_phone
        data:
          message: "Maintenance action processed: {{ trigger.event.data.action }}"
```

> **Note:** Mobile notification actions (Complete, Skip, Snooze) are handled automatically by the integration when enabled in Notification Actions settings. The automation above is only needed for custom follow-up actions.

### Lovelace Card

When you add the card from the Lovelace card picker (1.0.45+), it auto-fills with sensible defaults — `filter_status: ["overdue", "triggered", "due_soon"]` + `max_items: 10` — so the first impression is "the 10 things that need attention" rather than every task. The visual editor exposes status chips, an object multi-checkbox, an HA-native entity picker, and the usual show_header / show_actions / compact / max_items toggles.

```yaml
type: custom:maintenance-supporter-card
title: Maintenance Overview
show_header: true
# All filters are optional and additive. Empty / unset = show all.
filter_status: [overdue, triggered, due_soon]
filter_objects: [Family Car, Electric Car]
entity_ids: [sensor.hvac_system_filter_change, binary_sensor.family_car_oil_change_overdue]
max_items: 10
```

### Dashboard Strategy

<a id="dashboard-strategy"></a>

On Home Assistant **2026.5+**, *Settings → Dashboards → Add Dashboard → "Maintenance Supporter"* spins up a complete dashboard. Pick a layout from the strategy editor or YAML — every mode prepends an **Overview** view with the actionable tasks (overdue + triggered + due_soon), then groups the rest:

| `group_by` | Resulting views |
|---|---|
| `area` *(default)* | One view per area, alphabetical, plus *Unassigned* at the end. |
| `status` | *Overdue / Triggered / Due Soon / OK* — empty statuses skipped. |
| `floor` | One view per floor (uses HA's floor registry, sorted by `level`), plus *Other* for objects whose area has no floor. |
| `due_date` | *Overdue / Today / This Week / This Month / Later* — empty buckets skipped. |

```yaml
strategy:
  type: custom:maintenance-supporter
  group_by: due_date   # area | status | floor | due_date
```

Card configs are generated dynamically from the `maintenance_supporter/objects` WebSocket feed, so adding objects or changing areas / floors / statuses is reflected on the next dashboard load — no YAML edits to keep things in sync. The strategy ships a small **visual editor** (registered via `getConfigElement`) so the picker can offer a dropdown instead of YAML for users who'd rather click.

The `due_date` mode uses two new card filters introduced in 1.7.0 — `filter_due_min_days` and `filter_due_max_days` — which you can also set on a stand-alone card if you want a "tasks due in the next 14 days" tile somewhere else on your dashboard.

On older HA versions the strategy JS still loads but the registration is a silent no-op; the picker simply won't show the entry. Card and panel work as before.

#### Section strategy

<a id="section-strategy"></a>

A second strategy ships alongside — a section you can drop into *any* HA dashboard view (the home dashboard, the areas dashboard's per-area view, a custom dashboard), so a slice of maintenance tasks shows up in context:

```yaml
sections:
  - strategy:
      type: custom:maintenance-supporter-section
      area_id: kitchen           # optional — restrict to one area
      filter_status: [overdue, triggered]
      filter_due_max_days: 7
      title: Kitchen — this week
      max_items: 5
```

All filters are optional and additive. `area_id` resolves to object names via the WebSocket feed at section-load time, so it survives area renames automatically.

#### Calendar Card

<a id="calendar-card"></a>

Standalone Lovelace card with the same rolling-window calendar the panel ships in its Calendar tab — pick *Maintenance Supporter — Calendar* in the "Add Card" dialog, or YAML:

```yaml
type: custom:maintenance-supporter-calendar-card
title: Maintenance calendar          # optional
window_days: 30                       # 7 | 14 | 30 | 365 — default 30
show_window_chips: true               # default true; hide for embedded use
show_user_filter: true                # default true
user_filter: ""                       # "" | "current_user" | "<uuid>"
```

Source icons (clock for time-based, trending-up for sensor-based, with adaptive sparkle), per-event prediction-confidence pills, projected recurrences at 55 % opacity, today-pill highlight, empty-day collapsing in the year view. Click on an event opens the task editor in-place — no panel navigation.

The dashboard strategy's `group_by: calendar` mode wraps four instances of this card (week / fortnight / month / year) as separate views, with the chips hidden because the tab bar already serves as the window selector.

### Entity naming

<a id="entity-naming"></a>

Each task becomes one sensor. Home Assistant builds its `entity_id` from the **object** (the device) plus the **task** name — there is **no shared `maintenance_` prefix**:

| Object | Task | Entity ID |
|---|---|---|
| Family Car | Oil Change | `sensor.family_car_oil_change` |
| HVAC System | Filter Replacement | `sensor.hvac_system_filter_replacement` |
| Water Softener | Refill Salt | `sensor.water_softener_refill_salt` |

Because the names vary per setup, **don't filter by entity-id prefix** in templates — filter by integration instead, using `integration_entities('maintenance_supporter')`. Each sensor's state is one of `ok`, `due_soon`, `overdue`, `triggered`.

### Summary sensors

<a id="summary-sensors"></a>

The integration also exposes **aggregate count sensors** on a global *Maintenance Supporter* device — bind these to chips, badges, or pop-up cards without writing template sensors:

| Entity ID | Counts |
|---|---|
| `sensor.maintenance_supporter_overdue` | tasks past due |
| `sensor.maintenance_supporter_due_soon` | tasks inside their warning window |
| `sensor.maintenance_supporter_triggered` | sensor-triggered tasks |
| `sensor.maintenance_supporter_needs_attention` | overdue + due-soon + triggered (one number) |
| `sensor.maintenance_supporter_ok` | tasks not needing attention |
| `sensor.maintenance_supporter_total_tasks` | all tasks |

They update live and are the **same numbers** the panel KPI chips and the dashboard-strategy headline show — one shared aggregator, so they never drift.

### Action buttons

Each task also exposes **action buttons** on its object device, so you can act on a task straight from a dashboard, chip, or bubble-card pop-up — the same actions the panel performs:

| Entity | Action |
|---|---|
| `button.<object>_<task>_complete` | Mark the task done (logs a completion) |
| `button.<object>_<task>_skip` | Skip the current cycle |
| `button.<object>_<task>_reset` | Reset the task's schedule |

(Entity IDs follow the same per-task naming as the sensors, e.g. `button.family_car_oil_change_complete`.) Buttons for disabled (paused) tasks are unavailable, and every press runs through the same logic as the `maintenance_supporter.complete` / `skip` / `reset` services — so a dashboard tap behaves exactly like the panel.

To export your data, use the **`maintenance_supporter.export_data`** action (service) — it writes a JSON/YAML file to your Home Assistant config folder. (Export isn't a button entity: a button runs on the server and can't trigger a browser download.)

Example — a ChoreOps-style row with status + a complete button:

```yaml
type: horizontal-stack
cards:
  - type: entity
    entity: sensor.family_car_oil_change
  - type: button
    entity: button.family_car_oil_change_complete
    name: Done
```

### Template Sensor: Count Overdue Tasks

> Prefer the native `sensor.maintenance_supporter_overdue` above. The template below is only for a *custom* count the summary sensors don't expose (e.g. a single object, or a specific status combination):

```yaml
template:
  - sensor:
      - name: "Overdue Maintenance Tasks"
        unit_of_measurement: "tasks"
        state: >
          {{ integration_entities('maintenance_supporter')
             | select('match', 'sensor.')
             | select('is_state', 'overdue')
             | list | count }}
```
