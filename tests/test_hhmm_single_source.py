"""``schedule_time`` / quiet-hours times: one parser, canonical "HH:MM".

Pins (DRY/drift round 2026-09-12): ``helpers.dates.parse_hhmm`` accepts
"HH:MM" and the TimeSelector's "HH:MM:SS" with range checks and is the only
parser the sensor, the calendar and the model use (no more hand-copied
``split(":")`` blocks); ``normalize_hhmm`` yields "HH:MM"; a JSON/CSV import
of a task exported with "09:00:00" keeps the time as "09:00" instead of
dropping it; the options flow stores quiet hours as "HH:MM" so the
5-char settings-registry cap no longer drops them on export/import.
"""

from __future__ import annotations

import json
import re
from datetime import time
from pathlib import Path

from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_QUIET_HOURS_ENABLED,
    CONF_QUIET_HOURS_END,
    CONF_QUIET_HOURS_START,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.helpers.csv_handler import import_objects_csv
from custom_components.maintenance_supporter.helpers.dates import normalize_hhmm, parse_hhmm
from custom_components.maintenance_supporter.helpers.settings_registry import STR_MAX_LENGTHS
from custom_components.maintenance_supporter.websocket.io import ws_import_json

from .conftest import build_global_entry_data, call_ws_handler, make_global_entry, make_ws_connection, setup_integration

_PACKAGE = Path(__file__).resolve().parent.parent / "custom_components" / "maintenance_supporter"


def test_parse_and_normalize_hhmm() -> None:
    assert parse_hhmm("09:05") == time(9, 5)
    assert parse_hhmm("09:05:30") == time(9, 5), "TimeSelector seconds are dropped"
    assert parse_hhmm(" 23:59 ") == time(23, 59)
    for bad in ("25:00", "12:60", "9:5", "garbage", "", None, 930, "12:00:60"):
        assert parse_hhmm(bad) is None, bad
    assert normalize_hhmm("22:00:00") == "22:00" and normalize_hhmm("08:30") == "08:30"
    assert normalize_hhmm("nope") is None and normalize_hhmm(None) is None
    assert len("22:00") == STR_MAX_LENGTHS[CONF_QUIET_HOURS_START]


def test_no_hand_copied_time_parser_left() -> None:
    offenders = [str(p.relative_to(_PACKAGE)) for p in _PACKAGE.rglob("*.py") if p.name != "dates.py" and re.search(r'schedule_time\)?\.split\(":"\)', p.read_text(encoding="utf-8"))]
    assert not offenders, offenders


async def test_json_import_keeps_a_time_selector_value_as_hhmm(hass: HomeAssistant) -> None:
    await setup_integration(hass, make_global_entry(hass))
    conn = make_ws_connection()
    data = json.dumps({"version": 1, "objects": [{"object": {"name": "Sched"}, "tasks": [{"name": "Morning", "schedule_type": "time_based", "interval_days": 7, "schedule_time": "09:00:00"}, {"name": "Bad", "schedule_type": "time_based", "interval_days": 7, "schedule_time": "25:00"}]}]})
    await call_ws_handler(ws_import_json, hass, conn, {"id": 1, "type": "maintenance_supporter/json/import", "json_content": data})
    entry = hass.config_entries.async_get_entry(conn.send_result.call_args[0][1]["imported"][0]["entry_id"])
    assert entry is not None
    tasks = {t["name"]: t for t in entry.data[CONF_TASKS].values()}
    assert tasks["Morning"]["schedule_time"] == "09:00"
    assert "schedule_time" not in tasks["Bad"]


def test_csv_import_keeps_a_time_selector_value_as_hhmm() -> None:
    csv = "object_name,task_name,task_type,schedule_type,interval_days,interval_anchor,schedule_time,warning_days\nPump,Svc,service,time_based,7,completion,09:00:00,1\n"
    task = next(iter(import_objects_csv(csv)[0]["tasks"].values()))
    assert task["schedule_time"] == "09:00"


async def test_options_flow_stores_quiet_hours_as_hhmm(hass: HomeAssistant) -> None:
    data = build_global_entry_data(notifications_enabled=True, notify_service="notify.test")
    entry = MockConfigEntry(version=1, minor_version=1, domain=DOMAIN, title="Maintenance Supporter", data=data, source="user", unique_id=GLOBAL_UNIQUE_ID)
    entry.add_to_hass(hass)
    await setup_integration(hass, entry)
    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "notification_settings"})
    result = await hass.config_entries.options.async_configure(result["flow_id"], user_input={CONF_QUIET_HOURS_ENABLED: True, CONF_QUIET_HOURS_START: "22:00:00", CONF_QUIET_HOURS_END: "08:30:00"})
    assert result["type"] == FlowResultType.MENU
    assert entry.options[CONF_QUIET_HOURS_START] == "22:00" and entry.options[CONF_QUIET_HOURS_END] == "08:30"
