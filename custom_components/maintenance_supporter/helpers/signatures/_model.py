"""Verified maintenance entity signatures of popular integrations (roadmap).

Popular integrations expose consumable/wear entities that map 1:1 onto
maintenance tasks — a Roborock reports *filter time left*, a Brother printer
its *drum remaining life*. This catalog lets discovery propose a maintenance
object **with sensor-based triggers pre-wired** instead of bare calendar
intervals.

METHOD CONTRACT: every signature is verified against the integration's actual
source code — the ``source`` field records where, ``verified`` records when and
against which ref. Evaluation follows the direct→derived ladder in
docs/design/signature-evaluation-scheme.md: inventory ALL entity platforms,
then direct signals (percent/countdown/resettable counter/event), then derived
(lifetime counters via delta, attributes), then engine-derived (runtime on
state entities) — a negative verdict only after all rungs.
Matching uses the entity registry's ``translation_key`` (the stable id from the
integration's EntityDescription, immune to renames) with an entity_id-suffix
fallback for custom integrations that don't set one.

Direction semantics:
* ``duration_left``  — countdown to the next replacement (device_class
  duration). Trigger: below N hours, converted into the entity's display unit.
* ``percent_left``   — remaining life/level in percent. Trigger: below N %.
* ``usage_above``    — a wear counter that counts UP since the device's own
  last reset (blade usage time, tub-clean cycles). Trigger: a delta counter
  from an explicit 0 baseline — absolute semantics at adoption, but a manual
  completion re-baselines instead of immediately re-firing, and a device-side
  reset both re-baselines (rollover handling) and auto-completes the task.
* ``event_present``  — an ENUM *event* sensor (no unit) that reports an
  actionable maintenance state (``present``) vs. ``off``/``confirmed`` — Home
  Connect salt/rinse-aid/descale/clean events. Trigger: a state_change latch on
  ``present`` (not a numeric threshold); the task auto-completes when the event
  clears. The appliance emitting the clearing event is required for auto-resolve
  — otherwise the task waits for a manual completion.
* ``usage_delta``    — a LIFETIME counter with no reset anywhere (printer
  usage hours, burner hours, car odometer). Trigger: a counter trigger in
  delta mode — fires every N canonical units (hours for operating-time
  counters, kilometres for odometers) of accumulated use since the task was
  last completed; completing the task re-baselines the counter. No
  auto_complete_on_recovery (a lifetime counter never recovers).
* ``runtime_hours``  — the integration exposes NO usage counter at all, only a
  STATE entity (a ``lawn_mower`` reporting ``mowing``). The ENGINE accumulates
  the time spent in the given states itself (runtime trigger: persisted every
  5 min, restart-safe, paused while unavailable) and fires after N accumulated
  hours; completing the task resets the accumulation. Signatures of this
  direction set ``entity_domain``/``on_states`` and may leave ``keys`` empty —
  meaning "the device's single entity of that domain".
* ``alert_above``    — a MEASUREMENT that signals a maintenance condition
  while it is high (AMS humidity → desiccant saturated). Trigger: plain
  threshold above N in the entity's own unit (no conversion); performing the
  maintenance genuinely lowers the value, so auto_complete_on_recovery is
  correct here — unlike wear counters, where a plain above-threshold would
  re-fire after a manual completion.
* ``value_below``    — the mirror image: a MEASUREMENT that signals the
  condition while LOW (heating-loop pressure → refill water). Plain threshold
  below N in the entity's own unit; the maintenance raises the value back.
* ``cycle_count``    — the ENGINE counts state transitions itself: a lock has
  no wear sensor, but every transition to ``locked`` is one mechanical cycle.
  state_change trigger with ``trigger_target_changes = N``; completing the
  task resets the counter. No auto-complete (cycles don't recover).
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

# Hours a duration-countdown may still hold when the task should trigger.
_DEFAULT_BELOW_HOURS = 24
# Usage-hours a wear counter may accumulate before the task should trigger.
_DEFAULT_ABOVE_HOURS = 100
# Canonical units between services for lifetime counters (usage_delta mode):
# hours for operating-time counters, kilometres for odometers.
_DEFAULT_DELTA_UNITS = 500
# Percent floor for percent-remaining consumables (ink, toner, drum, brush %).
_DEFAULT_BELOW_PERCENT = 10


@dataclass(frozen=True)
class ConsumableSignature:
    """One maintenance task backed by 1..n verified consumable entities."""

    keys: tuple[str, ...]  # translation_key values (also matched as _<key> entity-id suffix)
    task_name: str  # EN task name; localized through templates_i18n
    direction: str  # duration_left | percent_left | usage_above | event_present | usage_delta | runtime_hours
    below_hours: int = _DEFAULT_BELOW_HOURS
    below_percent: int = _DEFAULT_BELOW_PERCENT
    above_hours: int = _DEFAULT_ABOVE_HOURS
    delta_units: int = _DEFAULT_DELTA_UNITS
    # runtime_hours signatures target a non-sensor STATE entity; empty keys
    # then mean "the device's single entity of this domain".
    entity_domain: str = "sensor"
    on_states: tuple[str, ...] = ()
    # runtime signatures may track an ATTRIBUTE instead of the state — a
    # climate entity's hvac_action says whether it actually conditions.
    attribute: str = ""
    # Device-type gates. Some integrations reuse one entity key across ALL
    # appliance types (Miele's status sensor) — require_sibling_keys restricts
    # the signature to devices that ALSO carry a type-identifying entity
    # (a washer has twin_dos/spin_speed). models gates on the device
    # registry's model string (case-insensitive substring — Bambu X1C vs A1).
    require_sibling_keys: tuple[str, ...] = ()
    models: tuple[str, ...] = ()
    # Substring exclusion applied AFTER models: ("AMS",) matches "AMS Lite"
    # too, so the desiccant duty excludes it explicitly (the Lite has no
    # desiccant compartment).
    models_exclude: tuple[str, ...] = ()


@dataclass(frozen=True)
class IntegrationSignature:
    """All verified signatures of one integration domain."""

    name: str  # human-readable integration name
    source: str  # where the entity keys were verified
    # When and against which ref the source was read (branch head at that
    # date, not a pinned commit) — the audit trail for "verified against what".
    verified: str = ""
    tasks: tuple[ConsumableSignature, ...] = field(default_factory=tuple)


def task_name_variants(task_name: str) -> set[str]:
    """The EN signature task name plus all its localizations, lowercased —
    used to recognise an equivalent EXISTING task on the target object
    regardless of the language it was created in."""
    from ...templates_i18n import _T

    variants = {task_name.lower()}
    variants.update(v.lower() for v in _T.get(task_name, {}).values())
    return variants


def _entity_matches(entry: er.RegistryEntry, key: str) -> bool:
    """translation_key match, with an entity_id-suffix fallback for custom
    integrations that don't set translation_key on their descriptions.

    Third pattern: xiaomi_home embeds the MIoT property name mid-entity_id with
    a ``_p_{siid}_{piid}`` tail (``..._filter_life_level_p_4_1``) and sets no
    translation_key — matched via the distinctive ``_<key>_p_`` infix. Matching
    is already scoped to the signature's integration (entry.platform), so this
    cannot bleed across integrations."""
    if entry.translation_key == key:
        return True
    if entry.entity_id.endswith(f"_{key}"):
        return True
    if f"_{key}_p_" in entry.entity_id:
        return True
    # Fourth pattern: integrations that name entities WITHOUT a device prefix
    # (bosch thermostat: ``sensor.system_pressure``) — exact object-id match.
    # Platform scoping keeps this from bleeding across integrations.
    return entry.entity_id.split(".", 1)[1] == key


def _entity_unit(hass: HomeAssistant, entry: er.RegistryEntry) -> str | None:
    """The entity's live display unit, falling back to the registry unit."""
    state = hass.states.get(entry.entity_id)
    if state and (unit := state.attributes.get("unit_of_measurement")):
        return str(unit)
    reg_unit = entry.unit_of_measurement
    return str(reg_unit) if reg_unit is not None else None


def _unit_compatible(direction: str, unit: str | None) -> bool:
    """Whether an entity's unit fits a signature's direction.

    Some integrations (LG ThinQ) reuse ONE translation_key for both an
    hours-remaining and a percent-remaining sensor; the key alone can't say
    which direction applies. A concrete unit disambiguates: percent_left wants
    ``%``; the duration/counter directions want anything else. The check is
    lenient — a missing unit (disabled/just-added entity) never rejects a
    key match, so existing single-shape signatures are unaffected. The one
    strict case is ``event_present``: ENUM event sensors carry no unit, so a
    unit-bearing entity that happens to share the key is NOT an event."""
    if direction in ("event_present", "runtime_hours", "cycle_count"):
        return unit is None  # ENUM events and state entities carry no unit
    if direction in ("alert_above", "value_below"):
        return True  # measurement alert in the entity's own unit (any unit)
    if unit is None:
        return True
    if direction == "percent_left":
        return unit == "%"
    return unit != "%"


def _threshold_for(sig: ConsumableSignature, hass: HomeAssistant, entity_id: str) -> float:
    """The trigger threshold in the entity's CURRENT display unit.

    Duration values are stored in the signature as hours; HA may present the
    state in s/min/h/d depending on the entity's unit settings.
    """
    if sig.direction == "event_present":
        return 0.0  # ENUM event latch — no numeric threshold
    if sig.direction in ("runtime_hours", "alert_above", "value_below", "cycle_count"):
        # Engine-accumulated hours resp. a raw measurement threshold in the
        # entity's own unit — no conversion in either case.
        return float(sig.delta_units)
    if sig.direction == "percent_left":
        return float(sig.below_percent)
    state = hass.states.get(entity_id)
    unit = (state.attributes.get("unit_of_measurement") if state else None) or "h"
    # Canonical → display unit: time counters are stored in hours, odometers in
    # kilometres; the entity may display s/min/d resp. miles.
    factor = {
        "s": 3600.0,
        "min": 60.0,
        "h": 1.0,
        "d": 1 / 24,
        "km": 1.0,
        "mi": 0.62137,
        # energy counters are canonical in kWh (wallbox cable inspection)
        "Wh": 1000.0,
        "kWh": 1.0,
        "MWh": 0.001,
    }.get(unit, 1.0)
    hours = {
        "usage_above": sig.above_hours,
        "usage_delta": sig.delta_units,
    }.get(sig.direction, sig.below_hours)
    return round(hours * factor, 3)


def build_setup_trigger(sig: ConsumableSignature, hass: HomeAssistant, entity_ids: list[str]) -> dict[str, Any]:
    """A pre-wired trigger for one signature's matched entities.

    Numeric signatures build a threshold trigger with ``entity_logic: any``
    (any low consumable triggers) and auto-complete on recovery — replacing the
    consumable resets the countdown/percentage (or, for ``usage_above`` wear
    counters, resetting the counter drops it back below the threshold), which
    resolves the task just like a cleared problem sensor.

    ``event_present`` signatures build a single-entity state-change LATCH on the
    ``present`` state (Home Connect salt/rinse-aid/descale/clean events): the
    task activates while the event is present and auto-completes when the
    appliance clears it (to ``off``/``confirmed``).
    """
    if sig.direction == "event_present":
        return {
            "type": "state_change",
            "entity_id": entity_ids[0],  # state latch watches a single entity
            "entity_ids": list(entity_ids),
            # Home Connect events use "present"; other integrations latch on
            # their own alert state (Dolphin filter bag: "full").
            "trigger_to_state": sig.on_states[0] if sig.on_states else "present",
            "trigger_target_changes": 1,
            "auto_complete_on_recovery": True,
        }
    if sig.direction == "cycle_count":
        # Engine-counted mechanical cycles: every transition into on_states[0]
        # increments; the task fires at N and completing it resets the count.
        return {
            "type": "state_change",
            "entity_id": entity_ids[0],
            "entity_ids": list(entity_ids),
            "trigger_to_state": sig.on_states[0],
            "trigger_target_changes": int(_threshold_for(sig, hass, entity_ids[0])),
        }
    if sig.direction == "runtime_hours":
        # The engine accumulates the time the entity spends in on_states
        # itself (no integration counter needed); completing the task resets
        # the accumulation.
        runtime_trigger: dict[str, Any] = {
            "type": "runtime",
            "entity_id": entity_ids[0],
            "entity_ids": list(entity_ids),
            "trigger_on_states": list(sig.on_states) or ["on"],
            "trigger_runtime_hours": _threshold_for(sig, hass, entity_ids[0]),
        }
        if sig.attribute:
            runtime_trigger["attribute"] = sig.attribute
        return runtime_trigger
    if sig.direction in ("usage_delta", "usage_above"):
        # Counter trigger in delta mode for both wear-counter flavours — a
        # plain trigger_above threshold would re-fire immediately after a
        # manual completion (the counter is still past the mark), whereas the
        # delta baseline moves on completion.
        # * usage_delta (lifetime counter): baseline = current value at setup;
        #   the task is due every N units from the adoption/completion point.
        # * usage_above (counts since the device's own reset): explicit 0
        #   baseline keeps absolute semantics at adoption (80 h old blades are
        #   80 h old), manual completion re-baselines, and a device-side reset
        #   drops the value below the baseline — the rollover handling
        #   re-baselines and the deactivation auto-completes the task.
        trigger: dict[str, Any] = {
            "type": "counter",
            "entity_id": entity_ids[0],  # counter watches a single entity
            "entity_ids": list(entity_ids),
            "trigger_delta_mode": True,
            "trigger_target_value": _threshold_for(sig, hass, entity_ids[0]),
        }
        if sig.direction == "usage_above":
            trigger["trigger_baseline_value"] = 0
            trigger["auto_complete_on_recovery"] = True
        return trigger
    threshold_key = (
        "trigger_above" if sig.direction == "alert_above" else "trigger_below"
    )  # value_below + consumables use trigger_below
    return {
        "type": "threshold",
        "entity_ids": list(entity_ids),
        threshold_key: _threshold_for(sig, hass, entity_ids[0]),
        "entity_logic": "any",
        "auto_complete_on_recovery": True,
    }
