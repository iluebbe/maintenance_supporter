"""WebSocket handlers for subscribe, statistics, settings, and budget."""

from __future__ import annotations

import logging
import math
from collections.abc import Callable, Mapping
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect

from ..const import (
    BUDGET_CURRENCIES,
    CONF_ACTION_COMPLETE_ENABLED,
    CONF_ACTION_SKIP_ENABLED,
    CONF_ACTION_SNOOZE_ENABLED,
    CONF_ADMIN_PANEL_USER_IDS,
    CONF_ADVANCED_ADAPTIVE,
    CONF_ADVANCED_BUDGET,
    CONF_ADVANCED_CHECKLISTS,
    CONF_ADVANCED_COMPLETION_ACTIONS,
    CONF_ADVANCED_ENVIRONMENTAL,
    CONF_ADVANCED_GROUPS,
    CONF_ADVANCED_PREDICTIONS,
    CONF_ADVANCED_SCHEDULE_TIME,
    CONF_ADVANCED_SEASONAL,
    CONF_ARCHIVE_ONEOFF_DAYS,
    CONF_BUDGET_ALERT_THRESHOLD,
    CONF_BUDGET_ALERTS_ENABLED,
    CONF_BUDGET_CURRENCY,
    CONF_BUDGET_MONTHLY,
    CONF_BUDGET_YEARLY,
    CONF_DEFAULT_WARNING_DAYS,
    CONF_DELETE_ARCHIVED_ONEOFF_DAYS,
    CONF_DISABLED_TEMPLATE_IDS,
    CONF_MAX_NOTIFICATIONS_PER_DAY,
    CONF_NOTIFICATION_BUNDLE_THRESHOLD,
    CONF_NOTIFICATION_BUNDLING_ENABLED,
    CONF_NOTIFICATION_TITLE_STYLE,
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_DUE_SOON_ENABLED,
    CONF_NOTIFY_DUE_SOON_INTERVAL,
    CONF_NOTIFY_OVERDUE_ENABLED,
    CONF_NOTIFY_OVERDUE_INTERVAL,
    CONF_NOTIFY_SCOPE_VIEW_ID,
    CONF_NOTIFY_SERVICE,
    CONF_NOTIFY_TRIGGERED_ENABLED,
    CONF_NOTIFY_TRIGGERED_INTERVAL,
    CONF_OBJECTS_TABLE_COLUMNS,
    CONF_OPERATOR_WRITE_ENABLED,
    CONF_PANEL_ENABLED,
    CONF_PANEL_TITLE,
    CONF_QUIET_HOURS_ENABLED,
    CONF_QUIET_HOURS_END,
    CONF_QUIET_HOURS_START,
    CONF_REMINDER_LEAD_DAYS,
    CONF_SNOOZE_DURATION_HOURS,
    CONF_WARRANTY_REMINDER_DAYS,
    CONF_WARRANTY_REMINDER_ENABLED,
    CONF_WEEKLY_DIGEST_ENABLED,
    DEFAULT_ARCHIVE_ONEOFF_DAYS,
    DEFAULT_BUDGET_CURRENCY,
    DEFAULT_DELETE_ARCHIVED_ONEOFF_DAYS,
    DEFAULT_OBJECTS_TABLE_COLUMNS,
    DEFAULT_PANEL_ENABLED,
    DEFAULT_SNOOZE_DURATION_HOURS,
    DEFAULT_WARNING_DAYS,
    DEFAULT_WARRANTY_REMINDER_DAYS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    KNOWN_OBJECT_TABLE_COLUMNS,
    MAX_PANEL_TITLE_LENGTH,
    MAX_REMINDER_LEADS,
    SIGNAL_NEW_OBJECT_ENTRY,
    TIME_HHMMSS_PATTERN,
)
from ..helpers.aggregate import compute_status_counts
from ..helpers.notify_targets import build_notify_targets
from ..helpers.settings_registry import (
    ALLOWED_SETTING_KEYS,
    FLOAT_RANGES,
    INT_RANGES,
    STR_MAX_LENGTHS,
)
from . import (
    _build_object_response,
    _get_global_entry,
    _get_object_entries,
    _get_runtime_data,
)

_LOGGER = logging.getLogger(__name__)

# Keys accepted by global/update + their range/cap tables are derived from the
# single settings registry (helpers/settings_registry) so they can't drift from
# each other or from the options-flow selectors that share the same specs.
_ALLOWED_SETTING_KEYS = ALLOWED_SETTING_KEYS


def _build_full_settings(options: Mapping[str, Any], *, notify_targets: list[str] | None = None) -> dict[str, Any]:
    """Build a full settings dict from global entry options.

    ``notify_targets`` is the shared pickable-notify-target list (see
    ``helpers/notify_targets.build_notify_targets``) surfaced under
    ``general.notify_targets`` so the panel picker uses the exact same set as
    the options flow instead of recomputing it client-side.
    """
    return {
        "features": {
            "adaptive": options.get(CONF_ADVANCED_ADAPTIVE, False),
            "predictions": options.get(CONF_ADVANCED_PREDICTIONS, False),
            "seasonal": options.get(CONF_ADVANCED_SEASONAL, False),
            "environmental": options.get(CONF_ADVANCED_ENVIRONMENTAL, False),
            "budget": options.get(CONF_ADVANCED_BUDGET, False),
            "groups": options.get(CONF_ADVANCED_GROUPS, False),
            "checklists": options.get(CONF_ADVANCED_CHECKLISTS, False),
            "schedule_time": options.get(CONF_ADVANCED_SCHEDULE_TIME, False),
            "completion_actions": options.get(CONF_ADVANCED_COMPLETION_ACTIONS, False),
        },
        # Top-level (not a feature toggle, not a bool): list of HA user IDs
        # whose UI gets the full admin panel even though they're not HA admins.
        "admin_panel_user_ids": options.get(CONF_ADMIN_PANEL_USER_IDS, []),
        # v2.8.4: master switch gating whether the allowlist actually grants
        # write. Default False → operator allowlist is read-only.
        "operator_write_enabled": options.get(CONF_OPERATOR_WRITE_ENABLED, False),
        # (#67): ordered objects-table columns for the panel All-Objects view.
        "objects_table_columns": options.get(CONF_OBJECTS_TABLE_COLUMNS, DEFAULT_OBJECTS_TABLE_COLUMNS),
        # v2.21: template-gallery curation (ids hidden from the pickers).
        "disabled_template_ids": options.get(CONF_DISABLED_TEMPLATE_IDS, []),
        # v2.10.0: archive automation thresholds (panel Settings → Archive).
        # oneoff_days: auto-archive a completed one-off after N days (0 = off).
        # delete_archived_oneoff_days: auto-delete an auto-archived one-off N
        # days after archiving (0 = never; manual archives are never deleted).
        "archive": {
            "oneoff_days": options.get(CONF_ARCHIVE_ONEOFF_DAYS, DEFAULT_ARCHIVE_ONEOFF_DAYS),
            "delete_archived_oneoff_days": options.get(
                CONF_DELETE_ARCHIVED_ONEOFF_DAYS,
                DEFAULT_DELETE_ARCHIVED_ONEOFF_DAYS,
            ),
        },
        "general": {
            "default_warning_days": options.get(CONF_DEFAULT_WARNING_DAYS, DEFAULT_WARNING_DAYS),
            "notifications_enabled": options.get(CONF_NOTIFICATIONS_ENABLED, False),
            "notify_service": options.get(CONF_NOTIFY_SERVICE, ""),
            # Shared pickable-target list so the panel picker can't drift from
            # the options-flow dropdown (both go through build_notify_targets).
            "notify_targets": notify_targets or [],
            "panel_enabled": options.get(CONF_PANEL_ENABLED, DEFAULT_PANEL_ENABLED),
            "panel_title": options.get(CONF_PANEL_TITLE, ""),
        },
        "notifications": {
            "due_soon_enabled": options.get(CONF_NOTIFY_DUE_SOON_ENABLED, True),
            "due_soon_interval_hours": options.get(CONF_NOTIFY_DUE_SOON_INTERVAL, 24),
            "overdue_enabled": options.get(CONF_NOTIFY_OVERDUE_ENABLED, True),
            "overdue_interval_hours": options.get(CONF_NOTIFY_OVERDUE_INTERVAL, 12),
            "triggered_enabled": options.get(CONF_NOTIFY_TRIGGERED_ENABLED, True),
            "triggered_interval_hours": options.get(CONF_NOTIFY_TRIGGERED_INTERVAL, 0),
            "quiet_hours_enabled": options.get(CONF_QUIET_HOURS_ENABLED, True),
            "quiet_hours_start": options.get(CONF_QUIET_HOURS_START, "22:00"),
            "quiet_hours_end": options.get(CONF_QUIET_HOURS_END, "08:00"),
            "max_per_day": options.get(CONF_MAX_NOTIFICATIONS_PER_DAY, 0),
            "bundling_enabled": options.get(CONF_NOTIFICATION_BUNDLING_ENABLED, False),
            "bundle_threshold": options.get(CONF_NOTIFICATION_BUNDLE_THRESHOLD, 2),
            # v1.4.0 (#44): default keeps backwards-compatible per-status titles
            "title_style": options.get(CONF_NOTIFICATION_TITLE_STYLE, "default"),
            # Multiple lead-time reminders (days before due); [] = off.
            "reminder_lead_days": options.get(CONF_REMINDER_LEAD_DAYS, []),
            # v2.26: notification routing — saved-view id scoping which
            # tasks may notify ("" = all tasks).
            "scope_view_id": options.get(CONF_NOTIFY_SCOPE_VIEW_ID, ""),
        },
        "actions": {
            "complete_enabled": options.get(CONF_ACTION_COMPLETE_ENABLED, False),
            "skip_enabled": options.get(CONF_ACTION_SKIP_ENABLED, False),
            "snooze_enabled": options.get(CONF_ACTION_SNOOZE_ENABLED, False),
            "snooze_duration_hours": options.get(CONF_SNOOZE_DURATION_HOURS, DEFAULT_SNOOZE_DURATION_HOURS),
            "weekly_digest_enabled": options.get(CONF_WEEKLY_DIGEST_ENABLED, False),
            "warranty_reminder_enabled": options.get(CONF_WARRANTY_REMINDER_ENABLED, False),
            "warranty_reminder_days": options.get(CONF_WARRANTY_REMINDER_DAYS, DEFAULT_WARRANTY_REMINDER_DAYS),
        },
        "budget": {
            "monthly": options.get(CONF_BUDGET_MONTHLY, 0.0),
            "yearly": options.get(CONF_BUDGET_YEARLY, 0.0),
            "alerts_enabled": options.get(CONF_BUDGET_ALERTS_ENABLED, False),
            "alert_threshold_pct": options.get(CONF_BUDGET_ALERT_THRESHOLD, 80),
            "currency": options.get(CONF_BUDGET_CURRENCY, DEFAULT_BUDGET_CURRENCY),
            "currency_symbol": BUDGET_CURRENCIES.get(
                options.get(CONF_BUDGET_CURRENCY, DEFAULT_BUDGET_CURRENCY),
                BUDGET_CURRENCIES[DEFAULT_BUDGET_CURRENCY],
            ),
        },
        # Vacation mode (v1.2.0). Mirror the active flag so the panel can
        # decide whether to show the Vacation tab without a separate WS call.
        "vacation": _vacation_summary(options),
    }


def _vacation_summary(options: Mapping[str, Any]) -> dict[str, Any]:
    """Embed-friendly slice of vacation state for the /settings response.

    Builds the canonical VacationState from the options mapping and serialises
    via its single wire serializer, so the /settings embed and /vacation/state
    can never drift (window/active math lives in one place).
    """
    from ..helpers.vacation import VacationState

    return VacationState.from_options(options).as_wire_dict()


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/settings"})
@websocket_api.async_response
async def ws_get_settings(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return all global settings."""
    global_entry = _get_global_entry(hass)
    if global_entry is None:
        connection.send_result(
            msg["id"],
            _build_full_settings({}, notify_targets=build_notify_targets(hass)),
        )
        return

    options = global_entry.options or global_entry.data
    connection.send_result(
        msg["id"],
        _build_full_settings(
            options,
            notify_targets=build_notify_targets(hass, current=options.get(CONF_NOTIFY_SERVICE, "")),
        ),
    )


@websocket_api.websocket_command({vol.Required("type"): "maintenance_supporter/statistics"})
@websocket_api.async_response
async def ws_get_statistics(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return aggregated statistics."""
    # Counts come from the shared aggregator (single source of truth) so the
    # panel/card chips and the global summary sensors can never diverge.
    counts = compute_status_counts(hass)

    # (#86) Registry-resolved entity_ids of the four summary sensors. The
    # dashboard strategy's KPI chips used to hardcode
    # sensor.maintenance_supporter_<key>, which breaks whenever the actual id
    # differs (renamed by the user, a _2 collision suffix, or a pre-pinning
    # install that registered localized ids) — the chips then read "unknown"
    # forever. unique_ids are stable, so resolve through the registry.
    from homeassistant.helpers import entity_registry as er

    ent_reg = er.async_get(hass)
    summary_entity_ids = {
        key: ent_reg.async_get_entity_id("sensor", DOMAIN, f"{GLOBAL_UNIQUE_ID}_summary_{key}")
        for key in ("overdue", "due_soon", "triggered", "ok")
    }

    connection.send_result(
        msg["id"],
        {
            "summary_entity_ids": summary_entity_ids,
            "total_objects": counts["total_objects"],
            "total_tasks": counts["total_tasks"],
            "overdue": counts["overdue"],
            "due_soon": counts["due_soon"],
            "triggered": counts["triggered"],
            # (#86, 2nd report) `ok` lets the dashboard chips render the real
            # count directly when the summary sensors don't exist (e.g. the
            # global entry was deleted, leaving orphan object entries) instead
            # of reading a non-existent entity and showing "unknown".
            "ok": counts["ok"],
            "total_cost": counts["total_cost"],
        },
    )


@websocket_api.websocket_command({vol.Required("type"): "maintenance_supporter/subscribe"})
@websocket_api.async_response
async def ws_subscribe(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Subscribe to real-time maintenance updates."""
    attached_entry_ids: set[str] = set()
    unsub_callbacks: list[Callable[[], None]] = []

    @callback
    def _forward_update() -> None:
        """Forward coordinator updates to the WebSocket."""
        entries = _get_object_entries(hass)
        result = []
        for entry in entries:
            rd = _get_runtime_data(hass, entry.entry_id)
            coord_data = rd.coordinator.data if rd and rd.coordinator else None
            result.append(_build_object_response(hass, entry, coord_data))
        connection.send_message(websocket_api.event_message(msg["id"], {"objects": result}))

    def _attach_entry(entry_id: str) -> None:
        """Attach a coordinator listener for a specific entry."""
        if entry_id in attached_entry_ids:
            return
        rd = _get_runtime_data(hass, entry_id)
        if rd and rd.coordinator:
            unsub_callbacks.append(rd.coordinator.async_add_listener(_forward_update))
            attached_entry_ids.add(entry_id)

    # Register listeners on all existing coordinators
    entries = _get_object_entries(hass)
    for entry in entries:
        _attach_entry(entry.entry_id)

    # Listen for new object entries added after subscription
    @callback
    def _on_new_entry(entry_id: str) -> None:
        _attach_entry(entry_id)
        _forward_update()

    unsub_callbacks.append(async_dispatcher_connect(hass, SIGNAL_NEW_OBJECT_ENTRY, _on_new_entry))

    @callback
    def _unsub() -> None:
        for unsub in unsub_callbacks:
            unsub()

    connection.subscriptions[msg["id"]] = _unsub

    # Send initial data
    connection.send_result(msg["id"])
    _forward_update()


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/schedule/preview",
        # A DRAFT schedule in Schedule.to_dict form — validated leniently by
        # Schedule.from_dict (unknown kinds sanitize to manual → empty result).
        vol.Required("schedule"): dict,
        vol.Optional("last_performed"): vol.Any(str, None),
        vol.Optional("times_performed", default=0): vol.All(int, vol.Range(min=0, max=100000)),
        vol.Optional("count", default=3): vol.All(int, vol.Range(min=1, max=10)),
    }
)
@websocket_api.async_response
async def ws_schedule_preview(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Next N occurrences of a draft schedule — computed by the REAL engine.

    Powers the task dialog's live "next dates" preview (#83 roadmap item).
    Stateless and read-only: instantiates Schedule.from_dict and iterates
    next_due(), simulating an ON-TIME completion per step (last_performed /
    last_planned_due advance, times_performed increments) — so completion-
    anchored intervals, calendar kinds, season windows, business-day rolls,
    ±offsets and finite series all advance exactly as the engine would.
    Never a frontend reimplementation (the #103 drift lesson).
    """
    from datetime import date as date_cls

    from homeassistant.util import dt as dt_util

    from ..helpers.schedule import Schedule, preview_occurrences

    lp: date_cls | None = None
    raw_lp = msg.get("last_performed")
    if raw_lp:
        try:
            lp = date_cls.fromisoformat(raw_lp)
        except ValueError:
            connection.send_error(msg["id"], "invalid_date", "Invalid last_performed (expected YYYY-MM-DD)")
            return

    today = dt_util.now().date()
    try:
        sched = Schedule.from_dict(msg["schedule"])
        dates, series_ended = preview_occurrences(
            sched,
            last_performed=lp,
            times_performed=int(msg.get("times_performed", 0)),
            today=today,
            count=int(msg.get("count", 3)),
        )
    except (TypeError, ValueError) as err:
        connection.send_error(msg["id"], "invalid_input", f"Invalid schedule: {err}")
        return

    connection.send_result(
        msg["id"],
        {"occurrences": [d.isoformat() for d in dates], "series_ended": series_ended},
    )


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/budget_status"})
@websocket_api.async_response
async def ws_get_budget_status(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return current budget status (monthly/yearly spent vs budget)."""
    from ..helpers.budget import compute_spend

    global_entry = _get_global_entry(hass)
    global_options: Mapping[str, Any] = (global_entry.options or global_entry.data) if global_entry else {}

    monthly_budget = float(global_options.get(CONF_BUDGET_MONTHLY, 0))
    yearly_budget = float(global_options.get(CONF_BUDGET_YEARLY, 0))
    threshold_pct = int(global_options.get(CONF_BUDGET_ALERT_THRESHOLD, 80))

    # Shared with the coordinator's budget cache (which drives the ALERT), so
    # the number the panel draws and the number that triggers the notification
    # are the same number by construction.
    monthly_spent, yearly_spent = compute_spend(hass)

    currency_code = str(global_options.get(CONF_BUDGET_CURRENCY, DEFAULT_BUDGET_CURRENCY))
    currency_symbol = BUDGET_CURRENCIES.get(currency_code, "€")

    connection.send_result(
        msg["id"],
        {
            "monthly_budget": monthly_budget,
            "monthly_spent": round(monthly_spent, 2),
            "yearly_budget": yearly_budget,
            "yearly_spent": round(yearly_spent, 2),
            "alert_threshold_pct": threshold_pct,
            "currency_symbol": currency_symbol,
        },
    )


# ---------------------------------------------------------------------------
# Global settings update
# ---------------------------------------------------------------------------


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/global/update",
        vol.Required("settings"): dict,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_update_global_settings(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Update global settings.

    Accepts a flat dict of setting keys to update.  Unknown keys are
    silently ignored.  Returns the full updated settings.
    """
    global_entry = _get_global_entry(hass)
    if global_entry is None:
        connection.send_error(msg["id"], "not_found", "Global config entry not found")
        return

    settings_input: dict[str, Any] = msg["settings"]

    # Filter to allowed keys and validate types
    filtered: dict[str, Any] = {}
    for key, expected_type in _ALLOWED_SETTING_KEYS.items():
        if key in settings_input:
            val = settings_input[key]
            # Accept int for float fields
            if expected_type is float and isinstance(val, int):
                val = float(val)
            if isinstance(val, expected_type):
                filtered[key] = val

    # Range-validate numeric and string settings against the shared registry.
    for key, (lo, hi) in INT_RANGES.items():
        if key in filtered and not (lo <= filtered[key] <= hi):
            del filtered[key]
    for key, (flo, fhi) in FLOAT_RANGES.items():
        if key in filtered:
            v = filtered[key]
            if not math.isfinite(v) or not (flo <= v <= fhi):
                del filtered[key]
    for key, max_len in STR_MAX_LENGTHS.items():
        if key in filtered and len(filtered[key]) > max_len:
            del filtered[key]

    # Sidebar panel title (#63): trim + cap rather than drop, so an over-long
    # or padded value is normalised instead of silently ignored. A blank value
    # is kept (it clears the override → panel falls back to the default title).
    if CONF_PANEL_TITLE in filtered:
        raw_title = filtered[CONF_PANEL_TITLE]
        if isinstance(raw_title, str):
            filtered[CONF_PANEL_TITLE] = raw_title.strip()[:MAX_PANEL_TITLE_LENGTH]
        else:
            del filtered[CONF_PANEL_TITLE]

    # v1.4.0 (#44): enum-validate notification_title_style. Anything outside
    # the known set is dropped silently so a bogus value can't get into the
    # ConfigEntry options.
    from ..const import NOTIFICATION_TITLE_STYLES

    if CONF_NOTIFICATION_TITLE_STYLE in filtered and filtered[CONF_NOTIFICATION_TITLE_STYLE] not in NOTIFICATION_TITLE_STYLES:
        del filtered[CONF_NOTIFICATION_TITLE_STYLE]

    # v1.4.6 (#44 follow-up): drop quiet-hours time strings that aren't valid
    # HH:MM[:SS]. The HA TimeSelector in the options-flow rejects empty / bad
    # strings as "Invalid time" and that error blocks the entire form save —
    # even when the user is here to change something else and quiet_hours is
    # disabled. By dropping invalid values here, the form falls back to the
    # 22:00 / 08:00 defaults next render.
    for time_key in (CONF_QUIET_HOURS_START, CONF_QUIET_HOURS_END):
        if time_key in filtered:
            v = filtered[time_key]
            if not isinstance(v, str) or not TIME_HHMMSS_PATTERN.match(v):
                del filtered[time_key]

    # Sanitise admin_panel_user_ids: drop non-string entries + whitespace-only
    # entries, cap each at 64 chars (HA user UUIDs are 32), cap list at 50
    # entries, dedupe.
    if CONF_ADMIN_PANEL_USER_IDS in filtered:
        raw = filtered[CONF_ADMIN_PANEL_USER_IDS]
        cleaned: list[str] = []
        seen: set[str] = set()
        for v in raw:
            if not isinstance(v, str):
                continue
            stripped = v.strip()
            if not stripped or len(stripped) > 64:
                continue
            if stripped in seen:
                continue
            seen.add(stripped)
            cleaned.append(stripped)
            if len(cleaned) >= 50:
                break
        filtered[CONF_ADMIN_PANEL_USER_IDS] = cleaned

    # Multiple lead-time reminders: keep only ints within 0..365, dedupe, sort
    # descending (furthest lead first), cap the list. Empty list is valid — it
    # turns the feature off.
    if CONF_REMINDER_LEAD_DAYS in filtered:
        raw_leads = filtered[CONF_REMINDER_LEAD_DAYS]
        leads: list[int] = []
        for v in raw_leads:
            if isinstance(v, bool) or not isinstance(v, int):
                continue
            if 0 <= v <= 365 and v not in leads:
                leads.append(v)
        filtered[CONF_REMINDER_LEAD_DAYS] = sorted(leads, reverse=True)[:MAX_REMINDER_LEADS]

    # (#67): objects_table_columns — keep only known column keys, preserve the
    # caller's order, dedupe. An empty/invalid result falls back to the default
    # set (the panel also defaults defensively).
    if CONF_OBJECTS_TABLE_COLUMNS in filtered:
        raw_cols = filtered[CONF_OBJECTS_TABLE_COLUMNS]
        cols: list[str] = []
        seen_cols: set[str] = set()
        for v in raw_cols:
            if not isinstance(v, str) or v not in KNOWN_OBJECT_TABLE_COLUMNS:
                continue
            if v in seen_cols:
                continue
            seen_cols.add(v)
            cols.append(v)
        filtered[CONF_OBJECTS_TABLE_COLUMNS] = cols or list(DEFAULT_OBJECTS_TABLE_COLUMNS)

    # v2.21: disabled_template_ids — keep only ids of templates that actually
    # exist (a typo/stale id must not linger invisibly), dedupe.
    if CONF_DISABLED_TEMPLATE_IDS in filtered:
        from ..templates import KNOWN_TEMPLATE_IDS

        raw_tids = filtered[CONF_DISABLED_TEMPLATE_IDS]
        tids: list[str] = []
        for v in raw_tids:
            if isinstance(v, str) and v in KNOWN_TEMPLATE_IDS and v not in tids:
                tids.append(v)
        filtered[CONF_DISABLED_TEMPLATE_IDS] = tids

    if not filtered:
        connection.send_error(msg["id"], "invalid_input", "No valid setting keys provided")
        return

    # Validate notify_service if provided
    if CONF_NOTIFY_SERVICE in filtered:
        from ..config_flow_options_global import validate_notify_service

        normalized, error = validate_notify_service(filtered[CONF_NOTIFY_SERVICE])
        if error:
            connection.send_error(msg["id"], error, f"Invalid notify service: {error}")
            return
        filtered[CONF_NOTIFY_SERVICE] = normalized

    # Merge with existing options
    merged = dict(global_entry.options or global_entry.data)
    merged.update(filtered)
    hass.config_entries.async_update_entry(global_entry, options=merged)

    _LOGGER.debug("Global settings updated via WS: %s", list(filtered.keys()))

    connection.send_result(
        msg["id"],
        _build_full_settings(
            merged,
            notify_targets=build_notify_targets(hass, current=merged.get(CONF_NOTIFY_SERVICE, "")),
        ),
    )


# ---------------------------------------------------------------------------
# Test notification
# ---------------------------------------------------------------------------


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/global/test_notification",
        vol.Optional("user_id"): vol.Any(str, None),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_test_notification(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Send a test notification to the household service or to ONE member.

    With ``user_id`` the send goes through the same per-user resolution the
    real reminders use, so a green result actually proves that member's phone
    is reachable.
    """
    from ..config_flow_options_global import (
        _get_test_result_text,
        send_test_notification,
    )

    global_entry = _get_global_entry(hass)
    if global_entry is None:
        connection.send_error(msg["id"], "not_found", "Global config entry not found")
        return

    options = dict(global_entry.options or global_entry.data)
    result_key = await send_test_notification(hass, options, user_id=msg.get("user_id"))
    connection.send_result(
        msg["id"],
        {
            "success": result_key == "success",
            "result": result_key,
            "message": _get_test_result_text(hass, result_key),
        },
    )


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/notify/user_targets"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_notify_user_targets(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Report which notify services each household member resolves to.

    Answers the question the settings page could not previously answer: "will
    Bob actually get his reminders?". Resolution runs through the very same
    helper the reminder path uses, so what is shown is what will be used — a
    separate lookup here would be able to disagree with reality, which is the
    failure mode that made the wrong-service bug behind #75 invisible.

    Admin-only: the resolved service names carry members' device names.
    """
    from ..helpers.notification_manager import get_user_notify_services

    targets: list[dict[str, Any]] = []
    for user in await hass.auth.async_get_users():
        if not user.is_active or user.system_generated:
            continue
        targets.append(
            {
                "user_id": user.id,
                "name": user.name,
                "services": await get_user_notify_services(hass, user.id),
            }
        )

    connection.send_result(msg["id"], {"targets": targets})
