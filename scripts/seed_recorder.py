"""Inject 1 year of granular recorder history into the HA SQLite database.

Populates the `statistics`, `statistics_meta`, `states`, `states_meta`, and
`state_attributes` tables so that HA history graphs show realistic data for
all synthetic test entities and maintenance sensors.

Run AFTER setup_demo.py + seed_history.py, with HA **stopped**.
Requires: docker/config-dev/home-assistant_v2.db must exist.

Usage:
    python scripts/seed_recorder.py
"""

from __future__ import annotations

import hashlib
import json
import math
import random
import sqlite3
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "docker" / "config-dev" / "home-assistant_v2.db"

# Reference date: "now" for the generated data.
# Use a fixed date so the script is deterministic.
NOW = datetime(2026, 3, 7, 12, 0, 0, tzinfo=timezone.utc)
# Generate ~13 months of history
START = NOW - timedelta(days=395)

random.seed(42)  # Reproducible data


# ---------------------------------------------------------------------------
# Data generators
# ---------------------------------------------------------------------------

def gen_seasonal_temperature(start: datetime, end: datetime) -> list[tuple[float, float]]:
    """Outdoor temperature with seasonal pattern + daily cycle + noise.

    Returns [(unix_ts, value), ...] at hourly intervals.
    """
    points = []
    t = start
    while t < end:
        day_of_year = t.timetuple().tm_yday
        hour = t.hour
        # Seasonal: ~5C in Jan, ~25C in Jul (Northern hemisphere)
        seasonal = 15 + 12 * math.sin(2 * math.pi * (day_of_year - 100) / 365)
        # Daily cycle: +/-4C, peak at 14:00
        daily = 4 * math.sin(2 * math.pi * (hour - 6) / 24)
        # Weather noise
        noise = random.gauss(0, 2)
        val = round(seasonal + daily + noise, 1)
        val = max(-25.0, min(42.0, val))
        points.append((t.timestamp(), val))
        t += timedelta(hours=1)
    return points


def gen_seasonal_humidity(temp_points: list[tuple[float, float]]) -> list[tuple[float, float]]:
    """Humidity inversely correlated with temperature."""
    points = []
    for ts, temp in temp_points:
        base = 75 - temp * 0.8
        noise = random.gauss(0, 5)
        val = round(max(20, min(98, base + noise)), 0)
        points.append((ts, val))
    return points


def gen_stable_sensor(
    start: datetime, end: datetime,
    center: float, noise_std: float,
    low: float, high: float,
    interval_hours: int = 1,
) -> list[tuple[float, float]]:
    """Sensor that fluctuates around a center value."""
    points = []
    t = start
    val = center
    while t < end:
        val = center + random.gauss(0, noise_std)
        val = round(max(low, min(high, val)), 1)
        points.append((t.timestamp(), val))
        t += timedelta(hours=interval_hours)
    return points


def gen_degrading_sensor(
    start: datetime, end: datetime,
    initial: float, rate_per_day: float,
    reset_events: list[tuple[datetime, float]],
    noise_std: float,
    low: float, high: float,
) -> list[tuple[float, float]]:
    """Sensor that degrades over time with reset events (e.g. filter replacement).

    reset_events: [(datetime, reset_value), ...] sorted by time.
    """
    points = []
    t = start
    val = initial
    reset_idx = 0
    last_t = start

    while t < end:
        # Check for resets
        while reset_idx < len(reset_events) and t >= reset_events[reset_idx][0]:
            val = reset_events[reset_idx][1]
            reset_idx += 1
            last_t = t

        # Degrade
        days_elapsed = (t - last_t).total_seconds() / 86400
        degraded = val - rate_per_day * days_elapsed
        noise = random.gauss(0, noise_std)
        out = round(max(low, min(high, degraded + noise)), 1)
        points.append((t.timestamp(), out))
        t += timedelta(hours=1)
    return points


def gen_monotonic_counter(
    start: datetime, end: datetime,
    initial: float, avg_daily_increase: float,
    daily_std: float,
) -> list[tuple[float, float]]:
    """Counter that only goes up (odometer, page count, etc.).

    One value per hour but only increases during "active" hours.
    """
    points = []
    t = start
    val = initial
    current_day = None
    day_increase = 0.0
    day_target = 0.0

    while t < end:
        if t.date() != current_day:
            current_day = t.date()
            # Some days have zero usage (weekends/holidays ~20%)
            if random.random() < 0.2:
                day_target = 0
            else:
                day_target = max(0, random.gauss(avg_daily_increase, daily_std))
            day_increase = 0

        # Distribute increase during daytime hours (8-18)
        if 8 <= t.hour <= 18 and day_increase < day_target:
            increment = day_target / 11  # spread over ~11 hours
            increment *= random.uniform(0.5, 1.5)
            val += increment
            day_increase += increment

        points.append((t.timestamp(), round(val, 1)))
        t += timedelta(hours=1)
    return points


def gen_tire_pressure(
    start: datetime, end: datetime,
    initial: float,
    temp_points: list[tuple[float, float]],
) -> list[tuple[float, float]]:
    """Tire pressure correlated with temperature, slow leak, refills."""
    points = []
    t = start
    base = initial
    temp_map = {int(ts): temp for ts, temp in temp_points}
    leak_rate = random.uniform(0.001, 0.003)  # bar per day
    last_refill = start

    while t < end:
        ts = t.timestamp()
        days_since_refill = (t - last_refill).total_seconds() / 86400
        leak = leak_rate * days_since_refill

        # Temperature effect: ~0.01 bar per degree C
        temp = temp_map.get(int(ts), 15.0)
        temp_effect = (temp - 15) * 0.008

        val = base - leak + temp_effect + random.gauss(0, 0.02)
        val = round(max(1.5, min(3.5, val)), 2)

        # Refill when too low
        if val < 2.0:
            base = initial + random.uniform(-0.05, 0.05)
            last_refill = t
            val = base

        points.append((ts, val))
        t += timedelta(hours=4)  # every 4 hours

    return points


def gen_boolean_cycles(
    start: datetime, end: datetime,
    avg_cycles_per_day: float,
    on_duration_hours: float,
    seasonal_factor: float | None = None,
) -> list[tuple[float, str]]:
    """Boolean sensor with on/off cycles.

    Returns [(unix_ts, "on"/"off"), ...].
    """
    points: list[tuple[float, str]] = []
    t = start
    state = "off"

    while t < end:
        if state == "off":
            # Time until next on
            rate = avg_cycles_per_day / 24
            if seasonal_factor is not None:
                day_of_year = t.timetuple().tm_yday
                # Higher in summer (pool pump, heat pump inverted)
                season = 1 + seasonal_factor * math.sin(
                    2 * math.pi * (day_of_year - 100) / 365
                )
                rate *= max(0.1, season)
            if rate <= 0:
                t += timedelta(hours=1)
                continue
            wait_hours = random.expovariate(rate)
            t += timedelta(hours=wait_hours)
            if t >= end:
                break
            state = "on"
            points.append((t.timestamp(), "on"))
        else:
            # On duration with variation
            duration = max(0.1, random.gauss(on_duration_hours, on_duration_hours * 0.3))
            t += timedelta(hours=duration)
            if t >= end:
                break
            state = "off"
            points.append((t.timestamp(), "off"))

    return points


def gen_battery_soh(
    start: datetime, end: datetime,
    initial: float,
) -> list[tuple[float, float]]:
    """Very slow degradation of battery health."""
    points = []
    t = start
    total_days = (end - start).total_seconds() / 86400
    # Lose ~1% per year
    rate = 1.0 / 365

    while t < end:
        days = (t - start).total_seconds() / 86400
        val = initial - rate * days + random.gauss(0, 0.05)
        val = round(max(80, min(100, val)), 1)
        # Only one reading per day (battery check is infrequent)
        points.append((t.timestamp(), val))
        t += timedelta(hours=6)

    return points


def gen_maintenance_states(
    history_entries: list[dict],
    interval_days: int,
    warning_days: int,
) -> list[tuple[float, str]]:
    """Generate maintenance sensor state transitions from history.

    Based on history entries, creates ok -> due_soon -> overdue -> ok cycles.
    """
    states: list[tuple[float, str]] = []
    if not history_entries:
        return states

    for i, entry in enumerate(history_entries):
        ts_str = entry["timestamp"]
        # Parse ISO timestamp
        completed_dt = datetime.fromisoformat(ts_str)

        if entry.get("type") == "skipped":
            states.append((completed_dt.timestamp(), "ok"))
            continue

        # After completion: ok
        states.append((completed_dt.timestamp(), "ok"))

        # Calculate when it becomes due_soon and overdue
        due_date = completed_dt + timedelta(days=interval_days)
        warn_date = due_date - timedelta(days=warning_days)
        overdue_date = due_date

        # Only add transitions if they're before the next completion
        next_completed = None
        for j in range(i + 1, len(history_entries)):
            if history_entries[j].get("type") == "completed":
                next_completed = datetime.fromisoformat(history_entries[j]["timestamp"])
                break

        cutoff = next_completed if next_completed else NOW

        if warn_date < cutoff:
            states.append((warn_date.timestamp(), "due_soon"))
        if overdue_date < cutoff:
            states.append((overdue_date.timestamp(), "overdue"))

    return states


# ---------------------------------------------------------------------------
# Entity definitions
# ---------------------------------------------------------------------------

# (entity_id, unit, has_mean, has_sum, generator_key)
NUMERIC_ENTITIES: list[tuple[str, str, bool, bool, str]] = [
    ("input_number.hvac_filter_airflow", "%", True, False, "hvac_airflow"),
    ("input_number.water_softener_salt_level", "%", True, False, "salt_level"),
    ("input_number.pool_ph_level", "pH", True, False, "pool_ph"),
    ("input_number.freezer_temperature", "\u00b0C", True, False, "freezer_temp"),
    ("input_number.car_odometer", "km", False, True, "car_odometer"),
    ("input_number.printer_page_count", "pages", False, True, "printer_pages"),
    ("input_number.generator_run_cycles", "cycles", False, True, "generator_cycles"),
    ("input_number.water_filter_flow_rate", "L/min", True, False, "filter_flow"),
    ("input_number.water_filter_total_liters", "L", False, True, "filter_liters"),
    ("input_number.outdoor_temperature", "\u00b0C", True, False, "outdoor_temp"),
    ("input_number.outdoor_humidity", "%", True, False, "outdoor_humidity"),
    ("input_number.indoor_temperature", "\u00b0C", True, False, "indoor_temp"),
    ("input_number.indoor_humidity", "%", True, False, "indoor_humidity"),
    ("input_number.ev_tire_pressure_fl", "bar", True, False, "ev_tire_fl"),
    ("input_number.ev_tire_pressure_fr", "bar", True, False, "ev_tire_fr"),
    ("input_number.ev_tire_pressure_rl", "bar", True, False, "ev_tire_rl"),
    ("input_number.ev_tire_pressure_rr", "bar", True, False, "ev_tire_rr"),
    ("input_number.ev_odometer", "km", False, True, "ev_odometer"),
    ("input_number.ev_battery_soh", "%", True, False, "ev_soh"),
    ("input_number.ev_brake_pad_thickness", "mm", True, False, "ev_brake_pad"),
    ("input_number.solar_panel_output", "%", True, False, "solar_output"),
    ("input_number.hvac_energy_kwh", "kWh", False, True, "hvac_energy"),
]

BOOLEAN_ENTITIES: list[tuple[str, str]] = [
    ("input_boolean.washing_machine_running", "washing_machine"),
    ("input_boolean.garage_door_motor", "garage_door"),
    ("input_boolean.dishwasher_running", "dishwasher"),
    ("input_boolean.workshop_compressor", "compressor"),
    ("input_boolean.server_rack_fan", "server_fan"),
    ("input_boolean.heat_pump_active", "heat_pump"),
    ("input_boolean.pool_pump_active", "pool_pump"),
    ("input_boolean.ev_charging", "ev_charging"),
]

# Maintenance sensor entity IDs and their history/interval info
# (entity_id, object_name, task_name, interval_days, warning_days)
MAINTENANCE_ENTITIES: list[tuple[str, str, str, int, int]] = [
    ("sensor.hvac_system_filter_replacement", "HVAC System", "Filter Replacement", 90, 14),
    ("sensor.family_car_oil_change", "Family Car", "Oil Change", 365, 30),
    ("sensor.family_car_tire_rotation", "Family Car", "Tire Rotation", 180, 14),
    ("sensor.washing_machine_drum_cleaning", "Washing Machine", "Drum Cleaning", 180, 14),
    ("sensor.water_softener_refill_salt", "Water Softener", "Refill Salt", 60, 7),
    ("sensor.workshop_compressor_oil_change", "Workshop Compressor", "Oil Change", 365, 14),
    ("sensor.workshop_compressor_air_filter", "Workshop Compressor", "Air Filter", 180, 14),
    ("sensor.water_filter_system_cartridge_replacement", "Water Filter System", "Cartridge Replacement", 180, 14),
    ("sensor.swimming_pool_ph_test", "Swimming Pool", "pH Test", 14, 3),
    ("sensor.swimming_pool_water_treatment", "Swimming Pool", "Water Treatment", 7, 1),
    ("sensor.3d_printer_nozzle_replacement", "3D Printer", "Nozzle Replacement", 365, 7),
    ("sensor.3d_printer_lubrication", "3D Printer", "Lubrication", 60, 7),
    ("sensor.electric_car_tire_pressure_check", "Electric Car", "Tire Pressure Check", 30, 3),
    ("sensor.electric_car_brake_pad_inspection", "Electric Car", "Brake Pad Inspection", 365, 30),
    ("sensor.electric_car_cabin_air_filter", "Electric Car", "Cabin Air Filter", 365, 30),
    ("sensor.electric_car_wiper_blades", "Electric Car", "Wiper Blades", 365, 14),
    ("sensor.electric_car_battery_health_check", "Electric Car", "Battery Health Check", 365, 30),
    ("sensor.electric_car_charging_cycle_log", "Electric Car", "Charging Cycle Log", 365, 14),
]


# ---------------------------------------------------------------------------
# History data (copy from seed_history.py for maintenance state generation)
# ---------------------------------------------------------------------------

HISTORY_DATA: dict[str, dict[str, list[dict]]] = {
    "HVAC System": {
        "Filter Replacement": [
            {"timestamp": "2025-04-10T09:30:00+02:00", "type": "completed"},
            {"timestamp": "2025-07-05T14:00:00+02:00", "type": "completed"},
            {"timestamp": "2025-10-02T10:15:00+02:00", "type": "completed"},
            {"timestamp": "2026-01-08T11:00:00+01:00", "type": "completed"},
        ],
    },
    "Family Car": {
        "Oil Change": [
            {"timestamp": "2025-06-20T08:00:00+02:00", "type": "completed"},
        ],
        "Tire Rotation": [
            {"timestamp": "2025-05-01T10:00:00+02:00", "type": "completed"},
            {"timestamp": "2025-11-01T09:30:00+01:00", "type": "completed"},
        ],
    },
    "Washing Machine": {
        "Drum Cleaning": [
            {"timestamp": "2025-07-01T18:00:00+02:00", "type": "completed"},
            {"timestamp": "2025-08-03T17:30:00+02:00", "type": "completed"},
            {"timestamp": "2025-09-07T19:00:00+02:00", "type": "completed"},
            {"timestamp": "2025-10-05T18:15:00+02:00", "type": "completed"},
            {"timestamp": "2025-11-09T17:00:00+01:00", "type": "completed"},
            {"timestamp": "2025-12-14T18:30:00+01:00", "type": "completed"},
            {"timestamp": "2026-01-18T17:45:00+01:00", "type": "completed"},
            {"timestamp": "2026-02-22T18:00:00+01:00", "type": "completed"},
        ],
    },
    "Water Softener": {
        "Refill Salt": [
            {"timestamp": "2025-05-10T10:00:00+02:00", "type": "completed"},
            {"timestamp": "2025-06-25T09:30:00+02:00", "type": "completed"},
            {"timestamp": "2025-08-08T11:00:00+02:00", "type": "completed"},
            {"timestamp": "2025-08-20T00:00:00+02:00", "type": "skipped"},
            {"timestamp": "2025-10-15T10:30:00+02:00", "type": "completed"},
            {"timestamp": "2025-12-01T09:00:00+01:00", "type": "completed"},
            {"timestamp": "2026-01-15T10:00:00+01:00", "type": "completed"},
            {"timestamp": "2026-02-28T09:45:00+01:00", "type": "completed"},
        ],
    },
    "Workshop Compressor": {
        "Oil Change": [
            {"timestamp": "2025-09-15T14:00:00+02:00", "type": "completed"},
        ],
        "Air Filter": [
            {"timestamp": "2025-06-01T15:00:00+02:00", "type": "completed"},
            {"timestamp": "2025-12-05T14:30:00+01:00", "type": "completed"},
        ],
    },
    "Water Filter System": {
        "Cartridge Replacement": [
            {"timestamp": "2025-05-20T11:00:00+02:00", "type": "completed"},
            {"timestamp": "2025-11-10T10:30:00+01:00", "type": "completed"},
        ],
    },
    "Swimming Pool": {
        "pH Test": [
            {"timestamp": "2025-05-05T10:00:00+02:00", "type": "completed"},
            {"timestamp": "2025-05-19T09:30:00+02:00", "type": "completed"},
            {"timestamp": "2025-06-02T10:15:00+02:00", "type": "completed"},
            {"timestamp": "2025-06-16T10:00:00+02:00", "type": "completed"},
            {"timestamp": "2025-06-30T09:45:00+02:00", "type": "completed"},
            {"timestamp": "2025-07-14T10:00:00+02:00", "type": "completed"},
            {"timestamp": "2025-07-28T10:30:00+02:00", "type": "completed"},
            {"timestamp": "2025-08-11T09:30:00+02:00", "type": "completed"},
            {"timestamp": "2025-08-25T10:00:00+02:00", "type": "completed"},
            {"timestamp": "2025-09-08T10:15:00+02:00", "type": "completed"},
            {"timestamp": "2025-09-22T10:00:00+02:00", "type": "completed"},
            {"timestamp": "2025-10-06T10:30:00+02:00", "type": "completed"},
        ],
        "Water Treatment": [
            {"timestamp": "2025-05-05T11:00:00+02:00", "type": "completed"},
            {"timestamp": "2025-05-12T11:30:00+02:00", "type": "completed"},
            {"timestamp": "2025-05-19T10:45:00+02:00", "type": "completed"},
            {"timestamp": "2025-05-26T11:00:00+02:00", "type": "completed"},
            {"timestamp": "2025-06-02T11:15:00+02:00", "type": "completed"},
            {"timestamp": "2025-06-09T10:30:00+02:00", "type": "completed"},
            {"timestamp": "2025-06-16T11:00:00+02:00", "type": "completed"},
            {"timestamp": "2025-06-23T11:30:00+02:00", "type": "completed"},
            {"timestamp": "2025-06-30T10:45:00+02:00", "type": "completed"},
            {"timestamp": "2025-07-07T11:00:00+02:00", "type": "completed"},
            {"timestamp": "2025-07-14T11:15:00+02:00", "type": "completed"},
            {"timestamp": "2025-07-21T10:30:00+02:00", "type": "completed"},
            {"timestamp": "2025-07-28T11:00:00+02:00", "type": "completed"},
            {"timestamp": "2025-08-04T11:30:00+02:00", "type": "completed"},
            {"timestamp": "2025-08-11T10:45:00+02:00", "type": "completed"},
        ],
    },
    "3D Printer": {
        "Nozzle Replacement": [
            {"timestamp": "2025-08-10T16:00:00+02:00", "type": "completed"},
        ],
        "Lubrication": [
            {"timestamp": "2025-06-15T20:00:00+02:00", "type": "completed"},
            {"timestamp": "2025-08-14T19:30:00+02:00", "type": "completed"},
            {"timestamp": "2025-10-13T20:00:00+02:00", "type": "completed"},
            {"timestamp": "2025-12-12T19:45:00+01:00", "type": "completed"},
        ],
    },
    "Electric Car": {
        "Tire Pressure Check": [
            {"timestamp": "2025-11-15T09:00:00+01:00", "type": "completed"},
            {"timestamp": "2025-12-20T10:00:00+01:00", "type": "completed"},
            {"timestamp": "2026-01-25T09:30:00+01:00", "type": "completed"},
            {"timestamp": "2026-02-28T10:15:00+01:00", "type": "completed"},
        ],
        "Brake Pad Inspection": [
            {"timestamp": "2025-10-01T08:30:00+02:00", "type": "completed"},
        ],
        "Cabin Air Filter": [
            {"timestamp": "2025-09-15T14:00:00+02:00", "type": "completed"},
        ],
        "Wiper Blades": [
            {"timestamp": "2025-10-20T11:00:00+02:00", "type": "completed"},
        ],
        "Battery Health Check": [
            {"timestamp": "2025-11-01T10:00:00+01:00", "type": "completed"},
        ],
        "Charging Cycle Log": [],
    },
}


def generate_all_data() -> dict[str, list[tuple[float, float | str]]]:
    """Generate time series for all entities."""
    data: dict[str, list[tuple[float, float | str]]] = {}

    # --- Outdoor temperature (needed by other generators) ---
    outdoor_temp = gen_seasonal_temperature(START, NOW)
    data["outdoor_temp"] = outdoor_temp

    # Outdoor humidity
    data["outdoor_humidity"] = gen_seasonal_humidity(outdoor_temp)

    # --- HVAC filter airflow: degrades ~0.15%/day, resets on filter change ---
    data["hvac_airflow"] = gen_degrading_sensor(
        START, NOW, initial=92, rate_per_day=0.15,
        reset_events=[
            (datetime(2025, 4, 10, 9, 30, tzinfo=timezone.utc), 92),
            (datetime(2025, 7, 5, 14, 0, tzinfo=timezone.utc), 90),
            (datetime(2025, 10, 2, 10, 15, tzinfo=timezone.utc), 93),
            (datetime(2026, 1, 8, 11, 0, tzinfo=timezone.utc), 91),
        ],
        noise_std=1.5, low=40, high=100,
    )

    # Salt level: drops ~1.5%/day, refills
    data["salt_level"] = gen_degrading_sensor(
        START, NOW, initial=80, rate_per_day=1.2,
        reset_events=[
            (datetime(2025, 5, 10, 10, 0, tzinfo=timezone.utc), 85),
            (datetime(2025, 6, 25, 9, 30, tzinfo=timezone.utc), 90),
            (datetime(2025, 8, 8, 11, 0, tzinfo=timezone.utc), 95),
            (datetime(2025, 10, 15, 10, 30, tzinfo=timezone.utc), 88),
            (datetime(2025, 12, 1, 9, 0, tzinfo=timezone.utc), 92),
            (datetime(2026, 1, 15, 10, 0, tzinfo=timezone.utc), 90),
            (datetime(2026, 2, 28, 9, 45, tzinfo=timezone.utc), 85),
        ],
        noise_std=2.0, low=5, high=100,
    )

    # Pool pH
    data["pool_ph"] = gen_stable_sensor(START, NOW, 7.4, 0.15, 6.5, 8.5)

    # Freezer temperature
    data["freezer_temp"] = gen_stable_sensor(START, NOW, -20, 0.5, -25, -15)

    # Car odometer
    data["car_odometer"] = gen_monotonic_counter(START, NOW, 42000, 35, 15)

    # Printer page count
    data["printer_pages"] = gen_monotonic_counter(START, NOW, 2800, 8, 5)

    # Generator run cycles
    data["generator_cycles"] = gen_monotonic_counter(START, NOW, 1100, 3, 2)

    # Water filter flow rate: slow degradation
    data["filter_flow"] = gen_degrading_sensor(
        START, NOW, initial=4.2, rate_per_day=0.005,
        reset_events=[
            (datetime(2025, 5, 20, 11, 0, tzinfo=timezone.utc), 4.5),
            (datetime(2025, 11, 10, 10, 30, tzinfo=timezone.utc), 4.3),
        ],
        noise_std=0.15, low=1.0, high=5.0,
    )

    # Water filter total liters
    data["filter_liters"] = gen_monotonic_counter(START, NOW, 3000, 40, 15)

    # Indoor temperature (stable around 21-22)
    data["indoor_temp"] = gen_stable_sensor(START, NOW, 21.5, 0.5, 18, 26)

    # Indoor humidity
    data["indoor_humidity"] = gen_stable_sensor(START, NOW, 45, 3, 30, 65)

    # EV tire pressures (correlated with temperature)
    data["ev_tire_fl"] = gen_tire_pressure(START, NOW, 2.4, outdoor_temp)
    data["ev_tire_fr"] = gen_tire_pressure(START, NOW, 2.4, outdoor_temp)
    data["ev_tire_rl"] = gen_tire_pressure(START, NOW, 2.5, outdoor_temp)
    data["ev_tire_rr"] = gen_tire_pressure(START, NOW, 2.5, outdoor_temp)

    # EV odometer
    data["ev_odometer"] = gen_monotonic_counter(START, NOW, 25000, 30, 15)

    # EV battery SoH
    data["ev_soh"] = gen_battery_soh(START, NOW, 97)

    # EV brake pad thickness
    data["ev_brake_pad"] = gen_degrading_sensor(
        START, NOW, initial=9.0, rate_per_day=0.003,
        reset_events=[], noise_std=0.05, low=3, high=12,
    )

    # Solar panel output: seasonal + weather
    points = []
    t = START
    while t < NOW:
        day_of_year = t.timetuple().tm_yday
        hour = t.hour
        # Higher in summer, lower in winter
        seasonal = 90 + 8 * math.sin(2 * math.pi * (day_of_year - 80) / 365)
        # Cloud/weather variation
        weather = random.gauss(0, 5)
        # Night = 0
        if 6 <= hour <= 20:
            val = seasonal + weather
        else:
            val = 0
        val = round(max(0, min(100, val)), 1)
        points.append((t.timestamp(), val))
        t += timedelta(hours=1)
    data["solar_output"] = points

    # HVAC energy (counter, seasonal - more in winter)
    energy_points: list[tuple[float, float | str]] = []
    t = START
    val = 800.0
    while t < NOW:
        day_of_year = t.timetuple().tm_yday
        # More energy in winter
        seasonal_mult = 1 + 0.5 * math.cos(2 * math.pi * (day_of_year - 15) / 365)
        hourly_kwh = 0.15 * seasonal_mult * random.uniform(0.5, 1.5)
        val += hourly_kwh
        energy_points.append((t.timestamp(), round(val, 1)))
        t += timedelta(hours=1)
    data["hvac_energy"] = energy_points

    # --- Boolean entities ---
    data["washing_machine"] = gen_boolean_cycles(START, NOW, 1.2, 1.5)
    data["garage_door"] = gen_boolean_cycles(START, NOW, 3, 0.02)  # very brief
    data["dishwasher"] = gen_boolean_cycles(START, NOW, 0.8, 2.0)
    data["compressor"] = gen_boolean_cycles(START, NOW, 2, 0.5)
    data["server_fan"] = gen_boolean_cycles(START, NOW, 0.05, 720)  # mostly on
    data["heat_pump"] = gen_boolean_cycles(START, NOW, 8, 0.5, seasonal_factor=-0.6)
    data["pool_pump"] = gen_boolean_cycles(START, NOW, 2, 4, seasonal_factor=0.8)
    data["ev_charging"] = gen_boolean_cycles(START, NOW, 0.3, 6)

    return data


# ---------------------------------------------------------------------------
# SQLite helpers
# ---------------------------------------------------------------------------

def get_or_create_states_meta(
    conn: sqlite3.Connection, entity_id: str
) -> int:
    """Get or create a states_meta entry, return metadata_id."""
    cur = conn.execute(
        "SELECT metadata_id FROM states_meta WHERE entity_id = ?", (entity_id,)
    )
    row = cur.fetchone()
    if row:
        return row[0]
    cur = conn.execute(
        "INSERT INTO states_meta (entity_id) VALUES (?)", (entity_id,)
    )
    return cur.lastrowid  # type: ignore[return-value]


def get_or_create_attributes(
    conn: sqlite3.Connection, attrs: dict
) -> int:
    """Get or create shared attributes entry, return attributes_id."""
    attrs_json = json.dumps(attrs, separators=(",", ":"), sort_keys=True)
    # Must fit in SQLite signed 64-bit integer
    raw = int(hashlib.md5(attrs_json.encode()).hexdigest()[:15], 16)
    attrs_hash = raw if raw < 2**63 else raw - 2**64

    cur = conn.execute(
        "SELECT attributes_id FROM state_attributes WHERE hash = ?", (attrs_hash,)
    )
    row = cur.fetchone()
    if row:
        return row[0]
    cur = conn.execute(
        "INSERT INTO state_attributes (hash, shared_attrs) VALUES (?, ?)",
        (attrs_hash, attrs_json),
    )
    return cur.lastrowid  # type: ignore[return-value]


def get_or_create_statistics_meta(
    conn: sqlite3.Connection,
    statistic_id: str,
    unit: str,
    has_mean: bool,
    has_sum: bool,
) -> int:
    """Get or create statistics_meta, return id."""
    cur = conn.execute(
        "SELECT id FROM statistics_meta WHERE statistic_id = ?", (statistic_id,)
    )
    row = cur.fetchone()
    if row:
        return row[0]

    # Determine unit_class
    unit_class = None
    if unit in ("\u00b0C", "\u00b0F", "K"):
        unit_class = "temperature"
    elif unit in ("km", "m", "mi"):
        unit_class = "distance"
    elif unit in ("kWh", "Wh", "MWh"):
        unit_class = "energy"
    elif unit == "%":
        unit_class = None  # no standard unit_class for percentage
    elif unit in ("bar", "psi", "Pa"):
        unit_class = "pressure"
    elif unit in ("L", "gal", "m\u00b3"):
        unit_class = "volume"

    cur = conn.execute(
        """INSERT INTO statistics_meta
           (statistic_id, source, unit_of_measurement, unit_class,
            has_mean, has_sum, name, mean_type)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
        (statistic_id, "recorder", unit, unit_class, has_mean, has_sum, None, 2),
    )
    return cur.lastrowid  # type: ignore[return-value]


def insert_statistics(
    conn: sqlite3.Connection,
    meta_id: int,
    points: list[tuple[float, float]],
    has_sum: bool,
) -> int:
    """Aggregate hourly points into statistics rows.

    Groups points by hour, computes mean/min/max per hour.
    Returns number of rows inserted.
    """
    # Group by hour
    hourly: dict[int, list[float]] = {}
    for ts, val in points:
        if not isinstance(val, (int, float)):
            continue
        hour_start = int(ts) // 3600 * 3600
        hourly.setdefault(hour_start, []).append(val)

    rows = []
    cumulative_sum = 0.0
    first_val = None
    sorted_hours = sorted(hourly.keys())

    for hour_ts in sorted_hours:
        vals = hourly[hour_ts]
        mean_val = sum(vals) / len(vals)
        min_val = min(vals)
        max_val = max(vals)
        last_val = vals[-1]

        if has_sum:
            if first_val is None:
                first_val = vals[0]
            cumulative_sum = last_val - first_val
            rows.append((
                float(hour_ts), meta_id, float(hour_ts),
                mean_val, len(vals), min_val, max_val,
                None, last_val, cumulative_sum,
            ))
        else:
            rows.append((
                float(hour_ts), meta_id, float(hour_ts),
                mean_val, len(vals), min_val, max_val,
                None, last_val, None,
            ))

    conn.executemany(
        """INSERT INTO statistics
           (created_ts, metadata_id, start_ts, mean, mean_weight,
            min, max, last_reset_ts, state, sum)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        rows,
    )
    return len(rows)


def insert_states(
    conn: sqlite3.Connection,
    metadata_id: int,
    attrs_id: int,
    points: list[tuple[float, float | str]],
    max_recent_days: int = 14,
) -> int:
    """Insert state records.

    For numeric entities: insert last `max_recent_days` of data.
    For strings (boolean/maintenance): insert all points.
    """
    if not points:
        return 0

    cutoff = NOW.timestamp() - max_recent_days * 86400

    rows = []
    prev_state_id = None
    for ts, val in points:
        # For numeric data, only insert recent states
        if isinstance(val, (int, float)) and ts < cutoff:
            continue

        state_str = str(val) if isinstance(val, (int, float)) else val

        rows.append((
            state_str,       # state
            attrs_id,        # attributes_id
            ts,              # last_changed_ts
            ts,              # last_updated_ts
            ts,              # last_reported_ts
            metadata_id,     # metadata_id
            None,            # old_state_id (set below)
            0,               # origin_idx
            None,            # context_id_bin
        ))

    if not rows:
        return 0

    inserted = 0
    for row in rows:
        cur = conn.execute(
            """INSERT INTO states
               (state, attributes_id, last_changed_ts, last_updated_ts,
                last_reported_ts, metadata_id, old_state_id, origin_idx,
                context_id_bin)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (*row[:6], prev_state_id, *row[7:]),
        )
        prev_state_id = cur.lastrowid
        inserted += 1

    return inserted


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    if not DB_PATH.exists():
        print(f"ERROR: Database not found: {DB_PATH}")
        print("  Make sure HA has been started at least once.")
        sys.exit(1)

    print(f"Database: {DB_PATH}")
    print(f"Time range: {START.date()} to {NOW.date()} ({(NOW - START).days} days)")

    # Generate all data
    print("\nGenerating time series data...")
    data = generate_all_data()

    conn = sqlite3.connect(str(DB_PATH))
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA synchronous=NORMAL")

    try:
        # --- Numeric entities ---
        print("\nSeeding numeric entities...")
        for entity_id, unit, has_mean, has_sum, gen_key in NUMERIC_ENTITIES:
            points = data.get(gen_key, [])
            if not points:
                print(f"  WARNING: No data for {entity_id}")
                continue

            # Ensure all points are numeric tuples
            numeric_points = [(ts, float(v)) for ts, v in points if isinstance(v, (int, float))]

            meta_id = get_or_create_states_meta(conn, entity_id)
            attrs = {"unit_of_measurement": unit}
            attrs_id = get_or_create_attributes(conn, attrs)

            # Statistics (full year, hourly)
            stat_meta_id = get_or_create_statistics_meta(
                conn, entity_id, unit, has_mean, has_sum
            )
            n_stats = insert_statistics(conn, stat_meta_id, numeric_points, has_sum)

            # States (recent only)
            n_states = insert_states(conn, meta_id, attrs_id, numeric_points)

            print(f"  {entity_id}: {n_stats} statistics, {n_states} states")

        # --- Boolean entities ---
        print("\nSeeding boolean entities...")
        for entity_id, gen_key in BOOLEAN_ENTITIES:
            points = data.get(gen_key, [])
            if not points:
                print(f"  WARNING: No data for {entity_id}")
                continue

            meta_id = get_or_create_states_meta(conn, entity_id)
            attrs = {}
            attrs_id = get_or_create_attributes(conn, attrs)

            # No statistics for booleans - just states
            # Insert all state changes (they're already sparse)
            n_states = insert_states(
                conn, meta_id, attrs_id, points, max_recent_days=9999
            )
            print(f"  {entity_id}: {n_states} states")

        # --- Maintenance sensor entities ---
        print("\nSeeding maintenance sensor states...")
        for entity_id, obj_name, task_name, interval, warning in MAINTENANCE_ENTITIES:
            history = HISTORY_DATA.get(obj_name, {}).get(task_name, [])
            if not history:
                print(f"  {entity_id}: no history, skipping")
                continue

            states = gen_maintenance_states(history, interval, warning)
            if not states:
                continue

            # Convert to list of (ts, state_str)
            state_points: list[tuple[float, float | str]] = [
                (ts, state) for ts, state in states
            ]

            meta_id = get_or_create_states_meta(conn, entity_id)
            attrs = {"device_class": "enum"}
            attrs_id = get_or_create_attributes(conn, attrs)

            n_states = insert_states(
                conn, meta_id, attrs_id, state_points, max_recent_days=9999
            )
            print(f"  {entity_id}: {n_states} states")

        conn.commit()
        print("\nDone! Recorder database seeded successfully.")

        # Print summary
        cur = conn.execute("SELECT COUNT(*) FROM statistics")
        n_total_stats = cur.fetchone()[0]
        cur = conn.execute("SELECT COUNT(*) FROM states")
        n_total_states = cur.fetchone()[0]
        cur = conn.execute("SELECT COUNT(*) FROM statistics_meta")
        n_stat_meta = cur.fetchone()[0]
        print(f"  Total: {n_total_stats} statistics rows, {n_total_states} state rows, {n_stat_meta} statistics_meta entries")

    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    main()
