"""Household member avatars: initials + colour per HA user (#169 follow-up).

Task lists show the responsible person as an avatar. Covers the defaults
(initials from the name, a stable palette colour per user id), the
``member_display`` setting's sanitiser (initials capped, palette-only
colours, empty entries dropped, an empty map clearing every override), the
``users/list`` enrichment every caller gets, and that the setting stays out
of the portable settings export (user ids are instance-bound).
"""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_MEMBER_DISPLAY,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.helpers.member_display import (
    AVATAR_PALETTE,
    default_color,
    default_initials,
    member_display,
    sanitize_member_display,
)
from custom_components.maintenance_supporter.websocket.dashboard import (
    ws_get_settings,
    ws_update_global_settings,
)
from custom_components.maintenance_supporter.websocket.users import ws_list_users

from .conftest import (
    build_global_entry_data,
    call_ws_handler,
    make_ws_connection as _conn,
    setup_integration,
)


def test_default_initials_follow_first_and_last_word() -> None:
    assert default_initials("Maximiliane Schneider-Hoffmann") == "MS"
    assert default_initials("Dev") == "D"
    assert default_initials("  anna   maria  lopez ") == "AL"
    assert default_initials("山田 太郎") == "山太"
    assert default_initials("") == "?"
    assert default_initials(None) == "?"


def test_default_color_is_stable_and_from_the_palette() -> None:
    assert default_color("abc") == default_color("abc")
    assert default_color("abc") in AVATAR_PALETTE
    # Twelve colours: a handful of ids spread over more than one of them.
    assert len({default_color(f"user-{i}") for i in range(30)}) > 3
    assert len(AVATAR_PALETTE) == 12 and len(set(AVATAR_PALETTE)) == 12


def test_sanitize_caps_initials_restricts_colours_and_drops_empties() -> None:
    cleaned = sanitize_member_display(
        {
            "u1": {"initials": "  maxi ", "color": AVATAR_PALETTE[3].upper()},
            "u2": {"initials": "", "color": "#123456"},  # nothing valid → dropped
            "u3": {"color": AVATAR_PALETTE[0]},
            "u4": "not a mapping",
            "": {"initials": "X"},
            "u5": {"initials": "  "},
        }
    )
    assert cleaned == {
        "u1": {"initials": "max", "color": AVATAR_PALETTE[3]},
        "u3": {"color": AVATAR_PALETTE[0]},
    }
    assert sanitize_member_display("nope") == {} and sanitize_member_display(None) == {}


def test_member_display_merges_override_over_default() -> None:
    options = {CONF_MEMBER_DISPLAY: {"u1": {"initials": "MX"}}}
    assert member_display(options, "u1", "Max Muster") == {"initials": "MX", "color": default_color("u1")}
    assert member_display(options, "u2", "Eva Klein") == {"initials": "EK", "color": default_color("u2")}
    assert member_display(None, "u2", "Eva Klein")["initials"] == "EK"


def _global(hass: HomeAssistant) -> MockConfigEntry:
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


def _user(user_id: str, name: str, *, is_admin: bool = False) -> MagicMock:
    user = MagicMock()
    user.id = user_id
    user.name = name
    user.is_admin = is_admin
    user.is_owner = False
    user.system_generated = False
    user.is_active = True
    return user


async def _settings(hass: HomeAssistant) -> dict:
    conn = _conn()
    await call_ws_handler(ws_get_settings, hass, conn, {"id": 1, "type": "maintenance_supporter/settings"})
    return conn.send_result.call_args[0][1]


async def _update(hass: HomeAssistant, settings: dict) -> dict:
    conn = _conn()
    await call_ws_handler(
        ws_update_global_settings, hass, conn, {"id": 2, "type": "maintenance_supporter/global/update", "settings": settings}
    )
    assert conn.send_result.called, conn.send_error.call_args
    return conn.send_result.call_args[0][1]


async def test_setting_round_trips_and_users_list_carries_the_avatar(hass: HomeAssistant) -> None:
    global_entry = _global(hass)
    await setup_integration(hass, global_entry)
    hass.auth.async_get_users = AsyncMock(return_value=[_user("u1", "Max Muster", is_admin=True), _user("u2", "Eva Klein")])  # type: ignore[method-assign]

    assert (await _settings(hass))["member_display"] == {}

    result = await _update(hass, {"member_display": {"u1": {"initials": "MX", "color": AVATAR_PALETTE[5]}, "u2": {"color": "#000000"}}})
    assert result["member_display"] == {"u1": {"initials": "MX", "color": AVATAR_PALETTE[5]}}
    assert global_entry.options[CONF_MEMBER_DISPLAY] == {"u1": {"initials": "MX", "color": AVATAR_PALETTE[5]}}

    conn = _conn()
    await call_ws_handler(ws_list_users, hass, conn, {"id": 3, "type": "maintenance_supporter/users/list"})
    users = {u["id"]: u for u in conn.send_result.call_args[0][1]["users"]}
    assert users["u1"]["initials"] == "MX" and users["u1"]["color"] == AVATAR_PALETTE[5]
    assert users["u2"]["initials"] == "EK" and users["u2"]["color"] == default_color("u2")

    # A non-admin caller gets the avatar too (it is display data, not governance).
    conn = _conn()
    conn.user.is_admin = False
    await call_ws_handler(ws_list_users, hass, conn, {"id": 4, "type": "maintenance_supporter/users/list"})
    users = {u["id"]: u for u in conn.send_result.call_args[0][1]["users"]}
    assert users["u1"]["initials"] == "MX" and "is_admin" not in users["u1"]

    # An empty map clears every override.
    result = await _update(hass, {"member_display": {}})
    assert result["member_display"] == {}


async def test_member_display_stays_out_of_the_settings_export(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.export import build_settings_export

    global_entry = _global(hass)
    await setup_integration(hass, global_entry)
    await _update(hass, {"member_display": {"u1": {"initials": "MX"}}})
    exported = build_settings_export(hass)
    assert "member_display" not in str(exported)


def test_palette_matches_the_frontend_helper() -> None:
    """The panel carries its own copy of the palette (helpers/person.ts) for
    the settings swatches — it must stay identical to the backend's allowlist
    or a picked colour would be rejected on save."""
    import re
    from pathlib import Path

    src = (
        Path(__file__).resolve().parent.parent
        / "custom_components"
        / "maintenance_supporter"
        / "frontend-src"
        / "helpers"
        / "person.ts"
    ).read_text(encoding="utf-8")
    block = re.search(r"AVATAR_PALETTE = \[(.*?)\] as const", src, re.S)
    assert block, "AVATAR_PALETTE missing from helpers/person.ts"
    ts_palette = tuple(re.findall(r'"(#[0-9a-f]{6})"', block.group(1)))
    assert ts_palette == AVATAR_PALETTE
