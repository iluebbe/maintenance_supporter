"""Create demo maintenance objects via HA REST Config Flow API."""

import asyncio
import json
import aiohttp

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkMmMyZGFiN2E3YzA0Yjc1YWU3MmUzYTNhOWRkMTlhNSIsImlhdCI6MTc3MDQ5NTAxOCwiZXhwIjoxODAyMDMxMDE4fQ.d4f4zyg6oPH6Anf5MoNgCZrjZjgnPVSun_-dZR9Y8fs"
BASE = "http://localhost:8123"
HEADERS = {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}

# REST API field names map to vol.Schema keys (CONF_* values in const.py):
#   CONF_TASK_NAME = "name"
#   CONF_TASK_TYPE = "type"
#   CONF_TASK_SCHEDULE_TYPE = "schedule_type"
#   CONF_TASK_INTERVAL_DAYS = "interval_days"
#   CONF_TASK_WARNING_DAYS = "warning_days"
#   CONF_TRIGGER_ENTITY = "trigger_entity"
#   CONF_TRIGGER_ATTRIBUTE = "trigger_attribute"
#   CONF_TRIGGER_TYPE = "trigger_type"
#   CONF_TRIGGER_ABOVE = "trigger_above"
#   CONF_TRIGGER_BELOW = "trigger_below"
#   CONF_TRIGGER_FOR_MINUTES = "trigger_for_minutes"
#   CONF_TRIGGER_TARGET_VALUE = "trigger_target_value"
#   CONF_TRIGGER_DELTA_MODE = "trigger_delta_mode"
#   CONF_TRIGGER_FROM_STATE = "trigger_from_state"
#   CONF_TRIGGER_TO_STATE = "trigger_to_state"
#   CONF_TRIGGER_TARGET_CHANGES = "trigger_target_changes"


async def start_flow(session):
    async with session.post(
        f"{BASE}/api/config/config_entries/flow",
        headers=HEADERS,
        json={"handler": "maintenance_supporter"},
    ) as resp:
        return await resp.json()


async def post_step(session, flow_id, data):
    async with session.post(
        f"{BASE}/api/config/config_entries/flow/{flow_id}",
        headers=HEADERS,
        json=data,
    ) as resp:
        r = await resp.json()
        if r.get("errors"):
            print(f"    ERRORS: {r['errors']}")
        return r


def sid(r):
    return r.get("step_id", r.get("type", "?"))


async def create_object_with_tasks(session, name, manufacturer, model, tasks):
    print(f"\n=== Creating {name} ===")

    r = await start_flow(session)
    flow_id = r["flow_id"]

    # Menu -> create_object
    r = await post_step(session, flow_id, {"next_step_id": "create_object"})

    # Object details
    r = await post_step(session, flow_id, {
        "name": name,
        "manufacturer": manufacturer,
        "model": model,
    })
    print(f"  Object -> {sid(r)}")

    for task in tasks:
        # task_menu -> add_task
        r = await post_step(session, flow_id, {"next_step_id": "add_task"})

        # add_task form (keys: name, type, schedule_type)
        r = await post_step(session, flow_id, {
            "name": task["name"],
            "type": task["type"],
            "schedule_type": task["schedule_type"],
        })
        print(f"  Task '{task['name']}' -> {sid(r)}")

        if task["schedule_type"] == "time_based":
            form = {
                "interval_days": task["interval_days"],
                "warning_days": task.get("warning_days", 7),
            }
            if task.get("last_performed"):
                form["last_performed"] = task["last_performed"]
            r = await post_step(session, flow_id, form)
            print(f"    Configured -> {sid(r)}")

        elif task["schedule_type"] == "sensor_based":
            # sensor_select (key: trigger_entity)
            r = await post_step(session, flow_id, {
                "trigger_entity": task["trigger_entity"],
            })
            print(f"    Sensor -> {sid(r)}")

            if sid(r) == "sensor_select":
                print(f"    ERROR: Entity rejected!")
                continue

            # sensor_attribute (key: trigger_attribute)
            r = await post_step(session, flow_id, {
                "trigger_attribute": task.get("trigger_attribute", "_state"),
            })
            print(f"    Attribute -> {sid(r)}")

            # trigger_type (key: trigger_type)
            r = await post_step(session, flow_id, {
                "trigger_type": task["trigger_type"],
            })
            print(f"    Type -> {sid(r)}")

            # Trigger-specific config
            if task["trigger_type"] == "threshold":
                form = {"warning_days": task.get("warning_days", 7)}
                if "trigger_above" in task:
                    form["trigger_above"] = task["trigger_above"]
                if "trigger_below" in task:
                    form["trigger_below"] = task["trigger_below"]
                if "trigger_for_minutes" in task:
                    form["trigger_for_minutes"] = task["trigger_for_minutes"]
                if "interval_days" in task:
                    form["interval_days"] = task["interval_days"]
                r = await post_step(session, flow_id, form)

            elif task["trigger_type"] == "counter":
                r = await post_step(session, flow_id, {
                    "trigger_target_value": task["trigger_target_value"],
                    "trigger_delta_mode": task.get("trigger_delta_mode", False),
                    "interval_days": task.get("interval_days", 365),
                    "warning_days": task.get("warning_days", 7),
                })

            elif task["trigger_type"] == "state_change":
                form = {
                    "trigger_target_changes": task["trigger_target_changes"],
                    "warning_days": task.get("warning_days", 7),
                }
                if "trigger_from_state" in task:
                    form["trigger_from_state"] = task["trigger_from_state"]
                if "trigger_to_state" in task:
                    form["trigger_to_state"] = task["trigger_to_state"]
                if "interval_days" in task:
                    form["interval_days"] = task["interval_days"]
                r = await post_step(session, flow_id, form)

            print(f"    Done -> {sid(r)}")

    # Finish
    r = await post_step(session, flow_id, {"next_step_id": "finish"})
    if r.get("type") == "create_entry":
        eid = r.get("result", {}).get("entry_id", "?")
        print(f"  OK {name} created! entry_id={eid}")
        return eid
    else:
        print(f"  FAIL: type={r.get('type')}")
        print(f"  {json.dumps(r, indent=2)[:300]}")
        return None


async def main():
    async with aiohttp.ClientSession() as session:
        # 1: HVAC System - Threshold on airflow below 60%
        await create_object_with_tasks(session, "HVAC System", "Daikin", "FTXM35R", [
            {
                "name": "Filter Replacement",
                "type": "replacement",
                "schedule_type": "sensor_based",
                "trigger_entity": "input_number.hvac_filter_airflow",
                "trigger_type": "threshold",
                "trigger_below": 60.0,
                "trigger_for_minutes": 30,
                "interval_days": 90,
                "warning_days": 14,
            },
        ])

        # 2: Family Car - Counter on odometer delta + time-based tire rotation
        await create_object_with_tasks(session, "Family Car", "VW", "Golf VIII", [
            {
                "name": "Oil Change",
                "type": "service",
                "schedule_type": "sensor_based",
                "trigger_entity": "input_number.car_odometer",
                "trigger_type": "counter",
                "trigger_target_value": 15000,
                "trigger_delta_mode": True,
                "interval_days": 365,
                "warning_days": 30,
            },
            {
                "name": "Tire Rotation",
                "type": "inspection",
                "schedule_type": "time_based",
                "interval_days": 180,
                "warning_days": 14,
                "last_performed": "2025-11-01",
            },
        ])

        # 3: Washing Machine - State change trigger on/off cycles
        await create_object_with_tasks(session, "Washing Machine", "Bosch", "WAX32M92", [
            {
                "name": "Drum Cleaning",
                "type": "cleaning",
                "schedule_type": "sensor_based",
                "trigger_entity": "input_boolean.washing_machine_running",
                "trigger_type": "state_change",
                "trigger_from_state": "on",
                "trigger_to_state": "off",
                "trigger_target_changes": 50,
                "interval_days": 180,
                "warning_days": 14,
            },
        ])

        # 4: Water Softener - Threshold on salt level below 20%
        await create_object_with_tasks(session, "Water Softener", "BWT", "Perla Silk M", [
            {
                "name": "Refill Salt",
                "type": "replacement",
                "schedule_type": "sensor_based",
                "trigger_entity": "input_number.water_softener_salt_level",
                "trigger_type": "threshold",
                "trigger_below": 20.0,
                "warning_days": 7,
            },
        ])

    print("\n=== ALL DONE ===")


asyncio.run(main())
