"""Create demo maintenance objects via HA REST Config Flow API."""

import asyncio
import json
import aiohttp

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI5OTEzZjBiNTA0N2U0Njk2YWQwYWNkYzQ2MmIzYzNhOCIsImlhdCI6MTc3Mjg5MjA0OSwiZXhwIjoyMDg4MjUyMDQ5fQ.EH16GiuE3_f63XJw0LL1hy6UmHaeu76udOLkPirGcRE"
BASE = "http://localhost:8123"
HEADERS = {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}


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


async def start_options_flow(session, entry_id):
    async with session.post(
        f"{BASE}/api/config/config_entries/options/flow",
        headers=HEADERS,
        json={"handler": entry_id},
    ) as resp:
        return await resp.json()


async def post_options_step(session, flow_id, data):
    async with session.post(
        f"{BASE}/api/config/config_entries/options/flow/{flow_id}",
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

        elif task["schedule_type"] == "manual":
            form = {
                "warning_days": task.get("warning_days", 7),
            }
            if task.get("notes"):
                form["notes"] = task["notes"]
            r = await post_step(session, flow_id, form)
            print(f"    Configured -> {sid(r)}")

        elif task["schedule_type"] == "sensor_based":
            # sensor_select (key: trigger_entity — must be a list)
            r = await post_step(session, flow_id, {
                "trigger_entity": task["trigger_entity"],
            })
            print(f"    Sensor -> {sid(r)}")

            if sid(r) == "sensor_select":
                print("    ERROR: Entity rejected!")
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
                if "trigger_entity_logic" in task:
                    form["entity_logic"] = task["trigger_entity_logic"]
                r = await post_step(session, flow_id, form)

            elif task["trigger_type"] == "counter":
                form = {
                    "trigger_target_value": task["trigger_target_value"],
                    "trigger_delta_mode": task.get("trigger_delta_mode", False),
                    "interval_days": task.get("interval_days", 365),
                    "warning_days": task.get("warning_days", 7),
                }
                if "trigger_entity_logic" in task:
                    form["entity_logic"] = task["trigger_entity_logic"]
                r = await post_step(session, flow_id, form)

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

            elif task["trigger_type"] == "runtime":
                form = {
                    "trigger_runtime_hours": task["trigger_runtime_hours"],
                    "warning_days": task.get("warning_days", 7),
                }
                if "trigger_on_states" in task:
                    form["trigger_on_states"] = task["trigger_on_states"]
                if "interval_days" in task:
                    form["interval_days"] = task["interval_days"]
                r = await post_step(session, flow_id, form)

            elif task["trigger_type"] == "compound":
                r = await create_compound_conditions(session, flow_id, task)

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


async def create_compound_conditions(session, flow_id, task):
    """Walk through the compound trigger config flow steps."""
    r = await post_step(session, flow_id, {
        "compound_logic": task["compound_logic"],
    })
    print(f"    Compound logic -> {sid(r)}")

    for i, cond in enumerate(task["compound_conditions"]):
        r = await post_step(session, flow_id, {
            "trigger_entity": cond["trigger_entity"],
        })
        print(f"    Condition {i+1} entity -> {sid(r)}")

        r = await post_step(session, flow_id, {
            "trigger_type": cond["trigger_type"],
        })
        print(f"    Condition {i+1} type -> {sid(r)}")

        if cond["trigger_type"] == "threshold":
            form = {}
            if "trigger_above" in cond:
                form["trigger_above"] = cond["trigger_above"]
            if "trigger_below" in cond:
                form["trigger_below"] = cond["trigger_below"]
            if "trigger_for_minutes" in cond:
                form["trigger_for_minutes"] = cond["trigger_for_minutes"]
            r = await post_step(session, flow_id, form)
        elif cond["trigger_type"] == "counter":
            r = await post_step(session, flow_id, {
                "trigger_target_value": cond["trigger_target_value"],
                "trigger_delta_mode": cond.get("trigger_delta_mode", False),
            })
        elif cond["trigger_type"] == "state_change":
            form = {"trigger_target_changes": cond["trigger_target_changes"]}
            if "trigger_from_state" in cond:
                form["trigger_from_state"] = cond["trigger_from_state"]
            if "trigger_to_state" in cond:
                form["trigger_to_state"] = cond["trigger_to_state"]
            r = await post_step(session, flow_id, form)
        elif cond["trigger_type"] == "runtime":
            form = {"trigger_runtime_hours": cond["trigger_runtime_hours"]}
            if "trigger_on_states" in cond:
                form["trigger_on_states"] = cond["trigger_on_states"]
            r = await post_step(session, flow_id, form)

        print(f"    Condition {i+1} config -> {sid(r)}")

        is_last = i == len(task["compound_conditions"]) - 1
        r = await post_step(session, flow_id, {
            "compound_action": "finish" if is_last else "add",
        })
        print(f"    Review -> {sid(r)}")

    return r


async def ensure_global_entry(session):
    """Create the global config entry if it doesn't exist."""
    r = await start_flow(session)
    flow_id = r["flow_id"]
    step = sid(r)

    if step == "global_setup":
        print("=== Creating global config entry ===")
        r = await post_step(session, flow_id, {
            "default_warning_days": 7,
            "notifications_enabled": False,
            "notify_service": "",
        })
        if r.get("type") == "create_entry":
            print("  Global entry created!")
        else:
            print(f"  Global entry step -> {sid(r)}")
    elif step == "user":
        print("=== Global entry already exists ===")


async def find_global_entry_id(session):
    """Find the global config entry ID."""
    async with session.get(
        f"{BASE}/api/config/config_entries/entry",
        headers=HEADERS,
    ) as resp:
        entries = await resp.json()
    for e in entries:
        if e.get("domain") == "maintenance_supporter" and e.get("title") == "Maintenance Supporter":
            return e["entry_id"]
    return None


async def configure_global_options(session):
    """Enable advanced features and budget via options flow."""
    entry_id = await find_global_entry_id(session)
    if not entry_id:
        print("  WARNING: Global entry not found, skipping options")
        return

    print("\n=== Configuring global options ===")

    # --- Enable panel + general settings ---
    r = await start_options_flow(session, entry_id)
    flow_id = r["flow_id"]
    print(f"  Options flow started -> {sid(r)}")

    r = await post_options_step(session, flow_id, {"next_step_id": "general_settings"})
    print(f"  Menu -> {sid(r)}")
    r = await post_options_step(session, flow_id, {
        "panel_enabled": True,
        "notifications_enabled": False,
        "notify_service": "",
    })
    print(f"  General (panel enabled) -> {sid(r)}")

    # --- Enable all advanced features ---
    r = await post_options_step(session, flow_id, {"next_step_id": "advanced_features"})
    print(f"  Menu -> {sid(r)}")

    # Enable all features
    r = await post_options_step(session, flow_id, {
        "advanced_adaptive_visible": True,
        "advanced_predictions_visible": True,
        "advanced_seasonal_visible": True,
        "advanced_environmental_visible": True,
        "advanced_budget_visible": True,
        "advanced_groups_visible": True,
        "advanced_checklists_visible": True,
    })
    print(f"  Advanced features -> {sid(r)}")

    # Navigate to budget_settings
    r = await post_options_step(session, flow_id, {"next_step_id": "budget_settings"})
    print(f"  Menu -> {sid(r)}")

    # Set budget
    r = await post_options_step(session, flow_id, {
        "budget_monthly": 150.0,
        "budget_yearly": 1500.0,
        "budget_alerts_enabled": True,
        "budget_alert_threshold": 80,
    })
    print(f"  Budget -> {sid(r)}")

    # Done
    r = await post_options_step(session, flow_id, {"next_step_id": "done"})
    print(f"  Done -> {sid(r)}")


async def main():
    async with aiohttp.ClientSession() as session:
        await ensure_global_entry(session)

        # 1: HVAC System - Threshold on airflow below 60%
        await create_object_with_tasks(session, "HVAC System", "Daikin", "FTXM35R", [
            {
                "name": "Filter Replacement",
                "type": "replacement",
                "schedule_type": "sensor_based",
                "trigger_entity": ["input_number.hvac_filter_airflow"],
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
                "trigger_entity": ["input_number.car_odometer"],
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
                "trigger_entity": ["input_boolean.washing_machine_running"],
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
                "trigger_entity": ["input_number.water_softener_salt_level"],
                "trigger_type": "threshold",
                "trigger_below": 20.0,
                "warning_days": 7,
            },
        ])

        # 5: Workshop Compressor - Runtime trigger (500h)
        await create_object_with_tasks(session, "Workshop Compressor", "Atlas Copco", "GA5", [
            {
                "name": "Oil Change",
                "type": "service",
                "schedule_type": "sensor_based",
                "trigger_entity": ["input_boolean.workshop_compressor"],
                "trigger_type": "runtime",
                "trigger_runtime_hours": 500,
                "trigger_on_states": "on",
                "interval_days": 365,
                "warning_days": 14,
            },
            {
                "name": "Air Filter",
                "type": "replacement",
                "schedule_type": "time_based",
                "interval_days": 180,
                "warning_days": 14,
            },
        ])

        # 6: Water Filter System - Compound trigger (OR)
        await create_object_with_tasks(session, "Water Filter System", "BWT", "AQA Life S", [
            {
                "name": "Cartridge Replacement",
                "type": "replacement",
                "schedule_type": "sensor_based",
                "trigger_entity": ["input_number.water_filter_flow_rate"],
                "trigger_type": "compound",
                "compound_logic": "or",
                "compound_conditions": [
                    {
                        "trigger_entity": ["input_number.water_filter_flow_rate"],
                        "trigger_type": "threshold",
                        "trigger_below": 2.0,
                    },
                    {
                        "trigger_entity": ["input_number.water_filter_total_liters"],
                        "trigger_type": "counter",
                        "trigger_target_value": 10000,
                        "trigger_delta_mode": True,
                    },
                ],
            },
        ])

        # 7: Swimming Pool - Manual schedule + time-based
        await create_object_with_tasks(session, "Swimming Pool", "", "", [
            {
                "name": "pH Test",
                "type": "inspection",
                "schedule_type": "manual",
                "warning_days": 3,
                "notes": "Test pH weekly, adjust chemicals as needed",
            },
            {
                "name": "Water Treatment",
                "type": "cleaning",
                "schedule_type": "time_based",
                "interval_days": 7,
                "warning_days": 1,
            },
        ])

        # 8: 3D Printer - Counter (absolute) + time-based lubrication
        await create_object_with_tasks(session, "3D Printer", "Prusa", "MK4S", [
            {
                "name": "Nozzle Replacement",
                "type": "replacement",
                "schedule_type": "sensor_based",
                "trigger_entity": ["input_number.printer_page_count"],
                "trigger_type": "counter",
                "trigger_target_value": 5000,
                "trigger_delta_mode": False,
                "interval_days": 365,
                "warning_days": 7,
            },
            {
                "name": "Lubrication",
                "type": "service",
                "schedule_type": "time_based",
                "interval_days": 60,
                "warning_days": 7,
            },
        ])

        # 9: Electric Car - Multi-entity threshold (4 tire sensors) + various triggers
        await create_object_with_tasks(session, "Electric Car", "Tesla", "Model 3", [
            {
                "name": "Tire Pressure Check",
                "type": "inspection",
                "schedule_type": "sensor_based",
                "trigger_entity": [
                    "input_number.ev_tire_pressure_fl",
                    "input_number.ev_tire_pressure_fr",
                    "input_number.ev_tire_pressure_rl",
                    "input_number.ev_tire_pressure_rr",
                ],
                "trigger_type": "threshold",
                "trigger_below": 2.0,
                "trigger_entity_logic": "any",
                "warning_days": 3,
            },
            {
                "name": "Brake Pad Inspection",
                "type": "inspection",
                "schedule_type": "sensor_based",
                "trigger_entity": ["input_number.ev_brake_pad_thickness"],
                "trigger_type": "threshold",
                "trigger_below": 3.0,
                "interval_days": 365,
                "warning_days": 30,
            },
            {
                "name": "Cabin Air Filter",
                "type": "replacement",
                "schedule_type": "time_based",
                "interval_days": 365,
                "warning_days": 30,
                "last_performed": "2025-09-15",
            },
            {
                "name": "Wiper Blades",
                "type": "replacement",
                "schedule_type": "time_based",
                "interval_days": 365,
                "warning_days": 14,
            },
            {
                "name": "Battery Health Check",
                "type": "inspection",
                "schedule_type": "sensor_based",
                "trigger_entity": ["input_number.ev_battery_soh"],
                "trigger_type": "threshold",
                "trigger_below": 85.0,
                "interval_days": 365,
                "warning_days": 30,
            },
            {
                "name": "Charging Cycle Log",
                "type": "service",
                "schedule_type": "sensor_based",
                "trigger_entity": ["input_boolean.ev_charging"],
                "trigger_type": "runtime",
                "trigger_runtime_hours": 1000,
                "trigger_on_states": "on",
                "interval_days": 365,
                "warning_days": 14,
            },
        ])

        # Configure global options (advanced features + budget)
        await configure_global_options(session)

    print("\n=== ALL DONE ===")


asyncio.run(main())
