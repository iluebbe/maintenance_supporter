"""Integration tests for panel and frontend (card) registration lifecycle."""

from __future__ import annotations

from pathlib import Path
from unittest.mock import AsyncMock, patch

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CARD_URL,
    CONF_PANEL_ENABLED,
    CONF_PANEL_TITLE,
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
    # Issue #124: the module URL carries a content-hash query so browsers
    # can't serve a heuristically-cached bundle across an update.
    assert any(u.startswith(f"{CARD_URL}?v=") for u in urls)
    hass.http.async_register_static_paths.assert_called()  # type: ignore[attr-defined]
    assert hass.data.get(f"{DOMAIN}_card_registered") is True


async def test_card_registration_idempotent(hass: HomeAssistant) -> None:
    """Calling async_register_card twice produces no duplicate URLs or errors."""
    entry = _make_global_entry(hass, panel_enabled=False)
    await setup_integration(hass, entry)

    call_count_before: int = hass.http.async_register_static_paths.call_count  # type: ignore[attr-defined]

    # Second registration should be a no-op
    await async_register_card(hass)

    assert hass.http.async_register_static_paths.call_count == call_count_before  # type: ignore[attr-defined]
    urls: set[str] = hass.data.get(DATA_EXTRA_MODULE_URL, set())
    card_urls = [u for u in urls if u.startswith(f"{CARD_URL}?v=")]
    assert len(card_urls) == 1, "re-registration must not add a second card URL"


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


async def test_strategy_shim_static_path_points_to_real_file(
    hass: HomeAssistant,
) -> None:
    """The strategy SHIM (v2.8.1) must resolve to a real built JS file — it is
    what HA auto-loads to register the dashboard strategy element."""
    from custom_components.maintenance_supporter.const import STRATEGY_SHIM_URL

    entry = _make_global_entry(hass, panel_enabled=False)
    await setup_integration(hass, entry)

    calls = hass.http.async_register_static_paths.call_args_list  # type: ignore[attr-defined]
    shim_path: str | None = None
    for call in calls:
        for cfg in call[0][0]:
            if cfg.url_path == STRATEGY_SHIM_URL:
                shim_path = cfg.path
                break

    assert shim_path is not None, "Strategy shim static path not registered"
    assert Path(shim_path).is_file(), f"Shim JS file does not exist: {shim_path}"
    assert shim_path.endswith("maintenance-strategy-shim.js")


async def test_module_urls_are_content_hash_busted(hass: HomeAssistant) -> None:
    """Issue #124: every extra module URL must carry the file's content hash.

    The static files are served without Cache-Control, so browsers cache them
    heuristically. An unversioned URL let a stale cached strategy entry import
    chunk names a HACS update had deleted (404 → dashboard gone until a hard
    refresh). The query hash makes the URL — and thus the cache key — change
    with the file.
    """
    import hashlib

    from custom_components.maintenance_supporter.const import (
        CALENDAR_CARD_URL,
        STRATEGY_SHIM_URL,
    )

    entry = _make_global_entry(hass, panel_enabled=False)
    await setup_integration(hass, entry)

    frontend_dir = (
        Path("custom_components") / "maintenance_supporter" / "frontend"
    )
    urls: set[str] = hass.data.get(DATA_EXTRA_MODULE_URL, set())
    for base, filename in (
        (CARD_URL, "maintenance-card.js"),
        (STRATEGY_SHIM_URL, "maintenance-strategy-shim.js"),
        (CALENDAR_CARD_URL, "maintenance-calendar-card.js"),
    ):
        expected = hashlib.sha256((frontend_dir / filename).read_bytes()).hexdigest()[:8]
        assert f"{base}?v={expected}" in urls, f"{base} is not hash-busted"
        assert base not in urls, f"{base} must not also be registered bare"


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


async def test_register_panel_survives_flag_desync(hass: HomeAssistant) -> None:
    """#86 (2nd report): recreating the deleted global entry must not fail with
    "Overwriting panel". The `_panel_registered` flag lives in hass.data[DOMAIN],
    which is popped when the last entry unloads — so on a reinstall / repair-
    recreate the flag is lost while HA's frontend still holds the panel, and the
    unconditional re-register used to raise. It must now drop the stale panel
    and re-register cleanly.
    """
    from homeassistant.components import frontend

    from custom_components.maintenance_supporter.panel import async_register_panel

    # Mimic HA's real panel registry: populate DATA_PANELS and raise
    # "Overwriting panel" on a collision, exactly like frontend does. (The real
    # panel_custom.async_register_panel needs a fully set-up frontend, which the
    # test harness only fakes.)
    async def fake_register(hass_arg: HomeAssistant, *, frontend_url_path: str, **_kw: object) -> None:
        panels = hass_arg.data.setdefault(frontend.DATA_PANELS, {})
        if frontend_url_path in panels:
            raise ValueError(f"Overwriting panel {frontend_url_path}")
        panels[frontend_url_path] = object()

    with patch(
        "homeassistant.components.panel_custom.async_register_panel",
        side_effect=fake_register,
    ):
        await async_register_panel(hass)
        assert PANEL_NAME in hass.data[frontend.DATA_PANELS]

        # Desync: the shared runtime dict is popped on last-entry unload, losing
        # the flag; HA still holds the panel.
        hass.data.pop(DOMAIN, None)

        # Recreating the global entry re-registers — must NOT raise "Overwriting
        # panel", and the panel stays registered.
        await async_register_panel(hass)
        assert PANEL_NAME in hass.data[frontend.DATA_PANELS]
        assert hass.data[DOMAIN].get("_panel_registered") is True


async def test_static_path_memo_survives_flag_desync(hass: HomeAssistant) -> None:
    """Twin of the panel fix: the static-route memo must survive the
    hass.data[DOMAIN] pop, so recreating the global entry does NOT re-add a
    route Home Assistant still holds (aiohttp would raise "method GET is already
    registered"). The memo is a top-level hass.data key, not under DOMAIN.
    """
    from custom_components.maintenance_supporter.panel import (
        _PANEL_STATIC_URL_KEY,
        async_register_panel,
    )

    # Isolate the static-path logic — mock the panel registration itself.
    with patch(
        "homeassistant.components.panel_custom.async_register_panel",
        new_callable=AsyncMock,
    ):
        await async_register_panel(hass)
        calls_after_first = hass.http.async_register_static_paths.call_count  # type: ignore[attr-defined]
        assert calls_after_first >= 1
        assert hass.data.get(_PANEL_STATIC_URL_KEY)  # top-level memo set

        # Desync: the shared runtime dict is popped on last-entry unload. The
        # top-level static-path memo must survive it.
        hass.data.pop(DOMAIN, None)
        assert hass.data.get(_PANEL_STATIC_URL_KEY)

        # Recreating the global entry must NOT re-register the (process-long)
        # static route — same versioned URL, so no extra register call.
        await async_register_panel(hass)
        assert hass.http.async_register_static_paths.call_count == calls_after_first  # type: ignore[attr-defined]


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


async def test_panel_registered_by_default_when_option_absent(
    hass: HomeAssistant,
) -> None:
    """Panel registers when CONF_PANEL_ENABLED is ABSENT from options — it now
    defaults ON (v2.10.4, #69 follow-up) so the empty-state "Open panel" button,
    QR codes, and notifications (all linking to /maintenance-supporter) don't 404.
    """
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        options={},  # no panel_enabled key -> the default (True) applies
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)

    with patch(
        "homeassistant.components.panel_custom.async_register_panel",
        new_callable=AsyncMock,
    ) as mock_register:
        await setup_integration(hass, entry)
        mock_register.assert_called_once()

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
    assert any(u.startswith(f"{CARD_URL}?v=") for u in urls)
    assert hass.data.get(f"{DOMAIN}_card_registered") is True
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
        hass.config_entries.async_update_entry(entry, options={**entry.options, CONF_PANEL_ENABLED: True})
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
        hass.config_entries.async_update_entry(entry, options={**entry.options, CONF_PANEL_ENABLED: False})
        await hass.async_block_till_done()

        mock_remove.assert_called_once_with(hass, PANEL_NAME, warn_if_unknown=False)


async def test_panel_not_reregistered_on_unrelated_options_change(
    hass: HomeAssistant,
) -> None:
    """A global-options change that doesn't touch the sidebar title must NOT
    remove + re-register the panel. Re-removing it yanked the panel out from
    under anyone viewing it, bouncing them to the HA default dashboard on
    every settings save (e.g. an objects-table column toggle, #67)."""
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

        # Change a non-title global option; the panel stays enabled.
        hass.config_entries.async_update_entry(entry, options={**entry.options, "max_notifications_per_day": 5})
        await hass.async_block_till_done()

        # The panel must NOT have been torn down.
        mock_remove.assert_not_called()


async def test_panel_reregistered_on_title_change(
    hass: HomeAssistant,
) -> None:
    """Changing the sidebar title DOES re-register (HA has no in-place update)."""
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

        hass.config_entries.async_update_entry(entry, options={**entry.options, CONF_PANEL_TITLE: "My Custom Upkeep"})
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

        mock_remove.assert_called_once_with(hass, PANEL_NAME, warn_if_unknown=False)


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


async def test_heavy_strategy_bundle_not_autoloaded(hass: HomeAssistant) -> None:
    """The heavy strategy bundle stays out of extra_module_url.

    v2.8.1: the dashboard strategy is auto-loaded via the tiny
    STRATEGY_SHIM_URL, which wins HA's whenDefined race and lazy-imports the
    bundle on first use. Only the shim (plus the two cards) may be
    auto-loaded — all three content-hash versioned since issue #124 (see
    test_module_urls_are_content_hash_busted; this file used to pin the
    opposite, unversioned policy, which is what let a stale cached strategy
    entry outlive an update and 404 on the renamed chunks).
    """
    from custom_components.maintenance_supporter.const import (
        CALENDAR_CARD_URL,
        STRATEGY_SHIM_URL,
        STRATEGY_URL,
    )

    entry = _make_global_entry(hass, panel_enabled=False)
    await setup_integration(hass, entry)

    urls: set[str] = hass.data.get(DATA_EXTRA_MODULE_URL, set())
    assert not any(u.startswith(STRATEGY_URL) for u in urls), (
        "heavy strategy bundle should not be in extra_module_url; the shim loads it lazily"
    )
    for base in (CARD_URL, STRATEGY_SHIM_URL, CALENDAR_CARD_URL):
        assert any(u.startswith(f"{base}?v=") for u in urls), f"{base} missing"
