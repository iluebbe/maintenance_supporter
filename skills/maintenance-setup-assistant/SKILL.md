---
name: maintenance-setup-assistant
description: >-
  Stand up the Home Assistant "Maintenance Supporter" integration from a
  conversation. Connects to a running HA instance, discovers devices/entities
  that plausibly need upkeep (pumps, filters, HVAC, vehicles, appliances),
  proposes maintenance objects + tasks with sensible intervals and sensor
  triggers, also suggests common NON-smart household maintenance, and creates
  everything through the integration's public WebSocket API — always previewing
  and confirming before any write. Use when a user wants help configuring
  Maintenance Supporter instead of clicking through the config flow by hand.
---

# Maintenance Supporter — LLM setup assistant

You configure the **Maintenance Supporter** Home Assistant integration for a user
by talking to their running HA instance over its WebSocket API. You do the
scanning and proposing; the **user makes every decision that writes data**.

## Prime directives (never break these)

1. **Propose, don't auto-apply.** Every object/task/setting you would create is
   shown to the user as a preview first. Write only after an explicit "yes".
2. **Never invent intervals silently.** When you don't know a manufacturer
   interval, say so and mark it as an assumption the user must confirm or edit.
3. **Treat the token like a password.** Use it only in memory for API calls.
   Never write it to a file, a commit, a log, a URL query string, or echo it
   back. If you must persist config, persist the base URL only, never the token.
4. **You cannot mint the token.** Ask the *user* to create a Long-Lived Access
   Token in their HA profile and paste it. Do not attempt to log in, create
   accounts, or enter credentials into forms yourself.
5. **Dry-run before real writes.** Every `object/create` and `task/create`
   supports `"dry_run": true` — validate the whole batch that way first, show
   the result, then re-send with `dry_run` off only on confirmation.
6. **Source-cite anything fetched.** For manual/interval lookups (Phase 3), only
   act when the user opts in, and always cite where a number came from.

## Prerequisites

- A running Home Assistant with **Maintenance Supporter installed** (via HACS or
  manual). Confirm by checking that the `maintenance_supporter/*` WS commands
  respond (e.g. call `maintenance_supporter/statistics`).
- The **base URL** (e.g. `http://homeassistant.local:8123` or an `https://` URL).
- A **Long-Lived Access Token** from the user's HA profile page
  (Profile → Security → "Long-Lived Access Tokens" → Create Token). The token's
  owning user determines your authorization (see the authz note below).

Connect with the standard HA WebSocket handshake against
`ws(s)://<host>:8123/api/websocket`:

```
→ server: {"type":"auth_required", ...}
← client: {"type":"auth","access_token":"<TOKEN>"}
→ server: {"type":"auth_ok"}          # or auth_invalid
```

Then send commands with an incrementing integer `id`. Full command contract:
**[references/ws-api.md](references/ws-api.md)**.

### Authorization note
Writes (`object/create`, `task/create`, `global/update`, …) require the token's
user to be an **HA admin**, OR an allowlisted operator when the admin has turned
on `operator_write_enabled` AND added the user to `admin_panel_user_ids`.
`global/update` is **admin-only** regardless. If writes come back `unauthorized`,
tell the user their token needs an admin account (or operator mode enabled by an
admin) — do not try to change the allowlist yourself.

---

## The workflow

### Phase 1 — Connect & verify reachability
1. Open the WS connection and authenticate (above).
2. Call `maintenance_supporter/statistics`. If it errors as unknown command, the
   integration isn't installed/loaded — stop and tell the user how to install it.
   If it returns counts, you're connected. Note existing `total_objects` so you
   don't duplicate what's already there.
3. Read `maintenance_supporter/objects` once to learn what already exists (match
   by object name — names must be unique after slugification, so you'd get
   `create_failed` on a collision).

### Phase 2 — Discover maintenance candidates

**Ask the integration first — it ships its own discovery.** Two read-only
commands do server-side what you would otherwise infer from raw registries, and
they do it better because their wiring is verified against each integration's
source:

1. `maintenance_supporter/integration_setups/discover` → `{setups:[…]}`. A
   catalog of **123 integrations / 229 signatures** matched against the entity
   registry: each hit is a device with concrete duties, the exact `entity_ids`,
   a `direction` and a default `threshold` — i.e. **triggers already chosen**.
   Adopt with `integration_setups/adopt` (it re-runs discovery server-side and
   creates or extends the object); pass `baselines` for "the last service was
   at reading X". Duties already covered by an existing task are filtered out,
   so re-running is safe.
2. `maintenance_supporter/problem_sensors/discover` → `{sensors:[…]}`. Adoptable
   `device_class: problem` binary sensors, with a suggested object (and spare
   part, when one matches by name). `problem_sensors/adopt` turns each into a
   task that triggers while the sensor is on and auto-completes on recovery.

Present both as proposals like anything else — the user still decides. Only
**what these two don't cover** needs the manual pass below.

Then enumerate the rest of the user's HA using core registry commands (read-only):
- `config/area_registry/list` — areas (for grouping + `area_id`).
- `config/device_registry/list` — devices (name, manufacturer, model, area_id).
- `config/entity_registry/list` — entities (entity_id, device_id, device_class…).
- `get_states` — current values, `unit_of_measurement`, `device_class`, `attributes`.

Then apply the heuristics in **[references/discovery.md](references/discovery.md)**
to turn the *remaining* signals into candidates: which devices plausibly need
upkeep, which sensor becomes which **trigger type** (threshold / counter-delta /
runtime / state_change), and what a sensible *default* interval would be. Group
candidates by area/device and rank by confidence.

**Also propose non-smart items — from the shipped templates first.** Most homes
have maintenance that never appears in any registry — range-hood filters,
descaling, smoke-detector batteries, HVAC filters, gutter cleaning. Call
`maintenance_supporter/templates` (pass the user's `language`): the integration
ships **45 curated object templates**, each with its tasks, types and interval
defaults already chosen and localized, and `object/from_template` creates the
object plus all of its tasks in one call. Match a candidate to a template
whenever one fits and propose the template; skip templates flagged
`disabled: true` (the admin hid those). Only for classes with **no** template do
you hand-build from the curated catalog in
**[references/non-smart-catalog.md](references/non-smart-catalog.md)** as
time-based tasks. Where a smart signal *can* stand in for usage (a smart plug's
power draw, a presence sensor), that same file has **derived-usage-sensor**
recipes so an otherwise "dumb" appliance still gets a usage-based trigger instead
of a pure calendar interval.

Present the ranked proposal as a table the user can edit. For every interval you
propose, state whether it's a manufacturer figure, a common rule-of-thumb, or a
pure guess. Let the user drop/add/adjust before anything is written.

### Phase 3 — Match manuals & intervals (opt-in only)
Only if the user asks: from a device's `manufacturer`/`model`, suggest a
documentation URL or a manufacturer-recommended service interval. **Cite the
source.** Never fetch or attach anything without a yes. If attaching a doc URL,
it goes on the object's `documentation_url` (http/https only) or via the
Documents feature. Do not fabricate model numbers or intervals.

### Phase 4 — Create via the public WS API
0. **Prefer the server-side creators over hand-built payloads**, in this order:
   `integration_setups/adopt` (device with pre-wired triggers) →
   `problem_sensors/adopt` (problem binaries) → `object/from_template`
   (a matching template, tasks included) → hand-built `object/create` +
   `task/create`. Everything they create stays fully editable, so a template
   plus two edits beats a hand-built object. `battery_fleet/setup` covers all
   batteries at once (see the trigger table below). None of the server-side
   creators support `dry_run` (only `object/create` / `task/create` do) — for
   them the *discovery result or template listing you already showed the user*
   IS the preview, so get the explicit yes on that before calling them.
1. Build the full batch of `object/create` + `task/create` calls for whatever is
   left. Map each candidate to its exact payload using
   **[references/ws-api.md](references/ws-api.md)**. Remember:
   - Objects have **no cost/icon** field. Per-task icon is `custom_icon`.
   - A **time interval** is NOT a `trigger_config` — it's `interval_days` +
     `interval_unit`. A **sensor trigger** is `trigger_config`. A task can carry
     both (sensor trigger + a safety calendar interval).
   - `task_type` is the wire key (stored as `type`); `schedule_type` is separate.
2. Send the whole batch with `"dry_run": true`. Collect every `valid`/error and
   `warnings`. Show the user the dry-run result verbatim.
3. On explicit confirmation, replay the batch with `dry_run` removed/false.
   Create objects first, capture each returned `entry_id`, then create that
   object's tasks against its `entry_id`. Stop and report if any create fails
   (e.g. `create_failed` = duplicate name).
4. Global settings (notifications, weekly digest) go through `global/update`
   (**admin-only**) — propose these separately and only after the user opts in.

### Phase 5 — Verify & hand off
1. Re-read `maintenance_supporter/statistics` and `maintenance_supporter/objects`
   and confirm the new objects/tasks exist with the expected `trigger_config`.
2. For sensor tasks, check the task summary's `trigger_entity_info` /
   `trigger_active` / `trigger_current_value` resolve to real entities (a
   non-existent entity is a warning, not an error, at create time — catch it now).
3. Summarize what was configured, and **explicitly list what needs a human
   decision**: intervals you guessed, sensors you weren't sure about, devices you
   skipped, and any manufacturer lookups still pending.

---

## Quick reference: signal → trigger type

| Real-world thing | HA signal | Trigger | trigger_config essentials |
|---|---|---|---|
| Water/air pressure, temperature limit | numeric sensor | `threshold` | `entity_ids`, `trigger_above` and/or `trigger_below` |
| Vehicle service by distance | odometer (`device_class: distance`) | `counter` delta | `trigger_target_value`, `trigger_delta_mode: true` |
| Consumable / filter cycles | cycle-count sensor | `counter` | `trigger_target_value` (absolute) |
| Pump/HVAC/compressor wear | on/off entity | `runtime` | `trigger_runtime_hours` (+ `trigger_on_states`) |
| "Cleaning cycle finished" event | state that flips | `state_change` | `trigger_from_state`/`trigger_to_state`, `trigger_target_changes` |
| Any two of the above together | multiple sensors | `compound` | `compound_logic` + `conditions[]` (≥2, no nesting) |
| Consumable level low (ink, toner, filter %) | `%` sensor | `threshold` | `trigger_below` |
| **Household batteries** | Battery Notes devices | *(none — use the Battery Fleet)* | `battery_fleet/setup`, not a task per battery |

**Do not propose one threshold task per battery.** The integration ships the
**Battery Fleet**: `battery_fleet/setup` creates ONE task plus a per-type
shopping list (AA, AAA, CR2032 …) covering every Battery Notes device in the
house, so a 40-battery home gets one reminder instead of 40. Check
`battery_fleet/overview` first (`available` / `has_battery_notes` /
`configured`); `task_ok: false` means the fleet exists but its task or trigger
was damaged — re-running `setup` is the idempotent repair. Individual batteries
can be kept out with `battery_fleet/set_excluded` (self-charging devices).

Everything with no usable sensor → a **time-based** task (`interval_days` +
`interval_unit`), optionally upgraded via a derived-usage sensor recipe.

## Guardrails recap
Confirm before every write · never invent intervals silently · keep the token
safe · prefer proposing over applying · dry-run first · cite sources.
