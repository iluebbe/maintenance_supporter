"""Row-action style setting + one-time "new look" notice (#145).

Task rows show Complete / Skip as HA buttons now. The style is a global
setting (buttons_compact | buttons | icons); existing installs are told once
via a panel banner that can switch back to icons. These pin the migration
that raises the notice, the fresh-install path that does not, the enum guard
on global/update and the settings payload.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter import async_migrate_entry
from custom_components.maintenance_supporter.const import (
    CONF_ADVANCED_BETA_EDITOR,
    CONF_ROW_ACTION_NOTICE,
    CONF_ROW_ACTION_STYLE,
    CONF_TASKS,
    DEFAULT_ROW_ACTION_STYLE,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    ROW_ACTION_STYLES,
)
from custom_components.maintenance_supporter.helpers.settings_registry import shown_row_action_style
from custom_components.maintenance_supporter.websocket.dashboard import (
    ws_get_settings,
    ws_update_global_settings,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_global_entry,
    make_ws_connection,
    setup_integration,
)


def _global(minor: int) -> MockConfigEntry:
    return make_global_entry(None, minor_version=minor)


async def test_existing_install_gets_the_notice_on_migration(hass: HomeAssistant) -> None:
    """A hub entry below minor 6 is an existing install: the migration raises
    the notice flag (and only that) and lands on minor 6."""
    entry = _global(5)
    entry.add_to_hass(hass)
    assert await async_migrate_entry(hass, entry) is True
    refreshed = hass.config_entries.async_get_entry(entry.entry_id)
    assert refreshed is not None
    assert refreshed.minor_version == 6
    assert refreshed.options[CONF_ROW_ACTION_NOTICE] is True
    # The style itself is NOT written: the default applies until the user chooses.
    assert CONF_ROW_ACTION_STYLE not in refreshed.options


async def test_object_entries_never_carry_the_notice(hass: HomeAssistant) -> None:
    entry = MockConfigEntry(
        version=1, minor_version=5, domain=DOMAIN, title="Pool Pump",
        data=build_object_entry_data(tasks={TASK_ID_1: build_task_data()}),
        source="user", unique_id="maintenance_supporter_ras_obj",
    )
    entry.add_to_hass(hass)
    assert await async_migrate_entry(hass, entry) is True
    refreshed = hass.config_entries.async_get_entry(entry.entry_id)
    assert refreshed is not None
    assert refreshed.minor_version == 6
    assert CONF_ROW_ACTION_NOTICE not in refreshed.options
    assert TASK_ID_1 in refreshed.data[CONF_TASKS]


async def test_fresh_install_has_no_notice(hass: HomeAssistant) -> None:
    """A hub entry created at the current minor is untouched by the migration."""
    entry = _global(6)
    entry.add_to_hass(hass)
    assert await async_migrate_entry(hass, entry) is True
    refreshed = hass.config_entries.async_get_entry(entry.entry_id)
    assert refreshed is not None
    assert CONF_ROW_ACTION_NOTICE not in refreshed.options
    assert refreshed.minor_version == 6


async def test_settings_expose_style_default_and_notice(hass: HomeAssistant) -> None:
    entry = _global(6)
    entry.add_to_hass(hass)
    await setup_integration(hass, entry)
    conn = make_ws_connection()
    await call_ws_handler(ws_get_settings, hass, conn, {"id": 1, "type": "maintenance_supporter/settings"})
    general = conn.send_result.call_args[0][1]["general"]
    assert general["row_action_style"] == DEFAULT_ROW_ACTION_STYLE == "buttons_compact"
    assert general["row_action_notice_pending"] is False
    # Nobody chose yet: the beta UI shows icons then (the panel decides).
    assert general["row_action_style_set"] is False


async def test_update_validates_the_style_and_clears_the_notice(hass: HomeAssistant) -> None:
    entry = _global(6)
    entry.add_to_hass(hass)
    hass.config_entries.async_update_entry(entry, options={CONF_ROW_ACTION_NOTICE: True})
    await setup_integration(hass, entry)

    async def update(settings: dict) -> dict:
        conn = make_ws_connection()
        await call_ws_handler(
            ws_update_global_settings, hass, conn,
            {"id": 1, "type": "maintenance_supporter/global/update", "settings": settings},
        )
        assert not conn.send_error.called, conn.send_error.call_args
        return conn.send_result.call_args[0][1]["general"]

    # The banner's "back to icons": style + notice in one write.
    general = await update({CONF_ROW_ACTION_STYLE: "icons", CONF_ROW_ACTION_NOTICE: False})
    assert general["row_action_style"] == "icons" and general["row_action_notice_pending"] is False
    assert general["row_action_style_set"] is True, "a style the household picked stays its own"
    options = hass.config_entries.async_get_entry(entry.entry_id).options
    assert options[CONF_ROW_ACTION_STYLE] == "icons" and options[CONF_ROW_ACTION_NOTICE] is False

    # An unknown style is dropped by the enum guard; with nothing valid left
    # the write is refused as invalid_input and the stored value stays.
    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_global_settings, hass, conn,
        {"id": 2, "type": "maintenance_supporter/global/update", "settings": {CONF_ROW_ACTION_STYLE: "neon"}},
    )
    assert conn.send_error.called and conn.send_error.call_args[0][1] == "invalid_input"
    assert hass.config_entries.async_get_entry(entry.entry_id).options[CONF_ROW_ACTION_STYLE] == "icons"
    for style in ROW_ACTION_STYLES:
        assert (await update({CONF_ROW_ACTION_STYLE: style}))["row_action_style"] == style


async def test_migration_carries_data_settings_into_options(hass: HomeAssistant) -> None:
    """Older installs keep their settings in entry.data with empty options;
    the notice must not mask them (every reader uses `options or data`)."""
    from custom_components.maintenance_supporter.const import CONF_DEFAULT_WARNING_DAYS

    entry = MockConfigEntry(
        version=1, minor_version=5, domain=DOMAIN, title="Maintenance Supporter",
        data=build_global_entry_data(warning_days=11), source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    assert await async_migrate_entry(hass, entry) is True
    refreshed = hass.config_entries.async_get_entry(entry.entry_id)
    assert refreshed is not None
    assert refreshed.options[CONF_ROW_ACTION_NOTICE] is True
    assert refreshed.options[CONF_DEFAULT_WARNING_DAYS] == 11


_STYLE_VECTORS = (
    Path(__file__).parent.parent
    / "custom_components"
    / "maintenance_supporter"
    / "frontend-src"
    / "__tests__"
    / "fixtures"
    / "row-action-style-vectors.json"
)


def test_the_options_flow_reads_the_style_as_the_panel_does() -> None:
    """row-actions-beta-default.test.ts checks the same vectors against the
    panel's effectiveRowActionStyle."""
    vectors = json.loads(_STYLE_VECTORS.read_text(encoding="utf-8"))["vectors"]
    assert len(vectors) > 5
    for v in vectors:
        assert shown_row_action_style(v["options"]) == v["expected"], v["note"]


async def _general_form(hass: HomeAssistant, entry_id: str) -> dict[str, Any]:
    result = await hass.config_entries.options.async_init(entry_id)
    return await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "general_settings"})


def _style_default(result: dict[str, Any]) -> str:
    marker = next(m for m in result["data_schema"].schema if str(getattr(m, "schema", m)) == CONF_ROW_ACTION_STYLE)
    return marker.default()


async def test_saving_general_keeps_the_new_look_icons(hass: HomeAssistant) -> None:
    """BI7-A1 (DRY audit 2026-11-07): the General form offered the bare
    default (compact buttons) and stored it on every save, so the new look's
    icon rows turned into buttons. It shows the style the rows have, and
    saving it unchanged keeps the style unchosen."""
    g = make_global_entry(hass)
    await setup_integration(hass, g)
    result = await _general_form(hass, g.entry_id)
    assert _style_default(result) == "icons"
    result = await hass.config_entries.options.async_configure(result["flow_id"], {})
    assert result["type"] == FlowResultType.MENU
    assert CONF_ROW_ACTION_STYLE not in g.options

    conn = make_ws_connection()
    await call_ws_handler(ws_get_settings, hass, conn, {"id": 1, "type": "maintenance_supporter/settings"})
    assert conn.send_result.call_args[0][1]["general"]["row_action_style_set"] is False

    # A real choice is stored, and the form shows it from then on.
    result = await _general_form(hass, g.entry_id)
    await hass.config_entries.options.async_configure(result["flow_id"], {CONF_ROW_ACTION_STYLE: "buttons"})
    assert g.options[CONF_ROW_ACTION_STYLE] == "buttons"
    assert _style_default(await _general_form(hass, g.entry_id)) == "buttons"


async def test_saving_general_in_the_classic_look_stores_nothing_either(hass: HomeAssistant) -> None:
    g = make_global_entry(hass, options={CONF_ADVANCED_BETA_EDITOR: False})
    await setup_integration(hass, g)
    result = await _general_form(hass, g.entry_id)
    assert _style_default(result) == DEFAULT_ROW_ACTION_STYLE
    await hass.config_entries.options.async_configure(result["flow_id"], {})
    assert CONF_ROW_ACTION_STYLE not in g.options
