"""Battery fleet: one "shoppable type" predicate; the fleet task carries
``warning_days`` (DRY/drift round 2026-09-12).

Pins: ``is_shoppable_type`` (battery_lifetime) is False for rechargeables and
for the no-forecast labels (Unknown / Manual / Irreplaceable / Solar / empty);
``build_overview`` lists only shoppable types in ``needs_now`` /
``needs_soon`` — the same rule ``discover_battery_types`` mints parts by, so
the shopping list never names a type without a part behind it; the fleet
task record carries the household default ``warning_days``.
"""

from __future__ import annotations

from datetime import date

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_DEFAULT_WARNING_DAYS, CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.helpers.battery_fleet import Battery, build_overview, discover_battery_types, is_rechargeable_type
from custom_components.maintenance_supporter.helpers.battery_fleet_setup import _fleet_task, find_fleet_entry
from custom_components.maintenance_supporter.helpers.battery_lifetime import is_shoppable_type
from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup

from .conftest import build_global_entry_data, call_ws_handler, make_ws_connection, setup_integration


def _bat(name: str, btype: str, *, qty: int = 1, low: bool = False, last: date | None = None) -> Battery:
    return Battery(entity_id=f"sensor.{name}_battery_plus", device_name=name, battery_type=btype, quantity=qty, low=low, level=None, last_replaced=last)


def test_is_shoppable_type_is_the_one_predicate() -> None:
    for shoppable in ("AA", "aaa", "CR2032", "LR6", "CR123A Lithium"):
        assert is_shoppable_type(shoppable), shoppable
    for not_shoppable in ("", None, "Unknown", "UNKNOWN", "Manual", "Irreplaceable", "Solar", "Rechargeable", "Nuki Battery Pack", "Li-ion 18650"):
        assert not is_shoppable_type(not_shoppable), not_shoppable
    assert is_rechargeable_type("Akku") and not is_rechargeable_type("AA")


def test_overview_needs_lists_only_shoppable_types() -> None:
    today = date(2026, 7, 20)
    bats = [
        _bat("Lock", "AA", qty=4, low=True),
        _bat("Ghost", "", low=True),  # no type → UNKNOWN: nothing to buy
        _bat("Panel", "Solar", low=True),
        _bat("Vacuum", "Rechargeable", low=True),
        _bat("Old", "AA", qty=2, last=date(2025, 7, 10)),  # 12-month AA → soon
        _bat("OldManual", "Manual", qty=2, last=date(2024, 7, 10)),
    ]
    ov = build_overview(bats, today=today, horizon_days=28)
    assert ov.low_count == 4, "low tracking itself is untouched"
    assert dict(ov.needs_now) == {"AA": 4}
    assert dict(ov.needs_soon) == {"AA": 2}


async def test_discover_and_overview_agree_on_the_fleet(hass: HomeAssistant) -> None:
    for name, btype in (("lock", "AA"), ("ghost", ""), ("panel", "Solar"), ("vac", "Rechargeable"), ("cell", "CR2032")):
        hass.states.async_set(f"sensor.{name}_battery_plus", "8", {"device_class": "battery", "battery_type": btype, "battery_quantity": 1, "battery_low": True, "device_name": name})
    types = set(discover_battery_types(hass))
    assert types == {"AA", "CR2032"}
    from custom_components.maintenance_supporter.helpers.battery_fleet import read_batteries

    ov = build_overview(read_batteries(hass), today=date(2026, 7, 20))
    assert set(ov.needs_now) <= types, "every type on the shopping list has a part behind it"


async def test_fleet_task_carries_the_household_warning_days(hass: HomeAssistant) -> None:
    data = build_global_entry_data(warning_days=11)
    data[CONF_DEFAULT_WARNING_DAYS] = 11
    g = MockConfigEntry(domain=DOMAIN, data=data, unique_id=GLOBAL_UNIQUE_ID)
    g.add_to_hass(hass)
    await setup_integration(hass, g)
    hass.states.async_set("sensor.lock_battery_plus", "8", {"device_class": "battery", "battery_type": "AA", "battery_quantity": 2, "battery_low": True, "device_name": "lock"})
    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    assert not conn.send_error.called, conn.send_error.call_args
    entry = find_fleet_entry(hass)
    assert entry is not None
    (task,) = entry.data[CONF_TASKS].values()
    assert task["warning_days"] == 11
    assert _fleet_task("obj", "en", warning_days=3)["warning_days"] == 3
