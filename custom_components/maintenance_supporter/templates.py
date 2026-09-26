"""Predefined maintenance templates for the Maintenance Supporter integration.

Seasons are written for the NORTHERN hemisphere; :func:`build_template_task`
turns them round south of the equator and drops seasonal windows where there
is no cold season (see ``helpers/climate.py``). The applicability fields of
:class:`ObjectTemplate` only feed the gallery's recommendations — every
template stays available everywhere.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Protocol

from .const import DEFAULT_WARNING_DAYS

HOUSE = "house"
APARTMENT = "apartment"
ANY_DWELLING: frozenset[str] = frozenset({HOUSE, APARTMENT})
HOUSE_ONLY: frozenset[str] = frozenset({HOUSE})


@dataclass
class TaskTemplate:
    """A template for a maintenance task."""

    name: str
    type: str  # MaintenanceTypeEnum value
    schedule_type: str  # ScheduleType value
    interval_days: int | None = None
    warning_days: int = DEFAULT_WARNING_DAYS
    notes: str | None = None
    # Northern-hemisphere months the interval runs in (e.g. mowing Apr–Oct);
    # dropped where there is no winter, mirrored south of the equator.
    season_months: tuple[int, ...] = ()
    # A fixed calendar instead of the interval — a nested ``schedule`` dict
    # (day_of_month / nth_weekday) whose ``months`` are northern-hemisphere
    # months, e.g. winterize the irrigation every 15 October. The interval
    # above stays the cycle length shown in the gallery.
    schedule: dict[str, Any] | None = None
    # Extra note for homes in one country (ISO code → English note), appended
    # to ``notes`` at creation — the French boiler duty only for France.
    country_notes: dict[str, str] | None = None


@dataclass
class ObjectTemplate:
    """A template for a maintenance object with pre-configured tasks."""

    id: str
    name: str
    category: str
    tasks: list[TaskTemplate] = field(default_factory=list)
    # Recommendation metadata (helpers/home_profile.py). ``dwellings``: where
    # the object usually exists; ``starter``: part of the basic set for these
    # dwellings; ``traits``: recommended when the climate/region has any of
    # them; ``countries``: recommended in these ISO countries (only for things
    # nearly every home there has); ``requires``: home features that must have
    # been detected (garage, basement, garden) — they are a reason themselves;
    # ``only_countries``: never recommended outside these countries.
    dwellings: frozenset[str] = ANY_DWELLING
    starter: frozenset[str] = frozenset()
    traits: frozenset[str] = frozenset()
    countries: frozenset[str] = frozenset()
    requires: frozenset[str] = frozenset()
    only_countries: frozenset[str] = frozenset()


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
    "building": {
        "icon": "mdi:shield-home",
        "name_en": "Building & Safety",
        "name_de": "Gebäude & Schutz",
        "name_nl": "Gebouw & veiligheid",
        "name_fr": "Bâtiment & sécurité",
        "name_it": "Edificio & sicurezza",
        "name_es": "Edificio y seguridad",
        "name_ru": "Здание и безопасность",
        "name_uk": "Будівля та безпека",
        "name_zh": "建筑与安全",
        "name_pt": "Edifício e segurança",
        "name_pl": "Budynek i bezpieczeństwo",
        "name_cs": "Budova a bezpečnost",
        "name_sv": "Byggnad & säkerhet",
        "name_da": "Bygning & sikkerhed",
        "name_nb": "Bygning & sikkerhet",
        "name_fi": "Rakennus ja turvallisuus",
        "name_ja": "建物・安全",
        "name_hi": "भवन और सुरक्षा",
        "name_pt-br": "Construção e segurança",
        "name_hu": "Épület és biztonság",
        "name_ko": "건물 및 안전",
        "name_tr": "Bina ve Güvenlik",
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
        countries=frozenset({"US", "CA"}),
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
        countries=frozenset({"US", "CA", "AU", "NZ", "IN", "ZA"}),
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
        traits=frozenset({"freeze"}),
        tasks=[
            TaskTemplate("Annual Inspection", "inspection", "time_based", 365, 30, schedule={"kind": "day_of_month", "day": 1, "months": [9]}, country_notes={"FR": "France: annual boiler maintenance is mandatory for 4–400 kW; keep the certificate for at least two years.", "GB": "UK: have it serviced by a Gas Safe registered engineer.", "IT": "Italy: flue-gas check every 4 years for gas boilers up to 100 kW, every 2 years for oil, wood or pellet boilers."}),
            TaskTemplate("Bleed Radiators", "service", "time_based", 365, 14, schedule={"kind": "day_of_month", "day": 1, "months": [10]}),
            TaskTemplate("Filter Replacement", "replacement", "time_based", 180, 14),
        ],
    ),
    # v2.55: heat-recovery ventilation + fireplace. Intervals: filters checked
    # quarterly / replaced <=6 months and full service every 24 months per
    # manufacturer guidance (Zehnder service plan); chimney sweep cadence is
    # regulated (DE KÜO: 1-3x/year by usage; US NFPA 211: annual inspection).
    ObjectTemplate(
        id="home_ventilation",
        name="Ventilation System",
        category="home",
        tasks=[
            TaskTemplate(
                "Replace Ventilation Filters",
                "replacement",
                "time_based",
                180,
                21,
                "Check quarterly and replace at the latest every 6 months (manufacturer guidance) — sooner during pollen season or in dusty areas.",
            ),
            TaskTemplate("Clean Air Valves", "cleaning", "time_based", 180, 14),
            TaskTemplate("Check Condensate Drain", "inspection", "time_based", 365, 21),
            TaskTemplate(
                "Clean Heat Exchanger",
                "cleaning",
                "time_based",
                730,
                30,
                "Part of the full service every 2 years — many manufacturers recommend a professional for this.",
            ),
        ],
    ),
    ObjectTemplate(
        id="home_fireplace",
        name="Fireplace & Wood Stove",
        category="home",
        dwellings=HOUSE_ONLY,
        tasks=[
            TaskTemplate(
                "Chimney Sweep Appointment",
                "service",
                "time_based",
                365,
                30,
                "Legally regulated in many countries — e.g. 1–3 sweeps per year in Germany depending on usage (KÜO), and at least an annual inspection under NFPA 211 in the US.",
                country_notes={"FR": "France: sweeping twice a year for oil, wood or coal, once for gas (règlement sanitaire départemental); keep the certificate.", "PL": "Poland: a chimney sweep's inspection at least once a year.", "SE": "Sweden: the municipality's sweep does fire-safety inspections every 3–6 years depending on the fireplace."},
            ),
            TaskTemplate("Inspect Door Gasket", "inspection", "time_based", 365, 21),
            TaskTemplate(
                "Empty Ash Pan",
                "cleaning",
                "time_based",
                7,
                1,
                "During the heating season — preset to October–April (mirrored in the southern hemisphere); adjust it in the task dialog.",
                season_months=(10, 11, 12, 1, 2, 3, 4),
            ),
            TaskTemplate(
                "Clean Stove Glass",
                "cleaning",
                "time_based",
                30,
                7,
                "During the heating season — soot builds up faster when burning at low temperatures or with damp wood.",
                season_months=(10, 11, 12, 1, 2, 3, 4),
            ),
        ],
    ),
    # v2.27 wishlist wave (Discussion #85): RO filter, houseplants, bathroom
    # fan, kitchen knives — the freeze-sensitive garden/appliance ones live in
    # their categories below.
    ObjectTemplate(
        id="home_ro_filter",
        name="Drinking Water Filter",
        category="home",
        countries=frozenset({"CN", "TW", "IN"}),
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
        starter=frozenset({APARTMENT}),
        tasks=[
            TaskTemplate("Clean Fan and Grille", "cleaning", "time_based", 180, 14),
        ],
    ),
    ObjectTemplate(
        id="home_smoke_detectors",
        name="Smoke & CO Detectors",
        category="building",
        starter=ANY_DWELLING,
        tasks=[
            TaskTemplate("Test Detectors", "inspection", "time_based", 30, 7, country_notes={"DE": "Germany: the state building codes call for a yearly check following DIN 14676."}),
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
        starter=ANY_DWELLING,
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
        dwellings=HOUSE_ONLY,
        tasks=[
            TaskTemplate("Filter Cleaning", "cleaning", "time_based", 14, 3, season_months=(5, 6, 7, 8, 9)),
            TaskTemplate("Basket Cleaning", "cleaning", "time_based", 7, 2, season_months=(5, 6, 7, 8, 9)),
            TaskTemplate("Seal Inspection", "inspection", "time_based", 180, 14),
            TaskTemplate("Annual Service", "service", "time_based", 365, 30, schedule={"kind": "day_of_month", "day": 1, "months": [4]}),
        ],
    ),
    ObjectTemplate(
        id="pool_water",
        name="Pool Water Treatment",
        category="pool",
        dwellings=HOUSE_ONLY,
        tasks=[
            TaskTemplate("Water Test", "inspection", "time_based", 7, 2, season_months=(5, 6, 7, 8, 9)),
            TaskTemplate("Shock Treatment", "cleaning", "time_based", 14, 3, season_months=(5, 6, 7, 8, 9)),
            TaskTemplate("Filter Backwash", "cleaning", "time_based", 7, 2, season_months=(5, 6, 7, 8, 9)),
        ],
    ),
    ObjectTemplate(
        id="garden_lawn_mower",
        name="Lawn Mower",
        category="garden",
        dwellings=HOUSE_ONLY,
        tasks=[
            TaskTemplate("Blade Sharpening", "service", "time_based", 90, 14, season_months=(3, 4, 5, 6, 7, 8, 9, 10)),
            TaskTemplate("Oil Change", "service", "time_based", 365, 30, schedule={"kind": "day_of_month", "day": 15, "months": [3]}),
            TaskTemplate("Air Filter", "replacement", "time_based", 365, 30, schedule={"kind": "day_of_month", "day": 15, "months": [3]}),
            TaskTemplate("Spark Plug", "replacement", "time_based", 365, 30, schedule={"kind": "day_of_month", "day": 15, "months": [3]}),
        ],
    ),
    ObjectTemplate(
        id="garden_irrigation",
        name="Lawn Irrigation System",
        category="garden",
        dwellings=HOUSE_ONLY,
        tasks=[
            TaskTemplate(
                "Winterize System",
                "service",
                "time_based",
                365,
                21,
                "Blow out and drain before the first frost. Tip: a sensor-based threshold trigger (below 3 °C on an outdoor temperature entity) makes this reminder frost-aware.",
                schedule={"kind": "day_of_month", "day": 15, "months": [10]},
            ),
            TaskTemplate("Spring Startup and Leak Check", "inspection", "time_based", 365, 21, schedule={"kind": "day_of_month", "day": 15, "months": [4]}),
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
                schedule={"kind": "day_of_month", "day": 1, "months": [11]},
            ),
            TaskTemplate("Nozzle and Filter Cleaning", "cleaning", "time_based", 180, 14),
            TaskTemplate("Pump Oil Check", "inspection", "time_based", 365, 30),
        ],
    ),
    ObjectTemplate(
        id="garden_robot_mower",
        name="Robot Lawn Mower",
        category="garden",
        dwellings=HOUSE_ONLY,
        tasks=[
            TaskTemplate(
                "Replace Blades",
                "replacement",
                "time_based",
                60,
                7,
                "Dull pivoting blades tear the grass instead of cutting it — supported integrations expose blade-usage sensors that can trigger this instead of the calendar.",
                season_months=(4, 5, 6, 7, 8, 9, 10),
            ),
            TaskTemplate("Clean Undercarriage", "cleaning", "time_based", 30, 7, season_months=(4, 5, 6, 7, 8, 9, 10)),
            TaskTemplate("Clean Charging Contacts", "cleaning", "time_based", 90, 14),
            TaskTemplate(
                "Winter Storage",
                "service",
                "time_based",
                365,
                21,
                "Store indoors over winter with the battery at partial charge — frost and a fully drained battery both age the cells.",
                schedule={"kind": "day_of_month", "day": 1, "months": [11]},
            ),
        ],
    ),
    ObjectTemplate(
        id="garden_lawn",
        name="Lawn Care",
        category="garden",
        dwellings=HOUSE_ONLY,
        requires=frozenset({"garden"}),
        tasks=[
            TaskTemplate(
                "Mowing",
                "service",
                "time_based",
                10,
                2,
                "During the growing season — preset to April–October (mirrored in the southern hemisphere, all year where there is no winter); adjust it in the task dialog.",
                season_months=(4, 5, 6, 7, 8, 9, 10),
            ),
            TaskTemplate(
                "Watering",
                "service",
                "time_based",
                7,
                1,
                "In dry periods — a soil-moisture or rain sensor makes a good sensor trigger instead of the fixed interval.",
                season_months=(5, 6, 7, 8, 9),
            ),
            TaskTemplate("Fertilising", "service", "time_based", 120, 14, season_months=(3, 4, 5, 6, 7, 8, 9, 10)),
            TaskTemplate("Scarifying", "service", "time_based", 365, 30, schedule={"kind": "day_of_month", "day": 15, "months": [4]}),
            TaskTemplate("Aerating", "service", "time_based", 365, 30, schedule={"kind": "day_of_month", "day": 15, "months": [9]}),
            TaskTemplate("Overseeding", "service", "time_based", 365, 30, schedule={"kind": "day_of_month", "day": 15, "months": [9]}),
            TaskTemplate("Weeding", "service", "time_based", 90, 14, season_months=(4, 5, 6, 7, 8, 9)),
        ],
    ),
    ObjectTemplate(
        id="garden_hedge",
        name="Hedge Care",
        category="garden",
        dwellings=HOUSE_ONLY,
        tasks=[
            TaskTemplate(
                "Trimming",
                "service",
                "time_based",
                180,
                21,
                "1–3 times per year depending on the species — mind local rules protecting nesting birds in spring.",
                schedule={"kind": "day_of_month", "day": 15, "months": [6, 9]},
            ),
            TaskTemplate("Watering", "service", "time_based", 7, 1, season_months=(5, 6, 7, 8, 9)),
            TaskTemplate("Fertilising", "service", "time_based", 365, 30, schedule={"kind": "day_of_month", "day": 1, "months": [4]}),
            TaskTemplate("Mulching", "service", "time_based", 365, 30),
        ],
    ),
    ObjectTemplate(
        id="garden_house_exterior",
        name="House Exterior",
        category="garden",
        dwellings=HOUSE_ONLY,
        starter=frozenset({HOUSE}),
        tasks=[
            TaskTemplate("Clean Gutters", "cleaning", "time_based", 180, 21, schedule={"kind": "day_of_month", "day": 1, "months": [4, 11]}),
            TaskTemplate("Roof Inspection", "inspection", "time_based", 365, 30, schedule={"kind": "day_of_month", "day": 1, "months": [4]}),
            TaskTemplate("Clean Windows", "cleaning", "time_based", 90, 14),
        ],
    ),
    # --- Appliances ---
    ObjectTemplate(
        id="appliance_washing_machine",
        name="Washing Machine",
        category="appliance",
        starter=ANY_DWELLING,
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
        starter=ANY_DWELLING,
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
        countries=frozenset({"US", "CA"}),
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
        dwellings=HOUSE_ONLY,
        tasks=[
            TaskTemplate("Clean Pond Filter", "cleaning", "time_based", 30, 7, season_months=(4, 5, 6, 7, 8, 9, 10)),
            TaskTemplate("Water Test", "inspection", "time_based", 30, 7, season_months=(4, 5, 6, 7, 8, 9, 10)),
            TaskTemplate(
                "Install Leaf Net",
                "service",
                "time_based",
                365,
                21,
                "Before autumn leaf fall — decomposing leaves feed algae and sludge.",
                schedule={"kind": "day_of_month", "day": 1, "months": [10]},
            ),
            TaskTemplate("Winterize System", "service", "time_based", 365, 21, schedule={"kind": "day_of_month", "day": 1, "months": [11]}),
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
        category="building",
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
    # --- v2.93 home profile wave 1 (DACH + North America) ---
    # Months are northern-hemisphere; build_template_task mirrors them south
    # of the equator and drops seasonal windows where there is no winter.
    ObjectTemplate(
        id="home_heat_pump",
        name="Heat Pump",
        category="home",
        dwellings=HOUSE_ONLY,
        tasks=[
            TaskTemplate(
                "Clear Outdoor Unit",
                "inspection",
                "time_based",
                14,
                3,
                "Leaves, snow and plants must not block the outdoor unit — the air has to flow freely.",
                season_months=(10, 11, 12, 1, 2, 3),
            ),
            TaskTemplate("Annual Service", "service", "time_based", 365, 30, schedule={"kind": "day_of_month", "day": 1, "months": [9]}, country_notes={"FR": "France: heat pumps of 4–70 kW must be serviced every 2 years; above 2 kg of refrigerant a yearly leak check applies."}),
            TaskTemplate(
                "Refrigerant Leak Check",
                "inspection",
                "time_based",
                365,
                30,
                "EU F-gas rules: units above a certain refrigerant charge need a leak check by certified staff every 12 or 24 months — see the unit's documentation.",
            ),
            TaskTemplate("Check Heating Water Pressure", "inspection", "time_based", 90, 7),
        ],
    ),
    ObjectTemplate(
        id="home_solar_pv",
        name="Solar PV System",
        category="home",
        dwellings=HOUSE_ONLY,
        tasks=[
            TaskTemplate("Check Yield and Inverter Errors", "inspection", "time_based", 30, 7),
            TaskTemplate("Visual Inspection", "inspection", "time_based", 365, 30, schedule={"kind": "day_of_month", "day": 1, "months": [4]}),
            TaskTemplate(
                "Clean Panels",
                "cleaning",
                "time_based",
                365,
                30,
                "Only when the yield drops — rain usually does the job; dusty or desert sites need it 2–4 times a year.",
            ),
            TaskTemplate(
                "Electrical Safety Inspection",
                "inspection",
                "time_based",
                1461,
                60,
                "An electrician's inspection every 4 years is common practice (DIN VDE 0105-100 in Germany) and often asked for by insurers.",
            ),
        ],
    ),
    ObjectTemplate(
        id="home_garage_door",
        name="Garage Door",
        category="building",
        dwellings=HOUSE_ONLY,
        requires=frozenset({"garage"}),
        tasks=[
            TaskTemplate(
                "Test Auto-Reverse and Photo Eye",
                "inspection",
                "time_based",
                30,
                7,
                "Close the door on a piece of wood: it must reverse on contact. The door industry (DASMA) recommends testing monthly.",
            ),
            TaskTemplate(
                "Lubricate Hinges, Rollers and Springs",
                "service",
                "time_based",
                365,
                30,
                "Silicone spray or white lithium grease; leave a belt drive dry.",
            ),
            TaskTemplate("Professional Service", "service", "time_based", 365, 30),
        ],
    ),
    ObjectTemplate(
        id="home_standby_generator",
        name="Standby Generator",
        category="home",
        dwellings=HOUSE_ONLY,
        traits=frozenset({"cyclone"}),
        tasks=[
            TaskTemplate(
                "Check Weekly Exercise Run",
                "inspection",
                "time_based",
                7,
                1,
                "Most standby units run a short self-test every week — check that it actually ran.",
            ),
            TaskTemplate("Annual Service", "service", "time_based", 365, 30),
            TaskTemplate("Check Starter Battery", "inspection", "time_based", 180, 14),
        ],
    ),
    ObjectTemplate(
        id="pool_hot_tub",
        name="Hot Tub",
        category="pool",
        dwellings=HOUSE_ONLY,
        tasks=[
            TaskTemplate("Water Test", "inspection", "time_based", 7, 2),
            TaskTemplate("Rinse Filter", "cleaning", "time_based", 7, 2),
            TaskTemplate("Deep Clean Filter", "cleaning", "time_based", 30, 7),
            TaskTemplate("Drain and Refill", "service", "time_based", 90, 14, "Every 3–4 months, sooner with heavy use."),
            TaskTemplate("Clean Cover", "cleaning", "time_based", 30, 7),
        ],
    ),
    ObjectTemplate(
        id="home_backflow_lifting",
        name="Backflow Valve & Lifting Station",
        category="building",
        dwellings=HOUSE_ONLY,
        requires=frozenset({"basement"}),
        only_countries=frozenset({"DE", "AT", "CH"}),
        tasks=[
            TaskTemplate(
                "Check Backflow Valve",
                "inspection",
                "time_based",
                30,
                7,
                "DIN 1986-3: look at the valve once a month and operate the emergency closure.",
            ),
            TaskTemplate(
                "Backflow Valve Service",
                "service",
                "time_based",
                182,
                21,
                "DIN 1986-3: service by a qualified person twice a year.",
            ),
            TaskTemplate(
                "Lifting Station Service",
                "service",
                "time_based",
                365,
                30,
                "DIN EN 12056-4: by a qualified person every 12 months in a single-family home, every 6 months in a multi-family building.",
            ),
        ],
    ),
    ObjectTemplate(
        id="home_septic_tank",
        name="Septic System",
        category="building",
        dwellings=HOUSE_ONLY,
        tasks=[
            TaskTemplate(
                "Septic Inspection",
                "inspection",
                "time_based",
                1095,
                60,
                "Every 1–3 years; systems with pumps or float switches every year (US EPA).",
                country_notes={"FR": "France: the SPANC inspects non-collective sanitation at least every 10 years (often every 4–8)."},
            ),
            TaskTemplate("Pump Out Tank", "service", "time_based", 1095, 60, "Typically every 3–5 years, depending on tank size and household."),
            TaskTemplate("Check Drain Field", "inspection", "time_based", 365, 30),
        ],
    ),
    ObjectTemplate(
        id="home_treatment_plant",
        name="Small Sewage Treatment Plant",
        category="building",
        dwellings=HOUSE_ONLY,
        tasks=[
            TaskTemplate(
                "Operator Check",
                "inspection",
                "time_based",
                30,
                7,
                "The visual checks the plant's approval asks of the owner — note them in the operator log.",
            ),
            TaskTemplate(
                "Maintenance by a Specialist Company",
                "service",
                "time_based",
                182,
                21,
                "Germany: technical plants twice a year (three times for classes +P/+H), nature-based plants once a year.",
                country_notes={"FR": "France: the SPANC inspects non-collective sanitation at least every 10 years (often every 4–8)."},
            ),
        ],
    ),
    ObjectTemplate(
        id="home_radon",
        name="Radon Protection",
        category="building",
        dwellings=HOUSE_ONLY,
        traits=frozenset({"radon"}),
        tasks=[
            TaskTemplate(
                "Radon Test",
                "reading",
                "time_based",
                730,
                30,
                "The US EPA recommends retesting every two years and after renovations; with a mitigation system, test every year.",
            ),
            TaskTemplate("Check Mitigation Fan and Manometer", "inspection", "time_based", 90, 7),
        ],
    ),
    ObjectTemplate(
        id="home_sump_pump",
        name="Sump Pump",
        category="building",
        dwellings=HOUSE_ONLY,
        requires=frozenset({"basement"}),
        only_countries=frozenset({"US", "CA"}),
        tasks=[
            TaskTemplate(
                "Test Sump Pump",
                "inspection",
                "time_based",
                90,
                7,
                "Pour water into the pit until the float lifts — the pump must start and drain it.",
            ),
            TaskTemplate("Clean Pit and Inlet Screen", "cleaning", "time_based", 365, 30),
            TaskTemplate("Test Backup Battery", "inspection", "time_based", 180, 14),
            TaskTemplate(
                "Check Discharge Line Before Winter",
                "inspection",
                "time_based",
                365,
                21,
                schedule={"kind": "day_of_month", "day": 1, "months": [11]},
            ),
        ],
    ),
    ObjectTemplate(
        id="home_frost_protection",
        name="Frost Protection",
        category="building",
        dwellings=HOUSE_ONLY,
        traits=frozenset({"freeze"}),
        tasks=[
            TaskTemplate(
                "Shut Off and Drain Outdoor Faucets",
                "service",
                "time_based",
                365,
                21,
                schedule={"kind": "day_of_month", "day": 15, "months": [10]},
            ),
            TaskTemplate(
                "Reopen Outdoor Faucets",
                "service",
                "time_based",
                365,
                14,
                "After the last frost — check for split pipes when the water is back on.",
                schedule={"kind": "day_of_month", "day": 15, "months": [4]},
            ),
            TaskTemplate(
                "Check Pipe Insulation and Heat Tape",
                "inspection",
                "time_based",
                365,
                21,
                schedule={"kind": "day_of_month", "day": 1, "months": [11]},
            ),
            TaskTemplate("Empty Rain Barrels", "service", "time_based", 365, 21, schedule={"kind": "day_of_month", "day": 1, "months": [11]}),
        ],
    ),
    ObjectTemplate(
        id="garden_snow_blower",
        name="Snow Blower",
        category="garden",
        dwellings=HOUSE_ONLY,
        traits=frozenset({"snow"}),
        only_countries=frozenset({"US", "CA", "SE", "NO", "FI", "RU"}),
        tasks=[
            TaskTemplate(
                "Pre-Season Service",
                "service",
                "time_based",
                365,
                30,
                "Change the oil and check spark plug, shear pins and belts before the first snow.",
                schedule={"kind": "day_of_month", "day": 15, "months": [10]},
            ),
            TaskTemplate(
                "Summer Storage",
                "service",
                "time_based",
                365,
                21,
                "Run the tank dry or add fuel stabilizer before storing.",
                schedule={"kind": "day_of_month", "day": 15, "months": [4]},
            ),
        ],
    ),
    ObjectTemplate(
        id="home_windows_doors",
        name="Windows & Doors",
        category="building",
        starter=ANY_DWELLING,
        tasks=[
            TaskTemplate("Lubricate Hinges and Fittings", "service", "time_based", 365, 30),
            TaskTemplate(
                "Check Seals and Weatherstripping",
                "inspection",
                "time_based",
                365,
                21,
                schedule={"kind": "day_of_month", "day": 1, "months": [10]},
            ),
            TaskTemplate(
                "Clean Window Tracks and Drain Holes",
                "cleaning",
                "time_based",
                365,
                30,
                schedule={"kind": "day_of_month", "day": 1, "months": [4]},
            ),
            TaskTemplate("Check Roller Shutters", "inspection", "time_based", 365, 30),
        ],
    ),
    ObjectTemplate(
        id="household_drains",
        name="Drains & Fixtures",
        category="household",
        starter=ANY_DWELLING,
        tasks=[
            TaskTemplate("Clean Sink and Shower Drains", "cleaning", "time_based", 60, 7),
            TaskTemplate("Descale Showerheads and Aerators", "cleaning", "time_based", 90, 14),
            TaskTemplate("Check Under-Sink Pipes for Leaks", "inspection", "time_based", 180, 14),
            TaskTemplate(
                "Check Washing Machine Hoses",
                "inspection",
                "time_based",
                365,
                30,
                "Replace them after about 5 years, or at the first bulge or crack.",
            ),
        ],
    ),
    ObjectTemplate(
        id="garden_wood_deck",
        name="Wooden Deck & Facade",
        category="garden",
        dwellings=HOUSE_ONLY,
        tasks=[
            TaskTemplate("Clean Deck", "cleaning", "time_based", 365, 30, schedule={"kind": "day_of_month", "day": 15, "months": [4]}),
            TaskTemplate("Oil or Stain Deck", "service", "time_based", 365, 30, schedule={"kind": "day_of_month", "day": 15, "months": [5]}),
            TaskTemplate(
                "Check Siding and Sealant Joints",
                "inspection",
                "time_based",
                365,
                30,
                schedule={"kind": "day_of_month", "day": 1, "months": [4]},
            ),
            TaskTemplate(
                "Repaint Wooden Facade",
                "service",
                "time_based",
                3285,
                90,
                "Opaque paint typically lasts 8–12 years (Nordic guidance); stains need it sooner.",
            ),
        ],
    ),
    ObjectTemplate(
        id="household_emergency_kit",
        name="Emergency Supplies",
        category="household",
        traits=frozenset({"cyclone", "wildfire", "earthquake"}),
        tasks=[
            TaskTemplate("Rotate Drinking Water", "replacement", "time_based", 182, 14),
            TaskTemplate("Check Food Supplies and Expiry Dates", "inspection", "time_based", 182, 14),
            TaskTemplate("Check Flashlights, Radio and Batteries", "inspection", "time_based", 182, 14),
            TaskTemplate("Review Emergency Plan and Contacts", "inspection", "time_based", 365, 30),
        ],
    ),
    ObjectTemplate(
        id="home_storm_prep",
        name="Storm & Hurricane Preparation",
        category="building",
        dwellings=HOUSE_ONLY,
        traits=frozenset({"cyclone"}),
        tasks=[
            TaskTemplate(
                "Test Storm Shutters",
                "inspection",
                "time_based",
                365,
                30,
                "Before the storm season starts — 1 June for the Atlantic, November in the southern hemisphere.",
                schedule={"kind": "day_of_month", "day": 1, "months": [5]},
            ),
            TaskTemplate(
                "Trim Trees and Secure Outdoor Items",
                "service",
                "time_based",
                365,
                30,
                schedule={"kind": "day_of_month", "day": 15, "months": [5]},
            ),
            TaskTemplate(
                "Check Roof and Gutters for Storm Season",
                "inspection",
                "time_based",
                365,
                30,
                schedule={"kind": "day_of_month", "day": 1, "months": [5]},
            ),
            TaskTemplate(
                "Test Generator Under Load",
                "inspection",
                "time_based",
                365,
                21,
                schedule={"kind": "day_of_month", "day": 15, "months": [5]},
            ),
        ],
    ),
    ObjectTemplate(
        id="home_termite",
        name="Termite & Pest Protection",
        category="building",
        dwellings=HOUSE_ONLY,
        traits=frozenset({"termites"}),
        tasks=[
            TaskTemplate(
                "Professional Termite Inspection",
                "inspection",
                "time_based",
                365,
                30,
                "Once a year by a licensed pest professional — before the spring swarming season.",
                schedule={"kind": "day_of_month", "day": 1, "months": [3]},
            ),
            TaskTemplate("Check Foundation for Mud Tubes", "inspection", "time_based", 90, 7),
            TaskTemplate("Pest Perimeter Treatment", "service", "time_based", 90, 7),
        ],
    ),
    ObjectTemplate(
        id="home_split_ac",
        name="Air Conditioner (Split)",
        category="home",
        traits=frozenset({"hot_summer", "hot_humid"}),
        tasks=[
            TaskTemplate("Clean Indoor Unit Filters", "cleaning", "time_based", 30, 7, season_months=(5, 6, 7, 8, 9)),
            TaskTemplate(
                "Flush Condensate Drain",
                "cleaning",
                "time_based",
                90,
                14,
                "Hot and humid climates: monthly, with a cup of white vinegar, so algae cannot clog the line.",
            ),
            TaskTemplate("Clean Outdoor Unit Coil", "cleaning", "time_based", 365, 30, schedule={"kind": "day_of_month", "day": 15, "months": [4]}),
            TaskTemplate("Annual Service", "service", "time_based", 365, 30, schedule={"kind": "day_of_month", "day": 1, "months": [5]}),
        ],
    ),
    ObjectTemplate(
        id="home_evaporative_cooler",
        name="Evaporative Cooler",
        category="home",
        dwellings=HOUSE_ONLY,
        traits=frozenset({"hot_dry"}),
        tasks=[
            TaskTemplate(
                "Spring Startup",
                "service",
                "time_based",
                365,
                21,
                "Clean the reservoir, test the pump and float valve, check the belt and open the winter damper.",
                schedule={"kind": "day_of_month", "day": 15, "months": [4]},
            ),
            TaskTemplate(
                "Replace Cooler Pads",
                "replacement",
                "time_based",
                365,
                21,
                "Aspen pads every season; rigid media pads last 3–5 years.",
                schedule={"kind": "day_of_month", "day": 15, "months": [4]},
            ),
            TaskTemplate("Mid-Season Check", "inspection", "time_based", 30, 7, season_months=(5, 6, 7, 8, 9)),
            TaskTemplate(
                "Fall Shutdown and Drain",
                "service",
                "time_based",
                365,
                21,
                "Drain and dry the pan, disconnect the water line and close the damper — prevents scale and frost damage.",
                schedule={"kind": "day_of_month", "day": 1, "months": [10]},
            ),
        ],
    ),
    ObjectTemplate(
        id="household_dehumidifier",
        name="Dehumidifier",
        category="household",
        traits=frozenset({"hot_humid"}),
        tasks=[
            TaskTemplate("Empty and Clean Water Tank", "cleaning", "time_based", 14, 3),
            TaskTemplate("Clean Air Filter", "cleaning", "time_based", 30, 7),
            TaskTemplate("Check Drain Hose", "inspection", "time_based", 90, 7),
        ],
    ),
    ObjectTemplate(
        id="household_humidifier",
        name="Humidifier",
        category="household",
        tasks=[
            TaskTemplate("Clean Tank", "cleaning", "time_based", 7, 1, season_months=(11, 12, 1, 2, 3)),
            TaskTemplate("Replace Wick Filter", "replacement", "time_based", 60, 7, season_months=(11, 12, 1, 2, 3)),
            TaskTemplate("Descaling", "cleaning", "time_based", 30, 7, season_months=(11, 12, 1, 2, 3)),
        ],
    ),
    ObjectTemplate(
        id="vehicle_seasonal_tires",
        name="Seasonal Tires",
        category="vehicle",
        traits=frozenset({"snow"}),
        countries=frozenset({"DE", "AT", "CH", "CZ", "SK", "SE", "NO", "FI"}),
        tasks=[
            TaskTemplate(
                "Fit Winter Tires",
                "service",
                "time_based",
                365,
                21,
                "German rule of thumb: from October to Easter — winter tires are required on wintry roads.",
                schedule={"kind": "day_of_month", "day": 15, "months": [10]},
            ),
            TaskTemplate("Fit Summer Tires", "service", "time_based", 365, 21, schedule={"kind": "day_of_month", "day": 15, "months": [4]}),
            TaskTemplate("Check Tread Depth and Tire Age", "inspection", "time_based", 182, 14),
        ],
    ),
    ObjectTemplate(
        id="home_heating_oil_tank",
        name="Heating Oil Tank",
        category="home",
        dwellings=HOUSE_ONLY,
        tasks=[
            TaskTemplate("Check Tank and Collecting Tray", "inspection", "time_based", 90, 7),
            TaskTemplate("Check Leak Detector and Level Gauge", "inspection", "time_based", 365, 30),
            TaskTemplate(
                "Expert Inspection",
                "inspection",
                "time_based",
                1826,
                60,
                "Germany (AwSV): every 5 years for underground tanks and above-ground tanks over 10,000 l — in water protection and flood areas from 1,000 l. A typical cellar tank below that is exempt.",
            ),
        ],
    ),
    ObjectTemplate(
        id="home_water_meters",
        name="Water & Heat Meters",
        category="home",
        tasks=[
            TaskTemplate("Record Meter Readings", "reading", "time_based", 365, 14),
            TaskTemplate(
                "Replace Meters When Calibration Expires",
                "replacement",
                "time_based",
                2191,
                90,
                "Calibration validity: 6 years in Germany for water and heat meters; in Russia 6 years cold, 4 years hot — check the date on the meter.",
            ),
        ],
    ),
    ObjectTemplate(
        id="home_balcony",
        name="Balcony & Terrace",
        category="building",
        tasks=[
            TaskTemplate("Clear Balcony Drain", "cleaning", "time_based", 182, 14, schedule={"kind": "day_of_month", "day": 1, "months": [4, 11]}),
            TaskTemplate("Check Railings and Sealing", "inspection", "time_based", 365, 30, schedule={"kind": "day_of_month", "day": 1, "months": [4]}),
        ],
    ),
    # --- v2.93 home profile waves 2–4 (maritime Europe, Nordics, Mediterranean,
    # Australia, South Asia, Latin America, Japan, seismic regions) ---
    ObjectTemplate(
        id="household_damp_mould",
        name="Damp & Mould Prevention",
        category="household",
        traits=frozenset({"damp", "hot_humid"}),
        tasks=[
            TaskTemplate(
                "Check for Mould and Condensation",
                "inspection",
                "time_based",
                30,
                7,
                "Look behind furniture, in window reveals and in the corners of outside walls.",
                season_months=(10, 11, 12, 1, 2, 3, 4),
            ),
            TaskTemplate("Clean Extractor Fans and Trickle Vents", "cleaning", "time_based", 180, 14),
            TaskTemplate(
                "Check Indoor Humidity",
                "reading",
                "time_based",
                30,
                7,
                "Aim for 40–60 % relative humidity; air rooms briefly and fully rather than tilting windows all day.",
            ),
        ],
    ),
    ObjectTemplate(
        id="garden_roof_moss",
        name="Roof Moss & Algae",
        category="garden",
        dwellings=HOUSE_ONLY,
        traits=frozenset({"damp"}),
        tasks=[
            TaskTemplate(
                "Remove Roof Moss",
                "service",
                "time_based",
                730,
                30,
                "Brush off or treat moss before it lifts the tiles — don't pressure-wash the roof.",
            ),
            TaskTemplate("Clean Paths and Patio", "cleaning", "time_based", 365, 30, schedule={"kind": "day_of_month", "day": 15, "months": [4]}),
        ],
    ),
    ObjectTemplate(
        id="home_sauna",
        name="Sauna",
        category="home",
        countries=frozenset({"FI"}),
        tasks=[
            TaskTemplate("Wash Benches and Floor", "cleaning", "time_based", 30, 7),
            TaskTemplate(
                "Restack Sauna Stones",
                "service",
                "time_based",
                365,
                30,
                "Once a year: restack the stones and replace any that crumble or discolour (heater manufacturers' advice).",
            ),
            TaskTemplate("Check Heater, Guard and Thermostat", "inspection", "time_based", 365, 30),
        ],
    ),
    ObjectTemplate(
        id="home_roof_snow",
        name="Snow & Ice on the Roof",
        category="building",
        dwellings=HOUSE_ONLY,
        traits=frozenset({"severe_winter"}),
        tasks=[
            TaskTemplate("Check Roof Snow Load and Ice Dams", "inspection", "time_based", 14, 3, season_months=(12, 1, 2, 3)),
            TaskTemplate(
                "Test Roof and Gutter Heating Cables",
                "inspection",
                "time_based",
                365,
                21,
                schedule={"kind": "day_of_month", "day": 1, "months": [11]},
            ),
        ],
    ),
    ObjectTemplate(
        id="home_flat_roof",
        name="Flat Roof & Roof Terrace",
        category="building",
        traits=frozenset({"mediterranean", "hot_dry"}),
        tasks=[
            TaskTemplate("Clear Roof Drains", "cleaning", "time_based", 182, 14, schedule={"kind": "day_of_month", "day": 1, "months": [4, 10]}),
            TaskTemplate(
                "Check Waterproofing Before the Rainy Season",
                "inspection",
                "time_based",
                365,
                30,
                schedule={"kind": "day_of_month", "day": 15, "months": [9]},
            ),
            TaskTemplate(
                "Recoat Waterproofing",
                "service",
                "time_based",
                1642,
                60,
                "Elastic roof coatings usually need a fresh coat every 4–5 years.",
            ),
        ],
    ),
    ObjectTemplate(
        id="garden_mosquito",
        name="Mosquito Prevention",
        category="garden",
        traits=frozenset({"hot_humid", "mediterranean"}),
        tasks=[
            TaskTemplate(
                "Empty Standing Water",
                "inspection",
                "time_based",
                7,
                1,
                "Plant saucers, buckets, gutters and rain barrels — a week is enough for larvae to hatch.",
                season_months=(5, 6, 7, 8, 9, 10),
            ),
            TaskTemplate(
                "Check Window and Door Screens",
                "inspection",
                "time_based",
                365,
                30,
                schedule={"kind": "day_of_month", "day": 1, "months": [4]},
            ),
        ],
    ),
    ObjectTemplate(
        id="home_wildfire_prep",
        name="Wildfire Preparation",
        category="building",
        dwellings=HOUSE_ONLY,
        traits=frozenset({"wildfire"}),
        tasks=[
            TaskTemplate(
                "Clear Defensible Space",
                "service",
                "time_based",
                365,
                30,
                "Cut back dry vegetation; keep the first 1.5 m (5 ft) around the house free of anything that burns (CAL FIRE Zone 0).",
                schedule={"kind": "day_of_month", "day": 1, "months": [5]},
            ),
            TaskTemplate(
                "Clear Leaves from Roof and Gutters",
                "cleaning",
                "time_based",
                182,
                14,
                schedule={"kind": "day_of_month", "day": 1, "months": [5, 9]},
            ),
            TaskTemplate(
                "Check Ember-Proof Vent Screens",
                "inspection",
                "time_based",
                365,
                30,
                "Vents covered with 3 mm (⅛ in) metal mesh keep embers out.",
            ),
        ],
    ),
    ObjectTemplate(
        id="garden_rainwater_tank",
        name="Rainwater Tank",
        category="garden",
        dwellings=HOUSE_ONLY,
        requires=frozenset({"garden"}),
        only_countries=frozenset({"AU", "NZ"}),
        tasks=[
            TaskTemplate("Clean Leaf Screens and First-Flush Diverter", "cleaning", "time_based", 90, 7),
            TaskTemplate(
                "Check Tank for Sediment",
                "inspection",
                "time_based",
                730,
                60,
                "Australian health guidance: check for sediment every 2–3 years and clean the tank once the bottom is covered.",
            ),
            TaskTemplate("Check Pump and Filter", "inspection", "time_based", 180, 14),
        ],
    ),
    ObjectTemplate(
        id="home_water_storage_tank",
        name="Water Storage Tank",
        category="home",
        countries=frozenset({"BR", "MX", "IN"}),
        tasks=[
            TaskTemplate(
                "Clean and Disinfect Tank",
                "cleaning",
                "time_based",
                182,
                14,
                "Brazil: at least every 6 months (Ministry of Health guidance).",
            ),
            TaskTemplate("Check Lid, Overflow and Float Valve", "inspection", "time_based", 90, 7),
        ],
    ),
    ObjectTemplate(
        id="tech_inverter_battery",
        name="Inverter Battery Backup",
        category="tech",
        countries=frozenset({"IN", "ZA", "PK", "BD", "NG"}),
        tasks=[
            TaskTemplate(
                "Top Up Distilled Water",
                "service",
                "time_based",
                90,
                14,
                "Every 2–4 months — distilled water only, never tap water.",
            ),
            TaskTemplate("Clean Battery Terminals", "cleaning", "time_based", 90, 14),
            TaskTemplate("Test Backup Runtime", "inspection", "time_based", 30, 7),
        ],
    ),
    ObjectTemplate(
        id="home_holiday_home",
        name="Holiday Home / Cabin",
        category="building",
        countries=frozenset({"RU", "UA", "BY", "FI", "NO", "SE"}),
        tasks=[
            TaskTemplate(
                "Close for Winter",
                "service",
                "time_based",
                365,
                21,
                "Drain pipes, pump and water heater before the frosts — best while the daily mean is still +5 to +10 °C.",
                schedule={"kind": "day_of_month", "day": 15, "months": [10]},
            ),
            TaskTemplate(
                "Open for the Season",
                "service",
                "time_based",
                365,
                14,
                "Flush the water system and check for frost and pest damage.",
                schedule={"kind": "day_of_month", "day": 15, "months": [4]},
            ),
            TaskTemplate("Check for Storm and Snow Damage", "inspection", "time_based", 30, 7, season_months=(11, 12, 1, 2, 3)),
        ],
    ),
    ObjectTemplate(
        id="household_tatami",
        name="Tatami & Futon Care",
        category="household",
        countries=frozenset({"JP"}),
        tasks=[
            TaskTemplate(
                "Air Tatami and Futons",
                "service",
                "time_based",
                182,
                14,
                "Twice a year on a dry, sunny day.",
                schedule={"kind": "day_of_month", "day": 1, "months": [5, 10]},
            ),
            TaskTemplate("Vacuum Tatami Along the Grain", "cleaning", "time_based", 7, 1),
            TaskTemplate(
                "Mould Check in the Rainy Season",
                "inspection",
                "time_based",
                14,
                3,
                "During tsuyu keep the humidity below 60 % — a dehumidifier helps in tatami rooms.",
                season_months=(6, 7),
            ),
        ],
    ),
    ObjectTemplate(
        id="home_earthquake",
        name="Earthquake Preparedness",
        category="building",
        traits=frozenset({"earthquake"}),
        tasks=[
            TaskTemplate("Check Water Heater Straps and Furniture Anchors", "inspection", "time_based", 365, 30),
            TaskTemplate(
                "Check Gas Shut-Off Tool and Location",
                "inspection",
                "time_based",
                365,
                30,
                "Know where the valve is and keep the wrench next to it; once shut off, let the gas utility turn it back on.",
            ),
        ],
    ),
    ObjectTemplate(
        id="home_private_well",
        name="Private Well",
        category="home",
        dwellings=HOUSE_ONLY,
        tasks=[
            TaskTemplate(
                "Test Well Water",
                "reading",
                "time_based",
                365,
                30,
                "US EPA: test for bacteria and nitrates every year, a full chemical panel every 3–5 years.",
            ),
            TaskTemplate("Check Pump and Pressure Tank", "inspection", "time_based", 365, 30),
            TaskTemplate("Inspect Wellhead and Cap", "inspection", "time_based", 365, 30),
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


def build_template_task(
    tt: TaskTemplate,
    lang: str,
    *,
    hemisphere: str = "north",
    has_winter: bool = True,
    country: str | None = None,
) -> dict[str, Any]:
    """The task a template task creates (without ids) — shared by the config
    flow and the panel gallery.

    Name and notes are localized; a note for the home's ``country`` is
    appended (legal duties differ per country). The recurrence is a nested ``schedule``
    when the template carries a fixed calendar or a seasonal window (months
    mirrored south of the equator; the window is dropped where there is no
    cold season, so a Miami lawn is mowed all year), else the flat interval.
    """
    from .helpers.climate import flip_months

    task: dict[str, Any] = {
        "name": localize_template_text(tt.name, lang) or tt.name,
        "type": tt.type,
        "enabled": True,
        "warning_days": tt.warning_days,
    }
    notes = [localize_template_text(n, lang) or n for n in (tt.notes, (tt.country_notes or {}).get(country or "")) if n]
    if notes:
        task["notes"] = "\n\n".join(notes)
    if tt.schedule is not None:
        schedule = dict(tt.schedule)
        if schedule.get("months"):
            schedule["months"] = list(flip_months(schedule["months"], hemisphere))
        task["schedule"] = schedule
    elif tt.season_months and has_winter and tt.interval_days:
        task["schedule"] = {
            "kind": "interval",
            "every": tt.interval_days,
            "season_months": list(flip_months(tt.season_months, hemisphere)),
        }
    else:
        task["schedule_type"] = tt.schedule_type
        if tt.interval_days is not None:
            task["interval_days"] = tt.interval_days
    return task


class HomeLike(Protocol):
    """What the recommendation needs from ``helpers.home_profile.HomeProfile``
    (read-only — the profile is a frozen dataclass)."""

    @property
    def dwelling(self) -> str: ...

    @property
    def country(self) -> str | None: ...

    @property
    def traits(self) -> frozenset[str]: ...

    @property
    def features(self) -> frozenset[str]: ...


def recommend_template(template: ObjectTemplate, profile: HomeLike | None) -> dict[str, Any]:
    """Whether the gallery recommends ``template`` for this home, and why.

    ``reasons`` are codes the panel translates: ``starter`` (part of the basic
    set for the home's dwelling type), a climate/region trait (``freeze``,
    ``termites``, ``radon`` …), ``country``, or ``feature_<x>`` (equipment
    seen in the home: a garage, a basement, a garden). Equipment templates
    wait for their feature — a garage door is suggested where a garage was
    found, not to every house in a country. A template the dwelling does not
    usually have (a pool in an apartment) is never recommended and is flagged
    ``dwelling_mismatch`` — it stays available, just further down.
    """
    none = {"recommended": False, "reasons": [], "dwelling_mismatch": False}
    if profile is None:
        return none
    known = profile.dwelling in (HOUSE, APARTMENT)
    if known and profile.dwelling not in template.dwellings:
        return {**none, "dwelling_mismatch": True}
    if template.only_countries and profile.country not in template.only_countries:
        return none
    if not template.requires <= profile.features:
        return none
    reasons: list[str] = []
    if known and profile.dwelling in template.starter:
        reasons.append("starter")
    reasons.extend(f"feature_{f}" for f in sorted(template.requires))
    reasons.extend(sorted(template.traits & profile.traits))
    if profile.country and profile.country in template.countries:
        reasons.append("country")
    return {"recommended": bool(reasons), "reasons": reasons, "dwelling_mismatch": False}


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
