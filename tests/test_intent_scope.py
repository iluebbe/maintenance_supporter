"""Intents that know WHO is asking and WHICH ROOM they are in.

The six shipped intents read only `language` off the intent object. Home
Assistant also hands over the speaker (`context.user_id`), the device that
captured the speech (`device_id`) and, for voice satellites, the satellite
entity (`satellite_id`) — which is the difference between "here is everything
in the house" and the answer the person actually asked for.

The room case is not only convenience. Completion by voice writes real history
through the coordinator, so resolving "complete the filter change" to the wrong
object is a real wrong entry in someone's maintenance log.
"""

from __future__ import annotations

from typing import Any

import pytest
import voluptuous as vol
from homeassistant.core import Context, HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers import intent
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.intent import (
    INTENT_COMPLETE_TASK,
    INTENT_LIST_TASKS,
    async_setup_intents,
)

from .conftest import (
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)

TASK_ID = "task_1"


@pytest.fixture(autouse=True)
async def _intents_registered(hass: HomeAssistant):
    """Register the handlers; without this every call raises UnknownIntent."""
    await async_setup_intents(hass)


async def _global(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _object(
    hass: HomeAssistant,
    *,
    name: str,
    slug: str,
    task_name: str,
    area_id: str | None = None,
    responsible_user_id: str | None = None,
) -> MockConfigEntry:
    obj = build_object_data(name=name, object_id=slug)
    if area_id:
        obj["area_id"] = area_id
    task: dict[str, Any] = build_task_data(interval_days=30, last_performed="2020-01-01")
    task["name"] = task_name
    if responsible_user_id:
        task["responsible_user_id"] = responsible_user_id
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title=name,
        data=build_object_entry_data(object_data=obj, tasks={TASK_ID: task}),
        source="user",
        unique_id=f"maintenance_supporter_{slug}",
    )
    entry.add_to_hass(hass)
    return entry


async def _ask(
    hass: HomeAssistant,
    intent_type: str,
    slots: dict[str, Any] | None = None,
    *,
    user_id: str | None = None,
    device_id: str | None = None,
    satellite_id: str | None = None,
) -> intent.IntentResponse:
    return await intent.async_handle(
        hass,
        "test",
        intent_type,
        {k: {"value": v} for k, v in (slots or {}).items()},
        context=Context(user_id=user_id),
        device_id=device_id,
        satellite_id=satellite_id,
    )


def _speech(response: intent.IntentResponse) -> str:
    return str(response.speech.get("plain", {}).get("speech", ""))


# ─── scope: mine ──────────────────────────────────────────────────────────


async def test_my_tasks_are_the_ones_assigned_to_me(hass: HomeAssistant) -> None:
    alice = await hass.auth.async_create_user("Alice")
    bob = await hass.auth.async_create_user("Bob")
    g = await _global(hass)
    mine = _object(
        hass, name="Kitchen Sink", slug="sink", task_name="Descale",
        responsible_user_id=alice.id,
    )
    theirs = _object(
        hass, name="Garage Door", slug="garage", task_name="Grease Rails",
        responsible_user_id=bob.id,
    )
    await setup_integration(hass, g, mine, theirs)

    response = await _ask(hass, INTENT_LIST_TASKS, {"scope": "mine"}, user_id=alice.id)
    speech = _speech(response)

    assert "Descale" in speech
    assert "Grease Rails" not in speech, "answered with somebody else's chore"


async def test_an_unassigned_task_is_nobodys(hass: HomeAssistant) -> None:
    alice = await hass.auth.async_create_user("Alice")
    g = await _global(hass)
    obj = _object(hass, name="Boiler", slug="boiler", task_name="Service")
    await setup_integration(hass, g, obj)

    response = await _ask(hass, INTENT_LIST_TASKS, {"scope": "mine"}, user_id=alice.id)

    assert "Service" not in _speech(response)


async def test_an_anonymous_speaker_is_told_so_not_given_everything(
    hass: HomeAssistant,
) -> None:
    """The failure mode worth preventing: answering the whole house's list to
    "what do I need to do?" sounds like a correct answer."""
    g = await _global(hass)
    obj = _object(hass, name="Boiler", slug="boiler", task_name="Service")
    await setup_integration(hass, g, obj)

    response = await _ask(hass, INTENT_LIST_TASKS, {"scope": "mine"}, user_id=None)

    assert response.error_code is not None
    assert "Service" not in _speech(response)


async def test_the_rotation_duty_counts_as_mine(hass: HomeAssistant) -> None:
    """On a rotating chore, "mine" must follow whose turn it currently is."""
    alice = await hass.auth.async_create_user("Alice")
    bob = await hass.auth.async_create_user("Bob")
    g = await _global(hass)

    obj = build_object_data(name="Bin", object_id="bin")
    task = build_task_data(interval_days=7, last_performed="2020-01-01")
    task["name"] = "Take Out Bin"
    task["assignee_pool"] = [alice.id, bob.id]
    task["rotation_strategy"] = "round_robin"
    task["responsible_user_id"] = bob.id
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Bin",
        data=build_object_entry_data(object_data=obj, tasks={TASK_ID: task}),
        source="user", unique_id="maintenance_supporter_bin",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, g, entry)

    assert "Take Out Bin" in _speech(
        await _ask(hass, INTENT_LIST_TASKS, {"scope": "mine"}, user_id=bob.id)
    )
    assert "Take Out Bin" not in _speech(
        await _ask(hass, INTENT_LIST_TASKS, {"scope": "mine"}, user_id=alice.id)
    )


# ─── scope: here ──────────────────────────────────────────────────────────


async def _satellite_in(hass: HomeAssistant, area_name: str) -> tuple[str, str]:
    """A device + assist_satellite entity placed in *area_name*."""
    area = ar.async_get(hass).async_get_or_create(area_name)
    mock = MockConfigEntry(domain="mock_satellite", data={}, source="user")
    mock.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=mock.entry_id,
        identifiers={("mock_satellite", area_name)},
        name=f"{area_name} Speaker",
    )
    dr.async_get(hass).async_update_device(device.id, area_id=area.id)
    entity = er.async_get(hass).async_get_or_create(
        "assist_satellite", "mock_satellite", f"sat_{area_name}", device_id=device.id
    )
    return device.id, entity.entity_id


async def test_here_means_the_room_the_device_stands_in(hass: HomeAssistant) -> None:
    g = await _global(hass)
    kitchen = ar.async_get(hass).async_get_or_create("Kitchen")
    utility = ar.async_get(hass).async_get_or_create("Utility")
    in_kitchen = _object(
        hass, name="Coffee Machine", slug="coffee", task_name="Descale", area_id=kitchen.id
    )
    in_utility = _object(
        hass, name="Boiler", slug="boiler", task_name="Service", area_id=utility.id
    )
    await setup_integration(hass, g, in_kitchen, in_utility)

    device_id, _ = await _satellite_in(hass, "Kitchen")
    speech = _speech(
        await _ask(hass, INTENT_LIST_TASKS, {"scope": "here"}, device_id=device_id)
    )

    assert "Descale" in speech
    assert "Service" not in speech, "answered for the wrong room"


async def test_the_satellite_entity_resolves_the_room_too(hass: HomeAssistant) -> None:
    """Voice satellites arrive as satellite_id; only device_id being wired
    would leave every ESPHome satellite unable to answer 'here'."""
    g = await _global(hass)
    kitchen = ar.async_get(hass).async_get_or_create("Kitchen")
    obj = _object(
        hass, name="Coffee Machine", slug="coffee", task_name="Descale", area_id=kitchen.id
    )
    await setup_integration(hass, g, obj)

    _, satellite_id = await _satellite_in(hass, "Kitchen")
    speech = _speech(
        await _ask(hass, INTENT_LIST_TASKS, {"scope": "here"}, satellite_id=satellite_id)
    )

    assert "Descale" in speech


async def test_a_device_with_no_area_says_so(hass: HomeAssistant) -> None:
    """Same principle as the anonymous speaker: no silent widening."""
    g = await _global(hass)
    kitchen = ar.async_get(hass).async_get_or_create("Kitchen")
    obj = _object(
        hass, name="Coffee Machine", slug="coffee", task_name="Descale", area_id=kitchen.id
    )
    await setup_integration(hass, g, obj)

    response = await _ask(hass, INTENT_LIST_TASKS, {"scope": "here"})

    assert response.error_code is not None
    assert "Descale" not in _speech(response)


async def test_a_room_with_nothing_due_is_not_an_error(hass: HomeAssistant) -> None:
    g = await _global(hass)
    kitchen = ar.async_get(hass).async_get_or_create("Kitchen")
    obj = _object(
        hass, name="Coffee Machine", slug="coffee", task_name="Descale", area_id=kitchen.id
    )
    await setup_integration(hass, g, obj)

    device_id, _ = await _satellite_in(hass, "Bathroom")
    response = await _ask(hass, INTENT_LIST_TASKS, {"scope": "here"}, device_id=device_id)

    assert response.error_code is None
    assert "Descale" not in _speech(response)


# ─── the default is unchanged ─────────────────────────────────────────────


async def test_without_a_scope_nothing_changes(hass: HomeAssistant) -> None:
    alice = await hass.auth.async_create_user("Alice")
    g = await _global(hass)
    a = _object(hass, name="Sink", slug="sink", task_name="Descale", responsible_user_id=alice.id)
    b = _object(hass, name="Garage", slug="garage", task_name="Grease Rails")
    await setup_integration(hass, g, a, b)

    speech = _speech(await _ask(hass, INTENT_LIST_TASKS))

    assert "Descale" in speech
    assert "Grease Rails" in speech


@pytest.mark.parametrize("scope", ["nonsense", 42])
async def test_a_bogus_scope_is_rejected(hass: HomeAssistant, scope: Any) -> None:
    """The slot schema is the guard — an unknown scope must not fall through to
    "all", which would answer a question nobody asked."""
    from homeassistant.helpers.intent import InvalidSlotInfo

    g = await _global(hass)
    obj = _object(hass, name="Boiler", slug="boiler", task_name="Service")
    await setup_integration(hass, g, obj)

    with pytest.raises((InvalidSlotInfo, vol.Invalid)):
        await _ask(hass, INTENT_LIST_TASKS, {"scope": scope})


# ─── B7: the room disambiguates instead of giving up ──────────────────────


async def test_the_room_decides_between_two_same_named_tasks(hass: HomeAssistant) -> None:
    """Two "Change Filter" tasks used to produce a read-back-the-candidates
    dead end. Asked from the room holding exactly one of them, it should just
    work — and complete THAT one."""
    g = await _global(hass)
    kitchen = ar.async_get(hass).async_get_or_create("Kitchen")
    cellar = ar.async_get(hass).async_get_or_create("Cellar")
    up = _object(
        hass, name="Range Hood", slug="hood", task_name="Change Filter", area_id=kitchen.id
    )
    down = _object(
        hass, name="Water Softener", slug="softener", task_name="Change Filter", area_id=cellar.id
    )
    await setup_integration(hass, g, up, down)

    device_id, _ = await _satellite_in(hass, "Kitchen")
    response = await _ask(
        hass, INTENT_COMPLETE_TASK, {"name": "change filter"}, device_id=device_id
    )

    assert response.error_code is None, f"still ambiguous: {_speech(response)}"
    assert "Range Hood" in _speech(response)
    assert "Water Softener" not in _speech(response)


async def test_ambiguity_inside_one_room_still_asks(hass: HomeAssistant) -> None:
    """Narrowing must not become guessing: two candidates in the SAME room
    still read back rather than picking one."""
    g = await _global(hass)
    kitchen = ar.async_get(hass).async_get_or_create("Kitchen")
    a = _object(
        hass, name="Range Hood", slug="hood", task_name="Change Filter", area_id=kitchen.id
    )
    b = _object(
        hass, name="Dishwasher", slug="dish", task_name="Change Filter", area_id=kitchen.id
    )
    await setup_integration(hass, g, a, b)

    device_id, _ = await _satellite_in(hass, "Kitchen")
    response = await _ask(
        hass, INTENT_COMPLETE_TASK, {"name": "change filter"}, device_id=device_id
    )

    assert response.error_code is not None
    speech = _speech(response)
    assert "Range Hood" in speech and "Dishwasher" in speech


async def test_without_a_room_ambiguity_behaves_exactly_as_before(
    hass: HomeAssistant,
) -> None:
    g = await _global(hass)
    kitchen = ar.async_get(hass).async_get_or_create("Kitchen")
    cellar = ar.async_get(hass).async_get_or_create("Cellar")
    a = _object(hass, name="Range Hood", slug="hood", task_name="Change Filter", area_id=kitchen.id)
    b = _object(
        hass, name="Water Softener", slug="softener", task_name="Change Filter", area_id=cellar.id
    )
    await setup_integration(hass, g, a, b)

    response = await _ask(hass, INTENT_COMPLETE_TASK, {"name": "change filter"})

    assert response.error_code is not None
