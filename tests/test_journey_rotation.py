"""Journey: whose turn is it? (C5 rotation-advance persistence blind spot).

A shared chore rotates through the household: an assignee_pool of three users
with round_robin. Each completion must advance the responsible user to the next
pool member AND persist that pointer — the "rotation never persisted since
2.17" bug was exactly a rotated pointer that evaporated on the next reload, so
the chore silently stuck on one person. This walks several completions with a
restart mid-cycle and asserts the pointer both advances and survives.

See docs/design/user-journeys.md (C5 re-assign user / change rotation pool).
"""

from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock

import pytest
from freezegun import freeze_time
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.websocket.objects import ws_get_objects
from custom_components.maintenance_supporter.websocket.tasks import ws_complete_task

from .conftest import (
    make_ws_connection as _conn,
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    setup_integration,
)
from .journey import simulate_restart


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




async def _responsible(hass: HomeAssistant, entry_id: str) -> str | None:
    conn = _conn()
    await call_ws_handler(ws_get_objects, hass, conn, {"id": 1, "type": "maintenance_supporter/objects"})
    payload = conn.send_result.call_args.args[1]
    for obj in payload["objects"]:
        if obj["entry_id"] == entry_id:
            for task in obj["tasks"]:
                if task["id"] == TASK_ID_1:
                    return task.get("responsible_user_id")
    raise AssertionError("task not found")


async def _complete(hass: HomeAssistant, entry_id: str) -> None:
    await call_ws_handler(
        ws_complete_task,
        hass,
        _conn(),
        {"id": 1, "type": "maintenance_supporter/task/complete", "entry_id": entry_id, "task_id": TASK_ID_1},
    )
    await hass.async_block_till_done()


async def test_round_robin_pointer_advances_and_survives_restart(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    a = await hass.auth.async_create_user("Alice")
    b = await hass.auth.async_create_user("Bob")
    c = await hass.auth.async_create_user("Cara")
    pool = [a.id, b.id, c.id]

    task: dict[str, Any] = build_task_data(interval_days=30, last_performed="2026-03-01")
    task["assignee_pool"] = pool
    task["rotation_strategy"] = "round_robin"
    task["responsible_user_id"] = a.id

    obj = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Kitchen Bin",
        data=build_object_entry_data(
            object_data=build_object_data(name="Kitchen Bin", object_id="objid_bin"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_kitchen_bin",
    )
    obj.add_to_hass(hass)
    with freeze_time("2026-03-10 09:00:00"):
        await setup_integration(hass, global_entry, obj)
        assert await _responsible(hass, obj.entry_id) == a.id, "starts with Alice"

    # round_robin advances by pool index: a → b → c → a. Completions are spaced
    # days apart so the 30 s double-tap dedup window never collapses two of them.
    # First completion → Bob.
    with freeze_time("2026-03-11 09:00:00"):
        await _complete(hass, obj.entry_id)
    assert await _responsible(hass, obj.entry_id) == b.id, "first completion must advance to Bob"

    # Restart BEFORE the next completion: the advanced pointer must persist
    # (this is the exact "rotation evaporates on reload" regression).
    await simulate_restart(hass, obj)
    obj = hass.config_entries.async_get_entry(obj.entry_id)
    assert await _responsible(hass, obj.entry_id) == b.id, "advanced pointer lost across restart"

    # Second completion → Cara.
    with freeze_time("2026-03-12 09:00:00"):
        await _complete(hass, obj.entry_id)
    assert await _responsible(hass, obj.entry_id) == c.id, "second completion must advance to Cara"

    # Third completion → wraps back to Alice.
    with freeze_time("2026-03-13 09:00:00"):
        await _complete(hass, obj.entry_id)
    assert await _responsible(hass, obj.entry_id) == a.id, "round_robin must wrap back to Alice"

    # And the wrap survives a restart too.
    await simulate_restart(hass, obj)
    obj = hass.config_entries.async_get_entry(obj.entry_id)
    assert await _responsible(hass, obj.entry_id) == a.id, "wrapped pointer lost across restart"



def _notifying_global_entry(hass: HomeAssistant) -> MockConfigEntry:
    """Global entry with notifications actually switched on.

    The per-status enables live in `options` (that is what the manager reads);
    setting only `data` leaves every status gate closed and the notification
    is silently dropped — which is exactly how the first version of these
    tests "passed" nothing.
    """
    from custom_components.maintenance_supporter.const import (
        CONF_NOTIFICATIONS_ENABLED,
        CONF_NOTIFY_OVERDUE_ENABLED,
        CONF_NOTIFY_OVERDUE_INTERVAL,
        CONF_NOTIFY_SERVICE,
        CONF_QUIET_HOURS_ENABLED,
    )

    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(notifications_enabled=True, notify_service="notify.household_fallback"),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
        options={
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "notify.household_fallback",
            CONF_NOTIFY_OVERDUE_ENABLED: True,
            CONF_NOTIFY_OVERDUE_INTERVAL: 12,
            CONF_QUIET_HOURS_ENABLED: False,
        },
    )
    entry.add_to_hass(hass)
    return entry


async def test_the_reminder_follows_the_rotation(hass: HomeAssistant) -> None:
    """The seam between two separately-tested mechanisms: the rotation moves
    the responsible user, and notifications route to the responsible user's
    own phone. Each half was covered; the JOIN was not — so nothing proved
    that after Alice completes the chore, the next reminder reaches BOB.

    That join is the whole point of a household rotation: if it breaks, the
    pointer keeps advancing correctly while every reminder keeps arriving on
    one person's phone, and nobody notices until the chore is skipped.
    """
    from unittest.mock import AsyncMock, patch

    from custom_components.maintenance_supporter.const import NOTIFICATION_MANAGER_KEY

    a = await hass.auth.async_create_user("Alice")
    b = await hass.auth.async_create_user("Bob")

    global_entry = _notifying_global_entry(hass)

    task: dict[str, Any] = build_task_data(interval_days=30, last_performed="2026-03-01")
    task["assignee_pool"] = [a.id, b.id]
    task["rotation_strategy"] = "round_robin"
    task["responsible_user_id"] = a.id

    obj = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Kitchen Bin",
        data=build_object_entry_data(
            object_data=build_object_data(name="Kitchen Bin", object_id="objid_notify"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_kitchen_notify",
    )
    obj.add_to_hass(hass)

    with freeze_time("2026-03-10 09:00:00"):
        await setup_integration(hass, global_entry, obj)

    nm = hass.data.get(DOMAIN, {}).get(NOTIFICATION_MANAGER_KEY)
    assert nm is not None, "notification manager not registered"

    # Each household member's phone, resolved through the REAL per-user
    # lookup the coordinator uses (patched at its own seam so the test does
    # not depend on mobile_app config entries existing).
    phones = {a.id: ["notify.mobile_app_alice"], b.id: ["notify.mobile_app_bob"]}

    async def _reminder_target(entry, task_id) -> str | None:
        """Fire the status-change notification the coordinator would fire and
        report which service it actually went to."""
        sent: list[str] = []

        async def _call(domain, service, data, **kw):
            sent.append(f"{domain}.{service}")

        current = await _responsible(hass, entry.entry_id)
        with (
            patch.object(nm, "hass") as mock_hass,
            patch(
                "custom_components.maintenance_supporter.helpers.notification_manager."
                "get_user_notify_services",
                new=AsyncMock(side_effect=lambda _h, uid: phones.get(uid, [])),
            ),
        ):
            mock_hass.services = MagicMock()
            mock_hass.services.async_call = AsyncMock(side_effect=_call)
            mock_hass.config_entries = hass.config_entries
            nm.clear_task_state(entry.entry_id, task_id)
            await nm.async_task_status_changed(
                entry_id=entry.entry_id,
                task_id=task_id,
                task_name="Filter Cleaning",
                object_name="Kitchen Bin",
                new_status="overdue",
                days_until_due=-1,
                responsible_user_id=current,
            )
        return sent[0] if sent else None

    # 1. Alice is on duty — the reminder is hers.
    assert await _reminder_target(obj, TASK_ID_1) == "notify.mobile_app_alice"

    # 2. She does the chore; the rotation hands over to Bob.
    with freeze_time("2026-03-11 09:00:00"):
        await call_ws_handler(
            ws_complete_task,
            hass,
            _conn(),
            {"id": 1, "type": "maintenance_supporter/task/complete", "entry_id": obj.entry_id, "task_id": TASK_ID_1},
        )
        await hass.async_block_till_done()
    assert await _responsible(hass, obj.entry_id) == b.id, "rotation did not advance"

    # 3. The NEXT reminder must reach Bob — not Alice, and not the household
    #    fallback service.
    target = await _reminder_target(obj, TASK_ID_1)
    assert target == "notify.mobile_app_bob", f"reminder did not follow the rotation: {target}"

    # 4. And the value the COORDINATOR hands the notifier is that same rotated
    #    user — the actual wiring line, not just our own lookup. Without this
    #    the test would still pass if the coordinator stopped passing the
    #    field and every reminder fell back to the household service.
    from custom_components.maintenance_supporter.const import CONF_TASKS

    coordinator = hass.config_entries.async_get_entry(obj.entry_id).runtime_data.coordinator
    await coordinator.async_refresh()
    assert coordinator.data[CONF_TASKS][TASK_ID_1]["responsible_user_id"] == b.id


async def test_reminder_falls_back_when_the_person_on_duty_has_no_phone(hass: HomeAssistant) -> None:
    """A pool member without a Companion device must not silently swallow the
    reminder — it falls back to the household service."""
    from unittest.mock import AsyncMock, patch

    from custom_components.maintenance_supporter.const import NOTIFICATION_MANAGER_KEY

    a = await hass.auth.async_create_user("Alice")

    global_entry = _notifying_global_entry(hass)

    task: dict[str, Any] = build_task_data(interval_days=30, last_performed="2026-03-01")
    task["responsible_user_id"] = a.id
    obj = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Kitchen Bin",
        data=build_object_entry_data(
            object_data=build_object_data(name="Kitchen Bin", object_id="objid_nofallback"),
            tasks={TASK_ID_1: task},
        ),
        source="user", unique_id="maintenance_supporter_kitchen_fallback",
    )
    obj.add_to_hass(hass)
    with freeze_time("2026-03-10 09:00:00"):
        await setup_integration(hass, global_entry, obj)

    nm = hass.data.get(DOMAIN, {}).get(NOTIFICATION_MANAGER_KEY)
    sent: list[str] = []

    async def _call(domain, service, data, **kw):
        sent.append(f"{domain}.{service}")

    with (
        patch.object(nm, "hass") as mock_hass,
        patch(
            "custom_components.maintenance_supporter.helpers.notification_manager."
            "get_user_notify_services",
            new=AsyncMock(return_value=[]),
        ),
    ):
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock(side_effect=_call)
        mock_hass.config_entries = hass.config_entries
        await nm.async_task_status_changed(
            entry_id=obj.entry_id, task_id=TASK_ID_1, task_name="Filter Cleaning",
            object_name="Kitchen Bin", new_status="overdue", days_until_due=-1,
            responsible_user_id=a.id,
        )

    assert sent == ["notify.household_fallback"], sent
