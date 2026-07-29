# Configuration Parameters

Complete reference for all configurable parameters in Maintenance Supporter. Parameters are organized by the UI flow in which they appear.

All configuration is done through the Home Assistant UI — there is no YAML configuration.

---

## Global Settings

Accessible via **Settings > Devices & Services > Maintenance Supporter > Configure** (the global entry), or via the **Settings tab** in the sidebar panel:

![Panel settings tab](images/settings-view.png)

### General Settings

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `default_warning_days` | int | 7 | 1–365 | Days before a task is due when its status changes to `due_soon` |
| `budget_currency` (1.4.9+ in General; 1.4.8+ added 7 currencies; NZD in 2.25/#96) | enum | `EUR` | EUR, USD, GBP, JPY, CHF, CAD, AUD, NZD, CNY, INR, BRL, CZK, PLN, RUB, SEK, NOK, DKK, UAH | Display currency for **all** monetary values — `Avg cost` KPI, activity badges, history rows, and the `unit_of_measurement` of the cost number-inputs in the config flow. The corresponding symbol (e.g. `€`, `$`, `Kč`, `zł`) propagates everywhere. Storage key is still `budget_currency` for backwards-compat |
| `notifications_enabled` | bool | `false` | — | Master toggle for the notification system |
| `notify_service` | string | `""` | — | Notification service to use (e.g., `notify.mobile_app_phone`). Auto-prepends `notify.` if omitted |
| `panel_enabled` | bool | `true` | — | Show the Maintenance Supporter sidebar panel. Takes effect immediately (no restart). The panel is the integration's hub — QR codes, notification links and the auto-dashboard button all point at it — so it defaults **on**; an explicit `false` is honoured |
| `panel_title` | string | `""` (→ "Maintenance") | max 50 chars | Override for the sidebar panel title. Trimmed and capped at 50 characters on save. Leave blank to clear the override and fall back to the default title "Maintenance" |
| `objects_table_columns` (#67) | list[string] | *(9 defaults)* | known column keys | Ordered columns shown in the panel **Objects table** view (the cards/table toggle in *All objects*). Selectable from known object fields only: `name` (always on), `manufacturer`, `model`, `serial_number`, `installation_date`, `warranty_expiry`, `area_id`, `documentation_url`, `notes`, `task_count`, `actions`. Defaults to all of those except `documentation_url`/`notes`. Unknown keys are dropped server-side. Edited under **Settings tab → Objects table columns** |
| `disabled_template_ids` (2.21+) | list[string] | `[]` | built-in template ids | Built-in templates hidden from the *"From template"* pickers (panel gallery + config-flow). The templates stay functional (a direct `object/from_template` still works); they're only removed from the pickers so a growing catalog doesn't clutter the UI. Toggled under **Settings tab → Template gallery** |
| `install_assist_sentences` (2.44+) | bool | `false` | — | Copy the shipped Assist sentence files into `config/custom_sentences/<lang>/` and reload the conversation agent, so the **classic** (non-LLM) Assist agent recognises the voice intents. Turning it off removes them again. A file you edited yourself is never overwritten or deleted — each installed file carries a checksum of its own content and one that no longer matches is left alone. LLM Assist pipelines do not need this: they pick the intents up as tools regardless |

> **`part_search_url_template` (2.23+) is not user-settable.** The key exists and is
> *read* when building the shopping-search link for spare parts without a
> `product_url` (buy-task link + panel part rows) — a URL with a `{q}`
> placeholder, query precedence GTIN → "vendor MPN" → part name. But there is no
> way to write it: it has no field in the options flow or the panel Settings
> view, and `global/update` ignores the key. The effective value is always the
> built-in default — Amazon for the HA UI language (`amazon.de`, `.fr`, `.it`,
> `.es`, `.nl`, `.com.br`, `.com.tr`; `amazon.com` for every other language).

### Advanced Feature Visibility

These toggles control which advanced feature sections appear in the UI. Disabling a feature hides its configuration but does not delete existing data.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `advanced_adaptive_visible` | bool | `false` | Show adaptive scheduling options per task |
| `advanced_predictions_visible` | bool | `false` | Show sensor degradation prediction options |
| `advanced_seasonal_visible` | bool | `false` | Show seasonal scheduling adjustment options |
| `advanced_environmental_visible` | bool | `false` | Show environmental correlation options |
| `advanced_budget_visible` | bool | `false` | Show budget tracking settings and dashboard |
| `advanced_groups_visible` | bool | `false` | Show task grouping management section in the panel with create / edit / delete controls |
| `advanced_checklists_visible` | bool | `false` | Show checklist editing per task |
| `advanced_schedule_time_visible` | bool | `false` | Expose the `schedule_time` (HH:MM) field on time-based tasks. When off, the coordinator strips stored times before computing status so tasks revert to midnight semantics (but retain the stored value for re-enable) |
| `advanced_completion_actions_visible` | bool | `false` | (1.3.0+) Expose the `on_complete_action` (HA service-call) and `quick_complete_defaults` sections in the task dialog, plus the new `quick_complete` QR action. When off, existing values stay persisted but the UI hides them — beginners aren't confronted with service-call YAML |

> **Operator mode (read-only end-user view, 1.0.44+)** is not a global flag — it's derived from the HA user role plus an explicit per-user override list:
>
> - **Admins** (and the HA owner) always see the full panel.
> - **Non-admin** users see Operator mode by default — only `Complete` and `Skip` on each task; Settings tab + every create/edit/delete control hidden.
> - Admins can grant non-admin users full panel access by adding their HA user IDs to the `admin_panel_user_ids` list. This is editable through:
>   - the panel's **Settings → Panel Access** section (multi-checkbox with all non-admin users), or
>   - HA Settings → Devices & services → Maintenance Supporter → Configure → **Panel Access**.
> - **Write delegation (2.8.4+):** by default a listed user gets the full panel *view* but stays **read-only** (no create / edit / delete). To also let them create, edit and delete content, an admin turns on **`operator_write_enabled`** (Settings → Panel Access → *"Allow selected users to create, edit & delete"*). Admin-only commands (global settings, import, vacation, and the allowlist itself) stay admin-only regardless — so a delegated operator can never self-promote.
>
> If a listed user is later deleted in HA, an "orphaned panel-access user" repair issue appears with a one-click `Remove from list` action. The issue clears automatically when the id is removed or the user is recreated.

| Setting key | Type | Default | Description |
|---|---|---|---|
| `admin_panel_user_ids` | list[string] | `[]` | HA user UUIDs (max 50, each ≤64 chars) granted full panel access despite not being HA admins. Empty list = only admins see full panel. Read-only unless `operator_write_enabled` is also on. |
| `operator_write_enabled` | bool | `false` | (2.8.4+) Master switch for operator write delegation. **Off** (default): the allowlist above is view-only — only HA admins can create / edit / delete. **On**: allowlisted non-admins additionally gain full content CRUD (`@require_write`). Admin-gated commands (global settings, import, vacation, allowlist) stay admin-only either way. Admin-only toggle. |

### Notification Settings

Visible only when `notifications_enabled` is `true`.

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `notify_due_soon_enabled` | bool | `true` | — | Send notifications for tasks entering `due_soon` status |
| `notify_due_soon_interval_hours` | int | 24 | 0–720 | Minimum hours between repeated due-soon notifications per task. 0 = notify once |
| `notify_overdue_enabled` | bool | `true` | — | Send notifications for tasks entering `overdue` status |
| `notify_overdue_interval_hours` | int | 12 | 0–720 | Minimum hours between repeated overdue notifications per task. 0 = notify once |
| `notify_triggered_enabled` | bool | `true` | — | Send notifications when a sensor trigger activates |
| `notify_triggered_interval_hours` | int | 0 | 0–720 | Minimum hours between repeated triggered notifications per task. 0 = notify once |
| `quiet_hours_enabled` | bool | `true` | — | Suppress notifications during quiet hours |
| `quiet_hours_start` | time | `22:00` | — | Start of quiet hours (HH:MM) |
| `quiet_hours_end` | time | `08:00` | — | End of quiet hours (HH:MM) |
| `max_notifications_per_day` | int | 0 | 0–1000 | Maximum notifications per day across all tasks. 0 = unlimited |
| `notification_bundling_enabled` | bool | `false` | — | Bundle multiple due tasks into a single notification |
| `notification_bundle_threshold` | int | 2 | 2–20 | Minimum pending tasks before bundling activates |
| `notification_title_style` (1.4.0+) | enum | `default` | `default` / `object_name` / `task_name` | What appears as the notification's TITLE. `default` keeps the per-status text (e.g. *"Maintenance overdue!"* — backwards-compatible). `object_name` uses the object's name as the title (helpful when phones stack notifications); `task_name` uses the task's name. Bundled notifications honour `object_name` but fall back to the count-based title for `task_name` (multi-task bundles can't pick one task) |

Scheduled (non-reactive) reminders and notification scoping:

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `reminder_lead_days` (2.17+) | list[int] | `[]` | each 0–365, max 10 | Extra lead-time reminders: one additional reminder fires on each day where a task's days-until-due matches a listed value (e.g. `[14, 3, 0]` = 14 days before, 3 days before, and on the due date). Empty = off. Honours quiet hours, vacation mode, snooze, per-user routing, and the daily limit |
| `notify_scope_view_id` (2.26+) | string | `""` | max 64 chars | Restrict **all** status-change notifications to tasks matching a saved view's **label and user filters** (pick the view under Settings → Notifications → *"Notify only for view"*). Display-only view dimensions (status, sorting, grouping, archived) are ignored; a *"current user"* filter can't be resolved server-side and imposes no restriction; if the referenced view was deleted, notifications fall back to all tasks. Empty = notify for everything |
| `weekly_digest_enabled` (2.15+) | bool | `false` | — | Send a Monday-morning digest summarising the week's due / overdue / triggered tasks through the notify service. Being a scheduled once-a-week send at a fixed morning hour, it **deliberately bypasses quiet hours and the daily limit** — enabling the digest *is* the consent to receive it |
| `warranty_reminder_enabled` (2.17+) | bool | `false` | — | Remind once when an object's `warranty_expiry` is exactly `warranty_reminder_days` away. Like the digest, this scheduled send bypasses quiet hours and the daily limit |
| `warranty_reminder_days` (2.17+) | int | 30 | 1–365 | Lead time for the warranty reminder |

Also exposed: a **"Send test"** button next to the notify service field. It calls `maintenance_supporter/global/test_notification` and surfaces the backend message as a toast — useful for verifying the notify service without waiting for a real due event.

**Per-person delivery** (2.44+): below that button, Settings → Notifications lists every household member together with the notify services they actually resolve to, and gives each one its own *"Send test"*. This answers the question the household test cannot — *"will Bob get his reminders?"* — because tasks assigned to a person route to that person's Companion device rather than to the household service. A member with no Companion device is shown as *"No own device — uses the household service"* and their button is disabled: nothing is sent, since a send to the household service would land on the admin's phone and falsely suggest the member is reachable. Resolution runs through the same helper the real reminder path uses, so what the list shows is what reminders will use.

### Notification Actions

Mobile actionable notification buttons (requires HA Companion App).

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `action_complete_enabled` | bool | `false` | — | Show "Complete" action button on notifications |
| `action_skip_enabled` | bool | `false` | — | Show "Skip" action button on notifications |
| `action_snooze_enabled` | bool | `false` | — | Show "Snooze" action button on notifications |
| `snooze_duration_hours` | int | 4 | 1–168 | Hours to snooze a task when the Snooze action is used |

### Vacation Mode (1.2.0+)

When active, suppresses notifications for non-exempt tasks across the vacation window **plus** a trailing buffer (so a task coming due the day you return doesn't fire immediately). Existing task statuses are unaffected — only notifications are held back.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `vacation_enabled` | bool | `false` | Master toggle for vacation suppression |
| `vacation_start` | date | `""` | First day of the vacation window (ISO `YYYY-MM-DD`) |
| `vacation_end` | date | `""` | Last day of the vacation window (ISO `YYYY-MM-DD`) |
| `vacation_buffer_days` | int | 3 | Extra days after `vacation_end` during which notifications stay suppressed |
| `vacation_exempt_task_ids` | list[string] | `[]` | Task IDs exempt from suppression — these keep notifying even during the vacation window |

### Budget Settings

Visible only when `advanced_budget_visible` is `true`.

> Note: `budget_currency` lives under **General Settings** (above) since 1.4.9 — it's used by *every* cost display, not just budgets, so it shouldn't require enabling the Budget advanced feature.

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `budget_monthly` | float | 0.0 | 0–10,000,000 | Monthly maintenance budget. 0 = disabled |
| `budget_yearly` | float | 0.0 | 0–100,000,000 | Yearly maintenance budget. 0 = disabled |
| `budget_alerts_enabled` | bool | `false` | — | Send notification when budget threshold is reached |
| `budget_alert_threshold` | int | 80 | 10–100 | Budget usage percentage that triggers an alert |

### Archive & Retention (2.10.0+)

Panel-managed (Settings → **Archive & Retention**). Automates retiring completed **one-off** tasks. Any task or object can also be archived / unarchived **manually** at any time (panel task & object headers, or the card's quick-action dialog).

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `archive_oneoff_days` | int | 14 | 0–3650 | Auto-archive a completed one-off task this many days after completion. `0` = off (archive manually only). Recurring / sensor-triggered tasks are never auto-archived — they have no terminal "done" state |
| `delete_archived_oneoff_days` | int | 0 | 0–3650 | Auto-delete an **auto-archived** one-off task this many days after it was archived. `0` = never. Applies to auto-archived items only — **manually** archived tasks/objects are never auto-deleted (deleting a manual archive stays an explicit action) |

Archived items are hidden by default in the panel and card (a *Show archived* toggle reveals them) and go **inert** — they read an `archived` status and fire nothing (no triggers, notifications, calendar entries, or active status counts) — **except budget**, where already-spent costs keep counting toward the period totals. Archiving an **object** cascades to its active tasks; unarchiving the object restores exactly those, and unarchiving a recurring task starts a fresh cycle (`next_due = today + interval`).

---

## Per-Object Settings

Each maintenance object is a separate config entry. Accessible via **Settings > Devices & Services > Maintenance Supporter > [Object Name] > Configure > Object Settings**.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | string | *(required)* | Display name of the maintenance object |
| `area_id` | string | `""` | Home Assistant area to associate the object with |
| `manufacturer` | string | `""` | Manufacturer name (shown in device info) |
| `model` | string | `""` | Model name (shown in device info) |
| `serial_number` | string | `""` | Serial number (shown in device info, redacted in diagnostics) |
| `installation_date` | date | `""` | Date the object was installed or purchased |
| `warranty_expiry` (#67) | date | `""` | Warranty expiry date (ISO `YYYY-MM-DD`) for asset tracking. Rendered as a colour-coded status chip in the panel object-detail header and the objects table: green "valid until …", amber "expires in N days" (within 60 days), red "expired", or "—" when unset. Round-trips through JSON/CSV export & import |
| `documentation_url` (1.4.0+) | string (URL) | `""` | Link to PDF manual / vendor page / setup guide for this object. Only `http://` and `https://` URLs are accepted; `javascript:`, `data:`, and protocol-relative URLs are rejected. Shown as a clickable link in the panel object-detail header AND on every task-detail page belonging to this object (1.4.1+) so the manual is always one click away from any maintenance task |
| `ha_device_id` (2.19+) | string (device id) | `""` | Attach the object to an **existing HA device**: its task entities (sensor / binary sensor / buttons) then appear on that device's page instead of an own virtual device, and the owning integration's device metadata stays untouched. If the linked device disappears, the object falls back to its own device. Set via the panel object dialog ("Link to existing device") |
| `parent_entry_id` (2.19+) | string (entry id) | `""` | Nest the object under **another maintenance object** (HA `via_device` hierarchy) — e.g. the *anode rod* under the *water heater*. Cycles are rejected at save time. Set via the panel object dialog ("Parent object") |
| `paused_at` (2.20+) | string (ISO timestamp) | *(unset)* | **Seasonal pause** marker — set = the object is paused. A paused object stays fully visible, but all of its tasks freeze at status `paused`: no due computation, no trigger evaluation, no notifications, nothing on the calendar. Resuming re-anchors every active recurring task to a fresh cycle (the pool pump doesn't come back five months overdue). Set via the panel object actions (*Pause*), not by hand |
| `paused_until` (2.20+) | date | *(unset)* | Optional auto-resume date for the pause — the coordinator resumes the object on its first refresh on/after that day. Unset = paused until you resume manually |
| `predecessor_entry_id` (2.20+) | string (entry id) | *(unset)* | Set on the **successor** created by *Replace object*: points at the retired unit whose history, costs and documents stay browsable. Written by the `object/replace` flow |
| `replaced_by_entry_id` (2.20+) | string (entry id) | *(unset)* | The mirror image, set on the **predecessor** when it is retired by *Replace object*: points at its successor entry |
| `notes` (1.4.10+) | string (multiline, ≤2000 chars) | `""` | Free-form notes about the object — part numbers, replacement procedures, settings reminders, "spare key in garage drawer", etc. Newlines and indentation are preserved (`white-space: pre-wrap`). Shown in a dedicated, left-bordered block under the object meta in the panel object-detail header. Editable via panel object dialog or *Object settings* in the config flow |

---

## Per-Task Settings

Tasks are created within an object's options flow via **Add Task** or managed via **Manage Tasks** — or directly in the panel's task dialog:

![Task dialog (reading type, end-of-month schedule)](images/task-dialog-schedule.png)

### Basic Task Fields

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `name` | string | *(required)* | — | Display name of the task |
| `type` | enum | `custom` | — | Category: `cleaning`, `inspection`, `replacement`, `calibration`, `service`, `reading` (record a value — meter readings, level checks; 2.18+), `custom` |
| `enabled` | bool | `true` | — | Whether the task is active. Disabled tasks always show `ok` |
| `schedule_type` | enum | `time_based` | — | Scheduling mode: `time_based`, `sensor_based`, `one_time`, `manual`. The calendar kinds `weekdays`, `nth_weekday`, `day_of_month` are configured via the nested `schedule` object (below) — they can't be expressed by the flat fields — and are reported back under their own `schedule_type` value |
| `interval_days` | int | 30 | 1–3650 | Interval length between maintenance cycles, combined with `interval_unit` (time-based and sensor-based) |
| `interval_unit` | enum | `days` | — | Unit for `interval_days`: `days`, `weeks`, `months`, `years`. Months/years use real calendar arithmetic (last-day clamping, leap years). Only values other than `days` change pre-2.6.0 behaviour |
| `due_date` | date | *(none)* | — | Due date for a `one_time` task. The task stays active until completed, then becomes **done** (`is_done` — hidden from the card, shown as *Completed* in the panel; distinct from the **archived** retire-state, see *Archive & Retention*). Required for `one_time`; ignored for other modes |
| `interval_anchor` | enum | `completion` | — | How the next due date is computed: `completion` (from completion date) or `planned` (from planned date, prevents schedule drift) |
| `schedule` | object | *(derived)* | — | Nested recurrence object — the canonical storage form since v2.7. Calendar kinds (only expressible here): `{"kind": "weekdays", "weekdays": [0,3]}` (0=Mon … 6=Sun), `{"kind": "nth_weekday", "nth": 1, "weekday": 5, "months": [1,4,7,10]}` (nth 1–5 or -1=last; e.g. "1st Saturday"; `months` optional), `{"kind": "day_of_month", "day": 15}` (1–31, clamped to month length; `day: -1` = **last day of the month**, add `"business": true` to roll back to the previous business day — plain Mon–Fri, or the **Workday integration's** calendar (public holidays, custom working weekdays) when one is configured — 2.18+, #83). Every calendar kind also accepts `"offset": ±N` (clamped ±15) to shift the computed date, e.g. `{"kind": "day_of_month", "day": -1, "business": true, "offset": -2}` = *two days before the last business day*. The flat `schedule_type`/`interval_days`/`interval_unit`/`due_date` above are still accepted on create/import for the `time_based`/`one_time` kinds and are always echoed in API responses; the nested `schedule` is echoed alongside them. **Recurrence extras** (2.22+, any recurring kind): `"season_months": [4,5,…,10]` restricts the schedule to those months — an off-season due date rolls forward into the next active month: **interval** kinds land on the 1st of that month ("due once the season starts"), while **calendar** kinds keep their pattern inside the window (a *2nd Saturday* task comes due on the 2nd Saturday of the active month, not on the 1st; if the pattern misses that month, the search continues into the next one); `"ends": {"count": N}` and/or `"ends": {"until": "YYYY-MM-DD"}` make the series finite — after N completions (or once the next occurrence would fall past the date) the task stops re-arming and reads *done* (`count` wins when both are set). Both round-trip through export/import. |
| `due_override` (2.22+) | date | *(none)* | — | **Postpone a single occurrence** — a one-shot due-date override for the current cycle, set via the panel's *Postpone…* action or the `maintenance_supporter/task/postpone` WS command (`entry_id`, `task_id`, `until`). The next completion consumes it and the normal cadence resumes. Dynamic state (lives in the Store, not the config entry); exposed on the task's WS payload. Distinct from snooze (notifications only) and reset (re-anchors the recurrence). |
| `schedule_time` | string (HH:MM) | *(none)* | `00:00–23:59` | Optional time-of-day at which the task flips from `due_soon` to `overdue` on the due date. Requires the `advanced_schedule_time_visible` feature flag. Available on `time_based` tasks only. Interpreted in HA's configured timezone. Empty/unset → midnight semantic (historical behaviour). |
| `warning_days` | int | 7 | 0–365 | Days before due date when status changes to `due_soon`. Per-task minimum is `0` (`0` = warn only on the due date itself); the global `default_warning_days` has a minimum of `1`. **Capped by the schedule's own span**: the effective warning window is `min(warning_days, interval span in days)`, so 14 warning days on a 7-day task behave as 7 (a task can never be "due soon" for longer than one whole cycle) |
| `required_completion_fields` | list | `[]` | Details the task demands on completion — any of `notes`, `cost`, `duration`, `photo`, `user`. Enforced centrally, so a button press, to-do tick, NFC tap, notification button, voice command or service call is refused rather than recording a bare completion; automatic completions (trigger recovery) are exempt |
| `last_performed` | date | *(none)* | — | Date the task was last completed. When unset, `next_due` is anchored on `created_at` (set to today on creation), so the task transitions to OVERDUE after `interval_days` instead of being due "today" forever. |
| `created_at` | date | *(today on create)* | — | Anchor date for `next_due` when `last_performed` is unset. Set automatically; serialized in ConfigEntry. Migrated from earliest history timestamp for pre-v1.0.34 entries. |
| `notes` | string | `""` | — | General notes about the task |
| `documentation_url` | string | `""` | — | URL to external documentation or manual |
| `responsible_user_id` | string | `""` | — | HA user ID of the person responsible for this task |
| `assignee_pool` (2.17+) | list[string] | `[]` | max 25 | HA user IDs sharing this task. With ≥2 members and a `rotation_strategy`, `responsible_user_id` advances to the next member on every completion |
| `rotation_strategy` (2.17+) | enum | *(none)* | `round_robin` / `least_completed` / `random` | How the responsible user rotates after each completion. Unset = no rotation |
| `priority` (2.17+) | enum | `normal` | `low` / `normal` / `high` | Triage priority, shown as a badge (▲/▼) on task rows |
| `labels` (2.17+) | list[string] | `[]` | each ≤40 chars, max 25 | Cross-cutting tags (e.g. `safety`, `seasonal`) shown as chips and searchable in the command palette. Entered comma-separated in the UIs |
| `earliest_completion_days` (2.17+) | int | *(none)* | 0–3650 | Completion window: the task may only be completed within this many days of its due date (0 = only on/after the due date). Unset = complete any time. The WS complete paths return `too_early`; the To-do check-off silently refuses |
| `reading_unit` (2.20+, #83) | string | `""` | ≤32 chars | Display unit for `reading`-type tasks (e.g. `kWh`, `m³`, `l`). Shown next to the reading input on complete and as the delta unit in the history timeline; each completion's `reading_value` is recorded in history. Round-trips through JSON/CSV export-import |
| `custom_icon` | string (mdi) | `""` | — | Custom `mdi:` icon for the task's entities, overriding the type-based default. Max 100 chars. Picked via the icon selector in the task dialog |
| `nfc_tag_id` | string | `""` | — | NFC tag identifier linked to the task (scanning the tag opens / completes it). Max 256 chars; checked for uniqueness — re-using a tag already linked to another task is rejected on save |
| `entity_slug` | string | `""` | — | Override for the slug used in this task's `entity_id`s. Must match `[a-z0-9_]+` (lowercase letters, digits, underscores), max 64 chars. When unset, the slug is derived from the object and task names |

> **Rotations always have someone on duty (2.42.1+).** Saving a task with a pool of ≥2 members *and* a `rotation_strategy` immediately seeds `responsible_user_id` with the first pool member — the rotation no longer waits for the first completion to name an assignee. Without the seed a fresh rotation task was invisible to every user filter (panel, Lovelace card, calendar card, saved views, per-user notifications) until someone completed it once. The same re-seed happens when the current assignee is edited out of the pool, and existing tasks were repaired by a one-off storage migration.

### Checklist

Available when `advanced_checklists_visible` is enabled globally. Checklists are ordered lists of steps that must be checked off during task completion. Editable both in the **panel task dialog** (textarea, one step per line) and in the **Integration Options** per-task Edit Checklist step.

| Parameter | Type | Description |
|-----------|------|-------------|
| `checklist` | list[string] | Ordered list of step descriptions (max 100 items, 500 chars/item) |

### Spare parts & consumables (2.23+)

A per-object parts list, managed in the panel's object detail (**Parts &
consumables** section) and via the `part/create|update|delete|restock` WS
commands. Static definitions live in the config entry; the mutable stock count
is dynamic state (Store). Parts round-trip through JSON export/import
(regenerated ids, task links remapped, stock restored).

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `name` | string | — | ≤100 | Part name (required) |
| `vendor` | string | `""` | ≤64 | Manufacturer — also feeds the shopping-search query |
| `mpn` | string | `""` | ≤64 | Manufacturer part number — spares often have no retail barcode, so this is usually the sharpest identifier |
| `gtin` | string | *(none)* | 8/12/13/14 digits | Barcode number, validated against the GS1 **GTIN** family check digit — covers **EAN-13** (worldwide), **UPC-A** (North America), EAN-8 and GTIN-14 |
| `storage_location` | string | `""` | ≤120 | Where the part physically lives ("basement shelf B, box 3") — shown before the job (task detail / work sheet) and on the buy task |
| `notes` | string | `""` | ≤500 | Free-form notes about the part (compatible models, "order two, one always fails") |
| `product_url` | string | `""` | http(s), ≤500 | Direct link to buy the part — wins over the shopping search |
| `unit` | string | `""` | ≤16 | Display unit for the stock ("pcs", "kg", "L") |
| `cost` | number | *(none)* | 0–100000 | Unit price; completing a buy task prefills cost = quantity × price |
| `stock` | int | *(none)* | 0–9999 | Tracked on-hand count. **Unset = catalog-only part** (identifiers/links only, no tracking, sensor unavailable) |
| `reorder_threshold` | int | *(none)* | 0–9999 | Stock at/below this is *low*: fires the edge-triggered low/out events and (with auto-buy) creates the reminder |
| `restock_quantity` | int | 1 | 1–9999 | How many completing the buy task adds back — editable in the complete dialog |
| `auto_buy_task` | bool | `false` | — | Auto-create a one-off **"Buy {part}"** task while the part is low; it clears itself once restocked above the threshold. A *completed* reminder keeps its cost history and blocks duplicates while the part stays low |
| `doc_id` | string | *(none)* | — | Receipt/datasheet attached via the documents engine |

**Task link:** `task.consumes_parts = [{"part_id", "quantity", "entry_id"?}]`
(≤10 parts per task, quantity >0 up to 999; edited via the task dialog's
*Consumes parts* checkboxes) — completing the task decrements each linked
part's tracked stock.

**Sharing one stock across objects (2.45+, #111):** with an `entry_id` the
link points at a part owned by a *different* object — three robot vacuums
drawing on one box of dust bags, so the number you see is the number on the
shelf. Pick those under *Parts from other objects* in the task dialog; without
`entry_id` the part belongs to the task's own object, as before. The pool keeps
a single owner, so there is exactly one reorder threshold, one low state, one
stock sensor and one *"Buy …"* reminder for one purchase. Deleting the owning
object does not strand the others: the part and its stock move to the object
that has been drawing on it longest, the remaining links are repointed, and a
repair notification says what went where.
**Decimal quantities are allowed** (#98) — `0.5` litres of oil, `1.5` metres of
hose; values are rounded to 2 decimals and whole numbers collapse back to
integers, while zero or negative input falls back to `1`.

**Shopping search:** parts without a `product_url` link to a search — built
from the internal `part_search_url_template` (a URL with a `{q}` placeholder;
Amazon for the HA UI language, and **not user-settable** — see the note under
*General Settings*) with query precedence **GTIN → "vendor MPN" → name**.

**Entities:** one stock sensor per part on the object device
(`sensor.<object>_<part>_stock`, attributes: threshold, storage location,
`is_low`) and a global `sensor.maintenance_supporter_parts_to_reorder`
counter. Events: `maintenance_supporter_part_stock_low` / `_part_stock_out` /
`_part_restocked` — edge-triggered (one event per crossing, no re-nagging
while low).

### Time-of-day Scheduling

Available when `advanced_schedule_time_visible` is enabled globally. Applies to `time_based` tasks only. Editable in the **panel task dialog** (HH:MM picker directly under "Interval anchor") and in the **Integration Options** per-task Edit Task step.

**Behaviour:**
- On the due date, the task flips from `due_soon` to `overdue` at the configured `HH:MM` in HA's configured timezone (instead of at midnight).
- Coordinator refresh cadence is 5 minutes, so the status change lands between `HH:MM` and `HH:MM+5min`.
- Calendar events become 30-minute timed blocks starting at `HH:MM` (instead of all-day), so mobile calendar apps can fire reminders.

**Off-behaviour:** When the feature flag is toggled **off**, the coordinator strips `schedule_time` before computing status — tasks revert to the legacy midnight semantic. The stored value stays on disk and re-applies the moment the flag is toggled back on.

**Weekday pattern _with a time of day_:** For a plain weekday schedule, use the native **Weekdays** kind (`schedule: {"kind": "weekdays", "weekdays": [...]}`). Because `schedule_time` applies to `time_based` tasks only, pinning a weekday to a _specific time_ (e.g. "every Tuesday at 19:00") is still composed from a time-based interval:

| Field | Value | Why |
|---|---|---|
| Task creation date | desired weekday (e.g. Tuesday) | `created_at` anchors the first `next_due` on the same weekday |
| `interval_days` | `7` | Weekly recurrence |
| `schedule_time` | `"19:00"` (any HH:MM) | Sub-day transition to OVERDUE |
| `interval_anchor` | `planned` | Anchors from the previously *planned* due date, so a late completion on Wednesday doesn't drag the next cycle into Wednesday territory — the task stays on Tuesdays |

With `interval_anchor = completion` (the default), the schedule drifts whenever you complete late. Pick the anchor based on whether staying on a specific weekday matters more than guaranteeing a full interval between completions.

### Completion Actions (1.3.0+)

Available when `advanced_completion_actions_visible` is enabled globally. Configured per task in the **task dialog** under two collapsible sections:

![On-complete action editor](images/task-dialog-action.png)

**On-complete action** — fires an HA service call when the task is completed (any path: manual, complete-QR, quick-complete, mobile action). Failures are logged and swallowed; never blocks the completion from being recorded.

| Parameter | Type | Description |
|-----------|------|-------------|
| `on_complete_action.service` | string | HA service in `domain.name` form (regex `[a-z][a-z0-9_]*\.[a-z0-9_]+`, max 100 chars). Examples: `light.turn_on`, `notify.mobile_app_phone`, `counter.increment`. Privileged domains are refused — see below |
| `on_complete_action.target` | dict | Optional HA target. Supported keys: `entity_id`, `device_id`, `area_id`, `label_id`, `floor_id`. Each value is a string or list of strings (max 200 chars per entry, max 50 entries per list) |
| `on_complete_action.data` | dict | Optional service data. Capped at 1 KB JSON-serialised. Anything not JSON-serialisable is dropped |

**Forbidden service domains** — a completion action may nudge devices and send
messages, but it may not run code or control the host. Services in these
domains are rejected: **`shell_command`, `python_script`, `hassio`,
`homeassistant`, `recorder`, `backup`**. This closes an operator→admin
escalation (a delegated operator otherwise setting an action that runs with
system rights). Domain-specific equivalents stay available — use
`light.turn_on` instead of the generic `homeassistant.turn_on`. Note that the
rejection is **silent**: the whole `on_complete_action` is dropped on save
rather than reported as an error, so re-open the task and check the section if
your action didn't stick.

**Test button** — fires the configured action immediately so you can verify the wiring. Doesn't persist anything; result indicator (✓ / ✗) auto-clears after 3 s.

**Stale-entity repair** — coordinator scans `on_complete_action.target.entity_id` on every refresh. If the entity disappears, a repair issue surfaces with two options: **Replace** (pick a new entity via HA's entity picker) or **Remove** (drop the action entirely). Same lifecycle as the existing trigger-entity repair flow.

**Quick-complete defaults** — pre-fills the values used when the user scans the new lightning-bolt `quick_complete` QR code. Schema mirrors `complete_maintenance(...)` kwargs.

| Parameter | Type | Range | Description |
|-----------|------|-------|-------------|
| `quick_complete_defaults.notes` | string | ≤ 2000 chars | Notes to record |
| `quick_complete_defaults.cost` | float | 0–1,000,000 | Cost to record |
| `quick_complete_defaults.duration` | int (minutes) | 0–525,600 | Duration to record |
| `quick_complete_defaults.feedback` | enum | `needed` / `not_needed` / `not_sure` | Adaptive scheduling feedback (the full feedback enum) |

If a task has **no** `quick_complete_defaults`, scanning a `quick_complete` QR routes back to the regular complete dialog (`no_defaults` error → frontend fallback) — the QR is never a dead-end.

#### Service-Picker UI (1.3.1+)

The task-dialog uses HA's native `<ha-service-picker>` for the *Service* field — start typing to filter the full HA service registry (`light.*`, `notify.*`, `vacuum.send_command`, custom integrations all included).

The *Data* field renders dynamically:
- **Schema-driven**: when the picked service has `fields:` metadata in `hass.services` (e.g. `light.turn_on`, `notify.mobile_app_*`), an `<ha-form>` renders proper widgets per type — number sliders, color pickers, entity selectors, booleans
- **JSON fallback**: services with no `fields:` metadata (e.g. `button.press`, custom integrations without `service.yaml`) fall back to a JSON textfield for free-form data

Switching the service auto-prunes data keys the new service doesn't accept (no leaked `brightness` from `light.*` into a fresh `notify.*` call).

#### Recipe library — common device-side resets

| Maintenance task | `service` | `target` | `data` |
|---|---|---|---|
| Roborock filter / brushes | `vacuum.send_command` | `vacuum.<your_robot>` | `command: reset_consumable`, `params: ["filter_work_time"]` *(or `main_brush_work_time`, `side_brush_work_time`, `sensor_dirty_time`)* |
| HVAC controller "filter dirty" reset | `button.press` | `button.<reset_filter>` | *(empty)* |
| Print-hour / cycle counters | `counter.reset` | `counter.<your_counter>` | *(empty)* |
| LED status indicator (e.g. water filter) | `light.turn_on` | `light.<status_ring>` | `brightness_pct: 80`, `rgb_color: [0, 255, 0]` |
| Custom multi-step reset | `script.<your_reset_script>` | *(empty if script defines it)* | *(empty if script takes no args)* |
| Push notification on completion | `notify.mobile_app_<device>` | *(empty)* | `title: "Filter changed"`, `message: "Roborock S7 filter replaced — next due in 90 days"` |
| Toggle a helper boolean | `input_boolean.turn_off` | `input_boolean.filter_dirty_flag` | *(empty)* |

#### Event-driven alternative (no per-task field needed)

Every completion fires `maintenance_supporter_task_completed` on the HA event bus regardless of whether `on_complete_action` is set. Power users who prefer YAML automations can subscribe directly:

```yaml
automation:
  - alias: "Reset device counters on task complete"
    trigger:
      - platform: event
        event_type: maintenance_supporter_task_completed
    condition:
      - "{{ trigger.event.data.task_name == 'Replace HEPA filter' }}"
    action:
      - service: vacuum.send_command
        target:
          entity_id: vacuum.s7_max_ultra
        data:
          command: reset_consumable
          params: ["filter_work_time"]
```

Same events fire for skip / reset (`maintenance_supporter_task_skipped`, `maintenance_supporter_task_reset`) for symmetric automations.

### Adaptive Scheduling

Available when `advanced_adaptive_visible` is enabled globally. Configured per task via the **Adaptive Scheduling** menu option.

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `adaptive_enabled` | bool | `false` | — | Enable adaptive interval learning for this task |
| `ewa_alpha` | float | 0.3 | 0.1–0.9 | EWA smoothing factor. Higher = more weight on recent intervals |
| `min_interval_days` | int | 7 | 1–365 | Floor for adaptive interval recommendations |
| `max_interval_days` | int | 365 | 1–3650 | Ceiling for adaptive interval recommendations |
| `sensor_prediction_enabled` | bool | `false` | — | Enable sensor degradation analysis from recorder data |
| `environmental_entity` | string | `""` | — | Entity ID of an environmental sensor (temperature, humidity) for correlation analysis. Editable in the **task dialog** for sensor-based tasks; persisted via `maintenance_supporter/task/set_environmental_entity`. |
| `environmental_attribute` | string | `""` | — | Attribute name if monitoring an attribute instead of the entity state |
| `seasonal_overrides` | dict | `{}` | month 1–12 → 0.1–5.0 | Manual per-month factor overrides. Editable via the "Edit seasonal factors" dialog opened below the seasonal chart; persisted via `maintenance_supporter/task/seasonal_overrides`. Empty = learned from history. |

**On-demand analysis:** The recommendation card has a **Re-analyze** button (v1.0.35+) that calls `maintenance_supporter/task/analyze_interval` and returns the current Weibull/EWA/seasonal result — useful to refresh the view without waiting for the next coordinator cycle.

**Adaptive thresholds** (not directly configurable — determined by history depth):

| Feature | Minimum History |
|---------|----------------|
| EWA smoothing | 2 completions |
| Adaptive suggestions shown | 3 completions |
| Weibull reliability analysis | 5 completions |
| Seasonal adjustment | 6 months of data across different months |

---

## Trigger Configuration

Triggers are configured per task when `schedule_type` is `sensor_based` or when adding a trigger to any task. Configured via **Edit Trigger** in the task action menu.

### Shared Trigger Fields

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `entity_id` / `entity_ids` | string / list | *(required)* | The entity to monitor (`entity_id`), or several at once (`entity_ids`) |
| `attribute` | string | `""` | Monitor a specific attribute instead of the entity state |
| `type` | enum | *(required)* | Trigger type: `threshold`, `counter`, `state_change`, `runtime`, `compound` |
| `entity_logic` | enum | `any` | Multi-entity aggregation: `any` (one entity suffices) or `all` (all must match) |
| `auto_complete_on_recovery` (#53) | bool | `false` | Opt-in per trigger: when the sensor recovers on its own — salt refilled, filter swapped, water level back up — the recovery **is** the maintenance, so a real completion is recorded (`last_performed` and the time-between-services statistics stay honest) instead of the trigger just clearing. Ticked in the task dialog's trigger section. Only the automatic evaluation path records it; a manual Complete / Skip resets the trigger without double-recording |

> **Form ids vs stored keys:** the options-flow trigger form labels its first two
> fields `trigger_entity` and `trigger_attribute`, but those ids never reach
> storage — they are translated into `entity_id` / `entity_ids` and `attribute`
> before the trigger config is saved. Use the stored names above when writing a
> trigger through the WebSocket API, an import file, or YAML-style tooling.

A multi-entity threshold in the task dialog — one rule watching several sensors:

![Multi-entity trigger](images/multi-entity-trigger.png)

### Threshold Trigger

Activates when a sensor value crosses above or below a limit.

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `trigger_above` | float | *(none)* | — | Trigger when value exceeds this threshold |
| `trigger_below` | float | *(none)* | — | Trigger when value falls below this threshold |
| `trigger_for_minutes` | int | 0 | 0–1440 | Minutes the condition must hold before triggering (debounce). 0 = immediate |

At least one of `trigger_above` or `trigger_below` must be set.

### Counter Trigger

Activates when an accumulated value reaches a target.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `trigger_target_value` | float | *(required)* | Target accumulated value to trigger maintenance |
| `trigger_delta_mode` | bool | `false` | If `true`, counts the change since last completion. If `false`, uses absolute value |

### State Change Trigger

Activates after a specified number of state transitions.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `trigger_from_state` | string | `""` | Source state to count transitions from (empty = any state) |
| `trigger_to_state` | string | `""` | Target state to count transitions to (empty = any state) |
| `trigger_target_changes` | int | *(required)* | Number of transitions before triggering |

### Runtime Trigger

Activates after accumulated operating hours reach a target.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `trigger_runtime_hours` | float | *(required)* | Target accumulated hours before triggering |
| `trigger_on_states` | list[string] | `["on"]` | Entity states considered "running" (e.g., `["on", "running", "active"]`) |

Runtime hours are persisted every 5 minutes and survive restarts. Up to 5 minutes of runtime may be lost on an unclean shutdown.

### Compound Trigger

Combines multiple trigger conditions with AND/OR logic.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `compound_logic` | enum | `AND` | How to combine conditions: `AND` (all must be active) or `OR` (any suffices). The value is upper-cased when the trigger is built, so a stored `and` works too — but the sensor attribute always reports `"AND"` / `"OR"` |
| `conditions` | list | *(required)* | List of trigger conditions, each with its own type, entity, and parameters |

Each condition in the list is a complete trigger configuration (entity, type, type-specific parameters). Nested compound triggers are not supported.

![Compound trigger](images/compound-trigger.png)

---

## Calendar Tab (panel — 1.5.0+)

One of the four tabs in the Maintenance panel (*Today · Dashboard · Calendar · Settings*) — between *Dashboard* and *Settings* — it shows upcoming maintenance as a chronological list rather than a grid. Designed for *"what's coming up?"* glances; the Dashboard tab is status-grouped and answers a different question. Independent of the HA Calendar entity (`calendar.maintenance_schedule`) — that one is still exposed for HA-native consumers, the panel tab adds status pills + cost + sensor-prediction confidence.

| Control | Values | Description |
|---|---|---|
| **Window chips** | `7 days` / `14 days` / `30 days` / `1 year` *(1.5.2+)* | How far forward to look. Default `30 days`. The 1-year view collapses empty days so 365 rows don't drown the few real events. Config key on the calendar card: `window_days: 7 \| 14 \| 30 \| 365`. |
| **Past-window chips** | `30 days` / `90 days` back | Switch the list from "what's coming" to "what happened": the rows come from the completion/skip history instead of `next_due`, labelled by event type, and clicking one opens the history entry for editing. Mutually exclusive with the forward window. Config key: `past_days: 30 \| 90` (set it and the card starts in past mode; empty days are always collapsed here). |
| **User filter** | `All Users` / `My Tasks` | Same dropdown as the Dashboard's *User* filter; resolves *current_user* against `hass.user.id`. |
| **Source icon** *(1.5.1+)* | `mdi:clock-outline` (time-based), `mdi:clock-time-four-outline` (time-based with adaptive interval), `mdi:trending-up` (sensor-based, HA primary color) | Tells you at a glance whether the date is a hard schedule or a sensor regression estimate. |
| **Prediction confidence pill** *(1.5.1+)* | `predicted · high confidence` (green border), `medium` (amber), `low` (red) | Sourced from `threshold_prediction_confidence`; only renders for sensor-based events that aren't already `triggered`. |
| **Projected recurrences** | up to 5 per task per window | Time-based tasks project their next 5 occurrences within the window at **55 % opacity** with an *"every N days"* subtitle to mark them as hypothetical. Sensor tasks are NOT projected (we can't honestly predict the next sensor firing). |
| **Status sort within a day** | overdue → triggered → due_soon → ok | Then alphabetical by object/task name. |
| **Today highlighting** | accent-color date pill + *TODAY* badge | The first day of the window. Overdue and triggered tasks bucket here regardless of their actual `next_due` date. |
| **Empty days** | italic *"No maintenance"* | Preserves vertical rhythm in 7/14/30 views; collapsed entirely in the 1-year view. |
| **Operator mode** | visible (read-only) | The Calendar tab is intentionally always available; only Settings is admin-only. |

Click any event row → opens the existing task-detail page (existing `_showTask` navigation). Avg-cost shows on the right using the configured `currency_symbol`.

No backend changes feed this tab — it consumes the existing `maintenance_supporter/subscribe` payload and computes buckets client-side via `frontend-src/helpers/calendar-bucket.ts`.

---

## Lovelace Card Config (`custom:maintenance-supporter-card`)

The card is WS-driven (subscribes to `maintenance_supporter/subscribe`) so it always reflects the current task state without polling. All config keys are optional — empty / unset means "show all".

| Key | Type | Default | Description |
|---|---|---|---|
| `title` | string | `"Maintenance"` (i18n) | Card header |
| `show_header` | bool | `true` | Show the count badges (Overdue / Due Soon / Triggered) |
| `show_actions` | bool | `true` | Show the "Complete" button on each task row |
| `show_assignee` | bool | `true` | Show the responsible user on each task row — with a rotation this is whose turn it is. Rows without an assignee show nothing; the name is resolved via `users/list` (a read-tier command, so non-admin household members see it too) |
| `filter_labels` | list | — | Limit the card to tasks carrying at least one of these labels (OR semantics, like `filter_objects`) |
| `show_documents` | bool | `true` | Show the task's linked documents and its documentation link as chips on the row; a web link opens directly, a stored file through a signed URL. Rows without documents render nothing |
| `compact` | bool | `false` | Hide task metadata (interval, last performed) |
| `max_items` | int | `0` (unlimited) | Cap on the number of tasks shown |
| `filter_status` | string[] | `[]` | Show only tasks whose `status` is in the list. Values: `overdue`, `triggered`, `due_soon`, `ok` |
| `filter_objects` | string[] | `[]` | Show only tasks whose parent object name is in the list |
| `filter_areas` | string[] | `[]` | Show only tasks whose parent object sits in one of these HA areas (area **ids**, OR semantics, ANDed with the other filters). Objects without an area never match. This is what a per-room wall dashboard uses |
| `filter_due_min_days` | int | unset | Lower bound on `days_until_due` (inclusive). E.g. `1` hides everything due today or overdue |
| `filter_due_max_days` | int | unset | Upper bound on `days_until_due` (inclusive). E.g. `0` = today and overdue only, `-1` = overdue only. Combined with `filter_due_min_days` this expresses a window (`min: 1, max: 7` = "this week"); it is what the auto-dashboard's due-date buckets use. Tasks without a computed `days_until_due` (e.g. a sensor-triggered task with no next due date) are excluded as soon as either bound is set |
| `entity_ids` | string[] | `[]` | **(1.0.45+)** HA-native filter — show only tasks whose `sensor_entity_id` or `binary_sensor_entity_id` matches. Combines additively with the other filters. |
| `view_id` | string | unset | **(2.26+)** Scope the card to a **saved view**: the view's status/user/label filters apply **on top of** the card's own filters (AND). The view's `current_user` filter resolves against the logged-in user; its sorting/grouping are panel display settings and are not applied on the card. A deleted view id degrades to "no view filter" rather than an empty card |

**Adding the card from the picker (1.0.45+)** auto-populates `filter_status: ["overdue", "triggered", "due_soon"]` and `max_items: 10` so the new card immediately shows the actionable subset rather than every task.

**Visual editor** covers the everyday keys without touching YAML — title, header/actions/compact toggles, max items, status chip-row, object multi-checkbox-list, HA-native entity-multi-picker, and (2.26+) a saved-view dropdown (shown once any views exist; views are created in the panel toolbar). The two due-window keys (`filter_due_min_days` / `filter_due_max_days`) have **no editor controls** — set them in YAML; they survive a round-trip through the visual editor.

## Constants & Internal Defaults

These values are not user-configurable but affect behavior:

| Constant | Value | Description |
|----------|-------|-------------|
| Coordinator refresh interval | 5 min | Periodic status recomputation |
| Startup grace period | 5 min | Time before marking entities as unavailable after HA start |
| Missing entity threshold | 6 refreshes (~30 min) | Refreshes before creating a repair issue for unavailable entities |
| Max history entries per task | 500 | Type-aware pruning: sensor-trigger noise (activated/cleared) is dropped first, oldest-first; completions/skips/resets only when the history is full of real actions |
| Manual-completion dedup window | 30 s | Duplicate Complete actions within the window (e.g. a double tap from two phones) count as one action; a reset or skip re-arms it immediately |
| Runtime persistence interval | 5 min | How often accumulated runtime hours are saved to config entry |
| Weibull reliability target | 90% | Reliability level used for Weibull interval recommendations |
| Seasonal factor range | 0.3x – 3.0x | Floor and ceiling for seasonal interval multipliers |
| Environmental factor range | 0.5x – 2.0x | Floor and ceiling for environmental adjustment factors |
| Environmental correlation minimum | \|r\| >= 0.3 | Pearson correlation threshold before applying environmental adjustment |
| Degradation min data points | 10 | Minimum hourly recorder data points for regression analysis |
| Budget alert rate limit | 24 hours | Minimum interval between repeated budget alerts |
