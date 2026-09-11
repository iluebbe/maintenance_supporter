"""Battery lifetimes (D#162 follow-up): Battery Notes' type vocabulary folds
onto the table, the table knows the common coin/lithium cells, "Manual" /
"Irreplaceable" / "Solar" get no type forecast, overrides beat learned beat
table beat default, the fleet logs every last-replaced date it sees and
learns a type's lifetime from the pooled intervals once three exist, the
settings sanitiser keeps only sane entries, and the overview rows say which
lifetime they used.
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
    LifetimeInfo,
    canonical_type,
    has_type_forecast,
    lifetime_catalog,
    resolve_lifetime,
    sanitize_lifetime_overrides,
)


def _bat(name: str, btype: str, *, last: date | None = None, level: float | None = None) -> Battery:
    return Battery(entity_id=f"sensor.{name}_battery_plus", device_name=name, battery_type=btype, quantity=1, low=False, level=level, last_replaced=last)


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


def test_resolve_precedence_override_learned_table_default() -> None:
    overrides = {"CR2032": 30}
    learned = {"CR2032": (20, 4), "AA": (9, 5)}
    assert resolve_lifetime("cr2032", overrides=overrides, learned=learned) == LifetimeInfo(30, "override")
    assert resolve_lifetime("LR6", overrides=overrides, learned=learned) == LifetimeInfo(9, "learned", 5)
    assert resolve_lifetime("AAA", overrides=overrides, learned=learned) == LifetimeInfo(TYPICAL_LIFETIME_MONTHS["AAA"], "table")
    assert resolve_lifetime("XYZ99", overrides=overrides, learned=learned) == LifetimeInfo(DEFAULT_LIFETIME_MONTHS, "default")


def test_sanitize_overrides_keeps_only_sane_entries() -> None:
    raw = {"cr2032": "24", "LR6": 9, "Manual": 5, "AAA": 0, "CR2450": 999, "CR2": "x", "": 3}
    assert sanitize_lifetime_overrides(raw) == {"CR2032": 24, "AA": 9}
    assert sanitize_lifetime_overrides("nope") == {}
    assert sanitize_lifetime_overrides({}) == {}


# ─── the overview uses the resolved lifetime ─────────────────────────────────


def test_overview_rows_carry_lifetime_and_forecast_follows_it() -> None:
    today = date(2026, 9, 11)
    bats = [_bat("Door", "CR2032", last=date(2025, 9, 11)), _bat("Vac", "Rechargeable", last=date(2025, 1, 1)), _bat("Plug", "Manual", last=date(2024, 1, 1))]
    resolver = lambda raw: resolve_lifetime(raw, overrides={"CR2032": 14}, learned={})  # noqa: E731
    ov = build_overview(bats, today=today, horizon_days=90, lifetime_for=resolver)
    door = next(r for r in ov.all if r["device_name"] == "Door")
    # 14 months from 2025-09-11 → 2026-11-11 → 61 days
    assert door["lifetime_months"] == 14 and door["lifetime_source"] == "override"
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

    def get_task_state(self, task_id: str) -> dict[str, Any]:
        return self.tasks.get(task_id, {})

    def async_delay_save(self) -> None:
        self.saves += 1


def test_observe_and_learn(monkeypatch: pytest.MonkeyPatch) -> None:
    store = _FakeStore()
    monkeypatch.setattr(bl, "_fleet_store_and_task", lambda hass: (store, "fleet-task"))
    hass = object()
    # First sight: one date per device — no interval yet.
    bats = [_bat("A", "CR2032", last=date(2024, 1, 1)), _bat("B", "cr2032", last=date(2024, 6, 1)), _bat("C", "LR6", last=date(2024, 1, 1))]
    assert bl.observe_replacements(hass, bats) == 3
    assert store.saves == 1
    assert bl.observe_replacements(hass, bats) == 0, "unchanged dates are not re-logged"
    assert bl.learned_lifetimes(hass) == {}
    # Replacements happen: A twice, B once, C once → CR2032 gets 3 intervals (18, 17, 19 months), AA one.
    bats = [_bat("A", "CR2032", last=date(2025, 7, 1)), _bat("B", "cr2032", last=date(2025, 11, 1)), _bat("C", "LR6", last=date(2025, 1, 1))]
    bl.observe_replacements(hass, bats)
    bats = [_bat("A", "CR2032", last=date(2027, 2, 1)), _bat("B", "cr2032", last=date(2025, 11, 1)), _bat("C", "LR6", last=date(2025, 1, 1))]
    bl.observe_replacements(hass, bats)
    learned = bl.learned_lifetimes(hass)
    assert "AA" not in learned, "one interval is not enough"
    months, samples = learned["CR2032"]
    assert samples == 3 and 17 <= months <= 19
    # A same-day re-seed or a typo-sized interval is ignored.
    bats = [_bat("A", "CR2032", last=date(2027, 2, 3))]
    bl.observe_replacements(hass, bats)
    assert bl.learned_lifetimes(hass)["CR2032"][1] == 3
    # The log is capped per device.
    entry = store.tasks["fleet-task"][bl.REPLACEMENT_LOG_KEY]["sensor.A_battery_plus"]
    assert entry["type"] == "CR2032" and len(entry["dates"]) <= bl._LOG_DATES_CAP


def test_catalog_lists_fleet_types_first_with_sources(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(bl, "lifetime_overrides", lambda hass: {"CR2032": 30})
    monkeypatch.setattr(bl, "learned_lifetimes", lambda hass: {"AA": (9, 4)})
    rows = lifetime_catalog(object(), ["LR6", "cr2032", "Manual", "XYZ99"])
    by_type = {r["type"]: r for r in rows}
    assert [r["type"] for r in rows[:3]] == ["AA", "CR2032", "XYZ99"], "fleet types (canonical, sorted) come first"
    assert by_type["AA"] == {"type": "AA", "months": 9, "source": "learned", "samples": 4, "default_months": 12, "learned_months": 9, "override_months": None, "in_fleet": True}
    assert by_type["CR2032"]["source"] == "override" and by_type["CR2032"]["override_months"] == 30 and by_type["CR2032"]["default_months"] == 18
    assert by_type["XYZ99"]["source"] == "default" and by_type["XYZ99"]["months"] == DEFAULT_LIFETIME_MONTHS
    assert "MANUAL" not in by_type
    assert by_type["CR2450"]["in_fleet"] is False and by_type["CR2450"]["source"] == "table"


def test_no_fleet_means_no_log_and_no_learning() -> None:
    hass = SimpleNamespace(config_entries=SimpleNamespace(async_entries=lambda domain: []))
    assert bl.observe_replacements(hass, [_bat("A", "AA", last=date(2024, 1, 1))]) == 0
    assert bl.learned_lifetimes(hass) == {}
