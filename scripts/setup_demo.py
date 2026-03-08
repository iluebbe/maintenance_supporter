"""Create demo maintenance objects via HA REST Config Flow API.

Uses the `requests` library (pip install requests).
Token resolution: HA_TOKEN env var > docker/.env file.
Idempotent: skips objects that already exist by name.
"""

import json
import os
import sys
from pathlib import Path

import requests

BASE = os.environ.get("HA_URL", "http://localhost:8123")


def get_token() -> str:
    """Resolve HA token: env var > docker/.env file."""
    if t := os.environ.get("HA_TOKEN"):
        return t
    env_path = Path(__file__).parent.parent / "docker" / ".env"
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            if line.startswith("HA_TOKEN="):
                return line.split("=", 1)[1].strip()
    print("ERROR: No HA_TOKEN found. Set HA_TOKEN env var or create docker/.env", file=sys.stderr)
    sys.exit(1)


TOKEN = get_token()
HEADERS = {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}


# ---------------------------------------------------------------------------
# REST helpers
# ---------------------------------------------------------------------------

def start_flow() -> dict:
    r = requests.post(f"{BASE}/api/config/config_entries/flow",
                      headers=HEADERS, json={"handler": "maintenance_supporter"})
    r.raise_for_status()
    return r.json()


def post_step(flow_id: str, data: dict) -> dict:
    r = requests.post(f"{BASE}/api/config/config_entries/flow/{flow_id}",
                      headers=HEADERS, json=data)
    r.raise_for_status()
    result = r.json()
    if result.get("errors"):
        print(f"    ERRORS: {result['errors']}")
    return result


def start_options_flow(entry_id: str) -> dict:
    r = requests.post(f"{BASE}/api/config/config_entries/options/flow",
                      headers=HEADERS, json={"handler": entry_id})
    r.raise_for_status()
    return r.json()


def post_options_step(flow_id: str, data: dict) -> dict:
    r = requests.post(f"{BASE}/api/config/config_entries/options/flow/{flow_id}",
                      headers=HEADERS, json=data)
    r.raise_for_status()
    result = r.json()
    if result.get("errors"):
        print(f"    ERRORS: {result['errors']}")
    return result


def sid(r: dict) -> str:
    return r.get("step_id", r.get("type", "?"))


# ---------------------------------------------------------------------------
# Idempotency: check existing objects
# ---------------------------------------------------------------------------

def get_existing_object_names() -> set[str]:
    """Return set of existing maintenance_supporter object names."""
    r = requests.get(f"{BASE}/api/config/config_entries/entry", headers=HEADERS)
    r.raise_for_status()
    names: set[str] = set()
    for entry in r.json():
        if entry.get("domain") == "maintenance_supporter" and entry.get("title") != "Maintenance Supporter":
            names.add(entry["title"])
    return names


# ---------------------------------------------------------------------------
# Object creation
# ---------------------------------------------------------------------------

def create_object_with_tasks(name: str, manufacturer: str, model: str,
                             tasks: list[dict]) -> str | None:
    print(f"\n=== Creating {name} ===")

    r = start_flow()
    flow_id = r["flow_id"]

    # Menu -> create_object
    r = post_step(flow_id, {"next_step_id": "create_object"})

    # Object details
    r = post_step(flow_id, {"name": name, "manufacturer": manufacturer, "model": model})
    print(f"  Object -> {sid(r)}")

    for task in tasks:
        # task_menu -> add_task
        r = post_step(flow_id, {"next_step_id": "add_task"})

        # add_task form
        r = post_step(flow_id, {
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
            r = post_step(flow_id, form)
            print(f"    Configured -> {sid(r)}")

        elif task["schedule_type"] == "manual":
            form = {"warning_days": task.get("warning_days", 7)}
            if task.get("notes"):
                form["notes"] = task["notes"]
            r = post_step(flow_id, form)
            print(f"    Configured -> {sid(r)}")

        elif task["schedule_type"] == "sensor_based":
            # sensor_select
            r = post_step(flow_id, {"trigger_entity": task["trigger_entity"]})
            print(f"    Sensor -> {sid(r)}")

            if sid(r) == "sensor_select":
                print("    ERROR: Entity rejected!")
                continue

            # sensor_attribute
            r = post_step(flow_id, {"trigger_attribute": task.get("trigger_attribute", "_state")})
            print(f"    Attribute -> {sid(r)}")

            # trigger_type
            r = post_step(flow_id, {"trigger_type": task["trigger_type"]})
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
                r = post_step(flow_id, form)

            elif task["trigger_type"] == "counter":
                form = {
                    "trigger_target_value": task["trigger_target_value"],
                    "trigger_delta_mode": task.get("trigger_delta_mode", False),
                    "interval_days": task.get("interval_days", 365),
                    "warning_days": task.get("warning_days", 7),
                }
                if "trigger_entity_logic" in task:
                    form["entity_logic"] = task["trigger_entity_logic"]
                r = post_step(flow_id, form)

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
                r = post_step(flow_id, form)

            elif task["trigger_type"] == "runtime":
                form = {
                    "trigger_runtime_hours": task["trigger_runtime_hours"],
                    "warning_days": task.get("warning_days", 7),
                }
                if "trigger_on_states" in task:
                    form["trigger_on_states"] = task["trigger_on_states"]
                if "interval_days" in task:
                    form["interval_days"] = task["interval_days"]
                r = post_step(flow_id, form)

            elif task["trigger_type"] == "compound":
                r = create_compound_conditions(flow_id, task)

            print(f"    Done -> {sid(r)}")

    # Finish
    r = post_step(flow_id, {"next_step_id": "finish"})
    if r.get("type") == "create_entry":
        eid = r.get("result", {}).get("entry_id", "?")
        print(f"  OK {name} created! entry_id={eid}")
        return eid
    else:
        print(f"  FAIL: type={r.get('type')}")
        print(f"  {json.dumps(r, indent=2)[:300]}")
        return None


def create_compound_conditions(flow_id: str, task: dict) -> dict:
    """Walk through the compound trigger config flow steps."""
    r = post_step(flow_id, {"compound_logic": task["compound_logic"]})
    print(f"    Compound logic -> {sid(r)}")

    for i, cond in enumerate(task["compound_conditions"]):
        r = post_step(flow_id, {"trigger_entity": cond["trigger_entity"]})
        print(f"    Condition {i+1} entity -> {sid(r)}")

        r = post_step(flow_id, {"trigger_type": cond["trigger_type"]})
        print(f"    Condition {i+1} type -> {sid(r)}")

        if cond["trigger_type"] == "threshold":
            form = {}
            if "trigger_above" in cond:
                form["trigger_above"] = cond["trigger_above"]
            if "trigger_below" in cond:
                form["trigger_below"] = cond["trigger_below"]
            if "trigger_for_minutes" in cond:
                form["trigger_for_minutes"] = cond["trigger_for_minutes"]
            r = post_step(flow_id, form)
        elif cond["trigger_type"] == "counter":
            r = post_step(flow_id, {
                "trigger_target_value": cond["trigger_target_value"],
                "trigger_delta_mode": cond.get("trigger_delta_mode", False),
            })
        elif cond["trigger_type"] == "state_change":
            form = {"trigger_target_changes": cond["trigger_target_changes"]}
            if "trigger_from_state" in cond:
                form["trigger_from_state"] = cond["trigger_from_state"]
            if "trigger_to_state" in cond:
                form["trigger_to_state"] = cond["trigger_to_state"]
            r = post_step(flow_id, form)
        elif cond["trigger_type"] == "runtime":
            form = {"trigger_runtime_hours": cond["trigger_runtime_hours"]}
            if "trigger_on_states" in cond:
                form["trigger_on_states"] = cond["trigger_on_states"]
            r = post_step(flow_id, form)

        print(f"    Condition {i+1} config -> {sid(r)}")

        is_last = i == len(task["compound_conditions"]) - 1
        r = post_step(flow_id, {"compound_action": "finish" if is_last else "add"})
        print(f"    Review -> {sid(r)}")

    return r


def ensure_global_entry() -> None:
    """Create the global config entry if it doesn't exist."""
    r = start_flow()
    flow_id = r["flow_id"]
    step = sid(r)

    if step == "global_setup":
        print("=== Creating global config entry ===")
        r = post_step(flow_id, {
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


def find_global_entry_id() -> str | None:
    """Find the global config entry ID."""
    r = requests.get(f"{BASE}/api/config/config_entries/entry", headers=HEADERS)
    r.raise_for_status()
    for e in r.json():
        if e.get("domain") == "maintenance_supporter" and e.get("title") == "Maintenance Supporter":
            return e["entry_id"]
    return None


def configure_global_options() -> None:
    """Enable advanced features and budget via options flow."""
    entry_id = find_global_entry_id()
    if not entry_id:
        print("  WARNING: Global entry not found, skipping options")
        return

    print("\n=== Configuring global options ===")

    r = start_options_flow(entry_id)
    flow_id = r["flow_id"]
    print(f"  Options flow started -> {sid(r)}")

    r = post_options_step(flow_id, {"next_step_id": "general_settings"})
    print(f"  Menu -> {sid(r)}")
    r = post_options_step(flow_id, {
        "panel_enabled": True,
        "notifications_enabled": False,
        "notify_service": "",
    })
    print(f"  General (panel enabled) -> {sid(r)}")

    r = post_options_step(flow_id, {"next_step_id": "advanced_features"})
    print(f"  Menu -> {sid(r)}")
    r = post_options_step(flow_id, {
        "advanced_adaptive_visible": True,
        "advanced_predictions_visible": True,
        "advanced_seasonal_visible": True,
        "advanced_environmental_visible": True,
        "advanced_budget_visible": True,
        "advanced_groups_visible": True,
        "advanced_checklists_visible": True,
    })
    print(f"  Advanced features -> {sid(r)}")

    r = post_options_step(flow_id, {"next_step_id": "budget_settings"})
    print(f"  Menu -> {sid(r)}")
    r = post_options_step(flow_id, {
        "budget_monthly": 150.0,
        "budget_yearly": 1500.0,
        "budget_alerts_enabled": True,
        "budget_alert_threshold": 80,
    })
    print(f"  Budget -> {sid(r)}")

    r = post_options_step(flow_id, {"next_step_id": "done"})
    print(f"  Done -> {sid(r)}")


# ---------------------------------------------------------------------------
# Demo object definitions
# ---------------------------------------------------------------------------

DEMO_OBJECTS = [
    ("HVAC System", "Daikin", "FTXM35R", [
        {"name": "Filter Replacement", "type": "replacement", "schedule_type": "sensor_based",
         "trigger_entity": ["input_number.hvac_filter_airflow"], "trigger_type": "threshold",
         "trigger_below": 60.0, "trigger_for_minutes": 30, "interval_days": 90, "warning_days": 14},
    ]),
    ("Family Car", "VW", "Golf VIII", [
        {"name": "Oil Change", "type": "service", "schedule_type": "sensor_based",
         "trigger_entity": ["input_number.car_odometer"], "trigger_type": "counter",
         "trigger_target_value": 15000, "trigger_delta_mode": True, "interval_days": 365, "warning_days": 30},
        {"name": "Tire Rotation", "type": "inspection", "schedule_type": "time_based",
         "interval_days": 180, "warning_days": 14, "last_performed": "2025-11-01"},
    ]),
    ("Washing Machine", "Bosch", "WAX32M92", [
        {"name": "Drum Cleaning", "type": "cleaning", "schedule_type": "sensor_based",
         "trigger_entity": ["input_boolean.washing_machine_running"], "trigger_type": "state_change",
         "trigger_from_state": "on", "trigger_to_state": "off", "trigger_target_changes": 50,
         "interval_days": 180, "warning_days": 14},
    ]),
    ("Water Softener", "BWT", "Perla Silk M", [
        {"name": "Refill Salt", "type": "replacement", "schedule_type": "sensor_based",
         "trigger_entity": ["input_number.water_softener_salt_level"], "trigger_type": "threshold",
         "trigger_below": 20.0, "warning_days": 7},
    ]),
    ("Workshop Compressor", "Atlas Copco", "GA5", [
        {"name": "Oil Change", "type": "service", "schedule_type": "sensor_based",
         "trigger_entity": ["input_boolean.workshop_compressor"], "trigger_type": "runtime",
         "trigger_runtime_hours": 500, "trigger_on_states": "on", "interval_days": 365, "warning_days": 14},
        {"name": "Air Filter", "type": "replacement", "schedule_type": "time_based",
         "interval_days": 180, "warning_days": 14},
    ]),
    ("Water Filter System", "BWT", "AQA Life S", [
        {"name": "Cartridge Replacement", "type": "replacement", "schedule_type": "sensor_based",
         "trigger_entity": ["input_number.water_filter_flow_rate"], "trigger_type": "compound",
         "compound_logic": "or", "compound_conditions": [
             {"trigger_entity": ["input_number.water_filter_flow_rate"], "trigger_type": "threshold", "trigger_below": 2.0},
             {"trigger_entity": ["input_number.water_filter_total_liters"], "trigger_type": "counter",
              "trigger_target_value": 10000, "trigger_delta_mode": True},
         ]},
    ]),
    ("Swimming Pool", "", "", [
        {"name": "pH Test", "type": "inspection", "schedule_type": "manual",
         "warning_days": 3, "notes": "Test pH weekly, adjust chemicals as needed"},
        {"name": "Water Treatment", "type": "cleaning", "schedule_type": "time_based",
         "interval_days": 7, "warning_days": 1},
    ]),
    ("3D Printer", "Prusa", "MK4S", [
        {"name": "Nozzle Replacement", "type": "replacement", "schedule_type": "sensor_based",
         "trigger_entity": ["input_number.printer_page_count"], "trigger_type": "counter",
         "trigger_target_value": 5000, "trigger_delta_mode": False, "interval_days": 365, "warning_days": 7},
        {"name": "Lubrication", "type": "service", "schedule_type": "time_based",
         "interval_days": 60, "warning_days": 7},
    ]),
    ("Electric Car", "Tesla", "Model 3", [
        {"name": "Tire Pressure Check", "type": "inspection", "schedule_type": "sensor_based",
         "trigger_entity": ["input_number.ev_tire_pressure_fl", "input_number.ev_tire_pressure_fr",
                            "input_number.ev_tire_pressure_rl", "input_number.ev_tire_pressure_rr"],
         "trigger_type": "threshold", "trigger_below": 2.0, "trigger_entity_logic": "any", "warning_days": 3},
        {"name": "Brake Pad Inspection", "type": "inspection", "schedule_type": "sensor_based",
         "trigger_entity": ["input_number.ev_brake_pad_thickness"], "trigger_type": "threshold",
         "trigger_below": 3.0, "interval_days": 365, "warning_days": 30},
        {"name": "Cabin Air Filter", "type": "replacement", "schedule_type": "time_based",
         "interval_days": 365, "warning_days": 30, "last_performed": "2025-09-15"},
        {"name": "Wiper Blades", "type": "replacement", "schedule_type": "time_based",
         "interval_days": 365, "warning_days": 14},
        {"name": "Battery Health Check", "type": "inspection", "schedule_type": "sensor_based",
         "trigger_entity": ["input_number.ev_battery_soh"], "trigger_type": "threshold",
         "trigger_below": 85.0, "interval_days": 365, "warning_days": 30},
        {"name": "Charging Cycle Log", "type": "service", "schedule_type": "sensor_based",
         "trigger_entity": ["input_boolean.ev_charging"], "trigger_type": "runtime",
         "trigger_runtime_hours": 1000, "trigger_on_states": "on", "interval_days": 365, "warning_days": 14},
    ]),
]


def main() -> None:
    # Check HA is reachable
    try:
        r = requests.get(f"{BASE}/api/", headers=HEADERS, timeout=5)
        r.raise_for_status()
    except Exception as e:
        print(f"ERROR: Cannot reach HA at {BASE}: {e}")
        sys.exit(1)

    # Get existing objects for idempotency
    existing = get_existing_object_names()
    if existing:
        print(f"Existing objects: {', '.join(sorted(existing))}")

    ensure_global_entry()

    for name, manufacturer, model, tasks in DEMO_OBJECTS:
        if name in existing:
            print(f"\n=== Skipping {name} (already exists) ===")
            continue
        create_object_with_tasks(name, manufacturer, model, tasks)

    configure_global_options()

    print("\n=== ALL DONE ===")


if __name__ == "__main__":
    main()
