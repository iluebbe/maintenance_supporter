"""One defaults table for the global settings (DRY review 2026-09-12).

Pins the three surfaces to ``helpers.settings_registry``: every ``SettingSpec``
carries a non-None default of its declared type; the WS ``settings`` echo of
an EMPTY options dict (``_build_full_settings({})``) reports exactly the
registry default for every echoed key; and the options-flow forms built on
an empty global entry default every registered field to the same value. The
defaults used to live as four hand-kept copies (WS echo, options flow,
notification manager, coordinator) — a drift in any one of them fails here.
"""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_ADVANCED_BUDGET, CONF_NOTIFICATIONS_ENABLED, CONF_ROW_ACTION_NOTICE, DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.helpers.settings_registry import (
    SETTING_SPECS,
    SettingSpec,
    setting_default,
    settings_defaults,
)
from custom_components.maintenance_supporter.websocket.dashboard import _build_full_settings

from .conftest import setup_integration

_OPTIONS_FLOW_STEPS = (
    "general_settings",
    "advanced_features",
    "panel_access",
    "notification_settings",
    "notification_actions",
    "budget_settings",
)


_SECTIONS = {"features", "archive", "general", "notifications", "actions", "budget", "vacation"}


def _flatten(d: dict[str, Any]) -> dict[str, Any]:
    """``section.key`` → value. Only the known sections are descended; a
    dict-valued SETTING (member_display, battery_lifetime_months) stays a leaf."""
    out: dict[str, Any] = {}
    for section, v in d.items():
        if section in _SECTIONS and isinstance(v, dict):
            for k, leaf in v.items():
                out[f"{section}.{k}"] = leaf
        else:
            out[section] = v
    return out


def _sentinel(spec: SettingSpec) -> Any:
    """A value of the spec's type that no default equals."""
    if spec.py_type is bool:
        return not spec.default
    if spec.py_type is int:
        return 5551
    if spec.py_type is float:
        return 4321.5
    if spec.py_type is str:
        return "zz-sentinel"
    if spec.py_type is list:
        return ["zz-sentinel"]
    if spec.py_type is dict:
        return {"zz-sentinel": 1}
    raise AssertionError(f"unexpected spec type {spec.py_type} for {spec.key}")


def test_every_spec_has_a_typed_default() -> None:
    for spec in SETTING_SPECS:
        assert spec.default is not None, f"{spec.key} has no default"
        if spec.py_type is bool:
            assert isinstance(spec.default, bool), spec.key
        elif spec.py_type is int:
            assert isinstance(spec.default, int) and not isinstance(spec.default, bool), spec.key
        elif spec.py_type is float:
            assert isinstance(spec.default, (int, float)) and not isinstance(spec.default, bool), spec.key
        else:
            assert isinstance(spec.default, spec.py_type), spec.key
        if spec.int_range is not None:
            assert spec.int_range[0] <= spec.default <= spec.int_range[1], f"{spec.key} default outside its range"
        if spec.float_range is not None:
            assert spec.float_range[0] <= spec.default <= spec.float_range[1], f"{spec.key} default outside its range"


def test_defaults_come_back_as_copies() -> None:
    table = settings_defaults()
    assert set(table) == {s.key for s in SETTING_SPECS}
    table["objects_table_columns"].append("mutated")
    table["member_display"]["x"] = 1
    assert "mutated" not in setting_default("objects_table_columns")
    assert setting_default("member_display") == {}


def test_full_settings_echo_of_empty_options_is_the_registry_default() -> None:
    """For every registry key: find where the WS echo surfaces it (probe with a
    sentinel), then assert the empty-options echo at that path IS the default."""
    base = _flatten(_build_full_settings({}))
    not_echoed: list[str] = []
    drifted: list[str] = []
    for spec in SETTING_SPECS:
        sentinel = _sentinel(spec)
        probe = _flatten(_build_full_settings({spec.key: sentinel}))
        paths = [p for p, v in probe.items() if v == sentinel and base.get(p) != sentinel]
        if not paths:
            not_echoed.append(spec.key)
            continue
        for path in paths:
            if base[path] != setting_default(spec.key):
                drifted.append(f"{spec.key} → {path}: echo {base[path]!r} vs registry {setting_default(spec.key)!r}")
    assert not not_echoed, f"_build_full_settings does not echo: {not_echoed}"
    assert not drifted, "WS settings echo drifted from the registry defaults:\n  " + "\n  ".join(drifted)


async def test_options_flow_form_defaults_equal_the_registry(hass: HomeAssistant) -> None:
    """Every registered key an options-flow form carries defaults to the
    registry value when nothing is stored (fresh flow per step, so a saved
    step cannot feed the next one). The two flags that merely unlock menu
    entries (notifications on, budget section visible) are the only stored
    values — and are excluded from the comparison."""
    seeded = {CONF_NOTIFICATIONS_ENABLED: True, CONF_ADVANCED_BUDGET: True}
    entry = MockConfigEntry(version=1, minor_version=1, domain=DOMAIN, title="Maintenance Supporter", data={}, source="user", unique_id=GLOBAL_UNIQUE_ID)
    entry.add_to_hass(hass)
    await setup_integration(hass, entry)
    # Setup migrates the entry (writing the advanced flags into options); the
    # two menu-unlocking flags go in on top, and nothing else stored may be
    # non-default or the comparison below would be vacuous.
    hass.config_entries.async_update_entry(entry, options={**entry.options, **seeded})
    all_keys = {s.key for s in SETTING_SPECS}
    # The 5→6 migration flags the one-time "new look" notice for existing
    # installs (#145) — a documented non-default write, not a flow default.
    excluded = set(seeded) | {CONF_ROW_ACTION_NOTICE}
    stray = {k: v for k, v in entry.options.items() if k in all_keys and k not in excluded and v != setting_default(k)}
    assert not stray, f"setup stored non-default values: {stray}"

    registry_keys = all_keys - excluded
    seen: set[str] = set()
    drifted: list[str] = []
    for step in _OPTIONS_FLOW_STEPS:
        result = await hass.config_entries.options.async_init(entry.entry_id)
        result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": step})
        assert result["type"] == FlowResultType.FORM, step
        for marker in result["data_schema"].schema:
            key = str(getattr(marker, "schema", marker))
            if key not in registry_keys or not hasattr(marker, "default") or marker.default is vol.UNDEFINED:
                continue
            seen.add(key)
            if marker.default() != setting_default(key):
                drifted.append(f"{step}/{key}: form {marker.default()!r} vs registry {setting_default(key)!r}")
    assert not drifted, "options-flow defaults drifted from the registry:\n  " + "\n  ".join(drifted)
    # Sanity: the sweep really covered the flow (a renamed step would
    # otherwise pass vacuously).
    assert {"default_warning_days", "notify_due_soon_interval_hours", "quiet_hours_start", "notify_completed", "budget_alert_threshold", "operator_write_enabled"} <= seen
