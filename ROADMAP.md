# Roadmap

Planned and proposed features for **Maintenance Supporter**. This is a living
document — priorities shift with user feedback (issues and Discussions).
Nothing here is a dated promise; items ship when they're ready and well-tested.
Shipped features are recorded in [CHANGELOG.md](CHANGELOG.md).

Legend: 💡 proposed · 🛠️ in progress · ✅ shipped

---

## Near-term (planned)

### ✅ LLM setup assistant — a skill that configures the integration for you
**Shipped** as a portable skill/playbook in
[`skills/maintenance-setup-assistant/`](skills/maintenance-setup-assistant/)
(SKILL.md + WS-API contract + discovery heuristics + non-smart catalog with
derived-usage-sensor recipes). A guided skill (Claude Code / Assist / an
MCP-style agent) that stands the integration up correctly from a conversation,
instead of the user clicking through the config flow object-by-object. The skill:

1. **Authenticate to Home Assistant** — obtain (or be given) a long-lived
   access token and the base URL; verify it can reach the WS/REST API. Never
   store the token in plain text where it can leak; treat it like a password.
2. **Discover maintenance candidates** — scan the HA device & entity registries
   for things that plausibly need upkeep: pumps, filters, HVAC, printers,
   vehicles (odometer/`device_class: distance`), water softeners, appliances,
   anything exposing a wear-signal sensor (runtime hours, cycle counters,
   pressure/flow, battery/consumable levels). Group by area/device and propose a
   ranked list of objects + suggested tasks with sensible default intervals and
   trigger types (threshold / counter-delta / runtime) inferred from the sensor.
   - **Also propose *non-smart* devices** — common household items that never
     appear in the registry but still need maintenance (range hood filter,
     dishwasher/washing-machine cleaning, smoke-detector batteries, HVAC filter,
     descaling the kettle/coffee machine, gutter cleaning, …). Offer these from a
     curated catalog as time-based tasks. Where a smart signal *can* stand in for
     usage, suggest a **derived usage sensor**: infer run-cycles or on-time from
     a smart-plug's **power draw** (threshold/state-change on wattage) or from a
     **presence/occupancy** signal, so an otherwise "dumb" appliance still gets
     usage-based (counter/runtime) triggers instead of a pure calendar interval.
3. **Match manuals & intervals (opt-in)** — when the user wants it, look up the
   manufacturer/model (from the device registry) to suggest a documentation URL
   or manufacturer-recommended service intervals, and attach them via the
   Documents feature. Strictly opt-in and source-cited; the user confirms before
   anything is fetched or attached.
4. **Create it via the public WS API** — drive `object/create`, `task/create`
   (+ `trigger_config`), and the global settings through the same WS commands
   the panel uses, so everything is validated server-side. Dry-run/preview each
   batch and get a single confirmation before writing.
5. **Verify & hand off** — after setup, sanity-check that entities were created
   and triggers resolve, then summarise what was configured and what needs a
   human decision (intervals it couldn't infer, sensors it wasn't sure about).

Ships as a documented skill/playbook (prompt + the WS command contract +
discovery heuristics) rather than integration code — the backend already
exposes everything it needs (56+ WS commands, entity introspection, documents).
Guardrails: confirm before every write, never invent intervals silently, keep
the token handling safe, and prefer proposing over auto-applying.

### ✅ Shared maintenance — multiple assignees + rotation
**Shipped.** Assign a task to several household members (`assignee_pool`) and
rotate responsibility automatically on each completion — round-robin,
least-completed, or random. The "currently responsible" user stays a single
pointer (`responsible_user_id`) so all existing per-user notifications and
badges keep working. Set via the panel task dialog + the options-flow edit
step.

### ✅ Native To-do entity
**Shipped.** A single global `todo.maintenance` list entity aggregates every
active task; item status mirrors due state (due/overdue/triggered →
needs-action, otherwise completed), and checking an item off completes the
task. Appears in the native **To-do** card and is reachable via
**Assist/voice**. Complements — does not replace — the panel and the Lovelace
card. Optional per-assignee lists can pair with rotation later.

### ✅ Multiple reminders per task + overdue escalation
**Shipped.** Configure several lead-time reminders via the
`reminder_lead_days` list (e.g. **14 / 3 / 0** = 14 days, 3 days, and on the
due date) in the panel notification settings; a daily check fires one extra
reminder on each matching day, honouring quiet hours, vacation mode, snooze,
per-user routing, and the daily limit. The overdue repeat cadence has existed
all along via `notify_overdue_interval_hours`.

---

### 🛠️ Spare parts & consumables inventory (planned next)
Maintenance consumes things — filters, seals, descaler, softener salt,
mower blades. A per-object **parts list** tracks each part's name, product
URL and current stock with a reorder threshold: dropping below it
auto-creates a one-off "buy …" task, and completing a maintenance task that
consumes a part optionally decrements its stock. Part datasheets/receipts
attach through the existing document store; stock levels surface as sensor
values for automations. Turns "the task is due" into "the task is due AND
the filter is already on the shelf".

---

## Next (under consideration)

### ✅ Replace an object (successor flow)
**Shipped** in v2.20.0. When an appliance dies and is replaced, deleting
the object loses its history and rename+reset mixes two machines' records.
**Replace…** (object detail header / `object/replace` WS) retires the old
object in place — archived with a `replaced_by` marker, history and costs
stay browsable — and creates the successor pre-filled from it: task
configuration and documents carried over (blobs refcounted, not copied),
counters fresh, installation date today, serial number and warranty cleared.
Identified via the device-biography journey review
(docs/design/user-journeys.md, N1).

### ✅ Object pause / seasonal mode
**Shipped** in v2.20.0. Seasonal equipment (pool, lawn mower, AC) is out of
service for months — vacation mode is global and archive retires entirely;
neither fits "paused until spring". **Pause** (object detail header /
`object/pause` WS, optional auto-resume date) freezes the object's schedules:
tasks read a new `paused` status, triggers tear down, nothing notifies, the
calendar and To-do list skip them — but the object stays visible with its
history. Resume (manual or automatic on the set date) re-anchors recurring
tasks to a fresh cycle, exactly like unarchive. Identified via the
device-biography journey review (docs/design/user-journeys.md, N3).


### ✅ End-of-month scheduling (last day / last business day / ±N offset)
**Shipped** in v2.18.0 (requested in
[Discussion #83](https://github.com/iluebbe/maintenance_supporter/discussions/83)).
The day-of-month schedule gained **last day of the month** and **business days
only** (roll back over the weekend — Workday-aware when HA's Workday
integration is configured), and every calendar pattern accepts a **±N-day
offset**. "Two days before the last working day of the month" is three
clicks: last day ✓, business days ✓, offset −2.

### ✅ Finite recurring series (repeat N times / recur until a date)
**Shipped** in v2.22.0 on every surface. A recurring task can stop on its own:
"descale weekly, 8 times, done" or "quarterly checks until the warranty ends".
`schedule.ends = {count?, until?}` — either or both; when the series ends the
task stops re-arming and reads as *done*, like a completed one-off. Editable in
the panel task dialog (the **Ends** selector: never / after N times / on date)
and the config-flow edit form; round-trips through JSON/YAML export/import.
Distinct from the one-off type and from the seasonal-pause `until` (which only
auto-resumes, never ends the series).

### ✅ Seasonal active window (only due in certain months)
**Shipped** in v2.22.0 on every surface. A *declarative* month window on the
schedule: "only due April–October" — a computed due date outside
`schedule.season_months` rolls forward to the start of the next active month,
so the task never sits "overdue" through the off-season. Natural for mower
service, pool care, or pre-winter heating checks. Editable via the month picker
in the panel task dialog and the config-flow edit form; round-trips through
export/import. Complements — and is independent of — the soft **seasonal
factors** and the manual **object pause**.

### ✅ Postpone a single occurrence (defer to a date, without completing)
**Shipped** in v2.22.0. "Not this week — push this one to next Tuesday": the
**Postpone…** action in the task ⋮-menu moves **only the current due date**
(a one-shot `due_override` via WS `task/postpone`), not the schedule anchor;
the next completion consumes it and the cadence returns to normal. A
*postponed to …* badge shows on the task, and dashboard card rows carry a
small calendar-clock indicator. Distinct from **snooze** (notifications only)
and **reset to a date** (re-anchors the whole recurrence). Round-trips through
export/import.

### ✅ "Meter reading" task type
**Shipped** (enum value in 2.18; the reading-specific fields in v2.20.0). From [Discussion #83](https://github.com/iluebbe/maintenance_supporter/discussions/83).
Reading-type tasks now carry a per-task **unit** ("kWh", "m³", …) editable in
the task dialog and both config-flow forms, and the completion dialog gains a
**Reading value** field: the recorded value lands on the history entry and
the timeline shows each reading with its **delta vs the previous reading**
(+123.5 kWh). Also on the `complete` service and WS command
(`reading_value`); unit round-trips through JSON/CSV export/import.

### ✅ Priority levels
**Shipped.** An explicit priority per task (low / normal / high) to sharpen
triage when many tasks are due at once — a priority badge in the panel, carried
through create/update on every surface (WS, 3 config-flow forms, task dialog),
and persisted only when non-default.

### ✅ "Missed" status + completion window
**Shipped.** Skipping an overdue task records it as **Missed** (a distinct
history type) rather than a deliberate skip — clearer history + compliance
views. A per-task `earliest_completion_days` optionally restricts premature
completion (the annual inspection can't be signed off three weeks early); the
complete/quick-complete WS paths + the To-do list honour it.

### ✅ Task work sheet — a printable one-pager per task
**Shipped** in v2.21.0. Print what you need at the machine, not a whole
manual: *Work sheet* in the task ⋮-menu opens a print-ready one-pager with
object + task details, the checklist as tick boxes, the notes, and a **QR
code pair** (open the task / complete it) so the paper links back to the
panel. When the task has a linked PDF manual with a page hint
(`task_pages`), the sheet links a server-cut **manual excerpt** — the new
`document/{id}/excerpt` endpoint (pypdf) extracts "from page X, N pages" of
the stored PDF for printing alongside.

### 💡 Saved filter views (profiles)
The panel and card offer rich filtering, but every filter is transient. A
**named, saved view** (combination of status / labels / areas / objects /
assignee) would be reusable across the panel task list, the Lovelace card
config, and — the interesting part — **notification routing**: "only notify
me about tasks in view 'Garden'". Shared across devices via the global
settings store.

### 💡 Adopt problem sensors as triggered tasks
Many integrations expose `binary_sensor` entities with
`device_class: problem` (printer errors, filter warnings, battery alerts).
An opt-in sync could mirror selected problem sensors as sensor-based tasks:
the task triggers while the problem is active and resolves when it clears —
putting one-off appliance complaints into the same inbox, history and
notification pipeline as planned maintenance. Needs careful scoping
(explicit include/exclude by entity, device, area or label) so a chatty
integration can't flood the task list.

### 💡 Cross-cutting labels / tags
Lightweight tags (e.g. `#safety`, `#seasonal`, `#tenant-visible`) that cut
across objects, areas, and groups for filtering and reporting — orthogonal to
the existing hierarchical grouping.

### ✅ Warranty-expiry reminders
**Shipped** (opt-in). A daily check reminds once when an object's stored
`warranty_expiry` is exactly N days out (default 30, configurable 1–365 in the
panel settings). Routes through the notification manager (quiet hours, bundling,
dual service/entity send). Distinct from a recurring task's due date — it's a
one-off date on the object, not a schedule.

---

## Usability & design wave (planned, 2026-07)

Smaller, high-frequency wins first; each ships independently.

### Quick wins
- ⏸️ **Object photos as avatars** — the documents feature already stores images;
  pick one as the object's thumbnail in cards and the objects table. **On hold**
  (2026-07): unsure it reads/looks well at avatar size — revisit with a design
  mockup before building.
- ✅ **Duplicate task / object** (v2.14.0) — clone an existing task or a whole
  object with its tasks as a starting point.
- ✅ **Undo toast instead of confirm dialogs** (v2.14.0) — low-risk actions
  (complete, skip, archive) execute immediately with a few seconds of "Undo".
- ✅ **Snooze in the panel** — a "Snooze" item in the task more-menu routes to
  the existing NotificationManager snooze (suppresses reminders for
  `snooze_duration_hours`), via a new `task/snooze` WS command.
- ✅ **Bulk actions** (v2.15.0) — Select mode with checkboxes + bulk bar to
  complete/archive many tasks at once.

### Bigger building blocks
- ✅ **First-run onboarding + template gallery** (v2.15.0) — a "From template"
  button + first-run empty-state nudge opens the 13 templates by category.
- ✅ **"Today / this week" view** (v2.15.0) — mobile-first focus list (Overdue /
  Due today / This week) with one-tap complete.
- ✅ **Command palette (Ctrl+K)** (v2.15.0) — global fuzzy search across objects
  and tasks with keyboard nav.
- ✅ **Weekly digest notification** (v2.15.0, opt-in) — Monday-morning summary
  through the notification manager.
- ✅ **Printable maintenance report (PDF)** (v2.15.0) — per-object asset data,
  task table, costs; opens in a new tab to print / "Save as PDF".

### Design system
- 🟡 **Dark-mode & color-blind audit** — status badges carry a shape icon and the
  chart danger zone uses a diagonal hatch (v2.15.0). Status colours are now all
  routed through HA theme tokens (a tripwire test blocks bare colours from
  reappearing). Remaining: live multi-theme contrast QA in the browser (a manual
  check that can't be unit-tested).
- ✅ **Task-detail information architecture** (v2.15.0) — Weibull/seasonal
  analysis cards are collapsible with per-section remembered state.
- ✅ **Panel performance as a feature** — code-splitting (strategy chunks),
  `content-visibility: auto` on object cards / history timeline / Today list,
  and (new) a **genuinely virtualized dashboard task table**: above 120 rows
  only the scroll window is in the DOM (spacers keep the scrollbar honest), and
  a hidden sizer row pins the content-sized badge column so the shared subgrid
  tracks can't jitter while scrolling. Verified live with ~300 tasks: 36 DOM
  rows, byte-identical column widths at top/middle/end.

## Maintainability (internal, scheduled before the feature wave)

Refactorings that keep the codebase healthy as it grows — no user-visible
changes, but they gate how cheap the features above are to build.

- ✅ **Extract per-type trigger evaluators** — done: the coordinator's
  `_evaluate_trigger_fallback` dispatches to pure `evaluate_threshold/counter/
  state_change/runtime` functions in `helpers/trigger_fallback.py`, each unit-
  tested in `test_trigger_fallback.py`.
- ✅ **Move `_trigger_state` out of `trigger_config`** (v2.13.0) — dynamic trigger
  runtime now lives in the per-entry Store, reconstructed into `trigger_config`
  only at read.
- ✅ **Modularize the panel** — cohesive render clusters live in `renderers/`
  free-function modules: progress bars, history sub-view, and (new) the entire
  **task-detail cluster** (`renderers/task-detail.ts` — header/actions, tab
  bar, overview tab with KPI/meta/analysis cards, history tab) behind a
  `TaskDetailContext` of ~20 panel-owned callbacks. Dialog ownership stays
  panel-side by design, so the module renders into the panel's shadow root and
  never touches a dialog itself. The panel shrank ~2.9k → ~2.5k lines.
- 🟡 **Panel ↔ config-flow parity by construction** — the *global settings*
  surface derives from one `helpers/settings_registry` source, and the
  task-field **values** now derive from one `helpers/task_fields` source
  (priority/anchor/rotation enums + warning/earliest/interval ranges consumed
  by both WS schemas, the sanitizer, and every config-flow selector; tripwires
  pin the TS dialog and fail the build on re-hardcoded literals). Field
  *existence* in both UIs is enforced by `test_parity_task_fields`. Remaining:
  the two task/trigger *forms* are still hand-written — full form generation
  from field specs is the long-term step.
- ✅ **Parallelize the test suite** (pytest-xdist) — CI runs
  `pytest -n auto --dist loadfile`; per-test blob isolation
  (`_isolate_document_blobs` conftest fixture) keeps the parallel run
  deterministic.

---

## Exploratory (longer-term ideas)

- **Voice / Assist task creation** — create a task by natural language through
  HA Assist ("add maintenance: replace HVAC filter every 3 months").
- **Optional gamification** — per-user completion streaks / points for shared
  households, off by default.
- **Approval workflow** — manager sign-off on completions for operator /
  commercial setups (dovetails with operator mode).
- ✅ **Photo attachments** — **Shipped.** Attach a photo when completing a task;
  stored via the DocumentStore (deduped, backup-safe) and shown as a thumbnail
  in the history timeline.

---

Have an idea or want to vote on one of these? Open an issue with the
`enhancement` label, or join the
[Ideas discussions](https://github.com/iluebbe/maintenance_supporter/discussions).
