"""Due-date trigger: the device reports WHEN the maintenance is due.

Some integrations keep the schedule themselves and publish the date the next
filter change falls due (Vitesy's "Filter change due" timestamp). A threshold
cannot read a date, and the date arrives without the sensor changing — so
the due_date trigger reads "days left", arms a timer for the moment the date
comes within its lead time, and clears when the device moves the date
forward (its own "filter changed" button, wired as the completion action).
"""

from __future__ import annotations

from datetime import date, datetime, timedelta
from typing import Any
from unittest.mock import AsyncMock, MagicMock

from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_fire_time_changed

from custom_components.maintenance_supporter.entity.triggers import create_trigger, create_triggers
from custom_components.maintenance_supporter.helpers.signatures import SIGNATURES, discover_integration_setups
from custom_components.maintenance_supporter.helpers.signatures._model import build_setup_trigger
from custom_components.maintenance_supporter.helpers.dates import days_until, due_instant
from custom_components.maintenance_supporter.helpers.trigger_fallback import evaluate_due_date
from custom_components.maintenance_supporter.websocket.tasks_validation import _validate_trigger_config

SENSOR = "sensor.kitchen_shelfy_filter_change_due"


def _host(hass: HomeAssistant) -> MagicMock:
    host = MagicMock()
    host.hass = hass
    host.entity_id = "sensor.shelfy_replace_filter"
    host._task_id = "task1"
    host.async_update_trigger_state = MagicMock(return_value=True)
    coordinator = AsyncMock()
    coordinator.note_trigger_edge = MagicMock()
    host.coordinator = coordinator
    return host


def _config(**extra: Any) -> dict[str, Any]:
    return {"type": "due_date", "entity_id": SENSOR, "entity_ids": [SENSOR], **extra}


def _iso(delta: timedelta) -> str:
    return (dt_util.utcnow() + delta).isoformat()


def _last_state_update(host: MagicMock) -> bool:
    return host.async_update_trigger_state.call_args.kwargs["is_triggered"]


# ─── reading a date ──────────────────────────────────────────────────────


async def test_timestamps_dates_and_objects_are_read(hass: HomeAssistant) -> None:
    aware = datetime(2026, 10, 15, 8, 30, tzinfo=dt_util.UTC)
    assert due_instant("2026-10-15T08:30:00+00:00") == aware
    assert due_instant(aware) == aware
    # A date falls due at local midnight; a naive time is local time.
    assert due_instant("2026-10-15") == dt_util.start_of_local_day(date(2026, 10, 15))
    assert due_instant(date(2026, 10, 15)) == dt_util.start_of_local_day(date(2026, 10, 15))
    naive = due_instant("2026-10-15T08:30:00")
    assert naive is not None and naive.tzinfo is not None and naive.hour == 8
    for junk in ("unknown", "", "   ", "soon", None, 5, 1.5):
        assert due_instant(junk) is None, junk


def test_days_left_turn_negative_once_the_date_passed() -> None:
    now = datetime(2026, 10, 1, tzinfo=dt_util.UTC)
    assert days_until(now + timedelta(days=3, hours=12), now) == 3.5
    assert days_until(now - timedelta(hours=6), now) == -0.25


# ─── the refresh-time fallback ───────────────────────────────────────────


async def test_the_fallback_is_active_within_the_lead_time(hass: HomeAssistant) -> None:
    now = dt_util.utcnow()
    hass.states.async_set("sensor.a", (now + timedelta(days=10)).isoformat())
    hass.states.async_set("sensor.b", (now + timedelta(days=5)).isoformat())
    hass.states.async_set("sensor.c", "unknown")

    lead_7 = evaluate_due_date(hass.states.get, _config(trigger_days_before=7), ["sensor.a", "sensor.b"], now)
    assert lead_7.active is True and lead_7.current_value == 5.0  # the soonest date
    lead_3 = evaluate_due_date(hass.states.get, _config(trigger_days_before=3), ["sensor.a", "sensor.b"], now)
    assert lead_3.active is False
    both = evaluate_due_date(hass.states.get, _config(trigger_days_before=7, entity_logic="all"), ["sensor.a", "sensor.b"], now)
    assert both.active is False
    # Nothing readable: the event-driven latch stays in charge.
    assert evaluate_due_date(hass.states.get, _config(), ["sensor.c", "sensor.missing"], now).active is None


# ─── the trigger ─────────────────────────────────────────────────────────


async def test_the_date_arriving_fires_the_trigger_without_a_state_change(
    hass: HomeAssistant, freezer: FrozenDateTimeFactory
) -> None:
    hass.states.async_set(SENSOR, _iso(timedelta(days=10)), {"device_class": "timestamp"})
    host = _host(hass)
    trigger = create_trigger(hass, host, _config(trigger_days_before=7))
    await trigger.async_setup()

    assert trigger._triggered is False
    assert trigger._current_value == 10.0

    freezer.tick(timedelta(days=2, hours=23))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert trigger._triggered is False, "still more than seven days"

    freezer.tick(timedelta(hours=2))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert trigger._triggered is True
    assert _last_state_update(host) is True
    host.coordinator.async_add_trigger_history_entry.assert_called()
    await trigger.async_teardown()


async def test_a_passed_date_fires_at_once(hass: HomeAssistant) -> None:
    hass.states.async_set(SENSOR, _iso(-timedelta(days=2)))
    trigger = create_trigger(hass, _host(hass), _config())
    await trigger.async_setup()
    assert trigger._triggered is True
    assert trigger._current_value is not None and trigger._current_value < 0
    await trigger.async_teardown()


async def test_the_device_moving_its_date_forward_completes_the_task(hass: HomeAssistant) -> None:
    """The device's own 'filter changed' button starts the next period."""
    hass.states.async_set(SENSOR, _iso(timedelta(days=1)))
    host = _host(hass)
    trigger = create_trigger(hass, host, _config(trigger_days_before=7, auto_complete_on_recovery=True))
    await trigger.async_setup()
    assert trigger._triggered is True

    hass.states.async_set(SENSOR, _iso(timedelta(days=90)))
    await hass.async_block_till_done()

    assert trigger._triggered is False
    assert _last_state_update(host) is False
    host.coordinator.async_auto_complete_on_recovery.assert_called_once()
    # The next due moment is armed again.
    assert trigger._due_timer.pending
    await trigger.async_teardown()


async def test_unreadable_states_keep_the_trigger_as_it_was(hass: HomeAssistant) -> None:
    hass.states.async_set(SENSOR, _iso(-timedelta(days=1)))
    trigger = create_trigger(hass, _host(hass), _config())
    await trigger.async_setup()
    for state in ("unavailable", "not a date"):
        hass.states.async_set(SENSOR, state)
        await hass.async_block_till_done()
        assert trigger._triggered is True, state
    await trigger.async_teardown()


async def test_an_attribute_can_carry_the_date(hass: HomeAssistant) -> None:
    hass.states.async_set("sensor.litter_box", "ready", {"next_filter_replacement": _iso(timedelta(days=2))})
    config = {"type": "due_date", "entity_id": "sensor.litter_box", "attribute": "next_filter_replacement", "trigger_days_before": 3}
    (trigger,) = create_triggers(hass, _host(hass), config)
    await trigger.async_setup()
    assert trigger._triggered is True
    await trigger.async_teardown()


async def test_teardown_cancels_the_due_timer(hass: HomeAssistant) -> None:
    hass.states.async_set(SENSOR, _iso(timedelta(days=30)))
    trigger = create_trigger(hass, _host(hass), _config())
    await trigger.async_setup()
    assert trigger._due_timer.pending
    await trigger.async_teardown()
    assert not trigger._due_timer.pending


# ─── validation ──────────────────────────────────────────────────────────


async def test_the_lead_time_is_whole_days_up_to_a_year(hass: HomeAssistant) -> None:
    hass.states.async_set(SENSOR, _iso(timedelta(days=30)))
    config = _config(trigger_days_before="7", junk=1)
    errors, _warnings = _validate_trigger_config(hass, config)
    assert errors == []
    assert config["trigger_days_before"] == 7 and "junk" not in config

    for bad in (-1, 366, 2.5, "soon"):
        errors, _ = _validate_trigger_config(hass, _config(trigger_days_before=bad))
        assert errors, bad
    # No lead time = on the date itself.
    assert _validate_trigger_config(hass, _config())[0] == []


# ─── the catalog: Vitesy ─────────────────────────────────────────────────


def test_vitesy_duties_build_due_date_triggers(hass: HomeAssistant) -> None:
    duties = {s.task_name: s for s in SIGNATURES["vitesy"].tasks}
    filt = build_setup_trigger(duties["Replace Filter"], hass, [SENSOR])
    assert filt == {
        "type": "due_date",
        "entity_id": SENSOR,
        "entity_ids": [SENSOR],
        "trigger_days_before": 7,
        "auto_complete_on_recovery": True,
    }
    assert duties["Replace Filter"].resets == (("filter_change_due", "filter_changed"),)
    fridge = build_setup_trigger(duties["Clean Refrigerator"], hass, ["sensor.kitchen_shelfy_fridge_cleaning_due"])
    assert fridge["trigger_days_before"] == 0
    assert duties["Clean Refrigerator"].resets == (("fridge_cleaning_due", "fridge_cleaned"),)


async def test_a_shelfy_is_proposed_with_its_mark_done_buttons(hass: HomeAssistant) -> None:
    entry = MockConfigEntry(domain="vitesy", title="Vitesy")
    entry.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=entry.entry_id, identifiers={("vitesy", "shelfy1")}, name="Kitchen Shelfy"
    )
    ent_reg = er.async_get(hass)
    for platform, key in (
        ("sensor", "filter_change_due"),
        ("sensor", "fridge_cleaning_due"),
        ("button", "filter_changed"),
        ("button", "fridge_cleaned"),
    ):
        created = ent_reg.async_get_or_create(
            platform,
            "vitesy",
            f"shelfy1_{key}",
            config_entry=entry,
            device_id=device.id,
            translation_key=key,
            suggested_object_id=f"kitchen_shelfy_{key}",
        )
        hass.states.async_set(created.entity_id, _iso(timedelta(days=40)) if platform == "sensor" else "unknown")

    (setup,) = [s for s in discover_integration_setups(hass) if s["device_id"] == device.id]
    by_name = {t["task_name"]: t for t in setup["tasks"]}
    assert by_name["Replace Filter"]["direction"] == "due_date"
    assert by_name["Replace Filter"]["reset"]["entity_id"] == "button.kitchen_shelfy_filter_changed"
    assert by_name["Clean Refrigerator"]["reset"]["entity_id"] == "button.kitchen_shelfy_fridge_cleaned"
