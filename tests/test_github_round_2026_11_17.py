"""GitHub issues answered 2026-11-17.

#274: a task on a weekdays / nth-weekday / day-of-month / calendar schedule
showed its days left in the task list but no bar under them: the bar ran over
the task's interval, and those schedules have none. The task summary now
carries one cycle of them (``cycle_days``), the same length that caps their
warning window, and the panel runs the bar over it.

#265 (stage 2): a part ordered by e-mail brings the lines of its order, so
the panel can put several ticked parts into one e-mail.

#276 (signature drift): Generac names its sensors with has_entity_name since
2026-10-28, so a new install's run-time sensor is ``<device name>_run_time``;
an existing one keeps ``generac_<device_id>_run_time``. Both are offered the
oil service.

Sensor cleaning (2.124.1): Roborock and Xiaomi Miio count the sensors'
30-hour cycle down, and "Clean Sensors" opened at the catalog's default 24
hours left, after 6 hours of cleaning. It now opens at 6 hours left
(tests/test_catalog_heal.py heals the adopted triggers).
"""

from __future__ import annotations

from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_PARTS, DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.helpers.integration_signatures import discover_integration_setups
from custom_components.maintenance_supporter.helpers.parts import normalize_part, order_mail_url
from custom_components.maintenance_supporter.helpers.schedule import Schedule
from custom_components.maintenance_supporter.websocket import _build_object_response, _build_task_summary

from .conftest import build_global_entry_data, build_object_data, build_object_entry_data, setup_integration


def _global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        domain=DOMAIN, title="Maintenance Supporter", data=build_global_entry_data(), unique_id=GLOBAL_UNIQUE_ID
    )
    entry.add_to_hass(hass)
    return entry


# ─── #274: one cycle of a calendar schedule ──────────────────────────────


@pytest.mark.parametrize(
    ("schedule", "days"),
    [
        ({"kind": "weekdays", "weekdays": [0, 3]}, 3),  # Monday to Thursday
        ({"kind": "nth_weekday", "nth": 1, "weekday": 5}, 30),
        ({"kind": "day_of_month", "day": 15}, 30),
        ({"kind": "day_of_month", "day": -1, "months": [3, 9]}, 182),  # twice a year
        ({"kind": "nth_weekday", "nth": -1, "weekday": 0, "months": [9]}, 365),  # once a year
        ({"kind": "calendar", "entity_id": "calendar.bins"}, 7),  # no events known yet
    ],
)
async def test_a_calendar_schedule_brings_its_cycle(hass: HomeAssistant, schedule: dict[str, Any], days: int) -> None:
    task = {"id": "t", "name": "Calendar task", "schedule": schedule}
    summary = _build_task_summary(hass, "t", task, None)
    assert summary["cycle_days"] == days
    # The length the warning window is capped by, not a second measure.
    assert summary["cycle_days"] == Schedule.parse(task).span_days()


@pytest.mark.parametrize(
    "task",
    [
        {"schedule": {"kind": "interval", "every": 2, "unit": "weeks"}},  # the bar runs over the interval
        {"schedule_type": "time_based", "interval_days": 30},  # a flat (old) task
        {"schedule": {"kind": "manual"}},
        {"schedule": {"kind": "one_time", "due_date": "2026-12-01"}},
        # A sensor task shows its trigger's progress, with any schedule.
        {
            "schedule": {"kind": "day_of_month", "day": 1},
            "trigger_config": {"type": "threshold", "entity_id": "sensor.salt", "trigger_below": 10},
        },
    ],
)
async def test_no_cycle_where_the_bar_has_another_measure(hass: HomeAssistant, task: dict[str, Any]) -> None:
    summary = _build_task_summary(hass, "t", {"id": "t", "name": "Other", **task}, None)
    assert summary["cycle_days"] is None


# ─── #265: the lines of an e-mail order ──────────────────────────────────


async def test_a_part_ordered_by_e_mail_brings_its_order_lines(hass: HomeAssistant) -> None:
    mail = normalize_part(
        {
            "id": "p1",
            "name": "Oil filter",
            "vendor": "ACME",
            "mpn": "OF-12",
            "restock_quantity": 2,
            "product_url": "mailto:parts@supplier.example",
        }
    )
    web = normalize_part({"id": "p2", "name": "Belt", "product_url": "https://shop.example/belt"})
    none = normalize_part({"id": "p3", "name": "Grease"})
    data = build_object_entry_data(object_data=build_object_data(name="Generator"), tasks={})
    data[CONF_PARTS] = {"p1": mail, "p2": web, "p3": none}
    entry = MockConfigEntry(domain=DOMAIN, title="Generator", data=data, unique_id="maintenance_supporter_gen265")
    entry.add_to_hass(hass)
    await setup_integration(hass, _global_entry(hass), entry)

    parts = {p["id"]: p for p in _build_object_response(hass, entry, None)["parts"]}
    assert parts["p1"]["order_lines"] == ["2× Oil filter", "ACME · MPN: OF-12"]
    # The same lines as the one-part e-mail behind the part's name.
    assert parts["p1"]["shopping_url"] == order_mail_url(mail)
    assert "2%C3%97%20Oil%20filter%0AACME" in parts["p1"]["shopping_url"]
    assert parts["p2"]["order_lines"] is None
    assert parts["p3"]["order_lines"] is None


# ─── #276: Generac's run-time sensor under both namings ──────────────────


@pytest.mark.parametrize(
    "object_id",
    [
        "home_generator_run_time",  # has_entity_name: device name + "Run Time"
        "generac_gen1_run_time",  # the technical name an existing install keeps
    ],
)
async def test_generac_run_time_under_either_name(hass: HomeAssistant, object_id: str) -> None:
    await setup_integration(hass, _global_entry(hass))
    source = MockConfigEntry(domain="generac", title="generac")
    source.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=source.entry_id, identifiers={("generac", "gen1")}, name="Home Generator"
    )
    ent_reg = er.async_get(hass)
    for oid, state in ((object_id, "31"), (object_id.replace("run_time", "protection_time"), "56184")):
        entry = ent_reg.async_get_or_create(
            "sensor", "generac", f"gen1_{oid}", config_entry=source, device_id=device.id, suggested_object_id=oid
        )
        hass.states.async_set(entry.entity_id, state, {"unit_of_measurement": "h"})

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}
    (task,) = setups[device.id]["tasks"]
    assert task["task_name"] == "Oil Service"
    assert task["entity_ids"] == [f"sensor.{object_id}"]  # not the protection time


# ─── Sensor cleaning on Roborock and Xiaomi Miio: a 30-hour cycle ────────


@pytest.mark.parametrize(
    ("platform", "key", "unit", "state", "threshold"),
    [
        ("roborock", "sensor_time_left", "h", "29.5", 6.0),  # python-roborock: 108000 s
        ("xiaomi_miio", "sensor_dirty_left", "s", "100800", 21600.0),  # python-miio: 30 h, HA in seconds
    ],
)
async def test_sensor_cleaning_opens_six_hours_before_the_count_runs_out(
    hass: HomeAssistant, platform: str, key: str, unit: str, state: str, threshold: float
) -> None:
    """The duty opened at the catalog's default 24 hours left, after 6 hours
    of a 30-hour cycle."""
    await setup_integration(hass, _global_entry(hass))
    source = MockConfigEntry(domain=platform, title=platform)
    source.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(config_entry_id=source.entry_id, identifiers={(platform, "v1")}, name="Robot")
    entry = er.async_get(hass).async_get_or_create(
        "sensor", platform, f"v1_{key}", config_entry=source, device_id=device.id, translation_key=key, suggested_object_id=f"robot_{key}"
    )
    hass.states.async_set(entry.entity_id, state, {"unit_of_measurement": unit})

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}
    (task,) = [t for t in setups[device.id]["tasks"] if t["task_name"] == "Clean Sensors"]
    assert task["direction"] == "duration_left"
    assert task["threshold"] == threshold
