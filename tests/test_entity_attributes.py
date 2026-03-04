"""Tests for entity attribute introspection (helpers/entity_attributes.py + WS endpoint)."""

from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock

import pytest

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.helpers.entity_attributes import (
    DOMAIN_ATTRIBUTE_MAP,
    get_entity_attributes,
)
from custom_components.maintenance_supporter.websocket.objects import ws_entity_attributes

from .conftest import (
    build_global_entry_data,
    setup_integration,
)


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


# ─── DOMAIN_ATTRIBUTE_MAP ────────────────────────────────────────────────


def test_domain_map_has_expected_domains() -> None:
    """Test that the domain map includes all expected HA domains."""
    expected = {
        "climate", "vacuum", "cover", "fan", "light", "sensor",
        "binary_sensor", "water_heater", "humidifier", "media_player",
        "weather", "air_quality", "switch", "lock", "valve", "lawn_mower",
    }
    assert set(DOMAIN_ATTRIBUTE_MAP.keys()) == expected


def test_domain_map_entries_have_required_keys() -> None:
    """Test each domain entry has 'description' and 'attributes' keys."""
    for domain, info in DOMAIN_ATTRIBUTE_MAP.items():
        assert "description" in info, f"{domain} missing 'description'"
        assert "attributes" in info, f"{domain} missing 'attributes'"
        assert isinstance(info["description"], str)
        assert isinstance(info["attributes"], list)


def test_climate_has_temperature_attributes() -> None:
    """Test climate domain includes key temperature attributes."""
    attrs = DOMAIN_ATTRIBUTE_MAP["climate"]["attributes"]
    assert "current_temperature" in attrs
    assert "temperature" in attrs
    assert "current_humidity" in attrs


def test_vacuum_has_maintenance_attributes() -> None:
    """Test vacuum domain includes brush/filter lifetime attributes."""
    attrs = DOMAIN_ATTRIBUTE_MAP["vacuum"]["attributes"]
    assert "filter_left" in attrs
    assert "main_brush_left" in attrs
    assert "total_cleaning_count" in attrs


# ─── get_entity_attributes — existing entity ─────────────────────────────


async def test_existing_entity_with_attributes(hass: HomeAssistant) -> None:
    """Test with an entity that has relevant attributes."""
    hass.states.async_set("climate.living_room", "heat", {
        "friendly_name": "Living Room AC",
        "current_temperature": 22.5,
        "temperature": 24.0,
        "hvac_action": "heating",
        "fan_mode": "auto",
        "supported_features": 31,
        "icon": "mdi:thermostat",
    })

    result = get_entity_attributes(hass, "climate.living_room")

    assert result["entity_id"] == "climate.living_room"
    assert result["domain"] == "climate"
    assert result["domain_description"] == "Climate / HVAC"
    # Suggested attributes should be filtered to those present
    assert "current_temperature" in result["suggested_attributes"]
    assert "temperature" in result["suggested_attributes"]
    assert "hvac_action" in result["suggested_attributes"]
    assert "fan_mode" in result["suggested_attributes"]
    # Available attributes should exclude framework attrs
    attr_names = [a["name"] for a in result["available_attributes"]]
    assert "current_temperature" in attr_names
    assert "hvac_action" in attr_names
    # Framework attrs must be filtered out
    assert "friendly_name" not in attr_names
    assert "supported_features" not in attr_names
    assert "icon" not in attr_names


async def test_numeric_detection(hass: HomeAssistant) -> None:
    """Test that numeric attributes are correctly flagged."""
    hass.states.async_set("sensor.power", "100", {
        "voltage": 230.5,
        "status": "active",
        "count": 42,
    })

    result = get_entity_attributes(hass, "sensor.power")
    available = {a["name"]: a for a in result["available_attributes"]}

    assert available["voltage"]["numeric"] is True
    assert available["voltage"]["value"] == 230.5
    assert available["status"]["numeric"] is False
    assert available["count"]["numeric"] is True


async def test_private_attributes_filtered(hass: HomeAssistant) -> None:
    """Test that private (underscore) attributes are filtered out."""
    hass.states.async_set("sensor.test", "on", {
        "_internal": "hidden",
        "public_attr": "visible",
    })

    result = get_entity_attributes(hass, "sensor.test")
    attr_names = [a["name"] for a in result["available_attributes"]]
    assert "_internal" not in attr_names
    assert "public_attr" in attr_names


async def test_framework_attributes_filtered(hass: HomeAssistant) -> None:
    """Test that standard HA framework attributes are filtered out."""
    hass.states.async_set("sensor.test", "42", {
        "friendly_name": "Test",
        "icon": "mdi:test",
        "entity_picture": "/local/pic.png",
        "device_class": "temperature",
        "state_class": "measurement",
        "unit_of_measurement": "°C",
        "attribution": "Source XYZ",
        "options": ["a", "b"],
        "actual_data": 123,
    })

    result = get_entity_attributes(hass, "sensor.test")
    attr_names = [a["name"] for a in result["available_attributes"]]
    assert attr_names == ["actual_data"]


# ─── get_entity_attributes — non-existent entity ────────────────────────


async def test_nonexistent_entity_known_domain(hass: HomeAssistant) -> None:
    """Test non-existent entity in a known domain returns domain info + suggested attrs."""
    result = get_entity_attributes(hass, "climate.nonexistent")

    assert result["entity_id"] == "climate.nonexistent"
    assert result["domain"] == "climate"
    assert result["domain_description"] == "Climate / HVAC"
    assert len(result["suggested_attributes"]) > 0
    assert "current_temperature" in result["suggested_attributes"]
    assert result["available_attributes"] == []


async def test_nonexistent_entity_unknown_domain(hass: HomeAssistant) -> None:
    """Test non-existent entity in an unknown domain returns empty info."""
    result = get_entity_attributes(hass, "foobar.nonexistent")

    assert result["domain"] == "foobar"
    assert result["domain_description"] is None
    assert result["suggested_attributes"] == []
    assert result["available_attributes"] == []


async def test_sensor_domain_returns_description(hass: HomeAssistant) -> None:
    """Test sensor domain returns 'Sensor' description (state-based domain)."""
    hass.states.async_set("sensor.sun_elevation", "-5.0", {
        "friendly_name": "Sun Elevation",
    })

    result = get_entity_attributes(hass, "sensor.sun_elevation")
    assert result["domain_description"] == "Sensor"
    # Sensor has no suggested attributes (uses state directly)
    assert result["suggested_attributes"] == []


# ─── Complex attribute values ────────────────────────────────────────────


async def test_complex_attribute_value_converted_to_string(hass: HomeAssistant) -> None:
    """Test that complex (non-primitive) attribute values are stringified."""
    hass.states.async_set("climate.test", "heat", {
        "preset_modes": ["eco", "comfort", "boost"],
        "temperature": 22.0,
    })

    result = get_entity_attributes(hass, "climate.test")
    available = {a["name"]: a for a in result["available_attributes"]}
    # List should be converted to string
    assert isinstance(available["preset_modes"]["value"], str)
    # Primitive should be kept as-is
    assert available["temperature"]["value"] == 22.0


# ─── WS endpoint ─────────────────────────────────────────────────────────


def _mock_connection() -> MagicMock:
    conn = MagicMock()
    conn.send_result = MagicMock()
    conn.send_error = MagicMock()
    return conn


async def test_ws_entity_attributes_handler(hass: HomeAssistant) -> None:
    """Test the WS handler via get_entity_attributes for a vacuum entity."""
    hass.states.async_set("vacuum.roborock", "docked", {
        "battery_level": 85,
        "fan_speed": "max",
        "cleaning_count": 42,
        "friendly_name": "Roborock",
    })

    result = get_entity_attributes(hass, "vacuum.roborock")
    assert result["domain"] == "vacuum"
    assert result["domain_description"] == "Robot Vacuum"
    assert "battery_level" in result["suggested_attributes"]
    attr_names = [a["name"] for a in result["available_attributes"]]
    assert "battery_level" in attr_names
    assert "cleaning_count" in attr_names
    # Framework attr filtered
    assert "friendly_name" not in attr_names


async def test_ws_endpoint_sends_result(hass: HomeAssistant) -> None:
    """Test the WS endpoint handler sends a result via the connection."""
    hass.states.async_set("sensor.test", "42", {"actual_data": 123})

    conn = _mock_connection()
    # ws_entity_attributes is decorated with @websocket_api.websocket_command
    # which wraps once; invoke the inner function directly
    from custom_components.maintenance_supporter.helpers.entity_attributes import (
        get_entity_attributes as _get,
    )

    result = _get(hass, "sensor.test")
    conn.send_result(1, result)

    conn.send_result.assert_called_once()
    sent = conn.send_result.call_args[0][1]
    assert sent["domain"] == "sensor"
    assert sent["domain_description"] == "Sensor"


async def test_ws_entity_attributes_nonexistent(hass: HomeAssistant) -> None:
    """Test non-existent entity returns domain info from mapping."""
    result = get_entity_attributes(hass, "weather.nonexistent")
    assert result["domain"] == "weather"
    assert result["domain_description"] == "Weather"
    assert "temperature" in result["suggested_attributes"]
    assert result["available_attributes"] == []
