"""WebSocket commands for integration-aware suggested setups (roadmap).

``integration_setups/discover`` lists devices of catalogued integrations
(helpers/integration_signatures — every signature verified against the
integration's source) whose consumable entities can back maintenance tasks;
``integration_setups/adopt`` creates the object (or extends the existing one on
that device) with the tasks and their sensor triggers PRE-WIRED. Discovery is
read; adoption is write, mirroring problem-sensor adoption.
"""

from __future__ import annotations

from typing import Any
from uuid import uuid4

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from ..const import CONF_OBJECT, CONF_TASKS, DOMAIN, MAX_NAME_LENGTH
from ..helpers.integration_signatures import (
    SIGNATURES,
    build_setup_trigger,
    discover_integration_setups,
)
from ..helpers.permissions import require_write
from . import ID_FIELD
from .adopt_batch import AdoptBatch


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/integration_setups/discover"})
@websocket_api.async_response
async def ws_discover_integration_setups(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """List suggested maintenance setups for catalogued integrations."""
    connection.send_result(msg["id"], {"setups": discover_integration_setups(hass)})


_SELECTION_SCHEMA = vol.Schema(
    {
        vol.Required("device_id"): ID_FIELD,
        # Existing target object; omit to create a fresh object for the device.
        vol.Optional("entry_id"): ID_FIELD,
        vol.Optional("object_name"): vol.All(str, vol.Length(min=1, max=MAX_NAME_LENGTH)),
        # Subset of suggested task names to adopt; omit = all suggested.
        vol.Optional("task_names"): vol.All(
            [vol.All(str, vol.Length(max=MAX_NAME_LENGTH))], vol.Length(max=20)
        ),
        # Optional counting start values per task name (#102): "the last
        # service was at reading X". Only applied to usage_delta duties —
        # the delta then counts from X instead of the adoption reading, so
        # an interval that already elapsed comes due immediately.
        vol.Optional("baselines"): {
            vol.All(str, vol.Length(max=MAX_NAME_LENGTH)): vol.All(
                vol.Coerce(float), vol.Range(min=0)
            )
        },
    }
)


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/integration_setups/adopt",
        vol.Required("selections"): vol.All([_SELECTION_SCHEMA], vol.Length(min=1, max=50)),
    }
)
@require_write
@websocket_api.async_response
async def ws_adopt_integration_setups(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Create sensor-wired maintenance tasks for the selected suggestions."""
    from ..helpers.i18n import normalize_language
    from ..templates import localize_template_text

    lang = normalize_language(hass)
    # Re-run discovery server-side: the wiring (entities, thresholds) comes
    # from the verified catalog, never from the client.
    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    batch = AdoptBatch(hass)

    for sel in msg["selections"]:
        device_id = sel["device_id"]
        setup = setups.get(device_id)
        if setup is None:
            batch.errors.append({"device_id": device_id, "reason": "no suggestion for this device"})
            continue
        wanted = set(sel.get("task_names") or [t["task_name"] for t in setup["tasks"]])
        # Keyed by (task_name, direction): one integration can ship a task name
        # in two directions (LG ThinQ filter: hours vs percent), and the trigger
        # must be built from the signature matching the discovered direction.
        sig_by_key = {
            (s.task_name, s.direction): s for s in SIGNATURES[setup["integration"]].tasks
        }
        batch.begin()
        try:
            entry_id = sel.get("entry_id") or setup["suggested_entry_id"]
            if not entry_id:
                entry_id = await batch.create_object(
                    name=sel.get("object_name") or setup["suggested_object_name"],
                    ha_device_id=device_id,
                )

            entry = batch.target_entry(entry_id)
            if entry is None:
                batch.errors.append({"device_id": device_id, "reason": "target object not found"})
                continue

            # #105: adopting into a user-picked existing object that isn't
            # device-bound yet — bind it, so model/sibling gates work and
            # future discovery suggests this object instead of a new one.
            # (Objects reached via suggested_entry_id are bound by definition;
            # the guard makes this a no-op for them.)
            obj_data = entry.data.get(CONF_OBJECT, {})
            if not obj_data.get("ha_device_id"):
                new_data = dict(entry.data)
                new_data[CONF_OBJECT] = {**obj_data, "ha_device_id": device_id}
                hass.config_entries.async_update_entry(entry, data=new_data)
                refreshed = hass.config_entries.async_get_entry(entry_id)
                if refreshed is not None:
                    entry = refreshed

            # Second dedup layer (discovery already hides these): never create
            # a task whose name — in any language — already exists on the
            # target object.
            from ..helpers.integration_signatures import proposal_name_variants

            existing_names = {
                str(t.get("name", "")).lower()
                for t in entry.data.get(CONF_TASKS, {}).values()
            }

            baselines = sel.get("baselines") or {}
            for task in setup["tasks"]:
                if task["task_name"] not in wanted:
                    continue
                # Per-entity duties (colour cartridges) carry the entity label
                # in task_name; the catalog key and the label travel separately.
                catalog_name = task.get("catalog_task_name") or task["task_name"]
                if existing_names & proposal_name_variants(catalog_name, task.get("entity_label")):
                    continue
                sig = sig_by_key[(catalog_name, task["direction"])]
                trigger = build_setup_trigger(sig, hass, task["entity_ids"])
                # #102: "last service was at reading X" — usage_delta only.
                # Other directions either already have absolute semantics
                # (usage_above's explicit 0) or no baseline concept at all.
                baseline = baselines.get(task["task_name"])
                if baseline is not None and sig.direction == "usage_delta":
                    trigger["trigger_baseline_value"] = float(baseline)
                await batch.persist_task(
                    entry,
                    {
                        "id": uuid4().hex,
                        "object_id": entry.data.get(CONF_OBJECT, {}).get("id", ""),
                        "name": task.get("task_name_localized")
                        or localize_template_text(task["task_name"], lang)
                        or task["task_name"],
                        "type": "replacement",
                        "enabled": True,
                        "schedule": {"kind": "manual"},
                        "trigger_config": trigger,
                    },
                )
        except (ValueError, KeyError) as err:
            # Removes an object created for this device together with the
            # tasks already persisted into it — and un-counts both (the
            # tasks were over-reported before the DRY audit 2026-09-26).
            await batch.fail({"device_id": device_id, "reason": str(err)})

    connection.send_result(msg["id"], batch.result())
