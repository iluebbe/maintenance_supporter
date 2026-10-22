"""#228: a sensor trigger may name an attribute of its entity whose value says
what the triggered task is about (which medicine runs low). Pins:

- the value as text: lists, mappings, numbers, whitespace, the length cap,
  several entities named after themselves, a compound trigger's entities
- the WS validator keeps it as a name, clears an empty one, refuses others
- the task list shows it only while the trigger is active, the to-do list
  carries it as the item's description
- a triggered reminder ends with it (also in a bundle), and the
  notification event has it as ``trigger_detail``
"""

from __future__ import annotations

from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_MAX_NOTIFICATIONS_PER_DAY,
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_SERVICE,
    CONF_NOTIFY_TRIGGERED_INTERVAL,
    CONF_QUIET_HOURS_ENABLED,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceStatus,
)
from custom_components.maintenance_supporter.helpers.notification_manager import NotificationManager
from custom_components.maintenance_supporter.helpers.trigger_detail import (
    MAX_DETAIL_LENGTH,
    format_attribute_value,
    trigger_detail,
)
from custom_components.maintenance_supporter.websocket.tasks_validation import _validate_trigger_config

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_task_data,
    make_object_entry,
    setup_integration,
)

LOW = ["Trulicity: 3 left"]


def _pills(hass: HomeAssistant, low: Any = LOW, count: str = "3", entity: str = "sensor.pills") -> None:
    hass.states.async_set(entity, count, {"low": low, "friendly_name": entity.split(".")[1].title()})


def _tc(**extra: Any) -> dict[str, Any]:
    return {"type": "threshold", "entity_id": "sensor.pills", "entity_ids": ["sensor.pills"], "trigger_below": 5, **extra}


# ─── the value as text ──────────────────────────────────────────────────────


def test_attribute_values_read_as_one_line() -> None:
    assert format_attribute_value(["Trulicity: 3 left", None, "", "Ozempic: 1 left"]) == "Trulicity: 3 left, Ozempic: 1 left"
    assert format_attribute_value({"Trulicity": 3, "Ozempic": None}) == "Trulicity: 3"
    assert format_attribute_value(2.50) == "2.5"
    assert format_attribute_value(7) == "7"
    assert format_attribute_value(True) == "yes"
    assert format_attribute_value("  two\n  lines ") == "two lines"
    for nothing in (None, "", "   ", [], {}, [None, ""]):
        assert format_attribute_value(nothing) is None


async def test_the_detail_of_one_or_several_entities(hass: HomeAssistant) -> None:
    _pills(hass)
    assert trigger_detail(hass, _tc(detail_attribute="low")) == "Trulicity: 3 left"
    assert trigger_detail(hass, _tc()) is None, "no detail attribute named"
    assert trigger_detail(hass, _tc(detail_attribute="missing")) is None
    assert trigger_detail(hass, None) is None

    _pills(hass, ["Ozempic: 1 left"], entity="sensor.cabinet")
    hass.states.async_set("sensor.other", "1", {})
    two = _tc(detail_attribute="low", entity_ids=["sensor.pills", "sensor.cabinet", "sensor.other"])
    assert trigger_detail(hass, two) == "Pills: Trulicity: 3 left · Cabinet: Ozempic: 1 left", "each named after its entity"

    compound = {
        "type": "compound",
        "compound_logic": "OR",
        "detail_attribute": "low",
        "conditions": [_tc(), {**_tc(), "entity_id": "sensor.cabinet", "entity_ids": ["sensor.cabinet"]}],
    }
    assert trigger_detail(hass, compound) == "Pills: Trulicity: 3 left · Cabinet: Ozempic: 1 left"

    _pills(hass, ["x" * 500])
    text = trigger_detail(hass, _tc(detail_attribute="low"))
    assert text is not None and len(text) == MAX_DETAIL_LENGTH and text.endswith("…")


# ─── the validator ──────────────────────────────────────────────────────────


def test_the_validator_keeps_a_name_and_clears_an_empty_one() -> None:
    hass = MagicMock()
    hass.states.get.return_value = None
    tc = _tc(detail_attribute="  low ")
    errors, _ = _validate_trigger_config(hass, tc)
    assert not errors and tc["detail_attribute"] == "low"
    for empty in ("", "   ", None):
        tc = _tc(detail_attribute=empty)
        errors, _ = _validate_trigger_config(hass, tc)
        assert not errors and "detail_attribute" not in tc
    for bad in (3, ["low"], "x" * 256):
        errors, _ = _validate_trigger_config(hass, _tc(detail_attribute=bad))
        assert any("detail_attribute" in e for e in errors), bad
    compound = {"type": "compound", "detail_attribute": " low", "conditions": [_tc(), _tc()]}
    errors, _ = _validate_trigger_config(hass, compound)
    assert not errors and compound["detail_attribute"] == "low"


# ─── the task list and the to-do list ───────────────────────────────────────


async def test_shown_while_the_trigger_is_active(hass: HomeAssistant, hass_ws_client: Any) -> None:
    from .conftest import make_global_entry

    _pills(hass)
    task = build_task_data(name="Buy medicine", schedule_type="sensor_based", interval_days=None, trigger_config=_tc(detail_attribute="low"))
    obj = make_object_entry(hass, tasks={TASK_ID_1: task}, name="Medicine cabinet", uid="pills_228")
    await setup_integration(hass, make_global_entry(hass), obj)
    await hass.async_block_till_done()

    client = await hass_ws_client(hass)

    async def summary() -> dict[str, Any]:
        await client.send_json_auto_id({"type": "maintenance_supporter/objects"})
        res = await client.receive_json()
        o = next(x for x in res["result"]["objects"] if x["entry_id"] == obj.entry_id)
        return o["tasks"][0]

    t = await summary()
    assert t["trigger_active"] is True
    assert t["trigger_detail"] == "Trulicity: 3 left"
    assert t["trigger_config"]["detail_attribute"] == "low", "the setting itself rides along (#50)"

    todo = hass.data[DOMAIN]["_todo_entity"]
    item = next(i for i in todo.todo_items if i.summary == "Medicine cabinet: Buy medicine")
    assert item.description == "Trulicity: 3 left"

    # Restocked: the trigger clears, and the detail goes with it.
    hass.states.async_set("sensor.pills", "30", {"low": [], "friendly_name": "Pills"})
    await hass.async_block_till_done()
    t = await summary()
    assert t["trigger_active"] is False
    assert t["trigger_detail"] is None
    item = next(i for i in todo.todo_items if i.summary == "Medicine cabinet: Buy medicine")
    assert item.description is None


# ─── the reminder ───────────────────────────────────────────────────────────


def _notify_global(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Maintenance Supporter",
        data=build_global_entry_data(notifications_enabled=True, notify_service="notify.mobile_app"),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
        options={
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "notify.mobile_app",
            CONF_NOTIFY_TRIGGERED_INTERVAL: 0,
            CONF_MAX_NOTIFICATIONS_PER_DAY: 0,
            CONF_QUIET_HOURS_ENABLED: False,
        },
    )
    entry.add_to_hass(hass)
    return entry


async def test_a_triggered_reminder_ends_with_the_detail(hass: HomeAssistant) -> None:
    _notify_global(hass)
    _pills(hass)
    nm = NotificationManager(hass)
    sent = AsyncMock(return_value=True)
    patch.object(nm, "_resolve_and_send", sent).start()
    await nm.async_load()
    task_data = {"priority": "normal", "notify_enabled": True, "trigger_config": _tc(detail_attribute="low")}

    await nm.async_task_status_changed(
        entry_id="e1", task_id="t1", task_name="Buy medicine", object_name="Medicine cabinet",
        new_status=MaintenanceStatus.TRIGGERED, task_data=task_data,
    )
    message = sent.await_args.kwargs["message"]
    assert message.endswith("\nTrulicity: 3 left"), message
    assert message.startswith("Buy medicine for Medicine cabinet")

    # Overdue is no trigger's doing: no detail.
    await nm.async_task_status_changed(
        entry_id="e1", task_id="t2", task_name="Buy medicine", object_name="Medicine cabinet",
        new_status=MaintenanceStatus.OVERDUE, days_until_due=-2, task_data=task_data,
    )
    assert "Trulicity" not in sent.await_args.kwargs["message"]


async def test_a_bundle_line_and_the_event_carry_it(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.notification_manager import _bundled_line
    from custom_components.maintenance_supporter.helpers.notify_hooks import KIND_STATUS, notification_context

    assert _bundled_line(MaintenanceStatus.TRIGGERED, "en", "Buy medicine", "Trulicity: 3 left") == "Buy medicine (triggered) · Trulicity: 3 left"
    assert _bundled_line(MaintenanceStatus.TRIGGERED, "en", "Buy medicine") == "Buy medicine (triggered)"

    _pills(hass)
    obj = make_object_entry(
        hass,
        tasks={TASK_ID_1: build_task_data(name="Buy medicine", schedule_type="sensor_based", interval_days=None, trigger_config=_tc(detail_attribute="low"))},
        name="Medicine cabinet",
        uid="pills_228_ctx",
    )
    ctx = notification_context(hass, KIND_STATUS, status="triggered", entry_id=obj.entry_id, task_id=TASK_ID_1)
    assert ctx["trigger_detail"] == "Trulicity: 3 left"
    plain = make_object_entry(hass, tasks={TASK_ID_1: build_task_data(name="Filter")}, name="Pool", uid="pool_228_ctx")
    assert notification_context(hass, KIND_STATUS, status="due_soon", entry_id=plain.entry_id, task_id=TASK_ID_1)["trigger_detail"] is None

    nm = NotificationManager(hass)
    assert nm._trigger_detail(MaintenanceStatus.TRIGGERED, obj.entry_id, TASK_ID_1) == "Trulicity: 3 left"
    assert nm._trigger_detail(MaintenanceStatus.DUE_SOON, obj.entry_id, TASK_ID_1) is None
