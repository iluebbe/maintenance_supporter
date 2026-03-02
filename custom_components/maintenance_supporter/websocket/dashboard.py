"""WebSocket handlers for subscribe, statistics, settings, and budget."""

from __future__ import annotations

from collections.abc import Mapping
from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from ..const import (
    CONF_ADVANCED_ADAPTIVE,
    CONF_ADVANCED_BUDGET,
    CONF_ADVANCED_CHECKLISTS,
    CONF_ADVANCED_ENVIRONMENTAL,
    CONF_ADVANCED_GROUPS,
    CONF_ADVANCED_PREDICTIONS,
    CONF_ADVANCED_SEASONAL,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from . import (
    _build_object_response,
    _get_global_entry,
    _get_object_entries,
    _get_runtime_data,
)


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/settings"}
)
@websocket_api.async_response
async def ws_get_settings(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return global settings including advanced feature flags."""
    global_entry = _get_global_entry(hass)
    if global_entry is None:
        connection.send_result(msg["id"], {"features": {}})
        return

    options = global_entry.options or global_entry.data

    connection.send_result(
        msg["id"],
        {
            "features": {
                "adaptive": options.get(CONF_ADVANCED_ADAPTIVE, False),
                "predictions": options.get(CONF_ADVANCED_PREDICTIONS, False),
                "seasonal": options.get(CONF_ADVANCED_SEASONAL, False),
                "environmental": options.get(CONF_ADVANCED_ENVIRONMENTAL, False),
                "budget": options.get(CONF_ADVANCED_BUDGET, False),
                "groups": options.get(CONF_ADVANCED_GROUPS, False),
                "checklists": options.get(CONF_ADVANCED_CHECKLISTS, False),
            },
        },
    )


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

        for tid, ct in ct_tasks.items():
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

    # Register listeners on all coordinators
    unsub_callbacks = []
    entries = _get_object_entries(hass)
    for entry in entries:
        rd = _get_runtime_data(hass, entry.entry_id)
        if rd and rd.coordinator:
            unsub_callbacks.append(
                rd.coordinator.async_add_listener(_forward_update)
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
    from datetime import datetime as dt_cls  # noqa: PLC0415

    from ..const import (  # noqa: PLC0415
        CONF_BUDGET_ALERT_THRESHOLD,
        CONF_BUDGET_MONTHLY,
        CONF_BUDGET_YEARLY,
    )

    # Get global options
    global_options: Mapping[str, Any] = {}
    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.unique_id == GLOBAL_UNIQUE_ID:
            global_options = entry.options or entry.data
            break

    monthly_budget = float(global_options.get(CONF_BUDGET_MONTHLY, 0))
    yearly_budget = float(global_options.get(CONF_BUDGET_YEARLY, 0))
    threshold_pct = int(global_options.get(CONF_BUDGET_ALERT_THRESHOLD, 80))

    now = dt_cls.now()
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
                if cost is None:
                    continue
                ts = h_entry.get("timestamp", "")
                try:
                    entry_dt = dt_cls.fromisoformat(ts)
                except (ValueError, TypeError):
                    continue
                if entry_dt.year == now.year:
                    yearly_spent += cost
                    if entry_dt.month == now.month:
                        monthly_spent += cost

    connection.send_result(
        msg["id"],
        {
            "monthly_budget": monthly_budget,
            "monthly_spent": round(monthly_spent, 2),
            "yearly_budget": yearly_budget,
            "yearly_spent": round(yearly_spent, 2),
            "alert_threshold_pct": threshold_pct,
        },
    )
