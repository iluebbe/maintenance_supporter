# Feature Reference

The complete feature catalogue of Maintenance Supporter — what exists, since
which version, and how the pieces fit. For a task-oriented introduction start
with the [README](../README.md); for every configurable parameter see
[CONFIGURATION.md](CONFIGURATION.md); for copy-paste automations and dashboards
see [EXAMPLES.md](EXAMPLES.md).

## In action

Short clips of the key flows (recorded reproducibly against the demo
instance — `e2e/gifs-demo.mjs` refreshes them per release):

**Create an object from a template** — pick one of 47 templates and get an
object with typical tasks pre-configured:

![Create from template](images/gifs/create-from-template.gif)

**Complete a task** — one tap, optionally with notes, cost and a photo:

![Complete a task](images/gifs/complete-task.gif)

**Why is this task due? Because a sensor said so** — the threshold behind the
*Triggered* badge, with the live reading next to it:

![Sensor trigger](images/gifs/sensor-trigger.gif)

**Parts that reorder themselves** — completing a task consumes its parts; when
the stock crosses the reorder threshold, the *"Buy …"* reminder appears on its
own, no automation involved:

![Spare part crossing its threshold](images/gifs/parts-auto-buy.gif)

**A task can demand details before it counts as done** (2.44) — *Complete*
stays disabled until the required fields are filled, on every surface:

![Required completion details](images/gifs/required-details.gif)

**The next dates while you type** — change the cadence and the preview
recomputes, so a schedule is right before it is saved:

![Schedule preview](images/gifs/schedule-preview.gif)

**Shared chores hand over** — completing one moves the duty to the next person
in the rotation:

![Duty rotation](images/gifs/duty-rotation.gif)

**A printable report per object**, in the object's ⋮ menu — print it or save it
as a PDF:

![Object report](images/gifs/object-report.gif)

![The printable maintenance report](images/object-report.png)

**Calendar card, filtered to one object** (`object_filter`, v2.40):

![Calendar object filter](images/gifs/calendar-object-filter.gif)

**One task for every battery in the house** — the Battery Fleet roster tracks
each battery with its level, discharge sparkline and predicted replacement
date; the shopping list groups what to buy by type:

![Battery fleet roster](images/gifs/battery-fleet.gif)

**Scan the printed QR code, task done** — the deep link fires a
quick-complete with the task's stored defaults (cost, duration, notes); the
only UI is the confirmation toast:

![QR quick-complete](images/gifs/qr-quick-complete.gif)

**A task only a scan may complete (2.67)** — the dialog warns, the server refuses

![Tag-gated task refused without a scan](images/gifs/tag-scan-required.gif)

**Buy reminders in the household shopping list (2.67)** — check one off there and the part is restocked

![Shopping-list sync](images/gifs/shopping-list-sync.gif)

## Screenshots

| Dashboard | Task Detail | Mobile |
|:-:|:-:|:-:|
| ![Overview](images/overview.png) | ![Task Detail](images/task-detail.png) | ![Mobile](images/mobile-overview.png) |

The dashboard shows live status KPIs, monthly/yearly budget bars, priority
markers, labels, per-user assignment badges, and mini-sparklines for
sensor-triggered tasks — on phone-width rows the squeezed curve gives way
to a colour-coded **trend arrow** in the trigger label (heading toward the
threshold ↗, holding →, easing away ↘) and the due column is fixed-width
so every row's progress bar reads the same scale (2.71+). On panels wider than ~1500 px the dashboard becomes a **master-detail split**: the task list stays on the left and the full task detail (trigger chart, KPIs, history, actions) docks on the right — clicking a task previews it in place instead of switching pages, and the detail's breadcrumb still opens the full page (2.71+). The docked detail never scrolls on its own: it docks scroll-aware — a detail taller than the window is pinned by its bottom edge while you scroll down and by its top edge on the way back up — and selecting a task parks it where you are looking, even at the end of a long list. The task detail page adds the full trigger chart
(current value vs. threshold over 7d–1y), KPI tiles, and the cost & duration
history chart.

![Master-detail split on a wide panel](images/split-view.png)

<details>
<summary>More screenshots</summary>

### Object Detail
Warranty status chip, free-form notes, the documents section (uploaded PDF
manual + web link), and the object's tasks with assignment badges.

![Object Detail](images/object-detail.png)

### Today View
The panel's default landing tab — what needs attention now, bucketed into
*Overdue / Due today / This week* with one-tap complete. Deep-linkable
(2.74+): `/maintenance-supporter?tab=today`, `?status=overdue`,
`?sort=object` or `?view=<saved view>` open the panel on exactly that list —
from a dashboard button or a notification tap, even while the panel is
already open ([Examples → Deep links](EXAMPLES.md#deep-links--open-an-object-or-task-from-anywhere-160)).

![Today view](images/today-view.png)

### Objects Table
The *All Objects* view as a sortable table with configurable columns and CSV
export. Warranty chips show all three states: green *valid until*, amber
*expires in N days*, red *expired*. The paperclip badge counts attached
documents.

![Objects table](images/objects-table.png)

### Complete Dialog
Optional notes / cost / duration, an optional **Completed at** date for
backfilling work that was done earlier (empty = now; see
[Events](#events) for how backdated entries behave), and a completion
photo (camera capture on mobile); checklist steps tick off right in the
dialog. When the task
consumes spare parts that carry unit prices, their sum appears as a
**one-click cost suggestion** under the cost field — following your live
parts selection, and vanishing the moment you type a cost yourself. A task
that **requires a tag scan** (2.67+) says so up front: the dialog carries
the notice, and the server refuses the button — see *Proof of presence*
below.

![Complete Dialog](images/complete-dialog.png)

### Proof of presence (2.67+)
Tick **Require tag scan to complete** next to the task's NFC tag and the
task can only be marked done at the thing itself — by scanning that tag or
the printed QR code. The complete dialog announces it; the panel, card,
to-do list, voice and notification buttons are refused server-side.

![Require tag scan toggle in the task dialog](images/task-dialog-tag-scan.png)

![Complete dialog announcing the scan requirement](images/complete-dialog-tag-scan.png)

### Markdown notes (2.67+)
Task and object notes render as Markdown — bold, lists, links — on the task
detail, the object detail and the quick-actions dialog. The note editors
hint at it; printables deliberately stay plain text.

![Markdown notes on a task](images/task-notes-markdown.png)

### Task History
Every completion with cost, duration, and notes — inline-editable, searchable,
with completion photos when attached.

![Task History](images/task-history.png)

### Settings Tab
Feature toggles (advanced features are hidden until enabled), panel access
delegation, notification / budget / vacation sections, and (2.67+) the
**shopping list** the buy reminders mirror into — all editable in-panel by
admins.

![Settings tab](images/settings-view.png)

### Spare Parts & Consumables (2.23+)
The object's parts shelf (below the task list): a stocked descaler (6 pcs),
the water filter **at its reorder threshold** (orange low badge + cart icon —
its auto-created *Buy…* task is already in the task list above), and a
catalog-only seal with just identifiers. Stock adjust, edit and delete per row.
The paperclip on a row (2.26+) links the object's **documents** to that part —
datasheet or receipt right at the shelf; part links survive export/import and
*Replace object* like task links do.

![Parts & consumables section](images/parts-section.png)

Completing the auto-created *Buy…* reminder asks for the **quantity bought**
(prefilled with the part's restock quantity) and restocks the shelf.

**Shopping-list sync** (2.67+): pick one of your HA to-do lists (any `todo.*`
entity — the built-in Shopping list, a Local To-do, Bring!, …) under Settings
→ General and the *Buy…* reminders mirror into it automatically. Check an item
off while you're at the store and the reminder completes itself, restocking
the part by its configured quantity; restock through the panel instead and the
row disappears. The sync only ever touches its own rows — the rest of your
shopping list is left alone.

![Buy reminders mirrored into a Local To-do list](images/shopping-list-sync.png)

![Settings: pick the shopping list](images/settings-shopping-list.png)

![Buy-task complete dialog](images/parts-buy-dialog.png)

**One stock for several appliances (2.44+, #111).** Three robot vacuums and one
box of dust bags: the box lives on one object and every appliance's task links
to *it*, so each completion draws on the same number instead of three private
copies of a pile that only exists once. In the task dialog those show up under
*Parts from other objects*, grouped by the object that owns them, and a linked
row reads *"Dust bags (Shelf)"* so it is never ambiguous which shelf drains.

**All parts at a glance (#130).** The All-objects view links to an **All
parts** sibling view: every part across the instance in one table — owning
object, live stock with low indicator, threshold, unit price, storage
location and every consuming task (pooled links marked) — with CSV export.
And the **history-entry edit dialog** exposes the same parts inputs as the
live completion dialog, reconciling stock by the per-part difference, so
backfilled or corrected entries keep the shelf honest.

![All parts view](images/all-parts.png)

Because the pool keeps a single owner, there is exactly **one** reorder
threshold, **one** low badge, **one** stock sensor and **one** *Buy…* reminder
for one purchase — not one per appliance. Deleting the owning object does not
strand the rest: the part and its current stock **move** to the appliance that
has been drawing on it longest, the other links follow, and a notification
tells you what went where so you can move it somewhere better. A deleted
object's *unshared* parts stay private and are removed with it.

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

### Adopt Problem Sensors
Discover HA `device_class: problem` binary sensors (printer errors, filter
warnings, low battery) and adopt selected ones as tasks that trigger while the
problem is active and clear themselves when it resolves. Each proposes a target
object and shows its live state; the integration's own sensors are excluded.
When the target object already owns a **spare part** whose name matches the
sensor (toner-low ↔ *Toner cartridge*), adoption pre-links it as the task's
consumed part — completing the task then consumes/restocks it, closing the
problem → task → buy-part loop in one step. The adopt dialog can assign a
**responsible user** to every adopted task in one go.

**Lifecycle of an adopted task** — the task is created *at adoption*, not when
a problem first occurs. From day one it sits in the task list (status OK) and
is configurable like any other task: responsible user or rotation pool,
priority, labels, notes, documents, checklist, part links. What the problem
sensor controls is only *when it becomes due*:

- **Sensor turns on** → the task becomes due immediately and the normal
  reminder/notification pipeline runs (including the responsible user's
  routing). There is no advance-warning phase — the sensor itself *is* the
  warning, so `warning_days` never applies here.
- **Sensor turns off** → the task auto-completes through the regular
  completion path: a history entry is written (marked **Automatic**, with no
  user attribution), linked spare parts are consumed at their default
  quantity, statistics and `on_complete_action` run. A rotation pool does
  **not** advance on an automatic completion — nobody was credited with the
  work, so nobody is skipped.
- **Manual completion** while the problem is active works as usual (with
  user, cost, parts, photo) and takes precedence — a recovery arriving within
  two minutes of it is not recorded twice.

**Configuration survives un-adopting**: deleting an adopted task stashes its
notes, responsible user, priority, labels and part link per sensor, and the
next adoption of the same sensor restores them (part links are re-validated
against the target object's parts).

![Adopt problem sensors](images/adopt-problem-sensors.png)

[INTEGRATIONS.md](INTEGRATIONS.md#beyond-this-list-problem-sensor-adoption)
lists, per integration, the problem sensors known to be adoptable — from
Synology disk health over hOn dishwasher salt/rinse-aid to the vehicle
warning-lamp families.

### Suggested Setups (2.28+, Beta)
> **Beta**: integration discovery is new and the signature catalog grows
> release by release. Every entry is verified against the integration's source
> code, but real-world device variety is large — if a supported device isn't
> discovered (or a well-known consumable sensor is missing), please open an
> issue or discussion with the integration name and entity ids.

**Suggested setups** (in the dashboard's *Add ▾* menu) discovers devices of supported integrations
whose consumable sensors can drive maintenance tasks and sets them up in one
click. The catalog currently covers **123 integrations with 235 verified
signatures** — vacuums, mowers, kitchen appliances, printers, cars (including
Škoda/Audi service countdowns straight from the vehicle), air purifiers,
heating and water treatment, locks, pet tech and more; the complete,
always-current list with every duty and default lives in
**[INTEGRATIONS.md](INTEGRATIONS.md)** (generated from the catalog itself, so
it cannot drift). The object is bound to the
device and every task arrives with its trigger **pre-wired** — a **threshold**
(below 24 h left / below 10 % remaining — the household's *Consumable low threshold* setting, 2.69+ / above a usage-hours count, unit-aware)
for numeric consumables, a **state latch** on the event for Home Connect's
`present`/`off` maintenance events, or a **usage-interval counter** for
lifetime hour meters (every N hours of use, re-baselined on completion).
Replacing the consumable, resetting the wear counter, or the appliance clearing
its event resolves the task automatically. Every signature in
the catalog is **verified against the integration's source code** (a tripwire
enforces the source reference and full localization). Discovery claims are
**per duty, not per entity** (2.41+): one source entity can back several duties
— a mower's hours counter drives both *Replace blades* and *Clean
undercarriage* — so adopting one duty leaves its siblings proposable, while a
task already watching that entity under the *same* catalog duty (in any
language) is never proposed twice. Only a watcher whose task was **renamed**
away from its catalog name conservatively claims the whole entity, so a
re-run never proposes against your rename. Duties whose entities are serviced
one at a time come as **one task per entity** (2.68+): a colour printer's
ink/toner/drum duties (IPP, Brother) split into *Replace Toner — Cyan*,
*— Magenta*, … named after the cartridge entity, each watching only its own
sensor, so completing one colour never touches the others; a mono printer
keeps the single task.

### Battery Fleet (Battery Notes or native)
If you have many battery devices, 30–70+ of them would mean 30–70 maintenance
tasks — noise. Instead, **one click** sets up a single *Battery Fleet*: **one
object, one task** that aggregates every battery, and one managed spare-part per
battery **type**.

It works best with the [Battery Notes](https://github.com/andrew-codechimp/HA-Battery-Notes)
integration, which supplies each battery's **type, quantity, low-threshold and
last-replaced date** — everything the shopping list and forecast need. That
includes devices whose battery reports **only a low binary and no percentage**
(some Matter locks, #121): Battery Notes creates no percentage sensor for
those, so the fleet reads the same metadata from the low binary — real type,
quantity, forecast; just no charge level. Battery
Notes is **not required**, though: any device that exposes a native
`device_class: battery` sensor or low-battery binary is picked up too, in a
**degraded mode** (type shown as *Unknown*, quantity 1, no last-replaced
forecast) — including %-sensors that ship **without** a `device_class`
(some Zigbee2MQTT/ESPHome devices), found via a strict battery-name
heuristic that keeps charging electronics and home-storage SoC sensors
out. One low floor applies fleet-wide: any battery at **≤ 20 %** counts
as low — for Battery Notes batteries in addition to their own configured
threshold (a higher Battery Notes threshold still wins). A device covered by
a Battery Notes note is never double-counted with its own native sensor, and
self-charging devices (robot vacuums/mowers, devices with a charging sensor,
Companion-app phones) are skipped entirely — **even when a Battery Notes note
exists for them**: Battery Notes auto-discovers such devices from its library,
so a note is no proof anyone means to swap cells there. **Rechargeable battery
types** (Rechargeable, Li-ion, NiMH, power/battery packs — a Nuki's pack, a
camera's quick-release battery) stay in the fleet — a low reading still means
*charge it* and still fires the fleet task, marked with a small charging icon —
but they never enter the shopping groupings, never become a spare-part at
setup, and get no type-lifetime date (only a discharge-trend one, which for a
rechargeable literally reads "charge it in ~N days"). A native battery that was low
and then goes **unavailable** (a dead battery takes its device offline)
stays listed for up to 48 hours instead of vanishing at the exact moment it
needs replacing.

![Battery Fleet](images/battery-fleet.png)

The fleet task's detail view is the whole surface:

- **Which batteries are low now**, each with its device, type × quantity and
  charge level, and a per-device *mark replaced* action.
- **A grouped shopping list** — *"Buy now: 1× 9V · 2× AA · 4× AAA · …"* — so you
  know exactly what to pick up, not which device needs what.
- **A "needed soon" forecast** grouped by type, so you can order ahead —
  the soonest (already past their expected life first) at the top. Where the
  recorder holds enough level history, the date is **regressed from the
  battery's real discharge trend** (2.50+ — the same prediction engine
  sensor-triggered tasks use, asking *"when does this level cross the low
  threshold?"*; trend dates get a dotted underline and the tooltip names
  source + confidence). Three guards keep it honest: only medium/high
  confidence counts, extrapolations beyond a year are dropped, and a series
  that *recovers* by more than 10 % inside the window is rejected — real
  discharges are monotone-ish; big bounces mean the percentage tracks
  something else (a cold-dipped voltage reading, a self-charging device).
  Everywhere else it falls back to the last-replaced
  date plus the type's typical service life. A Battery Note that carries
  **only** a replacement date and no level sensor — its state reads *unknown*
  forever — is kept for exactly this: the date is all the fallback needs, so
  those batteries surface here instead of dropping out unseen. A prediction
  whose date has **passed while the battery still reports healthy** shows a
  warn-tinted calendar hint instead of a negative countdown — deliberately
  never counted as low and never firing the task (forecasts carry error
  bars; the sensor says fine): the usual cause is a swap that was never
  recorded, which the hint's tooltip points at.
- **Every tracked battery, behind *All tracked batteries*** — the full roster,
  each row tagged *Low*, *Soon* or *Healthy*, collapsed by default so the
  section still opens on what needs doing. Each row draws a **30-day
  discharge sparkline** (2.51+) from the recorder — with a faint line at the
  low threshold, and on trend-dated rows a **dotted projection** from the
  last reading down to that threshold, so the ~date is something you can
  *see*. The history is fetched only when the roster is opened and cached
  for 6 hours. The roster sorts by **urgency by default** (#123): low
  batteries first — emptiest first — then the soonest forecast, dateless
  rows last; a toggle switches to an alphabetical lookup list, and the
  choice is remembered per browser. On a low rechargeable
  the mark action reads *mark as recharged*. The **shopping quantities are
  clickable**: tapping "4× AAA" filters the roster to the devices that need
  them. Every row carries a small **level bar** next to the percentage,
  colored against the battery's **own** low threshold (a sensor whose note
  warns at 35 % turns red at 35, not at a hard-coded 20), and
  when the history shows a big upward step that was never recorded — fresh
  cells went in, but nobody pressed Battery Notes' *replaced* button, so the
  forecast still anchors on the dead battery's date — an amber **record this
  replacement** action appears that writes the *detected* jump time to
  Battery Notes in one click.
- **Exclude a battery by hand** — the eye-off action takes a device out of the
  fleet for good (count, shopping list and forecast), for the cases the
  automatic skips don't cover. It sits on the low rows **and on every row of
  the roster**, so a device can be dismissed *before* it ever reports low — a
  robot vacuum that recharges itself, or a phone that already warns you on its
  own. Excluded batteries are listed separately and can be brought back the
  same way.
- **Add a battery by hand** (#135) — the mirror case: a picker at the bottom
  of the roster adds a sensor the automatic discovery missed (no
  `device_class`, unusual naming, or a device the self-charging filter
  skipped). The include acts device-wide — whichever of a device's battery
  entities is picked, the richest source (a Battery Notes note) wins the
  roster row — and bypasses the heuristics but never the dedupe; excluding a
  manually-added battery simply lifts the include again.
- **Track self-charging batteries** (#135) — a roster toggle that keeps
  phones, vacuums and other self-recharging devices in the fleet as
  rechargeables: a low one asks for a charge (never for new cells), and the
  due-line attributes say *"— recharge"*. Off by default; exclusions still
  win per device.
- **Dashboard-ready due lines** (#135) — the fleet's low-count sensor exposes
  `batteries_due` and `batteries_due_soon` attributes: one readable line per
  device, *"Front door lock — replace (CR2)"* for primaries and *"Robot dock —
  recharge"* for rechargeables (capped at 30 lines each), so a markdown card
  or automation can show what to do without templating over the roster.
- **Mark all replaced** in one tap: this presses each battery's Battery Notes
  *replaced* button (resetting the forecast) and consumes the matching spares
  from stock. The task clears itself once the devices report fresh batteries.

Because battery types are ordinary **spare parts**, the existing stock and
reorder machinery applies — track how many AA/CR2032/… you keep, and the
*Parts to reorder* count flags a type before you run out. Only *real* types
become parts: rechargeable packs and the *Unknown* bucket of typeless native
batteries are excluded (an "UNKNOWN battery" spare with a reorder threshold
and a shopping-search buy link for the literal word UNKNOWN helps no one —
give the battery a Battery Notes note and it gets a proper part). The single task is
triggered by a global `sensor.maintenance_supporter_batteries_to_replace`
(count of low batteries) via an ordinary threshold trigger — no special-casing,
and it auto-completes when the count returns to zero.

**Removed or offline batteries** are handled gracefully. A battery whose device
goes *offline* (a dead battery often takes its whole device down) keeps its
last-known low flag, so it stays visible in the list — marked *offline* — rather
than silently vanishing when you most need to see it. A battery that is merely
offline **without** being low is treated as connectivity noise and hidden. And a
device that is fully **removed** from Home Assistant (unpaired, deleted) simply
drops out of the aggregate on the next read — the low count falls, and the task
auto-completes if nothing else is low. Marking is robust to a battery that
disappeared between opening the view and tapping *replaced*.

The **Battery fleet** setup button appears in the task-list actions only when at
least one battery device is present and the fleet isn't set up yet.

### Saved filter views
Name a combination of the panel task-list filters — status, responsible user,
**label**, **priority** (#134), archived, plus sort and group-by — and reapply
the whole set in one tap from the toolbar (e.g. *"Kitchen overdue"*,
*"Unassigned this week"*, *"High priority"*). Views are **shared** across
everyone who opens the panel and persist across restarts; save the current
filters or manage/delete existing views from the same dialog. Hand-editing any
filter clears the active-view selection, so the dropdown never lies. A view can
also **route notifications**: pick it under Settings → Notifications → *"Notify
only for view"* and reminders fire only for tasks matching its
label/user/priority filters (display-only dimensions are ignored) — a *"High
priority"* view scoped there sends urgent tasks to your phone while a daily
digest automation covers the rest. And the **Lovelace card** can be scoped to a
view (`view_id` option / editor dropdown): the view's status/user/label/priority
filters apply on top of the card's own config.

### QR Codes
Per-task QR pair: *view* opens the task, *complete* records the completion.
Download as PNG/SVG or print; URL modes for LAN, external URL, or the
Companion app.

![QR Code](images/qr-dialog.png)

### Lovelace Card
The `custom:maintenance-supporter-card` on a regular dashboard, filtered to
actionable tasks. Each row also shows **who is responsible** (2.43+) — for a
rotating chore that is whoever is up next, following the rotation on every
completion. Rows with nobody assigned are unchanged, and `show_assignee:
false` (or the editor toggle) hides it. Names are resolved through a
read-tier command, so household members without admin rights see them too.

![Lovelace Card](images/lovelace-card.png)

### Battery Fleet Card
The `custom:maintenance-battery-fleet-card` (#135) puts the full fleet view on
any dashboard: what is low now, what runs out soon, the shopping line, and the
complete roster with sparklines, exclude/add controls and the
track-self-charging toggle — the same section the fleet task's detail page
shows, so nothing needs templating over sensor attributes.

![Battery Fleet Card](images/battery-fleet-card.png)

```yaml
type: custom:maintenance-battery-fleet-card
title: Batteries   # optional
```

### Calendar Tab (panel — 1.5.0+)
![Calendar tab](images/calendar-tab.png)

Window chips (7 / 14 / 30 days, *1 year*, plus past windows −30d/−90d for
reviewing what was done — a *missed* cycle shows with the overdue pill, never
green), per-event source icon (clock = time-based,
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

### Mobile
Creation and discovery live in **one primary "Add ▾" menu** (#125): *New
task*, *New object*, *From template*, then *Adopt problem sensors*,
*Suggested setups* and — only while a battery fleet is available and not
yet set up — *Battery fleet*. The same menu serves desktop and mobile, so
the dashboard header is a single controls row (filters + Select + New)
everywhere; on phones the six filter controls still collapse behind the
compact **Filter** toggle, and the KPI tiles at the top remain the one-tap
filter path.

**Young installations additionally get "Getting started" chips** — a row of
individually dismissible discovery hints ("Suggested setups found 3
devices…", "2 problem sensors can become maintenance tasks", the one-click
battery-fleet setup). They retire on their own as the setup grows (or the
moment you dismiss them): the menu is the stable home from day one, the
chips are visibly temporary. Mature installations never see them.

| Dashboard (collapsed controls) | Task detail |
|:-:|:-:|
| ![Mobile dashboard](images/mobile-dashboard.png) | ![Mobile Task Detail](images/mobile-task.png) |

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
- **Seasonal active window** (2.22+): restrict any recurring schedule to certain months (e.g. April–October for the mower) — a due date that would fall off-season rolls forward to the next active month, so the task never sits fake-overdue through winter. Month picker in the task dialog and the config-flow edit form. Since 2.34 the roll **preserves calendar patterns**: a "2nd Saturday" task windowed to Jan+Jul comes due on the 2nd Saturday of January — not on the month's 1st (interval schedules keep the roll to the 1st, "due once the season starts")
- **Live schedule preview** (2.34+, #83): while editing a task's schedule, the dialog shows the **next three concrete dates** the current settings produce — weekday-prefixed, updating live as you change fields, with the schedule time appended and an *assuming on-time completion* note on completion-anchored intervals. The dates come from the real scheduling engine (a read-only `schedule/preview` call), so season windows, business-day rolls, ±offsets and series ends are always exact:

  ![Live schedule preview](images/schedule-preview.png)
- **Finite recurring series** (2.22+): a recurring task can end on its own — after **N completions** and/or **on a date** ("descale weekly, 8 times, done"; "quarterly checks until the warranty ends"). When the series ends the task reads *done* like a completed one-off. The *Ends* selector (never / after N times / on date) lives in the task dialog and the config-flow edit form
- **Postpone a single occurrence** (2.22+): *Postpone…* in the task ⋮-menu defers **only the current due date** to a picked date — the next completion returns to the normal cadence. Distinct from snooze (notifications only) and reset (re-anchors the whole schedule). A *postponed to …* badge shows on the task; dashboard card rows carry a small calendar-clock indicator
- Task status tracking: OK, Due Soon, Overdue, Triggered, Paused, Archived
- **One-time tasks**: schedule a non-recurring job with an explicit due date; completing it marks it *done* (hidden from the card, shown as *Completed* in the panel)
- **Archive & retention** (2.10.0+): archive any task or object to retire it without deleting — archived items are **hidden by default** (a *Show archived* toggle reveals them) and go **inert** (no triggers, notifications, calendar entries, or active status counts), but keep their full history and cost (budget still counts). Archiving an object cascades to its tasks; unarchiving a recurring task starts a fresh cycle. Optionally **auto-archive** completed one-off tasks N days after completion, and opt-in **auto-delete** auto-archived one-offs after a further N days (manual archives are never auto-deleted)
- **Task work sheet** (2.21+): a printable one-pager per task from the ⋮-menu — details, the checklist as tick boxes, notes, and a QR pair (open / complete); if a linked PDF manual has a page hint for the task, a server-cut excerpt ("from page X, 4 pages") prints alongside
- **Template-gallery curation** (2.21+): hide individual built-in templates from the "From template" pickers via Settings → Template gallery — a growing catalog never clutters your picker; re-enable any time. Since 2.27 the gallery is **clustered by category group** with an enabled-count and a per-group toggle-all ("no pool? one click hides both pool templates")
- **Meter readings** (2.20+): the *Reading* task type records a value on every completion — set a per-task unit (kWh, m³, …), enter the reading in the complete dialog, and the history timeline shows each value with its delta vs the previous reading. Also available on the `complete` service for automations (`reading_value`)
- **Seasonal pause** (2.20+): pause a whole object (pool, lawn mower, AC) for the off-season — tasks read *Paused*, schedules freeze, nothing notifies, the calendar and To-do list skip them, but the object and its history stay fully visible. Optionally set an auto-resume date; resuming (manually or automatically) restarts every recurring task with a fresh cycle instead of months of fake overdue
- **Replace an object** (2.20+): when a machine dies, *Replace…* retires it in place (archived, history and costs stay browsable, marked with its successor) and creates the new unit pre-filled — same tasks (fresh counters), documents carried over, installation date set to today, serial number and warranty cleared for the new machine's own data
- **Spare parts & consumables inventory** (2.23+): a per-object parts list closes the "is the filter on the shelf?" loop. Each part carries identifiers (**manufacturer, MPN, GTIN/EAN** — validated against the worldwide GS1 GTIN family), a **storage location** ("basement shelf B, box 3"), a product URL, unit, unit price, and an optional **tracked stock** with a reorder threshold. Completing a task that *consumes* parts (linked in the task dialog, with a quantity per part) decrements the stock; crossing the threshold fires an edge-triggered event and — when the part opts in — **auto-creates a one-off "Buy {part}" task** whose notes carry everything needed to order (identifiers, quantity, price, storage spot) and whose link opens the product page or a **configurable shopping search** (Amazon by default, template with `{q}` placeholder). Completing the buy task **restocks** (quantity editable in the dialog, cost prefilled) and the reminder retires itself; restocking any other way clears the open reminder automatically. On the consumption side (2.53+), the complete dialog offers the **sum of the selected parts' unit prices as a one-click cost suggestion** — following the live selection, never overwriting a cost you typed yourself. Per-part **stock sensors** on the object device + a global *Parts to reorder* counter; the printable work sheet lists required parts with tick boxes; everything round-trips through JSON export/import. **Since 2.44 (#111) several objects can share one stock**: a task may consume a part owned by a different object, so identical appliances draw on one real pile rather than three bookkeeping copies — one threshold, one buy reminder, and an automatic hand-over of the pool if the owning object is ever deleted. The parts section header shows the **inventory value** (2.49+, discussion #104): Σ unit price × tracked stock across the parts that have both — purely informational, it never enters any budget total
- **Priorities** (2.17+): Low / Normal / High per task, shown as a badge (▲/▼) on task rows
- **Labels / tags** (2.17+): lightweight comma-separated tags per task (e.g. `safety`, `seasonal`), shown as chips and searchable in the command palette
- **Completion photos** (2.17+): attach a photo when completing a task (camera capture supported); stored via the documents engine and shown in the history timeline
- **Missed status + completion window** (2.17+): skipping an overdue task records it as *Missed* (distinct from a deliberate skip); an optional per-task *earliest completion* window blocks signing tasks off too early
- **Shared maintenance & rotation** (2.17+): assign a task to several household members and rotate responsibility on each completion (round-robin / least-completed / random). Since 2.42.1 a rotation task **always carries an effective assignee** (discussion #49): the first pool member is seeded whenever the task is created, edited or imported, a storage migration repaired existing tasks on upgrade, and editing the current assignee out of the pool hands the duty to the next member. Before that, a pool configured without an initial assignee left the task invisible to every user filter (panel, card, calendar card, saved views, per-user notifications) until its first completion
- **Native To-do entity** (2.17+): a global `todo.maintenance` list mirrors every active task; checking an item off completes the task — works with the To-do card and Assist/voice
- **Snooze from the panel** (2.17+): the notification snooze is also available in the task ⋮ menu
- **Virtualized task table** (2.17+): with hundreds of tasks, only the visible window is rendered — large installs stay snappy
- **Binary sensor** per task (`device_class: problem`) — ON when overdue or triggered, ideal for HA automations
- **Interval anchoring**: choose between completion-based (default) or planned-date anchoring to prevent schedule drift
- **Time-of-day scheduling** (optional, advanced): tasks flip to OVERDUE at a configured `HH:MM` in HA's timezone instead of at midnight. Calendar events become timed 30-min blocks so mobile calendars can set real reminders. Enable under Settings → Features.
- Assign tasks to responsible Home Assistant users with per-user notification routing — and since 2.44 a **per-person self-test** under Settings → Notifications: each household member is listed with the notify services they actually resolve to, plus a button that sends a test to exactly those. Members without a Companion device are named as such instead of quietly falling back, so "will this person get their reminders?" can be answered before a task comes due
- Custom task icons (any `mdi:*` icon via the HA icon picker)
- NFC tag linking — scan an NFC tag to complete a task
- **Proof of presence** (2.67+): a per-task *"Require tag scan to complete"* toggle turns the linked NFC tag (or the printed QR code) into the **only** way to mark the task done. Every remote surface — panel, dashboard card, to-do list, voice, notification buttons — is refused with a clear message ("walk over and scan the tag on the thing itself"); the complete dialog announces the restriction up front. Automatic trigger-recovery completions stay exempt, and automations can assert a physical scan via the `via_tag_scan` field on the `complete` service. Ideal when the point of the task is *being there* — checking the actual filter, standing at the actual machine
- **Per-task skip lock** (#150, 2.71+): a *"Don't allow skipping"* toggle in the task dialog removes the Skip action from every surface — dashboard rows, object task table, task detail, quick-actions dialog — and the server refuses `task/skip` and the voice SkipTask intent with a clear message, so automations cannot skip past it either. For tasks that must never be waved off: safety checks, compliance inspections
- **Cycle phases** (2.65+, discussion #139): one task, one cadence, **different work each time** — e.g. a mower-blade task that runs *flip, flip, replace* on the same 30-day rhythm. Define up to 10 named phases in the task dialog, arrange them in a cycle of up to 12 steps (repeats welcome), and every completion performs the step currently due and advances to the next, wrapping around. A phase can override the task's **checklist**, **consumed parts**, and **required completion fields** for its step (set = override, unset = the task-level value applies), so "replace" can demand the new blades and a cost entry while "flip" stays lightweight. Every surface names the step that's due — task detail shows the full cycle strip with each phase's last completion, the complete dialog, dashboard card, calendar, notifications and task sensor all carry the current phase — and history entries record which phase they completed. Skips and resets leave the cycle position untouched (the same work stays due, only the clock restarts), and operators can re-point the cursor from the task detail (or via `task/set_phase`) after a mis-click or when adopting a machine mid-cycle. Phases are edited in the panel task dialog, and the Integration Options flow carries a minimal editor too (one line per cycle step, `Name: item; item` for a phase checklist) — per-phase parts and required-fields overrides stay panel-side
- Checklists for multi-step procedures — editable in the panel task dialog (and in the Integration Options). **Steps can be ticked off as you go** (2.49+, discussion #73): the ticks persist server-side without completing the task — stop halfway, come back days later, the progress is still there and prefills the completion dialog. Completing or skipping the cycle resets the list for the next round; the ticked state at completion time lands in the history entry as before
- Task grouping for logical organization — **full CRUD UI** (create, edit, delete) with multi-checkbox task selector grouped by object
- **Sort & group-by** in the Tasks/Objects views — sort by due date, object name, task type, task name, area, assigned user, or group; group into collapsible sections by area, group, user, or object/device (1.0.44+; object 2.71+)

![Dashboard grouped by object](images/group-by-object.png)
- **Overdue indicator** — object cards show a red dot the moment any of their tasks is overdue (1.0.44+)
- **Quick task creation** — `New Maintenance Task` button on the Tasks view opens the task dialog with an Object selector dropdown, no need to navigate into the parent first (1.0.44+)
- **Operator mode** for non-admin HA users — non-admins get a read-only view (Complete / Skip / QR) so household members can run tasks without changing anything. Admins can **optionally delegate** create/edit/delete to selected non-admins via the **Panel Access** section — off by default, enforced server-side, toggled from the Settings tab or config flow. Orphaned ids surface as a fixable repair issue. Useful for shared/family/hotel setups (1.0.44+; server-enforced + opt-in 2.8.4)
- **Per-object documentation URL** (1.4.0+) — store a link to the PDF manual / vendor page on each object. Shown as a clickable link in the object-detail header *and* on every task-detail page belonging to that object (1.4.1+) so the manual is always one click away from any maintenance task. When the URL field is empty, the object header, the objects-table "manual" column and the object-manual row on task-detail pages fall back to **attached documents in the "manual" category** (2.47+/2.48+), so an uploaded handbook counts as the object's manual everywhere the URL would show
- **Per-object notes** (1.4.10+) — free-form multiline notes attached to each object: part numbers, replacement procedures, settings reminders, "spare key in garage drawer". Since 2.67 object and task notes render as **Markdown** (bold, lists, links — via HA's own sanitised renderer) on the object detail, task detail and quick-actions dialog; the note editors hint at it, and printables deliberately stay plain text
- **Calendar tab** (1.5.0+) — rolling-list view of upcoming maintenance with a window chip toggle (**7 / 14 / 30 days, plus "1 year" since 1.5.2**; the year view collapses empty days so only the actually-eventful rows render). Time-based recurring tasks project up to 5 occurrences within the window at 55 % opacity to mark them as "hypothetical assuming you stay on schedule"; sensor-triggered tasks show only their current `next_due` since predicting the next sensor firing would be a guess. Each event row carries (1.5.1+): a small **source icon** — `mdi:clock-outline` for time-based or `mdi:trending-up` (HA primary color) for sensor-based — and, for sensor-based events, a *"predicted · {high|medium|low} confidence"* pill below the title (green / amber / red border) sourced from the `threshold_prediction_confidence` returned by the predictor. Visible in operator mode. Independent of the HA Calendar entity — stays inside the panel for the *"what's due soon?"* glance, with status pills and avg-cost per event
- **Attach objects to existing HA devices** (2.19+): link an object to a device another integration already provides — its maintenance entities land on that device's page (the smart washing machine gets its descaling task right where its other entities live). **Object hierarchy**: nest objects under each other (anode rod under water heater) via HA's native device hierarchy. Linking to one of Maintenance Supporter's own devices — the object's identically-named twin the picker also lists — is rejected at save time (2.47+), and a link that breaks (device gone, or a pre-2.47 self-link) raises a **fixable Repairs notice** whose Fix button suggests the best-matching real device or removes the link
- 47 object templates in 9 categories — Vehicle, Home & HVAC, Household & Routines, Garden & Outdoor, Pool, Appliances, Pets, Tech & IT, Health (car, e-bike, HVAC, ventilation system, fireplace, smoke detectors, bathroom/bedroom/kitchen routines, robot vacuums, espresso machine, RO water filter, irrigation, litter box, aquarium, printer, NAS, wallbox, CPAP, hearing aids, …) — fully localized, curatable via Settings → Template gallery

### Sensor-Based Triggers
- **Threshold**: trigger when a sensor value exceeds or falls below a limit — or equals (`=`) / deviates from (`≠`) a discrete level such as a filter stage or error code (with optional duration)
- **Counter**: trigger when accumulated value reaches a target (absolute or delta mode)
- **State change**: trigger after a number of state transitions (e.g., on/off cycles). An optional *for (minutes)* hold (#136) makes a transition count only once the new state has held that long — flappy problem sensors stop firing on second-long night-time flickers, and a flicker never counts as an appliance cycle. 0 (default) counts every change immediately, so sensors that pulse only briefly keep working. The hold window survives restarts and is also offered when adopting problem sensors.
- **Runtime**: trigger after accumulated operating hours (e.g., 500h of compressor runtime) — with an optional per-session cap so a sensor stuck ON (lost connection, restart) cannot book a whole night as runtime (2.71+)
- **Compound**: combine multiple conditions with AND/OR logic (e.g., threshold AND runtime)
- Multi-entity support for all trigger types (any/all entity logic)
- **Trigger ∧ interval combinator**: a trigger task can also carry a safety interval — by default whichever is met first makes the task due; with the `all` combinator the task only becomes due once the trigger fired *and* the interval elapsed (the interval acts as a minimum age, e.g. "when the sensor says so, but never more often than every 3 months")
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
- Sensor degradation rate analysis and threshold prediction — **cycle-aware** (2.66+): consumption/accumulation sensors are sawtooths (ink drifts down, a refill jumps it back up), so the analysis splits the series into service cycles at those jumps, regresses the *current* cycle, and **learns the typical rate from up to 180 days of prior cycles** (median, blended in while the current cycle is still thin). Right after a refill the forecast is carried by the learned rate instead of going silent, the prediction panel shows how many cycles it learned from, consistent cycles raise the confidence, and the chart never draws a projection pointing *away* from the configured threshold (the "ink level rising forever" artifact)
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

### Object lifecycle history & service record (2.64+)

![Object lifecycle history](images/object-history.png)

- **Cross-task history on the object page** (#138) — a "History (all tasks)" section on every object's detail page merges the completion/skip/reset entries of *all* its tasks into one chronological log ("everything that has ever been done to my car"), independent of task boundaries. Task names link straight to the task; filter by task and by an inclusive date range
- **Printable service record** — one click produces a printable "vehicle service booklet": object master data (manufacturer, model, serial, installed), every completed maintenance with date, cost, duration and notes, and a cost total — print or save as PDF from the browser, ready to hand over at resale or keep for warranty/insurance
- Honest about limits: history keeps up to **500 entries per task**; when any task hits that cap, both the section and the printed record say so, so "complete" is never silently overstated

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
- **Storage overview** — a collapsible **Document storage** card on the panel overview shows the real backup footprint, the space saved by dedup, and a per-object breakdown; click any object row to jump straight to it, or **search every document** across all objects from the card. Backed by a `sensor.maintenance_supporter_document_storage` (`device_class: data_size`) with per-object and per-category attributes so you can automate on storage growth
- **Documents at the task** — link an object's documents to a specific task so the right manual sits on the task-detail page where the work happens; each task row shows a **paperclip badge** with its document count, and the link **survives a backup/restore** (task ids are remapped like the spare-part links). For a PDF you can set a **jump-to page** so opening it lands on the relevant section (`#page=N`)
- **Lifecycle & hygiene** — deleting a document frees its bytes only when the *last* reference goes; archiving an object keeps its documents (inert); a boot-time **storage-hygiene repair issue** flags orphaned or dangling blobs after a crash or partial restore and cleans them up in one click
- **Complete, portable backup** — the JSON/YAML/CSV export carries settings + document metadata; a dedicated **documents archive** (a ZIP of the file contents) downloads/restores the blobs on top, matching objects by id then by name for a cross-instance move. Exports can be **limited to selected objects** to migrate a single asset

![Documents & parts below the task list, with a per-task paperclip badge](images/task-documents.png)

![Import / Export: object selection, JSON/YAML/CSV and the documents archive](images/export-options.png)

### Frontend
- **Sidebar panel** with dashboard overview, object details, task history, analytics, and in-panel **settings editor**
- **Required completion details** (2.44+) — a task can demand a note, cost, duration, photo or the person who did it before it counts as done; enforced on every completion surface, not just in the dialog
- **Lovelace card** for dashboard integration — with the responsible user per row (2.43+), so a household reads a rotation straight off the dashboard
- **Calendar** integration with status-emoji events
- **Binary sensor** entities for automation triggers
- **Clickable entity IDs**: entity IDs in trigger sections, compound conditions, and environmental correlations open HA's "More Info" dialog on click
- **Serial number** field on objects — displayed in panel, Device Registry, and export/import
- **Warranty tracking** (#67): per-object `warranty_expiry` date with a colour-coded status chip (valid until / expiring within 60 days / expired) in the object detail and objects table
- **Objects table view** (#67): toggle the *All Objects* view between cards and a sortable table; columns are configurable (Settings → Objects table columns) from known object fields; mobile falls back to cards; export all objects as CSV
- **Task sorting**: seven sort modes — due date, object name, task type, task name, area, assigned user, or group (persisted)
- **All Objects view**: clickable KPI card shows all objects including empty ones
- Real-time updates via WebSocket subscription (no polling)
- User filter to show only your assigned tasks
- **Custom sidebar panel title** (2.8.0+) — rename the panel in Settings → Options → General Settings or the panel's Settings tab (blank = default "Maintenance"); avoids clashing with HA's built-in Maintenance dashboard
- **Reload banner for a stale frontend** (2.41+) — the panel compares the version esbuild stamped into its JS bundle with the installed integration version (via the `maintenance_supporter/version` WebSocket command) and, when the browser or its service worker is still serving an old cached bundle, shows a banner with a one-click **Reload**. No amount of Home Assistant restarts fixes a cached bundle, so the panel says so instead of looking broken
- **Follows your HA profile formats** (2.73+) — every date, time and number in the panel, the cards and the dialogs renders per *Profile → Date format / Time format / Number format*, exactly like HA's own entity cards (DD/MM/YYYY vs. YYYY-MM-DD, 12/24-hour, `1.234,56` vs. `1,234.56`), and switches live when the profile changes; every date/time input is HA's own picker, not the browser's (#163)
- Localized UI in **all 22 languages across all three surfaces** (since 1.4.2; 22 since 2.42): English, German, Spanish, French, Italian, Dutch, Portuguese, Brazilian Portuguese, Russian, Ukrainian, Polish, Czech, Swedish, Simplified Chinese, Danish, Finnish, Norwegian Bokmål, Japanese, Hindi, Hungarian, Korean, Turkish — covers panel UI, HA config-flow + Repairs UI, and phone notification messages

### WebSocket API
- 91 commands for full CRUD operations on objects, tasks, triggers, groups, spare parts (create / update / delete / restock), vacation mode, completion actions, quick-complete, and document management (list / upload-link / update / delete / storage summary / search)
- Global settings update and test notification via WS
- Real-time subscription for live updates
- User assignment and listing
- Statistics, budget status, and interval analysis
- See [Architecture](ARCHITECTURE.md) for the complete command reference


## Supported Functions

### Platforms

- **Sensor** — one entity per maintenance task. State is an enum: `ok`, `due_soon`, `overdue`, `triggered`, `archived`, `paused`
- **Binary Sensor** — one entity per maintenance task (`device_class: problem`). ON when overdue or triggered, ideal for HA automations
- **Button** — one-press complete/skip/reset per task (`button.<object>_<task>_complete` / `_skip` / `_reset`)
- **Calendar** — one global entity showing upcoming maintenance events for all tasks
- **To-do** — one global list entity `todo.maintenance` (2.17+) mirroring every active task; checking an item off completes the task, including via the To-do card and Assist/voice
- **Summary sensors** — six global count entities on the *Maintenance Supporter* hub device (`sensor.maintenance_supporter_overdue` / `_due_soon` / `_triggered` / `_needs_attention` / `_ok` / `_total_tasks`), fed by the same aggregator as the panel KPI chips. Their entity ids are pinned language-independently; only the friendly name is localized
- **Document storage sensor** (2.11.0+) — one global entity `sensor.maintenance_supporter_document_storage` (`device_class: data_size`) reporting the physical footprint of attached documents, with `dedup_savings_bytes`, `document_count`, and per-object / per-category breakdowns as attributes
- **Part stock sensors** (2.23+) — one per spare part on the object's device (`sensor.<object>_<part>_stock`): state is the tracked on-hand count (`unavailable` for catalog-only parts), attributes carry the reorder threshold, storage location and `is_low`. Plus one global `sensor.maintenance_supporter_parts_to_reorder` counting parts at/below their threshold across all objects
- **Next-due timestamp sensor** (2.19+) — one per task (`device_class: timestamp`), **disabled by default**; enable it for relative-time displays ("in 2 days") on tile/entities cards and plain timestamp automations. Honours the task's time-of-day when that feature is on
- **Days-until-due countdown sensor** (2.41+) — one per task, **disabled by default**; its state is the plain number of days until the task is due (negative once overdue) for gauge/progress-bar cards, which cannot read the status sensor's `days_until_due` attribute. See the [gauge recipe](EXAMPLES.md#gauge--progress-bar-countdown)
- **Battery-fleet count sensor** (2.38+) — one global entity `sensor.maintenance_supporter_batteries_to_replace` on the hub device, counting the batteries that are low across the whole fleet. It is the ordinary threshold source behind the single *Replace low batteries* task; the grouped shopping needs and the forecast ride along as attributes

### Sensor Attributes

Each sensor entity exposes attributes grouped by function. Only stable values are exposed as entity attributes (to avoid excessive recorder writes); fast-changing trigger values are served via the WebSocket `subscribe` endpoint instead (see below).

- **Core**: `maintenance_type`, `schedule_type`, `interval_days`, `interval_unit`, `interval_anchor`, `due_date`, `warning_days`, `last_performed`, `next_due`, `days_until_due`, `parent_object`, `times_performed`, `total_cost`, `average_duration`, `notes`, `documentation_url`, `priority` (#134 — route automations on it: `state_attr(..., 'priority') == 'high'`; tasks without an explicit value read `normal`)
- **Trigger** (only when a trigger is configured): `trigger_type`, `trigger_active`, plus type-specific fields (e.g. `trigger_above` / `trigger_below` / `trigger_for_minutes`, `trigger_target_value`, …)
- **Adaptive** (only when adaptive scheduling is enabled): `suggested_interval`, `interval_confidence`, `adaptive_scheduling_enabled`, `seasonal_factor`, `seasonal_reason`
- **Weibull** (after 5+ completions): `weibull_beta`, `weibull_eta`, `weibull_r_squared`, `weibull_beta_interpretation`, `confidence_interval_low`, `confidence_interval_high`

> **Live values via the WebSocket `subscribe` endpoint (not recorded as sensor attributes):** `trigger_current_value`, `trigger_entity_state` (per-entity availability), `degradation_rate`, `environmental_factor`, and other fast-changing trigger/prediction values. The panel and Lovelace card read these from the live subscription.

### Events

All lifecycle events also render as readable, localized entries in HA's
activity timeline (logbook) — *"Oil Change (Family Car) was completed —
95 €, 45 min"* — attached to the task's sensor entity (2.19+).

- `maintenance_supporter_trigger_activated` — fired when a sensor trigger condition becomes true
- `maintenance_supporter_trigger_deactivated` — fired when a sensor trigger condition clears
- `maintenance_supporter_task_completed` — fired on every completion path (panel, complete-QR, quick-complete, mobile action). Payload: `entry_id`, `task_id`, `task_name`, `object_name`, `completed_at` (ISO timestamp of the history entry — for a backdated completion this is the chosen past moment, not the moment the event fired; #133), `backfill` (bool — `true` when the completion was recorded for a moment OLDER than the task's latest completion; such pure backfills do not run `on_complete_action`), plus optional `notes`, `cost`, `duration`, `feedback`, `completed_by`
- `maintenance_supporter_task_skipped` — fired when a task is skipped. Payload includes the optional `reason`
- `maintenance_supporter_task_reset` — fired when a task's `last_performed` is reset to a specific date. Payload includes that `date`
- `maintenance_supporter_part_stock_low` / `_part_stock_out` / `_part_restocked` (2.23+) — spare-part stock **crossings**. Edge-triggered: one event per transition (a further decrease while already low never re-fires), so automations can reorder / notify without debouncing. Payload: `entry_id`, `object_id`, `object_name`, `part_id`, `part_name`, `stock`, `reorder_threshold`

### Automation triggers & conditions (HA 2026.7+)

On Home Assistant 2026.7+ the integration contributes **purpose-specific
building blocks** to the new intent-based automation editor — no entity
naming or event names to know, localized in all 22 languages:

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

Full task CRUD from automations, scripts and voice (2.19+): `add_object`,
`add_task`, `update_task`, `delete_task`, and `list_tasks` (returns a
response — ids, the task's sensor `entity_id`, status, next due, last
completion and the live trigger reading with target and unit per task,
filterable by object and status) join the long-standing `complete` / `skip` / `reset` /
`export_data`. Household attribution (#128): `complete` takes an optional
`completed_by` **person entity** (defaulting to the calling user), and
`update_task` can assign or clear the responsible user — see
[Examples](EXAMPLES.md#attribute-and-assign-chores-from-automations-128).
`complete` also accepts `via_tag_scan: true` (2.67+) so an automation that
reacts to a physical scan can complete a tag-gated task — see
[Examples](EXAMPLES.md#complete-a-tag-gated-task-from-an-automation-267).
For the full WebSocket API (91 commands), see [Architecture — WebSocket API](ARCHITECTURE.md#websocket-api).

### Voice & Assist (2.26+)

Six Assist intents let you **query, complete and manage tasks by voice**:

- **`MaintenanceSupporterListTasks`** — *"What maintenance is due?"* Speaks the
  actionable tasks (overdue / due soon / triggered), most urgent first, e.g.
  *"2 maintenance tasks need attention: Oil Change on Family Car (5 days
  overdue), Filter Cleaning on Pool Pump (due today)."*
  Since 2.44 it also takes a **scope**: *"what do I need to do?"* answers
  with the tasks assigned to whoever is speaking (following the current
  rotation duty), and *"what needs doing in here?"* with the tasks of the
  room the voice satellite stands in. If the speaker or the room cannot be
  determined, Assist says so instead of reciting the whole house.
- **`MaintenanceSupporterCompleteTask`** — *"Complete the oil change"* — matches
  the spoken name (the object name counts too: *"oil change on the car"*),
  records a **real completion** (history, rotation, part consumption,
  on-complete actions), and honours the completion window.
- **`MaintenanceSupporterTaskInstructions`** (2.28+) — *"How do I do the pump
  service?"* — answers **strictly from what is stored on the task**: notes,
  checklist steps, linked documents with their page hint (*"Pump manual, page
  12"*), the required spare parts with storage location and live stock, and
  whether a documentation link is on file. **Grounded by design**: when a task
  has none of these, the intent says so and asks whether you want general,
  non-verified advice instead — an LLM relays that question rather than
  inventing steps and presenting them as your stored procedure.
- **`MaintenanceSupporterTaskDue`** (2.28+) — *"When is the oil change due?"*
- **`MaintenanceSupporterSnoozeTask`** (2.28+) — *"Snooze the oil change"* —
  mutes the task's reminders for the configured snooze duration (the schedule
  is untouched).
- **`MaintenanceSupporterPartStock`** (2.28+) — *"How many water filters do we
  have left?"* — answers with the live stock, the storage location, and a
  warning when the part is at or below its reorder threshold.
- **`MaintenanceSupporterPostponeTask`** (2.44+) — *"Postpone the oil change by
  a week."* — defers **this occurrence only**; the recurring cadence, the
  history and the completion count are untouched. Give days or an explicit
  date. On a task that is already overdue the days are counted from today, so
  *"by three days"* cannot land on a date that is still in the past. Without a
  duration it asks for one rather than guessing, and a date in the past is
  refused.
- **`MaintenanceSupporterSkipTask`** (2.44+) — *"Skip the lawn mowing this
  time."* — moves to the next cycle **without** recording work, and the answer
  names the new due date rather than merely acknowledging the command.

**LLM-based Assist pipelines** (OpenAI, Claude, Gemini, local LLMs) pick all
intents up **automatically as tools** in any language — nothing to configure.

The **classic sentence-matching agent** reads sentences from one place only:
`config/custom_sentences/<lang>/`. Turn on **Settings → General → *Install
Assist sentences*** and the integration copies its shipped files
(`custom_components/maintenance_supporter/assist_sentences/{en,de}/`) there and
reloads the conversation agent — no restart, no manual copying. Turning the
setting off removes them again.

A file you have edited yourself is **never** overwritten or deleted: every file
the integration writes carries a checksum of its own content, and one that no
longer matches is left alone. If you would rather do it by hand, copy the
shipped file into `config/custom_sentences/<lang>/` yourself and leave the
setting off.

**What the assistant SAYS is translated everywhere; what it UNDERSTANDS is a
shorter list.** The spoken responses exist in every language the panel does.
Sentence patterns do not, and deliberately so: they are grammar rather than
text — a placeholder cannot carry the case ending, particle or article a
language demands of the task name inserted into it — so they ship only where
the phrasings have been checked against a live agent, phrase by phrase.

Today the classic agent understands **English, German, French, Spanish,
Italian and Dutch**. In any other language it matches nothing at all — not
"answers in English", but no match to answer.

**LLM-based Assist pipelines are unaffected in all 22 languages**: they pick
the intents up as tools and both ask and answer in your language, with no
sentence files involved.

> **Before 2.44** the sentence files lived outside `custom_components/` and the
> HACS release archive did not contain them, so the file the documentation
> pointed at did not exist in a HACS install and the classic agent matched none
> of these intents. They now ship inside the integration.


## Data Updates

The integration uses a hybrid push/poll update model:

- **Coordinator refresh** — every 5 minutes, recomputes time-based status (due soon, overdue), runs adaptive predictions (Weibull, seasonal), checks budget thresholds, and detects missing entities
- **Trigger sensors** — update immediately when monitored entities change state, via Home Assistant `state_changed` event listeners. No polling delay for sensor-based triggers
- **Frontend** — receives real-time updates via WebSocket subscription (`maintenance_supporter/subscribe`). No browser polling
- **IoT class**: `calculated` — all data is computed locally from HA state and configuration, trigger updates are event-driven
