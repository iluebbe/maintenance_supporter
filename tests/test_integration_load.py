"""Integration load smoke test — verifies the integration loads without errors."""
import logging

from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from tests.conftest import (
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)


async def test_integration_loads_without_errors(
    hass: HomeAssistant,
) -> None:
    """Smoke test: integration loads successfully."""
    global_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)

    task = build_task_data(last_performed="2024-06-01")
    object_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Test Object",
        data=build_object_entry_data(
            object_data=build_object_data(name="Test Object", manufacturer="TestCo", serial_number="SN-001"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_load_test",
    )
    object_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, object_entry)

    assert global_entry.state == ConfigEntryState.LOADED
    assert object_entry.state in (ConfigEntryState.LOADED, ConfigEntryState.SETUP_RETRY)


async def test_integration_creates_entities(
    hass: HomeAssistant,
) -> None:
    """Verify sensor + binary_sensor + calendar entities are created."""
    global_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)

    task = build_task_data(name="Oil Change", task_type="service", last_performed="2024-06-01")
    object_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Car",
        data=build_object_entry_data(
            object_data=build_object_data(name="Car"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_entity_test",
    )
    object_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, object_entry)

    # Sensor entity
    sensor = hass.states.get("sensor.car_oil_change")
    assert sensor is not None, "Sensor entity not created"
    assert sensor.state in ("ok", "due_soon", "overdue")

    # Binary sensor entity
    binary = hass.states.get("binary_sensor.car_oil_change_overdue")
    assert binary is not None, "Binary sensor entity not created"

    # Calendar entity
    calendar = hass.states.get("calendar.maintenance_schedule")
    assert calendar is not None, "Calendar entity not created"


async def test_integration_unloads_cleanly(
    hass: HomeAssistant,
) -> None:
    """Verify integration unloads without errors."""
    global_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)

    object_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Unload Test",
        data=build_object_entry_data(
            object_data=build_object_data(name="Unload Test"),
            tasks={TASK_ID_1: build_task_data(last_performed="2024-06-01")},
        ),
        source="user",
        unique_id="maintenance_supporter_unload_test",
    )
    object_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, object_entry)

    assert object_entry.state == ConfigEntryState.LOADED

    await hass.config_entries.async_unload(object_entry.entry_id)
    await hass.async_block_till_done()

    assert object_entry.state == ConfigEntryState.NOT_LOADED
