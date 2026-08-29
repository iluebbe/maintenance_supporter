"""Proof of presence (require_tag_scan): Done only via NFC/QR scan.

Enforced at the completion choke point so every surface (panel, card,
to-do, voice, notification button) gets the same refusal; the scan
surfaces (NFC handler, QR quick-complete) assert tag_verified, automatic
completions are exempt.
"""

from __future__ import annotations

from datetime import timedelta

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.websocket.tasks_actions import (
    ws_complete_task,
    ws_quick_complete_task,
)

from .conftest import (
    TASK_ID_1,
    assert_ws_error,
    build_global_entry_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_ws_connection,
    setup_integration,
)


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Maintenance Supporter",
        data=build_global_entry_data(), source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _entry(hass: HomeAssistant, **task_over) -> MockConfigEntry:
    last = (dt_util.now().date() - timedelta(days=40)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, name="Feed the cat", last_performed=last, interval_days=30)
    task["require_tag_scan"] = True
    task["nfc_tag_id"] = "TAG123"
    task.update(task_over)
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Cat",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        source="user", unique_id="maintenance_supporter_scan_gate",
    )
    entry.add_to_hass(hass)
    return entry


async def test_unscanned_surfaces_are_refused(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    entry = _entry(hass)
    await setup_integration(hass, global_entry, entry)

    conn = make_ws_connection()
    await call_ws_handler(ws_complete_task, hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/complete",
        "entry_id": entry.entry_id, "task_id": TASK_ID_1,
    })
    code, _ = assert_ws_error(conn)
    assert code == "tag_scan_required"
    merged = entry.runtime_data.coordinator._get_merged_tasks_data()[TASK_ID_1]
    assert not [h for h in merged["history"] if h["type"] == "completed"]


async def test_tag_verified_completes(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    entry = _entry(hass)
    await setup_integration(hass, global_entry, entry)

    await entry.runtime_data.coordinator.complete_maintenance(
        task_id=TASK_ID_1, unattended=True, tag_verified=True
    )
    merged = entry.runtime_data.coordinator._get_merged_tasks_data()[TASK_ID_1]
    assert [h for h in merged["history"] if h["type"] == "completed"]


async def test_quick_complete_counts_as_scan(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """The QR sticker hangs ON the thing — quick-complete passes the gate."""
    entry = _entry(hass, quick_complete_defaults={"notes": "qr"})
    await setup_integration(hass, global_entry, entry)

    conn = make_ws_connection()
    await call_ws_handler(ws_quick_complete_task, hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/quick_complete",
        "entry_id": entry.entry_id, "task_id": TASK_ID_1,
    })
    assert not conn.send_error.called, conn.send_error.call_args
    merged = entry.runtime_data.coordinator._get_merged_tasks_data()[TASK_ID_1]
    assert [h for h in merged["history"] if h["type"] == "completed"]


async def test_auto_completion_is_exempt(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """A recovered trigger has nobody to send to the machine."""
    entry = _entry(hass)
    await setup_integration(hass, global_entry, entry)

    await entry.runtime_data.coordinator.complete_maintenance(task_id=TASK_ID_1, auto=True)
    merged = entry.runtime_data.coordinator._get_merged_tasks_data()[TASK_ID_1]
    assert [h for h in merged["history"] if h["type"] == "completed"]


async def test_flag_off_keeps_the_old_world(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    entry = _entry(hass, require_tag_scan=False)
    await setup_integration(hass, global_entry, entry)

    conn = make_ws_connection()
    await call_ws_handler(ws_complete_task, hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/complete",
        "entry_id": entry.entry_id, "task_id": TASK_ID_1,
    })
    assert not conn.send_error.called


async def test_ws_complete_with_via_tag_scan_passes_the_gate(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """QR deep-link fallback (bug audit 2026-08-29): a tag-gated task whose
    quick-complete needs the full dialog completes when the panel asserts the
    scan on task/complete — the schema must accept the field, not just the
    handler."""
    entry = _entry(hass)
    await setup_integration(hass, global_entry, entry)
    # call_ws_handler bypasses the decorator schema, so validate the field
    # against the REAL schema here - the first cut only patched the handler
    # and the live check failed with "extra keys not allowed".
    ws_complete_task._ws_schema({  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/task/complete",
        "entry_id": entry.entry_id, "task_id": TASK_ID_1, "via_tag_scan": True,
    })

    conn = make_ws_connection()
    await call_ws_handler(ws_complete_task, hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/complete",
        "entry_id": entry.entry_id, "task_id": TASK_ID_1, "via_tag_scan": True,
    })
    assert not conn.send_error.called, conn.send_error.call_args
    merged = entry.runtime_data.coordinator._get_merged_tasks_data()[TASK_ID_1]
    assert [h for h in merged["history"] if h["type"] == "completed"]
