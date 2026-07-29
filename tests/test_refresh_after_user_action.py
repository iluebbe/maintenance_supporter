"""A change a person just made must be visible at once.

`DataUpdateCoordinator.async_request_refresh` is debounced, and Home
Assistant's default window is **ten seconds**
(`REQUEST_REFRESH_DEFAULT_COOLDOWN`). Every user action used it, so a *second*
action within that window had its recompute coalesced to the end of it: the
data was correct throughout, but the computed status the whole UI reads stayed
stale for up to ten seconds and the change looked like it had done nothing.

Found while reviewing #111 — assign a user, then postpone — but the pairing is
incidental. These tests use the reported order and a few others, because what
matters is that the SECOND action is not swallowed, whatever it is.

The trigger path deliberately keeps the debounce; that is what the window is
for, and `test_the_trigger_path_stays_debounced` pins it.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.websocket.tasks_actions import (
    ws_complete_task,
    ws_postpone_task,
)
from custom_components.maintenance_supporter.websocket.users import ws_assign_user

from .conftest import (
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_ws_connection,
    setup_integration,
)

TASK_A = "task_1"
TASK_B = "task_2"


async def _setup(hass: HomeAssistant) -> MockConfigEntry:
    g = MockConfigEntry(
        version=1,
        minor_version=4,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    g.add_to_hass(hass)

    a: dict[str, Any] = build_task_data(interval_days=30, last_performed="2020-01-01")
    a["name"] = "Change Filter"
    b: dict[str, Any] = build_task_data(interval_days=30, last_performed="2020-01-01")
    b["name"] = "Grease Rails"
    obj = MockConfigEntry(
        version=1,
        minor_version=4,
        domain=DOMAIN,
        title="Boiler",
        data=build_object_entry_data(
            object_data=build_object_data(name="Boiler", object_id="boiler"),
            tasks={TASK_A: a, TASK_B: b},
        ),
        source="user",
        unique_id="maintenance_supporter_boiler",
    )
    obj.add_to_hass(hass)
    await setup_integration(hass, g, obj)
    return obj


def _computed(hass: HomeAssistant, entry: MockConfigEntry, task_id: str) -> dict[str, Any]:
    """What every surface reads: the coordinator's CACHED computation."""
    ce = hass.config_entries.async_get_entry(entry.entry_id)
    return dict(ce.runtime_data.coordinator.data[CONF_TASKS][task_id])


async def _ws(hass: HomeAssistant, handler, msg: dict[str, Any]) -> None:
    conn = make_ws_connection()
    await call_ws_handler(handler, hass, conn, msg)
    assert conn.send_error.call_count == 0, conn.send_error.call_args


# ─── the reported case ────────────────────────────────────────────────────


async def test_postponing_right_after_assigning_shows_at_once(hass: HomeAssistant) -> None:
    """The exact reported order. Before the fix the postpone was stored but the
    computed due date stayed on the old value for up to ten seconds."""
    user = await hass.auth.async_create_user("Alice")
    entry = await _setup(hass)
    target = (dt_util.now().date() + timedelta(days=30)).isoformat()

    await _ws(
        hass,
        ws_assign_user,
        {"id": 1, "type": f"{DOMAIN}/task/assign_user", "entry_id": entry.entry_id, "task_id": TASK_A, "user_id": user.id},
    )
    await _ws(
        hass,
        ws_postpone_task,
        {"id": 2, "type": f"{DOMAIN}/task/postpone", "entry_id": entry.entry_id, "task_id": TASK_A, "until": target},
    )

    computed = _computed(hass, entry, TASK_A)
    assert computed["_next_due"][:10] == target, (
        "the postpone is stored but the computed due date is stale — "
        f"got {computed['_next_due']}"
    )
    assert computed["_status"] != "overdue"


async def test_postponing_without_a_preceding_action_still_works(hass: HomeAssistant) -> None:
    """The case that always worked — pinned so a fix cannot trade one for the
    other."""
    entry = await _setup(hass)
    target = (dt_util.now().date() + timedelta(days=30)).isoformat()

    await _ws(
        hass,
        ws_postpone_task,
        {"id": 1, "type": f"{DOMAIN}/task/postpone", "entry_id": entry.entry_id, "task_id": TASK_A, "until": target},
    )

    assert _computed(hass, entry, TASK_A)["_next_due"][:10] == target


# ─── the same window, other pairings ──────────────────────────────────────


async def test_a_second_completion_on_one_object_shows_at_once(hass: HomeAssistant) -> None:
    """Nothing about this was specific to assign+postpone: two completions on
    the same object land in the same window, and the second one's status is
    what a bulk action shows."""
    entry = await _setup(hass)

    await _ws(hass, ws_complete_task, {"id": 1, "type": f"{DOMAIN}/task/complete", "entry_id": entry.entry_id, "task_id": TASK_A})
    await _ws(hass, ws_complete_task, {"id": 2, "type": f"{DOMAIN}/task/complete", "entry_id": entry.entry_id, "task_id": TASK_B})

    second = _computed(hass, entry, TASK_B)
    assert second["_status"] == "ok", f"the second completion still reads {second['_status']}"
    assert second["_days_until_due"] is not None and second["_days_until_due"] > 0


async def test_postponing_right_after_completing_another_task(hass: HomeAssistant) -> None:
    entry = await _setup(hass)
    target = (dt_util.now().date() + timedelta(days=45)).isoformat()

    await _ws(hass, ws_complete_task, {"id": 1, "type": f"{DOMAIN}/task/complete", "entry_id": entry.entry_id, "task_id": TASK_A})
    await _ws(
        hass,
        ws_postpone_task,
        {"id": 2, "type": f"{DOMAIN}/task/postpone", "entry_id": entry.entry_id, "task_id": TASK_B, "until": target},
    )

    assert _computed(hass, entry, TASK_B)["_next_due"][:10] == target


@pytest.mark.parametrize("repeats", [3, 5])
async def test_a_burst_of_actions_all_land(hass: HomeAssistant, repeats: int) -> None:
    """A bulk action is just this window hit N times. Every one of them has to
    be visible, not only the first."""
    entry = await _setup(hass)
    user = await hass.auth.async_create_user("Alice")

    for i in range(repeats):
        await _ws(
            hass,
            ws_assign_user,
            {"id": i, "type": f"{DOMAIN}/task/assign_user", "entry_id": entry.entry_id, "task_id": TASK_A, "user_id": user.id},
        )
    target = (dt_util.now().date() + timedelta(days=7)).isoformat()
    await _ws(
        hass,
        ws_postpone_task,
        {"id": 99, "type": f"{DOMAIN}/task/postpone", "entry_id": entry.entry_id, "task_id": TASK_A, "until": target},
    )

    assert _computed(hass, entry, TASK_A)["_next_due"][:10] == target


# ─── what must NOT change ─────────────────────────────────────────────────


async def test_the_trigger_path_stays_debounced(hass: HomeAssistant) -> None:
    """The ten-second window exists for trigger churn — a counter entity can
    change many times a minute. Making user actions immediate must not take
    that protection away from the path that needs it."""
    from pathlib import Path

    src = Path(__file__).parent.parent / "custom_components" / "maintenance_supporter"
    counter = (src / "entity" / "triggers" / "counter.py").read_text(encoding="utf-8")
    assert "async_request_refresh()" in counter, (
        "the trigger path lost its debounce — a noisy counter now recomputes "
        "the object on every state change"
    )
    # The comment there names async_refresh_now to point readers at the other
    # path, so assert on the CALL rather than the mention.
    assert "async_refresh_now()" not in counter


async def test_no_user_action_path_still_uses_the_debounced_refresh() -> None:
    """A new user-facing mutation that reaches for `async_request_refresh`
    reintroduces the bug silently. Only the trigger path may use it."""
    from pathlib import Path

    src = Path(__file__).parent.parent / "custom_components" / "maintenance_supporter"
    allowed = {"entity/triggers/counter.py", "entity/summary_coordinator.py"}
    offenders = []
    for path in src.rglob("*.py"):
        rel = path.relative_to(src).as_posix()
        if rel in allowed:
            continue
        if "async_request_refresh()" in path.read_text(encoding="utf-8"):
            offenders.append(rel)
    assert not offenders, (
        "user-action paths must call async_refresh_now() — async_request_refresh "
        f"coalesces into a ten-second window: {offenders}"
    )
