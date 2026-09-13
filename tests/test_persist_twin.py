"""One create rule for tasks (DRY review 2026-09-12, backlog):
``helpers.entry_tasks.insert_new_task`` is the sync core behind the
``task/create`` WS command / ``add_task`` service (``async_persist_task``) and
the options flow's ``_save_new_task``.

Pins: the record lands normalised with the id appended to the object's
``task_ids`` and the Store state initialised; the per-object cap raises the
same ``ValueError`` for both callers; the options flow at the cap returns to
its menu without writing; the WS path saves and reloads, the flow does not
reload from the core (its done step does).
"""

from __future__ import annotations

from typing import Any
from unittest.mock import patch

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_OBJECT, CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID, MAX_TASKS_PER_OBJECT
from custom_components.maintenance_supporter.helpers.entry_tasks import insert_new_task
from custom_components.maintenance_supporter.websocket.tasks_persist import async_persist_task

from .conftest import build_global_entry_data, build_object_entry_data, setup_integration


async def _setup(hass: HomeAssistant) -> MockConfigEntry:
    g = MockConfigEntry(version=1, minor_version=1, domain=DOMAIN, title="Maintenance Supporter", data=build_global_entry_data(), source="user", unique_id=GLOBAL_UNIQUE_ID)
    g.add_to_hass(hass)
    obj = MockConfigEntry(version=1, minor_version=2, domain=DOMAIN, title="Persist", data=build_object_entry_data(), source="user", unique_id="maintenance_supporter_persist_twin")
    obj.add_to_hass(hass)
    await setup_integration(hass, g, obj)
    return obj


def _record(task_id: str, **extra: Any) -> dict[str, Any]:
    return {"id": task_id, "name": f"Task {task_id}", "type": "custom", "schedule_type": "time_based", "interval_days": 30, "warning_days": 7, **extra}


async def test_core_writes_record_task_ids_and_store_state(hass: HomeAssistant) -> None:
    obj = await _setup(hass)
    before = len(obj.data[CONF_TASKS])
    store = insert_new_task(hass, obj, _record("t_core"), last_performed="2026-08-01")
    assert store is obj.runtime_data.store
    assert "t_core" in obj.data[CONF_TASKS] and len(obj.data[CONF_TASKS]) == before + 1
    saved = obj.data[CONF_TASKS]["t_core"]
    assert "schedule" in saved, "normalised to the nested schedule shape"
    assert saved["schedule"] == {"kind": "interval", "every": 30}
    assert obj.data[CONF_OBJECT]["task_ids"][-1] == "t_core"
    assert store.get_last_performed("t_core") == "2026-08-01"
    # idempotent on the task_ids list
    insert_new_task(hass, obj, _record("t_core"))
    assert obj.data[CONF_OBJECT]["task_ids"].count("t_core") == 1


async def test_cap_is_the_same_rule_for_ws_and_flow(hass: HomeAssistant) -> None:
    obj = await _setup(hass)
    filler = {f"f{i}": _record(f"f{i}") for i in range(MAX_TASKS_PER_OBJECT - len(obj.data[CONF_TASKS]))}
    hass.config_entries.async_update_entry(obj, data={**obj.data, CONF_TASKS: {**obj.data[CONF_TASKS], **filler}})
    assert len(obj.data[CONF_TASKS]) == MAX_TASKS_PER_OBJECT
    with pytest.raises(ValueError, match="maximum"):
        insert_new_task(hass, obj, _record("one_too_many"))
    with pytest.raises(ValueError, match="maximum"):
        await async_persist_task(hass, obj, _record("one_too_many_ws"))
    assert "one_too_many" not in obj.data[CONF_TASKS] and "one_too_many_ws" not in obj.data[CONF_TASKS]


async def test_ws_path_saves_and_reloads_via_the_core(hass: HomeAssistant) -> None:
    obj = await _setup(hass)
    with patch("custom_components.maintenance_supporter.websocket.tasks_persist.insert_new_task", wraps=insert_new_task) as core, \
         patch.object(hass.config_entries, "async_reload", wraps=hass.config_entries.async_reload) as reload:
        await async_persist_task(hass, obj, _record("t_ws"), last_performed="2026-07-01", history=[{"timestamp": "2026-07-01T10:00:00+00:00", "type": "completed"}])
    core.assert_called_once()
    reload.assert_awaited_once_with(obj.entry_id)
    await hass.async_block_till_done()
    assert obj.runtime_data.store.get_history("t_ws")[0]["type"] == "completed"


async def test_flow_save_uses_the_core_and_returns_to_menu_at_cap(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.config_flow_options_task_base import _OptionsFlowBase

    obj = await _setup(hass)
    flow = _OptionsFlowBase.__new__(_OptionsFlowBase)
    flow.hass = hass
    flow.handler = obj.entry_id  # OptionsFlow.config_entry derives from the handler id
    flow._current_task = {"name": "From flow", "schedule_type": "time_based", "interval_days": 14, "warning_days": 3, "last_performed": "2026-06-01"}
    with patch.object(flow, "_show_init_menu", return_value={"type": "menu"}) as menu, \
         patch("custom_components.maintenance_supporter.helpers.entry_tasks.insert_new_task", wraps=insert_new_task) as core:
        assert flow._save_new_task() == {"type": "menu"}
    core.assert_called_once()
    menu.assert_called_once()
    new_ids = [tid for tid, td in obj.data[CONF_TASKS].items() if td.get("name") == "From flow"]
    assert len(new_ids) == 1 and new_ids[0] in obj.data[CONF_OBJECT]["task_ids"]
    assert obj.runtime_data.store.get_last_performed(new_ids[0]) == "2026-06-01"
    assert flow._current_task == {}
    # at the cap the flow refuses through the same ValueError and returns to the menu
    filler = {f"f{i}": _record(f"f{i}") for i in range(MAX_TASKS_PER_OBJECT - len(obj.data[CONF_TASKS]))}
    hass.config_entries.async_update_entry(obj, data={**obj.data, CONF_TASKS: {**obj.data[CONF_TASKS], **filler}})
    flow._current_task = {"name": "Over the cap", "schedule_type": "time_based", "interval_days": 14, "warning_days": 3}
    with patch.object(flow, "_show_init_menu", return_value={"type": "menu"}):
        assert flow._save_new_task() == {"type": "menu"}
    assert not any(td.get("name") == "Over the cap" for td in obj.data[CONF_TASKS].values())
