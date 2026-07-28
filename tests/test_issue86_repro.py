"""Repro for issue #86: panel empty, summary sensors unknown (v2.21.1)."""

from __future__ import annotations

import json
from pathlib import Path

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)

from .conftest import build_global_entry_data, setup_integration

FIXTURE = json.loads((Path(__file__).parent / "fixtures_issue86.json").read_text(encoding="utf-8"))


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


async def test_issue86_entry_sets_up_and_computes_status(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    hass.states.async_set("sensor.colorado_odometer", "142000")
    entry = MockConfigEntry(
        version=1,
        minor_version=3,
        domain=DOMAIN,
        title="Issue86 Object",
        data={CONF_OBJECT: FIXTURE["object"], CONF_TASKS: FIXTURE["tasks"]},
        source="user",
        unique_id="maintenance_supporter_issue86",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry)
    assert entry.state.value == "loaded", f"entry state: {entry.state}"

    coordinator = entry.runtime_data.coordinator
    await coordinator.async_refresh()
    await hass.async_block_till_done()
    assert coordinator.last_update_success, "refresh failed"
    assert coordinator.data is not None
    statuses = {t.get("_status") for t in coordinator.data[CONF_TASKS].values()}
    assert None not in statuses, "tasks without computed status"
    print("STATUSES:", statuses)

    # Issue symptom (a) root fix: statistics resolves the summary sensors'
    # ACTUAL entity_ids through the registry (hardcoded ids in the strategy
    # chips read "unknown" whenever the real id differs).
    from unittest.mock import MagicMock

    from custom_components.maintenance_supporter.websocket.dashboard import (
        ws_get_statistics,
    )

    from .conftest import call_ws_handler

    conn = MagicMock()
    conn.user = MagicMock(is_admin=True)
    conn.user.id = "mock-ws-user"
    await call_ws_handler(
        ws_get_statistics,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/statistics",
        },
    )
    stats = conn.send_result.call_args[0][1]
    ids = stats["summary_entity_ids"]
    assert set(ids) == {"overdue", "due_soon", "triggered", "ok"}
    for key, eid in ids.items():
        assert eid, f"summary id for {key} unresolved"
        assert hass.states.get(eid) is not None

    # Issue symptom (a): summary sensors read "unknown".
    for key in ("overdue", "due_soon", "triggered", "ok"):
        st = hass.states.get(f"sensor.maintenance_supporter_{key}")
        print("SUMMARY", key, "=", st and st.state)
        assert st is not None and st.state not in ("unknown", "unavailable"), f"summary sensor {key} is {st and st.state}"


async def test_issue86_missing_global_entry_keeps_chips_unknown(hass: HomeAssistant) -> None:
    """Second report on #86 (jayg37, v2.21.4): the card correctly says "all
    caught up" but the KPI chips still read "unknown" after the v2.21.2 fix.

    Reproduces the actual state from their diagnostic + Dev-Tools screenshot:
    per-object entries exist, but there is NO global "Maintenance Supporter"
    config entry — so the summary sensors are never created at all. The
    registry-resolution fix can't help because there's nothing to resolve, and
    the strategy chips fall back to the hardcoded (non-existent) ids and read
    "unknown". A summary sensor's native_value can never be None, so a persisted
    "unknown" can only mean the entity is absent — which is exactly this case.
    """
    from unittest.mock import MagicMock

    from custom_components.maintenance_supporter.websocket.dashboard import (
        ws_get_statistics,
    )

    from .conftest import call_ws_handler

    hass.states.async_set("sensor.colorado_odometer", "142000")
    obj = MockConfigEntry(
        version=1,
        minor_version=3,
        domain=DOMAIN,
        title="Colorado",
        data={CONF_OBJECT: FIXTURE["object"], CONF_TASKS: FIXTURE["tasks"]},
        source="user",
        unique_id="maintenance_supporter_colorado",
    )
    obj.add_to_hass(hass)

    # Set up ONLY the object entry — no global entry (the shared runtime is
    # still built on first entry setup, so the WS + aggregator work).
    await hass.config_entries.async_setup(obj.entry_id)
    await hass.async_block_till_done()
    assert obj.state.value == "loaded"

    # No global entry ⇒ the four summary sensors do not exist as entities.
    for key in ("overdue", "due_soon", "triggered", "ok"):
        assert hass.states.get(f"sensor.maintenance_supporter_{key}") is None

    # The statistics WS still computes the real counts from the object entries,
    # but every summary_entity_id resolves to None (no sensor registered) — so
    # the strategy chips have no entity to read and render "unknown".
    conn = MagicMock()
    conn.user = MagicMock(is_admin=True)
    conn.user.id = "mock-ws-user"
    await call_ws_handler(
        ws_get_statistics,
        hass,
        conn,
        {"id": 1, "type": "maintenance_supporter/statistics"},
    )
    stats = conn.send_result.call_args[0][1]
    assert stats["summary_entity_ids"] == {
        "overdue": None,
        "due_soon": None,
        "triggered": None,
        "ok": None,
    }, stats["summary_entity_ids"]
    # Counts themselves are present and correct — the data is fine, only the
    # display path (entity round-trip) is broken. `ok` is now in the payload
    # (Fix A) so the chips can render the real number without a sensor.
    assert stats["total_tasks"] == len(FIXTURE["tasks"])
    assert all(k in stats for k in ("overdue", "due_soon", "triggered", "ok"))


async def test_issue86_orphan_object_raises_and_clears_repair_issue(hass: HomeAssistant) -> None:
    """Fix B: an object entry loaded with NO global "Maintenance Supporter"
    entry present raises a fixable repair issue; setting up a global entry
    clears it. (No global_entry fixture — its mere registration would count as
    "present" even unloaded, which is not jayg37's deleted-entry state.)"""
    from homeassistant.helpers import issue_registry as ir

    hass.states.async_set("sensor.colorado_odometer", "142000")
    obj = MockConfigEntry(
        version=1,
        minor_version=3,
        domain=DOMAIN,
        title="Colorado",
        data={CONF_OBJECT: FIXTURE["object"], CONF_TASKS: FIXTURE["tasks"]},
        source="user",
        unique_id="maintenance_supporter_colorado",
    )
    obj.add_to_hass(hass)

    # Object entry only, no global entry → the started-check raises the issue.
    await hass.config_entries.async_setup(obj.entry_id)
    await hass.async_block_till_done()

    reg = ir.async_get(hass)
    issue = reg.async_get_issue(DOMAIN, "missing_global_entry")
    assert issue is not None, "expected the missing-global-entry repair issue"
    assert issue.is_fixable
    assert issue.severity == ir.IssueSeverity.ERROR

    # Restoring the global entry (as the repair flow's import step does) clears
    # the issue immediately.
    global_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)
    await hass.config_entries.async_setup(global_entry.entry_id)
    await hass.async_block_till_done()
    assert reg.async_get_issue(DOMAIN, "missing_global_entry") is None
