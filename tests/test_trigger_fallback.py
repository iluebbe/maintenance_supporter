"""Unit tests for the pure per-type trigger fallback evaluators.

These are the refresh-time rules the coordinator applies; each case that used
to hide inside a 170-line if/elif is pinned here directly.
"""

from __future__ import annotations

from datetime import timedelta
from types import SimpleNamespace

from homeassistant.util import dt as dt_util

from custom_components.maintenance_supporter.helpers.trigger_fallback import (
    evaluate_counter,
    evaluate_runtime,
    evaluate_state_change,
    evaluate_threshold,
    threshold_exceeds,
)


def _states(mapping: dict[str, str | float | dict]):
    """Build a hass.states.get stand-in from {entity_id: state or {state, attrs}}."""

    def get(entity_id: str):
        if entity_id not in mapping:
            return None
        spec = mapping[entity_id]
        if isinstance(spec, dict):
            return SimpleNamespace(state=str(spec.get("state")), attributes=spec.get("attributes", {}))
        return SimpleNamespace(state=str(spec), attributes={})

    return get


# ─── threshold ───────────────────────────────────────────────────────────


def test_threshold_below_activates() -> None:
    r = evaluate_threshold(
        _states({"sensor.salt": 15}),
        {"trigger_below": 20.0},
        ["sensor.salt"],
    )
    assert r.current_value == 15.0
    assert r.active is True


def test_threshold_for_minutes_never_activates_from_fallback() -> None:
    r = evaluate_threshold(
        _states({"sensor.temp": 90}),
        {"trigger_above": 50.0, "trigger_for_minutes": 5},
        ["sensor.temp"],
    )
    # Exceeding with a pending duration: the event-driven timer decides.
    assert r.active is None
    # But a recovered value may deactivate even with for_minutes.
    r2 = evaluate_threshold(
        _states({"sensor.temp": 30}),
        {"trigger_above": 50.0, "trigger_for_minutes": 5},
        ["sensor.temp"],
    )
    assert r2.active is False


def test_threshold_missing_attribute_and_nonnumeric_read_as_none() -> None:
    # attribute requested but absent -> None; non-numeric state -> None
    missing_attr = evaluate_threshold(
        _states({"sensor.a": {"state": "on", "attributes": {}}}),
        {"trigger_above": 1.0, "attribute": "battery"},
        ["sensor.a"],
    )
    assert missing_attr.current_value is None
    nonnumeric = evaluate_threshold(
        _states({"sensor.a": "not-a-number"}),
        {"trigger_above": 1.0},
        ["sensor.a"],
    )
    assert nonnumeric.current_value is None


def test_runtime_ignores_unparseable_on_since() -> None:
    r = evaluate_runtime(
        {
            "trigger_runtime_hours": 5,
            "_trigger_state": {
                "input_boolean.comp": {
                    "accumulated_seconds": 3600,
                    "on_since": "not-a-timestamp",
                }
            },
        },
        ["input_boolean.comp"],
    )
    # Unparseable on_since is ignored; only the persisted hour counts.
    assert r.current_value == 1.0
    assert r.active is False


def test_threshold_multi_entity_logic() -> None:
    cfg_any = {"trigger_above": 50.0, "entity_logic": "any"}
    cfg_all = {"trigger_above": 50.0, "entity_logic": "all"}
    states = _states({"sensor.a": 60, "sensor.b": 40})
    assert evaluate_threshold(states, cfg_any, ["sensor.a", "sensor.b"]).active is True
    assert evaluate_threshold(states, cfg_all, ["sensor.a", "sensor.b"]).active is False


def test_threshold_unavailable_entities_read_as_not_triggered() -> None:
    r = evaluate_threshold(
        _states({"sensor.a": "unavailable"}),
        {"trigger_above": 50.0},
        ["sensor.a", "sensor.missing"],
    )
    assert r.current_value is None
    assert r.active is False


# ─── counter ─────────────────────────────────────────────────────────────


def test_counter_absolute_target() -> None:
    r = evaluate_counter(
        _states({"input_number.odo": 55000}),
        {"trigger_target_value": 50000},
        ["input_number.odo"],
    )
    assert r.current_value == 55000.0
    assert r.active is True


def test_counter_delta_mode_uses_per_entity_baseline() -> None:
    cfg = {
        "trigger_target_value": 15000,
        "trigger_delta_mode": True,
        "_trigger_state": {"input_number.odo": {"baseline_value": 45000.0}},
    }
    below = evaluate_counter(_states({"input_number.odo": 55000}), cfg, ["input_number.odo"])
    assert below.active is False  # +10k of 15k
    reached = evaluate_counter(_states({"input_number.odo": 60001}), cfg, ["input_number.odo"])
    assert reached.active is True


def test_counter_unavailable_entity_counts_as_not_reached() -> None:
    r = evaluate_counter(
        _states({"input_number.odo": "unknown"}),
        {"trigger_target_value": 10},
        ["input_number.odo"],
    )
    assert r.current_value is None
    assert r.active is False


def test_counter_delta_without_baseline_is_inactive() -> None:
    r = evaluate_counter(
        _states({"input_number.odo": 99999}),
        {"trigger_target_value": 100, "trigger_delta_mode": True},
        ["input_number.odo"],
    )
    assert r.active is False


# ─── state_change ────────────────────────────────────────────────────────


def test_state_change_surfaces_persisted_count() -> None:
    r = evaluate_state_change(
        {
            "trigger_target_changes": 20,
            "_trigger_state": {"input_boolean.washer": {"change_count": 6}},
        },
        ["input_boolean.washer"],
    )
    assert r.current_value == 6.0
    assert r.active is False


def test_state_change_legacy_flat_count_and_activation() -> None:
    r = evaluate_state_change(
        {"trigger_target_changes": 5, "trigger_change_count": 7},
        ["input_boolean.washer"],
    )
    assert r.current_value == 7.0
    assert r.active is True


def test_state_change_without_any_count_reports_nothing() -> None:
    r = evaluate_state_change({"trigger_target_changes": 5}, ["input_boolean.x"])
    assert r.current_value is None
    assert r.active is None


# ─── runtime ─────────────────────────────────────────────────────────────


def test_runtime_accumulated_hours() -> None:
    r = evaluate_runtime(
        {
            "trigger_runtime_hours": 500,
            "_trigger_state": {"input_boolean.comp": {"accumulated_seconds": 400 * 3600, "on_since": None}},
        },
        ["input_boolean.comp"],
    )
    assert r.current_value == 400.0
    assert r.active is False


def test_runtime_skips_entities_without_persisted_seconds() -> None:
    r = evaluate_runtime(
        {
            "trigger_runtime_hours": 5,
            "_trigger_state": {
                "input_boolean.a": {},  # no accumulated_seconds yet
                "input_boolean.b": {"accumulated_seconds": 2 * 3600},
            },
        },
        ["input_boolean.a", "input_boolean.b"],
    )
    assert r.current_value == 2.0


def test_runtime_includes_live_on_time() -> None:
    on_since = (dt_util.utcnow() - timedelta(hours=2)).isoformat()
    r = evaluate_runtime(
        {
            "trigger_runtime_hours": 10,
            "_trigger_state": {
                "input_boolean.comp": {
                    "accumulated_seconds": 9 * 3600,
                    "on_since": on_since,
                }
            },
        },
        ["input_boolean.comp"],
    )
    # 9h persisted + ~2h live = ~11h ≥ 10h target
    assert r.current_value is not None and r.current_value >= 10.9
    assert r.active is True


def test_runtime_naive_on_since_does_not_raise() -> None:
    """L2: a legacy/imported NAIVE on_since (no tzinfo) must be treated as UTC,
    not raise a TypeError on the utcnow()-minus subtraction."""
    on_since = (dt_util.utcnow() - timedelta(hours=3)).replace(tzinfo=None).isoformat()
    assert "+" not in on_since and "Z" not in on_since  # naive
    r = evaluate_runtime(
        {
            "trigger_runtime_hours": 10,
            "_trigger_state": {
                "input_boolean.comp": {
                    "accumulated_seconds": 8 * 3600,
                    "on_since": on_since,
                }
            },
        },
        ["input_boolean.comp"],
    )
    # 8h persisted + ~3h live ≈ 11h ≥ 10h — and crucially, no exception.
    assert r.current_value is not None and r.current_value >= 10.9
    assert r.active is True


# ─── threshold_exceeds (shared predicate: event path + fallback) ─────────


def test_threshold_exceeds_equals_and_not_equals() -> None:
    assert threshold_exceeds(3.0, above=None, below=None, equals=3.0) is True
    assert threshold_exceeds(3.0000000001, above=None, below=None, equals=3.0) is True
    assert threshold_exceeds(2.0, above=None, below=None, equals=3.0) is False
    assert threshold_exceeds(2.0, above=None, below=None, not_equals=3.0) is True
    assert threshold_exceeds(3.0, above=None, below=None, not_equals=3.0) is False
    # Combined with above/below: any configured limit may fire
    assert threshold_exceeds(3.0, above=10.0, below=None, equals=3.0) is True
    assert threshold_exceeds(11.0, above=10.0, below=None, equals=3.0) is True


def test_fallback_threshold_equals_activates() -> None:
    r = evaluate_threshold(
        _states({"sensor.filter_level": 3}),
        {"trigger_equals": 3.0},
        ["sensor.filter_level"],
    )
    assert r.current_value == 3.0
    assert r.active is True


def test_fallback_threshold_not_equals_activates() -> None:
    r = evaluate_threshold(
        _states({"sensor.mode": 2}),
        {"trigger_not_equals": 1.0},
        ["sensor.mode"],
    )
    assert r.active is True
    r2 = evaluate_threshold(
        _states({"sensor.mode": 1}),
        {"trigger_not_equals": 1.0},
        ["sensor.mode"],
    )
    assert r2.active is False


# ─── Boundary pins (2026-08 mutation-testing pilot) ─────────────────────────
# Every case below is a mutant that SURVIVED the first mutation run: the
# comparison boundaries (value == limit) and clamp/rounding behaviour were
# executed by the suite but never asserted.


def test_threshold_exceeds_boundaries_are_exclusive() -> None:
    """above/below are strict: AT the limit is not "exceeded"."""
    assert threshold_exceeds(80.0, above=80.0, below=None) is False
    assert threshold_exceeds(80.5, above=80.0, below=None) is True
    assert threshold_exceeds(20.0, above=None, below=20.0) is False
    assert threshold_exceeds(19.5, above=None, below=20.0) is True


def test_threshold_fallback_with_no_entities_is_inactive() -> None:
    r = evaluate_threshold(_states({}), {"trigger_above": 1.0}, [])
    assert r.active is False
    assert r.current_value is None


def test_counter_boundary_at_exact_target() -> None:
    """value == target counts as reached (inclusive), absolute and delta."""
    r = evaluate_counter(_states({"sensor.c": 100}), {"trigger_target_value": 100}, ["sensor.c"])
    assert r.active is True
    r2 = evaluate_counter(
        _states({"sensor.c": 140}),
        {"trigger_target_value": 100, "trigger_delta_mode": True,
         "_trigger_state": {"sensor.c": {"baseline_value": 40}}},
        ["sensor.c"],
    )
    assert r2.active is True


def test_state_change_boundary_at_exact_target() -> None:
    r = evaluate_state_change(
        {"trigger_target_changes": 30, "_trigger_state": {"sensor.s": {"change_count": 30}}},
        ["sensor.s"],
    )
    assert r.active is True
    assert r.current_value == 30.0


def test_runtime_boundary_at_exact_target_hours() -> None:
    r = evaluate_runtime(
        {"trigger_runtime_hours": 2, "_trigger_state": {"sensor.r": {"accumulated_seconds": 7200}}},
        ["sensor.r"],
    )
    assert r.active is True
    assert r.current_value == 2.0


def test_runtime_future_on_since_clamps_to_zero() -> None:
    """A clock-skewed on_since in the future must not SUBTRACT runtime."""
    future = (dt_util.utcnow() + timedelta(hours=3)).isoformat()
    r = evaluate_runtime(
        {"trigger_runtime_hours": 100,
         "_trigger_state": {"sensor.r": {"accumulated_seconds": 3600, "on_since": future}}},
        ["sensor.r"],
    )
    assert r.current_value == 1.0  # clamped: accumulated only, not negative


def test_runtime_hours_rounded_to_two_decimals() -> None:
    r = evaluate_runtime(
        {"trigger_runtime_hours": 100, "_trigger_state": {"sensor.r": {"accumulated_seconds": 4444}}},
        ["sensor.r"],
    )
    assert r.current_value == 1.23  # 4444/3600 = 1.2344...


def test_aggregate_modes_diverge_on_mixed_states() -> None:
    """all vs any must actually differ when entities disagree."""
    states = _states({"sensor.a": 25, "sensor.b": 5})
    cfg_any = {"trigger_above": 10.0, "entity_logic": "any"}
    cfg_all = {"trigger_above": 10.0, "entity_logic": "all"}
    assert evaluate_threshold(states, cfg_any, ["sensor.a", "sensor.b"]).active is True
    assert evaluate_threshold(states, cfg_all, ["sensor.a", "sensor.b"]).active is False


def test_unreadable_entity_first_does_not_stop_the_loop() -> None:
    """cosmic-ray finding: continue->break survived — an unreadable entity
    BEFORE a readable one must not cut evaluation short, for any type."""
    # threshold: first unavailable, second over the limit -> active
    r = evaluate_threshold(
        _states({"sensor.b": 99}),  # sensor.a unknown to the getter
        {"trigger_above": 50.0},
        ["sensor.a", "sensor.b"],
    )
    assert r.active is True
    assert r.current_value == 99.0

    # counter: first unreadable, second at target
    r = evaluate_counter(
        _states({"sensor.b": 100}),
        {"trigger_target_value": 100},
        ["sensor.a", "sensor.b"],
    )
    assert r.active is True

    # state_change: first entity has no persisted count, second is at target
    r = evaluate_state_change(
        {"trigger_target_changes": 5, "_trigger_state": {"sensor.b": {"change_count": 5}}},
        ["sensor.a", "sensor.b"],
    )
    assert r.active is True
    assert r.current_value == 5.0

    # runtime: first entity has no accumulated state, second is at target
    r = evaluate_runtime(
        {"trigger_runtime_hours": 1, "_trigger_state": {"sensor.b": {"accumulated_seconds": 3600}}},
        ["sensor.a", "sensor.b"],
    )
    assert r.active is True
    assert r.current_value == 1.0
