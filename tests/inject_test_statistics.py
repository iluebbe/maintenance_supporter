"""Inject realistic test statistics into the HA recorder database.

Usage:
    1. docker compose stop ha-dev
    2. python inject_test_statistics.py
    3. docker compose start ha-dev

Generates 90 days of hourly statistics for all trigger entities
used by the Maintenance Supporter integration.
"""

import math
import os
import random
import sqlite3
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path

DB_PATH = Path(
    os.environ.get(
        "HA_DB_PATH",
        str(Path(__file__).parent.parent / "docker" / "config-dev" / "home-assistant_v2.db"),
    )
)

# How many days of hourly data to generate
DAYS = 90
# How many days of 5-min short-term data
SHORT_TERM_DAYS = 10

NOW = datetime.now(timezone.utc)
START = NOW - timedelta(days=DAYS)

# Entity definitions with time series generators
ENTITIES = [
    {
        "statistic_id": "input_number.hvac_filter_airflow",
        "unit_of_measurement": "%",
        "unit_class": None,
        "has_mean": True,
        "has_sum": False,
        "mean_type": 1,  # ARITHMETIC
        "generator": "hvac_airflow",
    },
    {
        "statistic_id": "input_number.car_odometer",
        "unit_of_measurement": "km",
        "unit_class": "distance",
        "has_mean": False,
        "has_sum": True,
        "mean_type": 0,  # NONE (counter)
        "generator": "car_odometer",
    },
    {
        "statistic_id": "input_number.water_softener_salt_level",
        "unit_of_measurement": "%",
        "unit_class": None,
        "has_mean": True,
        "has_sum": False,
        "mean_type": 1,
        "generator": "salt_level",
    },
    {
        "statistic_id": "input_number.washing_machine_cycles",
        "unit_of_measurement": "cycles",
        "unit_class": None,
        "has_mean": False,
        "has_sum": True,
        "mean_type": 0,
        "generator": "washing_cycles",
    },
    {
        "statistic_id": "input_number.pool_filter_pressure",
        "unit_of_measurement": "bar",
        "unit_class": "pressure",
        "has_mean": True,
        "has_sum": False,
        "mean_type": 1,
        "generator": "pool_pressure",
    },
    {
        "statistic_id": "sensor.test_trigger_pressure",
        "unit_of_measurement": "bar",
        "unit_class": "pressure",
        "has_mean": True,
        "has_sum": False,
        "mean_type": 1,
        "generator": "test_pressure",
    },
]


def generate_hvac_airflow(hour_index: int, total_hours: int) -> tuple[float, float, float]:
    """HVAC filter airflow: starts at 95%, decays to ~60% over 30 days, then resets.

    Returns (mean, min, max).
    """
    cycle_hours = 30 * 24  # 30-day cycle
    pos_in_cycle = hour_index % cycle_hours
    # Linear decay from 95 to 60 over the cycle
    base = 95.0 - (35.0 * pos_in_cycle / cycle_hours)
    noise = random.gauss(0, 2.0)
    mean = max(40.0, min(100.0, base + noise))
    mn = mean - abs(random.gauss(0, 1.5))
    mx = mean + abs(random.gauss(0, 1.5))
    return round(mean, 2), round(max(0, mn), 2), round(min(100, mx), 2)


def generate_car_odometer(hour_index: int, total_hours: int) -> tuple[float, float, float]:
    """Car odometer: starts at 48000, increases ~40 km/day.

    For counter entities: mean=None, state=cumulative, sum=total increase.
    Returns (state_value, _, _) — min/max not meaningful for counters.
    """
    day = hour_index // 24
    hour_of_day = hour_index % 24
    # Daily distance: 20-60 km with weekend variation
    day_of_week = (START + timedelta(hours=hour_index)).weekday()
    if day_of_week >= 5:  # weekend
        daily_km = random.uniform(5, 30)
    else:
        daily_km = random.uniform(25, 55)
    # Distribute km across daytime hours (7-21)
    if 7 <= hour_of_day <= 21:
        hourly_km = daily_km / 14 + random.uniform(-0.5, 0.5)
    else:
        hourly_km = random.uniform(0, 0.5)
    # Cumulative
    base = 48000.0
    km_per_hour = 40.0 / 24  # average
    cumulative = base + hour_index * km_per_hour + random.gauss(0, 2)
    return round(cumulative, 1), round(cumulative - 0.5, 1), round(cumulative + 0.5, 1)


def generate_salt_level(hour_index: int, total_hours: int) -> tuple[float, float, float]:
    """Water softener salt: starts at 100%, drops ~1%/day, refilled every 30 days."""
    cycle_hours = 30 * 24
    pos_in_cycle = hour_index % cycle_hours
    # Linear decrease from 100% to ~30%
    base = 100.0 - (70.0 * pos_in_cycle / cycle_hours)
    noise = random.gauss(0, 1.0)
    mean = max(10.0, min(100.0, base + noise))
    mn = mean - abs(random.gauss(0, 0.8))
    mx = mean + abs(random.gauss(0, 0.8))
    return round(mean, 2), round(max(0, mn), 2), round(min(100, mx), 2)


def generate_washing_cycles(hour_index: int, total_hours: int) -> tuple[float, float, float]:
    """Washing machine cycles: starts at 290, increases ~0.6/day."""
    base = 290.0
    # ~0.6 cycles per day, mostly during daytime
    hour_of_day = hour_index % 24
    day = hour_index // 24
    cumulative = base + day * 0.6
    # Add occasional cycle during daytime
    if 8 <= hour_of_day <= 20 and random.random() < 0.025:  # ~0.6/day
        cumulative += 1
    return round(cumulative, 1), round(cumulative, 1), round(cumulative, 1)


def generate_pool_pressure(hour_index: int, total_hours: int) -> tuple[float, float, float]:
    """Pool filter pressure: 0.7-0.9 normal, rises to 1.3-1.5 over 14 days, then cleaned."""
    cycle_hours = 14 * 24  # 14-day cleaning cycle
    pos_in_cycle = hour_index % cycle_hours
    # Gradual pressure increase from 0.7 to 1.4
    base = 0.7 + (0.7 * pos_in_cycle / cycle_hours)
    # Daily temperature variation (slight)
    hour_of_day = hour_index % 24
    temp_effect = 0.03 * math.sin(2 * math.pi * hour_of_day / 24)
    noise = random.gauss(0, 0.03)
    mean = max(0.3, base + temp_effect + noise)
    mn = mean - abs(random.gauss(0, 0.02))
    mx = mean + abs(random.gauss(0, 0.02))
    return round(mean, 3), round(max(0.1, mn), 3), round(mx, 3)


def generate_test_pressure(hour_index: int, total_hours: int) -> tuple[float, float, float]:
    """Test pressure sensor: random 0.8-1.2 with occasional spikes to 1.5."""
    base = random.uniform(0.85, 1.15)
    # Occasional spike (5% chance)
    if random.random() < 0.05:
        base = random.uniform(1.3, 1.6)
    noise = random.gauss(0, 0.05)
    mean = max(0.3, base + noise)
    mn = mean - abs(random.gauss(0, 0.03))
    mx = mean + abs(random.gauss(0, 0.03))
    return round(mean, 3), round(max(0.1, mn), 3), round(mx, 3)


GENERATORS = {
    "hvac_airflow": generate_hvac_airflow,
    "car_odometer": generate_car_odometer,
    "salt_level": generate_salt_level,
    "washing_cycles": generate_washing_cycles,
    "pool_pressure": generate_pool_pressure,
    "test_pressure": generate_test_pressure,
}


def ensure_metadata(cursor: sqlite3.Cursor, entity: dict) -> int:
    """Create or get statistics_meta entry, return metadata_id."""
    cursor.execute(
        "SELECT id FROM statistics_meta WHERE statistic_id = ?",
        (entity["statistic_id"],),
    )
    row = cursor.fetchone()
    if row:
        meta_id = row[0]
        # Update existing
        cursor.execute(
            """UPDATE statistics_meta SET
                source=?, unit_of_measurement=?, has_mean=?, has_sum=?,
                mean_type=?, unit_class=?
            WHERE id=?""",
            (
                "recorder",
                entity["unit_of_measurement"],
                entity["has_mean"],
                entity["has_sum"],
                entity["mean_type"],
                entity["unit_class"],
                meta_id,
            ),
        )
        return meta_id
    else:
        cursor.execute(
            """INSERT INTO statistics_meta
                (statistic_id, source, unit_of_measurement, has_mean, has_sum, name, mean_type, unit_class)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                entity["statistic_id"],
                "recorder",
                entity["unit_of_measurement"],
                entity["has_mean"],
                entity["has_sum"],
                None,
                entity["mean_type"],
                entity["unit_class"],
            ),
        )
        return cursor.lastrowid


def inject_statistics(conn: sqlite3.Connection, entity: dict, metadata_id: int) -> int:
    """Generate and insert hourly statistics. Returns count of inserted rows."""
    generator = GENERATORS[entity["generator"]]
    total_hours = DAYS * 24
    now_ts = time.time()
    count = 0

    # Delete existing statistics for this entity
    conn.execute("DELETE FROM statistics WHERE metadata_id = ?", (metadata_id,))

    is_counter = entity["has_sum"] and not entity["has_mean"]

    # Track cumulative sum for counter entities
    cumulative_sum = 0.0
    prev_state = None

    for h in range(total_hours):
        hour_dt = START + timedelta(hours=h)
        # Align to hour boundary
        start_ts = hour_dt.replace(minute=0, second=0, microsecond=0).timestamp()
        created_ts = now_ts

        mean_val, min_val, max_val = generator(h, total_hours)

        if is_counter:
            state_val = mean_val  # cumulative value
            if prev_state is not None:
                delta = max(0, state_val - prev_state)
                cumulative_sum += delta
            prev_state = state_val
            conn.execute(
                """INSERT OR REPLACE INTO statistics
                    (created_ts, metadata_id, start_ts, mean, mean_weight, min, max, state, sum, last_reset_ts)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (created_ts, metadata_id, start_ts, None, None, None, None, state_val, cumulative_sum, None),
            )
        else:
            conn.execute(
                """INSERT OR REPLACE INTO statistics
                    (created_ts, metadata_id, start_ts, mean, mean_weight, min, max, state, sum, last_reset_ts)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (created_ts, metadata_id, start_ts, mean_val, 1.0, min_val, max_val, None, None, None),
            )
        count += 1

    return count


def inject_short_term(conn: sqlite3.Connection, entity: dict, metadata_id: int) -> int:
    """Generate 5-minute short-term statistics for recent days."""
    generator = GENERATORS[entity["generator"]]
    total_hours = DAYS * 24
    now_ts = time.time()
    count = 0

    conn.execute("DELETE FROM statistics_short_term WHERE metadata_id = ?", (metadata_id,))

    is_counter = entity["has_sum"] and not entity["has_mean"]
    intervals_per_hour = 12  # 5-min intervals
    start_hour_index = (DAYS - SHORT_TERM_DAYS) * 24

    cumulative_sum = 0.0
    prev_state = None

    for h in range(start_hour_index, total_hours):
        for interval in range(intervals_per_hour):
            dt = START + timedelta(hours=h, minutes=interval * 5)
            start_ts = dt.replace(second=0, microsecond=0).timestamp()

            mean_val, min_val, max_val = generator(h, total_hours)
            # Add sub-hour variation
            sub_noise = random.gauss(0, 0.5)
            mean_val += sub_noise
            min_val = min(min_val, mean_val)
            max_val = max(max_val, mean_val)

            if is_counter:
                state_val = mean_val
                if prev_state is not None:
                    delta = max(0, state_val - prev_state)
                    cumulative_sum += delta
                prev_state = state_val
                conn.execute(
                    """INSERT OR REPLACE INTO statistics_short_term
                        (created_ts, metadata_id, start_ts, mean, mean_weight, min, max, state, sum, last_reset_ts)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                    (now_ts, metadata_id, start_ts, None, None, None, None, state_val, cumulative_sum, None),
                )
            else:
                conn.execute(
                    """INSERT OR REPLACE INTO statistics_short_term
                        (created_ts, metadata_id, start_ts, mean, mean_weight, min, max, state, sum, last_reset_ts)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                    (now_ts, metadata_id, start_ts, round(mean_val, 3), 1.0, round(min_val, 3), round(max_val, 3), None, None, None),
                )
            count += 1

    return count


def main():
    if not DB_PATH.exists():
        print(f"ERROR: Database not found at {DB_PATH}")
        print("Make sure the ha-dev container is STOPPED and the DB path is correct.")
        return

    print(f"Opening database: {DB_PATH}")
    conn = sqlite3.connect(str(DB_PATH))

    try:
        for entity in ENTITIES:
            sid = entity["statistic_id"]
            print(f"\n--- {sid} ---")

            metadata_id = ensure_metadata(conn.cursor(), entity)
            print(f"  metadata_id: {metadata_id}")

            count = inject_statistics(conn, entity, metadata_id)
            print(f"  statistics: {count} hourly rows ({DAYS} days)")

            st_count = inject_short_term(conn, entity, metadata_id)
            print(f"  statistics_short_term: {st_count} rows ({SHORT_TERM_DAYS} days)")

        conn.commit()
        print("\n=== Done! All statistics injected successfully. ===")
        print(f"Total entities: {len(ENTITIES)}")

        # Verify
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM statistics")
        print(f"Total statistics rows: {cursor.fetchone()[0]}")
        cursor.execute("SELECT COUNT(*) FROM statistics_short_term")
        print(f"Total short-term rows: {cursor.fetchone()[0]}")
        cursor.execute("SELECT COUNT(*) FROM statistics_meta")
        print(f"Total meta entries: {cursor.fetchone()[0]}")

    finally:
        conn.close()


if __name__ == "__main__":
    main()
