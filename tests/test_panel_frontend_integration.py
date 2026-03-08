"""Integration tests for panel and frontend (card) registration lifecycle."""

from __future__ import annotations

from pathlib import Path
from unittest.mock import AsyncMock, patch

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CARD_URL,
    CONF_PANEL_ENABLED,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    PANEL_NAME,
    PANEL_URL,
)
from custom_components.maintenance_supporter.frontend import (
    DATA_EXTRA_MODULE_URL,
    async_register_card,
)

from .conftest import build_global_entry_data, setup_integration


def _make_global_entry(
    hass: HomeAssistant,
    *,
    panel_enabled: bool = False,
) -> MockConfigEntry:
    """Create a global config entry with the given panel state."""
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        options={CONF_PANEL_ENABLED: panel_enabled},
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


# ═══════════════════════════════════════════════════════════════════════════
# Card registration (via async_setup)
# ═══════════════════════════════════════════════════════════════════════════


async def test_card_registered_on_async_setup(hass: HomeAssistant) -> None:
    """async_setup registers the Lovelace card static path and module URL."""
    entry = _make_global_entry(hass, panel_enabled=False)
    await setup_integration(hass, entry)

    urls: set[str] = hass.data.get(DATA_EXTRA_MODULE_URL, set())
    assert CARD_URL in urls
    hass.http.async_register_static_paths.assert_called()  # type: ignore[attr-defined]
    assert hass.data[DOMAIN].get("_card_registered") is True


async def test_card_registration_idempotent(hass: HomeAssistant) -> None:
    """Calling async_register_card twice produces no duplicate URLs or errors."""
    entry = _make_global_entry(hass, panel_enabled=False)
    await setup_integration(hass, entry)

    call_count_before: int = hass.http.async_register_static_paths.call_count  # type: ignore[attr-defined]

    # Second registration should be a no-op
    await async_register_card(hass)

    assert hass.http.async_register_static_paths.call_count == call_count_before  # type: ignore[attr-defined]
    urls: set[str] = hass.data.get(DATA_EXTRA_MODULE_URL, set())
    assert CARD_URL in urls


async def test_card_static_path_points_to_real_file(
    hass: HomeAssistant,
) -> None:
    """The static path used for card registration resolves to a real JS file."""
    entry = _make_global_entry(hass, panel_enabled=False)
    await setup_integration(hass, entry)

    calls = hass.http.async_register_static_paths.call_args_list  # type: ignore[attr-defined]
    card_path: str | None = None
    for call in calls:
        for cfg in call[0][0]:
            if cfg.url_path == CARD_URL:
                card_path = cfg.path
                break

    assert card_path is not None, "Card static path not found in mock calls"
    assert Path(card_path).is_file(), f"Card JS file does not exist: {card_path}"
    assert card_path.endswith(".js")


# ═══════════════════════════════════════════════════════════════════════════
# Panel registration (via async_setup_entry)
# ═══════════════════════════════════════════════════════════════════════════


async def test_panel_not_registered_when_disabled(hass: HomeAssistant) -> None:
    """Panel is NOT registered when CONF_PANEL_ENABLED is False."""
    entry = _make_global_entry(hass, panel_enabled=False)

    with patch(
        "homeassistant.components.panel_custom.async_register_panel",
        new_callable=AsyncMock,
    ) as mock_register:
        await setup_integration(hass, entry)
        mock_register.assert_not_called()

    assert not hass.data.get(DOMAIN, {}).get("_panel_registered")


async def test_panel_registered_when_enabled(hass: HomeAssistant) -> None:
    """Panel IS registered with correct args when CONF_PANEL_ENABLED is True."""
    entry = _make_global_entry(hass, panel_enabled=True)

    with patch(
        "homeassistant.components.panel_custom.async_register_panel",
        new_callable=AsyncMock,
    ) as mock_register:
        await setup_integration(hass, entry)
        mock_register.assert_called_once()

        kwargs = mock_register.call_args[1]
        assert kwargs["frontend_url_path"] == PANEL_NAME
        assert kwargs["webcomponent_name"] == "maintenance-supporter-panel"
        assert kwargs["require_admin"] is False

    assert hass.data[DOMAIN].get("_panel_registered") is True


async def test_panel_and_card_registered_together(
    hass: HomeAssistant,
) -> None:
    """Full setup with panel enabled registers both card and panel."""
    entry = _make_global_entry(hass, panel_enabled=True)

    with patch(
        "homeassistant.components.panel_custom.async_register_panel",
        new_callable=AsyncMock,
    ) as mock_register:
        await setup_integration(hass, entry)
        mock_register.assert_called_once()

    urls: set[str] = hass.data.get(DATA_EXTRA_MODULE_URL, set())
    assert CARD_URL in urls
    assert hass.data[DOMAIN].get("_card_registered") is True
    assert hass.data[DOMAIN].get("_panel_registered") is True


# ═══════════════════════════════════════════════════════════════════════════
# Options update (panel toggle)
# ═══════════════════════════════════════════════════════════════════════════


async def test_panel_toggle_on_via_options_update(
    hass: HomeAssistant,
) -> None:
    """Updating options to enable the panel triggers async_register_panel."""
    entry = _make_global_entry(hass, panel_enabled=False)

    with patch(
        "homeassistant.components.panel_custom.async_register_panel",
        new_callable=AsyncMock,
    ) as mock_register:
        await setup_integration(hass, entry)
        mock_register.assert_not_called()

        # Toggle panel on
        hass.config_entries.async_update_entry(
            entry, options={**entry.options, CONF_PANEL_ENABLED: True}
        )
        await hass.async_block_till_done()

        mock_register.assert_called_once()


async def test_panel_toggle_off_via_options_update(
    hass: HomeAssistant,
) -> None:
    """Updating options to disable the panel triggers async_remove_panel."""
    entry = _make_global_entry(hass, panel_enabled=True)

    with (
        patch(
            "homeassistant.components.panel_custom.async_register_panel",
            new_callable=AsyncMock,
        ),
        patch(
            "custom_components.maintenance_supporter.panel.frontend.async_remove_panel",
        ) as mock_remove,
    ):
        await setup_integration(hass, entry)

        # Toggle panel off
        hass.config_entries.async_update_entry(
            entry, options={**entry.options, CONF_PANEL_ENABLED: False}
        )
        await hass.async_block_till_done()

        mock_remove.assert_called_once_with(hass, PANEL_NAME)


# ═══════════════════════════════════════════════════════════════════════════
# Unload
# ═══════════════════════════════════════════════════════════════════════════


async def test_panel_unregistered_on_global_unload(
    hass: HomeAssistant,
) -> None:
    """Unloading a global entry with panel enabled calls async_remove_panel."""
    entry = _make_global_entry(hass, panel_enabled=True)

    with (
        patch(
            "homeassistant.components.panel_custom.async_register_panel",
            new_callable=AsyncMock,
        ),
        patch(
            "custom_components.maintenance_supporter.panel.frontend.async_remove_panel",
        ) as mock_remove,
    ):
        await setup_integration(hass, entry)
        assert hass.data[DOMAIN].get("_panel_registered") is True

        await hass.config_entries.async_unload(entry.entry_id)
        await hass.async_block_till_done()

        mock_remove.assert_called_once_with(hass, PANEL_NAME)


async def test_unload_without_panel_no_error(hass: HomeAssistant) -> None:
    """Unloading when panel was never registered causes no crash."""
    entry = _make_global_entry(hass, panel_enabled=False)

    with (
        patch(
            "homeassistant.components.panel_custom.async_register_panel",
            new_callable=AsyncMock,
        ),
        patch(
            "custom_components.maintenance_supporter.panel.frontend.async_remove_panel",
        ) as mock_remove,
    ):
        await setup_integration(hass, entry)
        assert not hass.data.get(DOMAIN, {}).get("_panel_registered")

        await hass.config_entries.async_unload(entry.entry_id)
        await hass.async_block_till_done()

        mock_remove.assert_not_called()


# ═══════════════════════════════════════════════════════════════════════════
# URL format
# ═══════════════════════════════════════════════════════════════════════════


async def test_panel_url_contains_version_hash(hass: HomeAssistant) -> None:
    """Panel module_url contains PANEL_URL followed by an 8-char hex hash."""
    entry = _make_global_entry(hass, panel_enabled=True)

    with patch(
        "homeassistant.components.panel_custom.async_register_panel",
        new_callable=AsyncMock,
    ) as mock_register:
        await setup_integration(hass, entry)
        mock_register.assert_called_once()

        module_url: str = mock_register.call_args[1]["module_url"]

    assert module_url.startswith(PANEL_URL + "_")
    hash_part = module_url[len(PANEL_URL) + 1 :]
    assert len(hash_part) == 8
    assert all(c in "0123456789abcdef" for c in hash_part)


async def test_card_url_is_unversioned(hass: HomeAssistant) -> None:
    """Card URL does NOT contain any version hash or query parameter."""
    entry = _make_global_entry(hass, panel_enabled=False)
    await setup_integration(hass, entry)

    urls: set[str] = hass.data.get(DATA_EXTRA_MODULE_URL, set())
    assert CARD_URL in urls

    # The card URL should be exactly the constant — no version suffix
    for url in urls:
        if "card" in url:
            assert "?v=" not in url
            assert url == CARD_URL
