"""Journey B3: one task, every completion surface, identical envelope.

See docs/design/user-journeys.md — users complete tasks from six different
surfaces. Every one of them must produce the same result: a COMPLETED
history entry and a task_completed bus event carrying the full
identification envelope (entry_id, task_id, task_name, object_name).
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import MagicMock

import pytest
from homeassistant.core import Event, HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    DOMAIN,
    EVENT_TASK_COMPLETED,
    GLOBAL_UNIQUE_ID,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    setup_integration,
)


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _conn() -> MagicMock:
    conn = MagicMock()
    conn.user = MagicMock(is_admin=True)
    return conn


async def test_every_completion_surface_produces_the_same_envelope(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    task = build_task_data(
        task_id=TASK_ID_1, name="Filter Swap",
        last_performed=(dt_util.now().date() - timedelta(days=40)).isoformat(),
        interval_days=30,
    )
    task["nfc_tag_id"] = "b3-nfc-tag"
    task["quick_complete_defaults"] = {"notes": "qc"}
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Espresso",
        data=build_object_entry_data(
            object_data=build_object_data(name="Espresso"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_b3",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    events: list[Event] = []
    hass.bus.async_listen(EVENT_TASK_COMPLETED, events.append)

    from homeassistant.helpers import entity_registry as er

    reg = er.async_get(hass)
    entities = {
        e.unique_id: e.entity_id
        for e in er.async_entries_for_config_entry(reg, obj_entry.entry_id)
    }
    sensor_eid = entities[f"maintenance_supporter_espresso_{TASK_ID_1}"]
    button_eid = entities[f"maintenance_supporter_espresso_{TASK_ID_1}_complete"]

    async def surface_ws() -> None:
        from custom_components.maintenance_supporter.websocket.tasks_actions import (
            ws_complete_task,
        )

        await call_ws_handler(ws_complete_task, hass, _conn(), {
            "id": 1, "type": "maintenance_supporter/task/complete",
            "entry_id": obj_entry.entry_id, "task_id": TASK_ID_1,
        })

    async def surface_service() -> None:
        await hass.services.async_call(
            DOMAIN, "complete", {"entity_id": sensor_eid}, blocking=True,
        )

    async def surface_button() -> None:
        await hass.services.async_call(
            "button", "press", {"entity_id": button_eid}, blocking=True,
        )

    async def surface_todo() -> None:
        from homeassistant.components.todo import TodoItem, TodoItemStatus

        todo_eid = next(
            e.entity_id for e in reg.entities.values() if e.domain == "todo"
        )
        entity = hass.data["todo"].get_entity(todo_eid)
        await entity.async_update_todo_item(
            TodoItem(
                uid=f"{obj_entry.entry_id}:{TASK_ID_1}", summary="x",
                status=TodoItemStatus.COMPLETED,
            )
        )

    async def surface_quick_complete() -> None:
        from custom_components.maintenance_supporter.websocket.tasks_actions import (
            ws_quick_complete_task,
        )

        await call_ws_handler(ws_quick_complete_task, hass, _conn(), {
            "id": 1, "type": "maintenance_supporter/task/quick_complete",
            "entry_id": obj_entry.entry_id, "task_id": TASK_ID_1,
        })

    async def surface_nfc() -> None:
        hass.bus.async_fire(
            "tag_scanned", {"tag_id": "b3-nfc-tag", "device_id": "phone"},
        )

    surfaces: dict[str, Any] = {
        "ws": surface_ws,
        "service": surface_service,
        "button": surface_button,
        "todo": surface_todo,
        "quick_complete": surface_quick_complete,
        "nfc": surface_nfc,
    }

    from custom_components.maintenance_supporter.websocket.tasks_actions import (
        ws_reset_task,
    )

    for name, run in surfaces.items():
        before = len(events)
        await run()
        await hass.async_block_till_done()
        assert len(events) == before + 1, f"surface {name!r} fired {len(events) - before} events"
        payload = events[-1].data
        # The identification envelope every listener may rely on.
        assert payload["entry_id"] == obj_entry.entry_id, name
        assert payload["task_id"] == TASK_ID_1, name
        assert payload["task_name"] == "Filter Swap", name
        assert payload["object_name"] == "Espresso", name

        # History gained exactly one completion.
        coordinator = obj_entry.runtime_data.coordinator
        history = coordinator._get_merged_tasks_data()[TASK_ID_1]["history"]
        completions = [h for h in history if h.get("type") == "completed"]
        assert len(completions) == list(surfaces).index(name) + 1, name

        # Re-arm for the next surface: reset far into the past so the task is
        # overdue again (todo check-off needs a needs-action item).
        long_ago = (dt_util.now().date() - timedelta(days=40)).isoformat()
        await call_ws_handler(ws_reset_task, hass, _conn(), {
            "id": 99, "type": "maintenance_supporter/task/reset",
            "entry_id": obj_entry.entry_id, "task_id": TASK_ID_1,
            "date": long_ago,
        })
        await hass.async_block_till_done()
