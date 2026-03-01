"""Enrich ALL tasks with realistic, time-distributed history data.

This script directly manipulates the HA config entries storage to inject
history entries with proper timestamps spread over months. This is needed
because the WS API always sets timestamp=now().

Run inside Docker:
  1. Stop HA:   s6-svc -d /run/s6-legacy-services/homeassistant
  2. Run:       python /config/tests/enrich_test_data.py
  3. Start HA:  s6-svc -u /run/s6-legacy-services/homeassistant
"""

import json
import random
from datetime import datetime, timedelta, timezone
from copy import deepcopy

STORAGE_PATH = "/config/.storage/core.config_entries"

# Timezone for timestamps (CET = UTC+1)
TZ = timezone(timedelta(hours=1))


def make_ts(dt):
    """Create ISO timestamp string from datetime."""
    return dt.isoformat()


def make_completed(dt, cost=None, duration=None, notes=None, feedback=None):
    """Create a completed history entry."""
    entry = {"timestamp": make_ts(dt), "type": "completed"}
    if notes:
        entry["notes"] = notes
    if cost is not None:
        entry["cost"] = cost
    if duration is not None:
        entry["duration"] = duration
    if feedback is not None:
        entry["feedback"] = feedback
    return entry


def make_triggered(dt, trigger_value=None, notes="Sensor trigger activated"):
    """Create a triggered history entry."""
    entry = {"timestamp": make_ts(dt), "type": "triggered"}
    if notes:
        entry["notes"] = notes
    if trigger_value is not None:
        entry["trigger_value"] = trigger_value
    return entry


def make_skipped(dt, notes=None):
    """Create a skipped history entry."""
    entry = {"timestamp": make_ts(dt), "type": "skipped"}
    if notes:
        entry["notes"] = notes
    return entry


def make_reset(dt, notes=None):
    """Create a reset history entry."""
    entry = {"timestamp": make_ts(dt), "type": "reset"}
    if notes:
        entry["notes"] = notes
    return entry


# ─── Data generation for each task ────────────────────────────────────────────

def generate_pool_pump_annual_inspection():
    """Annual Inspection - manual, ~yearly, expensive."""
    # Annual inspection done twice historically: 2025-02 and 2026-02
    now = datetime(2026, 2, 9, 10, 0, tzinfo=TZ)
    history = [
        make_completed(
            datetime(2024, 3, 15, 9, 30, tzinfo=TZ),
            cost=250.0, duration=120, notes="Full annual inspection by service tech"
        ),
        make_completed(
            datetime(2025, 3, 10, 10, 0, tzinfo=TZ),
            cost=275.0, duration=135, notes="Annual inspection - pump bearing showing wear"
        ),
        make_skipped(
            datetime(2025, 9, 1, 8, 0, tzinfo=TZ),
            notes="Skipped mid-year check, pool winterized early"
        ),
        make_completed(
            datetime(2026, 2, 8, 14, 0, tzinfo=TZ),
            cost=290.0, duration=150, notes="Pre-season inspection, replaced seal"
        ),
    ]
    return history, "2026-02-08"


def generate_pool_pump_filter_cleaning():
    """Filter Cleaning - time_based 30d, adaptive ON.
    Generate ~12 months of monthly cleanings with realistic variation."""
    history = []
    base_date = datetime(2025, 2, 15, 10, 0, tzinfo=TZ)

    # 12 monthly completions over a year
    scenarios = [
        (28, 8.50, 12, "needed",     "Filter clogged with debris"),
        (32, 10.00, 15, "needed",    "Heavy pollen season, very dirty"),
        (27, 7.00, 10, "not_needed", "Light usage month, filter OK"),
        (35, 12.00, 20, "needed",    "Overdue - pump pressure was dropping"),
        (30, 9.00, 14, "needed",     "Normal cleaning cycle"),
        (26, 8.00, 11, "not_sure",   "Moderate buildup, hard to tell"),
        (33, 11.00, 18, "needed",    "Storm brought extra debris"),
        (29, 8.50, 13, "not_needed", "Still fairly clean"),
        (31, 9.50, 15, "needed",     "Regular maintenance, good timing"),
        (28, 8.00, 12, "needed",     "Leaves clogging intake"),
        (34, 10.50, 16, "needed",    "Delayed due to weather"),
        (30, 9.00, 14, "needed",     "Standard monthly cleaning"),
    ]

    current_date = base_date
    for interval, cost, duration, feedback, notes in scenarios:
        current_date = current_date + timedelta(days=interval, hours=random.randint(-2, 2))
        history.append(make_completed(current_date, cost, duration, notes, feedback))

    last_performed = current_date.strftime("%Y-%m-%d")

    # Build adaptive config with realistic learned values
    adaptive_config = {
        "enabled": True,
        "ewa_alpha": 0.3,
        "min_interval_days": 7,
        "max_interval_days": 90,
        "smoothed_interval": 30.2,
        "feedback_count": 12,
        "confidence": "high",
        "weibull_beta": 3.2,
        "weibull_eta": 32.5,
        "current_recommendation": 31,
        "recommendation_reason": "ewa_and_weibull",
        "last_analysis_date": "2026-02-09",
        "base_interval": 30,
    }

    return history, last_performed, adaptive_config


def generate_hvac_filter_tausch():
    """HVAC Filter Tausch - sensor_based 90d.
    Quarterly filter changes with sensor trigger data."""
    history = []

    # Trigger events + completions over 1.5 years
    events = [
        # (date, type, kwargs)
        (datetime(2024, 11, 1, 8, 0, tzinfo=TZ),  "triggered", {"trigger_value": 72.0}),
        (datetime(2024, 11, 5, 14, 0, tzinfo=TZ),  "triggered", {"trigger_value": 78.0}),
        (datetime(2024, 11, 8, 10, 0, tzinfo=TZ),  "completed", {"cost": 35.0, "duration": 25, "notes": "Filter replaced, airflow restored"}),

        (datetime(2025, 2, 10, 9, 0, tzinfo=TZ),   "triggered", {"trigger_value": 68.0}),
        (datetime(2025, 2, 14, 11, 0, tzinfo=TZ),  "triggered", {"trigger_value": 75.0}),
        (datetime(2025, 2, 15, 10, 0, tzinfo=TZ),  "completed", {"cost": 35.0, "duration": 20, "notes": "Winterfilter gewechselt"}),

        (datetime(2025, 5, 18, 8, 0, tzinfo=TZ),   "triggered", {"trigger_value": 70.0}),
        (datetime(2025, 5, 20, 16, 0, tzinfo=TZ),  "triggered", {"trigger_value": 82.0}),
        (datetime(2025, 5, 22, 10, 0, tzinfo=TZ),  "completed", {"cost": 38.0, "duration": 22, "notes": "Pollenzeit - Filter sehr verschmutzt"}),

        (datetime(2025, 8, 12, 9, 0, tzinfo=TZ),   "triggered", {"trigger_value": 65.0}),
        (datetime(2025, 8, 15, 14, 0, tzinfo=TZ),  "triggered", {"trigger_value": 74.0}),
        (datetime(2025, 8, 16, 10, 30, tzinfo=TZ), "skipped",   {"notes": "Filter noch OK, nächsten Monat"}),
        (datetime(2025, 9, 10, 9, 0, tzinfo=TZ),   "triggered", {"trigger_value": 85.0}),
        (datetime(2025, 9, 12, 10, 0, tzinfo=TZ),  "completed", {"cost": 35.0, "duration": 25, "notes": "Verspätet gewechselt, Luftqualität war schlecht"}),

        (datetime(2025, 12, 5, 8, 30, tzinfo=TZ),  "triggered", {"trigger_value": 71.0}),
        (datetime(2025, 12, 8, 15, 0, tzinfo=TZ),  "triggered", {"trigger_value": 80.0}),
        (datetime(2025, 12, 10, 10, 0, tzinfo=TZ), "completed", {"cost": 42.0, "duration": 30, "notes": "HEPA-Filter Upgrade eingebaut"}),

        (datetime(2026, 2, 5, 9, 0, tzinfo=TZ),    "triggered", {"trigger_value": 69.0}),
        (datetime(2026, 2, 7, 11, 0, tzinfo=TZ),   "triggered", {"trigger_value": 76.0}),
        (datetime(2026, 2, 8, 10, 0, tzinfo=TZ),   "completed", {"cost": 42.0, "duration": 28, "notes": "Regelmäßiger Filtertausch"}),
    ]

    for dt, etype, kwargs in events:
        if etype == "completed":
            history.append(make_completed(dt, **kwargs))
        elif etype == "triggered":
            history.append(make_triggered(dt, **kwargs))
        elif etype == "skipped":
            history.append(make_skipped(dt, **kwargs))

    return history, "2026-02-08"


def generate_family_car_tire_rotation():
    """Tire Rotation - time_based 180d, adaptive ON.
    Bi-annual rotations over 3 years."""
    history = []

    scenarios = [
        (datetime(2023, 4, 10, 9, 0, tzinfo=TZ),  170, 45.0, 30, "needed",     "Spring rotation, front tires more worn"),
        (datetime(2023, 10, 5, 10, 0, tzinfo=TZ),  178, 48.0, 35, "needed",     "Fall rotation before winter"),
        (datetime(2024, 3, 28, 9, 30, tzinfo=TZ),  174, 45.0, 30, "not_needed", "Wear was even, could have waited"),
        (datetime(2024, 10, 1, 11, 0, tzinfo=TZ),  187, 52.0, 40, "needed",     "Overdue - front tires showing uneven wear"),
        (datetime(2025, 3, 15, 10, 0, tzinfo=TZ),  165, 45.0, 30, "needed",     "Pre-summer rotation"),
        (datetime(2025, 5, 20, 9, 0, tzinfo=TZ),   None, None, None, None, None),  # skipped
        (datetime(2025, 9, 22, 10, 0, tzinfo=TZ),  190, 50.0, 35, "needed",     "Long summer trips, good timing"),
        (datetime(2026, 2, 9, 10, 0, tzinfo=TZ),   140, 55.0, 40, "not_sure",   "Early rotation, new tires on rear"),
    ]

    for i, (dt, interval, cost, duration, feedback, notes) in enumerate(scenarios):
        if notes is None:
            # This is a skip entry
            history.append(make_skipped(dt, notes="Postponed - tires still look fine"))
            continue
        history.append(make_completed(dt, cost, duration, notes, feedback))

    last_performed = "2026-02-09"

    adaptive_config = {
        "enabled": True,
        "ewa_alpha": 0.3,
        "min_interval_days": 45,
        "max_interval_days": 365,
        "smoothed_interval": 172.5,
        "feedback_count": 7,
        "confidence": "medium",
        "weibull_beta": 2.8,
        "weibull_eta": 185.0,
        "current_recommendation": 175,
        "recommendation_reason": "ewa_and_weibull",
        "last_analysis_date": "2026-02-09",
        "base_interval": 180,
    }

    return history, last_performed, adaptive_config


def generate_family_car_oil_change():
    """Oil Change - sensor_based 365d.
    Based on mileage sensor with trigger values."""
    history = []

    events = [
        (datetime(2024, 3, 20, 9, 0, tzinfo=TZ),   "triggered", {"trigger_value": 8500.0}),
        (datetime(2024, 4, 2, 14, 0, tzinfo=TZ),    "triggered", {"trigger_value": 9200.0}),
        (datetime(2024, 4, 5, 10, 0, tzinfo=TZ),    "completed", {"cost": 85.0, "duration": 45, "notes": "Oil change at 9500km, synthetic 5W-30"}),

        (datetime(2024, 10, 15, 8, 0, tzinfo=TZ),   "triggered", {"trigger_value": 8800.0}),
        (datetime(2024, 10, 28, 16, 0, tzinfo=TZ),  "triggered", {"trigger_value": 9600.0}),
        (datetime(2024, 11, 2, 10, 30, tzinfo=TZ),  "completed", {"cost": 92.0, "duration": 50, "notes": "Oil dark, filter also replaced"}),

        (datetime(2025, 4, 8, 9, 0, tzinfo=TZ),     "triggered", {"trigger_value": 8200.0}),
        (datetime(2025, 4, 20, 11, 0, tzinfo=TZ),   "triggered", {"trigger_value": 9100.0}),
        (datetime(2025, 4, 22, 10, 0, tzinfo=TZ),   "skipped",   {"notes": "Trip planned, will do after"}),
        (datetime(2025, 5, 5, 9, 30, tzinfo=TZ),    "triggered", {"trigger_value": 9800.0}),
        (datetime(2025, 5, 8, 10, 0, tzinfo=TZ),    "completed", {"cost": 89.0, "duration": 45, "notes": "Delayed oil change, oil was very dark"}),

        (datetime(2025, 11, 20, 8, 30, tzinfo=TZ),  "triggered", {"trigger_value": 8600.0}),
        (datetime(2025, 12, 1, 14, 0, tzinfo=TZ),   "triggered", {"trigger_value": 9300.0}),
        (datetime(2025, 12, 5, 10, 0, tzinfo=TZ),   "completed", {"cost": 95.0, "duration": 55, "notes": "Winter oil change, upgraded to full synthetic"}),

        (datetime(2026, 2, 5, 9, 0, tzinfo=TZ),     "triggered", {"trigger_value": 5200.0}),
        (datetime(2026, 2, 7, 11, 0, tzinfo=TZ),    "triggered", {"trigger_value": 6100.0}),
        (datetime(2026, 2, 8, 10, 0, tzinfo=TZ),    "completed", {"cost": 89.0, "duration": 48, "notes": "Regular oil change, good condition"}),
    ]

    for dt, etype, kwargs in events:
        if etype == "completed":
            history.append(make_completed(dt, **kwargs))
        elif etype == "triggered":
            history.append(make_triggered(dt, **kwargs))
        elif etype == "skipped":
            history.append(make_skipped(dt, **kwargs))

    return history, "2026-02-08"


def generate_water_softener_refill_salt():
    """Refill Salt - sensor_based 30d.
    Monthly refills with sensor trigger data."""
    history = []

    events = [
        (datetime(2025, 5, 2, 8, 0, tzinfo=TZ),    "triggered", {"trigger_value": 25.0}),
        (datetime(2025, 5, 5, 10, 0, tzinfo=TZ),    "completed", {"cost": 18.0, "duration": 10, "notes": "Salz nachgefüllt, 25kg Sack"}),

        (datetime(2025, 6, 3, 9, 0, tzinfo=TZ),     "triggered", {"trigger_value": 22.0}),
        (datetime(2025, 6, 6, 10, 30, tzinfo=TZ),   "completed", {"cost": 18.0, "duration": 10, "notes": "Nachfüllung, Verbrauch normal"}),

        (datetime(2025, 7, 8, 8, 30, tzinfo=TZ),    "triggered", {"trigger_value": 28.0}),
        (datetime(2025, 7, 10, 10, 0, tzinfo=TZ),   "completed", {"cost": 18.0, "duration": 12, "notes": "Hoher Verbrauch im Sommer"}),

        (datetime(2025, 8, 5, 9, 0, tzinfo=TZ),     "triggered", {"trigger_value": 30.0}),
        (datetime(2025, 8, 8, 15, 0, tzinfo=TZ),    "skipped",   {"notes": "Urlaub, Salt noch ausreichend"}),
        (datetime(2025, 8, 22, 8, 0, tzinfo=TZ),    "triggered", {"trigger_value": 35.0}),
        (datetime(2025, 8, 24, 10, 0, tzinfo=TZ),   "completed", {"cost": 22.0, "duration": 15, "notes": "Verzögert nach Urlaub, fast leer"}),

        (datetime(2025, 9, 20, 9, 0, tzinfo=TZ),    "triggered", {"trigger_value": 24.0}),
        (datetime(2025, 9, 22, 10, 0, tzinfo=TZ),   "completed", {"cost": 18.0, "duration": 10, "notes": "Regelmäßige Nachfüllung"}),

        (datetime(2025, 10, 25, 8, 0, tzinfo=TZ),   "triggered", {"trigger_value": 20.0}),
        (datetime(2025, 10, 28, 10, 0, tzinfo=TZ),  "completed", {"cost": 18.0, "duration": 10, "notes": "Herbst, weniger Verbrauch"}),

        (datetime(2025, 12, 2, 9, 0, tzinfo=TZ),    "triggered", {"trigger_value": 18.0}),
        (datetime(2025, 12, 5, 10, 0, tzinfo=TZ),   "completed", {"cost": 19.50, "duration": 12, "notes": "Preiserhöhung beim Salz"}),

        (datetime(2026, 1, 8, 8, 30, tzinfo=TZ),    "triggered", {"trigger_value": 22.0}),
        (datetime(2026, 1, 10, 10, 0, tzinfo=TZ),   "completed", {"cost": 19.50, "duration": 10, "notes": "Normaler Winterverbrauch"}),

        (datetime(2026, 2, 6, 9, 0, tzinfo=TZ),     "triggered", {"trigger_value": 26.0}),
        (datetime(2026, 2, 8, 10, 0, tzinfo=TZ),    "completed", {"cost": 19.50, "duration": 11, "notes": "Letzte Nachfüllung"}),
    ]

    for dt, etype, kwargs in events:
        if etype == "completed":
            history.append(make_completed(dt, **kwargs))
        elif etype == "triggered":
            history.append(make_triggered(dt, **kwargs))
        elif etype == "skipped":
            history.append(make_skipped(dt, **kwargs))

    return history, "2026-02-08"


def generate_washing_machine_drum_cleaning():
    """Drum Cleaning - sensor_based 180d.
    Bi-annual deep cleaning with cycle count triggers."""
    history = []

    events = [
        (datetime(2024, 8, 10, 8, 0, tzinfo=TZ),   "triggered", {"trigger_value": 145.0}),
        (datetime(2024, 8, 12, 10, 0, tzinfo=TZ),   "triggered", {"trigger_value": 155.0}),
        (datetime(2024, 8, 15, 9, 30, tzinfo=TZ),   "completed", {"cost": 5.0, "duration": 90, "notes": "Hot wash cycle with cleaner tablet"}),

        (datetime(2025, 1, 22, 9, 0, tzinfo=TZ),    "triggered", {"trigger_value": 148.0}),
        (datetime(2025, 1, 25, 14, 0, tzinfo=TZ),   "triggered", {"trigger_value": 160.0}),
        (datetime(2025, 1, 28, 10, 0, tzinfo=TZ),   "completed", {"cost": 8.0, "duration": 95, "notes": "Trommelreinigung + Dichtung geputzt"}),

        (datetime(2025, 5, 5, 8, 0, tzinfo=TZ),     "triggered", {"trigger_value": 140.0}),
        (datetime(2025, 5, 8, 16, 0, tzinfo=TZ),    "skipped",   {"notes": "Noch kein Geruch, warte noch"}),

        (datetime(2025, 7, 15, 9, 0, tzinfo=TZ),    "triggered", {"trigger_value": 165.0}),
        (datetime(2025, 7, 18, 10, 0, tzinfo=TZ),   "triggered", {"trigger_value": 178.0}),
        (datetime(2025, 7, 20, 9, 0, tzinfo=TZ),    "completed", {"cost": 12.0, "duration": 100, "notes": "Gründliche Reinigung, leichter Geruch vorher"}),

        (datetime(2025, 12, 10, 8, 30, tzinfo=TZ),  "triggered", {"trigger_value": 150.0}),
        (datetime(2025, 12, 15, 14, 0, tzinfo=TZ),  "triggered", {"trigger_value": 162.0}),
        (datetime(2025, 12, 18, 10, 0, tzinfo=TZ),  "completed", {"cost": 8.0, "duration": 90, "notes": "Jahresend-Reinigung, alles gut"}),

        (datetime(2026, 2, 3, 9, 0, tzinfo=TZ),     "triggered", {"trigger_value": 130.0}),
        (datetime(2026, 2, 6, 11, 0, tzinfo=TZ),    "triggered", {"trigger_value": 142.0}),
        (datetime(2026, 2, 8, 10, 0, tzinfo=TZ),    "completed", {"cost": 8.0, "duration": 92, "notes": "Regelmäßige Trommelreinigung"}),
    ]

    for dt, etype, kwargs in events:
        if etype == "completed":
            history.append(make_completed(dt, **kwargs))
        elif etype == "triggered":
            history.append(make_triggered(dt, **kwargs))
        elif etype == "skipped":
            history.append(make_skipped(dt, **kwargs))

    return history, "2026-02-08"


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    print("Reading HA config entries storage...")
    with open(STORAGE_PATH, "r") as f:
        storage = json.load(f)

    entries = storage.get("data", {}).get("entries", [])

    # Build a task lookup: entry_id -> {task_name: task_id}
    task_map = {}
    for entry in entries:
        if entry.get("domain") != "maintenance_supporter":
            continue
        eid = entry["entry_id"]
        title = entry.get("title", "")
        tasks = entry.get("data", {}).get("tasks", {})
        if tasks:
            task_map[title] = {"entry": entry, "tasks": {}}
            for tid, tdata in tasks.items():
                task_map[title]["tasks"][tdata["name"]] = {"id": tid, "data": tdata}

    print("Found objects:", list(task_map.keys()))

    changes = 0

    # ─── Pool Pump / Annual Inspection ───
    if "Pool Pump" in task_map and "Annual Inspection" in task_map["Pool Pump"]["tasks"]:
        task = task_map["Pool Pump"]["tasks"]["Annual Inspection"]
        history, lp = generate_pool_pump_annual_inspection()
        task["data"]["history"] = history
        task["data"]["last_performed"] = lp
        print(f"  Pool Pump / Annual Inspection: {len(history)} entries")
        changes += 1

    # ─── Pool Pump / Filter Cleaning ───
    if "Pool Pump" in task_map and "Filter Cleaning" in task_map["Pool Pump"]["tasks"]:
        task = task_map["Pool Pump"]["tasks"]["Filter Cleaning"]
        history, lp, ac = generate_pool_pump_filter_cleaning()
        task["data"]["history"] = history
        task["data"]["last_performed"] = lp
        task["data"]["adaptive_config"] = ac
        print(f"  Pool Pump / Filter Cleaning: {len(history)} entries (adaptive updated)")
        changes += 1

    # ─── HVAC System / Filter Tausch ───
    if "HVAC System" in task_map and "Filter Tausch" in task_map["HVAC System"]["tasks"]:
        task = task_map["HVAC System"]["tasks"]["Filter Tausch"]
        history, lp = generate_hvac_filter_tausch()
        task["data"]["history"] = history
        task["data"]["last_performed"] = lp
        print(f"  HVAC System / Filter Tausch: {len(history)} entries")
        changes += 1

    # ─── Family Car / Tire Rotation ───
    if "Family Car" in task_map and "Tire Rotation" in task_map["Family Car"]["tasks"]:
        task = task_map["Family Car"]["tasks"]["Tire Rotation"]
        history, lp, ac = generate_family_car_tire_rotation()
        task["data"]["history"] = history
        task["data"]["last_performed"] = lp
        task["data"]["adaptive_config"] = ac
        print(f"  Family Car / Tire Rotation: {len(history)} entries (adaptive updated)")
        changes += 1

    # ─── Family Car / Oil Change ───
    if "Family Car" in task_map and "Oil Change" in task_map["Family Car"]["tasks"]:
        task = task_map["Family Car"]["tasks"]["Oil Change"]
        history, lp = generate_family_car_oil_change()
        task["data"]["history"] = history
        task["data"]["last_performed"] = lp
        print(f"  Family Car / Oil Change: {len(history)} entries")
        changes += 1

    # ─── Water Softener / Refill Salt ───
    if "Water Softener" in task_map and "Refill Salt" in task_map["Water Softener"]["tasks"]:
        task = task_map["Water Softener"]["tasks"]["Refill Salt"]
        history, lp = generate_water_softener_refill_salt()
        task["data"]["history"] = history
        task["data"]["last_performed"] = lp
        print(f"  Water Softener / Refill Salt: {len(history)} entries")
        changes += 1

    # ─── Washing Machine / Drum Cleaning ───
    if "Washing Machine" in task_map and "Drum Cleaning" in task_map["Washing Machine"]["tasks"]:
        task = task_map["Washing Machine"]["tasks"]["Drum Cleaning"]
        history, lp = generate_washing_machine_drum_cleaning()
        task["data"]["history"] = history
        task["data"]["last_performed"] = lp
        print(f"  Washing Machine / Drum Cleaning: {len(history)} entries")
        changes += 1

    if changes == 0:
        print("\nNo changes made!")
        return

    # Write back - update task data in entries
    for entry in entries:
        if entry.get("domain") != "maintenance_supporter":
            continue
        title = entry.get("title", "")
        if title in task_map:
            tasks_dict = {}
            for tname, tinfo in task_map[title]["tasks"].items():
                tasks_dict[tinfo["id"]] = tinfo["data"]
            entry["data"]["tasks"] = tasks_dict

    # Bump version
    storage["data"]["entries"] = entries

    print(f"\nWriting {changes} updated tasks back to storage...")
    with open(STORAGE_PATH, "w") as f:
        json.dump(storage, f, indent=2, ensure_ascii=False)

    print("DONE! Restart Home Assistant to load new data.")
    print("  s6-svc -u /run/s6-legacy-services/homeassistant")


if __name__ == "__main__":
    main()
