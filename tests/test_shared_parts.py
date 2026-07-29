"""One stock pool, several objects drawing on it (#111).

Three robot vacuums and one box of dust bags. Until now the same physical pile
had to be split across three inventories, so no number was the real number,
each object judged its own reorder threshold, and auto-buy produced three
reminders for one purchase.

The pool keeps exactly ONE owner and only the task's *link* crosses objects.
That is what makes one buy task, one low state and one stock sensor fall out
without any deduplication — and it is why deleting the owner is the case worth
testing hardest: the stock exists only in that object's store.
"""

from __future__ import annotations

from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_PARTS,
    CONF_TASK_CONSUMES_PARTS,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    STORES_CACHE_KEY,
)
from custom_components.maintenance_supporter.helpers.parts import sanitize_consumes_parts
from custom_components.maintenance_supporter.helpers.shared_parts import (
    borrowed_part_ids,
    borrowers_of,
)
from custom_components.maintenance_supporter.websocket.tasks_actions import ws_complete_task

from .conftest import (
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_ws_connection,
    setup_integration,
)

TASK_ID = "task_1"
BAGS = "part_bags"


def _part(part_id: str = BAGS, name: str = "Dust bags") -> dict[str, Any]:
    return {
        "id": part_id,
        "name": name,
        "unit": "pcs",
        "reorder_threshold": 2,
        "restock_quantity": 6,
        "auto_buy_task": False,
    }


def _object(
    hass: HomeAssistant,
    *,
    name: str,
    slug: str,
    parts: dict[str, Any] | None = None,
    consumes: list[dict[str, Any]] | None = None,
    created_at: str = "2026-01-01",
) -> MockConfigEntry:
    obj = build_object_data(name=name, object_id=slug)
    obj["created_at"] = created_at
    task: dict[str, Any] = build_task_data(interval_days=30, last_performed="2020-01-01")
    task["name"] = f"Service {name}"
    if consumes is not None:
        task[CONF_TASK_CONSUMES_PARTS] = consumes
    data = build_object_entry_data(object_data=obj, tasks={TASK_ID: task})
    if parts:
        data[CONF_PARTS] = parts
    entry = MockConfigEntry(
        version=1,
        minor_version=4,
        domain=DOMAIN,
        title=name,
        data=data,
        source="user",
        unique_id=f"maintenance_supporter_{slug}",
    )
    entry.add_to_hass(hass)
    return entry


async def _global(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=4,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _stock(hass: HomeAssistant, entry: MockConfigEntry, part_id: str = BAGS) -> float | None:
    store = hass.data.get(STORES_CACHE_KEY, {}).get(entry.entry_id)
    return store.get_part_stock(part_id) if store else None


async def _set_stock(hass: HomeAssistant, entry: MockConfigEntry, value: float, part_id: str = BAGS) -> None:
    store = hass.data[STORES_CACHE_KEY][entry.entry_id]
    store.set_part_stock(part_id, value)
    await store.async_save()


# ─── the link shape ───────────────────────────────────────────────────────


def test_a_link_without_an_entry_stays_byte_identical() -> None:
    """Every link written before this feature had no entry_id, and re-saving a
    task must not start adding one — the diff would touch every task in every
    export."""
    out = sanitize_consumes_parts([{"part_id": BAGS, "quantity": 2}], {BAGS})
    assert out == [{"part_id": BAGS, "quantity": 2}]
    assert "entry_id" not in out[0]


def test_a_foreign_link_is_dropped_without_a_resolver() -> None:
    """Callers that cannot check the other object must not take the link on
    faith."""
    out = sanitize_consumes_parts(
        [{"entry_id": "other", "part_id": BAGS, "quantity": 1}], set()
    )
    assert out == []


def test_a_foreign_link_survives_when_the_pool_really_has_it() -> None:
    out = sanitize_consumes_parts(
        [{"entry_id": "shelf", "part_id": BAGS, "quantity": 3}],
        set(),
        foreign_part_ids=lambda entry_id: {BAGS} if entry_id == "shelf" else None,
    )
    assert out == [{"part_id": BAGS, "quantity": 3, "entry_id": "shelf"}]


def test_a_foreign_link_to_a_part_that_pool_does_not_have_is_dropped() -> None:
    out = sanitize_consumes_parts(
        [{"entry_id": "shelf", "part_id": "nope", "quantity": 1}],
        set(),
        foreign_part_ids=lambda _entry_id: {BAGS},
    )
    assert out == []


def test_the_same_part_id_on_two_objects_is_two_links() -> None:
    """Part ids are uuid4 in general — but the battery fleet mints
    deterministic ones (`batt_aa`), so two objects genuinely can carry the same
    id. Deduping by id alone would silently drop one of the two."""
    out = sanitize_consumes_parts(
        [
            {"part_id": "batt_aa", "quantity": 1},
            {"entry_id": "fleet", "part_id": "batt_aa", "quantity": 4},
        ],
        {"batt_aa"},
        foreign_part_ids=lambda _e: {"batt_aa"},
    )
    assert len(out) == 2
    assert {link.get("entry_id") for link in out} == {None, "fleet"}


# ─── consuming across objects ─────────────────────────────────────────────


async def test_completing_a_task_decrements_another_objects_pool(hass: HomeAssistant) -> None:
    """The whole point of the request."""
    g = await _global(hass)
    shelf = _object(hass, name="Shelf", slug="shelf", parts={BAGS: _part()})
    vacuum = _object(
        hass,
        name="Vacuum",
        slug="vacuum",
        consumes=[{"entry_id": shelf.entry_id, "part_id": BAGS, "quantity": 2}],
    )
    await setup_integration(hass, g, shelf, vacuum)
    await _set_stock(hass, shelf, 10)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_complete_task,
        hass,
        conn,
        {"id": 1, "type": f"{DOMAIN}/task/complete", "entry_id": vacuum.entry_id, "task_id": TASK_ID},
    )
    await hass.async_block_till_done()

    assert _stock(hass, shelf) == 8, "the pool was not decremented"


async def test_two_objects_draw_on_one_pool(hass: HomeAssistant) -> None:
    """Two vacuums, one box: the second completion continues from where the
    first left off rather than from a private copy."""
    g = await _global(hass)
    shelf = _object(hass, name="Shelf", slug="shelf", parts={BAGS: _part()})
    link = [{"entry_id": shelf.entry_id, "part_id": BAGS, "quantity": 1}]
    one = _object(hass, name="Vacuum One", slug="v1", consumes=link)
    two = _object(hass, name="Vacuum Two", slug="v2", consumes=link)
    await setup_integration(hass, g, shelf, one, two)
    await _set_stock(hass, shelf, 5)

    for entry in (one, two):
        conn = make_ws_connection()
        await call_ws_handler(
            ws_complete_task,
            hass,
            conn,
            {"id": 1, "type": f"{DOMAIN}/task/complete", "entry_id": entry.entry_id, "task_id": TASK_ID},
        )
        await hass.async_block_till_done()

    assert _stock(hass, shelf) == 3


async def test_an_own_part_still_works_unchanged(hass: HomeAssistant) -> None:
    g = await _global(hass)
    obj = _object(
        hass,
        name="Solo",
        slug="solo",
        parts={BAGS: _part()},
        consumes=[{"part_id": BAGS, "quantity": 2}],
    )
    await setup_integration(hass, g, obj)
    await _set_stock(hass, obj, 7)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_complete_task,
        hass,
        conn,
        {"id": 1, "type": f"{DOMAIN}/task/complete", "entry_id": obj.entry_id, "task_id": TASK_ID},
    )
    await hass.async_block_till_done()

    assert _stock(hass, obj) == 5


async def test_a_link_to_a_vanished_object_is_surfaced_not_swallowed(
    hass: HomeAssistant,
) -> None:
    """The failure that must never be silent: the task completes, nothing is
    decremented, and today's code would simply `continue`."""
    from homeassistant.helpers import issue_registry as ir

    g = await _global(hass)
    vacuum = _object(
        hass,
        name="Vacuum",
        slug="vacuum",
        consumes=[{"entry_id": "01ABCDEF_GONE", "part_id": BAGS, "quantity": 1}],
    )
    await setup_integration(hass, g, vacuum)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_complete_task,
        hass,
        conn,
        {"id": 1, "type": f"{DOMAIN}/task/complete", "entry_id": vacuum.entry_id, "task_id": TASK_ID},
    )
    await hass.async_block_till_done()

    issues = ir.async_get(hass).issues
    assert any("broken_part_link" in issue_id for _domain, issue_id in issues), (
        "a dead part link completed silently"
    )


# ─── deleting the owner ───────────────────────────────────────────────────


async def test_deleting_the_owner_moves_the_pool_to_a_borrower(hass: HomeAssistant) -> None:
    """The question this feature lives or dies on: the stock exists only in the
    owner's store, and that store is destroyed with the entry."""
    g = await _global(hass)
    shelf = _object(hass, name="Shelf", slug="shelf", parts={BAGS: _part()}, created_at="2026-01-01")
    vacuum = _object(
        hass,
        name="Vacuum",
        slug="vacuum",
        consumes=[{"entry_id": shelf.entry_id, "part_id": BAGS, "quantity": 1}],
        created_at="2026-02-01",
    )
    await setup_integration(hass, g, shelf, vacuum)
    await _set_stock(hass, shelf, 9)

    await hass.config_entries.async_remove(shelf.entry_id)
    await hass.async_block_till_done()

    survivor = hass.config_entries.async_get_entry(vacuum.entry_id)
    assert survivor is not None
    parts = survivor.data.get(CONF_PARTS) or {}
    assert BAGS in parts, "the pool was not inherited"
    assert parts[BAGS]["name"] == "Dust bags"

    link = (survivor.data[CONF_TASKS][TASK_ID][CONF_TASK_CONSUMES_PARTS])[0]
    assert "entry_id" not in link, "the link still points at the deleted object"
    assert link["part_id"] == BAGS


async def test_the_inherited_pool_keeps_its_stock(hass: HomeAssistant) -> None:
    """Moving the definition without the number would be worse than losing
    both — the shelf would read empty and quietly order nothing."""
    g = await _global(hass)
    shelf = _object(hass, name="Shelf", slug="shelf", parts={BAGS: _part()})
    vacuum = _object(
        hass,
        name="Vacuum",
        slug="vacuum",
        consumes=[{"entry_id": shelf.entry_id, "part_id": BAGS, "quantity": 1}],
        created_at="2026-02-01",
    )
    await setup_integration(hass, g, shelf, vacuum)
    await _set_stock(hass, shelf, 9)

    await hass.config_entries.async_remove(shelf.entry_id)
    await hass.async_block_till_done()

    assert _stock(hass, vacuum) == 9


async def test_the_user_is_told_where_the_pool_went(hass: HomeAssistant) -> None:
    from homeassistant.helpers import issue_registry as ir

    g = await _global(hass)
    shelf = _object(hass, name="Shelf", slug="shelf", parts={BAGS: _part()})
    vacuum = _object(
        hass,
        name="Vacuum",
        slug="vacuum",
        consumes=[{"entry_id": shelf.entry_id, "part_id": BAGS, "quantity": 1}],
        created_at="2026-02-01",
    )
    await setup_integration(hass, g, shelf, vacuum)

    await hass.config_entries.async_remove(shelf.entry_id)
    await hass.async_block_till_done()

    issues = ir.async_get(hass).issues
    assert any("shared_parts_moved" in issue_id for _domain, issue_id in issues), (
        "the pool moved without telling anyone"
    )


async def test_the_other_borrowers_follow_the_pool(hass: HomeAssistant) -> None:
    """Two borrowers: one inherits, and the other must be repointed at it —
    otherwise the second vacuum keeps consuming into nothing."""
    g = await _global(hass)
    shelf = _object(hass, name="Shelf", slug="shelf", parts={BAGS: _part()})
    link = [{"entry_id": shelf.entry_id, "part_id": BAGS, "quantity": 1}]
    first = _object(hass, name="Vacuum One", slug="v1", consumes=link, created_at="2026-02-01")
    second = _object(hass, name="Vacuum Two", slug="v2", consumes=link, created_at="2026-03-01")
    await setup_integration(hass, g, shelf, first, second)
    await _set_stock(hass, shelf, 8)

    await hass.config_entries.async_remove(shelf.entry_id)
    await hass.async_block_till_done()

    heir = hass.config_entries.async_get_entry(first.entry_id)
    other = hass.config_entries.async_get_entry(second.entry_id)
    assert heir is not None and other is not None
    assert BAGS in (heir.data.get(CONF_PARTS) or {}), "the oldest borrower did not inherit"

    other_link = (other.data[CONF_TASKS][TASK_ID][CONF_TASK_CONSUMES_PARTS])[0]
    assert other_link.get("entry_id") == first.entry_id, "the second borrower was left dangling"


async def test_the_heir_is_the_oldest_borrower_not_dict_order(hass: HomeAssistant) -> None:
    """Whoever inherits, it must not depend on iteration order."""
    g = await _global(hass)
    shelf = _object(hass, name="Shelf", slug="shelf", parts={BAGS: _part()})
    link = [{"entry_id": shelf.entry_id, "part_id": BAGS, "quantity": 1}]
    younger = _object(hass, name="Younger", slug="younger", consumes=link, created_at="2026-05-01")
    older = _object(hass, name="Older", slug="older", consumes=link, created_at="2026-02-01")
    await setup_integration(hass, g, shelf, younger, older)

    assert [e.entry_id for e in borrowers_of(hass, shelf.entry_id)][0] == older.entry_id


async def test_deleting_an_owner_nobody_borrows_from_changes_nothing(
    hass: HomeAssistant,
) -> None:
    g = await _global(hass)
    shelf = _object(hass, name="Shelf", slug="shelf", parts={BAGS: _part()})
    other = _object(hass, name="Unrelated", slug="unrelated")
    await setup_integration(hass, g, shelf, other)

    await hass.config_entries.async_remove(shelf.entry_id)
    await hass.async_block_till_done()

    survivor = hass.config_entries.async_get_entry(other.entry_id)
    assert survivor is not None
    assert not (survivor.data.get(CONF_PARTS) or {}), "an unrelated object inherited a pool"


async def test_only_the_borrowed_parts_move(hass: HomeAssistant) -> None:
    """A deleted object's private parts are its own business — inheriting them
    would silently hand somebody an inventory they never asked for."""
    g = await _global(hass)
    shelf = _object(
        hass,
        name="Shelf",
        slug="shelf",
        parts={BAGS: _part(), "private": _part("private", "Private thing")},
    )
    vacuum = _object(
        hass,
        name="Vacuum",
        slug="vacuum",
        consumes=[{"entry_id": shelf.entry_id, "part_id": BAGS, "quantity": 1}],
        created_at="2026-02-01",
    )
    await setup_integration(hass, g, shelf, vacuum)

    await hass.config_entries.async_remove(shelf.entry_id)
    await hass.async_block_till_done()

    survivor = hass.config_entries.async_get_entry(vacuum.entry_id)
    assert survivor is not None
    parts = survivor.data.get(CONF_PARTS) or {}
    assert BAGS in parts
    assert "private" not in parts


# ─── the bookkeeping helpers ──────────────────────────────────────────────


async def test_borrowed_part_ids_reports_only_what_is_linked(hass: HomeAssistant) -> None:
    g = await _global(hass)
    shelf = _object(
        hass, name="Shelf", slug="shelf", parts={BAGS: _part(), "other": _part("other", "Other")}
    )
    vacuum = _object(
        hass,
        name="Vacuum",
        slug="vacuum",
        consumes=[{"entry_id": shelf.entry_id, "part_id": BAGS, "quantity": 1}],
    )
    await setup_integration(hass, g, shelf, vacuum)

    assert borrowed_part_ids(hass, shelf.entry_id) == {BAGS}


@pytest.mark.parametrize("links", [[], None, [{"part_id": BAGS, "quantity": 1}]])
async def test_no_borrowers_without_a_foreign_link(hass: HomeAssistant, links: Any) -> None:
    g = await _global(hass)
    shelf = _object(hass, name="Shelf", slug="shelf", parts={BAGS: _part()})
    vacuum = _object(hass, name="Vacuum", slug="vacuum", consumes=links)
    await setup_integration(hass, g, shelf, vacuum)

    assert borrowers_of(hass, shelf.entry_id) == []


# ─── the link has to survive the lifecycle operations ─────────────────────


async def test_replacing_a_borrower_keeps_it_drawing_on_the_pool(hass: HomeAssistant) -> None:
    """Replacing a worn-out vacuum must not quietly disconnect it from the
    shared shelf: the pool belongs to another object and is untouched by this
    object being replaced."""
    from custom_components.maintenance_supporter.websocket.objects import ws_replace_object

    g = await _global(hass)
    shelf = _object(hass, name="Shelf", slug="shelf", parts={BAGS: _part()})
    vacuum = _object(
        hass,
        name="Vacuum",
        slug="vacuum",
        consumes=[{"entry_id": shelf.entry_id, "part_id": BAGS, "quantity": 2}],
    )
    await setup_integration(hass, g, shelf, vacuum)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_replace_object,
        hass,
        conn,
        {
            "id": 1,
            "type": f"{DOMAIN}/object/replace",
            "entry_id": vacuum.entry_id,
            "name": "Vacuum Mk2",  # a successor needs its own name (unique_id)
        },
    )
    await hass.async_block_till_done()
    assert conn.send_error.call_count == 0, conn.send_error.call_args
    payload = conn.send_result.call_args[0][1]

    successor = hass.config_entries.async_get_entry(payload["entry_id"])
    assert successor is not None
    links = [
        link
        for task in (successor.data.get(CONF_TASKS) or {}).values()
        for link in (task.get(CONF_TASK_CONSUMES_PARTS) or [])
    ]
    assert links, "the successor lost its part link entirely"
    assert links[0].get("entry_id") == shelf.entry_id
    assert links[0]["part_id"] == BAGS


# ─── the schema, not just the handler ─────────────────────────────────────


def _complete_schema():
    """The voluptuous schema the WS decorator actually enforces.

    Home Assistant hangs it on the handler as ``_ws_schema`` (already extended
    with the base id/type message schema), and that object — not the handler
    body — is what a real WebSocket message meets first.
    """
    from custom_components.maintenance_supporter.websocket import tasks_actions

    return tasks_actions.ws_complete_task._ws_schema


def test_the_completion_schema_itself_accepts_a_shared_pool() -> None:
    """`call_ws_handler` bypasses the decorator, so every handler test in this
    file would pass with a schema that rejects the payload outright — which is
    exactly what happened: `used_parts` declared only part_id and quantity, and
    voluptuous defaults to PREVENT_EXTRA, so completing a task that draws on
    another object's pool failed with `invalid_format` before the handler ran.

    This asserts against the schema object directly, which is the only thing
    that sees what the real WebSocket sees.
    """
    schema = _complete_schema()
    payload = {
        "id": 1,
        "type": f"{DOMAIN}/task/complete",
        "entry_id": "e1",
        "task_id": TASK_ID,
        "used_parts": [{"entry_id": "shelf", "part_id": BAGS, "quantity": 2}],
    }
    validated = schema(payload)
    assert validated["used_parts"][0]["entry_id"] == "shelf"


def test_the_completion_schema_still_accepts_an_own_part() -> None:
    schema = _complete_schema()
    validated = schema(
        {
            "id": 1,
            "type": f"{DOMAIN}/task/complete",
            "entry_id": "e1",
            "task_id": TASK_ID,
            "used_parts": [{"part_id": BAGS, "quantity": 1}],
        }
    )
    assert "entry_id" not in validated["used_parts"][0]


def test_the_completion_schema_still_refuses_junk() -> None:
    """Widening the schema must not have opened it up in general."""
    import voluptuous as vol

    schema = _complete_schema()
    with pytest.raises(vol.Invalid):
        schema(
            {
                "id": 1,
                "type": f"{DOMAIN}/task/complete",
                "entry_id": "e1",
                "task_id": TASK_ID,
                "used_parts": [{"part_id": BAGS, "quantity": 1, "nonsense": True}],
            }
        )


async def test_completing_with_an_explicit_shared_selection(hass: HomeAssistant) -> None:
    """#99 semantics across objects: an explicit selection REPLACES the task's
    fixed links, and it may name another object's pool."""
    g = await _global(hass)
    shelf = _object(hass, name="Shelf", slug="shelf", parts={BAGS: _part()})
    vacuum = _object(hass, name="Vacuum", slug="vacuum")
    await setup_integration(hass, g, shelf, vacuum)
    await _set_stock(hass, shelf, 6)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_complete_task,
        hass,
        conn,
        {
            "id": 1,
            "type": f"{DOMAIN}/task/complete",
            "entry_id": vacuum.entry_id,
            "task_id": TASK_ID,
            "used_parts": [{"entry_id": shelf.entry_id, "part_id": BAGS, "quantity": 3}],
        },
    )
    await hass.async_block_till_done()

    assert _stock(hass, shelf) == 3


# ─── task/update validated nothing ────────────────────────────────────────


async def test_updating_a_task_refuses_a_link_to_a_missing_object(
    hass: HomeAssistant,
) -> None:
    """`task/create` sanitised part links and `task/update` did not — it copied
    them verbatim out of the message via its field map. So an edit could store
    a link to an object (or, before #111, just a part) that does not exist, and
    nothing complained: the consume path simply skipped it.

    Found by driving the real WebSocket API rather than the handler, which is
    also the only way it could be found — the two write paths look identical
    from the outside.
    """
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_update_task

    g = await _global(hass)
    obj = _object(hass, name="Solo", slug="solo", parts={BAGS: _part()})
    await setup_integration(hass, g, obj)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_task,
        hass,
        conn,
        {
            "id": 1,
            "type": f"{DOMAIN}/task/update",
            "entry_id": obj.entry_id,
            "task_id": TASK_ID,
            "consumes_parts": [
                {"entry_id": "01DEADBEEFDEADBEEFDEADBEEF", "part_id": BAGS, "quantity": 1}
            ],
        },
    )
    await hass.async_block_till_done()

    stored = hass.config_entries.async_get_entry(obj.entry_id)
    assert stored is not None
    links = stored.data[CONF_TASKS][TASK_ID].get(CONF_TASK_CONSUMES_PARTS) or []
    assert links == [], f"an unresolvable link was persisted: {links}"


async def test_updating_a_task_refuses_a_part_the_object_does_not_have(
    hass: HomeAssistant,
) -> None:
    """The same hole for plain own-object links, which predates #111."""
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_update_task

    g = await _global(hass)
    obj = _object(hass, name="Solo", slug="solo", parts={BAGS: _part()})
    await setup_integration(hass, g, obj)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_task,
        hass,
        conn,
        {
            "id": 1,
            "type": f"{DOMAIN}/task/update",
            "entry_id": obj.entry_id,
            "task_id": TASK_ID,
            "consumes_parts": [{"part_id": "no_such_part", "quantity": 1}],
        },
    )
    await hass.async_block_till_done()

    stored = hass.config_entries.async_get_entry(obj.entry_id)
    assert stored is not None
    assert (stored.data[CONF_TASKS][TASK_ID].get(CONF_TASK_CONSUMES_PARTS) or []) == []


async def test_updating_a_task_keeps_a_valid_shared_link(hass: HomeAssistant) -> None:
    """Tightening the write path must not break the feature it guards."""
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_update_task

    g = await _global(hass)
    shelf = _object(hass, name="Shelf", slug="shelf", parts={BAGS: _part()})
    vacuum = _object(hass, name="Vacuum", slug="vacuum")
    await setup_integration(hass, g, shelf, vacuum)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_task,
        hass,
        conn,
        {
            "id": 1,
            "type": f"{DOMAIN}/task/update",
            "entry_id": vacuum.entry_id,
            "task_id": TASK_ID,
            "consumes_parts": [{"entry_id": shelf.entry_id, "part_id": BAGS, "quantity": 4}],
        },
    )
    await hass.async_block_till_done()

    stored = hass.config_entries.async_get_entry(vacuum.entry_id)
    assert stored is not None
    links = stored.data[CONF_TASKS][TASK_ID][CONF_TASK_CONSUMES_PARTS]
    assert links == [{"part_id": BAGS, "quantity": 4, "entry_id": shelf.entry_id}]


async def test_clearing_the_links_on_update_still_works(hass: HomeAssistant) -> None:
    """An empty list means "no parts", and must not be mistaken for "unchanged"."""
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_update_task

    g = await _global(hass)
    obj = _object(
        hass,
        name="Solo",
        slug="solo",
        parts={BAGS: _part()},
        consumes=[{"part_id": BAGS, "quantity": 1}],
    )
    await setup_integration(hass, g, obj)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_task,
        hass,
        conn,
        {
            "id": 1,
            "type": f"{DOMAIN}/task/update",
            "entry_id": obj.entry_id,
            "task_id": TASK_ID,
            "consumes_parts": [],
        },
    )
    await hass.async_block_till_done()

    stored = hass.config_entries.async_get_entry(obj.entry_id)
    assert stored is not None
    assert (stored.data[CONF_TASKS][TASK_ID].get(CONF_TASK_CONSUMES_PARTS) or []) == []
