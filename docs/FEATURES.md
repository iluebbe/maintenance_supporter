# Feature Reference

The complete feature catalogue of Maintenance Supporter — what exists, since
which version, and how the pieces fit. For a task-oriented introduction start
with the [README](../README.md); for every configurable parameter see
[CONFIGURATION.md](CONFIGURATION.md); for copy-paste automations and dashboards
see [EXAMPLES.md](EXAMPLES.md).

## Screenshots

| Dashboard | Task Detail | Mobile |
|:-:|:-:|:-:|
| ![Overview](images/overview.png) | ![Task Detail](images/task-detail.png) | ![Mobile](images/mobile-overview.png) |

The dashboard shows live status KPIs, monthly/yearly budget bars, priority
markers, labels, per-user assignment badges, and mini-sparklines for
sensor-triggered tasks. The task detail page adds the full trigger chart
(current value vs. threshold over 7d–1y), KPI tiles, and the cost & duration
history chart.

<details>
<summary>More screenshots</summary>

### Object Detail
Warranty status chip, free-form notes, the documents section (uploaded PDF
manual + web link), and the object's tasks with assignment badges.

![Object Detail](images/object-detail.png)

### Today View
The panel's default landing tab — what needs attention now, bucketed into
*Overdue / Due today / This week* with one-tap complete.

![Today view](images/today-view.png)

### Objects Table
The *All Objects* view as a sortable table with configurable columns and CSV
export. Warranty chips show all three states: green *valid until*, amber
*expires in N days*, red *expired*. The paperclip badge counts attached
documents.

![Objects table](images/objects-table.png)

### Complete Dialog
Checklist steps, optional notes / cost / duration, and a completion photo
(camera capture on mobile).

![Complete Dialog](images/complete-dialog.png)

### Task History
Every completion with cost, duration, and notes — inline-editable, searchable,
with completion photos when attached.

![Task History](images/task-history.png)

### Settings Tab
Feature toggles (advanced features are hidden until enabled), panel access
delegation, notification / budget / vacation sections — all editable in-panel
by admins.

![Settings tab](images/settings-view.png)

### Task Dialog — Reading Type + End-of-Month Scheduling (2.18+)
The *Reading* task type for recording meter values, scheduled for the *last
business day of the month* with an optional ±N-day offset.

![Task dialog with reading type and end-of-month schedule](images/task-dialog-schedule.png)

### Multi-Entity Trigger
One threshold watching several entities — here *replace the batteries when ANY
detector battery drops below 15 %*.

![Multi-Entity Trigger](images/multi-entity-trigger.png)

### Compound Trigger
Multiple conditions joined with AND/OR — here *service the pump after 200 h
runtime OR when filter pressure exceeds 1.5 bar*.

![Compound Trigger](images/compound-trigger.png)

### QR Codes
Per-task QR pair: *view* opens the task, *complete* records the completion.
Download as PNG/SVG or print; URL modes for LAN, external URL, or the
Companion app.

![QR Code](images/qr-dialog.png)

### Lovelace Card
The `custom:maintenance-supporter-card` on a regular dashboard, filtered to
actionable tasks.

![Lovelace Card](images/lovelace-card.png)

### Calendar Tab (panel — 1.5.0+)
![Calendar tab](images/calendar-tab.png)

Window chips (7 / 14 / 30 days, *1 year*, plus past windows −30d/−90d for
reviewing what was done), per-event source icon (clock = time-based,
trending-up = sensor-based), per-event average cost, and a prediction-confidence
pill (green / amber / red, 1.5.1+) on sensor-predicted events. Time-based
recurring tasks additionally project up to 5 future occurrences into the window
at 55 % opacity — hypothetical cycles assuming you stay on schedule.

### Calendar (HA-native entity)
The integration's calendar entity in Home Assistant's own calendar panel —
every task due date as an event.

![Calendar entity](images/calendar.png)

### Native To-do List (2.17+)
The `todo.maintenance` entity mirrors every active task; checking an item off
completes the task — including via Assist/voice.

![To-do list](images/todo-list.png)

### Sensor Attributes
Each task is a sensor — the more-info dialog shows schedule, trigger, and
statistics attributes for use in templates and automations.

![Sensor Attributes](images/entity-attributes.png)

### Configuration
Every object is a config entry with a native HA options flow (Settings →
Devices & Services → Configure) — manage tasks and object settings without the
panel; the global entry mirrors the panel's settings for those who prefer the
native HA UI.

![Configuration](images/config-flow.png)

### Mobile Task Detail
![Mobile Task Detail](images/mobile-task.png)

### On-Complete Action (1.3.0+)
Run any HA service when the task is completed — here *turn the pool pump back
on after impeller cleaning*. Picking a service with a schema renders the data
fields automatically (sliders, pickers); services without one fall back to a
JSON textfield. The *Validate configuration* button tests the wiring before
saving.

![On-Complete Action](images/task-dialog-action.png)

### Quick-Complete Defaults (1.3.0+)
Pre-fill notes/cost/duration/feedback per task. Scanning the lightning-bolt
**quick-complete QR** records the completion in one tap, no dialog.

![Quick-Complete Defaults](images/task-dialog-quick-complete.png)

</details>


## Features

### Task Management
- Create maintenance objects (devices, equipment, appliances) and assign tasks to them
- Seven task types: cleaning, inspection, replacement, calibration, service, **reading** (record a value — meter readings, level checks; 2.18+), custom
- Scheduling modes: **time-based** (recurring interval), **calendar recurrence** (specific weekdays, *nth weekday of the month* — e.g. "1st Saturday", or a *day of the month*), **sensor-based** (triggered by entity state), **one-time** (single due date, marked *done* once completed), **manual**
- **Interval units**: time-based intervals can be **days, weeks, months or years** — months and years use real calendar arithmetic (last-day clamping, leap years)
- **Calendar recurrence**: pin a task to weekdays (e.g. Mon & Thu), the *nth weekday of the month* (1st–5th or last, e.g. "1st Saturday" for smoke-alarm checks), or a fixed *day of the month* (clamped to the month length). **End-of-month options** (2.18+, #83): *last day of the month*, *last business day*, and a **±N-day offset** on any calendar pattern — so "two days before the last working day" is three clicks, not a special case. *Business day* means Mon–Fri out of the box; when HA's **Workday integration** is configured, it automatically follows that instead — public holidays for your country/region, custom working weekdays (e.g. Mon–Sat), and add/remove-holiday overrides all respected (changes to the Workday config apply after a reload/restart)
- Task status tracking: OK, Due Soon, Overdue, Triggered
- **One-time tasks**: schedule a non-recurring job with an explicit due date; completing it marks it *done* (hidden from the card, shown as *Completed* in the panel)
- **Archive & retention** (2.10.0+): archive any task or object to retire it without deleting — archived items are **hidden by default** (a *Show archived* toggle reveals them) and go **inert** (no triggers, notifications, calendar entries, or active status counts), but keep their full history and cost (budget still counts). Archiving an object cascades to its tasks; unarchiving a recurring task starts a fresh cycle. Optionally **auto-archive** completed one-off tasks N days after completion, and opt-in **auto-delete** auto-archived one-offs after a further N days (manual archives are never auto-deleted)
- **Priorities** (2.17+): Low / Normal / High per task, shown as a badge (▲/▼) on task rows
- **Labels / tags** (2.17+): lightweight comma-separated tags per task (e.g. `safety`, `seasonal`), shown as chips and searchable in the command palette
- **Completion photos** (2.17+): attach a photo when completing a task (camera capture supported); stored via the documents engine and shown in the history timeline
- **Missed status + completion window** (2.17+): skipping an overdue task records it as *Missed* (distinct from a deliberate skip); an optional per-task *earliest completion* window blocks signing tasks off too early
- **Shared maintenance & rotation** (2.17+): assign a task to several household members and rotate responsibility on each completion (round-robin / least-completed / random)
- **Native To-do entity** (2.17+): a global `todo.maintenance` list mirrors every active task; checking an item off completes the task — works with the To-do card and Assist/voice
- **Snooze from the panel** (2.17+): the notification snooze is also available in the task ⋮ menu
- **Virtualized task table** (2.17+): with hundreds of tasks, only the visible window is rendered — large installs stay snappy
- **Binary sensor** per task (`device_class: problem`) — ON when overdue or triggered, ideal for HA automations
- **Interval anchoring**: choose between completion-based (default) or planned-date anchoring to prevent schedule drift
- **Time-of-day scheduling** (optional, advanced): tasks flip to OVERDUE at a configured `HH:MM` in HA's timezone instead of at midnight. Calendar events become timed 30-min blocks so mobile calendars can set real reminders. Enable under Settings → Features.
- Assign tasks to responsible Home Assistant users with per-user notification routing
- Custom task icons (any `mdi:*` icon via the HA icon picker)
- NFC tag linking — scan an NFC tag to complete a task
- Checklists for multi-step procedures — editable in the panel task dialog (and in the Integration Options)
- Task grouping for logical organization — **full CRUD UI** (create, edit, delete) with multi-checkbox task selector grouped by object
- **Sort & group-by** in the Tasks/Objects views — sort by due date, area, assigned user, or group; group into collapsible sections by area, group, or user (1.0.44+)
- **Overdue indicator** — object cards show a red dot the moment any of their tasks is overdue (1.0.44+)
- **Quick task creation** — `New Maintenance Task` button on the Tasks view opens the task dialog with an Object selector dropdown, no need to navigate into the parent first (1.0.44+)
- **Operator mode** for non-admin HA users — non-admins get a read-only view (Complete / Skip / QR) so household members can run tasks without changing anything. Admins can **optionally delegate** create/edit/delete to selected non-admins via the **Panel Access** section — off by default, enforced server-side, toggled from the Settings tab or config flow. Orphaned ids surface as a fixable repair issue. Useful for shared/family/hotel setups (1.0.44+; server-enforced + opt-in 2.8.4)
- **Per-object documentation URL** (1.4.0+) — store a link to the PDF manual / vendor page on each object. Shown as a clickable link in the object-detail header *and* on every task-detail page belonging to that object (1.4.1+) so the manual is always one click away from any maintenance task
- **Per-object notes** (1.4.10+) — free-form multiline notes attached to each object: part numbers, replacement procedures, settings reminders, "spare key in garage drawer". Rendered with `white-space: pre-wrap` so newlines and indentation survive intact
- **Calendar tab** (1.5.0+) — rolling-list view of upcoming maintenance with a window chip toggle (**7 / 14 / 30 days, plus "1 year" since 1.5.2**; the year view collapses empty days so only the actually-eventful rows render). Time-based recurring tasks project up to 5 occurrences within the window at 55 % opacity to mark them as "hypothetical assuming you stay on schedule"; sensor-triggered tasks show only their current `next_due` since predicting the next sensor firing would be a guess. Each event row carries (1.5.1+): a small **source icon** — `mdi:clock-outline` for time-based or `mdi:trending-up` (HA primary color) for sensor-based — and, for sensor-based events, a *"predicted · {high|medium|low} confidence"* pill below the title (green / amber / red border) sourced from the `threshold_prediction_confidence` returned by the predictor. Visible in operator mode. Independent of the HA Calendar entity — stays inside the panel for the *"what's due soon?"* glance, with status pills and avg-cost per event
- 13 object templates (car, motorcycle, HVAC, pool, washing machine, etc.)

### Sensor-Based Triggers
- **Threshold**: trigger when a sensor value exceeds or falls below a limit (with optional duration)
- **Counter**: trigger when accumulated value reaches a target (absolute or delta mode)
- **State change**: trigger after a number of state transitions (e.g., on/off cycles)
- **Runtime**: trigger after accumulated operating hours (e.g., 500h of compressor runtime)
- **Compound**: combine multiple conditions with AND/OR logic (e.g., threshold AND runtime)
- Multi-entity support for all trigger types (any/all entity logic)
- **Auto-complete on sensor recovery** (2.12.0+, opt-in per task, #53) — when the trigger clears itself (salt refilled, filter swapped, pressure topped up), the task records a completion automatically: `last performed` and the time-between-services statistics stay real without opening the app. Manual completes are unaffected, and a just-completed task never double-records
- **Entity attribute introspection** — trigger setup shows domain-specific attribute suggestions (e.g., `current_temperature` for climate entities)
- Automatic entity availability tracking with grace periods
- Repair issues for missing or unavailable trigger entities (replace / remove / dismiss)

### Adaptive Scheduling
- Learns from your maintenance history using Exponential Weighted Averaging (EWA)
- Weibull reliability analysis for failure prediction (after 5+ completions)
- On-demand **Re-analyze** button (task detail) — shows recommended interval, confidence and data-point count as a toast without having to wait for the next coordinator refresh
- Seasonal awareness with hemisphere detection and per-month multipliers; manual 12-month **seasonal factor override editor** available below the seasonal chart (0.1–5.0 per month, empty = learned)
- Environmental correlation with external sensors (temperature, humidity, etc.) — bound via an entity picker in the task dialog for sensor-based tasks
- Sensor degradation rate analysis and threshold prediction
- User feedback loop (needed / not needed / not sure) to improve recommendations

### Completion Actions (1.3.0+, advanced)
- Per-task **on-complete action** — configure any HA service-call (service + target + data) to run when a task is completed. Failures are logged + swallowed so the completion is always recorded
- **Test button** in the task dialog fires the configured action immediately so you can verify the wiring before saving
- **Quick-complete QR codes** — pre-configure `notes / cost / duration / feedback` per task; the lightning-bolt QR records a completion in one tap, no dialog. Falls back to the regular complete dialog when the task has no defaults
- **Stale-entity repair flow** — if an action's target entity is renamed or removed, a repair issue offers Replace (pick a new entity) or Remove (drop the action)
- The same lifecycle events (`task_completed / _skipped / _reset`) fire on every completion path, so user-written automations can hook in without having to set `on_complete_action` (see Events below)
- All gated behind a feature toggle (Settings → Features → Completion Actions). Default OFF

### Notifications
- Configurable notification service (any `notify.*` service)
- **"Send test" button** in Settings to verify the notify service without having to wait for a real due event
- Per-user notifications for tasks with a responsible user assigned
- Rate limiting per status level (due soon, overdue, triggered)
- Quiet hours support
- **Multiple lead-time reminders** (2.17+): an opt-in list (e.g. 14 / 3 / 0 days before due) fires one extra reminder on each matching day
- **Warranty-expiry reminders** (2.17+): opt-in one-time reminder N days before an object's warranty runs out
- **Weekly digest** (2.15+): opt-in Monday-morning summary of what's overdue / due this week
- Notification bundling (group multiple due tasks into one message)
- Daily notification limits
- Mobile actionable notifications via Companion App: Complete, Skip, Snooze
- **Notification title style** (1.4.0+) — choose what appears as the notification's *title*: per-status text (default), the object name, or the task name. Helps when phones stack notifications and only the title is visible without expanding the stack

### Budget Tracking
- Monthly and yearly maintenance budgets
- Cost tracking per task completion
- Budget alerts at configurable thresholds

### Data Management
- JSON, YAML, and CSV export and import (via WebSocket API and Settings panel) — JSON/CSV round-trip the full object asset record (incl. warranty, manual URL, notes, and attached-document metadata + web-links); a dedicated one-row-per-object CSV export is available from the objects table (#67)
- QR code generation for mobile quick-actions (print, download SVG)
- Complete maintenance history with cost, duration, and feedback tracking
- Integration diagnostics with PII redaction

### Documents & manuals (2.11.0+)
- **Attach files to any object** — PDFs, manuals, photos, receipts, spare-part lists. Stored **backup-safe under `/config`** (so they ride along in every Home Assistant backup) and **content-addressed with reference counting**, so uploading the same file to several objects keeps a single shared copy — a hint tells you when an upload deduped and cost no extra space
- **Categories + tags** — file each document as *Manual / Warranty / Invoice / Spare parts / Photo / Other* (localized) plus optional free tags, driving filtering and the storage-by-category breakdown
- **Open in place** — click a document to open it: images pop into an in-app lightbox, PDFs and other files open inline in a new tab; image documents show a thumbnail in the list. Separate download button, and inline **edit** of title/category
- **Fast capture** — multi-file upload, drag & drop onto the object, and **camera capture** on mobile; optional **web-links** (zero storage, not part of the backup) for manuals that live online
- **Storage overview** — a collapsible **Document storage** card on the panel overview shows the real backup footprint, the space saved by dedup, and a per-object breakdown; click any object row to jump straight to it, or **search every document** across all objects from the card. Backed by a `sensor.<config>_document_storage` (`device_class: data_size`) with per-object and per-category attributes so you can automate on storage growth
- **Documents at the task** — link an object's documents to a specific task so the right manual sits on the task-detail page where the work happens; for a PDF you can set a **jump-to page** so opening it lands on the relevant section (`#page=N`)
- **Lifecycle & hygiene** — deleting a document frees its bytes only when the *last* reference goes; archiving an object keeps its documents (inert); a boot-time **storage-hygiene repair issue** flags orphaned or dangling blobs after a crash or partial restore and cleans them up in one click. Export/import carries document **metadata + web-links** (the binaries travel via the HA backup)

### Frontend
- **Sidebar panel** with dashboard overview, object details, task history, analytics, and in-panel **settings editor**
- **Lovelace card** for dashboard integration
- **Calendar** integration with status-emoji events
- **Binary sensor** entities for automation triggers
- **Clickable entity IDs**: entity IDs in trigger sections, compound conditions, and environmental correlations open HA's "More Info" dialog on click
- **Serial number** field on objects — displayed in panel, Device Registry, and export/import
- **Warranty tracking** (#67): per-object `warranty_expiry` date with a colour-coded status chip (valid until / expiring within 60 days / expired) in the object detail and objects table
- **Objects table view** (#67): toggle the *All Objects* view between cards and a sortable table; columns are configurable (Settings → Objects table columns) from known object fields; mobile falls back to cards; export all objects as CSV
- **Task sorting**: sort by due date, object name, type, or task name (persisted)
- **All Objects view**: clickable KPI card shows all objects including empty ones
- Real-time updates via WebSocket subscription (no polling)
- User filter to show only your assigned tasks
- **Custom sidebar panel title** (2.8.0+) — rename the panel in Settings → Options → General Settings or the panel's Settings tab (blank = default "Maintenance"); avoids clashing with HA's built-in Maintenance dashboard
- Localized UI in **all 18 languages across all three surfaces** (since 1.4.2): English, German, Spanish, French, Italian, Dutch, Portuguese, Russian, Ukrainian, Polish, Czech, Swedish, Simplified Chinese, Danish, Finnish, Norwegian Bokmål, Japanese, Hindi — covers panel UI, HA config-flow + Repairs UI, and phone notification messages

### WebSocket API
- 59 commands for full CRUD operations on objects, tasks, triggers, groups, vacation mode, completion actions, quick-complete, and document management (list / upload-link / update / delete / storage summary / search)
- Global settings update and test notification via WS
- Real-time subscription for live updates
- User assignment and listing
- Statistics, budget status, and interval analysis
- See [Architecture](docs/ARCHITECTURE.md) for the complete command reference


## Supported Functions

### Platforms

- **Sensor** — one entity per maintenance task. State is an enum: `ok`, `due_soon`, `overdue`, `triggered`
- **Binary Sensor** — one entity per maintenance task (`device_class: problem`). ON when overdue or triggered, ideal for HA automations
- **Button** — one-press complete/skip/reset per task (`button.<object>_<task>_complete` / `_skip` / `_reset`)
- **Calendar** — one global entity showing upcoming maintenance events for all tasks
- **Document storage sensor** (2.11.0+) — one global entity `sensor.<config>_document_storage` (`device_class: data_size`) reporting the physical footprint of attached documents, with `dedup_savings_bytes`, `document_count`, and per-object / per-category breakdowns as attributes

### Sensor Attributes

Each sensor entity exposes attributes grouped by function. Only stable values are exposed as entity attributes (to avoid excessive recorder writes); fast-changing trigger values are served via the WebSocket `subscribe` endpoint instead (see below).

- **Core**: `maintenance_type`, `schedule_type`, `interval_days`, `interval_unit`, `interval_anchor`, `due_date`, `warning_days`, `last_performed`, `next_due`, `days_until_due`, `parent_object`, `times_performed`, `total_cost`, `average_duration`, `notes`, `documentation_url`
- **Trigger** (only when a trigger is configured): `trigger_type`, `trigger_active`, plus type-specific fields (e.g. `trigger_above` / `trigger_below` / `trigger_for_minutes`, `trigger_target_value`, …)
- **Adaptive** (only when adaptive scheduling is enabled): `suggested_interval`, `interval_confidence`, `adaptive_scheduling_enabled`, `seasonal_factor`, `seasonal_reason`
- **Weibull** (after 5+ completions): `weibull_beta`, `weibull_eta`, `weibull_r_squared`, `weibull_beta_interpretation`, `confidence_interval_low`, `confidence_interval_high`

> **Live values via the WebSocket `subscribe` endpoint (not recorded as sensor attributes):** `trigger_current_value`, `trigger_entity_state` (per-entity availability), `degradation_rate`, `environmental_factor`, and other fast-changing trigger/prediction values. The panel and Lovelace card read these from the live subscription.

### Events

- `maintenance_supporter_trigger_activated` — fired when a sensor trigger condition becomes true
- `maintenance_supporter_trigger_deactivated` — fired when a sensor trigger condition clears
- `maintenance_supporter_task_completed` — fired on every completion path (panel, complete-QR, quick-complete, mobile action). Payload: `entry_id`, `task_id`, `task_name`, `object_name`, plus optional `notes`, `cost`, `duration`, `feedback`, `completed_by`
- `maintenance_supporter_task_skipped` — fired when a task is skipped. Payload includes the optional `reason`
- `maintenance_supporter_task_reset` — fired when a task's `last_performed` is reset to a specific date. Payload includes that `date`

### Automation triggers & conditions (HA 2026.7+)

On Home Assistant 2026.7+ the integration contributes **purpose-specific
building blocks** to the new intent-based automation editor — no entity
naming or event names to know, localized in all 18 languages:

- **Triggers**: *A maintenance task became overdue*, *…became due soon*,
  *A sensor trigger activated*, *A maintenance task returned to OK* — each
  targetable at the whole home, an area, an object (device), or a single task,
  with the standard *for* duration and behavior options
- **Conditions**: *A maintenance task is overdue / is due soon /
  is triggered / needs attention* (the last covers overdue **or** triggered)

In YAML the same blocks read naturally:

```yaml
triggers:
  - trigger: maintenance_supporter.task_became_overdue
    target:
      entity_id: sensor.family_car_oil_change
```

On older cores these building blocks simply don't appear; the events and
binary sensors above keep working unchanged.

### Services

See the [Services](#services) table below for available service calls. For the full WebSocket API (49 commands), see [Architecture — WebSocket API](ARCHITECTURE.md#websocket-api).


## Data Updates

The integration uses a hybrid push/poll update model:

- **Coordinator refresh** — every 5 minutes, recomputes time-based status (due soon, overdue), runs adaptive predictions (Weibull, seasonal), checks budget thresholds, and detects missing entities
- **Trigger sensors** — update immediately when monitored entities change state, via Home Assistant `state_changed` event listeners. No polling delay for sensor-based triggers
- **Frontend** — receives real-time updates via WebSocket subscription (`maintenance_supporter/subscribe`). No browser polling
- **IoT class**: `calculated` — all data is computed locally from HA state and configuration, trigger updates are event-driven
