"""WebSocket handlers for adaptive scheduling and analysis."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from ..const import (
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from . import _get_merged_tasks, _get_runtime_data


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/task/analyze_interval",
        vol.Required("entry_id"): str,
        vol.Required("task_id"): str,
    }
)
@websocket_api.async_response
async def ws_analyze_interval(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return full interval analysis for a task (on-demand)."""
    from ..helpers.interval_analyzer import IntervalAnalyzer  # noqa: PLC0415

    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if entry is None or entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID:
        connection.send_error(msg["id"], "not_found", "Object not found")
        return

    tasks_data = _get_merged_tasks(entry)
    task_id = msg["task_id"]
    if task_id not in tasks_data:
        connection.send_error(msg["id"], "not_found", "Task not found")
        return

    task_data = tasks_data[task_id]
    adaptive_config = dict(task_data.get("adaptive_config", {}))

    # Inject hemisphere and current month for seasonal awareness
    from datetime import datetime as dt_cls  # noqa: PLC0415

    adaptive_config["hemisphere"] = (
        "south" if hass.config.latitude < 0 else "north"
    )
    adaptive_config["_current_month"] = dt_cls.now().month

    analyzer = IntervalAnalyzer()
    analysis = analyzer.analyze(task_data, adaptive_config)

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
        vol.Required("entry_id"): str,
        vol.Required("task_id"): str,
        vol.Required("interval"): int,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_apply_suggestion(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Apply a suggested interval to a task."""
    rd = _get_runtime_data(hass, msg["entry_id"])
    if rd is None or rd.coordinator is None:
        connection.send_error(msg["id"], "not_found", "Coordinator not found")
        return

    await rd.coordinator.async_apply_suggested_interval(
        task_id=msg["task_id"],
        interval=msg["interval"],
    )
    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/task/seasonal_overrides",
        vol.Required("entry_id"): str,
        vol.Required("task_id"): str,
        vol.Required("overrides"): dict,
    }
)
@websocket_api.require_admin
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
    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if entry is None or entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID:
        connection.send_error(msg["id"], "not_found", "Object not found")
        return

    task_id = msg["task_id"]
    tasks_data = _get_merged_tasks(entry)
    if task_id not in tasks_data:
        connection.send_error(msg["id"], "not_found", "Task not found")
        return

    # Validate overrides
    overrides = msg["overrides"]
    validated: dict[int, float] = {}
    for key, value in overrides.items():
        try:
            month = int(key)
            factor = float(value)
        except (ValueError, TypeError):
            connection.send_error(
                msg["id"], "invalid_input",
                f"Invalid override: key={key}, value={value}"
            )
            return
        if month < 1 or month > 12:
            connection.send_error(
                msg["id"], "invalid_input",
                f"Month must be 1-12, got {month}"
            )
            return
        if factor < 0.1 or factor > 5.0:
            connection.send_error(
                msg["id"], "invalid_input",
                f"Factor must be 0.1-5.0, got {factor}"
            )
            return
        validated[month] = round(factor, 2)

    # Persist overrides in adaptive_config
    adaptive_config = dict(tasks_data[task_id].get("adaptive_config", {}))
    if validated:
        adaptive_config["seasonal_overrides"] = validated
    else:
        adaptive_config.pop("seasonal_overrides", None)

    rd = _get_runtime_data(hass, entry.entry_id)
    store = getattr(rd, "store", None) if rd else None
    if store is not None:
        store.set_adaptive_config(task_id, adaptive_config)
        store.async_delay_save()
    else:
        # Legacy: write to ConfigEntry.data
        static_tasks = dict(entry.data.get(CONF_TASKS, {}))
        task = dict(static_tasks[task_id])
        task["adaptive_config"] = adaptive_config
        static_tasks[task_id] = task
        new_data = dict(entry.data)
        new_data[CONF_TASKS] = static_tasks
        hass.config_entries.async_update_entry(entry, data=new_data)

    # Refresh coordinator
    if rd and rd.coordinator:
        await rd.coordinator.async_request_refresh()

    connection.send_result(msg["id"], {"success": True, "overrides": validated})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/task/set_environmental_entity",
        vol.Required("entry_id"): str,
        vol.Required("task_id"): str,
        vol.Optional("environmental_entity"): vol.Any(str, None),
        vol.Optional("environmental_attribute"): vol.Any(str, None),
    }
)
@websocket_api.require_admin
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
    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if entry is None or entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID:
        connection.send_error(msg["id"], "not_found", "Object not found")
        return

    task_id = msg["task_id"]
    tasks_data = _get_merged_tasks(entry)
    if task_id not in tasks_data:
        connection.send_error(msg["id"], "not_found", "Task not found")
        return

    adaptive_config = dict(tasks_data[task_id].get("adaptive_config", {}))

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

    rd = _get_runtime_data(hass, entry.entry_id)
    store = getattr(rd, "store", None) if rd else None
    if store is not None:
        store.set_adaptive_config(task_id, adaptive_config)
        store.async_delay_save()
    else:
        # Legacy: write to ConfigEntry.data
        static_tasks = dict(entry.data.get(CONF_TASKS, {}))
        task = dict(static_tasks[task_id])
        task["adaptive_config"] = adaptive_config
        static_tasks[task_id] = task
        new_data = dict(entry.data)
        new_data[CONF_TASKS] = static_tasks
        hass.config_entries.async_update_entry(entry, data=new_data)

    # Refresh coordinator
    if rd and rd.coordinator:
        await rd.coordinator.async_request_refresh()

    connection.send_result(
        msg["id"],
        {
            "success": True,
            "environmental_entity": env_entity,
            "environmental_attribute": env_attribute,
        },
    )
