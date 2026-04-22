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
    CONF_ADVANCED_ENVIRONMENTAL,
    CONF_ADVANCED_GROUPS,
    CONF_ADVANCED_PREDICTIONS,
    CONF_ADVANCED_SCHEDULE_TIME,
    CONF_ADVANCED_SEASONAL,
    CONF_BUDGET_ALERT_THRESHOLD,
    CONF_BUDGET_ALERTS_ENABLED,
    CONF_BUDGET_CURRENCY,
    CONF_BUDGET_MONTHLY,
    CONF_BUDGET_YEARLY,
    CONF_DEFAULT_WARNING_DAYS,
    CONF_MAX_NOTIFICATIONS_PER_DAY,
    CONF_NOTIFICATION_BUNDLE_THRESHOLD,
    CONF_NOTIFICATION_BUNDLING_ENABLED,
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_DUE_SOON_ENABLED,
    CONF_NOTIFY_DUE_SOON_INTERVAL,
    CONF_NOTIFY_OVERDUE_ENABLED,
    CONF_NOTIFY_OVERDUE_INTERVAL,
    CONF_NOTIFY_SERVICE,
    CONF_NOTIFY_TRIGGERED_ENABLED,
    CONF_NOTIFY_TRIGGERED_INTERVAL,
    CONF_PANEL_ENABLED,
    CONF_QUIET_HOURS_ENABLED,
    CONF_QUIET_HOURS_END,
    CONF_QUIET_HOURS_START,
    CONF_SNOOZE_DURATION_HOURS,
    CONF_TASKS,
    DOMAIN,
    SIGNAL_NEW_OBJECT_ENTRY,
)
from . import (
    _build_object_response,
    _get_global_entry,
    _get_object_entries,
    _get_runtime_data,
)

_LOGGER = logging.getLogger(__name__)

# Keys accepted by global/update — maps config key to voluptuous type
_ALLOWED_SETTING_KEYS: dict[str, type | vol.Any] = {
    CONF_DEFAULT_WARNING_DAYS: int,
    CONF_NOTIFICATIONS_ENABLED: bool,
    CONF_NOTIFY_SERVICE: str,
    CONF_PANEL_ENABLED: bool,
    # Advanced features
    CONF_ADVANCED_ADAPTIVE: bool,
    CONF_ADVANCED_PREDICTIONS: bool,
    CONF_ADVANCED_SEASONAL: bool,
    CONF_ADVANCED_ENVIRONMENTAL: bool,
    CONF_ADVANCED_BUDGET: bool,
    CONF_ADVANCED_GROUPS: bool,
    CONF_ADVANCED_CHECKLISTS: bool,
    CONF_ADVANCED_SCHEDULE_TIME: bool,
    # Type-validated as a list here; element + length caps applied below in
    # ws_update_global_settings (HA installs rarely exceed ~10 entries).
    CONF_ADMIN_PANEL_USER_IDS: list,
    # Notification per-status
    CONF_NOTIFY_DUE_SOON_ENABLED: bool,
    CONF_NOTIFY_DUE_SOON_INTERVAL: int,
    CONF_NOTIFY_OVERDUE_ENABLED: bool,
    CONF_NOTIFY_OVERDUE_INTERVAL: int,
    CONF_NOTIFY_TRIGGERED_ENABLED: bool,
    CONF_NOTIFY_TRIGGERED_INTERVAL: int,
    # Quiet hours
    CONF_QUIET_HOURS_ENABLED: bool,
    CONF_QUIET_HOURS_START: str,
    CONF_QUIET_HOURS_END: str,
    # Limits
    CONF_MAX_NOTIFICATIONS_PER_DAY: int,
    # Bundling
    CONF_NOTIFICATION_BUNDLING_ENABLED: bool,
    CONF_NOTIFICATION_BUNDLE_THRESHOLD: int,
    # Actions
    CONF_ACTION_COMPLETE_ENABLED: bool,
    CONF_ACTION_SKIP_ENABLED: bool,
    CONF_ACTION_SNOOZE_ENABLED: bool,
    CONF_SNOOZE_DURATION_HOURS: int,
    # Budget
    CONF_BUDGET_MONTHLY: float,
    CONF_BUDGET_YEARLY: float,
    CONF_BUDGET_ALERTS_ENABLED: bool,
    CONF_BUDGET_ALERT_THRESHOLD: int,
    CONF_BUDGET_CURRENCY: str,
}


def _build_full_settings(options: Mapping[str, Any]) -> dict[str, Any]:
    """Build a full settings dict from global entry options."""
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
        },
        # Top-level (not a feature toggle, not a bool): list of HA user IDs
        # whose UI gets the full admin panel even though they're not HA admins.
        "admin_panel_user_ids": options.get(CONF_ADMIN_PANEL_USER_IDS, []),
        "general": {
            "default_warning_days": options.get(CONF_DEFAULT_WARNING_DAYS, 7),
            "notifications_enabled": options.get(CONF_NOTIFICATIONS_ENABLED, False),
            "notify_service": options.get(CONF_NOTIFY_SERVICE, ""),
            "panel_enabled": options.get(CONF_PANEL_ENABLED, False),
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
        },
        "actions": {
            "complete_enabled": options.get(CONF_ACTION_COMPLETE_ENABLED, False),
            "skip_enabled": options.get(CONF_ACTION_SKIP_ENABLED, False),
            "snooze_enabled": options.get(CONF_ACTION_SNOOZE_ENABLED, False),
            "snooze_duration_hours": options.get(CONF_SNOOZE_DURATION_HOURS, 4),
        },
        "budget": {
            "monthly": options.get(CONF_BUDGET_MONTHLY, 0.0),
            "yearly": options.get(CONF_BUDGET_YEARLY, 0.0),
            "alerts_enabled": options.get(CONF_BUDGET_ALERTS_ENABLED, False),
            "alert_threshold_pct": options.get(CONF_BUDGET_ALERT_THRESHOLD, 80),
            "currency": options.get(CONF_BUDGET_CURRENCY, "EUR"),
            "currency_symbol": BUDGET_CURRENCIES.get(
                options.get(CONF_BUDGET_CURRENCY, "EUR"), "€"
            ),
        },
    }


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/settings"}
)
@websocket_api.async_response
async def ws_get_settings(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return all global settings."""
    global_entry = _get_global_entry(hass)
    if global_entry is None:
        connection.send_result(msg["id"], _build_full_settings({}))
        return

    options = global_entry.options or global_entry.data
    connection.send_result(msg["id"], _build_full_settings(options))


@websocket_api.websocket_command(
    {vol.Required("type"): "maintenance_supporter/statistics"}
)
@websocket_api.async_response
async def ws_get_statistics(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return aggregated statistics."""
    entries = _get_object_entries(hass)
    total_objects = len(entries)
    total_tasks = 0
    overdue = 0
    due_soon = 0
    triggered = 0
    total_cost = 0.0

    for entry in entries:
        rd = _get_runtime_data(hass, entry.entry_id)
        coord_data = rd.coordinator.data if rd and rd.coordinator else None
        ct_tasks = (coord_data or {}).get(CONF_TASKS, {})
        tasks_data = entry.data.get(CONF_TASKS, {})
        total_tasks += len(tasks_data)

        for _tid, ct in ct_tasks.items():
            status = ct.get("_status", "ok")
            if status == "overdue":
                overdue += 1
            elif status == "due_soon":
                due_soon += 1
            elif status == "triggered":
                triggered += 1
            total_cost += ct.get("_total_cost", 0.0)

    connection.send_result(
        msg["id"],
        {
            "total_objects": total_objects,
            "total_tasks": total_tasks,
            "overdue": overdue,
            "due_soon": due_soon,
            "triggered": triggered,
            "total_cost": round(total_cost, 2),
        },
    )


@websocket_api.websocket_command(
    {vol.Required("type"): "maintenance_supporter/subscribe"}
)
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
        connection.send_message(
            websocket_api.event_message(msg["id"], {"objects": result})
        )

    def _attach_entry(entry_id: str) -> None:
        """Attach a coordinator listener for a specific entry."""
        if entry_id in attached_entry_ids:
            return
        rd = _get_runtime_data(hass, entry_id)
        if rd and rd.coordinator:
            unsub_callbacks.append(
                rd.coordinator.async_add_listener(_forward_update)
            )
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

    unsub_callbacks.append(
        async_dispatcher_connect(hass, SIGNAL_NEW_OBJECT_ENTRY, _on_new_entry)
    )

    @callback
    def _unsub() -> None:
        for unsub in unsub_callbacks:
            unsub()

    connection.subscriptions[msg["id"]] = _unsub

    # Send initial data
    connection.send_result(msg["id"])
    _forward_update()


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/budget_status"}
)
@websocket_api.async_response
async def ws_get_budget_status(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return current budget status (monthly/yearly spent vs budget)."""
    from datetime import datetime as dt_cls

    from homeassistant.util import dt as dt_util

    global_entry = _get_global_entry(hass)
    global_options: Mapping[str, Any] = (
        (global_entry.options or global_entry.data) if global_entry else {}
    )

    monthly_budget = float(global_options.get(CONF_BUDGET_MONTHLY, 0))
    yearly_budget = float(global_options.get(CONF_BUDGET_YEARLY, 0))
    threshold_pct = int(global_options.get(CONF_BUDGET_ALERT_THRESHOLD, 80))

    now = dt_util.now()
    monthly_spent = 0.0
    yearly_spent = 0.0

    entries = _get_object_entries(hass)
    for entry in entries:
        rd = _get_runtime_data(hass, entry.entry_id)
        store = getattr(rd, "store", None) if rd else None

        for tid in entry.data.get("tasks", {}):
            if store is not None:
                history = store.get_history(tid)
            else:
                history = entry.data.get("tasks", {}).get(tid, {}).get("history", [])

            for h_entry in history:
                if h_entry.get("type") != "completed":
                    continue
                cost = h_entry.get("cost")
                if not isinstance(cost, (int, float)):
                    continue
                ts = h_entry.get("timestamp", "")
                try:
                    entry_dt = dt_cls.fromisoformat(ts)
                except (ValueError, TypeError):
                    continue
                # Naive timestamps from older entries: treat as HA local TZ,
                # then normalise so year/month boundaries match `now`.
                if entry_dt.tzinfo is None:
                    entry_dt = entry_dt.replace(tzinfo=dt_util.DEFAULT_TIME_ZONE)
                entry_dt = dt_util.as_local(entry_dt)
                if entry_dt.year == now.year:
                    yearly_spent += cost
                    if entry_dt.month == now.month:
                        monthly_spent += cost

    currency_code = str(global_options.get(CONF_BUDGET_CURRENCY, "EUR"))
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

    # Range-validate numeric and string settings
    _INT_RANGES: dict[str, tuple[int, int]] = {
        CONF_DEFAULT_WARNING_DAYS: (1, 365),
        CONF_MAX_NOTIFICATIONS_PER_DAY: (0, 1000),
        CONF_NOTIFY_DUE_SOON_INTERVAL: (0, 720),
        CONF_NOTIFY_OVERDUE_INTERVAL: (0, 720),
        CONF_NOTIFY_TRIGGERED_INTERVAL: (0, 720),
        CONF_NOTIFICATION_BUNDLE_THRESHOLD: (1, 100),
        CONF_SNOOZE_DURATION_HOURS: (1, 168),
        CONF_BUDGET_ALERT_THRESHOLD: (1, 100),
    }
    _FLOAT_RANGES: dict[str, tuple[float, float]] = {
        CONF_BUDGET_MONTHLY: (0.0, 10_000_000.0),
        CONF_BUDGET_YEARLY: (0.0, 100_000_000.0),
    }
    _STR_MAX_LENGTHS: dict[str, int] = {
        CONF_NOTIFY_SERVICE: 200,
        CONF_QUIET_HOURS_START: 5,
        CONF_QUIET_HOURS_END: 5,
        CONF_BUDGET_CURRENCY: 5,
    }
    for key, (lo, hi) in _INT_RANGES.items():
        if key in filtered and not (lo <= filtered[key] <= hi):
            del filtered[key]
    for key, (lo, hi) in _FLOAT_RANGES.items():
        if key in filtered:
            v = filtered[key]
            if not math.isfinite(v) or not (lo <= v <= hi):
                del filtered[key]
    for key, max_len in _STR_MAX_LENGTHS.items():
        if key in filtered and len(filtered[key]) > max_len:
            del filtered[key]

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

    if not filtered:
        connection.send_error(
            msg["id"], "invalid_input", "No valid setting keys provided"
        )
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

    connection.send_result(msg["id"], _build_full_settings(merged))


# ---------------------------------------------------------------------------
# Test notification
# ---------------------------------------------------------------------------


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/global/test_notification"}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_test_notification(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Send a test notification using the configured service."""
    from ..config_flow_options_global import (
        _get_test_result_text,
        send_test_notification,
    )

    global_entry = _get_global_entry(hass)
    if global_entry is None:
        connection.send_error(msg["id"], "not_found", "Global config entry not found")
        return

    options = dict(global_entry.options or global_entry.data)
    result_key = await send_test_notification(hass, options)
    connection.send_result(
        msg["id"],
        {
            "success": result_key == "success",
            "message": _get_test_result_text(hass, result_key),
        },
    )
