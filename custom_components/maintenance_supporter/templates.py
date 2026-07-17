"""Predefined maintenance templates for the Maintenance Supporter integration."""

from __future__ import annotations

from dataclasses import dataclass, field

from .const import DEFAULT_WARNING_DAYS


@dataclass
class TaskTemplate:
    """A template for a maintenance task."""

    name: str
    type: str  # MaintenanceTypeEnum value
    schedule_type: str  # ScheduleType value
    interval_days: int | None = None
    warning_days: int = DEFAULT_WARNING_DAYS
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
        "name_ru": "Транспорт",
        "name_uk": "Транспорт",
        "name_pt": "Veículo",
        "name_zh": "机动车",
    },
    "home": {
        "icon": "mdi:home",
        "name_en": "Home & HVAC",
        "name_de": "Haustechnik",
        "name_nl": "Woning & HVAC",
        "name_fr": "Maison & CVC",
        "name_it": "Casa & HVAC",
        "name_es": "Hogar & HVAC",
        "name_ru": "Дом и климат",
        "name_uk": "Житло та кліматичні системи",
        "name_zh": "家",
    },
    # v2.27: two extra top-level groups keep the growing catalog scannable —
    # recurring HOUSEHOLD routines split from device-centric "home", and
    # GARDEN/outdoor split from "pool". Dict order = display order everywhere
    # (both pickers and the settings gallery group by these).
    "household": {
        "icon": "mdi:broom",
        "name_en": "Household & Routines",
        "name_de": "Haushalt & Routinen",
        "name_nl": "Huishouden & routines",
        "name_fr": "Ménage & routines",
        "name_it": "Casa & routine",
        "name_es": "Hogar & rutinas",
        "name_ru": "Быт и рутины",
        "name_uk": "Побут і рутини",
        "name_pt": "Casa & rotinas",
        "name_pl": "Gospodarstwo i rutyny",
        "name_cs": "Domácnost a rutiny",
        "name_sv": "Hushåll & rutiner",
        "name_da": "Husholdning & rutiner",
        "name_nb": "Husholdning & rutiner",
        "name_fi": "Kotityöt ja rutiinit",
        "name_ja": "家事・ルーティン",
        "name_hi": "गृहकार्य और दिनचर्या",
        "name_zh": "家务与日常",
    },
    "garden": {
        "icon": "mdi:tree",
        "name_en": "Garden & Outdoor",
        "name_de": "Garten & Außenbereich",
        "name_nl": "Tuin & buiten",
        "name_fr": "Jardin & extérieur",
        "name_it": "Giardino & esterni",
        "name_es": "Jardín & exterior",
        "name_ru": "Сад и участок",
        "name_uk": "Сад і подвір'я",
        "name_pt": "Jardim & exterior",
        "name_pl": "Ogród i otoczenie",
        "name_cs": "Zahrada a exteriér",
        "name_sv": "Trädgård & utomhus",
        "name_da": "Have & udendørs",
        "name_nb": "Hage & utendørs",
        "name_fi": "Piha ja ulkotilat",
        "name_ja": "庭・屋外",
        "name_hi": "बगीचा और बाहरी क्षेत्र",
        "name_zh": "花园与户外",
    },
    "pool": {
        "icon": "mdi:pool",
        "name_en": "Pool",
        "name_de": "Pool",
        "name_nl": "Zwembad",
        "name_fr": "Piscine",
        "name_it": "Piscina",
        "name_es": "Piscina",
        "name_ru": "Бассейн",
        "name_uk": "Басейн",
        "name_pt": "Piscina",
        "name_zh": "泳池",
    },
    "appliance": {
        "icon": "mdi:washing-machine",
        "name_en": "Appliances",
        "name_de": "Haushaltsgeräte",
        "name_nl": "Huishoudapparaten",
        "name_fr": "Appareils ménagers",
        "name_it": "Elettrodomestici",
        "name_es": "Electrodomésticos",
        "name_ru": "Бытовая техника",
        "name_uk": "Побутова техніка",
        "name_pt": "Eletrodomésticos",
        "name_zh": "家用电器",
    },
}


TEMPLATES: list[ObjectTemplate] = [
    # --- Vehicle ---
    ObjectTemplate(
        id="vehicle_car",
        name="Car",
        category="vehicle",
        tasks=[
            TaskTemplate("Oil Change", "service", "time_based", 365, 30, "Change engine oil and filter."),
            TaskTemplate("Tire Rotation", "service", "time_based", 180, 14),
            TaskTemplate("Brake Inspection", "inspection", "time_based", 365, 30),
            TaskTemplate("Air Filter", "replacement", "time_based", 730, 60),
            TaskTemplate("Wiper Blades", "replacement", "time_based", 365, 30),
        ],
    ),
    ObjectTemplate(
        id="vehicle_ev",
        name="Electric Car",
        category="vehicle",
        tasks=[
            TaskTemplate("Tire Rotation", "service", "time_based", 180, 14),
            TaskTemplate("Cabin Air Filter", "replacement", "time_based", 365, 30),
            TaskTemplate(
                "Brake Service",
                "service",
                "time_based",
                365,
                30,
                "Regenerative braking leaves the discs underused — have them cleaned and exercised.",
            ),
            TaskTemplate("Brake Fluid", "replacement", "time_based", 730, 60),
            TaskTemplate("12V Battery Check", "inspection", "time_based", 365, 30),
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
    ObjectTemplate(
        id="vehicle_ebike",
        name="E-Bike",
        category="vehicle",
        tasks=[
            TaskTemplate(
                "Battery Care Check",
                "inspection",
                "time_based",
                30,
                7,
                "Store the battery at 30–80% charge and away from frost — long-term storage full or empty ages the cells.",
            ),
            TaskTemplate("Chain Lubrication", "service", "time_based", 30, 7),
            TaskTemplate("Tire Pressure Check", "inspection", "time_based", 14, 3),
            TaskTemplate("Brake Adjustment", "inspection", "time_based", 90, 14),
            TaskTemplate("Annual Service", "service", "time_based", 365, 30),
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
    # v2.27 wishlist wave (Discussion #85): RO filter, houseplants, bathroom
    # fan, kitchen knives — the freeze-sensitive garden/appliance ones live in
    # their categories below.
    ObjectTemplate(
        id="home_ro_filter",
        name="Drinking Water Filter",
        category="home",
        tasks=[
            TaskTemplate("Sediment Pre-Filter", "replacement", "time_based", 180, 14),
            TaskTemplate("Carbon Pre-Filter", "replacement", "time_based", 270, 21),
            TaskTemplate("RO Membrane", "replacement", "time_based", 730, 30),
            TaskTemplate("Post-Carbon Filter", "replacement", "time_based", 365, 30),
            TaskTemplate("Sanitize Filter Housings", "cleaning", "time_based", 365, 14),
        ],
    ),
    ObjectTemplate(
        id="home_houseplants",
        name="Houseplants",
        category="household",
        tasks=[
            TaskTemplate("Watering", "service", "time_based", 7, 1),
            TaskTemplate("Fertilizing", "service", "time_based", 30, 7),
            TaskTemplate("Repotting Check", "inspection", "time_based", 365, 30),
        ],
    ),
    ObjectTemplate(
        id="home_bathroom_fan",
        name="Bathroom Exhaust Fan",
        category="home",
        tasks=[
            TaskTemplate("Clean Fan and Grille", "cleaning", "time_based", 180, 14),
        ],
    ),
    ObjectTemplate(
        id="home_smoke_detectors",
        name="Smoke & CO Detectors",
        category="home",
        tasks=[
            TaskTemplate("Test Detectors", "inspection", "time_based", 30, 7),
            TaskTemplate("Replace Detector Batteries", "replacement", "time_based", 365, 30),
            TaskTemplate(
                "Replace Detectors",
                "replacement",
                "time_based",
                3650,
                90,
                "Smoke detectors expire — most sensors are rated for 10 years from the date printed on the unit.",
            ),
        ],
    ),
    # --- Household & Routines (v2.27) ---
    ObjectTemplate(
        id="household_bathroom",
        name="Bathroom",
        category="household",
        tasks=[
            TaskTemplate("Clean Bathroom", "cleaning", "time_based", 7, 1),
            TaskTemplate("Change Towels", "cleaning", "time_based", 7, 1),
            TaskTemplate("Refill Soap Dispensers", "service", "time_based", 30, 7),
            TaskTemplate("Wash Bath Mats", "cleaning", "time_based", 30, 7),
            TaskTemplate("Check Silicone Seals", "inspection", "time_based", 365, 30),
        ],
    ),
    ObjectTemplate(
        id="household_bedroom",
        name="Bedroom",
        category="household",
        tasks=[
            TaskTemplate("Change Bed Linen", "cleaning", "time_based", 14, 3),
            TaskTemplate("Rotate Mattress", "service", "time_based", 90, 14),
            TaskTemplate("Wash Pillows and Duvets", "cleaning", "time_based", 180, 14),
        ],
    ),
    ObjectTemplate(
        id="household_kitchen",
        name="Kitchen",
        category="household",
        tasks=[
            TaskTemplate("Clean Refrigerator", "cleaning", "time_based", 90, 14),
            TaskTemplate("Defrost Freezer", "cleaning", "time_based", 180, 21),
            TaskTemplate("Range Hood Filter", "cleaning", "time_based", 90, 14),
            TaskTemplate("Oven Cleaning", "cleaning", "time_based", 90, 14),
        ],
    ),
    ObjectTemplate(
        id="home_knives",
        name="Kitchen Knives",
        category="household",
        tasks=[
            TaskTemplate("Knife Sharpening", "service", "time_based", 75, 7),
            TaskTemplate("Honing", "service", "time_based", 14, 3),
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
        category="garden",
        tasks=[
            TaskTemplate("Blade Sharpening", "service", "time_based", 90, 14),
            TaskTemplate("Oil Change", "service", "time_based", 365, 30),
            TaskTemplate("Air Filter", "replacement", "time_based", 365, 30),
            TaskTemplate("Spark Plug", "replacement", "time_based", 365, 30),
        ],
    ),
    ObjectTemplate(
        id="garden_irrigation",
        name="Lawn Irrigation System",
        category="garden",
        tasks=[
            TaskTemplate(
                "Winterize System",
                "service",
                "time_based",
                365,
                21,
                "Blow out and drain before the first frost. Tip: a sensor-based threshold trigger (below 3 °C on an outdoor temperature entity) makes this reminder frost-aware.",
            ),
            TaskTemplate("Spring Startup and Leak Check", "inspection", "time_based", 365, 21),
            TaskTemplate("Sprinkler Head Inspection", "inspection", "time_based", 180, 14),
        ],
    ),
    ObjectTemplate(
        id="garden_pressure_washer",
        name="Pressure Washer",
        category="garden",
        tasks=[
            TaskTemplate(
                "Winter Storage",
                "service",
                "time_based",
                365,
                21,
                "Move to a frost-free spot before the first frost — trapped water cracks the pump. Tip: a sensor-based threshold trigger (below 3 °C) makes this reminder frost-aware.",
            ),
            TaskTemplate("Nozzle and Filter Cleaning", "cleaning", "time_based", 180, 14),
            TaskTemplate("Pump Oil Check", "inspection", "time_based", 365, 30),
        ],
    ),
    ObjectTemplate(
        id="garden_robot_mower",
        name="Robot Lawn Mower",
        category="garden",
        tasks=[
            TaskTemplate(
                "Replace Blades",
                "replacement",
                "time_based",
                60,
                7,
                "Dull pivoting blades tear the grass instead of cutting it — supported integrations expose blade-usage sensors that can trigger this instead of the calendar.",
            ),
            TaskTemplate("Clean Undercarriage", "cleaning", "time_based", 30, 7),
            TaskTemplate("Clean Charging Contacts", "cleaning", "time_based", 90, 14),
            TaskTemplate(
                "Winter Storage",
                "service",
                "time_based",
                365,
                21,
                "Store indoors over winter with the battery at partial charge — frost and a fully drained battery both age the cells.",
            ),
        ],
    ),
    ObjectTemplate(
        id="garden_lawn",
        name="Lawn Care",
        category="garden",
        tasks=[
            TaskTemplate(
                "Mowing",
                "service",
                "time_based",
                10,
                2,
                "During the growing season — add a seasonal window (task dialog, e.g. Apr–Oct) or pause the object over winter.",
            ),
            TaskTemplate(
                "Watering",
                "service",
                "time_based",
                7,
                1,
                "In dry periods — a soil-moisture or rain sensor makes a good sensor trigger instead of the fixed interval.",
            ),
            TaskTemplate("Fertilising", "service", "time_based", 120, 14),
            TaskTemplate("Scarifying", "service", "time_based", 365, 30),
            TaskTemplate("Aerating", "service", "time_based", 365, 30),
            TaskTemplate("Overseeding", "service", "time_based", 365, 30),
            TaskTemplate("Weeding", "service", "time_based", 90, 14),
        ],
    ),
    ObjectTemplate(
        id="garden_hedge",
        name="Hedge Care",
        category="garden",
        tasks=[
            TaskTemplate(
                "Trimming",
                "service",
                "time_based",
                180,
                21,
                "1–3 times per year depending on the species — mind local rules protecting nesting birds in spring.",
            ),
            TaskTemplate("Watering", "service", "time_based", 7, 1),
            TaskTemplate("Fertilising", "service", "time_based", 365, 30),
            TaskTemplate("Mulching", "service", "time_based", 365, 30),
        ],
    ),
    ObjectTemplate(
        id="garden_house_exterior",
        name="House Exterior",
        category="garden",
        tasks=[
            TaskTemplate("Clean Gutters", "cleaning", "time_based", 180, 21),
            TaskTemplate("Roof Inspection", "inspection", "time_based", 365, 30),
            TaskTemplate("Clean Windows", "cleaning", "time_based", 90, 14),
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
    ObjectTemplate(
        id="appliance_espresso",
        name="Espresso Machine",
        category="appliance",
        tasks=[
            TaskTemplate(
                "Descaling",
                "cleaning",
                "time_based",
                90,
                14,
                "Interval depends on water hardness — descale more often with hard water.",
            ),
            TaskTemplate("Backflush Brew Group", "cleaning", "time_based", 14, 3),
            TaskTemplate("Water Filter", "replacement", "time_based", 60, 7),
            TaskTemplate("Group Gasket", "replacement", "time_based", 365, 30),
        ],
    ),
    ObjectTemplate(
        id="appliance_robot_vacuum",
        name="Robot Vacuum",
        category="appliance",
        tasks=[
            TaskTemplate("Clean Main Brush", "cleaning", "time_based", 14, 3),
            TaskTemplate("Filter Cleaning", "cleaning", "time_based", 14, 3),
            TaskTemplate(
                "Replace Dust Bag",
                "replacement",
                "time_based",
                90,
                14,
                "Many docks don't warn when the bag is full — a schedule beats a surprise.",
            ),
            TaskTemplate("Clean Sensors", "cleaning", "time_based", 30, 7),
        ],
    ),
    ObjectTemplate(
        id="appliance_robot_mop",
        name="Mopping Robot Vacuum",
        category="appliance",
        tasks=[
            TaskTemplate("Filter Cleaning", "cleaning", "time_based", 14, 3),
            TaskTemplate("Empty Dirty Water Tank", "cleaning", "time_based", 7, 2),
            TaskTemplate("Clean Mop Tray", "cleaning", "time_based", 30, 7),
            TaskTemplate("Wash Mop Pads", "cleaning", "time_based", 60, 7),
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


# Re-export: template/task names + notes are localized through one flat table
# (templates_i18n) keyed by the English source string.

# Re-export (the `as` alias marks it as intentional for linters): template/task
# names + notes are localized through one flat table keyed by the English
# source string.
from .templates_i18n import localize_template_text as localize_template_text

KNOWN_TEMPLATE_IDS: frozenset[str] = frozenset(t.id for t in TEMPLATES)


def get_disabled_template_ids(hass) -> set[str]:  # type: ignore[no-untyped-def]
    """Ids the admin hid from the template pickers (v2.21).

    Read from the global entry's options; unknown ids are ignored so a stale
    list (e.g. after a template rename) can't hide anything by accident.
    """
    from .const import CONF_DISABLED_TEMPLATE_IDS, DOMAIN, GLOBAL_UNIQUE_ID

    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.unique_id == GLOBAL_UNIQUE_ID:
            raw = (entry.options or entry.data).get(CONF_DISABLED_TEMPLATE_IDS) or []
            return {t for t in raw if isinstance(t, str) and t in KNOWN_TEMPLATE_IDS}
    return set()
