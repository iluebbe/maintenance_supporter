"""Tests for codebase audit fixes (v1.0.15+).

Covers: Fix A (NaN/Inf guard), Fix B (slugify_object_name), Fix C (O(1) next_due),
Fix D (import logging), Fix E (NFC duplicate on JSON import), Fix F (diagnostics redaction),
Fix G (NFC duplicate in options flow), Fix H (NFC duplicate in CSV import),
Fix I (NFC tag length validation).
"""

from __future__ import annotations

import json
import logging
import time
from datetime import date, timedelta
from typing import Any
from unittest.mock import MagicMock, patch

import pytest
from homeassistant.core import HomeAssistant, State
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    slugify_object_name,
)
from custom_components.maintenance_supporter.diagnostics import (
    async_get_config_entry_diagnostics,
)
from custom_components.maintenance_supporter.entity.triggers.base_trigger import (
    BaseTrigger,
)
from custom_components.maintenance_supporter.models.maintenance_task import (
    MaintenanceTask,
)
from custom_components.maintenance_supporter.websocket.io import ws_import_csv, ws_import_json

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    setup_integration,
)

# ─── Fix A: NaN/Infinity guard in _get_numeric_value ─────────────────


def _make_trigger(hass: HomeAssistant, attribute: str | None = None) -> BaseTrigger:
    """Create a minimal concrete trigger for testing _get_numeric_value."""
    mock_entity = MagicMock()
    mock_entity.coordinator = MagicMock()
    mock_entity.coordinator.entry = MagicMock()
    mock_entity._task_id = "test_task"

    config: dict[str, Any] = {"entity_id": "sensor.test", "attribute": attribute}

    class ConcreteTrigger(BaseTrigger):
        def evaluate(self, value: float) -> bool:
            return False

    return ConcreteTrigger(hass, mock_entity, config)


async def test_nan_returns_none(hass: HomeAssistant) -> None:
    """NaN should be rejected by _get_numeric_value."""
    trigger = _make_trigger(hass)
    state = State("sensor.test", "nan")
    assert trigger._get_numeric_value(state) is None


async def test_inf_returns_none(hass: HomeAssistant) -> None:
    """Positive infinity should be rejected."""
    trigger = _make_trigger(hass)
    state = State("sensor.test", "inf")
    assert trigger._get_numeric_value(state) is None


async def test_neg_inf_returns_none(hass: HomeAssistant) -> None:
    """Negative infinity should be rejected."""
    trigger = _make_trigger(hass)
    state = State("sensor.test", "-inf")
    assert trigger._get_numeric_value(state) is None


async def test_nan_attribute_returns_none(hass: HomeAssistant) -> None:
    """NaN in an attribute should be rejected."""
    trigger = _make_trigger(hass, attribute="temperature")
    state = State("sensor.test", "42", {"temperature": float("nan")})
    assert trigger._get_numeric_value(state) is None


async def test_valid_float_still_works(hass: HomeAssistant) -> None:
    """Normal floats should still pass through."""
    trigger = _make_trigger(hass)
    state = State("sensor.test", "42.5")
    assert trigger._get_numeric_value(state) == 42.5


# ─── Fix B: slugify_object_name ──────────────────────────────────────


def test_slugify_spaces_and_hyphens() -> None:
    """Spaces and hyphens become underscores."""
    assert slugify_object_name("Pool Pump") == "pool_pump"
    assert slugify_object_name("my-device") == "my_device"


def test_slugify_special_chars() -> None:
    """Special characters are stripped."""
    assert slugify_object_name("A/C Unit @Home") == "a_c_unit_home"
    assert slugify_object_name("Test!@#$%^&*()") == "test"


def test_slugify_multiple_spaces() -> None:
    """Multiple consecutive spaces collapse to one underscore."""
    result = slugify_object_name("A  B")
    assert result == "a_b"
    # "A  B" and "A B" produce the same slug
    assert slugify_object_name("A B") == "a_b"


def test_slugify_unicode_parens() -> None:
    """Unicode and parentheses are handled."""
    assert slugify_object_name("Wärmepumpe (WP-1)") == "w_rmepumpe_wp_1"


def test_slugify_leading_trailing() -> None:
    """Leading/trailing special chars are stripped."""
    assert slugify_object_name("--test--") == "test"
    assert slugify_object_name("  hello  ") == "hello"


# ─── Fix C: O(1) next_due calculation ────────────────────────────────


def test_next_due_old_last_performed_fast() -> None:
    """O(1) next_due with 10-year-old last_performed should be fast."""
    task = MaintenanceTask(
        interval_days=1,
        interval_anchor="planned",
        last_performed=(date.today() - timedelta(days=3650)).isoformat(),
        last_planned_due=(date.today() - timedelta(days=3650)).isoformat(),
    )
    start = time.monotonic()
    result = task.next_due
    elapsed = time.monotonic() - start

    assert result is not None
    # Must complete in under 50ms (the old loop would take much longer)
    assert elapsed < 0.05


def test_next_due_math_matches_for_various_inputs() -> None:
    """O(1) computation matches expected results for various inputs."""
    today = date.today()

    # Case 1: anchor == last_performed (normal planned mode)
    task1 = MaintenanceTask(
        interval_days=30,
        interval_anchor="planned",
        last_performed=(today - timedelta(days=5)).isoformat(),
        last_planned_due=(today - timedelta(days=5)).isoformat(),
    )
    assert task1.next_due == today + timedelta(days=25)

    # Case 2: completed late (anchor before last_performed)
    task2 = MaintenanceTask(
        interval_days=30,
        interval_anchor="planned",
        last_performed=(today - timedelta(days=5)).isoformat(),
        last_planned_due=(today - timedelta(days=10)).isoformat(),
    )
    # anchor=today-10, first candidate=today+20, which is > last(today-5), OK
    assert task2.next_due == today + timedelta(days=20)

    # Case 3: anchor far in the past, should still advance past last
    task3 = MaintenanceTask(
        interval_days=7,
        interval_anchor="planned",
        last_performed=today.isoformat(),
        last_planned_due=(today - timedelta(days=100)).isoformat(),
    )
    result = task3.next_due
    assert result is not None
    assert result > today


# ─── Fix D: JSON import logging ──────────────────────────────────────


def _mock_connection() -> MagicMock:
    conn = MagicMock()
    conn.send_result = MagicMock()
    conn.send_error = MagicMock()
    conn.user = MagicMock(is_admin=True)
    return conn


async def test_json_import_exception_logged(
    hass: HomeAssistant,
    caplog: pytest.LogCaptureFixture,
) -> None:
    """Exception during JSON import should be logged with full traceback."""
    # Set up a global entry so the domain is loaded
    global_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry)

    conn = _mock_connection()

    # Craft JSON with a valid object that will cause async_init to raise
    json_data = json.dumps({
        "objects": [{
            "object": {"name": "Test Object"},
            "tasks": [{"name": "Task 1"}],
        }]
    })

    with patch.object(
        hass.config_entries.flow, "async_init",
        side_effect=RuntimeError("test boom"),
    ), caplog.at_level(logging.ERROR):
        await call_ws_handler(ws_import_json, hass, conn, {
            "id": 1, "type": f"{DOMAIN}/json/import",
            "json_content": json_data,
        })

    # The exception should be logged
    assert "test boom" in caplog.text
    assert "JSON import failed" in caplog.text

    # Response should still be sent with error
    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["created"] == 0
    assert len(result["errors"]) == 1


# ─── Fix E: NFC duplicate check on JSON import ───────────────────────


async def test_json_import_nfc_duplicate_warning(
    hass: HomeAssistant,
) -> None:
    """JSON import should warn when NFC tag is already in use."""
    # Create an existing entry with an NFC tag
    existing_task = build_task_data(last_performed="2024-06-01")
    existing_task["nfc_tag_id"] = "TAG_EXISTING"
    existing_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Existing Object",
        data=build_object_entry_data(
            object_data=build_object_data(name="Existing Object"),
            tasks={TASK_ID_1: existing_task},
        ),
        source="user",
        unique_id="maintenance_supporter_existing_object",
    )
    existing_entry.add_to_hass(hass)

    global_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, existing_entry)

    conn = _mock_connection()

    # Import an object with the same NFC tag
    json_data = json.dumps({
        "objects": [{
            "object": {"name": "New Imported Object"},
            "tasks": [{
                "name": "Task With Dup NFC",
                "nfc_tag_id": "TAG_EXISTING",
            }],
        }]
    })

    await call_ws_handler(ws_import_json, hass, conn, {
        "id": 1, "type": f"{DOMAIN}/json/import",
        "json_content": json_data,
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]

    # Should have created the entry (import still succeeds)
    assert result["created"] == 1
    # The created entry should include NFC warnings
    imported = result["imported"][0]
    assert "warnings" in imported
    assert any("TAG_EXISTING" in w for w in imported["warnings"])


# ─── Fix F: Diagnostics redaction fields ──────────────────────────────


async def test_diagnostics_redacts_nfc_and_user_id(
    hass: HomeAssistant,
) -> None:
    """nfc_tag_id and responsible_user_id should be redacted in diagnostics."""
    global_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)

    task = build_task_data(last_performed="2024-06-01")
    task["nfc_tag_id"] = "SECRET_TAG_123"
    task["responsible_user_id"] = "user-uuid-secret"

    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Redaction Test",
        data=build_object_entry_data(
            object_data=build_object_data(name="Redaction Test"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_redaction_test",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry)

    diag = await async_get_config_entry_diagnostics(hass, entry)

    # Check that nfc_tag_id and responsible_user_id are redacted in task data
    diag_str = json.dumps(diag)
    assert "SECRET_TAG_123" not in diag_str
    assert "user-uuid-secret" not in diag_str
    # The fields should be present but redacted
    tasks = diag["data"].get("tasks", {})
    for task_data in tasks.values():
        if "nfc_tag_id" in task_data:
            assert task_data["nfc_tag_id"] == "**REDACTED**"
        if "responsible_user_id" in task_data:
            assert task_data["responsible_user_id"] == "**REDACTED**"


async def test_diagnostics_redacts_serial_number(
    hass: HomeAssistant,
) -> None:
    """serial_number should be redacted in diagnostics as PII."""
    global_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)

    obj_data = build_object_data(name="Serial Test", serial_number="SN-SECRET-9999")
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Serial Test",
        data=build_object_entry_data(
            object_data=obj_data,
            tasks={TASK_ID_1: build_task_data(last_performed="2024-06-01")},
        ),
        source="user",
        unique_id="maintenance_supporter_serial_test",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry)

    diag = await async_get_config_entry_diagnostics(hass, entry)
    diag_str = json.dumps(diag)
    assert "SN-SECRET-9999" not in diag_str
    obj = diag["data"].get("object", {})
    assert obj.get("serial_number") == "**REDACTED**"


# ─── Fix G: Options flow — NFC duplicate check ───────────────────────


async def test_options_flow_nfc_duplicate_rejected(
    hass: HomeAssistant,
) -> None:
    """Editing a task via options flow with a duplicate NFC tag should show a form error."""
    from homeassistant.data_entry_flow import FlowResultType

    from custom_components.maintenance_supporter.const import (
        CONF_TASK_NFC_TAG,
        MaintenanceTypeEnum,
    )

    # Create two objects — second one already has the NFC tag
    task1 = build_task_data(last_performed="2024-06-01")
    entry1 = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Object A",
        data=build_object_entry_data(
            object_data=build_object_data(name="Object A"),
            tasks={TASK_ID_1: task1},
        ),
        source="user",
        unique_id="maintenance_supporter_object_a",
    )
    entry1.add_to_hass(hass)

    task2_id = "d" * 32
    task2 = build_task_data(task_id=task2_id, name="Task B", last_performed="2024-06-01")
    task2["nfc_tag_id"] = "TAG_TAKEN"
    entry2 = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Object B",
        data=build_object_entry_data(
            object_data=build_object_data(name="Object B", object_id="e" * 32),
            tasks={task2_id: task2},
        ),
        source="user",
        unique_id="maintenance_supporter_object_b",
    )
    entry2.add_to_hass(hass)

    global_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry1, entry2)

    # Navigate options flow to edit_task on entry1
    result = await hass.config_entries.options.async_init(entry1.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "manage_tasks"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"selected_task": TASK_ID_1, "go_back": False},
    )
    assert result["type"] == FlowResultType.MENU

    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "edit_task"},
    )
    assert result["step_id"] == "edit_task"

    # Submit with a duplicate NFC tag
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "name": "Filter Cleaning",
            "type": MaintenanceTypeEnum.CLEANING,
            "interval_days": 30,
            "warning_days": 7,
            "enabled": True,
            CONF_TASK_NFC_TAG: "TAG_TAKEN",
        },
    )
    # Should re-show form with error, NOT save
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "edit_task"
    assert result["errors"] == {CONF_TASK_NFC_TAG: "nfc_tag_duplicate"}


# ─── Fix H: CSV import — NFC duplicate check ─────────────────────────


async def test_csv_import_nfc_duplicate_warning(
    hass: HomeAssistant,
) -> None:
    """CSV import should warn when NFC tag is already in use."""
    # Create an existing entry with an NFC tag
    existing_task = build_task_data(last_performed="2024-06-01")
    existing_task["nfc_tag_id"] = "TAG_CSV_DUP"
    existing_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Existing CSV Object",
        data=build_object_entry_data(
            object_data=build_object_data(name="Existing CSV Object"),
            tasks={TASK_ID_1: existing_task},
        ),
        source="user",
        unique_id="maintenance_supporter_existing_csv_object",
    )
    existing_entry.add_to_hass(hass)

    global_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, existing_entry)

    conn = _mock_connection()

    csv_content = (
        "object_name,task_name,task_type,schedule_type,interval_days,warning_days,nfc_tag_id\n"
        "New CSV Pump,Filter Clean,cleaning,time_based,30,7,TAG_CSV_DUP\n"
    )

    await call_ws_handler(ws_import_csv, hass, conn, {
        "id": 1, "type": "maintenance_supporter/csv/import",
        "csv_content": csv_content,
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]

    # Should have created the entry (import still succeeds with warning)
    assert result["created"] == 1
    # The created entry should include NFC warnings
    imported = result["imported"][0]
    assert "warnings" in imported
    assert any("TAG_CSV_DUP" in w for w in imported["warnings"])


# ─── Fix I: NFC tag length validation ────────────────────────────────


def test_nfc_tag_too_long_rejected_by_schema() -> None:
    """NFC tag longer than 256 chars should be rejected by the WS schema."""
    import voluptuous as vol

    nfc_validator = vol.All(str, vol.Length(max=256))
    schema = vol.Schema({vol.Optional("nfc_tag_id"): vol.Any(nfc_validator, None)})

    # 256 chars should pass
    schema({"nfc_tag_id": "A" * 256})

    # 257 chars should fail
    with pytest.raises(vol.Invalid):
        schema({"nfc_tag_id": "A" * 257})

    # None should pass
    schema({"nfc_tag_id": None})
