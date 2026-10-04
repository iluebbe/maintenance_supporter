"""Signatures shared verbatim by several integrations (DRY audit 2026-09-26 B).

148 of the catalog's 388 signatures were character-for-character copies in 32
groups ("Lubricate Cylinder" on every lock integration, the odometer duties
of every car integration, the vacuum runtime duties of every robot without
a consumable sensor). Each shared duty is defined ONCE here and referenced
by the category modules, so an editorial change (an interval, a state) is
made in one place. A signature that differs in any field stays inline in
its module. Verification still happens per integration: the ``source`` of
each IntegrationSignature records where its entity keys were checked.
"""

from __future__ import annotations

from ._model import ConsumableSignature

# 3 integrations (cars.py).
ANNUAL_SERVICE_DISTANCE_TO_SERVICE = ConsumableSignature(
    ("distance_to_service",),
    "Annual Service",
    "value_below",
    delta_units=1000,
)

# 6 integrations (cars.py).
ANNUAL_SERVICE_MILEAGE = ConsumableSignature(
    ("mileage",),
    "Annual Service",
    "usage_delta",
    delta_units=15000,
)

# 11 integrations (cars.py).
ANNUAL_SERVICE_ODOMETER = ConsumableSignature(
    ("odometer",),
    "Annual Service",
    "usage_delta",
    delta_units=15000,
)

# 3 integrations (cars.py).
ANNUAL_SERVICE_TESLA_ODOMETER = ConsumableSignature(
    ("vehicle_state_odometer",),
    "Annual Service",
    "usage_delta",
    delta_units=15000,
)

# 2 integrations (cars.py).
BIKE_CHAIN_ODOMETER = ConsumableSignature(
    ("odometer",),
    "Lubricate Chain",
    "usage_delta",
    delta_units=250,
)

# 2 integrations (cars.py).
BIKE_CHAIN_TOTAL_DISTANCE = ConsumableSignature(
    ("total_distance",),
    "Lubricate Chain",
    "usage_delta",
    delta_units=250,
)

# 3 integrations (cars.py).
BIKE_SERVICE_TOTAL_DISTANCE = ConsumableSignature(
    ("total_distance",),
    "Bike Service",
    "usage_delta",
    delta_units=2000,
)

# 2 integrations (wallboxes.py).
CHARGER_CABLE_ETO = ConsumableSignature(
    ("eto",),
    "Inspect Cable and Plug",
    "usage_delta",
    delta_units=5000,
)

# 2 integrations (wallboxes.py).
CHARGER_CABLE_LIFETIME_ENERGY = ConsumableSignature(
    ("lifetime_energy",),
    "Inspect Cable and Plug",
    "usage_delta",
    delta_units=5000,
)

# 3 integrations (wallboxes.py).
CHARGER_CABLE_TOTAL_ENERGY = ConsumableSignature(
    ("total_energy",),
    "Inspect Cable and Plug",
    "usage_delta",
    delta_units=5000,
)

# 7 integrations (air.py, vacuums.py).
FILTER_LIFE_PERCENT = ConsumableSignature(
    ("filter_life",),
    "Replace Filter",
    "percent_left",
)

# 3 integrations (heating.py).
HEATING_SYSTEM_PRESSURE_LOW = ConsumableSignature(
    ("system_pressure",),
    "Refill Heating Water",
    "value_below",
    delta_units=1,
)

# 4 integrations (heating.py).
HEATING_WATER_PRESSURE_LOW = ConsumableSignature(
    ("water_pressure",),
    "Refill Heating Water",
    "value_below",
    delta_units=1,
)

# 2 integrations (garden.py).
LANDROID_UNDERCARRIAGE_RUNTIME = ConsumableSignature(
    ("mower_runtime_total",),
    "Clean Undercarriage",
    "usage_delta",
    delta_units=25,
)

# 21 integrations (locks.py, transports.py).
LOCK_CYLINDER_CYCLES = ConsumableSignature(
    (),
    "Lubricate Cylinder",
    "cycle_count",
    delta_units=2000,
    entity_domain="lock",
    on_states=("locked",),
)

# 3 integrations (garden.py, transports.py).
MOWER_BLADES_RUNTIME = ConsumableSignature(
    (),
    "Replace Blades",
    "runtime_hours",
    delta_units=100,
    entity_domain="lawn_mower",
    on_states=("mowing",),
)

# 3 integrations (garden.py, transports.py).
MOWER_UNDERCARRIAGE_RUNTIME = ConsumableSignature(
    (),
    "Clean Undercarriage",
    "runtime_hours",
    delta_units=25,
    entity_domain="lawn_mower",
    on_states=("mowing",),
)

# 2 integrations (home_it.py).
NAS_VOLUME_USAGE_HIGH = ConsumableSignature(
    ("volume_percentage_used",),
    "Storage Cleanup",
    "alert_above",
    delta_units=85,
)

# 2 integrations (garden.py).
POOL_SALT_LOW = ConsumableSignature(
    ("salt",),
    "Refill Pool Salt",
    "value_below",
    delta_units=2700,
)

# 2 integrations (air.py, kitchen.py).
PRE_FILTER_CLEANING_PERCENT = ConsumableSignature(
    ("pre_filter",),
    "Filter Cleaning",
    "percent_left",
)

# 3 integrations (heating.py).
SOFTENER_SALT_LEVEL = ConsumableSignature(
    ("salt_level",),
    "Refill Softener Salt",
    "percent_left",
)

# 10 integrations (cars.py).
TIRE_ROTATION_MILEAGE = ConsumableSignature(
    ("mileage",),
    "Tire Rotation",
    "usage_delta",
    delta_units=10000,
)

# 15 integrations (cars.py).
TIRE_ROTATION_ODOMETER = ConsumableSignature(
    ("odometer",),
    "Tire Rotation",
    "usage_delta",
    delta_units=10000,
)

# 3 integrations (cars.py).
TIRE_ROTATION_TESLA_ODOMETER = ConsumableSignature(
    ("vehicle_state_odometer",),
    "Tire Rotation",
    "usage_delta",
    delta_units=10000,
)

# 3 integrations (home_it.py).
UNRAID_ARRAY_USAGE_HIGH = ConsumableSignature(
    ("array_usage",),
    "Storage Cleanup",
    "alert_above",
    delta_units=85,
)

# 12 integrations (transports.py, vacuums.py).
VACUUM_FILTER_CLEANING_RUNTIME = ConsumableSignature(
    (),
    "Filter Cleaning",
    "runtime_hours",
    delta_units=15,
    entity_domain="vacuum",
    on_states=("cleaning",),
)

# 12 integrations (transports.py, vacuums.py).
VACUUM_MAIN_BRUSH_RUNTIME = ConsumableSignature(
    (),
    "Clean Main Brush",
    "runtime_hours",
    delta_units=30,
    entity_domain="vacuum",
    on_states=("cleaning",),
)

# 2 integrations (air.py).
VENTILATION_FILTER_OPERATING_TIME = ConsumableSignature(
    ("air_filter_operating_time",),
    "Replace Ventilation Filter",
    "usage_above",
    above_hours=4380,
)

# 2 integrations (air.py).
VENTILATION_FILTER_REMAIN = ConsumableSignature(
    ("filter_remain",),
    "Replace Ventilation Filter",
    "duration_left",
    below_hours=168,
    resets=(("filter_remain", "filter_reset"),),
)
