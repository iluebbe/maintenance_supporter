"""Predefined maintenance templates for the Maintenance Supporter integration."""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class TaskTemplate:
    """A template for a maintenance task."""

    name: str
    type: str  # MaintenanceTypeEnum value
    schedule_type: str  # ScheduleType value
    interval_days: int | None = None
    warning_days: int = 7
    notes: str | None = None


@dataclass
class ObjectTemplate:
    """A template for a maintenance object with pre-configured tasks."""

    id: str
    name: str
    category: str
    tasks: list[TaskTemplate] = field(default_factory=list)


TEMPLATE_CATEGORIES: dict[str, dict[str, str]] = {
    "vehicle": {
        "icon": "mdi:car",
        "name_en": "Vehicle",
        "name_de": "Fahrzeug",
        "name_nl": "Voertuig",
        "name_fr": "Véhicule",
        "name_it": "Veicolo",
        "name_es": "Vehículo",
    },
    "home": {
        "icon": "mdi:home",
        "name_en": "Home & HVAC",
        "name_de": "Haustechnik",
        "name_nl": "Woning & HVAC",
        "name_fr": "Maison & CVC",
        "name_it": "Casa & HVAC",
        "name_es": "Hogar & HVAC",
    },
    "pool": {
        "icon": "mdi:pool",
        "name_en": "Pool & Garden",
        "name_de": "Pool & Garten",
        "name_nl": "Zwembad & Tuin",
        "name_fr": "Piscine & Jardin",
        "name_it": "Piscina & Giardino",
        "name_es": "Piscina & Jardín",
    },
    "appliance": {
        "icon": "mdi:washing-machine",
        "name_en": "Appliances",
        "name_de": "Haushaltsgeräte",
        "name_nl": "Huishoudapparaten",
        "name_fr": "Appareils ménagers",
        "name_it": "Elettrodomestici",
        "name_es": "Electrodomésticos",
    },
}


TEMPLATES: list[ObjectTemplate] = [
    # --- Vehicle ---
    ObjectTemplate(
        id="vehicle_car",
        name="Car",
        category="vehicle",
        tasks=[
            TaskTemplate("Oil Change", "service", "time_based", 365, 30,
                         "Change engine oil and filter."),
            TaskTemplate("Tire Rotation", "service", "time_based", 180, 14),
            TaskTemplate("Brake Inspection", "inspection", "time_based", 365, 30),
            TaskTemplate("Air Filter", "replacement", "time_based", 730, 60),
            TaskTemplate("Wiper Blades", "replacement", "time_based", 365, 30),
        ],
    ),
    ObjectTemplate(
        id="vehicle_bicycle",
        name="Bicycle",
        category="vehicle",
        tasks=[
            TaskTemplate("Chain Lubrication", "service", "time_based", 30, 7),
            TaskTemplate("Tire Pressure Check", "inspection", "time_based", 14, 3),
            TaskTemplate("Brake Adjustment", "inspection", "time_based", 90, 14),
            TaskTemplate("Annual Service", "service", "time_based", 365, 30),
        ],
    ),
    ObjectTemplate(
        id="vehicle_motorcycle",
        name="Motorcycle",
        category="vehicle",
        tasks=[
            TaskTemplate("Oil Change", "service", "time_based", 365, 30),
            TaskTemplate("Chain Maintenance", "service", "time_based", 30, 7),
            TaskTemplate("Tire Inspection", "inspection", "time_based", 90, 14),
            TaskTemplate("Brake Fluid", "replacement", "time_based", 730, 60),
        ],
    ),
    # --- Home & HVAC ---
    ObjectTemplate(
        id="home_hvac",
        name="HVAC System",
        category="home",
        tasks=[
            TaskTemplate("Filter Replacement", "replacement", "time_based", 90, 14),
            TaskTemplate("Annual Service", "service", "time_based", 365, 30),
            TaskTemplate("Duct Cleaning", "cleaning", "time_based", 1095, 60),
        ],
    ),
    ObjectTemplate(
        id="home_water_heater",
        name="Water Heater",
        category="home",
        tasks=[
            TaskTemplate("Anode Rod Inspection", "inspection", "time_based", 365, 30),
            TaskTemplate("Flush Tank", "cleaning", "time_based", 365, 30),
            TaskTemplate("Pressure Relief Valve Test", "inspection", "time_based", 365, 14),
        ],
    ),
    ObjectTemplate(
        id="home_water_softener",
        name="Water Softener",
        category="home",
        tasks=[
            TaskTemplate("Salt Refill", "service", "time_based", 30, 7),
            TaskTemplate("Resin Cleaning", "cleaning", "time_based", 180, 14),
            TaskTemplate("Annual Service", "service", "time_based", 365, 30),
        ],
    ),
    ObjectTemplate(
        id="home_heating",
        name="Heating System",
        category="home",
        tasks=[
            TaskTemplate("Annual Inspection", "inspection", "time_based", 365, 30),
            TaskTemplate("Bleed Radiators", "service", "time_based", 365, 14),
            TaskTemplate("Filter Replacement", "replacement", "time_based", 180, 14),
        ],
    ),
    # --- Pool & Garden ---
    ObjectTemplate(
        id="pool_pump",
        name="Pool Pump",
        category="pool",
        tasks=[
            TaskTemplate("Filter Cleaning", "cleaning", "time_based", 14, 3),
            TaskTemplate("Basket Cleaning", "cleaning", "time_based", 7, 2),
            TaskTemplate("Seal Inspection", "inspection", "time_based", 180, 14),
            TaskTemplate("Annual Service", "service", "time_based", 365, 30),
        ],
    ),
    ObjectTemplate(
        id="pool_water",
        name="Pool Water Treatment",
        category="pool",
        tasks=[
            TaskTemplate("Water Test", "inspection", "time_based", 7, 2),
            TaskTemplate("Shock Treatment", "cleaning", "time_based", 14, 3),
            TaskTemplate("Filter Backwash", "cleaning", "time_based", 7, 2),
        ],
    ),
    ObjectTemplate(
        id="garden_lawn_mower",
        name="Lawn Mower",
        category="pool",
        tasks=[
            TaskTemplate("Blade Sharpening", "service", "time_based", 90, 14),
            TaskTemplate("Oil Change", "service", "time_based", 365, 30),
            TaskTemplate("Air Filter", "replacement", "time_based", 365, 30),
            TaskTemplate("Spark Plug", "replacement", "time_based", 365, 30),
        ],
    ),
    # --- Appliances ---
    ObjectTemplate(
        id="appliance_washing_machine",
        name="Washing Machine",
        category="appliance",
        tasks=[
            TaskTemplate("Drum Cleaning", "cleaning", "time_based", 30, 7),
            TaskTemplate("Filter Cleaning", "cleaning", "time_based", 30, 7),
            TaskTemplate("Descaling", "cleaning", "time_based", 90, 14),
            TaskTemplate("Door Seal Inspection", "inspection", "time_based", 180, 14),
        ],
    ),
    ObjectTemplate(
        id="appliance_dishwasher",
        name="Dishwasher",
        category="appliance",
        tasks=[
            TaskTemplate("Filter Cleaning", "cleaning", "time_based", 30, 7),
            TaskTemplate("Spray Arm Cleaning", "cleaning", "time_based", 90, 14),
            TaskTemplate("Descaling", "cleaning", "time_based", 90, 14),
        ],
    ),
    ObjectTemplate(
        id="appliance_dryer",
        name="Dryer",
        category="appliance",
        tasks=[
            TaskTemplate("Lint Filter Cleaning", "cleaning", "time_based", 1, 0),
            TaskTemplate("Condenser Cleaning", "cleaning", "time_based", 30, 7),
            TaskTemplate("Vent Inspection", "inspection", "time_based", 365, 30),
        ],
    ),
]


def get_templates_by_category(category: str) -> list[ObjectTemplate]:
    """Return all templates for a given category."""
    return [t for t in TEMPLATES if t.category == category]


def get_template_by_id(template_id: str) -> ObjectTemplate | None:
    """Return a template by its ID."""
    for t in TEMPLATES:
        if t.id == template_id:
            return t
    return None
