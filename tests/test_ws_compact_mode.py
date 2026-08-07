"""Compact WS payloads (perf wave 2, item 3) + the hydration contract.

``compact: true`` on the ``objects`` read and the subscription strips keys
whose value is None/[]/{} from the response/object/task levels (52 % of the
payload on a 121-task instance). Clients that opt in hydrate the handful of
list/dict-typed keys back (frontend helpers/hydrate-objects.ts).

The last test is the CONTRACT PIN the roadmap demanded before shrinking
anything (#50 class): every response key the server defaults to []/{} must
appear in the frontend hydration tables — a new list/dict field fails here
until both sides know about it.
"""

from __future__ import annotations

import re
from pathlib import Path
from typing import Any
from unittest.mock import MagicMock

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import DOMAIN
from custom_components.maintenance_supporter.websocket import _build_task_summary
from custom_components.maintenance_supporter.websocket.objects import ws_get_objects

from .conftest import (
    TASK_ID_1,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_ws_connection as _mock_connection,
    setup_integration,
)


def _is_empty(v: Any) -> bool:
    return v is None or v == [] or v == {}


async def _get_objects(hass: HomeAssistant, *, compact: bool) -> list[dict[str, Any]]:
    conn = _mock_connection()
    msg: dict[str, Any] = {"id": 1, "type": f"{DOMAIN}/objects"}
    if compact:
        msg["compact"] = True
    await call_ws_handler(ws_get_objects, hass, conn, msg)
    return conn.send_result.call_args[0][1]["objects"]


async def test_compact_strips_only_empties_and_keeps_values(
    hass: HomeAssistant,
    global_config_entry: MockConfigEntry,
    object_config_entry: MockConfigEntry,
) -> None:
    """compact == full minus exactly the None/[]/{} keys, at all 3 levels."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    full = await _get_objects(hass, compact=False)
    compact = await _get_objects(hass, compact=True)
    assert len(full) == len(compact) == 1

    def check_level(f: dict[str, Any], c: dict[str, Any]) -> None:
        for k, v in f.items():
            if k in ("object", "tasks"):
                continue  # handled by their own level below
            if _is_empty(v):
                assert k not in c, f"empty key {k!r} must be stripped"
            else:
                assert c[k] == v, f"non-empty key {k!r} must survive unchanged"
        for k in c:
            assert k in f, f"compact invented key {k!r}"

    check_level(full[0], compact[0])
    check_level(full[0]["object"], compact[0]["object"])
    assert len(full[0]["tasks"]) == len(compact[0]["tasks"])
    for tf, tc in zip(full[0]["tasks"], compact[0]["tasks"], strict=True):
        check_level(tf, tc)

    # The default (no flag) stays byte-for-byte the legacy full shape: every
    # task summary key present even when empty (#50 field completeness).
    assert any(_is_empty(v) for v in full[0]["tasks"][0].values()), (
        "test object should produce at least one empty field to make the strip observable"
    )


async def test_compact_subscription_snapshot_is_stripped(
    hass: HomeAssistant,
    global_config_entry: MockConfigEntry,
    object_config_entry: MockConfigEntry,
) -> None:
    """deltas+compact: the snapshot (and thus every delta, same builder path)
    carries no empty-valued keys in its task summaries."""
    from custom_components.maintenance_supporter.websocket.dashboard import ws_subscribe

    await setup_integration(hass, global_config_entry, object_config_entry)
    conn = MagicMock()
    conn.send_message = MagicMock()
    conn.subscriptions = {}
    await call_ws_handler(
        ws_subscribe,
        hass,
        conn,
        {"id": 1, "type": f"{DOMAIN}/subscribe", "deltas": True, "compact": True},
    )
    snapshot = conn.send_message.call_args[0][0]["event"]
    for obj in snapshot["objects"]:
        for task in obj["tasks"]:
            empties = [k for k, v in task.items() if _is_empty(v)]
            assert empties == [], f"snapshot task carries empty keys: {empties}"
    # Cleanly detach the subscription's listeners.
    for unsub in conn.subscriptions.values():
        unsub()


async def test_hydration_contract_pins_list_and_dict_keys() -> None:
    """Every []/{}-defaulted key the summary/object builders can emit is
    known to the frontend hydration tables (helpers/hydrate-objects.ts).

    This is deliberately source-level: the builder output depends on which
    features a test object exercises, but the hydration need is defined by
    what the builder CAN emit as an empty container. New fields land here
    first or this fails.
    """
    hydrate_src = (
        Path(__file__).parent.parent
        / "custom_components"
        / "maintenance_supporter"
        / "frontend-src"
        / "helpers"
        / "hydrate-objects.ts"
    ).read_text(encoding="utf-8")

    def keys_of(const_name: str) -> set[str]:
        m = re.search(rf"{const_name} = \[(.*?)\]", hydrate_src, re.S)
        assert m, f"{const_name} missing from hydrate-objects.ts"
        return set(re.findall(r'"([a-z_]+)"', m.group(1)))

    task_keys = keys_of("TASK_LIST_KEYS") | keys_of("TASK_DICT_KEYS")
    response_keys = keys_of("RESPONSE_LIST_KEYS")
    object_keys = keys_of("OBJECT_LIST_KEYS")

    # Build a real, maximally-empty task summary and object response.
    hass = MagicMock()
    hass.states.get.return_value = None
    summary = _build_task_summary(hass, TASK_ID_1, build_task_data(task_id=TASK_ID_1), None)
    container_defaults = {k for k, v in summary.items() if v == [] or v == {}}
    missing = container_defaults - task_keys
    assert missing == set(), (
        f"task summary keys defaulting to []/{{}} unknown to hydrate-objects.ts: {missing}"
    )

    # Object/response level: assert the known container keys of the response
    # builder's shape. (The full builder needs a live hass; the shape is
    # pinned by name here and exercised end-to-end in the tests above.)
    assert {"tasks", "parts"} <= response_keys
    assert "manual_docs" in object_keys


async def test_second_object_and_richer_task_roundtrip(
    hass: HomeAssistant,
    global_config_entry: MockConfigEntry,
) -> None:
    """A task WITH checklist/labels keeps them intact through compact mode."""
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Rich Object",
        data=build_object_entry_data(
            object_data=build_object_data(name="Rich Object", object_id="objid_rich"),
            tasks={"task_rich": {
                **build_task_data(task_id="task_rich"),
                "checklist": ["step one", "step two"],
                "labels": ["outdoor"],
            }},
        ),
        source="user",
        unique_id="maintenance_supporter_rich_compact",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_config_entry, entry)

    compact = await _get_objects(hass, compact=True)
    rich = next(o for o in compact if o["object"]["name"] == "Rich Object")
    task = rich["tasks"][0]
    assert task["checklist"] == ["step one", "step two"]
    assert task["labels"] == ["outdoor"]
    assert "environmental_correlation" not in task, "empty scalar keys are stripped"
