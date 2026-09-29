"""A device that satisfies one catalog signature — built from the signature
itself, so every signature of the catalog can be driven through discovery,
adoption, its trigger and the reset of its counter
(tests/test_catalog_adoption_sweep.py) and an adopted object can ride in the
migration seed (tests/test_migration_roundtrip.py).

The shape follows the signature: the entity domain and translation key it
matches, a unit its direction accepts, the device model its gate names, a
sibling entity its type gate needs, the appliance type its integration
names, and the reset button it wires.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.helpers.signatures import SIGNATURES


@dataclass
class SeededDevice:
    domain: str
    signature: Any
    device_id: str
    entity_id: str
    button_entity_id: str | None
    # What makes the trigger fire, step by step: ("state", value) sets the
    # entity, ("tick", hours) moves the clock (runtime hours need time to pass).
    firing_steps: list[tuple[str, Any]] = field(default_factory=list)


def _unit(direction: str) -> str | None:
    return {
        "duration_left": "h",
        "usage_above": "h",
        "usage_delta": "km",
        "percent_left": "%",
        "alert_above": "bar",
        "value_below": "bar",
    }.get(direction)


# A cycle counter fires after this many transitions in the sweep; the
# catalog's own count (hundreds of lock cycles) is asserted on the trigger.
SWEEP_CYCLES = 3


def _healthy_and_firing(sig: Any) -> tuple[str, list[tuple[str, Any]]]:
    """(the state while all is well, the steps that fire the trigger)."""
    d = sig.direction
    if d == "duration_left":
        return str(sig.below_hours * 10 + 100), [("state", "0")]
    if d == "percent_left":
        return "90", [("state", "0")]
    if d == "usage_above":
        return "1", [("state", str(sig.above_hours + 1))]
    if d == "usage_delta":
        return "100", [("state", str(100 + sig.delta_units + 1))]
    if d == "alert_above":
        return str(sig.delta_units - 1), [("state", str(sig.delta_units + 1))]
    if d == "value_below":
        return str(sig.delta_units + 100), [("state", str(sig.delta_units - 1))]
    if d == "event_present":
        if sig.ok_state:
            return sig.ok_state, [("state", "alert_for_test")]
        return "off", [("state", sig.on_states[0] if sig.on_states else "present")]
    if d == "cycle_count":
        on = sig.on_states[0]
        return "idle_for_test", [step for _ in range(SWEEP_CYCLES) for step in (("state", on), ("state", "idle_for_test"))]
    # runtime_hours: on, let the hours pass, off (the trigger adds the span).
    on = sig.on_states[0] if sig.on_states else "on"
    idle = "idle" if sig.attribute else "off"
    return idle, [("state", on), ("tick", float(sig.delta_units) + 1), ("state", idle)]


def source_entry(hass: HomeAssistant, domain: str) -> MockConfigEntry:
    """The integration's own config entry (carries the appliance type the
    signature's integration names, if any)."""
    catalog = SIGNATURES[domain]
    options: dict[str, Any] = {}
    if catalog.appliance_type_key:
        options[catalog.appliance_type_key] = "appliance_for_test"
    entry = MockConfigEntry(domain=domain, title=domain, options=options)
    entry.add_to_hass(hass)
    return entry


def seed_device(hass: HomeAssistant, source: MockConfigEntry, domain: str, sig: Any, index: int) -> SeededDevice:
    """One device carrying exactly what ``sig`` needs to be proposed."""
    uid = f"{domain}_{index}"
    # A distinct model per device keeps the duplicate matcher from treating
    # the devices of one integration as the same appliance.
    model = sig.models[0] if sig.models else f"Model {index} for test"
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=source.entry_id, identifiers={(domain, uid)}, name=f"{domain} device {index}", model=model
    )
    ent_reg = er.async_get(hass)

    def entity(platform: str, key: str | None, object_id: str) -> er.RegistryEntry:
        return ent_reg.async_get_or_create(
            platform,
            domain,
            f"{uid}_{object_id}",
            config_entry=source,
            device_id=device.id,
            translation_key=key,
            suggested_object_id=object_id,
        )

    # The key to seed: the one a reset pairs with, when the duty has one.
    key: str | None = sig.keys[0] if sig.keys else None
    reset_button_key: str | None = None
    for sensor_key, button_key in sig.resets:
        if not sig.keys or sensor_key in sig.keys:
            key, reset_button_key = sensor_key, button_key
            break
    main = entity(sig.entity_domain, key, f"{uid}_{key or sig.entity_domain}")
    healthy, firing = _healthy_and_firing(sig)
    attrs: dict[str, Any] = {}
    if (unit := _unit(sig.direction)) is not None:
        attrs["unit_of_measurement"] = unit
    if sig.attribute:
        attrs[sig.attribute] = healthy
        hass.states.async_set(main.entity_id, "heat", attrs)
    else:
        hass.states.async_set(main.entity_id, healthy, attrs)

    for sibling in sig.require_sibling_keys[:1]:
        sib = entity("sensor", sibling, f"{uid}_{sibling}")
        hass.states.async_set(sib.entity_id, "1")

    button_id = None
    if reset_button_key is not None:
        button = entity("button", reset_button_key, f"{uid}_{reset_button_key}")
        hass.states.async_set(button.entity_id, "unknown")
        button_id = button.entity_id
    return SeededDevice(domain, sig, device.id, main.entity_id, button_id, firing)


async def fire(hass: HomeAssistant, seeded: SeededDevice, freezer: Any) -> None:
    """Drive the entity through the steps that fire its task's trigger."""
    from datetime import timedelta

    state = hass.states.get(seeded.entity_id)
    attrs = dict(state.attributes) if state else {}
    for kind, value in seeded.firing_steps:
        if kind == "tick":
            freezer.tick(timedelta(hours=value))
        elif seeded.signature.attribute:
            hass.states.async_set(seeded.entity_id, "heat", {**attrs, seeded.signature.attribute: value})
        else:
            hass.states.async_set(seeded.entity_id, value, attrs)
        await hass.async_block_till_done()
