"""Template-gallery curation (v2.21): hide individual templates from pickers.

An admin unticks templates they'll never need; the panel gallery and the
config-flow picker stop offering them. The templates stay functional —
direct calls still work — they are only removed from the UI.
"""

from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_DISABLED_TEMPLATE_IDS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.websocket.dashboard import (
    ws_update_global_settings,
)
from custom_components.maintenance_supporter.websocket.io import ws_get_templates

from .conftest import make_ws_connection as _conn, build_global_entry_data, call_ws_handler, setup_integration


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry




async def test_disabled_ids_are_sanitized_and_flagged(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)

    # Unknown ids and duplicates are dropped on write.
    await call_ws_handler(
        ws_update_global_settings,
        hass,
        _conn(),
        {
            "id": 1,
            "type": "maintenance_supporter/global/update",
            "settings": {
                CONF_DISABLED_TEMPLATE_IDS: [
                    "pool_pump",
                    "does_not_exist",
                    "pool_pump",
                    "vehicle_bicycle",
                    42,
                ]
            },
        },
    )
    await hass.async_block_till_done()
    assert global_entry.options[CONF_DISABLED_TEMPLATE_IDS] == [
        "pool_pump",
        "vehicle_bicycle",
    ]

    # The templates WS returns EVERY template, flagged — the settings UI
    # needs the full list, the gallery filters client-side.
    conn = _conn()
    await call_ws_handler(
        ws_get_templates,
        hass,
        conn,
        {
            "id": 2,
            "type": "maintenance_supporter/templates",
        },
    )
    templates = conn.send_result.call_args[0][1]["templates"]
    by_id: dict[str, Any] = {t["id"]: t for t in templates}
    assert by_id["pool_pump"]["disabled"] is True
    assert by_id["vehicle_bicycle"]["disabled"] is True
    assert by_id["vehicle_car"]["disabled"] is False
    assert len(templates) == 32  # nothing removed server-side


async def test_config_flow_picker_hides_disabled_templates(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    hass.config_entries.async_update_entry(global_entry, options={CONF_DISABLED_TEMPLATE_IDS: ["pool_pump"]})

    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": "user"})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"next_step_id": "create_from_template"})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"template_category": "pool"})
    assert result["step_id"] == "template_select"
    schema = result["data_schema"].schema
    selector_cfg = next(iter(schema.values()))
    offered = [o["value"] for o in selector_cfg.config["options"]]
    assert "pool_pump" not in offered, "disabled template still offered"
    assert "pool_water" in offered  # siblings unaffected


async def test_disabled_template_still_works_when_called_directly(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Hidden ≠ broken: object/from_template with a disabled id still creates."""
    from custom_components.maintenance_supporter.websocket.objects import (
        ws_create_from_template,
    )

    await setup_integration(hass, global_entry)
    hass.config_entries.async_update_entry(global_entry, options={CONF_DISABLED_TEMPLATE_IDS: ["pool_pump"]})

    conn = _conn()
    await call_ws_handler(
        ws_create_from_template,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/object/from_template",
            "template_id": "pool_pump",
        },
    )
    await hass.async_block_till_done()
    assert conn.send_result.called
    assert conn.send_result.call_args[0][1]["entry_id"]
