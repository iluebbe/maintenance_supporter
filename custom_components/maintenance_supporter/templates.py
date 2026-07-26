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
        "name_pl": "Pojazd",
        "name_cs": "Vozidlo",
        "name_sv": "Fordon",
        "name_da": "Køretøj",
        "name_nb": "Kjøretøy",
        "name_fi": "Ajoneuvo",
        "name_ja": "乗り物",
        "name_hi": "वाहन",
        "name_pt-br": "Veículos",
        "name_hu": "Járművek",
        "name_ko": "차량",
        "name_tr": "Araç",
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
        "name_pt": "Casa & AVAC",
        "name_pl": "Dom i instalacje",
        "name_cs": "Dům a technika",
        "name_sv": "Hem & VVS",
        "name_da": "Hjem & VVS",
        "name_nb": "Hjem & VVS",
        "name_fi": "Koti ja LVI",
        "name_ja": "住宅設備",
        "name_hi": "घर और HVAC",
        "name_pt-br": "Casa e HVAC",
        "name_hu": "Otthon és HVAC",
        "name_ko": "주택 및 HVAC",
        "name_tr": "Ev ve HVAC",
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
        "name_pt-br": "Lar e rotinas",
        "name_hu": "Háztartás és rutinok",
        "name_ko": "가사 및 루틴",
        "name_tr": "Ev İşleri ve Rutinler",
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
        "name_pt-br": "Jardim e área externa",
        "name_hu": "Kert és szabadtér",
        "name_ko": "정원 및 야외",
        "name_tr": "Bahçe ve Dış Mekân",
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
        "name_pl": "Basen",
        "name_cs": "Bazén",
        "name_sv": "Pool",
        "name_da": "Pool",
        "name_nb": "Basseng",
        "name_fi": "Uima-allas",
        "name_ja": "プール",
        "name_hi": "पूल",
        "name_pt-br": "Piscina",
        "name_hu": "Medence",
        "name_ko": "수영장",
        "name_tr": "Havuz",
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
        "name_pl": "Sprzęt AGD",
        "name_cs": "Spotřebiče",
        "name_sv": "Vitvaror",
        "name_da": "Hvidevarer",
        "name_nb": "Hvitevarer",
        "name_fi": "Kodinkoneet",
        "name_ja": "家電",
        "name_hi": "उपकरण",
        "name_pt-br": "Eletrodomésticos",
        "name_hu": "Háztartási gépek",
        "name_ko": "가전제품",
        "name_tr": "Ev Aletleri",
    },
    "pets": {
        "icon": "mdi:paw",
        "name_en": "Pets",
        "name_de": "Haustiere",
        "name_nl": "Huisdieren",
        "name_fr": "Animaux",
        "name_it": "Animali",
        "name_es": "Mascotas",
        "name_ru": "Питомцы",
        "name_uk": "Улюбленці",
        "name_pt": "Animais",
        "name_zh": "宠物",
        "name_pl": "Zwierzęta",
        "name_cs": "Mazlíčci",
        "name_sv": "Husdjur",
        "name_da": "Kæledyr",
        "name_nb": "Kjæledyr",
        "name_fi": "Lemmikit",
        "name_ja": "ペット",
        "name_hi": "पालतू जानवर",
        "name_pt-br": "Pets",
        "name_hu": "Háziállatok",
        "name_ko": "반려동물",
        "name_tr": "Evcil Hayvanlar",
    },
    "tech": {
        "icon": "mdi:server",
        "name_en": "Tech & IT",
        "name_de": "Technik & IT",
        "name_nl": "Techniek & IT",
        "name_fr": "Technique & IT",
        "name_it": "Tecnologia & IT",
        "name_es": "Tecnología e IT",
        "name_ru": "Техника и ИТ",
        "name_uk": "Техніка та ІТ",
        "name_pt": "Tecnologia e TI",
        "name_zh": "科技与IT",
        "name_pl": "Technika i IT",
        "name_cs": "Technika a IT",
        "name_sv": "Teknik & IT",
        "name_da": "Teknik & IT",
        "name_nb": "Teknikk & IT",
        "name_fi": "Tekniikka ja IT",
        "name_ja": "テクノロジー・IT",
        "name_hi": "टेक और IT",
        "name_pt-br": "Tecnologia e TI",
        "name_hu": "Technika és IT",
        "name_ko": "기술 및 IT",
        "name_tr": "Teknoloji ve BT",
    },
    "health": {
        "icon": "mdi:heart-pulse",
        "name_en": "Health",
        "name_de": "Gesundheit",
        "name_nl": "Gezondheid",
        "name_fr": "Santé",
        "name_it": "Salute",
        "name_es": "Salud",
        "name_ru": "Здоровье",
        "name_uk": "Здоров'я",
        "name_pt": "Saúde",
        "name_zh": "健康",
        "name_pl": "Zdrowie",
        "name_cs": "Zdraví",
        "name_sv": "Hälsa",
        "name_da": "Sundhed",
        "name_nb": "Helse",
        "name_fi": "Terveys",
        "name_ja": "健康",
        "name_hi": "स्वास्थ्य",
        "name_pt-br": "Saúde",
        "name_hu": "Egészség",
        "name_ko": "건강",
        "name_tr": "Sağlık",
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
    ObjectTemplate(
        id="pets_litter_box",
        name="Cat Litter Box",
        category="pets",
        tasks=[
            TaskTemplate("Scoop Litter", "cleaning", "time_based", 2, 1),
            TaskTemplate("Change Litter", "replacement", "time_based", 14, 3),
            TaskTemplate(
                "Wash Litter Box",
                "cleaning",
                "time_based",
                30,
                7,
                "Mild soap and hot water — strong chemicals can drive cats away from the box.",
            ),
        ],
    ),
    ObjectTemplate(
        id="tech_printer",
        name="Printer",
        category="tech",
        tasks=[
            TaskTemplate(
                "Nozzle Check",
                "inspection",
                "time_based",
                30,
                7,
                "A monthly test print keeps inkjet nozzles from drying out — supported printers also report ink/toner levels for automatic triggers.",
            ),
            TaskTemplate("Replace Maintenance Box", "replacement", "time_based", 365, 30),
            TaskTemplate("Clean Printer", "cleaning", "time_based", 180, 14),
        ],
    ),
    ObjectTemplate(
        id="tech_smart_lock",
        name="Smart Lock",
        category="tech",
        tasks=[
            TaskTemplate("Charge Battery", "service", "time_based", 60, 7),
            TaskTemplate(
                "Lubricate Cylinder",
                "service",
                "time_based",
                180,
                14,
                "Graphite or PTFE lock lubricant only — oil gums up the pins.",
            ),
            TaskTemplate("Recalibrate Lock", "service", "time_based", 180, 14),
        ],
    ),
    ObjectTemplate(
        id="tech_wallbox",
        name="EV Wallbox",
        category="tech",
        tasks=[
            TaskTemplate(
                "Test RCD",
                "inspection",
                "time_based",
                183,
                14,
                "Press the test button twice a year — a residual-current device only protects if it still trips.",
            ),
            TaskTemplate("Inspect Cable and Plug", "inspection", "time_based", 90, 7),
            TaskTemplate("Clean Housing", "cleaning", "time_based", 365, 30),
        ],
    ),
    ObjectTemplate(
        id="tech_nas",
        name="Home Server / NAS",
        category="tech",
        tasks=[
            TaskTemplate(
                "Test Backup Restore",
                "inspection",
                "time_based",
                90,
                14,
                "A backup only exists once a restore has been proven to work.",
            ),
            TaskTemplate("Check Disk Health", "inspection", "time_based", 30, 7),
            TaskTemplate("Storage Cleanup", "cleaning", "time_based", 90, 14),
            TaskTemplate("Update Firmware", "service", "time_based", 60, 7),
            TaskTemplate("Dust Out Device", "cleaning", "time_based", 365, 30),
        ],
    ),
    ObjectTemplate(
        id="tech_camera",
        name="Security Camera",
        category="tech",
        tasks=[
            TaskTemplate("Clean Lens", "cleaning", "time_based", 90, 14),
            TaskTemplate("Check Mounting", "inspection", "time_based", 183, 14),
            TaskTemplate("Update Firmware", "service", "time_based", 90, 14),
        ],
    ),
    ObjectTemplate(
        id="household_fitness",
        name="Fitness Equipment",
        category="household",
        tasks=[
            TaskTemplate("Wipe Down Equipment", "cleaning", "time_based", 7, 2),
            TaskTemplate("Check Bolts and Fasteners", "inspection", "time_based", 90, 14),
            TaskTemplate(
                "Lubricate Moving Parts",
                "service",
                "time_based",
                90,
                14,
                "Treadmill belts, trainer chains and pivots — follow the manufacturer's lubricant spec.",
            ),
        ],
    ),
    ObjectTemplate(
        id="garden_pond",
        name="Garden Pond",
        category="garden",
        tasks=[
            TaskTemplate("Clean Pond Filter", "cleaning", "time_based", 30, 7),
            TaskTemplate("Water Test", "inspection", "time_based", 30, 7),
            TaskTemplate(
                "Install Leaf Net",
                "service",
                "time_based",
                365,
                21,
                "Before autumn leaf fall — decomposing leaves feed algae and sludge.",
            ),
            TaskTemplate("Winterize System", "service", "time_based", 365, 21),
        ],
    ),
    ObjectTemplate(
        id="appliance_3d_printer",
        name="3D Printer",
        category="appliance",
        tasks=[
            TaskTemplate(
                "Clean Print Bed",
                "cleaning",
                "time_based",
                14,
                3,
                "Grease and dust ruin first-layer adhesion — clean with isopropyl alcohol, not household cleaners.",
            ),
            TaskTemplate("Clean or Replace Nozzle", "service", "time_based", 90, 14),
            TaskTemplate(
                "Lubricate Rails and Rods",
                "service",
                "time_based",
                180,
                21,
                "Follow the manufacturer's lubricant spec — the wrong grease attracts dust and wears the bearings faster.",
            ),
            TaskTemplate("Check Belt Tension", "inspection", "time_based", 180, 21),
            TaskTemplate(
                "Dry Filament Stock",
                "service",
                "time_based",
                90,
                14,
                "Moist filament pops and strings — hygroscopic materials (PETG, PA, TPU) need drying well before PLA does.",
            ),
        ],
    ),
    # --- Health ---
    # Roadmap 3a (the resmed_myair lesson): CPAP machines have real,
    # manufacturer-specified upkeep but their integrations expose only
    # therapy metrics — no wear sensors. Because a CPAP runs every night,
    # calendar intervals track usage almost perfectly, so a static template
    # IS the right trigger here. Intervals follow ResMed's replacement
    # guidance; they suit other brands (Löwenstein, Philips) too.
    ObjectTemplate(
        id="health_cpap",
        name="CPAP Machine",
        category="health",
        tasks=[
            TaskTemplate(
                "Clean Mask & Humidifier Tub",
                "cleaning",
                "time_based",
                7,
                2,
                "Wash the mask cushion and humidifier tub in warm soapy water; air-dry away from direct sunlight.",
            ),
            TaskTemplate("Replace Mask Cushion", "replacement", "time_based", 30, 7),
            TaskTemplate(
                "Air Filter",
                "replacement",
                "time_based",
                30,
                7,
                "Replace sooner if it looks discolored or dusty.",
            ),
            TaskTemplate("Replace Tubing", "replacement", "time_based", 90, 14),
            TaskTemplate("Replace Humidifier Tub", "replacement", "time_based", 180, 21),
            TaskTemplate("Replace Headgear & Frame", "replacement", "time_based", 180, 21),
            TaskTemplate("Annual Service", "inspection", "time_based", 365, 30),
        ],
    ),
    ObjectTemplate(
        id="health_hearing_aids",
        name="Hearing Aids",
        category="health",
        tasks=[
            TaskTemplate(
                "Deep Clean & Dry",
                "cleaning",
                "time_based",
                7,
                2,
                "Brush off earwax and use a drying capsule or electronic dryer overnight.",
            ),
            TaskTemplate("Replace Wax Guards", "replacement", "time_based", 30, 7),
            TaskTemplate("Replace Domes", "replacement", "time_based", 90, 14),
            TaskTemplate("Professional Check & Adjustment", "inspection", "time_based", 365, 30),
        ],
    ),
    # --- Template-worthiness lens (roadmap 3b): device classes with real,
    # manufacturer/guideline-specified maintenance and NO smart signals at
    # all — the class the signature sweeps can never surface. ---
    ObjectTemplate(
        id="home_fire_safety",
        name="Fire Safety Equipment",
        category="home",
        tasks=[
            TaskTemplate(
                "Inspect Fire Extinguisher",
                "inspection",
                "time_based",
                180,
                14,
                "Check the pressure gauge, seal and pin; make sure it is accessible and undamaged.",
            ),
            TaskTemplate(
                "Fire Extinguisher Service",
                "service",
                "time_based",
                730,
                60,
                "Professional inspection per the label — commonly every 2 years; replace the unit after 10-15 years.",
            ),
            TaskTemplate(
                "Check First-Aid Kit",
                "inspection",
                "time_based",
                180,
                14,
                "Replace expired sterile items and restock anything used.",
            ),
        ],
    ),
    ObjectTemplate(
        id="pets_aquarium",
        name="Aquarium",
        category="pets",
        tasks=[
            TaskTemplate(
                "Partial Water Change",
                "cleaning",
                "time_based",
                14,
                3,
                "Change 20-30 % of the water; match temperature and treat tap water with conditioner.",
            ),
            TaskTemplate("Test Water Values", "inspection", "time_based", 14, 3),
            TaskTemplate(
                "Clean Filter Media",
                "cleaning",
                "time_based",
                30,
                7,
                "Rinse media in removed tank water - never under the tap, that kills the bacteria culture.",
            ),
            TaskTemplate("Replace Activated Carbon", "replacement", "time_based", 30, 7),
            TaskTemplate("Clean Glass & Decor", "cleaning", "time_based", 30, 7),
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
