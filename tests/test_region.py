"""2.94: the home's state, province or region — an offline grid built from
Natural Earth's admin-1 map (helpers/region.py, scripts/build_region_grid.py),
and what it changes in the templates: New York inspects cars every year,
Florida not at all, so the task is left out there."""

from __future__ import annotations

import zlib
from pathlib import Path

import pytest
from homeassistant.core import HomeAssistant

from custom_components.maintenance_supporter.const import CONF_HOME_REGION
from custom_components.maintenance_supporter.helpers.climate import ClimateInfo
from custom_components.maintenance_supporter.helpers.home_profile import (
    DWELLING_HOUSE,
    HomeProfile,
    async_home_place,
    async_home_profile,
)
from custom_components.maintenance_supporter.helpers.region import (
    MAGIC,
    is_region_setting,
    load_region_grid,
    load_region_names,
    regions_of,
)
from custom_components.maintenance_supporter.templates import (
    TEMPLATES,
    async_build_template_tasks,
    build_template_task,
    get_template_by_id,
    recommend_template,
    task_interval,
    template_tasks,
)

from .conftest import make_global_entry, setup_integration

NAMES = load_region_names()


@pytest.mark.parametrize(
    ("country", "lat", "lon", "code"),
    [
        ("US", 40.71, -74.01, "US-NY"),  # lower Manhattan — not New Jersey across the Hudson
        ("US", 40.72, -74.05, "US-NJ"),  # Jersey City
        ("US", 38.90, -77.04, "US-DC"),
        ("US", 38.88, -77.10, "US-VA"),  # Arlington
        ("US", 24.56, -81.78, "US-FL"),  # Key West: a thin island
        ("US", 21.31, -157.86, "US-HI"),
        ("US", 61.22, -149.90, "US-AK"),
        ("CA", 45.42, -75.70, "CA-ON"),  # Ottawa …
        ("CA", 45.48, -75.70, "CA-QC"),  # … and Gatineau across the river
        ("CA", 48.43, -123.37, "CA-BC"),  # Victoria, on an island
        ("AU", -35.28, 149.13, "AU-ACT"),
        ("AU", -42.88, 147.33, "AU-TAS"),
        ("AT", 47.27, 11.39, "AT-7"),  # Innsbruck
        ("AT", 48.21, 16.37, "AT-9"),  # Vienna
        ("BE", 50.85, 4.35, "BE-BRU"),
        ("BE", 50.93, 4.43, "BE-VLG"),  # Vilvoorde, just north of Brussels
        ("BE", 50.72, 4.40, "BE-WAL"),  # Waterloo, just south
        ("IT", 45.46, 9.19, "IT-25"),  # Milan, Lombardy
        ("IT", 44.49, 11.34, "IT-45"),  # Bologna, Emilia-Romagna
        ("GB", 55.95, -3.19, "GB-SCT"),
        ("GB", 55.77, -2.00, "GB-ENG"),  # Berwick-upon-Tweed
        ("GB", 51.48, -3.18, "GB-WLS"),
        ("GB", 54.60, -5.93, "GB-NIR"),
    ],
)
def test_known_places(country: str, lat: float, lon: float, code: str) -> None:
    grid = load_region_grid(country)
    assert grid is not None
    assert grid.at(lat, lon) == code


def test_no_region_elsewhere() -> None:
    assert load_region_grid("DE") is None, "only countries whose templates have regional rules"
    us = load_region_grid("US")
    assert us is not None
    assert us.at(35.0, -50.0) is None, "mid-Atlantic"
    assert us.at(89.0, 0.0) is None, "outside the grid"


def test_names_and_picker() -> None:
    assert NAMES["US-NY"] == "New York" and NAMES["BE-VLG"] == "Flanders" and NAMES["GB-SCT"] == "Scotland"
    us = regions_of("US", NAMES)
    assert len(us) == 51 and us == sorted(us, key=lambda r: r["name"])
    assert {"code": "US-DC", "name": "District of Columbia"} in us
    assert regions_of("DE", NAMES) == [] and regions_of(None, NAMES) == []


def test_region_setting_format() -> None:
    assert all(is_region_setting(v) for v in ("auto", "US-NY", "AT-9", "BE-VLG", "IT-25"))
    assert not any(is_region_setting(v) for v in ("us-ny", "USA", "", None, "US-NEWY", "US_NY", 7))


def test_a_damaged_file_is_rejected(tmp_path: Path) -> None:
    bad = tmp_path / "regions.bin"
    bad.write_bytes(b"nonsense")
    with pytest.raises(ValueError):
        load_region_names(bad)
    good = Path(__file__).resolve().parent.parent / "custom_components" / "maintenance_supporter" / "data" / "regions" / "regions.bin"
    raw = good.read_bytes()
    assert raw.startswith(MAGIC)
    bad.write_bytes(raw[:-500])  # the last country's blob is cut short
    with pytest.raises((ValueError, zlib.error)):
        load_region_grid("GB", bad)


def test_every_region_the_templates_name_exists() -> None:
    """A typo in a region key ("US-NYC") would silently never match."""
    for t in TEMPLATES:
        codes = {c for c in t.countries | t.only_countries if "-" in c}
        for tt in t.tasks:
            codes |= {c for c in (tt.country_notes or {}) | (tt.country_intervals or {}) if "-" in c}
        assert codes <= set(NAMES), (t.id, sorted(codes - set(NAMES)))


# ─── what the region changes ─────────────────────────────────────────────


def _task(template_id: str, name: str):  # type: ignore[no-untyped-def]
    template = get_template_by_id(template_id)
    assert template
    return template, next(tt for tt in template.tasks if tt.name == name)


def test_the_region_wins_over_its_country() -> None:
    car, test = _task("vehicle_car", "Roadworthiness Test")
    assert task_interval(test, "US") == 730
    assert task_interval(test, "US", "US-NY") == 365
    assert task_interval(test, "US", "US-CO") == 730, "a region without an entry falls back to its country"
    assert task_interval(test, "BE", "BE-WAL") == 365 and task_interval(test, "BE", "BE-VLG") == 730
    assert build_template_task(test, "en", country="US", region="US-NY")["interval_days"] == 365
    assert "depends on the state" in build_template_task(test, "en", country="US", region="US-NY")["notes"]


def test_a_check_without_a_duty_is_left_out() -> None:
    car, test = _task("vehicle_car", "Roadworthiness Test")
    assert test in template_tasks(car, country="US")
    assert test not in template_tasks(car, country="US", region="US-FL")
    assert test in template_tasks(car, country="US", region="US-CA"), "California tests petrol cars (smog check)"
    ev, ev_test = _task("vehicle_ev", "Roadworthiness Test")
    assert ev_test not in template_tasks(ev, country="US", region="US-CA"), "… but not electric ones"
    assert ev_test in template_tasks(ev, country="CA", region="CA-PE")
    assert ev_test not in template_tasks(ev, country="CA", region="CA-ON")
    # the other tasks stay
    assert len(template_tasks(car, country="US", region="US-FL")) == len(car.tasks) - 1


def test_a_region_can_be_the_recommendation_reason() -> None:
    tires = get_template_by_id("vehicle_seasonal_tires")
    assert tires
    climate = ClimateInfo("Cfb", 4, 18, "north", frozenset())  # Vancouver: no snow winter
    vancouver = HomeProfile(DWELLING_HOUSE, DWELLING_HOUSE, (), "auto", "CA", climate, (49.28, -123.12), region="CA-BC")
    assert recommend_template(tires, vancouver)["reasons"] == ["country"]
    toronto = HomeProfile(DWELLING_HOUSE, DWELLING_HOUSE, (), "auto", "CA", climate, (43.65, -79.38), region="CA-ON")
    assert recommend_template(tires, toronto)["recommended"] is False


# ─── the profile: located, overridden ────────────────────────────────────


async def test_profile_locates_the_region_and_the_setting_overrides_it(hass: HomeAssistant) -> None:
    hass.config.latitude, hass.config.longitude, hass.config.country = 40.71, -74.01, "US"
    g = make_global_entry(hass)
    await setup_integration(hass, g)

    profile = await async_home_profile(hass)
    assert (profile.region, profile.region_detected, profile.region_source) == ("US-NY", "US-NY", "auto")
    data = profile.as_dict()
    assert data["region_name"] == "New York" and len(data["regions"]) == 51
    assert await async_home_place(hass) == ("US", "US-NY")

    hass.config_entries.async_update_entry(g, options={**g.options, CONF_HOME_REGION: "US-NJ"})
    profile = await async_home_profile(hass)
    assert (profile.region, profile.region_detected, profile.region_source) == ("US-NJ", "US-NY", "setting")
    # a region of another country is ignored
    hass.config_entries.async_update_entry(g, options={**g.options, CONF_HOME_REGION: "CA-QC"})
    assert (await async_home_profile(hass)).region == "US-NY"


async def test_a_country_without_regions_has_none(hass: HomeAssistant) -> None:
    hass.config.latitude, hass.config.longitude, hass.config.country = 48.14, 11.58, "DE"
    g = make_global_entry(hass)
    await setup_integration(hass, g)
    data = (await async_home_profile(hass)).as_dict()
    assert data["region"] is None and data["regions"] == []


async def test_created_tasks_follow_the_region(hass: HomeAssistant) -> None:
    hass.config.latitude, hass.config.longitude, hass.config.country = 25.76, -80.19, "US"  # Miami
    g = make_global_entry(hass)
    await setup_integration(hass, g)
    car = get_template_by_id("vehicle_car")
    assert car
    names = {t["name"] for t in (await async_build_template_tasks(hass, car, "en", "obj")).values()}
    assert "Oil Change" in names and "Roadworthiness Test" not in names
    hass.config_entries.async_update_entry(g, options={**g.options, CONF_HOME_REGION: "US-NY"})
    tasks = (await async_build_template_tasks(hass, car, "en", "obj")).values()
    test = next(t for t in tasks if t["name"] == "Roadworthiness Test")
    assert test["interval_days"] == 365
