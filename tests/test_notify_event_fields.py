"""The notification event as a contract (#178).

Pins: a task-bound context carries the task's labels, notes, type, schedule
kind, priority, links, last completion, the object's area / device and the
entity ids of the task's status sensor and trigger; a bundle's tasks carry
the same per task; kinds without a task have the fields as null / []; the
Settings test send fills sample values; and the field table in
docs/ARCHITECTURE.md lists exactly the keys the code produces.
"""

from __future__ import annotations

import re
from datetime import timedelta
from pathlib import Path
from typing import Any
from unittest.mock import AsyncMock

import pytest
from homeassistant.core import Event, HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_QUIET_HOURS_ENABLED,
    DOMAIN,
    EVENT_NOTIFICATION,
    GLOBAL_UNIQUE_ID,
    NOTIFICATION_MANAGER_KEY,
    ScheduleType,
)
from custom_components.maintenance_supporter.helpers.notify_hooks import KIND_BUNDLE, KIND_STATUS, KIND_TEST, notification_context

from .conftest import (
    TASK_ID_1,
    TASK_ID_2,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)

_ROOT = Path(__file__).resolve().parent.parent


def _global(hass: HomeAssistant) -> MockConfigEntry:
    data = build_global_entry_data(notifications_enabled=True, notify_service="notify.test")
    data[CONF_QUIET_HOURS_ENABLED] = False
    entry = MockConfigEntry(version=1, minor_version=1, domain=DOMAIN, title="Maintenance Supporter", data=data, source="user", unique_id=GLOBAL_UNIQUE_ID)
    entry.add_to_hass(hass)
    return entry


def _object(hass: HomeAssistant, area_id: str | None = None) -> MockConfigEntry:
    obj = build_object_data(name="Dishwasher", area_id=area_id)
    obj["ref_no"] = 8
    obj["ha_device_id"] = "dev-42"
    t1 = build_task_data(name="Filter", last_performed=(dt_util.now().date() - timedelta(days=40)).isoformat(), schedule_type=ScheduleType.SENSOR_BASED, trigger_config={"type": "threshold", "entity_id": "sensor.flow", "entity_ids": ["sensor.flow"], "trigger_below": 10})
    t1.update({"ref_no": 3, "priority": "high", "labels": ["kitchen", "water"], "notes": "Rinse under warm water", "documentation_url": "https://example.com/manual", "type": "cleaning"})
    t2 = build_task_data(task_id=TASK_ID_2, name="Salt", last_performed=(dt_util.now().date() - timedelta(days=5)).isoformat())
    t2.update({"ref_no": 4, "labels": ["kitchen"]})
    entry = MockConfigEntry(version=1, minor_version=1, domain=DOMAIN, title="Dishwasher", data=build_object_entry_data(object_data=obj, tasks={TASK_ID_1: t1, TASK_ID_2: t2}), source="user", unique_id="maintenance_supporter_ev178")
    entry.add_to_hass(hass)
    return entry


async def test_task_context_carries_the_whole_task(hass: HomeAssistant) -> None:
    g = _global(hass)
    area = ar.async_get(hass).async_create("Kitchen")
    obj = _object(hass, area_id=area.id)
    await setup_integration(hass, g, obj)
    ctx = notification_context(hass, KIND_STATUS, status="overdue", entry_id=obj.entry_id, task_id=TASK_ID_1, task_name="Filter", object_name="Dishwasher", days_until_due=-3)
    assert ctx["labels"] == ["kitchen", "water"] and ctx["notes"] == "Rinse under warm water"
    assert ctx["area_id"] == area.id and ctx["area_name"] == "Kitchen" and ctx["ha_device_id"] == "dev-42"
    assert ctx["task_type"] == "cleaning" and str(ctx["schedule_type"]) in ("sensor_based", str(ScheduleType.SENSOR_BASED)) and ctx["priority"] == "high"
    assert ctx["task_ref"] == "8.3" and ctx["object_ref"] == "8" and ctx["object_id"]
    assert ctx["documentation_url"] == "https://example.com/manual" and ctx["interval_days"]
    assert ctx["last_performed"] == (dt_util.now().date() - timedelta(days=40)).isoformat()
    assert ctx["trigger_entity_id"] == "sensor.flow"
    assert ctx["sensor_entity_id"] and ctx["sensor_entity_id"].startswith("sensor.") and hass.states.get(ctx["sensor_entity_id"]) is not None
    # A task without notes / labels / trigger reports null and [] - not KeyError.
    ctx2 = notification_context(hass, KIND_STATUS, status="due_soon", entry_id=obj.entry_id, task_id=TASK_ID_2, task_name="Salt", object_name="Dishwasher")
    assert ctx2["labels"] == ["kitchen"] and ctx2["notes"] is None and ctx2["trigger_entity_id"] is None and ctx2["priority"] == "normal"


async def test_bundle_tasks_carry_the_per_task_facts(hass: HomeAssistant) -> None:
    g = _global(hass)
    obj = _object(hass)
    await setup_integration(hass, g, obj)
    ctx = notification_context(hass, KIND_BUNDLE, entry_id=obj.entry_id, object_name="Dishwasher", tasks=[{"task_id": TASK_ID_1, "task_name": "Filter", "status": "overdue"}, {"task_id": TASK_ID_2, "task_name": "Salt", "status": "due_soon"}])
    first, second = ctx["tasks"]
    assert first["task_name"] == "Filter" and first["status"] == "overdue", "the caller's fields win"
    assert first["labels"] == ["kitchen", "water"] and first["notes"] == "Rinse under warm water" and first["task_ref"] == "8.3" and first["priority"] == "high"
    assert second["labels"] == ["kitchen"] and second["task_ref"] == "8.4"
    assert ctx["labels"] == [] and ctx["task_id"] is None, "the bundle itself is object-level"


async def test_kinds_without_a_task_have_the_fields_present_but_empty(hass: HomeAssistant) -> None:
    _global(hass)
    ctx = notification_context(hass, KIND_TEST)
    for key in ("labels", "tasks"):
        assert ctx[key] == []
    for key in ("notes", "area_name", "task_type", "last_performed", "sensor_entity_id", "trigger_entity_id", "object_id"):
        assert ctx[key] is None


async def test_settings_test_send_fills_sample_values(hass: HomeAssistant, hass_ws_client: Any) -> None:
    g = _global(hass)
    await setup_integration(hass, g)
    hass.services.async_register("notify", "test", AsyncMock())
    events: list[Event] = []
    hass.bus.async_listen(EVENT_NOTIFICATION, events.append)
    client = await hass_ws_client(hass)
    await client.send_json({"id": 1, "type": "maintenance_supporter/global/test_notification"})
    res = await client.receive_json()
    assert res["success"], res
    await hass.async_block_till_done()
    assert events, "the test send fires the event"
    d = events[-1].data
    assert d["kind"] == KIND_TEST and d["labels"] == ["sample"] and d["notes"] == "Sample note" and d["area_name"] == "Sample area"
    assert d["task_name"] == "Sample task" and d["days_until_due"] == 3 and d["priority"] == "normal"


async def test_sample_context_fills_every_field_of_the_real_contract(hass: HomeAssistant) -> None:
    """The Settings test send is a template author's only preview: its
    sample must carry the SAME keys a real task-bound context does, each
    with a value (a field added to the contract without a sample would
    render as empty in the preview and surprise on the first real reminder)."""
    from custom_components.maintenance_supporter.helpers.notify_hooks import sample_notification_context

    g = _global(hass)
    obj = _object(hass)
    await setup_integration(hass, g, obj)
    real = notification_context(hass, KIND_STATUS, status="overdue", entry_id=obj.entry_id, task_id=TASK_ID_1, task_name="Filter", object_name="Dishwasher", days_until_due=-3, next_due="2026-09-09", responsible_user_id="u1")
    sample = sample_notification_context(hass)
    assert set(sample) == set(real), f"sample-only {sorted(set(sample) - set(real))} / missing samples {sorted(set(real) - set(sample))}"
    assert all(v is not None for v in sample.values()), {k for k, v in sample.items() if v is None}
    assert sample["kind"] == KIND_TEST and sample["labels"] == ["sample"] and sample["notes"] == "Sample note" and sample["area_name"] == "Sample area"


# ─── the documented field table is the code ─────────────────────────────────

_KIND_EXTRAS = {
    "completed": {"reason", "completed_by", "completed_by_name", "completed_at"},
    "digest": {"overdue", "due_soon"},
    "warranty": {"names", "days"},
    "budget": {"period", "spent", "budget", "percent"},
}
_DISPATCHER_ADDS = {"category", "target", "title", "message", "data"}


async def test_event_field_table_matches_the_code(hass: HomeAssistant) -> None:
    arch = _ROOT / "docs" / "ARCHITECTURE.md"
    if not arch.exists():
        pytest.skip("docs/ not mounted in this environment (enforced in CI)")
    text = arch.read_text(encoding="utf-8")
    section = text.split("### Notification event fields", 1)[1].split("\n---", 1)[0]
    documented: set[str] = set()
    for line in section.splitlines():
        if not line.startswith("| `"):
            continue
        cell = line.split("|")[1]
        documented.update(re.findall(r"`([a-z_]+)`", cell))
    g = _global(hass)
    obj = _object(hass)
    await setup_integration(hass, g, obj)
    produced = set(notification_context(hass, KIND_STATUS, status="overdue", entry_id=obj.entry_id, task_id=TASK_ID_1, task_name="Filter", object_name="Dishwasher"))
    produced |= _DISPATCHER_ADDS
    for extras in _KIND_EXTRAS.values():
        produced |= extras
    assert documented == produced, f"docs-only {sorted(documented - produced)} / code-only {sorted(produced - documented)}"
    # And the kind-specific extras are what the manager really sends.
    nm_src = (_ROOT / "custom_components" / "maintenance_supporter" / "helpers" / "notification_manager.py").read_text(encoding="utf-8")
    for extras in _KIND_EXTRAS.values():
        for key in extras:
            assert re.search(rf"\b{key}=", nm_src), f"{key} is documented but the manager never passes it"
    assert hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY] is not None
