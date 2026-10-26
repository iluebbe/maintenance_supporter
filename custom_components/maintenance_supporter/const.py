"""Constants for the Maintenance Supporter integration."""

from __future__ import annotations

import re
from enum import StrEnum
from typing import Final

from homeassistant.const import STATE_UNAVAILABLE, STATE_UNKNOWN, Platform

DOMAIN: Final = "maintenance_supporter"

# Keys of the shared runtime singletons inside hass.data[DOMAIN]. Defined here
# (not in __init__) so any module can import them without a circular import —
# a DRY audit (2026-07-10) found the notification-manager key duplicated as a
# string literal in four call sites and the budget/event keys with no constant
# at all (the #86 panel-flag desync came from exactly this literal-key class).
NOTIFICATION_MANAGER_KEY: Final = "_notification_manager"
DOCUMENT_STORE_KEY: Final = "_document_store"
DOCUMENT_TEXT_INDEX_KEY: Final = "_document_text_index"
BUDGET_CACHE_KEY: Final = "_budget_cache"
EVENT_UNSUBS_KEY: Final = "_event_unsubs"
# TOP-LEVEL hass.data key (survives the DOMAIN pop on last-entry unload):
# one MaintenanceStore per entry_id, REUSED across entry reloads. Two Store
# instances for the same file would race: a pending 60s debounced save on
# the pre-reload instance fires AFTER the post-reload instance loaded, and
# its whole-file write clobbers everything the new instance saved since
# (silent loss of completions/history — bug audit 2026-07-11).
STORES_CACHE_KEY: Final = f"{DOMAIN}_stores"


def slugify_object_name(name: str) -> str:
    """Convert an object name to a safe slug for use in unique IDs.

    Replaces any non-alphanumeric character with underscore, collapses
    consecutive underscores, and strips leading/trailing underscores.

    A name with no ASCII alphanumerics (CJK, Cyrillic, emoji, punctuation-only)
    slugifies to an empty string, which would make every such object collide on
    the same ``maintenance_supporter_`` unique id (so a whole non-Latin-script
    user base could only ever create ONE object). Fall back to a stable hash of
    the original name so distinct names get distinct ids.
    """
    slug = re.sub(r"_+", "_", re.sub(r"[^a-z0-9]", "_", name.lower())).strip("_")
    if not slug:
        import hashlib

        slug = "obj_" + hashlib.sha1(name.strip().encode("utf-8")).hexdigest()[:12]
    return slug


def task_unique_id(object_slug: str, task_id: str, suffix: str = "") -> str:
    """The unique_id of a per-task entity:
    ``maintenance_supporter_{slug}_{task_id}[_suffix]``.

    ONE formatter for every builder — the sensor/binary_sensor/button
    platforms, the WS entity-id resolver, and the logbook each hand-formatted
    this string, so changing the scheme in one place silently broke the
    others' registry lookups. (The parse-side consumers — entity_rename and
    the service-target resolver — key off the same prefix/suffix contract.)
    """
    base = f"maintenance_supporter_{object_slug}_{task_id}"
    return f"{base}_{suffix}" if suffix else base


PLATFORMS: list[Platform] = [
    Platform.SENSOR,
    Platform.BINARY_SENSOR,
    Platform.BUTTON,
    Platform.CALENDAR,
    Platform.TODO,
]

# --- Unique IDs ---
GLOBAL_UNIQUE_ID: Final = "maintenance_supporter_global"

# --- Defaults ---
DEFAULT_WARNING_DAYS: Final = 7
DEFAULT_INTERVAL_DAYS: Final = 30
DEFAULT_UPDATE_INTERVAL_MINUTES: Final = 5
DEFAULT_MAX_HISTORY_ENTRIES: Final = 500
# The most completions a finite series may count to: the history keeps that
# many entries, and times_performed is counted in it (bug audit 2026-10-17,
# C-11 — "ends after 600" never ended).
MAX_SERIES_COUNT: Final = DEFAULT_MAX_HISTORY_ENTRIES
DEFAULT_SNOOZE_DURATION_HOURS: Final = 4
DEFAULT_MAX_NOTIFICATIONS_PER_DAY: Final = 0  # 0 = unlimited

# --- Adaptive Scheduling Defaults ---
DEFAULT_ADAPTIVE_EWA_ALPHA: Final = 0.3
DEFAULT_ADAPTIVE_MIN_INTERVAL: Final = 7
DEFAULT_ADAPTIVE_MAX_INTERVAL: Final = 365
DEFAULT_ADAPTIVE_MIN_COMPLETIONS: Final = 3  # Before showing suggestions
DEFAULT_ADAPTIVE_WEIBULL_MIN: Final = 5  # Before fitting Weibull
DEFAULT_ADAPTIVE_RELIABILITY_TARGET: Final = 0.9  # 90% for Weibull

# --- Seasonal Scheduling Defaults ---
DEFAULT_SEASONAL_MIN_DATA: Final = 6  # Min intervals across all months before seasonal adjustment
DEFAULT_SEASONAL_FACTOR_MIN: Final = 0.3  # Floor: never less than 30% of base interval
DEFAULT_SEASONAL_FACTOR_MAX: Final = 3.0  # Ceiling: never more than 300% of base interval

# --- Hemisphere-aware Season Mapping ---
NORTHERN_SEASONS: dict[str, list[int]] = {
    "spring": [3, 4, 5],
    "summer": [6, 7, 8],
    "fall": [9, 10, 11],
    "winter": [12, 1, 2],
}
SOUTHERN_SEASONS: dict[str, list[int]] = {
    "spring": [9, 10, 11],
    "summer": [12, 1, 2],
    "fall": [3, 4, 5],
    "winter": [6, 7, 8],
}

# --- Config Keys: Global ---
CONF_DEFAULT_WARNING_DAYS: Final = "default_warning_days"
CONF_NOTIFICATIONS_ENABLED: Final = "notifications_enabled"
CONF_NOTIFY_SERVICE: Final = "notify_service"
# v2.67: mirror auto "buy" tasks into a user-picked HA to-do list (todo.*).
# Empty = feature off. Instance-bound → excluded from settings export.
CONF_SHOPPING_LIST_ENTITY: Final = "shopping_list_entity"
# #231: the to-do lists every task without its own mirror lists is mirrored
# into (helpers/todo_mirror). Empty = off. Instance-bound like the shopping list.
CONF_MIRROR_TODO_DEFAULT_ENTITIES: Final = "mirror_todo_default_entities"
CONF_PANEL_ENABLED: Final = "panel_enabled"
# v2.10.4 (#69 follow-up): the sidebar panel is the integration's hub — the
# auto-dashboard's "Open Maintenance panel" button, QR codes, and notifications
# all link to /maintenance-supporter. With the panel off those links 404, so it
# now defaults ON. An explicit opt-out (panel_enabled: false in options) is
# still honoured. Read this default everywhere instead of inlining the literal.
DEFAULT_PANEL_ENABLED: Final = True
CONF_PANEL_TITLE: Final = "panel_title"
# #145: how task rows show Complete / Skip — HA buttons that collapse to
# icon-only on phones (default), labelled buttons everywhere, or the classic
# icon pair. The notice flag is set ONCE by the 5→6 migration for existing
# installs so the panel can announce the new look with a "back to icons" button.
CONF_ROW_ACTION_STYLE: Final = "row_action_style"
CONF_ROW_ACTION_NOTICE: Final = "row_action_notice_pending"
# #170 round 2: show the reference numbers (#8, #8.3) in front of object and
# task names in every list, not only on the detail pages.
CONF_REF_NUMBERS_IN_LISTS: Final = "ref_numbers_in_lists"
ROW_ACTION_STYLES: tuple[str, ...] = ("buttons_compact", "buttons", "icons")
DEFAULT_ROW_ACTION_STYLE: Final = "buttons_compact"
# #146: household defaults for the "low" thresholds that discovery and the
# battery fleet used to hard-code. Consumables: the catalog floor for
# percent-remaining signatures (Suggested setups). Batteries: the fleet-wide
# floor for batteries without their own Battery Notes threshold.
CONF_DEFAULT_CONSUMABLE_THRESHOLD: Final = "default_consumable_threshold"
CONF_BATTERY_LOW_PERCENT: Final = "battery_low_percent"
# D#162 follow-up: per-type typical lifetime overrides {canonical type: months}
CONF_BATTERY_LIFETIME_MONTHS: Final = "battery_lifetime_months"
DEFAULT_CONSUMABLE_THRESHOLD: Final = 10
DEFAULT_BATTERY_LOW_PERCENT: Final = 20
THRESHOLD_PERCENT_RANGE: tuple[int, int] = (1, 90)

# --- Config Keys: Advanced Feature Visibility ---
CONF_ADVANCED_ADAPTIVE: Final = "advanced_adaptive_visible"
# advanced_predictions_visible was removed in 2.96 (audit 2026-09-28): it never
# gated anything — sensor predictions are on for every sensor task and switched
# off per task (adaptive_config.sensor_prediction_enabled). Stored values are ignored.
CONF_ADVANCED_SEASONAL: Final = "advanced_seasonal_visible"
CONF_ADVANCED_ENVIRONMENTAL: Final = "advanced_environmental_visible"
CONF_ADVANCED_BUDGET: Final = "advanced_budget_visible"
CONF_ADVANCED_GROUPS: Final = "advanced_groups_visible"
CONF_ADVANCED_CHECKLISTS: Final = "advanced_checklists_visible"
CONF_ADVANCED_SCHEDULE_TIME: Final = "advanced_schedule_time_visible"
# v1.3.0: gates the per-task on_complete_action + quick_complete_defaults
# UI sections in the task dialog, plus the quick_complete chip in the
# Print-QR generator. Default OFF — beginners aren't overwhelmed; data
# still persists if a user toggles the flag off again.
CONF_ADVANCED_COMPLETION_ACTIONS: Final = "advanced_completion_actions_visible"
# 2026-10: shows the object's place (an HA zone) and "remind only on site" in
# the panel. Visibility only, like the others: a place set before keeps working.
CONF_ADVANCED_PLACES: Final = "advanced_places_visible"

# Panel-access overrides: HA user IDs who get the full admin panel despite
# not being HA admins. Empty list means only admins see the full panel.
# The allowlist grants create/edit/delete ONLY when CONF_OPERATOR_WRITE_ENABLED
# is also on; with it off (the default) listed users get read-only access.
CONF_ADMIN_PANEL_USER_IDS: Final = "admin_panel_user_ids"

# v2.8.4: master switch for operator write delegation. Default OFF → only HA
# admins may create/edit/delete and the panel-access allowlist is read-only.
# When True, allowlisted non-admins additionally gain full content CRUD. Only
# admins can flip it (panel Settings tab / config-flow Panel Access step, both
# admin-gated), preserving the escalation boundary in helpers/permissions.py.
CONF_OPERATOR_WRITE_ENABLED: Final = "operator_write_enabled"

# (#67): objects-table column configuration for the panel All-Objects view
# (table mode). Global setting holding the ordered list of object columns to
# show. Selectable from KNOWN_OBJECT_TABLE_COLUMNS only — known object fields,
# never arbitrary state attributes.
CONF_OBJECTS_TABLE_COLUMNS: Final = "objects_table_columns"
# #169 follow-up: per-member avatar overrides {user_id: {initials, color}}
# — shapes/palette in helpers/member_display.py.
CONF_MEMBER_DISPLAY: Final = "member_display"

# v2.21: template-gallery curation — ids of built-in templates the admin has
# hidden from the "From template" pickers (panel gallery + config flow). The
# templates stay functional (direct WS calls still work); they are only
# removed from the pickers so a growing catalog never clutters the UI.
CONF_DISABLED_TEMPLATE_IDS: Final = "disabled_template_ids"
# v2.93: the home profile's dwelling type — "auto" (guessed from the floor and
# area registries), "house" or "apartment". Drives the template gallery's
# recommendations only; see helpers/home_profile.py.
CONF_HOME_TYPE: Final = "home_type"
HOME_TYPES = ("auto", "house", "apartment")
# 2.94: the state / province / region (ISO 3166-2, e.g. "US-NY") whose rules
# the templates follow — "auto" = looked up from the home location in
# data/regions (helpers/region.py). A code of another country is ignored.
CONF_HOME_REGION: Final = "home_region"
HOME_REGION_AUTO: Final = "auto"

# v2.24: saved filter views — named, shared combinations of the panel list's
# filters (status / user / archived) + sort + group-by that any user can apply
# from the toolbar. Stored on the global entry as a list of view dicts; see
# helpers/saved_views.py for the shape + sanitiser. A view's id can later feed
# notification routing ("only notify me about view X").
CONF_SAVED_FILTER_VIEWS: Final = "saved_filter_views"
MAX_SAVED_VIEWS: Final = 50  # coarse ceiling so the global entry can't grow unbounded
MAX_VIEW_NAME_LENGTH: Final = 60

# v2.26: notes of a deleted ADOPTED problem-sensor task, keyed by the watched
# sensor's entity_id, so an un-adopt → re-adopt cycle restores them (roadmap
# "note persistence"). Internal state on the global entry (like saved views),
# not a user-facing setting. FIFO-capped; an entry is consumed on re-adopt.
CONF_ADOPTED_NOTES: Final = "adopted_task_notes"
MAX_ADOPTED_NOTES: Final = 100

# Every column key the objects table can render. The Settings UI offers exactly
# these; the WS update handler drops anything outside this set.
KNOWN_OBJECT_TABLE_COLUMNS = [
    "name",
    "ref_no",  # #170 reference number — opt-in column
    "manufacturer",
    "model",
    "serial_number",
    "installation_date",
    "warranty_expiry",
    "area_id",
    "documentation_url",
    "notes",
    "task_count",
    "actions",
]

# Default column set + order when the user hasn't customised it. Mirrors the
# locked design: Name · Manufacturer · Model · Serial · Installed · Warranty ·
# Area · Tasks · link (documentation_url + notes are opt-in extras).
DEFAULT_OBJECTS_TABLE_COLUMNS = [
    "name",
    "manufacturer",
    "model",
    "serial_number",
    "installation_date",
    "warranty_expiry",
    "area_id",
    "task_count",
    "actions",
]

# --- Vacation mode (v1.2.0) ---
# When active, suppresses notifications for non-exempt tasks across the
# vacation window plus an N-day buffer (so a task that comes due the day
# of return doesn't immediately fire).
CONF_VACATION_ENABLED: Final = "vacation_enabled"
CONF_VACATION_START: Final = "vacation_start"  # ISO date "YYYY-MM-DD"
CONF_VACATION_END: Final = "vacation_end"  # ISO date
CONF_VACATION_BUFFER_DAYS: Final = "vacation_buffer_days"
CONF_VACATION_EXEMPT_TASK_IDS: Final = "vacation_exempt_task_ids"
DEFAULT_VACATION_BUFFER_DAYS: Final = 3
# The buffer's bounds: vacation/update's schema, the settings import and the
# stored-value read (helpers.vacation) — three literals 0 / 14 before (DRY
# audit 2026-10-12, Welle 3). The panel's twin is setting-ranges.ts.
VACATION_BUFFER_DAYS_RANGE = (0, 14)

# --- Config Keys: Notification Per-Status ---
CONF_NOTIFY_DUE_SOON_ENABLED: Final = "notify_due_soon_enabled"
CONF_NOTIFY_DUE_SOON_INTERVAL: Final = "notify_due_soon_interval_hours"
CONF_NOTIFY_OVERDUE_ENABLED: Final = "notify_overdue_enabled"
CONF_NOTIFY_OVERDUE_INTERVAL: Final = "notify_overdue_interval_hours"
CONF_NOTIFY_TRIGGERED_ENABLED: Final = "notify_triggered_enabled"
CONF_NOTIFY_TRIGGERED_INTERVAL: Final = "notify_triggered_interval_hours"

# --- Config Keys: Notification Quiet Hours ---
CONF_QUIET_HOURS_ENABLED: Final = "quiet_hours_enabled"
CONF_QUIET_HOURS_START: Final = "quiet_hours_start"
CONF_QUIET_HOURS_END: Final = "quiet_hours_end"

# Shared HH:MM or HH:MM:SS time pattern (0–23 h, 0–59 m/s) — the single source
# for validating quiet-hours times in BOTH the options flow and the WS handler.
TIME_HHMMSS_PATTERN = re.compile(r"^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$")

# --- Config Keys: Notification Limits ---
CONF_MAX_NOTIFICATIONS_PER_DAY: Final = "max_notifications_per_day"

# --- Config Keys: Notification Bundling ---
CONF_NOTIFICATION_BUNDLING_ENABLED: Final = "notification_bundling_enabled"
CONF_NOTIFICATION_BUNDLE_THRESHOLD: Final = "notification_bundle_threshold"

# --- Config Keys: Notification Title (v1.4.0 #44) ---
# How to format the notification title.
#   "default"     — generic per-status title (e.g. "Maintenance overdue!"). Backwards-compatible.
#   "object_name" — use the object name as the title (helps when phone stacks notifications).
#   "task_name"   — use the task name as the title.
CONF_NOTIFICATION_TITLE_STYLE: Final = "notification_title_style"

# v2.26: notification routing — id of a saved filter view; when set, only tasks
# MATCHING that view's task-selecting filters (label + responsible user) send
# reminders. "" = no scope (all tasks). See helpers/saved_views.view_matches_task.
CONF_NOTIFY_SCOPE_VIEW_ID: Final = "notify_scope_view_id"
# #165: your own notification rule — fire the event and send nothing
# yourself (an automation routes), and/or merge template-rendered extra
# keys into every notify payload's `data` (Ticker category, Pushover
# priority, Telegram parse_mode …).
CONF_NOTIFY_EVENT_ONLY: Final = "notify_event_only"
CONF_NOTIFY_EXTRA_DATA: Final = "notify_extra_data"
MAX_NOTIFY_EXTRA_DATA_LENGTH: Final = 2000
NOTIFICATION_TITLE_STYLES = ("default", "object_name", "task_name")
# #173 follow-up: completion notifications — off, only completions no person
# made on the spot (sensor recovery, shopping-list sync, an automation's
# service call), or every completion.
CONF_NOTIFY_COMPLETED: Final = "notify_completed"
NOTIFY_COMPLETED_MODES = ("off", "automatic", "all")
# Completion sources (``complete_maintenance(source=…)``): where a completion
# came from. The "automatic" ones had no person acting on the spot.
COMPLETION_SOURCES = (
    "panel",
    "qr",
    "nfc",
    "button",
    "todo",
    "voice",
    "notification_action",
    "shopping_list",
    # D#183: checked off in a mirrored external to-do list — a person did
    # it, so it is NOT automatic (same class as "todo").
    "todo_mirror",
    "service",
    "auto_recovery",
    # D#229: the task's complete_when entity changed to its state.
    "auto_entity",
)
COMPLETION_SOURCES_AUTOMATIC = frozenset({"shopping_list", "service", "auto_recovery", "auto_entity"})
# The canned history note an UNATTENDED surface attaches (nobody was asked
# for one) — provenance, never the note a task demands. One table, so the
# wording lives once; tests/test_completion_sources.py keeps it complete.
COMPLETION_PROVENANCE_NOTES: dict[str, str] = {
    "button": "Completed from dashboard button",
    "todo": "Completed from the To-do list",
    "voice": "Completed by voice",
    "notification_action": "Completed from the notification",
    "nfc": "Completed via NFC tag",
    "shopping_list": "Completed from the shopping list",
    "todo_mirror": "Completed from a mirrored to-do list",
}

# D#183: per-task mirror into external ``todo.*`` lists (family members work
# from their to-do app; checking the row off completes the task here). The
# list of entity ids is capped and shape-validated at every write path.
MAX_MIRROR_TODO_LISTS: Final = 5
MIRROR_TODO_ENTITY_PATTERN: Final = r"^todo\.[a-z0-9_]+$"

# D#229: a task completes itself when one entity changes to one state while
# the task is due (the washer's door opens); helpers/complete_when.py. Stored
# as {"entity_id", "to_state"}; the state is capped like an attribute name.
CONF_TASK_COMPLETE_WHEN: Final = "complete_when"
MAX_COMPLETE_WHEN_STATE_LENGTH: Final = 255

# --- Config Keys: Notification Actions ---
CONF_ACTION_COMPLETE_ENABLED: Final = "action_complete_enabled"
CONF_ACTION_SKIP_ENABLED: Final = "action_skip_enabled"
CONF_ACTION_SNOOZE_ENABLED: Final = "action_snooze_enabled"
CONF_SNOOZE_DURATION_HOURS: Final = "snooze_duration_hours"

# v2.15.0: opt-in weekly digest — a single Monday-morning summary notification.
CONF_WEEKLY_DIGEST_ENABLED: Final = "weekly_digest_enabled"

# v2.44: opt-in copy of the shipped Assist sentence files into
# <config>/custom_sentences/. The classic conversation agent reads sentences
# from there and nowhere else, and the HACS release ZIP never carried them.
CONF_INSTALL_ASSIST_SENTENCES: Final = "install_assist_sentences"
CONF_WARRANTY_REMINDER_ENABLED: Final = "warranty_reminder_enabled"
CONF_WARRANTY_REMINDER_DAYS: Final = "warranty_reminder_days"
DEFAULT_WARRANTY_REMINDER_DAYS: Final = 30
# Multiple lead-time reminders: list of days-before-due at which an extra
# reminder fires (e.g. [14, 3, 0]). Empty = feature off (single warning_days
# threshold behaviour unchanged). Checked by a daily tick, not the
# status-change path.
CONF_REMINDER_LEAD_DAYS: Final = "reminder_lead_days"
MAX_REMINDER_LEADS: Final = 10

# --- Panel ---
PANEL_NAME: Final = "maintenance-supporter"
PANEL_TITLE: Final = "Maintenance"
# The default sidebar title in the server's language (an unset panel_title).
PANEL_TITLES: dict[str, str] = {
    "en": PANEL_TITLE, "de": "Wartung", "nl": "Onderhoud", "fr": "Maintenance", "it": "Manutenzione",
    "es": "Mantenimiento", "pt": "Manutenção", "pt-br": "Manutenção", "ru": "Обслуживание", "uk": "Обслуговування",
    "pl": "Konserwacja", "cs": "Údržba", "sv": "Underhåll", "zh": "维护", "da": "Vedligeholdelse", "fi": "Huolto",
    "nb": "Vedlikehold", "ja": "メンテナンス", "hi": "रखरखाव", "hu": "Karbantartás", "ko": "유지보수", "tr": "Bakım",
}  # fmt: skip
PANEL_ICON: Final = "mdi:wrench-clock"
PANEL_URL: Final = "/maintenance_supporter_panel"
CARD_URL: Final = "/maintenance_supporter_card"
# v2.3.4 (issue #52): strategy is now a multi-file split bundle. The entry
# URL has to live UNDER a directory prefix so the entry's relative
# ./chunks/X.js dynamic imports resolve to /<prefix>/chunks/X.js. Pre-2.3.4
# users had a flat URL — old dashboards still load fine because the strategy
# is identified by ``custom:maintenance-supporter`` (a logical name resolved
# via window.customStrategies), not by URL.
STRATEGY_DIR_URL: Final = "/maintenance_supporter_strategy"
STRATEGY_URL: Final = f"{STRATEGY_DIR_URL}/maintenance-dashboard-strategy.js"
STRATEGY_CHUNKS_URL: Final = f"{STRATEGY_DIR_URL}/chunks"
# v2.8.1 (strategy timeout fix): a tiny zero-import shim is what we register as
# the frontend extra-module-url. It defines the dashboard-strategy element
# synchronously (winning HA's 5 s whenDefined race under heavy plugin load) and
# lazy-imports the full STRATEGY_URL bundle on first use. The bundle's own
# relative ./chunks/* imports still resolve because it is served under
# STRATEGY_DIR_URL. The shim has no relative imports, so a flat URL is fine.
STRATEGY_SHIM_URL: Final = "/maintenance_supporter_strategy_shim.js"
CALENDAR_CARD_URL: Final = "/maintenance_supporter_calendar_card"
# Panel code-split chunks (perf wave 2, item 5). The panel entry is served
# from a versioned FILE url (PANEL_URL + content hash, see panel.py), which
# gives relative imports nothing to resolve against — so esbuild rewrites
# its chunk imports to ABSOLUTE urls under this prefix (publicPath in
# esbuild.mjs; the two values must stay in sync).
PANEL_CHUNKS_URL: Final = "/maintenance_supporter_panelfiles/panel-chunks"
# Runtime-loaded UI translations (frontend/locales/<lang>.json), served as a
# directory so the panel/card fetch the active language on demand. Mirrors
# LOCALES_BASE in frontend-src/styles.ts: only EN is bundled into the JS (as the
# fallback); the other languages live here, so a translation edit needs no
# frontend bundle rebuild.
LOCALES_URL: Final = "/maintenance_supporter_locales"
# v2.21: vendored third-party assets (pdf.js for the work sheet's inline
# manual excerpt) — served statically, loaded ONLY by the work-sheet tab so
# the panel bundle stays lean.
VENDOR_URL: Final = "/maintenance_supporter_vendor"

# --- Config Keys: Object ---
CONF_OBJECT: Final = "object"
CONF_OBJECT_NAME: Final = "name"
CONF_OBJECT_AREA: Final = "area_id"
# 2026-10 places: an HA zone the object is maintained at (None = home), and
# whether its reminders wait until somebody is there (helpers/places.py).
CONF_OBJECT_PLACE: Final = "place"
CONF_OBJECT_REMIND_ON_SITE: Final = "remind_on_site"
CONF_OBJECT_MANUFACTURER: Final = "manufacturer"
CONF_OBJECT_MODEL: Final = "model"
CONF_OBJECT_SERIAL_NUMBER: Final = "serial_number"
CONF_OBJECT_INSTALLATION_DATE: Final = "installation_date"
# (#67): per-object warranty expiry date (ISO YYYY-MM-DD) for asset tracking
CONF_OBJECT_WARRANTY_EXPIRY: Final = "warranty_expiry"
# v1.4.0 (#43): per-object link to PDF manual / vendor page
CONF_OBJECT_DOCUMENTATION_URL: Final = "documentation_url"
# v1.4.10 (#46): per-object free-form notes (part numbers, procedures, etc.)
CONF_OBJECT_NOTES: Final = "notes"

# --- Config Keys: Spare parts & consumables ---
# Static part definitions live in entry.data["parts"] (like tasks); the
# mutable stock count lives in the per-entry Store. See helpers/parts.py.
CONF_PARTS: Final = "parts"
# Battery-fleet markers on the OBJECT dict (DRY audit 2026-08: these were
# string literals in four files; find_fleet_entry, setup, the WS response
# and the fleet exclusion all key on them).
BATTERY_FLEET_OBJECT_FLAG: Final = "battery_fleet"
# Marks the fleet's single aggregate task (detail view renders the battery
# section). Canonical home; helpers/battery_fleet_setup re-exports as TASK_FLAG.
BATTERY_FLEET_TASK_FLAG: Final = "battery_fleet_task"
BATTERY_FLEET_EXCLUDED: Final = "battery_fleet_excluded"
# #135: entity_ids manually ADDED to the fleet — batteries the discovery
# heuristics miss (no device_class, odd naming, self-charging filter). An
# include bypasses the heuristic and #107 filters, never the dedupe.
BATTERY_FLEET_INCLUDED: Final = "battery_fleet_included"
# #135 follow-up: fleet-wide opt-in that keeps self-charging devices (phones,
# vacuums, smart rings — the #107 filter) in the roster as rechargeables, so
# "needs a recharge" can notify like "needs a swap". Default off: #107 stays.
BATTERY_FLEET_TRACK_SELF_CHARGING: Final = "battery_fleet_track_self_charging"
# D#162: a Battery Notes note WITHOUT a level sensor (only the type sensor,
# the last-replaced timestamp and the "replaced" button exist) has no
# reading that could ever fire the fleet task — the forecast is all there
# is. Default ON: a passed predicted date on such a note counts as due
# (low → task trigger). Stored as False to switch off; absent means on.
BATTERY_FLEET_DUE_WITHOUT_SENSOR: Final = "battery_fleet_due_without_sensor"
# D#213: opt-in — Replaced asks which cells went in (the note's type or any
# fleet part of the same size, disposable or rechargeable) and books those,
# without editing the Battery Notes type. Default off: the note's type is
# booked, as before.
BATTERY_FLEET_ASK_CELLS: Final = "battery_fleet_ask_cells"
# Bug review 2026-09-04: ``batt_<type>`` part ids the user DELETED. The
# start-up reconcile re-minted them on every boot as long as the type was
# still in the fleet, so a deleted type-part never stayed deleted. Written
# by part/delete, honoured by the reconcile, cleared by an explicit
# Battery-Fleet setup (the user asked for the full set again).
BATTERY_FLEET_REMOVED_PARTS: Final = "battery_fleet_removed_parts"
# Task-side link: task["consumes_parts"] = [{"part_id", "quantity"}] — a
# completion decrements each linked part's stock.
CONF_TASK_CONSUMES_PARTS: Final = "consumes_parts"
# Global setting: shopping-search URL template with a {q} placeholder, used
# for parts without a product_url (default: Amazon by UI language).
CONF_PART_SEARCH_URL_TEMPLATE: Final = "part_search_url_template"

# --- Config Keys: Task ---
CONF_TASKS: Final = "tasks"
CONF_TASK_NAME: Final = "name"
CONF_TASK_TYPE: Final = "type"
CONF_TASK_ENABLED: Final = "enabled"
CONF_TASK_INTERVAL_DAYS: Final = "interval_days"
CONF_TASK_WARNING_DAYS: Final = "warning_days"
CONF_TASK_LAST_PERFORMED: Final = "last_performed"
CONF_TASK_SCHEDULE_TYPE: Final = "schedule_type"
CONF_TASK_INTERVAL_UNIT: Final = "interval_unit"
CONF_TASK_DUE_DATE: Final = "due_date"
# Recurrence extras (config/options flow): seasonal window + finite-series end.
CONF_TASK_SEASON_MONTHS: Final = "season_months"
CONF_TASK_ENDS_COUNT: Final = "ends_count"
CONF_TASK_ENDS_UNTIL: Final = "ends_until"
CONF_TASK_NOTES: Final = "notes"
CONF_TASK_DOCUMENTATION_URL: Final = "documentation_url"
CONF_TASK_ICON: Final = "custom_icon"
# #185: per-task override of the push-notification icon (``mdi:…``); absent =
# the maintenance type's default (helpers/notify_icons.py).
CONF_TASK_NOTIFY_ICON: Final = "notify_icon"
MAX_NOTIFY_ICON_LENGTH: Final = 64
CONF_TASK_NFC_TAG: Final = "nfc_tag_id"
# v2.20 (#83): display unit for `reading`-type tasks ("kWh", "m³", ...).
CONF_TASK_READING_UNIT: Final = "reading_unit"
MAX_READING_UNIT_LENGTH: Final = 32
# #161 phase 2: named reading slots ([{id, name, unit}]) — several values per
# completion; shapes/caps live in helpers/reading_slots.py.
CONF_TASK_READINGS: Final = "readings"
MAX_NFC_TAG_LENGTH: Final = 256
CONF_TASK_INTERVAL_ANCHOR: Final = "interval_anchor"
CONF_TASK_SCHEDULE_TIME: Final = "schedule_time"
CONF_TASK_PRIORITY: Final = "priority"
# Config-flow-only field: comma-separated labels text, parsed into the
# persisted ``labels`` list by the task-base handler.
CONF_TASK_LABELS_TEXT: Final = "labels_text"
CONF_TASK_ASSIGNEE_POOL: Final = "assignee_pool"
CONF_TASK_ROTATION_STRATEGY: Final = "rotation_strategy"

# Rotation strategies for shared tasks: advance the "currently responsible"
# pointer on each completion. None/"" = no rotation (single-assignee behaviour).
ROTATION_STRATEGIES = ("round_robin", "least_completed", "random")
MAX_ASSIGNEE_POOL: Final = 25

# --- Config Keys: User Assignment ---
CONF_RESPONSIBLE_USER_ID: Final = "responsible_user_id"

# --- Config Keys: Trigger ---
CONF_TRIGGER_CONFIG: Final = "trigger_config"
CONF_TRIGGER_TYPE: Final = "trigger_type"
CONF_TRIGGER_ENTITY: Final = "trigger_entity"
CONF_TRIGGER_ENTITY_IDS: Final = "entity_ids"
CONF_TRIGGER_ENTITY_LOGIC: Final = "entity_logic"
CONF_TRIGGER_STATE: Final = "_trigger_state"
CONF_COMPOUND_LOGIC: Final = "compound_logic"
CONF_COMPOUND_CONDITIONS: Final = "conditions"
DEFAULT_ENTITY_LOGIC: Final = "any"
CONF_TRIGGER_ATTRIBUTE: Final = "trigger_attribute"
CONF_TRIGGER_ABOVE: Final = "trigger_above"
CONF_TRIGGER_BELOW: Final = "trigger_below"
CONF_TRIGGER_EQUALS: Final = "trigger_equals"
CONF_TRIGGER_NOT_EQUALS: Final = "trigger_not_equals"
CONF_TRIGGER_FOR_MINUTES: Final = "trigger_for_minutes"
# How the trigger combines with the safety interval on the same task:
# "any" (default) — whichever fires first makes the task due;
# "all" — the task only becomes due once the trigger fired AND the interval
# elapsed (the interval acts as a minimum age, not a deadline).
CONF_TRIGGER_COMBINATOR: Final = "trigger_combinator"
# #228: an attribute of the trigger's entity shown with the task while the
# trigger is active (which medicine runs low); helpers/trigger_detail.py.
CONF_TRIGGER_DETAIL_ATTRIBUTE: Final = "detail_attribute"
CONF_TRIGGER_TARGET_VALUE: Final = "trigger_target_value"
CONF_TRIGGER_DELTA_MODE: Final = "trigger_delta_mode"
CONF_TRIGGER_BASELINE_VALUE: Final = "trigger_baseline_value"
CONF_TRIGGER_FROM_STATE: Final = "trigger_from_state"
CONF_TRIGGER_TO_STATE: Final = "trigger_to_state"
CONF_TRIGGER_TARGET_CHANGES: Final = "trigger_target_changes"
# D#229: a single-shot state-change latch stays triggered after the entity
# leaves its alert state, until the task is completed, skipped or reset (the
# washer's "finished" lasts a minute, the laundry stays in until emptied).
CONF_TRIGGER_HOLD_UNTIL_DONE: Final = "trigger_hold_until_done"
CONF_TRIGGER_RUNTIME_HOURS: Final = "trigger_runtime_hours"
CONF_TRIGGER_ON_STATES: Final = "trigger_on_states"
CONF_TRIGGER_DAYS_BEFORE: Final = "trigger_days_before"

# --- Config Keys: Adaptive Scheduling ---
CONF_ADAPTIVE_CONFIG: Final = "adaptive_config"
CONF_ADAPTIVE_ENABLED: Final = "adaptive_enabled"
CONF_ADAPTIVE_EWA_ALPHA: Final = "ewa_alpha"
CONF_ADAPTIVE_MIN_INTERVAL: Final = "min_interval_days"
CONF_ADAPTIVE_MAX_INTERVAL: Final = "max_interval_days"
# Deliberate cap: a MINIMUM interval above a year defeats adaptive learning.
# Shared by the options flow's adaptive step and the task/set_adaptive WS.
ADAPTIVE_MIN_INTERVAL_CAP_DAYS: Final = 365

# --- Config Keys: Seasonal Scheduling ---
CONF_SEASONAL_ENABLED: Final = "seasonal_enabled"
CONF_SEASONAL_OVERRIDES: Final = "seasonal_overrides"
CONF_SEASONAL_HEMISPHERE: Final = "seasonal_hemisphere"

# --- Sensor Prediction Defaults (Phase 3) ---
DEFAULT_DEGRADATION_LOOKBACK_DAYS: Final = 30  # Days of recorder data for slope computation
DEFAULT_DEGRADATION_MIN_POINTS: Final = 10  # Min hourly data points to compute regression
# Rising/falling = the trend would move the reading by at least this share of
# its mean within DEGRADATION_TREND_HORIZON_DAYS. It was a per-DAY ratio, so a
# filter losing 1.4 %/day (40 points a month, past its threshold) read
# "stable" (consistency audit 2026-10-16).
DEFAULT_DEGRADATION_SIGNIFICANCE: Final = 0.05
DEGRADATION_TREND_HORIZON_DAYS: Final = 30

# --- Cycle-aware degradation (ET-4800 ink finding, 2026-08) ---
# Consumption sensors are sawtooths: the value drifts toward the threshold and
# JUMPS back on a refill/service. A regression across that jump reports the
# refill as a rising trend. The analysis therefore splits the series into
# service cycles at significant against-the-drift jumps, regresses the CURRENT
# cycle, and LEARNS the typical rate from prior cycles (median, blended in
# while the current cycle is still thin).
DEGRADATION_CYCLE_LOOKBACK_DAYS: Final = 180  # window for learning prior cycles
DEGRADATION_CYCLE_JUMP_FRACTION: Final = 0.2  # jump ≥ this share of the observed range = boundary
DEGRADATION_BLEND_HALF_POINTS: Final = 48  # current-cycle points at which current/history blend 50/50
DEGRADATION_MIN_CYCLE_HOURS: Final = 24  # prior cycles shorter than this teach nothing
DEGRADATION_CYCLE_NOISE_SIGMAS: Final = 8  # a boundary must also exceed this many robust sigmas of hourly wobble
DEGRADATION_CYCLE_SETTLE_POINTS: Final = 24  # a jump that snaps back within this many points is modulation

# --- Environmental Adjustment Defaults (Phase 3) ---
DEFAULT_ENVIRONMENTAL_LOOKBACK_DAYS: Final = 90  # Days of env data for correlation
DEFAULT_ENVIRONMENTAL_CORRELATION_MIN: Final = 0.3  # Min |r| to apply adjustment
DEFAULT_ENVIRONMENTAL_FACTOR_MIN: Final = 0.5  # Floor for env adjustment
DEFAULT_ENVIRONMENTAL_FACTOR_MAX: Final = 2.0  # Ceiling for env adjustment
DEFAULT_ENVIRONMENTAL_MIN_COMPLETIONS: Final = 3  # Min completions with env data

# --- Config Keys: Sensor Prediction (Phase 3) ---
CONF_SENSOR_PREDICTION_ENABLED: Final = "sensor_prediction_enabled"
CONF_ENVIRONMENTAL_ENTITY: Final = "environmental_entity"
CONF_ENVIRONMENTAL_ATTRIBUTE: Final = "environmental_attribute"

# --- Budget ---
CONF_BUDGET_MONTHLY: Final = "budget_monthly"
CONF_BUDGET_YEARLY: Final = "budget_yearly"
CONF_BUDGET_ALERTS_ENABLED: Final = "budget_alerts_enabled"
CONF_BUDGET_ALERT_THRESHOLD: Final = "budget_alert_threshold"
CONF_BUDGET_CURRENCY: Final = "budget_currency"
# Decimal places for every displayed amount — KPIs, budgets, costs in lists and
# reports, budget alerts, buy-task notes. 0 = whole numbers (the default).
CONF_CURRENCY_DECIMALS: Final = "currency_decimals"
# #104: when the value of spare parts counts as spending — when they are
# bought (the buy reminder's cost; default, the behaviour so far) or when
# they are used (every completion books the parts it consumed).
CONF_PARTS_COST_MODE: Final = "parts_cost_mode"
PARTS_COST_MODES = ("purchase", "use")
DEFAULT_CURRENCY_DECIMALS: Final = 0

BUDGET_CURRENCIES: dict[str, str] = {
    "EUR": "€",
    "USD": "$",
    "GBP": "£",
    "JPY": "¥",
    "CHF": "Fr",
    "CAD": "C$",
    "AUD": "A$",
    "NZD": "NZ$",  # #96
    "CNY": "¥",
    "INR": "₹",
    "BRL": "R$",
    "CZK": "Kč",
    "PLN": "zł",
    "RUB": "₽",
    "SEK": "kr",
    "NOK": "kr",
    "DKK": "kr",
    "UAH": "₴",
}

# Default currency when the user hasn't chosen one. Its symbol is derived from
# BUDGET_CURRENCIES so the two never disagree.
DEFAULT_BUDGET_CURRENCY: Final = "EUR"

# --- Archive & Retention (v2.10.0) ---
# Global int settings (panel-managed via WS, like objects_table_columns):
#   archive_oneoff_days          — auto-archive a completed one-off this many days
#                                  after completion. 0 = disabled (manual only).
#   delete_archived_oneoff_days  — auto-delete an AUTO-archived one-off this many
#                                  days after it was archived. 0 = never. Manual
#                                  archives are NEVER auto-deleted (delete stays explicit).
CONF_ARCHIVE_ONEOFF_DAYS: Final = "archive_oneoff_days"
CONF_DELETE_ARCHIVED_ONEOFF_DAYS: Final = "delete_archived_oneoff_days"
DEFAULT_ARCHIVE_ONEOFF_DAYS: Final = 14
DEFAULT_DELETE_ARCHIVED_ONEOFF_DAYS: Final = 0  # 0 = never

# Per-task/object `archived_reason` values (stored alongside `archived_at`).
# Drives two policies: only AUTO is eligible for auto-delete; only OBJECT is
# undone by an object unarchive cascade (MANUAL/AUTO survive it).
ARCHIVE_REASON_MANUAL: Final = "manual"
ARCHIVE_REASON_AUTO: Final = "auto"
ARCHIVE_REASON_OBJECT: Final = "object"

# --- Groups ---
CONF_GROUPS: Final = "groups"

# --- Checklist ---
CONF_CHECKLIST: Final = "checklist"

# --- History ---
CONF_HISTORY: Final = "history"

# --- Event Types ---
EVENT_TRIGGER_ACTIVATED: Final = f"{DOMAIN}_trigger_activated"
EVENT_TRIGGER_DEACTIVATED: Final = f"{DOMAIN}_trigger_deactivated"
# v1.3.0: completion lifecycle events. Fired by coordinator after the
# state mutation has persisted. Power users wire HA automations on these;
# the integration's own action_listener also subscribes to the COMPLETED
# event to dispatch the per-task on_complete_action service-call.
# #165: one event per notification the integration is about to send —
# the hook for user-written routing (see helpers/notify_hooks.py).
EVENT_NOTIFICATION: Final = f"{DOMAIN}_notification"
EVENT_TASK_COMPLETED: Final = f"{DOMAIN}_task_completed"
EVENT_TASK_SKIPPED: Final = f"{DOMAIN}_task_skipped"
EVENT_TASK_RESET: Final = f"{DOMAIN}_task_reset"

# Spare-part stock crossings — edge-triggered (one event per transition; a
# further decrease while already low never re-fires). See helpers/parts.py.
EVENT_PART_STOCK_LOW: Final = f"{DOMAIN}_part_stock_low"
EVENT_PART_STOCK_OUT: Final = f"{DOMAIN}_part_stock_out"
EVENT_PART_RESTOCKED: Final = f"{DOMAIN}_part_restocked"

# --- Service Names ---
SERVICE_COMPLETE: Final = "complete"
SERVICE_RESET: Final = "reset"
SERVICE_SKIP: Final = "skip"
SERVICE_EXPORT: Final = "export_data"
SERVICE_ADD_OBJECT: Final = "add_object"
SERVICE_ADD_TASK: Final = "add_task"
SERVICE_UPDATE_TASK: Final = "update_task"
SERVICE_DELETE_TASK: Final = "delete_task"
SERVICE_LIST_TASKS: Final = "list_tasks"
# #218: the part actions for automations and dashboard buttons.
SERVICE_PART_RESTOCK: Final = "part_restock"
SERVICE_PART_READY_AGAIN: Final = "part_ready_again"
SERVICE_PART_DISPOSE: Final = "part_dispose"
# #226: some used outside a task (the washer fluid topped up).
SERVICE_PART_USE: Final = "part_use"


class MaintenanceStatus(StrEnum):
    """Status of a maintenance task."""

    OK = "ok"
    DUE_SOON = "due_soon"
    OVERDUE = "overdue"
    TRIGGERED = "triggered"
    # v2.10.0: highest-precedence status. An archived task/object is retired but
    # retained — it reads `archived`, fires nothing, and counts for nothing
    # except budget/cost history (which is read from completion history, not
    # status, so it is archive-agnostic by design).
    ARCHIVED = "archived"
    # v2.20 (journey N3): seasonal pause. Tasks of a paused OBJECT read
    # `paused`: schedules freeze and nothing fires — but unlike archived the
    # object stays a first-class citizen in every view. Resuming re-anchors
    # recurring tasks like an object unarchive does. Object-wide only (no
    # per-task pause); injected by the coordinator, below ARCHIVED in
    # precedence.
    PAUSED = "paused"


# The statuses a reminder can be about — the same set the coordinator, the
# notification manager, the to-do list and the aggregate counters used to
# spell out by hand (DRY review 2026-09-12).
NOTIFIABLE_STATUSES: frozenset[str] = frozenset(
    {MaintenanceStatus.DUE_SOON, MaintenanceStatus.OVERDUE, MaintenanceStatus.TRIGGERED}
)


class MaintenanceTypeEnum(StrEnum):
    """Type/category of maintenance."""

    CLEANING = "cleaning"
    INSPECTION = "inspection"
    REPLACEMENT = "replacement"
    CALIBRATION = "calibration"
    SERVICE = "service"
    # Record a value / take a reading (meter readings, level checks, spot
    # measurements) — requested in Discussion #83, generalised beyond meters.
    READING = "reading"
    CUSTOM = "custom"


class ScheduleType(StrEnum):
    """How a task is scheduled."""

    TIME_BASED = "time_based"
    SENSOR_BASED = "sensor_based"
    MANUAL = "manual"
    ONE_TIME = "one_time"


# Schedule kinds expressed by the FLAT recurrence fields (interval/due_date),
# as opposed to the nested calendar kinds (weekdays/nth_weekday/day_of_month)
# or a sensor trigger. Used to decide flat-vs-calendar handling on task edit.
FLAT_SCHEDULE_TYPES = frozenset({ScheduleType.TIME_BASED, ScheduleType.ONE_TIME, ScheduleType.MANUAL})


class TriggerType(StrEnum):
    """Type of sensor trigger."""

    THRESHOLD = "threshold"
    COUNTER = "counter"
    STATE_CHANGE = "state_change"
    RUNTIME = "runtime"
    # A sensor that REPORTS the date the maintenance is due (a purifier's
    # "filter change due" timestamp): fires N days before that date.
    DUE_DATE = "due_date"
    COMPOUND = "compound"


class TaskPriority(StrEnum):
    """Priority level of a maintenance task."""

    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"


# The default when a task doesn't specify a priority.
DEFAULT_TASK_PRIORITY: Final = TaskPriority.NORMAL


class HistoryEntryType(StrEnum):
    """Type of history entry."""

    COMPLETED = "completed"
    SKIPPED = "skipped"
    MISSED = "missed"
    RESET = "reset"
    TRIGGERED = "triggered"
    TRIGGER_REMOVED = "trigger_removed"
    TRIGGER_REPLACED = "trigger_replaced"


# Entry types that reset the maintenance cycle — the ``last_performed`` anchor
# is always the LATEST such entry (by timestamp). Shared by the history-edit
# reconciliation and the backdated-completion path (#133) so the two can't
# drift on what counts as a cycle anchor. MISSED is included because
# ``skip(as_missed=True)`` moves ``last_performed`` exactly like a skip —
# the edit path historically omitted it (latent reconciliation gap).
LIFECYCLE_HISTORY_TYPES = frozenset(
    {
        HistoryEntryType.COMPLETED,
        HistoryEntryType.RESET,
        HistoryEntryType.SKIPPED,
        HistoryEntryType.MISSED,
    }
)


class MaintenanceFeedback(StrEnum):
    """Feedback from user about whether maintenance was needed."""

    NEEDED = "needed"
    NOT_NEEDED = "not_needed"
    NOT_SURE = "not_sure"


class TriggerEntityState(StrEnum):
    """State of a trigger entity from the integration's perspective."""

    AVAILABLE = "available"
    UNAVAILABLE = "unavailable"  # Entity exists but state is unavailable/unknown
    MISSING = "missing"  # Entity does not exist in state machine
    STARTUP = "startup"  # Grace period after HA start


# --- Dispatcher Signals ---
SIGNAL_TASK_RESET: Final = f"{DOMAIN}_task_reset_{{entry_id}}_{{task_id}}"
SIGNAL_NEW_OBJECT_ENTRY: Final = f"{DOMAIN}_new_object_entry"
SIGNAL_OBJECT_ENTRY_REMOVED: Final = f"{DOMAIN}_object_entry_removed"
# Fired by the DocumentStore after any metadata/blob change so the storage
# sensor (and any other listener) can refresh without polling.
SIGNAL_DOCUMENTS_UPDATED: Final = f"{DOMAIN}_documents_updated"
# The battery fleet's inputs changed outside the hub's own count (a fleet
# object loaded its Store, the low/recovered percentages changed): the hub's
# low-count sensor recounts now instead of at its next 30-s poll.
SIGNAL_BATTERY_FLEET_CHANGED: Final = f"{DOMAIN}_battery_fleet_changed"

# --- Trigger Completion Cooldown ---
TRIGGER_COMPLETION_COOLDOWN_SECONDS: Final = 600  # 10 minutes

# Places (helpers/places.py): a person must stay this long in a zone before
# the arrival message goes out (a drive past a zone edge is no visit), and
# gets it at most once per this window for the same place.
PLACE_ARRIVAL_DWELL_SECONDS: Final = 120
PLACE_ARRIVAL_COOLDOWN_SECONDS: Final = 6 * 3600
# Household double-complete window: two people tapping Complete on the same
# task within this many seconds count as ONE real-world action (journey M1).
# Short on purpose — a deliberate complete → reset → complete-again correction
# flow must never be caught by it.
MANUAL_COMPLETION_DEDUP_SECONDS: Final = 30

# --- Input Validation Limits ---
MAX_NAME_LENGTH: Final = 200
MAX_TEXT_LENGTH: Final = 2000  # notes, reason, feedback, description
MAX_URL_LENGTH: Final = 2048
MAX_ICON_LENGTH: Final = 100  # "mdi:icon-name"
MAX_META_LENGTH: Final = 200  # manufacturer, model, user_id, area_id, etc.
MAX_PANEL_TITLE_LENGTH: Final = 50  # sidebar panel title override

# Completion cost + duration bounds — one source for the WS schemas AND the
# config-flow-path sanitiser (they must agree, else a value the sanitiser
# accepts can bypass the WS cap or vice-versa).
MAX_COST: Final = 1_000_000  # per completion / history entry
# #200: a credit — the old unit sold, a refund — is a negative cost; every
# total nets it (budget, task, object, area).
MIN_COST: Final = -MAX_COST
MAX_DURATION_MINUTES: Final = 525_600  # one year in minutes
MAX_TYPE_LENGTH: Final = 50  # task_type, schedule_type
MAX_CHECKLIST_ITEMS: Final = 100
MAX_CHECKLIST_ITEM_LENGTH: Final = 500
MAX_LABELS: Final = 25  # cross-cutting tags per task
MAX_LABEL_LENGTH: Final = 40  # single label/tag
MAX_GROUP_TASK_REFS: Final = 200
MAX_ID_LENGTH: Final = 64  # entry_id, task_id, group_id (uuid hex = 32)
MAX_DATE_LENGTH: Final = 20  # ISO 8601 date strings (e.g. 2026-04-21)
MAX_TIMESTAMP_LENGTH: Final = 64  # ISO 8601 timestamps with offset (history entries)
MAX_ENTITY_ID_LENGTH: Final = 255  # HA entity_id max

# "No usable reading" state pair — 13 call sites hand-typed the tuple before
# the 2026-08 drift audit. Built from HA's own constants so it can never
# drift from core.
UNAVAILABLE_STATES = (STATE_UNAVAILABLE, STATE_UNKNOWN)
MAX_ENTITY_SLUG_LENGTH: Final = 64  # task entity_slug
MAX_INTERVAL_DAYS: Final = 3650  # 10 years — caps date arithmetic overflow
# Import payload byte caps. CSV is flat (one row per task) so 1 MB is ample;
# a JSON/YAML backup carries full history + every field, so it needs more head-
# room — a 1000-object export with history routinely exceeds 1 MB. Both were
# hardcoded literals at their call sites (bug audit 2026-07-11); named here so
# the two limits are visible and can't silently drift.
MAX_IMPORT_PAYLOAD_BYTES: Final = 1_048_576  # 1 MB — csv_content
MAX_JSON_IMPORT_PAYLOAD_BYTES: Final = 10 * 1_048_576  # 10 MB — json_content (history-heavy)
MAX_SCHEDULE_TIME_LENGTH: Final = 5  # "HH:MM"

# Per-object fan-out caps — a runaway automation or import loop must not be able
# to inflate one object's ConfigEntry.data without bound. Deliberately generous
# (far above any real device): they catch accidents/abuse, not real use. Parts
# already had MAX_PARTS_PER_OBJECT (50); tasks and documents were unbounded.
MAX_TASKS_PER_OBJECT: Final = 200  # mirrors MAX_GROUP_TASK_REFS; ~10x any real device
MAX_DOCS_PER_OBJECT: Final = 100  # manuals + invoices + photos — 100 is very generous
# Vacation exempt list: task ids that keep their schedule during a vacation.
# One cap for the WS schema, the sanitiser and the settings import (DRY
# review 2026-09-13) — 2000 covers ten fully-loaded objects.
MAX_VACATION_EXEMPT_TASKS: Final = 2000

# --- Trigger Entity Availability ---
STARTUP_GRACE_PERIOD_SECONDS: Final = 300  # 5 minutes
MISSING_ENTITY_THRESHOLD_REFRESHES: Final = 6  # ~30 min at 5-min intervals

# --- Battery fleet hysteresis (#180) ---
# A battery that went low stays counted low until its level rises ABOVE this
# percent (or a replacement is recorded) — a level oscillating around the low
# floor must not flip the fleet task's auto-complete on every dip.
CONF_BATTERY_RECOVERED_PERCENT: Final = "battery_recovered_percent"
DEFAULT_BATTERY_RECOVERED_PERCENT: Final = 50
BATTERY_RECOVERED_PERCENT_RANGE: tuple[int, int] = (20, 100)
# #219: a battery counts as low only once it has read low this many minutes
# (0 = at once). Some sensors (Shelly BT) report a very low level for a
# while and recover by themselves.
CONF_BATTERY_LOW_DELAY_MINUTES: Final = "battery_low_delay_minutes"
DEFAULT_BATTERY_LOW_DELAY_MINUTES: Final = 0
BATTERY_LOW_DELAY_MINUTES_RANGE: tuple[int, int] = (0, 1440)
# #181 follow-up (advanced, default off): when the latch releases a battery
# BECAUSE ITS LEVEL rose above the recovery threshold, record the replacement
# in Battery Notes and consume the type's spare cells — no tap needed.
CONF_BATTERY_AUTO_RECORD_RECOVERY: Final = "battery_auto_record_recovery"
# D#182: the shopping-search template is user-settable (max URL length).
MAX_PART_SEARCH_URL_TEMPLATE_LENGTH: Final = 500

# --- Trigger / schedule field ranges (DRY audit 2026-09-26 B) ---
# ONE source for the numeric bounds the options-flow selectors, the WS trigger
# validator and the adopt endpoints spelled as literals (for_minutes 1440 x5,
# target changes 10 000 x3, runtime hours 100 000 x3, calendar offset +-15 x3,
# EWA alpha 0.1-0.9 x3). Inclusive (min, max). Keyed by the trigger_config
# storage key. The Python consumers (and helpers/schedule.py's offset clamp)
# are pinned by tests/test_dry_round4_interfaces.py; the TypeScript twins
# (frontend-src/helpers/setting-ranges.ts) by
# tests/test_frontend_const_parity.py::test_ts_field_ranges_match_backend.
TRIGGER_FIELD_RANGES: dict[str, tuple[int, int]] = {
    "trigger_for_minutes": (0, 1440),  # #136 hold time, one day at most
    "trigger_target_changes": (1, 10_000),
    # due_date: fire this many days before the date the sensor reports.
    "trigger_days_before": (0, 365),
}
# Runtime target hours: > 0 (the WS validator) / >= 1 (the flow selector).
TRIGGER_RUNTIME_HOURS_MAX: Final = 100_000
# (#83) +-N-day shift of a calendar-kind occurrence ("2 days before the last
# working day") — bounded so a bogus payload cannot move a schedule by years.
SCHEDULE_OFFSET_MAX_DAYS: Final = 15
# Adaptive scheduling smoothing factor (exponentially weighted average).
ADAPTIVE_EWA_ALPHA_RANGE: tuple[float, float] = (0.1, 0.9)
