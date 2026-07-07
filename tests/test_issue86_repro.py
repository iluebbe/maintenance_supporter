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
