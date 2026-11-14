"""#252: a task's own notification texts.

"Put the bins out tonight" says more than "Maintenance due soon". Per kind
(due soon, overdue, triggered, completed) a task can have its own title
and/or message; an empty field keeps the standard text. Placeholders are
the standard texts' ({task}, {object}, {days}, {due}; {detail} for a
trigger, {reason} and {person} for a completion), anything else stays as
written. Bundles and the quiet-hours summary list several tasks and keep
the standard texts; the title prefix (D#248) still goes in front.
"""

from __future__ import annotations

from typing import Any
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_NOTIFICATION_TITLE_PREFIX,
    CONF_NOTIFICATION_TITLE_STYLE,
    CONF_NOTIFY_COMPLETED,
    CONF_QUIET_HOURS_ENABLED,
    CONF_TASKS,
    MAX_NOTIFICATION_TEXT_MESSAGE_LENGTH,
    MAX_NOTIFICATION_TEXT_TITLE_LENGTH,
    MaintenanceStatus,
)
from custom_components.maintenance_supporter.export import build_export_data
from custom_components.maintenance_supporter.helpers.intent_speech import spoken_iso_date
from custom_components.maintenance_supporter.helpers.notification_manager import NotificationManager
from custom_components.maintenance_supporter.helpers.sanitize import cap_task_fields, sanitize_notification_texts
from custom_components.maintenance_supporter.helpers.task_apply import LIVE_FIELDS
from custom_components.maintenance_supporter.websocket.tasks import ws_create_task, ws_update_task

from .conftest import (
    TASK_ID_1,
    build_task_data,
    call_ws_handler,
    make_global_entry,
    make_object_entry,
    make_ws_connection,
    setup_integration,
)

BINS: dict[str, Any] = {
    "due_soon": {"title": "Bins tonight", "message": "Put the {task} out: {days} day(s), on {due}."},
    "overdue": {"message": "{task} at {object} is {days} day(s) late."},
}


def _global(hass: HomeAssistant, **options: Any) -> MockConfigEntry:
    return make_global_entry(hass, notifications_enabled=True, notify_service="notify.test", extra_data={CONF_QUIET_HOURS_ENABLED: False, **options})


def _object(hass: HomeAssistant, texts: dict[str, Any] | None) -> MockConfigEntry:
    task = build_task_data(task_id=TASK_ID_1, name="Bins")
    if texts is not None:
        task["notification_texts"] = texts
    return make_object_entry(hass, tasks={TASK_ID_1: task}, name="Kitchen", unique_id="ms_texts_252")


def _wire(hass: HomeAssistant) -> AsyncMock:
    calls = AsyncMock()
    hass.services.async_register("notify", "test", calls)
    return calls


async def _status(hass: HomeAssistant, obj: MockConfigEntry, status: str, days: int | None, due: str | None = None) -> dict[str, Any]:
    calls = _wire(hass)
    await NotificationManager(hass).async_task_status_changed(
        entry_id=obj.entry_id, task_id=TASK_ID_1, task_name="Bins", object_name="Kitchen", new_status=status, days_until_due=days, next_due=due
    )
    await hass.async_block_till_done()
    return dict(calls.call_args[0][0].data)


# ─── what is stored ──────────────────────────────────────────────────────────


def test_only_known_kinds_and_fields_are_kept_trimmed_and_capped() -> None:
    cleaned = sanitize_notification_texts(
        {
            "due_soon": {"title": "  Bins\n tonight ", "message": "  Line one\r\nline two  ", "icon": "mdi:x"},
            "overdue": {"title": "", "message": "   "},
            "triggered": {"title": "x" * 300, "message": "y" * 900},
            "weekly": {"title": "not a kind"},
            "completed": "not a mapping",
        }
    )
    assert cleaned == {
        "due_soon": {"title": "Bins tonight", "message": "Line one\nline two"},
        "triggered": {"title": "x" * MAX_NOTIFICATION_TEXT_TITLE_LENGTH, "message": "y" * MAX_NOTIFICATION_TEXT_MESSAGE_LENGTH},
    }


@pytest.mark.parametrize("raw", [None, [], "Bins", {}, {"due_soon": {"title": " "}}])
def test_nothing_left_is_the_standard_texts(raw: Any) -> None:
    assert sanitize_notification_texts(raw) is None
    task = {"name": "Bins", "notification_texts": raw}
    assert "notification_texts" not in cap_task_fields(task), "absence, not a stored null"


def test_a_text_edit_needs_no_reload() -> None:
    assert "notification_texts" in LIVE_FIELDS


async def test_create_and_update_store_clean_and_clear_them(hass: HomeAssistant) -> None:
    obj = make_object_entry(hass, tasks={})
    await setup_integration(hass, make_global_entry(hass), obj)
    conn = make_ws_connection()
    await call_ws_handler(
        ws_create_task,
        hass,
        conn,
        {"id": 1, "type": "maintenance_supporter/task/create", "entry_id": obj.entry_id, "name": "Bins", "notification_texts": {"due_soon": {"title": " Bins tonight "}}},
    )
    assert not conn.send_error.called, conn.send_error.call_args
    task_id, task = next(iter(obj.data[CONF_TASKS].items()))
    assert task["notification_texts"] == {"due_soon": {"title": "Bins tonight"}}

    async def update(texts: Any) -> dict[str, Any]:
        c = make_ws_connection()
        with patch.object(hass.config_entries, "async_reload", AsyncMock()) as reload:
            await call_ws_handler(
                ws_update_task,
                hass,
                c,
                {"id": 2, "type": "maintenance_supporter/task/update", "entry_id": obj.entry_id, "task_id": task_id, "notification_texts": texts},
            )
            await hass.async_block_till_done()
        assert not c.send_error.called, c.send_error.call_args
        assert not reload.called, "a text edit reloads nothing"
        return dict(obj.data[CONF_TASKS][task_id])

    assert (await update({"overdue": {"message": "Late!"}}))["notification_texts"] == {"overdue": {"message": "Late!"}}
    assert "notification_texts" not in await update(None), "null is the standard texts"
    assert "notification_texts" not in await update({"due_soon": {"title": ""}})


async def test_the_json_backup_carries_them(hass: HomeAssistant) -> None:
    obj = _object(hass, BINS)
    await setup_integration(hass, _global(hass), obj)
    exported = build_export_data(hass)
    task = next(t for o in exported["objects"] for t in o["tasks"] if t.get("name") == "Bins")
    assert task["notification_texts"] == BINS


# ─── what is sent ────────────────────────────────────────────────────────────


async def test_due_soon_and_overdue_use_the_tasks_own_texts(hass: HomeAssistant) -> None:
    _global(hass)
    obj = _object(hass, BINS)
    sent = await _status(hass, obj, MaintenanceStatus.DUE_SOON, 1, "2026-11-08")
    assert sent["title"] == "Bins tonight"
    # 2.121: {due} is the day written out ("November 8"), not the ISO date.
    assert sent["message"] == f"Put the Bins out: 1 day(s), on {spoken_iso_date('2026-11-08', 'en')}."
    assert "2026-11-08" not in sent["message"]
    sent = await _status(hass, obj, MaintenanceStatus.OVERDUE, -3)
    assert sent["title"] == "Maintenance Overdue!", "no own title: the standard one"
    assert sent["message"] == "Bins at Kitchen is 3 day(s) late."


async def test_without_own_texts_nothing_changes(hass: HomeAssistant) -> None:
    _global(hass)
    sent = await _status(hass, _object(hass, None), MaintenanceStatus.OVERDUE, -3)
    assert sent["title"] == "Maintenance Overdue!"
    assert sent["message"] == "Bins for Kitchen is 3 day(s) overdue!"


async def test_other_braces_stay_as_written(hass: HomeAssistant) -> None:
    """Not str.format: no attribute lookups, no crash on a stray brace."""
    _global(hass)
    texts = {"due_soon": {"message": "{task.__class__} {nope} {detail} { {due"}}
    sent = await _status(hass, _object(hass, texts), MaintenanceStatus.DUE_SOON, 2, "2026-11-09")
    assert sent["message"] == "{task.__class__} {nope} {detail} { {due"


async def test_the_title_prefix_still_goes_in_front_and_the_style_gives_way(hass: HomeAssistant) -> None:
    _global(hass, **{CONF_NOTIFICATION_TITLE_PREFIX: "Rental", CONF_NOTIFICATION_TITLE_STYLE: "object_name"})
    sent = await _status(hass, _object(hass, BINS), MaintenanceStatus.DUE_SOON, 1, "2026-11-08")
    assert sent["title"] == "Rental · Bins tonight"
    sent = await _status(hass, _object(hass, BINS), MaintenanceStatus.OVERDUE, -1)
    assert sent["title"] == "Rental · Kitchen", "no own title: the style's"


async def test_a_lead_reminder_speaks_the_due_soon_texts(hass: HomeAssistant) -> None:
    _global(hass)
    obj = _object(hass, BINS)
    calls = _wire(hass)
    await NotificationManager(hass).async_send_lead_reminder(obj.entry_id, TASK_ID_1, "Bins", "Kitchen", days=3, next_due="2026-11-10")
    await hass.async_block_till_done()
    sent = calls.call_args[0][0].data
    assert (sent["title"], sent["message"]) == ("Bins tonight", f"Put the Bins out: 3 day(s), on {spoken_iso_date('2026-11-10', 'en')}.")


def test_a_trigger_detail_takes_its_place_or_follows_on_its_own_line(hass: HomeAssistant) -> None:
    mgr = NotificationManager(hass)
    with_place = {"notification_texts": {"triggered": {"title": "Water!", "message": "The vacuum needs water ({detail})."}}}
    title, message = mgr._build_message(MaintenanceStatus.TRIGGERED, "en", "Tank", "Vacuum", None, None, task=with_place, detail="Tank: 4 %")
    assert (title, message) == ("Water!", "The vacuum needs water (Tank: 4 %).")
    without = {"notification_texts": {"triggered": {"message": "The vacuum needs water."}}}
    _, message = mgr._build_message(MaintenanceStatus.TRIGGERED, "en", "Tank", "Vacuum", None, None, task=without, detail="Tank: 4 %")
    assert message == "The vacuum needs water.\nTank: 4 %"
    _, message = mgr._build_message(MaintenanceStatus.TRIGGERED, "en", "Tank", "Vacuum", None, None, task={}, detail="Tank: 4 %")
    assert message.endswith("\nTank: 4 %") and message.startswith("Tank for Vacuum")


async def test_a_completion_uses_its_own_texts(hass: HomeAssistant) -> None:
    _global(hass, **{CONF_NOTIFY_COMPLETED: "all"})
    texts = {"completed": {"title": "Bins are out", "message": "{person} did it ({reason})."}}
    obj = _object(hass, texts)
    calls = _wire(hass)
    with patch("custom_components.maintenance_supporter.helpers.notification_manager.person_display_name", AsyncMock(return_value="Alice")):
        assert await NotificationManager(hass).async_task_completed(
            entry_id=obj.entry_id, task_id=TASK_ID_1, task_name="Bins", object_name="Kitchen", source="panel", completed_by="user-1"
        )
    await hass.async_block_till_done()
    sent = calls.call_args[0][0].data
    assert sent["title"] == "Bins are out"
    assert sent["message"].startswith("Alice did it (") and sent["message"].endswith(").")


async def test_a_bundle_keeps_the_standard_texts(hass: HomeAssistant) -> None:
    _global(hass)
    obj = _object(hass, BINS)
    calls = _wire(hass)
    await NotificationManager(hass).async_send_bundled(
        obj.entry_id, "Kitchen", [{"task_id": TASK_ID_1, "task_name": "Bins", "status": "due_soon"}, {"task_id": "t2", "task_name": "Sink", "status": "overdue"}]
    )
    await hass.async_block_till_done()
    sent = calls.call_args[0][0].data
    assert "Bins tonight" not in sent["title"] and "Put the" not in sent["message"]


def test_the_cleaning_gives_what_the_dialog_gives() -> None:
    """frontend-src/__tests__/notification-texts-252.test.ts checks the same
    vectors against cleanNotificationTexts (one cut, counted the same way:
    the dialog's cut once split an emoji, DRY audit round 7, X7-A2)."""
    import json
    from pathlib import Path

    path = Path(__file__).resolve().parents[1] / "custom_components" / "maintenance_supporter" / "frontend-src" / "__tests__" / "fixtures" / "notification-texts-vectors.json"
    vectors = json.loads(path.read_text(encoding="utf-8"))["vectors"]
    assert len(vectors) >= 8
    for v in vectors:
        got = sanitize_notification_texts(v["input"])
        assert got == v["expected"], v["note"]
        if got is not None:
            assert list(got) == list(v["expected"]), f"order: {v['note']}"
