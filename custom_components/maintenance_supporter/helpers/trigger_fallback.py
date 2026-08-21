"""Per-type trigger fallback evaluators for the coordinator refresh.

The event-driven triggers (entity/triggers/) are the primary evaluation with
their timers and persistence; this module is the *refresh-time* fallback that
keeps `_trigger_current_value` / `_trigger_active` correct even when an event
was missed — and, for the accumulator types, makes the progress visible at all
(run counts / runtime hours live in persisted trigger state, not in an entity).

Each evaluator is a pure function of the trigger config (plus a state lookup
where the type reads live entities), returning a :class:`FallbackResult` the
coordinator applies. Extracted from five near-identical inline branches so
every rule is individually testable.
"""

from __future__ import annotations

import math
from collections.abc import Callable
from dataclasses import dataclass
from typing import TYPE_CHECKING, Any

from homeassistant.util import dt as dt_util

from ..const import UNAVAILABLE_STATES

if TYPE_CHECKING:
    from homeassistant.core import State

# A state lookup — hass.states.get, injected so the evaluators stay pure.
StateGetter = Callable[[str], "State | None"]


@dataclass(slots=True)  # pragma: no mutate (slots is memory, not behaviour)
class FallbackResult:
    """What a fallback evaluation learned.

    ``current_value`` is None when nothing could be read (leave the previous
    value); ``active`` is None when the fallback must not touch the
    event-driven trigger state (e.g. a pending for_minutes timer).
    """

    current_value: float | None = None
    active: bool | None = None


def _aggregate(per_entity: list[bool], entity_logic: str) -> bool:
    return all(per_entity) if entity_logic == "all" else any(per_entity)


def threshold_exceeds(
    value: float,
    *,
    above: float | None,
    below: float | None,
    equals: float | None = None,
    not_equals: float | None = None,
) -> bool:
    """Whether *value* violates any configured threshold limit.

    The single predicate shared by the event-driven ThresholdTrigger and the
    refresh-time fallback below — keep both surfaces on this one rule.
    Equality uses ``math.isclose`` so float round-trips (state strings, JSON)
    can't miss a discrete level like 3.0.
    """
    if above is not None and value > above:
        return True
    if below is not None and value < below:
        return True
    if equals is not None and math.isclose(value, equals, rel_tol=1e-9, abs_tol=1e-9):
        return True
    return not_equals is not None and not math.isclose(value, not_equals, rel_tol=1e-9, abs_tol=1e-9)


def _numeric_entity_value(get_state: StateGetter, entity_id: str, attribute: str | None) -> float | None:
    """Read a numeric value from an entity state/attribute (None when unusable)."""
    state = get_state(entity_id)
    if state is None or state.state in UNAVAILABLE_STATES:
        return None
    try:
        raw = state.attributes.get(attribute) if attribute else state.state
        if raw is None:
            return None
        return float(raw)
    except (ValueError, TypeError):
        return None


def evaluate_threshold(
    get_state: StateGetter,
    trigger_config: dict[str, Any],
    entity_ids: list[str],
) -> FallbackResult:
    """Threshold: value above/below a limit; for_minutes only ever deactivates."""
    attribute = trigger_config.get("attribute")
    entity_logic = trigger_config.get("entity_logic", "any")
    for_minutes = trigger_config.get("trigger_for_minutes", 0)
    above = trigger_config.get("trigger_above")
    below = trigger_config.get("trigger_below")
    equals = trigger_config.get("trigger_equals")
    not_equals = trigger_config.get("trigger_not_equals")

    per_entity: list[bool] = []
    last_value: float | None = None
    for eid in entity_ids:
        value = _numeric_entity_value(get_state, eid, attribute)
        if value is None:
            per_entity.append(False)
            continue
        last_value = value
        per_entity.append(threshold_exceeds(value, above=above, below=below, equals=equals, not_equals=not_equals))

    aggregated = _aggregate(per_entity, entity_logic) if per_entity else False

    active: bool | None
    if for_minutes == 0:
        active = aggregated
    elif not aggregated and last_value is not None:
        # Back in the normal range — safe to deactivate even with for_minutes.
        active = False
    else:
        # for_minutes pending — leave the event-driven timer in charge.
        active = None

    return FallbackResult(current_value=last_value, active=active)


def evaluate_counter(
    get_state: StateGetter,
    trigger_config: dict[str, Any],
    entity_ids: list[str],
) -> FallbackResult:
    """Counter: value (or delta from a per-entity baseline) reaches a target."""
    attribute = trigger_config.get("attribute")
    entity_logic = trigger_config.get("entity_logic", "any")
    target = trigger_config.get("trigger_target_value", 0)  # pragma: no mutate (WS-required; default only guards hand-edited data)
    delta_mode = trigger_config.get("trigger_delta_mode", False)
    trigger_state = trigger_config.get("_trigger_state", {})

    per_entity: list[bool] = []
    last_value: float | None = None
    for eid in entity_ids:
        value = _numeric_entity_value(get_state, eid, attribute)
        if value is None:
            per_entity.append(False)
            continue
        last_value = value
        if delta_mode:
            baseline = trigger_state.get(eid, {}).get("baseline_value")
            if baseline is None:
                baseline = trigger_config.get("trigger_baseline_value")
            per_entity.append(baseline is not None and (value - baseline) >= target)
        else:
            per_entity.append(value >= target)

    active = _aggregate(per_entity, entity_logic) if per_entity else None
    return FallbackResult(current_value=last_value, active=active)


def evaluate_state_change(
    trigger_config: dict[str, Any],
    entity_ids: list[str],
) -> FallbackResult:
    """State change: surface the persisted transition count (forum #16).

    Counting stays event-driven; the fallback only reads what the trigger
    persisted so the run count (and the progress header) is visible before
    the target fires.
    """
    trigger_state = trigger_config.get("_trigger_state", {})
    target_changes = trigger_config.get("trigger_target_changes")
    entity_logic = trigger_config.get("entity_logic", "any")

    per_entity: list[bool] = []
    best_count: float | None = None
    for eid in entity_ids:
        cc = trigger_state.get(eid, {}).get("change_count")
        if cc is None:
            # Legacy flat storage
            cc = trigger_config.get("trigger_change_count")
        if cc is None:
            continue
        count = float(cc)
        best_count = count if best_count is None else max(best_count, count)
        if target_changes:
            per_entity.append(count >= target_changes)

    active = _aggregate(per_entity, entity_logic) if per_entity else None
    return FallbackResult(current_value=best_count, active=active)


def evaluate_runtime(
    trigger_config: dict[str, Any],
    entity_ids: list[str],
) -> FallbackResult:
    """Runtime: reconstruct accumulated hours (+ live on-time while running)."""
    trigger_state = trigger_config.get("_trigger_state", {})
    target_hours = trigger_config.get("trigger_runtime_hours")
    entity_logic = trigger_config.get("entity_logic", "any")

    per_entity: list[bool] = []
    best_hours: float | None = None
    for eid in entity_ids:
        es = trigger_state.get(eid, {})
        seconds = es.get("accumulated_seconds")
        if seconds is None:
            continue
        total = float(seconds)
        on_since = es.get("on_since")
        if on_since:
            on_dt = dt_util.parse_datetime(on_since)
            if on_dt is not None:
                # Older payloads may be naive — assume UTC (live writes are
                # TZ-aware) so the subtraction below can't raise. Mirrors
                # threshold.py's exceeded_since handling.
                if on_dt.tzinfo is None:
                    from datetime import UTC

                    on_dt = on_dt.replace(tzinfo=UTC)
                total += max(0.0, (dt_util.utcnow() - on_dt).total_seconds())  # pragma: no mutate (a 1s floor shift vanishes in the 2-decimal rounding)
        hours = total / 3600.0
        best_hours = hours if best_hours is None else max(best_hours, hours)
        if target_hours:
            per_entity.append(hours >= target_hours)

    active = _aggregate(per_entity, entity_logic) if per_entity else None
    return FallbackResult(
        current_value=round(best_hours, 2) if best_hours is not None else None,
        active=active,
    )
