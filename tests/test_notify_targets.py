"""Unit tests for helpers.notify_targets.build_notify_targets.

This helper is the single source of truth for the pickable notify-target list
shared by the global options flow and the panel Settings picker. The two
surfaces used to recompute this merge independently (and had drifted); these
tests pin the canonical behaviour.
"""

from __future__ import annotations

from homeassistant.core import HomeAssistant

from custom_components.maintenance_supporter.helpers.notify_targets import (
    build_notify_targets,
)


def _register(hass: HomeAssistant) -> None:
    """Register a representative mix of notify services + entities."""
    hass.services.async_register("notify", "mobile_app_phone", lambda call: None)
    hass.services.async_register("notify", "all_devices_group", lambda call: None)
    hass.services.async_register("notify", "send_message", lambda call: None)
    hass.states.async_set("notify.mobile_app_phone", "unknown")  # dup of service
    hass.states.async_set("notify.file", "unknown")  # entity-only device
    hass.states.async_set("notify.send_message", "unknown")  # generic action
    hass.states.async_set("light.kitchen", "on")  # unrelated domain


async def test_merges_services_and_entities(hass: HomeAssistant) -> None:
    _register(hass)
    targets = build_notify_targets(hass)
    assert "notify.mobile_app_phone" in targets  # legacy service
    assert "notify.all_devices_group" in targets  # notify group service
    assert "notify.file" in targets  # entity-only device — the newer model


async def test_excludes_send_message_service_and_entity(hass: HomeAssistant) -> None:
    _register(hass)
    targets = build_notify_targets(hass)
    assert "notify.send_message" not in targets


async def test_ignores_other_domains(hass: HomeAssistant) -> None:
    _register(hass)
    targets = build_notify_targets(hass)
    assert "light.kitchen" not in targets
    assert all(t.startswith("notify.") for t in targets)


async def test_deduplicates_service_and_entity(hass: HomeAssistant) -> None:
    _register(hass)
    targets = build_notify_targets(hass)
    # mobile_app_phone exists as BOTH a service and an entity → appears once.
    assert targets.count("notify.mobile_app_phone") == 1


async def test_injects_current_value_even_when_unavailable(hass: HomeAssistant) -> None:
    _register(hass)
    targets = build_notify_targets(hass, current="notify.gone_away")
    assert "notify.gone_away" in targets


async def test_blank_current_is_not_added(hass: HomeAssistant) -> None:
    _register(hass)
    targets = build_notify_targets(hass, current="")
    assert "" not in targets


async def test_result_is_sorted(hass: HomeAssistant) -> None:
    _register(hass)
    targets = build_notify_targets(hass, current="notify.zzz_last")
    assert targets == sorted(targets)


async def test_empty_when_no_notify_targets(hass: HomeAssistant) -> None:
    # No services registered, no notify entities.
    assert build_notify_targets(hass) == []
