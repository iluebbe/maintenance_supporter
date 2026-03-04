"""Domain-specific attribute mapping for entity introspection.

Provides a mapping of HA entity domains to their commonly relevant
attributes for maintenance trigger configuration. This helps the frontend
show a dropdown of suitable attributes instead of a free text field.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant

# Mapping of HA domains to their commonly useful attributes for triggers.
# Each entry is a dict with:
#   - "attributes": list of attribute names relevant for maintenance triggers
#   - "description": short description of what the domain represents
#
# The frontend can use this to show a dropdown of attributes when the user
# selects an entity, while still allowing manual input for unlisted attrs.
DOMAIN_ATTRIBUTE_MAP: dict[str, dict[str, Any]] = {
    "climate": {
        "description": "Climate / HVAC",
        "attributes": [
            "current_temperature",
            "temperature",
            "target_temp_high",
            "target_temp_low",
            "current_humidity",
            "humidity",
            "hvac_action",
            "fan_mode",
            "swing_mode",
            "preset_mode",
        ],
    },
    "vacuum": {
        "description": "Robot Vacuum",
        "attributes": [
            "battery_level",
            "fan_speed",
            "status",
            "cleaning_time",  # Xiaomi / Roborock
            "cleaning_area",
            "cleaning_count",
            "total_cleaning_time",  # Xiaomi / Roborock
            "total_cleaning_area",
            "total_cleaning_count",
            "filter_left",
            "side_brush_left",
            "main_brush_left",
            "sensor_dirty_left",
        ],
    },
    "cover": {
        "description": "Cover / Blind / Shutter",
        "attributes": [
            "current_position",
            "current_tilt_position",
        ],
    },
    "fan": {
        "description": "Fan",
        "attributes": [
            "percentage",
            "preset_mode",
            "oscillating",
            "direction",
        ],
    },
    "light": {
        "description": "Light",
        "attributes": [
            "brightness",
            "color_temp",
            "color_temp_kelvin",
            "hs_color",
            "rgb_color",
        ],
    },
    "sensor": {
        "description": "Sensor",
        "attributes": [],  # Sensors typically use state directly
    },
    "binary_sensor": {
        "description": "Binary Sensor",
        "attributes": [],  # Binary sensors typically use state directly
    },
    "water_heater": {
        "description": "Water Heater",
        "attributes": [
            "current_temperature",
            "temperature",
            "min_temp",
            "max_temp",
            "operation_mode",
        ],
    },
    "humidifier": {
        "description": "Humidifier / Dehumidifier",
        "attributes": [
            "humidity",
            "current_humidity",
            "min_humidity",
            "max_humidity",
            "mode",
        ],
    },
    "media_player": {
        "description": "Media Player",
        "attributes": [
            "volume_level",
            "is_volume_muted",
            "media_duration",
            "media_position",
            "source",
        ],
    },
    "weather": {
        "description": "Weather",
        "attributes": [
            "temperature",
            "humidity",
            "pressure",
            "wind_speed",
            "wind_bearing",
            "ozone",
            "visibility",
        ],
    },
    "air_quality": {
        "description": "Air Quality",
        "attributes": [
            "particulate_matter_2_5",
            "particulate_matter_10",
            "air_quality_index",
            "carbon_dioxide",
            "carbon_monoxide",
            "nitrogen_dioxide",
            "ozone",
            "sulphur_dioxide",
            "volatile_organic_compounds",
        ],
    },
    "switch": {
        "description": "Switch",
        "attributes": [
            "current_power_w",
            "today_energy_kwh",
        ],
    },
    "lock": {
        "description": "Lock",
        "attributes": [],  # Locks typically use state directly
    },
    "valve": {
        "description": "Valve",
        "attributes": [
            "current_position",
        ],
    },
    "lawn_mower": {
        "description": "Lawn Mower",
        "attributes": [
            "battery_level",
        ],
    },
}


def get_entity_attributes(
    hass: HomeAssistant, entity_id: str
) -> dict[str, Any]:
    """Get relevant attributes for an entity, combining domain mapping with live state.

    Returns a dict with:
      - domain: the entity domain
      - domain_description: human-readable domain description
      - suggested_attributes: list of attribute names from the domain mapping
      - available_attributes: list of dicts with name/value/numeric for all
        current attributes of the entity
    """
    domain = entity_id.split(".")[0] if "." in entity_id else ""
    domain_info = DOMAIN_ATTRIBUTE_MAP.get(domain, {})

    state = hass.states.get(entity_id)
    if state is None:
        return {
            "entity_id": entity_id,
            "domain": domain,
            "domain_description": domain_info.get("description"),
            "suggested_attributes": domain_info.get("attributes", []),
            "available_attributes": [],
        }

    # Build available attributes from live state
    available: list[dict[str, Any]] = []
    for attr_name, attr_value in state.attributes.items():
        # Skip internal/HA-framework attributes
        if attr_name.startswith("_") or attr_name in (
            "friendly_name",
            "icon",
            "entity_picture",
            "supported_features",
            "attribution",
            "device_class",
            "state_class",
            "unit_of_measurement",
            "options",  # select/enum options list
        ):
            continue

        is_numeric = False
        try:
            float(attr_value)
            is_numeric = True
        except (ValueError, TypeError):
            pass

        available.append({
            "name": attr_name,
            "value": attr_value if isinstance(attr_value, (str, int, float, bool, type(None))) else str(attr_value),
            "numeric": is_numeric,
        })

    # Suggested attributes: from domain mapping, filtered to those actually present
    suggested = domain_info.get("attributes", [])
    present_attr_names = {a["name"] for a in available}
    # Keep suggested order but only include present ones, plus append
    # any present numeric attrs not in the suggested list
    filtered_suggested = [a for a in suggested if a in present_attr_names]

    return {
        "entity_id": entity_id,
        "domain": domain,
        "domain_description": domain_info.get("description"),
        "suggested_attributes": filtered_suggested,
        "available_attributes": available,
    }
