"""Journey: away for two weeks — the app stays quiet (L cross-feature).

Vacation mode silences due/overdue reminders for the trip, except for tasks the
user marked exempt (feed the cat, water the plants). The decision is persisted
in the global options; the per-module tests check the predicate, this walks the
real NotificationManager: during the window a normal overdue task produces NO
notification while an exempt one still does, the decision survives a restart,
and once the window ends notifications resume — without the suppressed ones
having been "used up" (vacation returns before the repeat-gate stamp).

See docs/design/user-journeys.md (L cross-feature: vacation interplay).
"""

from __future__ import annotations

from unittest.mock import AsyncMock

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter import NOTIFICATION_MANAGER_KEY
from custom_components.maintenance_supporter.const import (
    CONF_QUIET_HOURS_ENABLED,
    CONF_VACATION_ENABLED,
    CONF_VACATION_END,
    CONF_VACATION_EXEMPT_TASK_IDS,
    CONF_VACATION_START,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.helpers.vacation import get_vacation_state

from .conftest import (
    build_global_entry_data,
    setup_integration,
)
from .journey import simulate_restart

_NORMAL = "task_normal"
_EXEMPT = "task_exempt"


def _global_data(**vacation: object) -> dict[str, object]:
    return {
        **build_global_entry_data(notifications_enabled=True, notify_service="notify.test"),
        # Disable quiet hours so it doesn't confound the vacation assertions
        # (quiet hours is a separate suppression gate, on by default).
        CONF_QUIET_HOURS_ENABLED: False,
        **vacation,
    }


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=_global_data(
            **{
                CONF_VACATION_ENABLED: True,
                CONF_VACATION_START: "2026-07-01",
                CONF_VACATION_END: "2026-07-31",
                CONF_VACATION_EXEMPT_TASK_IDS: [_EXEMPT],
            }
        ),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


async def _overdue(hass: HomeAssistant, task_id: str) -> None:
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    await nm.async_task_status_changed(
        "entry_x", task_id, f"Task {task_id}", "Object", "overdue", days_until_due=-3
    )
    await hass.async_block_till_done()


async def test_vacation_silences_overdue_except_exempt_then_resumes(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    # The freeze-independent anchor is real "today" (the vacation window brackets
    # July 2026); the suite runs inside it. Guard against a future clock drift.
    assert get_vacation_state(hass).is_active(), "test fixture window must cover the run date"

    mock = AsyncMock()
    hass.services.async_register("notify", "test", mock)
    await setup_integration(hass, global_entry)

    # During vacation: a normal overdue task is silent...
    await _overdue(hass, _NORMAL)
    assert not mock.called, "normal task notified during vacation"

    # ...but an exempt task still fires.
    mock.reset_mock()
    await _overdue(hass, _EXEMPT)
    assert mock.called, "exempt task was wrongly silenced during vacation"

    # The decision is config-driven and survives a restart.
    await simulate_restart(hass, global_entry)
    assert get_vacation_state(hass).is_silent_for(_NORMAL) is True
    assert get_vacation_state(hass).is_silent_for(_EXEMPT) is False
    mock.reset_mock()
    await _overdue(hass, _NORMAL)
    assert not mock.called, "normal task notified during vacation after restart"

    # Vacation ends → the previously-suppressed task resumes (it was never
    # "used up": vacation returns before the repeat-gate stamp). The effective
    # config is read from entry.options (setup mirrors data → options), so the
    # toggle must be written there.
    ge = hass.config_entries.async_get_entry(global_entry.entry_id)
    effective = dict(ge.options or ge.data)
    hass.config_entries.async_update_entry(ge, options={**effective, CONF_VACATION_ENABLED: False})
    await hass.async_block_till_done()
    assert get_vacation_state(hass).is_active() is False

    mock.reset_mock()
    await _overdue(hass, _NORMAL)
    assert mock.called, "notifications did not resume after vacation ended"
