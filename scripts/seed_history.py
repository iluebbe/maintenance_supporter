"""Inject realistic historical maintenance data into Store files.

Run AFTER setup_demo.py has created all objects.
Writes directly to docker/config-dev/.storage/maintenance_supporter.<entry_id> files.
Requires HA restart afterward to load the changes.
"""

import json
import os
import sys
from pathlib import Path

STORAGE_DIR = Path(__file__).parent.parent / "docker" / "config-dev" / ".storage"

# Object name -> {task_name -> [history_entries]}
# Each entry: {"timestamp", "type", "notes"?, "cost"?, "duration"?, "feedback"?, "trigger_value"?}
HISTORY_DATA: dict[str, dict[str, list[dict]]] = {
    "HVAC System": {
        "Filter Replacement": [
            {"timestamp": "2025-04-10T09:30:00+02:00", "type": "completed", "notes": "Filter stark verschmutzt", "cost": 28.90, "duration": 20, "feedback": "needed", "trigger_value": 72},
            {"timestamp": "2025-07-05T14:00:00+02:00", "type": "completed", "notes": "Normaler Verschleiß", "cost": 28.90, "duration": 15, "feedback": "needed", "trigger_value": 68},
            {"timestamp": "2025-10-02T10:15:00+02:00", "type": "completed", "notes": "Noch ok, vorsorglich gewechselt", "cost": 32.50, "duration": 20, "feedback": "not_sure", "trigger_value": 75},
            {"timestamp": "2026-01-08T11:00:00+01:00", "type": "completed", "notes": "Winterbetrieb, Filter verschmutzt", "cost": 32.50, "duration": 25, "feedback": "needed", "trigger_value": 64},
        ],
    },
    "Family Car": {
        "Oil Change": [
            {"timestamp": "2025-06-20T08:00:00+02:00", "type": "completed", "notes": "Werkstatt, 5W-30 Longlife", "cost": 89.90, "duration": 45, "feedback": "needed", "trigger_value": 45000},
        ],
        "Tire Rotation": [
            {"timestamp": "2025-05-01T10:00:00+02:00", "type": "completed", "notes": "Sommer auf Winter getauscht", "cost": 45.00, "duration": 30, "feedback": "needed"},
            {"timestamp": "2025-11-01T09:30:00+01:00", "type": "completed", "notes": "Winter auf Sommer", "cost": 49.00, "duration": 35, "feedback": "needed"},
        ],
    },
    "Washing Machine": {
        "Drum Cleaning": [
            {"timestamp": "2025-07-01T18:00:00+02:00", "type": "completed", "cost": 5.50, "duration": 5, "feedback": "needed"},
            {"timestamp": "2025-08-03T17:30:00+02:00", "type": "completed", "cost": 5.50, "duration": 5, "feedback": "needed"},
            {"timestamp": "2025-09-07T19:00:00+02:00", "type": "completed", "cost": 5.50, "duration": 8, "feedback": "needed"},
            {"timestamp": "2025-10-05T18:15:00+02:00", "type": "completed", "cost": 5.50, "duration": 5, "feedback": "not_sure"},
            {"timestamp": "2025-11-09T17:00:00+01:00", "type": "completed", "cost": 5.50, "duration": 5, "feedback": "needed"},
            {"timestamp": "2025-12-14T18:30:00+01:00", "type": "completed", "cost": 5.50, "duration": 10, "feedback": "needed"},
            {"timestamp": "2026-01-18T17:45:00+01:00", "type": "completed", "cost": 5.50, "duration": 5, "feedback": "needed"},
            {"timestamp": "2026-02-22T18:00:00+01:00", "type": "completed", "cost": 5.50, "duration": 5, "feedback": "not_needed"},
        ],
    },
    "Water Softener": {
        "Refill Salt": [
            {"timestamp": "2025-05-10T10:00:00+02:00", "type": "completed", "notes": "25kg Sack", "cost": 15.90, "duration": 10, "feedback": "needed", "trigger_value": 35},
            {"timestamp": "2025-06-25T09:30:00+02:00", "type": "completed", "cost": 15.90, "duration": 12, "feedback": "needed", "trigger_value": 28},
            {"timestamp": "2025-08-08T11:00:00+02:00", "type": "completed", "cost": 18.50, "duration": 10, "feedback": "needed", "trigger_value": 15},
            {"timestamp": "2025-08-20T00:00:00+02:00", "type": "skipped", "notes": "Im Urlaub"},
            {"timestamp": "2025-10-15T10:30:00+02:00", "type": "completed", "cost": 18.50, "duration": 15, "feedback": "needed", "trigger_value": 42},
            {"timestamp": "2025-12-01T09:00:00+01:00", "type": "completed", "notes": "Doppelpack gekauft", "cost": 22.00, "duration": 10, "feedback": "needed", "trigger_value": 30},
            {"timestamp": "2026-01-15T10:00:00+01:00", "type": "completed", "cost": 18.50, "duration": 12, "feedback": "needed", "trigger_value": 18},
            {"timestamp": "2026-02-28T09:45:00+01:00", "type": "completed", "cost": 18.50, "duration": 10, "feedback": "needed", "trigger_value": 25},
        ],
    },
    "Workshop Compressor": {
        "Oil Change": [
            {"timestamp": "2025-09-15T14:00:00+02:00", "type": "completed", "notes": "Atlas Copco Roto-Inject", "cost": 42.00, "duration": 40, "feedback": "needed"},
        ],
        "Air Filter": [
            {"timestamp": "2025-06-01T15:00:00+02:00", "type": "completed", "cost": 18.00, "duration": 15, "feedback": "needed"},
            {"timestamp": "2025-12-05T14:30:00+01:00", "type": "completed", "cost": 19.50, "duration": 15, "feedback": "needed"},
        ],
    },
    "Water Filter System": {
        "Cartridge Replacement": [
            {"timestamp": "2024-05-15T10:00:00+02:00", "type": "completed", "notes": "Erster Wechsel nach Einbau", "cost": 48.00, "duration": 15, "feedback": "needed", "trigger_value": 2.1},
            {"timestamp": "2024-11-20T11:00:00+01:00", "type": "completed", "notes": "Zu lange gewartet, Durchfluss sehr niedrig", "cost": 50.00, "duration": 18, "feedback": "needed", "trigger_value": 1.5},
            {"timestamp": "2025-05-20T11:00:00+02:00", "type": "completed", "notes": "Durchfluss bei 1.8 L/min", "cost": 52.00, "duration": 20, "feedback": "needed", "trigger_value": 1.8},
            {"timestamp": "2025-11-10T10:30:00+01:00", "type": "completed", "notes": "Zähler bei 14500L", "cost": 55.00, "duration": 18, "feedback": "needed", "trigger_value": 1.9},
        ],
    },
    "Swimming Pool": {
        "pH Test": [
            {"timestamp": "2025-05-05T10:00:00+02:00", "type": "completed", "cost": 3.50, "duration": 10, "feedback": "needed",
             "checklist_state": {"pH-Wert messen": True, "Chlorgehalt prüfen": True, "Wasserstand kontrollieren": True}},
            {"timestamp": "2025-05-19T09:30:00+02:00", "type": "completed", "cost": 3.50, "duration": 8},
            {"timestamp": "2025-06-02T10:15:00+02:00", "type": "completed", "cost": 3.50, "duration": 10, "feedback": "needed"},
            {"timestamp": "2025-06-16T10:00:00+02:00", "type": "completed", "cost": 3.50, "duration": 8},
            {"timestamp": "2025-06-30T09:45:00+02:00", "type": "completed", "cost": 4.20, "duration": 10, "feedback": "needed",
             "checklist_state": {"pH-Wert messen": True, "Chlorgehalt prüfen": True, "Wasserstand kontrollieren": False}},
            {"timestamp": "2025-07-14T10:00:00+02:00", "type": "completed", "cost": 4.20, "duration": 8},
            {"timestamp": "2025-07-28T10:30:00+02:00", "type": "completed", "cost": 4.20, "duration": 10, "feedback": "needed"},
            {"timestamp": "2025-08-11T09:30:00+02:00", "type": "completed", "cost": 4.20, "duration": 8},
            {"timestamp": "2025-08-25T10:00:00+02:00", "type": "completed", "cost": 4.20, "duration": 10, "feedback": "needed",
             "checklist_state": {"pH-Wert messen": True, "Chlorgehalt prüfen": True, "Wasserstand kontrollieren": True}},
            {"timestamp": "2025-09-08T10:15:00+02:00", "type": "completed", "cost": 4.20, "duration": 8},
            {"timestamp": "2025-09-22T10:00:00+02:00", "type": "completed", "cost": 4.20, "duration": 10, "feedback": "needed"},
            {"timestamp": "2025-10-06T10:30:00+02:00", "type": "completed", "notes": "Saison-Ende, Wintervorbereitung", "cost": 4.20, "duration": 15, "feedback": "needed"},
        ],
        "Water Treatment": [
            {"timestamp": "2025-05-05T11:00:00+02:00", "type": "completed", "cost": 8.50, "duration": 15},
            {"timestamp": "2025-05-12T11:30:00+02:00", "type": "completed", "cost": 8.50, "duration": 12},
            {"timestamp": "2025-05-19T10:45:00+02:00", "type": "completed", "cost": 8.50, "duration": 15},
            {"timestamp": "2025-05-26T11:00:00+02:00", "type": "completed", "cost": 9.20, "duration": 12},
            {"timestamp": "2025-06-02T11:15:00+02:00", "type": "completed", "cost": 9.20, "duration": 15},
            {"timestamp": "2025-06-09T10:30:00+02:00", "type": "completed", "cost": 9.20, "duration": 12},
            {"timestamp": "2025-06-16T11:00:00+02:00", "type": "completed", "cost": 9.20, "duration": 15},
            {"timestamp": "2025-06-23T11:30:00+02:00", "type": "completed", "cost": 9.20, "duration": 12},
            {"timestamp": "2025-06-30T10:45:00+02:00", "type": "completed", "cost": 9.20, "duration": 15},
            {"timestamp": "2025-07-07T11:00:00+02:00", "type": "completed", "cost": 11.50, "duration": 18},
            {"timestamp": "2025-07-14T11:15:00+02:00", "type": "completed", "cost": 11.50, "duration": 15},
            {"timestamp": "2025-07-21T10:30:00+02:00", "type": "completed", "cost": 11.50, "duration": 15},
            {"timestamp": "2025-07-28T11:00:00+02:00", "type": "completed", "cost": 11.50, "duration": 18},
            {"timestamp": "2025-08-04T11:30:00+02:00", "type": "completed", "cost": 11.50, "duration": 15},
            {"timestamp": "2025-08-11T10:45:00+02:00", "type": "completed", "notes": "Algenbehandlung extra", "cost": 15.00, "duration": 25},
        ],
    },
    "3D Printer": {
        "Nozzle Replacement": [
            {"timestamp": "2025-08-10T16:00:00+02:00", "type": "completed", "notes": "0.4mm Hardened Steel", "cost": 12.00, "duration": 15, "feedback": "needed"},
        ],
        "Lubrication": [
            {"timestamp": "2025-06-15T20:00:00+02:00", "type": "completed", "notes": "Achsen + Spindel", "cost": 4.50, "duration": 10, "feedback": "needed"},
            {"timestamp": "2025-08-14T19:30:00+02:00", "type": "completed", "cost": 4.50, "duration": 10, "feedback": "needed"},
            {"timestamp": "2025-10-13T20:00:00+02:00", "type": "completed", "cost": 4.50, "duration": 12, "feedback": "needed"},
            {"timestamp": "2025-12-12T19:45:00+01:00", "type": "completed", "cost": 4.50, "duration": 10, "feedback": "not_sure"},
        ],
    },
    "Electric Car": {
        "Tire Pressure Check": [
            {"timestamp": "2025-11-15T09:00:00+01:00", "type": "completed", "notes": "Alle 4 Reifen ok (2.4/2.4/2.5/2.5)", "cost": 0, "duration": 10, "feedback": "needed", "trigger_value": 2.4,
             "checklist_state": {"VL prüfen": True, "VR prüfen": True, "HL prüfen": True, "HR prüfen": True, "Profiltiefe kontrollieren": True}},
            {"timestamp": "2025-12-20T10:00:00+01:00", "type": "completed", "notes": "VR leicht niedrig (2.1), aufgefüllt", "cost": 0, "duration": 12, "feedback": "needed", "trigger_value": 2.1,
             "checklist_state": {"VL prüfen": True, "VR prüfen": True, "HL prüfen": True, "HR prüfen": True, "Profiltiefe kontrollieren": True}},
            {"timestamp": "2026-01-25T09:30:00+01:00", "type": "completed", "cost": 0, "duration": 10, "feedback": "not_sure", "trigger_value": 2.5},
            {"timestamp": "2026-02-28T10:15:00+01:00", "type": "completed", "cost": 0, "duration": 10, "feedback": "needed", "trigger_value": 2.3,
             "checklist_state": {"VL prüfen": True, "VR prüfen": True, "HL prüfen": True, "HR prüfen": True, "Profiltiefe kontrollieren": False}},
        ],
        "Brake Pad Inspection": [
            {"timestamp": "2025-10-01T08:30:00+02:00", "type": "completed", "notes": "8.5mm, noch viel Reserve", "cost": 0, "duration": 15, "feedback": "not_needed"},
        ],
        "Cabin Air Filter": [
            {"timestamp": "2025-09-15T14:00:00+02:00", "type": "completed", "notes": "HEPA Filter gewechselt", "cost": 35.00, "duration": 20, "feedback": "needed"},
        ],
        "Wiper Blades": [
            {"timestamp": "2025-10-20T11:00:00+02:00", "type": "completed", "notes": "Bosch Aerotwin", "cost": 28.50, "duration": 10, "feedback": "needed"},
        ],
        "Battery Health Check": [
            {"timestamp": "2025-11-01T10:00:00+01:00", "type": "completed", "notes": "SoH 96%, Range 480km", "cost": 0, "duration": 5, "feedback": "not_needed"},
        ],
        "Charging Cycle Log": [],
    },
}


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
            return ts[:10]  # "2025-06-20T08:00:00+02:00" -> "2025-06-20"
    return None


def main():
    store_files = find_store_files()
    config_entries = load_config_entries()

    if not config_entries:
        print("ERROR: No maintenance_supporter config entries found")
        sys.exit(1)

    print(f"Found {len(store_files)} store files, {len(config_entries)} config entries")

    # Map object name -> (entry_id, task_name_map)
    object_map: dict[str, tuple[str, dict[str, str]]] = {}
    for entry_id, entry in config_entries.items():
        obj_name = entry.get("title", "")
        if obj_name == "Maintenance Supporter":
            continue  # Skip global entry
        task_map = build_task_name_map(entry)
        object_map[obj_name] = (entry_id, task_map)
        print(f"  {obj_name}: entry_id={entry_id}, tasks={list(task_map.keys())}")

    updated = 0
    for obj_name, task_histories in HISTORY_DATA.items():
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
            store_data = {"version": 1, "key": f"maintenance_supporter.{entry_id}", "data": {"version": 1, "tasks": {}}}

        tasks_store = store_data.get("data", store_data).setdefault("tasks", {})

        for task_name, history_entries in task_histories.items():
            if task_name not in task_map:
                print(f"  WARNING: Task '{task_name}' not found in '{obj_name}', skipping")
                continue

            if not history_entries:
                continue

            task_id = task_map[task_name]
            task_state = tasks_store.setdefault(task_id, {})

            # Set history (replace any existing)
            task_state["history"] = history_entries

            # Set last_performed to most recent completed entry
            last_date = get_last_completed_date(history_entries)
            if last_date:
                task_state["last_performed"] = last_date

            print(f"  {obj_name} > {task_name}: {len(history_entries)} entries, last={last_date}")

        # Write store file
        with open(store_path, "w", encoding="utf-8") as f:
            json.dump(store_data, f, indent=2, ensure_ascii=False)
        updated += 1

    print(f"\nUpdated {updated} store files")
    print("Restart HA to load changes: docker compose restart homeassistant-dev")


if __name__ == "__main__":
    main()
