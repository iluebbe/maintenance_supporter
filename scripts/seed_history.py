"""Inject realistic historical maintenance data into Store files.

Run AFTER setup_demo.py has created all objects.
Writes directly to docker/config-dev/.storage/maintenance_supporter.<entry_id> files.
Requires HA restart afterward to load the changes.

All timestamps are computed relative to today so the data never becomes stale.
"""

import json
import re
import sys
from datetime import datetime, timedelta, date
from pathlib import Path
from zoneinfo import ZoneInfo

STORAGE_DIR = Path(__file__).parent.parent / "docker" / "config-dev" / ".storage"
CONFIG_YAML = Path(__file__).parent.parent / "docker" / "config-dev" / "configuration.yaml"

TZ = ZoneInfo("Europe/Berlin")
NOW = datetime.now(TZ)
TODAY = date.today()


def days_ago(n: int, hour: int = 10, minute: int = 0) -> str:
    """ISO timestamp for N days before now."""
    dt = (NOW - timedelta(days=n)).replace(
        hour=hour, minute=minute, second=0, microsecond=0
    )
    return dt.isoformat()


def date_ago(n: int) -> str:
    """Date string (YYYY-MM-DD) for N days before today."""
    return (TODAY - timedelta(days=n)).isoformat()


# ---------------------------------------------------------------------------
# History data — all offsets are "days before today"
# Each task can optionally include "trigger_runtime" for persistent state.
# ---------------------------------------------------------------------------

HISTORY_DATA: dict[str, dict[str, dict]] = {
    "HVAC System": {
        "Filter Replacement": {
            "history": [
                {"timestamp": days_ago(322, 9, 30), "type": "completed", "notes": "Filter stark verschmutzt",
                 "cost": 28.90, "duration": 20, "feedback": "needed", "trigger_value": 57},
                {"timestamp": days_ago(235, 14, 0), "type": "completed", "notes": "Normaler Verschleiß",
                 "cost": 28.90, "duration": 15, "feedback": "needed", "trigger_value": 62},
                {"timestamp": days_ago(146, 10, 15), "type": "completed", "notes": "Noch ok, vorsorglich gewechselt",
                 "cost": 32.50, "duration": 20, "feedback": "not_sure", "trigger_value": 68},
                {"timestamp": days_ago(59, 11, 0), "type": "completed", "notes": "Winterbetrieb, Filter verschmutzt",
                 "cost": 32.50, "duration": 25, "feedback": "needed", "trigger_value": 55},
            ],
        },
    },
    "Family Car": {
        "Oil Change": {
            "history": [
                {"timestamp": days_ago(261, 8, 0), "type": "completed", "notes": "Werkstatt, 5W-30 Longlife",
                 "cost": 89.90, "duration": 45, "feedback": "needed", "trigger_value": 45000},
            ],
            "trigger_runtime": {
                "input_number.car_odometer": {"baseline_value": 45000.0},
            },
        },
        "Tire Rotation": {
            "history": [
                {"timestamp": days_ago(311, 10, 0), "type": "completed", "notes": "Winter auf Sommer getauscht",
                 "cost": 45.00, "duration": 30, "feedback": "needed"},
                {"timestamp": days_ago(127, 9, 30), "type": "completed", "notes": "Sommer auf Winter getauscht",
                 "cost": 49.00, "duration": 35, "feedback": "needed"},
            ],
        },
    },
    "Washing Machine": {
        "Drum Cleaning": {
            "history": [
                {"timestamp": days_ago(250, 18, 0), "type": "completed", "cost": 5.50, "duration": 5, "feedback": "needed"},
                {"timestamp": days_ago(219, 17, 30), "type": "completed", "cost": 5.50, "duration": 5, "feedback": "needed"},
                {"timestamp": days_ago(186, 19, 0), "type": "completed", "cost": 5.50, "duration": 8, "feedback": "needed"},
                {"timestamp": days_ago(153, 18, 15), "type": "completed", "cost": 5.50, "duration": 5, "feedback": "not_sure"},
                {"timestamp": days_ago(118, 17, 0), "type": "completed", "cost": 5.50, "duration": 5, "feedback": "needed"},
                {"timestamp": days_ago(83, 18, 30), "type": "completed", "cost": 5.50, "duration": 10, "feedback": "needed"},
                {"timestamp": days_ago(49, 17, 45), "type": "completed", "cost": 5.50, "duration": 5, "feedback": "needed"},
                {"timestamp": days_ago(14, 18, 0), "type": "completed", "cost": 5.50, "duration": 5, "feedback": "not_needed"},
            ],
            "trigger_runtime": {
                "input_boolean.washing_machine_running": {"change_count": 6},
            },
        },
    },
    "Water Softener": {
        "Refill Salt": {
            "history": [
                {"timestamp": days_ago(302, 10, 0), "type": "completed", "notes": "25kg Sack",
                 "cost": 15.90, "duration": 10, "feedback": "needed", "trigger_value": 32},
                {"timestamp": days_ago(256, 9, 30), "type": "completed",
                 "cost": 15.90, "duration": 12, "feedback": "needed", "trigger_value": 24},
                {"timestamp": days_ago(212, 11, 0), "type": "completed",
                 "cost": 18.50, "duration": 10, "feedback": "needed", "trigger_value": 12},
                {"timestamp": days_ago(170, 0, 0), "type": "skipped", "notes": "Im Urlaub"},
                {"timestamp": days_ago(155, 10, 30), "type": "completed",
                 "cost": 18.50, "duration": 15, "feedback": "needed", "trigger_value": 8},
                {"timestamp": days_ago(110, 9, 0), "type": "completed", "notes": "Doppelpack gekauft",
                 "cost": 22.00, "duration": 10, "feedback": "needed", "trigger_value": 28},
                {"timestamp": days_ago(52, 10, 0), "type": "completed",
                 "cost": 18.50, "duration": 12, "feedback": "needed", "trigger_value": 16},
                {"timestamp": days_ago(8, 9, 45), "type": "completed",
                 "cost": 18.50, "duration": 10, "feedback": "needed", "trigger_value": 22},
            ],
        },
    },
    "Workshop Compressor": {
        "Oil Change": {
            "history": [
                {"timestamp": days_ago(174, 14, 0), "type": "completed", "notes": "Atlas Copco Roto-Inject",
                 "cost": 42.00, "duration": 40, "feedback": "needed"},
            ],
            "trigger_runtime": {
                "input_boolean.workshop_compressor": {"accumulated_seconds": 939600.0},
            },
        },
        "Air Filter": {
            "history": [
                {"timestamp": days_ago(280, 15, 0), "type": "completed",
                 "cost": 18.00, "duration": 15, "feedback": "needed"},
                {"timestamp": days_ago(93, 14, 30), "type": "completed",
                 "cost": 19.50, "duration": 15, "feedback": "needed"},
            ],
        },
    },
    "Water Filter System": {
        "Cartridge Replacement": {
            "history": [
                {"timestamp": days_ago(663, 10, 0), "type": "completed", "notes": "Erster Wechsel nach Einbau",
                 "cost": 48.00, "duration": 15, "feedback": "needed", "trigger_value": 2.1},
                {"timestamp": days_ago(474, 11, 0), "type": "completed", "notes": "Zu lange gewartet, Durchfluss sehr niedrig",
                 "cost": 50.00, "duration": 18, "feedback": "needed", "trigger_value": 1.5},
                {"timestamp": days_ago(293, 11, 0), "type": "completed", "notes": "Durchfluss bei 1.8 L/min",
                 "cost": 52.00, "duration": 20, "feedback": "needed", "trigger_value": 1.8},
                {"timestamp": days_ago(118, 10, 30), "type": "completed", "notes": "Zähler bei 14500L",
                 "cost": 55.00, "duration": 18, "feedback": "needed", "trigger_value": 1.9},
            ],
            "trigger_runtime": {
                "_compound_1_input_number.water_filter_total_liters": {"baseline_value": 14500.0},
            },
        },
    },
    "Swimming Pool": {
        "pH Test": {
            # Seasonal: May-October only (every 2 weeks)
            "history": [
                {"timestamp": days_ago(307, 10, 0), "type": "completed", "cost": 3.50, "duration": 10, "feedback": "needed",
                 "checklist_state": {"pH-Wert messen": True, "Chlorgehalt prüfen": True, "Wasserstand kontrollieren": True}},
                {"timestamp": days_ago(293, 9, 30), "type": "completed", "cost": 3.50, "duration": 8},
                {"timestamp": days_ago(279, 10, 15), "type": "completed", "cost": 3.50, "duration": 10, "feedback": "needed"},
                {"timestamp": days_ago(265, 10, 0), "type": "completed", "cost": 3.50, "duration": 8},
                {"timestamp": days_ago(251, 9, 45), "type": "completed", "cost": 4.20, "duration": 10, "feedback": "needed",
                 "checklist_state": {"pH-Wert messen": True, "Chlorgehalt prüfen": True, "Wasserstand kontrollieren": False}},
                {"timestamp": days_ago(237, 10, 0), "type": "completed", "cost": 4.20, "duration": 8},
                {"timestamp": days_ago(223, 10, 30), "type": "completed", "cost": 4.20, "duration": 10, "feedback": "needed"},
                {"timestamp": days_ago(209, 9, 30), "type": "completed", "cost": 4.20, "duration": 8},
                {"timestamp": days_ago(195, 10, 0), "type": "completed", "cost": 4.20, "duration": 10, "feedback": "needed",
                 "checklist_state": {"pH-Wert messen": True, "Chlorgehalt prüfen": True, "Wasserstand kontrollieren": True}},
                {"timestamp": days_ago(181, 10, 15), "type": "completed", "cost": 4.20, "duration": 8},
                {"timestamp": days_ago(167, 10, 0), "type": "completed", "cost": 4.20, "duration": 10, "feedback": "needed"},
                {"timestamp": days_ago(153, 10, 30), "type": "completed", "notes": "Saison-Ende, Wintervorbereitung",
                 "cost": 4.20, "duration": 15, "feedback": "needed"},
            ],
        },
        "Water Treatment": {
            # Seasonal: May-August (weekly)
            "history": [
                {"timestamp": days_ago(307, 11, 0), "type": "completed", "cost": 8.50, "duration": 15},
                {"timestamp": days_ago(300, 11, 30), "type": "completed", "cost": 8.50, "duration": 12},
                {"timestamp": days_ago(293, 10, 45), "type": "completed", "cost": 8.50, "duration": 15},
                {"timestamp": days_ago(286, 11, 0), "type": "completed", "cost": 9.20, "duration": 12},
                {"timestamp": days_ago(279, 11, 15), "type": "completed", "cost": 9.20, "duration": 15},
                {"timestamp": days_ago(272, 10, 30), "type": "completed", "cost": 9.20, "duration": 12},
                {"timestamp": days_ago(265, 11, 0), "type": "completed", "cost": 9.20, "duration": 15},
                {"timestamp": days_ago(258, 11, 30), "type": "completed", "cost": 9.20, "duration": 12},
                {"timestamp": days_ago(251, 10, 45), "type": "completed", "cost": 9.20, "duration": 15},
                {"timestamp": days_ago(244, 11, 0), "type": "completed", "cost": 11.50, "duration": 18},
                {"timestamp": days_ago(237, 11, 15), "type": "completed", "cost": 11.50, "duration": 15},
                {"timestamp": days_ago(230, 10, 30), "type": "completed", "cost": 11.50, "duration": 15},
                {"timestamp": days_ago(223, 11, 0), "type": "completed", "cost": 11.50, "duration": 18},
                {"timestamp": days_ago(216, 11, 30), "type": "completed", "cost": 11.50, "duration": 15},
                {"timestamp": days_ago(209, 10, 45), "type": "completed", "notes": "Algenbehandlung extra",
                 "cost": 15.00, "duration": 25},
            ],
        },
    },
    "3D Printer": {
        "Nozzle Replacement": {
            "history": [
                {"timestamp": days_ago(210, 16, 0), "type": "completed", "notes": "0.4mm Hardened Steel",
                 "cost": 12.00, "duration": 15, "feedback": "needed", "trigger_value": 1500},
            ],
            "trigger_runtime": {
                "input_number.printer_print_hours": {"baseline_value": 1500.0},
            },
        },
        "Lubrication": {
            "history": [
                {"timestamp": days_ago(266, 20, 0), "type": "completed", "notes": "Achsen + Spindel",
                 "cost": 4.50, "duration": 10, "feedback": "needed"},
                {"timestamp": days_ago(206, 19, 30), "type": "completed",
                 "cost": 4.50, "duration": 10, "feedback": "needed"},
                {"timestamp": days_ago(146, 20, 0), "type": "completed",
                 "cost": 4.50, "duration": 12, "feedback": "needed"},
                {"timestamp": days_ago(86, 19, 45), "type": "completed",
                 "cost": 4.50, "duration": 10, "feedback": "not_sure"},
            ],
        },
    },
    "Electric Car": {
        "Tire Pressure Check": {
            "history": [
                {"timestamp": days_ago(113, 9, 0), "type": "completed",
                 "notes": "Alle 4 Reifen ok, aufgefüllt auf 2.5",
                 "cost": 0, "duration": 10, "feedback": "needed", "trigger_value": 2.4,
                 "checklist_state": {"VL prüfen": True, "VR prüfen": True, "HL prüfen": True, "HR prüfen": True, "Profiltiefe kontrollieren": True}},
                {"timestamp": days_ago(78, 10, 0), "type": "completed",
                 "notes": "VL leicht niedrig (2.3), alle aufgefüllt auf 2.5",
                 "cost": 0, "duration": 12, "feedback": "needed", "trigger_value": 2.3,
                 "checklist_state": {"VL prüfen": True, "VR prüfen": True, "HL prüfen": True, "HR prüfen": True, "Profiltiefe kontrollieren": True}},
                {"timestamp": days_ago(42, 9, 30), "type": "completed",
                 "notes": "Alle bei ~2.3 bar, aufgefüllt",
                 "cost": 0, "duration": 10, "feedback": "not_sure", "trigger_value": 2.3},
                {"timestamp": days_ago(8, 10, 15), "type": "completed",
                 "notes": "Kaltes Wetter, VL bei 2.2, alle aufgefüllt",
                 "cost": 0, "duration": 10, "feedback": "needed", "trigger_value": 2.2,
                 "checklist_state": {"VL prüfen": True, "VR prüfen": True, "HL prüfen": True, "HR prüfen": True, "Profiltiefe kontrollieren": False}},
            ],
        },
        "Brake Pad Inspection": {
            "history": [
                {"timestamp": days_ago(158, 8, 30), "type": "completed",
                 "notes": "8.5mm, noch viel Reserve",
                 "cost": 0, "duration": 15, "feedback": "not_needed", "trigger_value": 8.5},
            ],
        },
        "Cabin Air Filter": {
            "history": [
                {"timestamp": days_ago(174, 14, 0), "type": "completed", "notes": "HEPA Filter gewechselt",
                 "cost": 35.00, "duration": 20, "feedback": "needed"},
            ],
        },
        "Wiper Blades": {
            "history": [
                {"timestamp": days_ago(139, 11, 0), "type": "completed", "notes": "Bosch Aerotwin",
                 "cost": 28.50, "duration": 10, "feedback": "needed"},
            ],
        },
        "Battery Health Check": {
            "history": [
                {"timestamp": days_ago(127, 10, 0), "type": "completed",
                 "notes": "SoH 96%, Range 480km",
                 "cost": 0, "duration": 5, "feedback": "not_needed", "trigger_value": 96.0},
            ],
        },
        "Charging Cycle Log": {
            "history": [],
            "trigger_runtime": {
                "input_boolean.ev_charging": {"accumulated_seconds": 720000.0},
            },
        },
    },
}


# ---------------------------------------------------------------------------
# Recommended input_number initial values (consistent with seeded data)
# ---------------------------------------------------------------------------

RECOMMENDED_INITIALS = {
    "car_odometer": 55700,       # 45000 + ~261d * 41km/d
    "printer_print_hours": 1800, # 1500 + ~210d * 1.5h/d
    "water_filter_total_liters": 16500,  # 14500 + ~118d * 17L/d
    "hvac_filter_airflow": 72,   # 85 degrading ~0.2/d for 59d
    "water_softener_salt_level": 55,  # 65 - ~8d * 1.2/d
    "ev_tire_pressure_fl": 2.3,  # 2.5 - ~8d * 0.025/d
    "ev_brake_pad_thickness": 8.2,  # 8.5 - ~158d * 0.002/d
    "ev_battery_soh": 95.5,      # 96 - ~127d * 0.004/d
    "ev_odometer": 33000,        # ~28500 + driving
}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def find_store_files() -> dict[str, Path]:
    """Find all maintenance_supporter Store files and map entry_id -> path."""
    result = {}
    if not STORAGE_DIR.exists():
        print(f"ERROR: Storage directory not found: {STORAGE_DIR}")
        sys.exit(1)
    for f in STORAGE_DIR.iterdir():
        if f.name.startswith("maintenance_supporter.") and f.name != "maintenance_supporter":
            entry_id = f.name.replace("maintenance_supporter.", "")
            result[entry_id] = f
    return result


def load_config_entries() -> dict[str, dict]:
    """Load core.config_entries to map entry_id -> object name."""
    config_entries_path = STORAGE_DIR / "core.config_entries"
    if not config_entries_path.exists():
        print(f"ERROR: {config_entries_path} not found")
        sys.exit(1)
    with open(config_entries_path, encoding="utf-8") as f:
        data = json.load(f)
    entries = data.get("data", {}).get("entries", [])
    result = {}
    for entry in entries:
        if entry.get("domain") == "maintenance_supporter":
            result[entry["entry_id"]] = entry
    return result


def build_task_name_map(entry: dict) -> dict[str, str]:
    """Map task_name -> task_id from a config entry."""
    tasks = entry.get("data", {}).get("tasks", {})
    return {task_data.get("name", ""): task_id for task_id, task_data in tasks.items()}


def get_last_completed_date(history: list[dict]) -> str | None:
    """Find the last completed entry's date."""
    for entry in reversed(history):
        if entry.get("type") == "completed":
            ts = entry["timestamp"]
            return ts[:10]
    return None


def update_configuration_yaml() -> None:
    """Update configuration.yaml input_number initials (approximate).

    Note: seed_recorder.py overwrites these with exact values from generated data.
    This function provides reasonable defaults for cases where seed_recorder isn't run.
    """
    if not CONFIG_YAML.exists():
        print(f"  WARNING: {CONFIG_YAML} not found, skipping initial value update")
        return

    content = CONFIG_YAML.read_text(encoding="utf-8")
    changed = 0

    for entity_key, value in RECOMMENDED_INITIALS.items():
        # Match the "initial:" line within the entity block
        # Pattern: entity_key:\n  ...lines...\n    initial: <old_value>
        pattern = rf"(  {re.escape(entity_key)}:\n(?:    .*\n)*?    initial: )([^\n]+)"
        match = re.search(pattern, content)
        if match:
            old_val = match.group(2).strip()
            new_val = str(value)
            if old_val != new_val:
                content = content[:match.start(2)] + new_val + content[match.end(2):]
                print(f"  Updated {entity_key}: {old_val} -> {new_val}")
                changed += 1

    if changed:
        CONFIG_YAML.write_text(content, encoding="utf-8")
        print(f"  Updated {changed} initial values in configuration.yaml")
    else:
        print("  All initial values already correct in configuration.yaml")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    store_files = find_store_files()
    config_entries = load_config_entries()

    if not config_entries:
        print("ERROR: No maintenance_supporter config entries found")
        sys.exit(1)

    print(f"Found {len(store_files)} store files, {len(config_entries)} config entries")
    print(f"Reference date: {TODAY}")

    # Map object name -> (entry_id, task_name_map)
    object_map: dict[str, tuple[str, dict[str, str]]] = {}
    for entry_id, entry in config_entries.items():
        obj_name = entry.get("title", "")
        if obj_name == "Maintenance Supporter":
            continue
        task_map = build_task_name_map(entry)
        object_map[obj_name] = (entry_id, task_map)
        print(f"  {obj_name}: entry_id={entry_id}, tasks={list(task_map.keys())}")

    updated = 0
    for obj_name, task_data_map in HISTORY_DATA.items():
        if obj_name not in object_map:
            print(f"\n  WARNING: Object '{obj_name}' not found in config entries, skipping")
            continue

        entry_id, task_map = object_map[obj_name]
        store_path = store_files.get(entry_id)

        # Load or create store data
        if store_path and store_path.exists():
            with open(store_path, encoding="utf-8") as f:
                store_data = json.load(f)
        else:
            store_path = STORAGE_DIR / f"maintenance_supporter.{entry_id}"
            store_data = {"version": 1, "key": f"maintenance_supporter.{entry_id}",
                          "data": {"version": 1, "tasks": {}}}

        tasks_store = store_data.get("data", store_data).setdefault("tasks", {})

        for task_name, task_info in task_data_map.items():
            if task_name not in task_map:
                print(f"  WARNING: Task '{task_name}' not found in '{obj_name}', skipping")
                continue

            task_id = task_map[task_name]
            task_state = tasks_store.setdefault(task_id, {})

            # Set history
            history_entries = task_info.get("history", [])
            if history_entries:
                task_state["history"] = history_entries
                last_date = get_last_completed_date(history_entries)
                if last_date:
                    task_state["last_performed"] = last_date
                print(f"  {obj_name} > {task_name}: {len(history_entries)} entries, last={last_date}")
            elif "history" in task_info:
                print(f"  {obj_name} > {task_name}: 0 entries (empty)")

            # Set trigger_runtime
            trigger_runtime = task_info.get("trigger_runtime")
            if trigger_runtime:
                task_state["trigger_runtime"] = trigger_runtime
                print(f"    trigger_runtime: {json.dumps(trigger_runtime)}")

        # Write store file
        with open(store_path, "w", encoding="utf-8") as f:
            json.dump(store_data, f, indent=2, ensure_ascii=False)
        updated += 1

    print(f"\nUpdated {updated} store files")

    # Auto-update configuration.yaml with recommended initial values
    print("\nUpdating configuration.yaml initial values...")
    update_configuration_yaml()


if __name__ == "__main__":
    main()
