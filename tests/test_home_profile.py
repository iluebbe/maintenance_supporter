"""Home profile (v2.93): climate from the offline grids, house vs apartment
from the registries, and what that means for the template gallery and for
the seasons of template tasks."""

from __future__ import annotations

from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import floor_registry as fr

from custom_components.maintenance_supporter.const import CONF_HOME_TYPE, CONF_TASKS
from custom_components.maintenance_supporter.helpers.climate import (
    ClimateInfo,
    describe,
    flip_months,
    load_grids,
)
from custom_components.maintenance_supporter.helpers.home_profile import (
    DWELLING_APARTMENT,
    DWELLING_HOUSE,
    DWELLING_UNKNOWN,
    HomeProfile,
    async_home_profile,
    guess_dwelling,
)
from custom_components.maintenance_supporter.templates import (
    TEMPLATES,
    TaskTemplate,
    build_template_task,
    get_template_by_id,
    recommend_template,
)
from custom_components.maintenance_supporter.websocket.io import ws_get_templates
from custom_components.maintenance_supporter.websocket.objects import ws_create_from_template

from .conftest import assert_ws_success, call_ws_handler, make_global_entry, make_ws_connection, setup_integration

GRIDS = load_grids()


# ─── climate ─────────────────────────────────────────────────────────────


@pytest.mark.parametrize(
    ("place", "lat", "lon", "koppen", "has", "has_not"),
    [
        # Cfb like London, yet outdoor taps freeze: the temperatures decide.
        ("Munich", 48.14, 11.58, "Cfb", {"freeze", "snow"}, {"hot_humid", "cyclone"}),
        ("London", 51.51, -0.13, "Cfb", {"freeze"}, {"snow", "hot_summer"}),
        ("Houston", 29.76, -95.37, "Cfa", {"hot_humid", "termites", "cyclone"}, {"snow"}),
        ("Phoenix", 33.45, -112.07, "BWh", {"hot_dry", "hot_summer"}, {"freeze", "hot_humid"}),
        ("Minneapolis", 44.98, -93.27, "Dfa", {"freeze", "snow"}, {"termites"}),
        ("Madrid", 40.42, -3.70, "BSk", {"hot_dry", "wildfire", "freeze"}, {"cyclone"}),
        ("Singapore", 1.35, 103.82, "Af", {"tropical", "hot_humid"}, {"freeze"}),
        ("Sydney", -33.87, 151.21, "Cfa", {"hot_humid"}, {"freeze", "snow"}),
    ],
)
def test_known_places_are_classified(place: str, lat: float, lon: float, koppen: str, has: set[str], has_not: set[str]) -> None:
    info = describe(lat, lon, GRIDS)
    assert info.koppen == koppen, place
    assert has <= info.traits, (place, sorted(info.traits))
    assert not (has_not & info.traits), (place, sorted(info.traits))


@pytest.mark.parametrize(
    ("lat", "lon", "trait", "present"),
    [
        (60.17, 24.94, "severe_winter", True),  # Helsinki
        (48.14, 11.58, "severe_winter", False),  # Munich
        (51.51, -0.13, "damp", True),  # London
        (41.90, 12.50, "mediterranean", True),  # Rome
        (40.42, -3.70, "mediterranean", False),  # Madrid is steppe (BSk)
    ],
)
def test_regional_climate_traits(lat: float, lon: float, trait: str, present: bool) -> None:
    assert (trait in describe(lat, lon, GRIDS).traits) is present


@pytest.mark.parametrize(
    ("country", "location", "expected"),
    [
        ("JP", (35.68, 139.69), True),
        ("US", (37.77, -122.42), True),  # San Francisco
        ("US", (61.22, -149.90), True),  # Anchorage
        ("US", (29.76, -95.37), False),  # Houston
        ("DE", (48.14, 11.58), False),
    ],
)
def test_earthquake_regions(country: str, location: tuple[float, float], expected: bool) -> None:
    profile = HomeProfile(DWELLING_HOUSE, DWELLING_HOUSE, (), "auto", country, None, location)
    assert ("earthquake" in profile.traits) is expected


def test_country_notes_are_added_for_that_country_only() -> None:
    annual = next(tt for t in TEMPLATES if t.id == "home_heating" for tt in t.tasks if tt.name == "Annual Inspection")
    assert "France" in build_template_task(annual, "en", country="FR")["notes"]
    assert "Gas Safe" in build_template_task(annual, "en", country="GB")["notes"]
    assert "notes" not in build_template_task(annual, "en", country="DE")
    assert "notes" not in build_template_task(annual, "en")
    # Appended below a template's own note, and localized.
    sweep = next(tt for t in TEMPLATES if t.id == "home_fireplace" for tt in t.tasks if tt.name == "Chimney Sweep Appointment")
    notes = build_template_task(sweep, "en", country="PL")["notes"]
    assert notes.startswith("Legally regulated") and notes.endswith("at least once a year.") and "\n\n" in notes
    assert "DIN 14676" in build_template_task(_tt("Test Detectors"), "de", country="DE")["notes"]


def test_winter_and_hemisphere() -> None:
    assert describe(52.52, 13.40, GRIDS).has_winter is True  # Berlin
    assert describe(25.76, -80.19, GRIDS).has_winter is False  # Miami
    sydney = describe(-33.87, 151.21, GRIDS)
    assert sydney.hemisphere == "south" and sydney.has_winter is False
    assert ClimateInfo(None, None, None, "north", frozenset()).has_winter is True, "unknown counts as winter"


def test_a_coastal_home_in_a_water_cell_finds_the_nearest_land() -> None:
    # Off the Dutch coast (the 0.5° cell is sea) — still the coast's climate.
    info = describe(52.30, 4.30, GRIDS)
    assert info.koppen == "Cfb" and info.coldest_c is not None


def test_mid_ocean_has_no_class() -> None:
    info = describe(-40.0, -130.0, GRIDS)
    assert info.koppen is None and info.coldest_c is None


def test_flip_months_mirrors_the_season_south_of_the_equator() -> None:
    assert flip_months((10, 11, 12, 1, 2, 3, 4), "south") == (4, 5, 6, 7, 8, 9, 10)
    assert flip_months((4,), "south") == (10,)
    assert flip_months((4,), "north") == (4,)


def test_corrupt_grid_is_rejected(tmp_path: Any) -> None:
    import zlib

    (tmp_path / "koppen_0p5.bin").write_bytes(zlib.compress(b"\x00" * 10))
    (tmp_path / "temp_1p0.bin").write_bytes(zlib.compress(b"\x00" * 10))
    with pytest.raises(ValueError):
        load_grids(tmp_path)


# ─── dwelling ────────────────────────────────────────────────────────────


@pytest.mark.parametrize(
    ("levels", "names", "hints", "kind"),
    [
        ([0, 1], ["Wohnzimmer", "Küche"], [], DWELLING_UNKNOWN),  # two floors alone: not enough
        ([0, 1], ["Wohnzimmer", "Garten"], [], DWELLING_HOUSE),
        ([-1, 0], ["Keller", "Küche", "Garage"], [], DWELLING_HOUSE),
        ([], ["Salon", "Jardín"], ["lawn_mower"], DWELLING_HOUSE),
        ([], ["Living room", "Kitchen", "Bedroom", "Balcony"], [], DWELLING_APARTMENT),
        ([0], ["Wohnzimmer", "Küche", "Bad", "Schlafzimmer"], [], DWELLING_APARTMENT),
        ([], [f"Room {i}" for i in range(9)], [], DWELLING_UNKNOWN),  # too many rooms to guess
        ([], [], [], DWELLING_UNKNOWN),
        ([], ["Trädgård", "Kök"], ["gate"], DWELLING_HOUSE),  # accents folded: trädgård → tradgard
        ([], ["リビング", "庭"], ["garage"], DWELLING_HOUSE),
    ],
)
def test_guess_dwelling(levels: list[int], names: list[str], hints: list[str], kind: str) -> None:
    assert guess_dwelling(levels, names, hints).kind == kind


def test_guess_dwelling_names_its_reasons() -> None:
    guess = guess_dwelling([-1, 0, 1], ["Garten"], ["lawn_mower"])
    assert guess.kind == DWELLING_HOUSE
    assert {"floors", "basement_floor", "area_garden", "entity_lawn_mower"} <= set(guess.reasons)


async def test_profile_from_registries_location_and_setting(hass: HomeAssistant) -> None:
    hass.config.latitude, hass.config.longitude = 48.14, 11.58
    hass.config.country = "DE"
    floors = fr.async_get(hass)
    ground = floors.async_create("Erdgeschoss", level=0)
    floors.async_create("Keller", level=-1)
    ar.async_get(hass).async_create("Garten", floor_id=ground.floor_id)
    g = make_global_entry(hass)
    await setup_integration(hass, g)

    profile = await async_home_profile(hass)
    assert profile.dwelling == DWELLING_HOUSE and profile.dwelling_source == "auto"
    assert profile.country == "DE" and "radon" in profile.traits and "freeze" in profile.traits
    data = profile.as_dict()
    assert data["climate"]["koppen"] == "Cfb" and data["hemisphere"] == "north"

    hass.config_entries.async_update_entry(g, options={**g.options, CONF_HOME_TYPE: DWELLING_APARTMENT})
    profile = await async_home_profile(hass)
    assert profile.dwelling == DWELLING_APARTMENT and profile.dwelling_source == "setting"
    assert profile.dwelling_detected == DWELLING_HOUSE


# ─── template tasks: seasons and hemisphere ──────────────────────────────


def _tt(name: str) -> TaskTemplate:
    for t in TEMPLATES:
        for tt in t.tasks:
            if tt.name == name:
                return tt
    raise AssertionError(name)


def test_seasonal_interval_is_mirrored_south_and_dropped_without_winter() -> None:
    mowing = _tt("Mowing")
    north = build_template_task(mowing, "en")
    assert north["schedule"] == {"kind": "interval", "every": 10, "season_months": [4, 5, 6, 7, 8, 9, 10]}
    assert "schedule_type" not in north and "interval_days" not in north
    south = build_template_task(mowing, "en", hemisphere="south")
    assert south["schedule"]["season_months"] == [1, 2, 3, 4, 10, 11, 12]
    no_winter = build_template_task(mowing, "en", has_winter=False)
    assert "schedule" not in no_winter and no_winter["interval_days"] == 10, "a Miami lawn is mowed all year"


def test_calendar_task_months_follow_the_hemisphere() -> None:
    winterize = _tt("Spring Startup and Leak Check")
    assert build_template_task(winterize, "en")["schedule"] == {"kind": "day_of_month", "day": 15, "months": [4]}
    assert build_template_task(winterize, "en", hemisphere="south")["schedule"]["months"] == [10]
    # The template's own dict is never mutated by the flip.
    assert winterize.schedule == {"kind": "day_of_month", "day": 15, "months": [4]}


def test_plain_task_keeps_the_flat_interval_and_localizes() -> None:
    task = build_template_task(_tt("Oil Change"), "de")
    assert task["name"] == "Ölwechsel"
    oil = next(tt for t in TEMPLATES if t.id == "vehicle_car" for tt in t.tasks if tt.name == "Oil Change")
    car = build_template_task(oil, "de")
    assert car["schedule_type"] == "time_based" and car["interval_days"] == 365 and "schedule" not in car


# ─── recommendations ─────────────────────────────────────────────────────


def _profile(dwelling: str, traits: set[str] = frozenset(), country: str | None = None, reasons: tuple[str, ...] = ()) -> HomeProfile:  # type: ignore[assignment]
    climate = ClimateInfo("Cfb", 0, 19, "north", frozenset(traits))
    return HomeProfile(dwelling, dwelling, reasons, "auto", country, climate)


def test_recommendation_reasons_and_dwelling_mismatch() -> None:
    pool = get_template_by_id("pool_pump")
    kitchen = get_template_by_id("household_kitchen")
    heating = get_template_by_id("home_heating")
    hvac = get_template_by_id("home_hvac")
    assert pool and kitchen and heating and hvac
    flat = _profile(DWELLING_APARTMENT)
    assert recommend_template(pool, flat) == {"recommended": False, "reasons": [], "dwelling_mismatch": True}
    assert recommend_template(kitchen, flat)["reasons"] == ["starter"]
    assert recommend_template(heating, _profile(DWELLING_HOUSE, {"freeze"}))["reasons"] == ["freeze"]
    assert recommend_template(hvac, _profile(DWELLING_UNKNOWN, country="US"))["reasons"] == ["country"]
    assert recommend_template(pool, None)["recommended"] is False
    # Unknown dwelling: no starter set, no mismatch.
    unknown = recommend_template(pool, _profile(DWELLING_UNKNOWN))
    assert unknown == {"recommended": False, "reasons": [], "dwelling_mismatch": False}


def test_equipment_waits_for_what_the_home_has() -> None:
    """A garage door is suggested where a garage was found — not to every
    house in a country; a sump pump needs a basement AND North America."""
    garage_door = get_template_by_id("home_garage_door")
    sump = get_template_by_id("home_sump_pump")
    backflow = get_template_by_id("home_backflow_lifting")
    snow_blower = get_template_by_id("garden_snow_blower")
    septic = get_template_by_id("home_septic_tank")
    assert garage_door and sump and backflow and snow_blower and septic
    with_garage = _profile(DWELLING_HOUSE, country="DE", reasons=("area_garage",))
    assert recommend_template(garage_door, with_garage)["reasons"] == ["feature_garage"]
    assert recommend_template(garage_door, _profile(DWELLING_HOUSE, country="US"))["recommended"] is False
    basement_us = _profile(DWELLING_HOUSE, country="US", reasons=("basement_floor",))
    assert recommend_template(sump, basement_us)["reasons"] == ["feature_basement"]
    assert recommend_template(sump, _profile(DWELLING_HOUSE, country="DE", reasons=("area_basement",)))["recommended"] is False
    assert recommend_template(sump, _profile(DWELLING_HOUSE, country="US"))["recommended"] is False
    basement_de = _profile(DWELLING_HOUSE, country="DE", reasons=("area_basement",))
    assert recommend_template(backflow, basement_de)["reasons"] == ["feature_basement"]
    assert recommend_template(snow_blower, _profile(DWELLING_HOUSE, {"snow"}, "DE"))["recommended"] is False
    assert recommend_template(snow_blower, _profile(DWELLING_HOUSE, {"snow"}, "CA"))["reasons"] == ["snow"]
    assert recommend_template(septic, _profile(DWELLING_HOUSE, country="US"))["recommended"] is False, "a minority's equipment"
    # The features survive an override of the dwelling type.
    assert with_garage.features == frozenset({"garage"})


async def test_null_island_is_no_location(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.home_profile import async_climate

    hass.config.latitude, hass.config.longitude = 0.0, 0.0
    assert await async_climate(hass) is None


def test_every_template_metadata_is_well_formed() -> None:
    from custom_components.maintenance_supporter.helpers.climate import CLIMATE_TRAITS
    from custom_components.maintenance_supporter.helpers.home_profile import TRAIT_RADON

    from custom_components.maintenance_supporter.helpers.home_profile import TRAIT_EARTHQUAKE

    allowed_traits = set(CLIMATE_TRAITS) | {TRAIT_RADON, TRAIT_EARTHQUAKE}
    for t in TEMPLATES:
        assert t.dwellings and t.dwellings <= {DWELLING_HOUSE, DWELLING_APARTMENT}, t.id
        assert t.starter <= t.dwellings, t.id
        assert t.traits <= allowed_traits, (t.id, t.traits)
        assert all(len(c) == 2 and c.isupper() for c in t.countries | t.only_countries), t.id
        for tt in t.tasks:
            assert all(len(c) == 2 and c.isupper() for c in (tt.country_notes or {})), (t.id, tt.name)
        assert t.requires <= {"garage", "basement", "garden"}, (t.id, t.requires)
        for tt in t.tasks:
            assert all(1 <= m <= 12 for m in tt.season_months), (t.id, tt.name)
            if tt.season_months:
                assert tt.interval_days, (t.id, tt.name, "a season needs an interval")
            if tt.schedule is not None:
                from custom_components.maintenance_supporter.helpers.schedule import Schedule

                assert Schedule.from_dict(tt.schedule).to_dict()["kind"] == tt.schedule["kind"], (t.id, tt.name)


# ─── end to end ──────────────────────────────────────────────────────────


async def test_templates_ws_carries_the_profile_and_recommendations(hass: HomeAssistant) -> None:
    hass.config.latitude, hass.config.longitude = 48.14, 11.58
    hass.config.country = "DE"
    g = make_global_entry(hass, options={CONF_HOME_TYPE: DWELLING_APARTMENT})
    await setup_integration(hass, g)
    conn = make_ws_connection()
    await call_ws_handler(ws_get_templates, hass, conn, {"id": 1, "type": "maintenance_supporter/templates"})
    result = assert_ws_success(conn)
    assert result["profile"]["dwelling"] == DWELLING_APARTMENT and result["profile"]["country"] == "DE"
    by_id = {t["id"]: t for t in result["templates"]}
    assert by_id["household_kitchen"]["recommended"] is True and by_id["household_kitchen"]["reasons"] == ["starter"]
    assert by_id["pool_pump"]["dwelling_mismatch"] is True


async def test_from_template_writes_hemisphere_aware_schedules(hass: HomeAssistant) -> None:
    hass.config.latitude, hass.config.longitude = -37.81, 144.96  # Melbourne: a winter, southern
    g = make_global_entry(hass)
    await setup_integration(hass, g)
    conn = make_ws_connection()
    await call_ws_handler(
        ws_create_from_template,
        hass,
        conn,
        {"id": 2, "type": "maintenance_supporter/object/from_template", "template_id": "garden_lawn", "language": "en"},
    )
    entry_id = assert_ws_success(conn)["entry_id"]
    await hass.async_block_till_done()
    tasks = {t["name"]: t for t in hass.config_entries.async_get_entry(entry_id).data[CONF_TASKS].values()}
    assert tasks["Mowing"]["schedule"]["season_months"] == [1, 2, 3, 4, 10, 11, 12]
    assert tasks["Scarifying"]["schedule"] == {"kind": "day_of_month", "day": 15, "months": [10]}
    assert tasks["Mowing"].get("interval_days") is None and tasks["Mowing"].get("schedule_type") is None
