"""Battery lifetimes (D#162 follow-up): Battery Notes' type vocabulary folds
onto the table, the table knows the common coin/lithium cells, "Manual" /
"Irreplaceable" / "Solar" get no type forecast, the resolution order is
override > this device's own replacements > devices of the same model >
table > default, the fleet logs every last-replaced date it sees (with the
device model) and learns per model — never fleet-wide per type, a CR2032 in
a door sensor says nothing about one in a thermostat — the settings
sanitiser keeps only sane entries, and the overview rows say which lifetime
they used.
"""

from __future__ import annotations

from datetime import date
from types import SimpleNamespace
from typing import Any

import pytest

from custom_components.maintenance_supporter.helpers import battery_lifetime as bl
from custom_components.maintenance_supporter.helpers.battery_fleet import Battery, build_overview
from custom_components.maintenance_supporter.helpers.battery_lifetime import (
    DEFAULT_LIFETIME_MONTHS,
    TYPICAL_LIFETIME_MONTHS,
    Learned,
    LifetimeInfo,
    canonical_type,
    has_type_forecast,
    lifetime_catalog,
    resolve_lifetime,
    sanitize_lifetime_overrides,
)


def _bat(name: str, btype: str, *, last: date | None = None, level: float | None = None, model: str = "") -> Battery:
    return Battery(entity_id=f"sensor.{name}_battery_plus", device_name=name, battery_type=btype, quantity=1, low=False, level=level, last_replaced=last, model_key=model)


# ─── vocabulary ────────────────────────────────────────────────────────────


@pytest.mark.parametrize(
    ("raw", "canon"),
    [
        ("CR2032", "CR2032"),
        (" cr2032 ", "CR2032"),
        ("LR6", "AA"),
        ("PP3", "9V"),
        ("9v", "9V"),
        ("CR123", "CR123A"),
        ("CR123A Lithium", "CR123A"),
        ("CR123A-3V", "CR123A"),
        ("Lithium 3-volt CR2", "CR2"),
        ("Alkaline AA", "AA"),
        ("3V CR2032", "CR2032"),
        ("FDK CR17450E-N (3V)", "FDK CR17450E-N"),
        ("ER14250", "LS14250"),
        ("1/2AA", "LS14250"),
        ("AG13", "LR44"),
        ("", "UNKNOWN"),
        (None, "UNKNOWN"),
    ],
)
def test_canonical_type_folds_battery_notes_spellings(raw: Any, canon: str) -> None:
    assert canonical_type(raw) == canon


def test_table_covers_the_common_battery_notes_types() -> None:
    for t in ("AA", "AAA", "CR2032", "CR2450", "CR123A", "CR2", "CR2477", "CR1632", "CR2430", "LS14250", "9V", "LR44", "A23"):
        assert t in TYPICAL_LIFETIME_MONTHS, t
    assert TYPICAL_LIFETIME_MONTHS["LS14250"] > TYPICAL_LIFETIME_MONTHS["CR2032"] > TYPICAL_LIFETIME_MONTHS["AAA"]


def test_manual_irreplaceable_and_solar_have_no_type_forecast() -> None:
    for t in ("MANUAL", "Manual", "Irreplaceable", "Solar", ""):
        assert not has_type_forecast(t), t
    assert has_type_forecast("CR2032") and has_type_forecast("some new cell")


# ─── precedence ─────────────────────────────────────────────────────────────


def test_resolve_precedence_override_device_model_table_default() -> None:
    overrides = {"CR2032": 30}
    learned = Learned(by_device={"sensor.door_battery_plus": (11, 2)}, by_model={("CR2032", "aqara|door"): (20, 4), ("AA", "acme|lock"): (9, 5)})
    # override beats everything, even a device's own history
    assert resolve_lifetime("cr2032", overrides=overrides, learned=learned, entity_id="sensor.door_battery_plus", model_key="aqara|door") == LifetimeInfo(30, "override")
    # a device's own intervals beat its model's pool
    assert resolve_lifetime("AA", overrides={}, learned=learned, entity_id="sensor.door_battery_plus", model_key="acme|lock") == LifetimeInfo(11, "learned_device", 2)
    # the same-model pool beats the table — but only for that model
    assert resolve_lifetime("LR6", overrides={}, learned=learned, entity_id="sensor.other", model_key="acme|lock") == LifetimeInfo(9, "learned_model", 5)
    assert resolve_lifetime("LR6", overrides={}, learned=learned, entity_id="sensor.other", model_key="other|thing") == LifetimeInfo(TYPICAL_LIFETIME_MONTHS["AA"], "table")
    assert resolve_lifetime("LR6", overrides={}, learned=learned, entity_id="sensor.other", model_key="") == LifetimeInfo(TYPICAL_LIFETIME_MONTHS["AA"], "table")
    assert resolve_lifetime("XYZ99", overrides={}, learned=learned) == LifetimeInfo(DEFAULT_LIFETIME_MONTHS, "default")


def test_sanitize_overrides_keeps_only_sane_entries() -> None:
    raw = {"cr2032": "24", "LR6": 9, "Manual": 5, "AAA": 0, "CR2450": 999, "CR2": "x", "": 3}
    assert sanitize_lifetime_overrides(raw) == {"CR2032": 24, "AA": 9}
    assert sanitize_lifetime_overrides("nope") == {}
    assert sanitize_lifetime_overrides({}) == {}


# ─── the overview uses the resolved lifetime ─────────────────────────────────


def test_overview_rows_carry_lifetime_and_forecast_follows_it() -> None:
    today = date(2026, 9, 11)
    bats = [
        _bat("Door", "CR2032", last=date(2025, 9, 11), model="aqara|door"),
        _bat("Vac", "Rechargeable", last=date(2025, 1, 1)),
        _bat("Plug", "Manual", last=date(2024, 1, 1)),
    ]
    learned = Learned(by_device={}, by_model={("CR2032", "aqara|door"): (14, 3)})
    resolver = lambda b: resolve_lifetime(b.battery_type, overrides={}, learned=learned, entity_id=b.entity_id, model_key=b.model_key)  # noqa: E731
    ov = build_overview(bats, today=today, horizon_days=90, lifetime_for=resolver)
    door = next(r for r in ov.all if r["device_name"] == "Door")
    # 14 months from 2025-09-11 → 2026-11-11 → 61 days
    assert door["lifetime_months"] == 14 and door["lifetime_source"] == "learned_model" and door["lifetime_samples"] == 3
    assert door["model_key"] == "aqara|door"
    assert door["days_until"] == 61 and door["status"] == "soon"
    vac = next(r for r in ov.all if r["device_name"] == "Vac")
    plug = next(r for r in ov.all if r["device_name"] == "Plug")
    assert vac["days_until"] is None and plug["days_until"] is None, "no type forecast for rechargeables / Manual"
    # Without a resolver the table decides (18 months → 2027-03-11 → beyond the horizon).
    ov2 = build_overview(bats, today=today, horizon_days=90)
    door2 = next(r for r in ov2.all if r["device_name"] == "Door")
    assert door2["lifetime_source"] == "table" and door2["status"] == "ok"


# ─── learning from the replacement log ───────────────────────────────────────


class _FakeStore:
    def __init__(self) -> None:
        self.tasks: dict[str, dict[str, Any]] = {}
        self.saves = 0

    def _ensure_task(self, task_id: str) -> dict[str, Any]:
        return self.tasks.setdefault(task_id, {})

    def update_task_state(self, task_id: str, **fields: Any) -> None:
        state = self._ensure_task(task_id)
        for key, value in fields.items():
            if value is None:
                state.pop(key, None)
            else:
                state[key] = value

    def get_task_state(self, task_id: str) -> dict[str, Any]:
        return self.tasks.get(task_id, {})

    def async_delay_save(self) -> None:
        self.saves += 1


def test_observe_and_learn_per_model_not_per_type(monkeypatch: pytest.MonkeyPatch) -> None:
    store = _FakeStore()
    monkeypatch.setattr(bl, "_fleet_store_and_task", lambda hass: (store, "fleet-task"))
    hass = object()
    DOOR, THERMO = "aqara|door", "acme|thermostat"
    # First sight: one date per device — no interval yet.
    bats = [_bat("A", "CR2032", last=date(2024, 1, 1), model=DOOR), _bat("B", "cr2032", last=date(2024, 6, 1), model=DOOR), _bat("T", "CR2032", last=date(2024, 1, 1), model=THERMO)]
    assert bl.observe_replacements(hass, bats) == 3
    assert store.saves == 1
    assert bl.observe_replacements(hass, bats) == 0, "unchanged dates are not re-logged"
    assert bl.learned_lifetimes(hass) == Learned.empty()
    # The first-sight date is an anchor (Battery Notes' seed), so the interval
    # that starts there never counts. Door sensors: A swapped three times
    # (2 counted: 18, 17 months), B twice (1 counted: 19) → 3 pooled intervals.
    # The thermostat (same CELL, other model) runs 6-month cycles → must not
    # pollute the door pool.
    for a, b_, t_ in (
        (date(2024, 7, 1), date(2025, 11, 1), date(2024, 7, 1)),
        (date(2026, 1, 1), date(2027, 6, 1), date(2025, 1, 1)),
        (date(2027, 6, 1), date(2027, 6, 1), date(2025, 7, 1)),
    ):
        bl.observe_replacements(hass, [_bat("A", "CR2032", last=a, model=DOOR), _bat("B", "cr2032", last=b_, model=DOOR), _bat("T", "CR2032", last=t_, model=THERMO)])
    learned = bl.learned_lifetimes(hass)
    months, samples = learned.by_model[("CR2032", DOOR)]
    assert samples == 3 and 17 <= months <= 19
    assert ("CR2032", THERMO) not in learned.by_model, "two intervals are not enough for a model pool"
    # Device A's own two intervals → its own value, which beats the pool for A only.
    assert learned.by_device["sensor.A_battery_plus"][1] == 2
    assert "sensor.B_battery_plus" not in learned.by_device
    assert resolve_lifetime("CR2032", overrides={}, learned=learned, entity_id="sensor.A_battery_plus", model_key=DOOR).source == "learned_device"
    assert resolve_lifetime("CR2032", overrides={}, learned=learned, entity_id="sensor.B_battery_plus", model_key=DOOR).source == "learned_model"
    # The thermostat has two intervals of its OWN → learned_device; its model has no pool.
    assert resolve_lifetime("CR2032", overrides={}, learned=learned, entity_id="sensor.T_battery_plus", model_key=THERMO).source == "learned_device"
    assert resolve_lifetime("CR2032", overrides={}, learned=learned, entity_id="sensor.T2_battery_plus", model_key=THERMO).source == "table"
    # A same-day re-seed or a typo-sized interval is ignored; the log is capped.
    bl.observe_replacements(hass, [_bat("A", "CR2032", last=date(2027, 6, 3), model=DOOR)])
    assert bl.learned_lifetimes(hass).by_model[("CR2032", DOOR)][1] == 3
    entry = store.tasks["fleet-task"][bl.REPLACEMENT_LOG_KEY]["sensor.A_battery_plus"]
    assert entry["type"] == "CR2032" and entry["model"] == DOOR and len(entry["dates"]) <= bl._LOG_DATES_CAP


def test_unknown_model_never_pools(monkeypatch: pytest.MonkeyPatch) -> None:
    store = _FakeStore()
    monkeypatch.setattr(bl, "_fleet_store_and_task", lambda hass: (store, "fleet-task"))
    hass = object()
    for d in (date(2024, 1, 1), date(2025, 1, 1), date(2026, 1, 1), date(2027, 1, 1)):
        bl.observe_replacements(hass, [_bat("X", "AA", last=d), _bat("Y", "AA", last=d)])
    learned = bl.learned_lifetimes(hass)
    assert learned.by_model == {}, "no model key → no pool (the type alone is not a pool)"
    assert learned.by_device["sensor.X_battery_plus"][1] == 2, "the device still learns from itself (the first date is the anchor)"


def test_seed_date_and_corrections_do_not_fake_a_cycle(monkeypatch: pytest.MonkeyPatch) -> None:
    """Bug audit 2026-09-12: Battery Notes seeds last_replaced with the note's
    creation day. Ten sensors set up on day D and swapped over the next weeks
    learned a one-month life. The earliest date is an anchor: an interval
    starting there counts only once the user corrected the anchor to the real
    install date (a date OLDER than everything logged replaces it)."""
    store = _FakeStore()
    monkeypatch.setattr(bl, "_fleet_store_and_task", lambda hass: (store, "fleet-task"))
    hass = object()
    LOCK = "acme|lock"
    seed = date(2026, 1, 1)
    # Y: seed, then a swap 20 days later → no interval (the seed is not a swap).
    bl.observe_replacements(hass, [_bat("Y", "CR2032", last=seed, model=LOCK)])
    bl.observe_replacements(hass, [_bat("Y", "CR2032", last=date(2026, 1, 21), model=LOCK)])
    assert bl.learned_lifetimes(hass) == Learned.empty()
    # X: seed, then a correction back to the real install date, then a real swap
    # 18 months after that → one trustworthy interval.
    bl.observe_replacements(hass, [_bat("X", "CR2032", last=seed, model=LOCK)])
    bl.observe_replacements(hass, [_bat("X", "CR2032", last=date(2025, 6, 1), model=LOCK)])
    entry = store.tasks["fleet-task"][bl.REPLACEMENT_LOG_KEY]["sensor.X_battery_plus"]
    assert entry["dates"] == ["2025-06-01"] and entry["anchored"] is True, "the correction replaced the seed"
    bl.observe_replacements(hass, [_bat("X", "CR2032", last=date(2026, 12, 1), model=LOCK)])
    assert bl._intervals(store.tasks["fleet-task"][bl.REPLACEMENT_LOG_KEY]["sensor.X_battery_plus"]) == pytest.approx([18.0], abs=0.2)


def test_sanitize_rejects_bools_and_fractions() -> None:
    assert sanitize_lifetime_overrides({"AA": True, "AAA": 12.5, "CR2032": 12.0, "9V": "6"}) == {"CR2032": 12, "9V": 6}


def test_catalog_lists_fleet_types_first_with_learned_models(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(bl, "lifetime_overrides", lambda hass: {"CR2032": 30})
    monkeypatch.setattr(bl, "learned_lifetimes", lambda hass: Learned(by_device={}, by_model={("AA", "acme|lock"): (9, 4), ("AA", "acme|remote"): (14, 3)}))
    rows = lifetime_catalog(object(), ["LR6", "cr2032", "Manual", "XYZ99"], model_names={"acme|lock": "Acme Lock"})
    by_type = {r["type"]: r for r in rows}
    assert [r["type"] for r in rows[:3]] == ["AA", "CR2032", "XYZ99"], "fleet types (canonical, sorted) come first"
    aa = by_type["AA"]
    assert aa["source"] == "table" and aa["months"] == 12, "a learned value never replaces the type row"
    assert aa["learned_models"] == [
        {"model": "Acme Lock", "model_key": "acme|lock", "months": 9, "samples": 4},
        {"model": "acme|remote", "model_key": "acme|remote", "months": 14, "samples": 3},
    ]
    assert by_type["CR2032"]["source"] == "override" and by_type["CR2032"]["override_months"] == 30 and by_type["CR2032"]["default_months"] == 18
    assert by_type["XYZ99"]["source"] == "default" and by_type["XYZ99"]["months"] == DEFAULT_LIFETIME_MONTHS
    assert "MANUAL" not in by_type
    assert by_type["CR2450"]["in_fleet"] is False and by_type["CR2450"]["source"] == "table"


def test_no_fleet_means_no_log_and_no_learning() -> None:
    hass = SimpleNamespace(config_entries=SimpleNamespace(async_entries=lambda domain: []))
    assert bl.observe_replacements(hass, [_bat("A", "AA", last=date(2024, 1, 1))]) == 0
    assert bl.learned_lifetimes(hass) == Learned.empty()


def test_sanitize_caps_at_100_entries() -> None:
    raw = {f"TYPE{i}": 12 for i in range(130)}
    assert len(sanitize_lifetime_overrides(raw)) == 100


def test_observe_skips_batteries_without_an_entity_id(monkeypatch: pytest.MonkeyPatch) -> None:
    store = _FakeStore()
    monkeypatch.setattr(bl, "_fleet_store_and_task", lambda hass: (store, "fleet-task"))
    ghost = SimpleNamespace(battery_type="AA", last_replaced=date(2025, 1, 1), model_key="acme|lock", entity_id="")
    assert bl.observe_replacements(object(), [ghost]) == 0
    assert store.saves == 0


def test_intervals_ignore_unparseable_dates() -> None:
    assert bl._intervals({"dates": ["garbage", "2025-01-01", "2025-07-01"], "anchored": True}) == pytest.approx([6.0], abs=0.2)
    assert bl._intervals({"dates": ["2025-01-01", "2025-07-01"]}) == [], "the first date is the anchor unless corrected"
    assert bl._intervals({"dates": ["nope"]}) == []


async def test_settings_table_names_learned_models_from_the_device_registry(hass: Any, monkeypatch: pytest.MonkeyPatch) -> None:
    """The Settings lifetime table resolves a model key to "Manufacturer
    Model" by walking the device registry — version-neutrally: HA 2026.9
    deprecates mapping-style access on ``DeviceRegistry.devices``."""
    from homeassistant.helpers import device_registry as dr
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    from custom_components.maintenance_supporter.helpers import battery_fleet as bf
    from custom_components.maintenance_supporter.websocket.dashboard import _battery_lifetime_catalog

    other = MockConfigEntry(domain="acme_locks")
    other.add_to_hass(hass)
    dr.async_get(hass).async_get_or_create(
        config_entry_id=other.entry_id, identifiers={("acme_locks", "front")}, manufacturer="Acme", model="Lock"
    )
    monkeypatch.setattr(bf, "read_batteries", lambda _hass: [SimpleNamespace(model_key="acme|lock")])
    monkeypatch.setattr(bf, "discover_battery_types", lambda _hass: ["LR6"])
    seen: dict[str, Any] = {}

    def _catalog(_hass: Any, types: list[str], *, model_names: dict[str, str]) -> list[dict[str, Any]]:
        seen.update(types=types, names=model_names)
        return [{"type": "AA"}]

    monkeypatch.setattr(bl, "lifetime_catalog", _catalog)
    assert _battery_lifetime_catalog(hass) == [{"type": "AA"}]
    assert seen == {"types": ["LR6"], "names": {"acme|lock": "Acme Lock"}}


async def test_settings_table_failure_is_logged_not_swallowed(hass: Any, monkeypatch: pytest.MonkeyPatch, caplog: pytest.LogCaptureFixture) -> None:
    """A settings read must survive a broken fleet read — but visibly: the
    HA 2026.9 registry change went unnoticed here behind a silent ``[]``."""
    from custom_components.maintenance_supporter.helpers import battery_fleet as bf
    from custom_components.maintenance_supporter.websocket.dashboard import _battery_lifetime_catalog

    def _boom(_hass: Any) -> list[Any]:
        raise RuntimeError("registry changed")

    monkeypatch.setattr(bf, "read_batteries", _boom)
    assert _battery_lifetime_catalog(hass) == []
    assert any(r.levelname == "WARNING" and r.exc_info for r in caplog.records if "lifetime table" in r.getMessage())
