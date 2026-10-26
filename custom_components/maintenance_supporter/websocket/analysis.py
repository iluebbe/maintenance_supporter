"""WebSocket handlers for adaptive scheduling and analysis."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from ..const import (
    ADAPTIVE_EWA_ALPHA_RANGE,
    ADAPTIVE_MIN_INTERVAL_CAP_DAYS,
    CONF_TASKS,
    DOMAIN,
    MAX_ENTITY_ID_LENGTH,
    MAX_META_LENGTH,
)
from ..helpers.aggregate import get_runtime_data
from ..helpers.entry_tasks import write_task
from ..helpers.interval_analyzer import hemisphere
from ..helpers.permissions import require_write
from ..helpers.task_fields import INTERVAL_DAYS_RANGE
from ..models.shapes import AdaptiveConfig
from . import ID_FIELD, _load_object_task, async_commit_store


async def _persist_adaptive_config(
    hass: HomeAssistant,
    entry: ConfigEntry,
    task_id: str,
    adaptive_config: AdaptiveConfig,
) -> None:
    """Write a task's adaptive_config (store, or legacy entry data) and refresh."""
    rd = get_runtime_data(hass, entry.entry_id)
    if rd is not None and rd.store is not None:
        rd.store.set_adaptive_config(task_id, adaptive_config)
        # Immediate save like every other user-initiated write: a debounced
        # 60 s timer would lose the change on a restart/reload in that window.
        await async_commit_store(rd)
        return

    # Legacy: write to ConfigEntry.data
    task = dict(entry.data.get(CONF_TASKS, {})[task_id])
    task["adaptive_config"] = adaptive_config
    write_task(hass, entry, task_id, task)

    if rd and rd.coordinator:
        await rd.coordinator.async_refresh_now()


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/task/analyze_interval",
        vol.Required("entry_id"): ID_FIELD,
        vol.Required("task_id"): ID_FIELD,
    }
)
@websocket_api.async_response
async def ws_analyze_interval(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return full interval analysis for a task (on-demand)."""
    from ..helpers.interval_analyzer import IntervalAnalyzer

    ctx = _load_object_task(hass, connection, msg, merged=True)
    if ctx is None:
        return
    _entry, _rd, task_data = ctx

    # Hemisphere and current month for seasonal awareness
    from homeassistant.util import dt as dt_util

    analyzer = IntervalAnalyzer()
    analysis = analyzer.analyze(
        task_data, task_data.get("adaptive_config") or AdaptiveConfig(), hemisphere=hemisphere(hass), current_month=dt_util.now().month
    )

    connection.send_result(
        msg["id"],
        {
            "current_interval": analysis.current_interval,
            "average_actual_interval": analysis.average_actual_interval,
            "interval_std_dev": analysis.interval_std_dev,
            "ewa_prediction": analysis.ewa_prediction,
            "weibull_prediction": analysis.weibull_prediction,
            "weibull_beta": analysis.weibull_beta,
            "weibull_eta": analysis.weibull_eta,
            "recommended_interval": analysis.recommended_interval,
            "confidence": analysis.confidence,
            "feedback_count": analysis.feedback_count,
            "data_points": analysis.data_points,
            "recommendation_reason": analysis.recommendation_reason,
            "seasonal_factor": analysis.seasonal_factor,
            "seasonal_factors": analysis.seasonal_factors,
            "seasonal_reason": analysis.seasonal_adjustment_reason,
            "weibull_r_squared": analysis.weibull_r_squared,
            "confidence_interval_low": analysis.confidence_interval_low,
            "confidence_interval_high": analysis.confidence_interval_high,
        },
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/task/apply_suggestion",
        vol.Required("entry_id"): ID_FIELD,
        vol.Required("task_id"): ID_FIELD,
        vol.Required("interval"): vol.All(int, vol.Range(min=INTERVAL_DAYS_RANGE[0], max=INTERVAL_DAYS_RANGE[1])),
    }
)
@require_write
@websocket_api.async_response
async def ws_apply_suggestion(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Apply a suggested interval to a task."""
    # An unknown task_id is rejected up front instead of silently no-opping
    # and returning success (the apply call is a no-op for a missing task).
    ctx = _load_object_task(hass, connection, msg, need_coordinator=True)
    if ctx is None:
        return
    _entry, rd, _task = ctx

    applied = await rd.coordinator.async_apply_suggested_interval(
        task_id=msg["task_id"],
        interval=msg["interval"],
    )
    if not applied:
        # Its schedule is no day interval (a calendar kind): refused, and
        # said so — the panel reported "applied" (bug audit 2026-10-16).
        connection.send_error(msg["id"], "invalid_input", "The suggestion is a number of days; this task's schedule is not a day interval")
        return
    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/task/seasonal_overrides",
        vol.Required("entry_id"): ID_FIELD,
        vol.Required("task_id"): ID_FIELD,
        # At most 12 month keys survive validation anyway — cap the input so a
        # giant dict isn't iterated/coerced first (parity with every other list).
        vol.Required("overrides"): vol.All(dict, vol.Length(max=12)),
    }
)
@require_write
@websocket_api.async_response
async def ws_seasonal_overrides(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Set manual seasonal overrides for a task.

    Overrides is a dict of {month_num: factor}, e.g. {7: 0.5, 1: 2.0}.
    Keys must be 1-12, values must be 0.1-5.0.
    Pass empty dict {} to clear all overrides.
    """
    ctx = _load_object_task(hass, connection, msg, merged=True)
    if ctx is None:
        return
    entry, _rd, task_data = ctx
    task_id = msg["task_id"]

    # Validate overrides
    overrides = msg["overrides"]
    validated: dict[int, float] = {}
    for key, value in overrides.items():
        try:
            month = int(key)
            factor = float(value)
        except (ValueError, TypeError):
            connection.send_error(msg["id"], "invalid_input", f"Invalid override: key={key}, value={value}")
            return
        if month < 1 or month > 12:
            connection.send_error(msg["id"], "invalid_input", f"Month must be 1-12, got {month}")
            return
        if factor < 0.1 or factor > 5.0:
            connection.send_error(msg["id"], "invalid_input", f"Factor must be 0.1-5.0, got {factor}")
            return
        validated[month] = round(factor, 2)

    # Persist overrides in adaptive_config
    adaptive_config: AdaptiveConfig = (task_data.get("adaptive_config") or AdaptiveConfig()).copy()
    if validated:
        adaptive_config["seasonal_overrides"] = validated
    else:
        adaptive_config.pop("seasonal_overrides", None)

    await _persist_adaptive_config(hass, entry, task_id, adaptive_config)

    connection.send_result(msg["id"], {"success": True, "overrides": validated})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/task/set_environmental_entity",
        vol.Required("entry_id"): ID_FIELD,
        vol.Required("task_id"): ID_FIELD,
        vol.Optional("environmental_entity"): vol.Any(vol.All(str, vol.Length(max=MAX_ENTITY_ID_LENGTH)), None),
        vol.Optional("environmental_attribute"): vol.Any(vol.All(str, vol.Length(max=MAX_META_LENGTH)), None),
    }
)
@require_write
@websocket_api.async_response
async def ws_set_environmental_entity(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Set or clear the environmental entity for sensor-driven predictions.

    When set, the environmental sensor (e.g. outdoor temperature) is
    correlated with maintenance intervals to produce an adjustment factor.
    Pass environmental_entity=null to clear the binding.
    """
    ctx = _load_object_task(hass, connection, msg, merged=True)
    if ctx is None:
        return
    entry, _rd, task_data = ctx
    task_id = msg["task_id"]

    adaptive_config: AdaptiveConfig = (task_data.get("adaptive_config") or AdaptiveConfig()).copy()

    env_entity = msg.get("environmental_entity")
    env_attribute = msg.get("environmental_attribute")

    if env_entity:
        adaptive_config["environmental_entity"] = env_entity
        if env_attribute:
            adaptive_config["environmental_attribute"] = env_attribute
        else:
            adaptive_config.pop("environmental_attribute", None)
    else:
        # Clear environmental binding
        adaptive_config.pop("environmental_entity", None)
        adaptive_config.pop("environmental_attribute", None)

    await _persist_adaptive_config(hass, entry, task_id, adaptive_config)

    connection.send_result(
        msg["id"],
        {
            "success": True,
            "environmental_entity": env_entity,
            "environmental_attribute": env_attribute,
        },
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/task/set_adaptive",
        vol.Required("entry_id"): ID_FIELD,
        vol.Required("task_id"): ID_FIELD,
        vol.Required("enabled"): bool,
        vol.Optional("ewa_alpha"): vol.All(
            vol.Coerce(float), vol.Range(min=ADAPTIVE_EWA_ALPHA_RANGE[0], max=ADAPTIVE_EWA_ALPHA_RANGE[1])
        ),
        vol.Optional("min_interval_days"): vol.All(int, vol.Range(min=1, max=ADAPTIVE_MIN_INTERVAL_CAP_DAYS)),
        vol.Optional("max_interval_days"): vol.All(int, vol.Range(min=1, max=INTERVAL_DAYS_RANGE[1])),
        vol.Optional("seasonal_enabled"): bool,
        vol.Optional("sensor_prediction_enabled"): bool,
    }
)
@require_write
@websocket_api.async_response
async def ws_set_adaptive(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Set the adaptive-scheduling tuning for a task (dialog parity with the
    options flow's adaptive step). The environmental binding has its own
    endpoint above; omitted optional fields keep their stored values."""
    ctx = _load_object_task(hass, connection, msg, merged=True)
    if ctx is None:
        return
    entry, _rd, task_data = ctx
    task_id = msg["task_id"]

    adaptive_config: AdaptiveConfig = (task_data.get("adaptive_config") or AdaptiveConfig()).copy()
    adaptive_config["enabled"] = msg["enabled"]
    if "ewa_alpha" in msg:
        adaptive_config["ewa_alpha"] = msg["ewa_alpha"]
    if "min_interval_days" in msg:
        adaptive_config["min_interval_days"] = msg["min_interval_days"]
    if "max_interval_days" in msg:
        adaptive_config["max_interval_days"] = msg["max_interval_days"]
    if "seasonal_enabled" in msg:
        adaptive_config["seasonal_enabled"] = msg["seasonal_enabled"]
    if "sensor_prediction_enabled" in msg:
        adaptive_config["sensor_prediction_enabled"] = msg["sensor_prediction_enabled"]

    min_iv = adaptive_config.get("min_interval_days")
    max_iv = adaptive_config.get("max_interval_days")
    if min_iv is not None and max_iv is not None and min_iv > max_iv:
        connection.send_error(msg["id"], "invalid_format", "min_interval_days exceeds max_interval_days")
        return

    await _persist_adaptive_config(hass, entry, task_id, adaptive_config)

    connection.send_result(msg["id"], {"success": True, "adaptive_config": adaptive_config})
